import crypto from 'crypto';
import express from 'express';
import { Firm } from './models/Firm.js';
import { Client } from './models/Client.js';
import { Request } from './models/Request.js';
import { Document } from './models/Document.js';

const router = express.Router();

function getJwtSecret() {
  return process.env.JWT_SECRET || 'clarioloop_dev_jwt_secret_change_in_prod';
}

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + pad;
  return Buffer.from(b64, 'base64').toString('utf8');
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function signAdminToken(email) {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(
    JSON.stringify({
      sub: 'admin-root',
      role: 'admin',
      email,
      iat: now,
      exp: now + 12 * 60 * 60
    })
  );
  const data = `${header}.${payload}`;
  const sig = crypto
    .createHmac('sha256', getJwtSecret())
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${data}.${sig}`;
}

export function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const data = `${header}.${payload}`;
  const expectedSig = crypto
    .createHmac('sha256', getJwtSecret())
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (!safeEqual(signature, expectedSig)) return null;

  try {
    const decoded = JSON.parse(base64UrlDecode(payload));
    const now = Math.floor(Date.now() / 1000);
    if (!decoded.exp || decoded.exp < now) return null;
    if (decoded.role !== 'admin') return null;
    return decoded;
  } catch {
    return null;
  }
}

export function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) {
    return res.status(401).json({ error: 'Admin authentication token required.' });
  }
  const decoded = verifyAdminToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired admin session.' });
  }
  req.admin = decoded;
  next();
}

router.post('/login', (req, res) => {
  const { email = '', password = '' } = req.body || {};
  const expectedEmail = (process.env.VITE_ADMIN_EMAIL || 'admin@clarioloop.com').trim().toLowerCase();
  const expectedPassword = process.env.VITE_ADMIN_PASSWORD || 'ClarioOwner@2026';

  const normalizedEmail = String(email).trim().toLowerCase();
  if (!safeEqual(normalizedEmail, expectedEmail) || !safeEqual(password, expectedPassword)) {
    return res.status(401).json({ error: 'Invalid admin email or password.' });
  }

  const token = signAdminToken(expectedEmail);
  return res.json({
    token,
    user: {
      id: 'admin-root',
      role: 'admin',
      name: 'Root Platform Admin',
      email: expectedEmail,
      isKycVerified: true,
      avatarInitials: 'AD'
    }
  });
});

router.get('/session', requireAdminAuth, (req, res) => {
  res.json({ authenticated: true, admin: req.admin });
});

router.get('/overview', requireAdminAuth, async (req, res) => {
  try {
    const [firmsCount, clientsCount, requestsCount, documentsCount] = await Promise.all([
      Firm.countDocuments(),
      Client.countDocuments(),
      Request.countDocuments(),
      Document.countDocuments()
    ]);
    res.json({ firmsCount, clientsCount, requestsCount, documentsCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load admin overview.' });
  }
});

export default router;
