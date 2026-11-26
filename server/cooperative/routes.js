import express from 'express';
import multer from 'multer';
import { PRODUCT_CATALOGUE, SEED_CHECKLIST_TEMPLATES } from './templates.js';
import {
  assertTenantAndBranchAccess,
  calculateChecklistCompleteness,
  generateUploadToken,
  sha256Hex,
  validateStatusTransition,
  validateUploadedBuffer,
} from './engine.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// In-memory P0 operational store (mirrors normalized multi-tenant schema with tenant_id & branch_id)
const tenantId = 'tenant-coop-1';
const state = {
  institution: {
    tenantId,
    legalName: 'Sahyadri Urban Co-operative Credit Society Ltd',
    type: 'CREDIT_SOCIETY',
    registrationNumber: 'RCS/KA/CR-4012/1998',
    licenceDetails: 'Karnataka Souharda / Cooperative Societies Act Reg.',
    address: 'MG Road, Belagavi, Karnataka 590001',
    policyVersion: 'v1.0',
    aadhaarOptional: true,
    aiSuggestionsEnabled: false,
  },
  branches: [
    { id: 'br-1', tenantId, code: 'BR-001', name: 'Belagavi Main Branch', location: 'Belagavi HQ', status: 'ACTIVE' },
    { id: 'br-2', tenantId, code: 'BR-002', name: 'Gokak Taluk Branch', location: 'Gokak', status: 'ACTIVE' },
    { id: 'br-3', tenantId, code: 'BR-003', name: 'Athani Rural Branch', location: 'Athani', status: 'ACTIVE' },
  ],
  products: PRODUCT_CATALOGUE.map((p, i) => ({ id: `prod-${i + 1}`, tenantId, ...p })),
  templates: SEED_CHECKLIST_TEMPLATES,
  members: Array.from({ length: 20 }, (_, idx) => {
    const num = idx + 1;
    const branchId = `br-${(idx % 3) + 1}`;
    const isBiz = num % 5 === 0;
    return {
      id: `mem-${num}`,
      tenantId,
      branchId,
      memberNumber: `MEM-${1000 + num}`,
      memberType: isBiz ? 'BUSINESS' : 'INDIVIDUAL',
      fullName: isBiz ? `Shree Ganesh Agro Traders #${num}` : `Member Demo User ${num}`,
      fatherOrSpouseName: isBiz ? 'Managing Partner: Arvind Rao' : `Parent / Spouse ${num}`,
      dobOrIncorpDate: isBiz ? '2016-04-12' : `198${num % 9}-05-14`,
      address: `Ward ${num}, Karnataka`,
      mobile: `+9198450${10000 + num}`,
      email: `member${num}@example.in`,
      occupation: isBiz ? 'Agri Trading' : 'Farmer',
      panOrForm60: num % 4 === 0 ? 'FORM_60' : `ABCDE${1000 + num}F`,
      kycStatus: num <= 6 ? 'VERIFIED' : num <= 14 ? 'IN_REVIEW' : 'PENDING',
      membershipStatus: num <= 15 ? 'ACTIVE' : 'APPLIED',
      riskCategory: num % 7 === 0 ? 'MEDIUM' : 'LOW',
    };
  }),
  checklistItems: [
    {
      id: 'item-1',
      tenantId,
      branchId: 'br-1',
      memberId: 'mem-1',
      title: 'Officially Valid ID Proof (PAN / Voter ID / Passport / Driving Licence)',
      requirement: 'MANDATORY',
      status: 'UNDER_REVIEW',
      lastReason: null,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'item-2',
      tenantId,
      branchId: 'br-1',
      memberId: 'mem-2',
      title: 'PAN Card or Form 60 Declaration',
      requirement: 'MANDATORY',
      status: 'REQUESTED',
      lastReason: null,
      updatedAt: new Date().toISOString(),
    },
  ],
  requests: [],
  documents: [],
  auditEvents: [
    {
      id: 'aud-1',
      tenantId,
      branchId: 'br-1',
      actorUserId: 'admin-1',
      action: 'SYSTEM_SEED_INITIALIZED',
      recordType: 'INSTITUTION',
      recordId: tenantId,
      reason: 'Seeded 4 institution types, 3 branches, 20 members, and 7 templates',
      createdAt: new Date().toISOString(),
    },
  ],
};

function appendAudit(evt) {
  const entry = {
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    ...evt,
  };
  state.auditEvents.unshift(entry);
  return entry;
}

function getActorFromHeaders(req) {
  return {
    userId: String(req.headers['x-user-id'] || 'verifier-a'),
    tenantId: String(req.headers['x-tenant-id'] || tenantId),
    branchId: req.headers['x-branch-id'] ? String(req.headers['x-branch-id']) : null,
    role: String(req.headers['x-user-role'] || 'INSTITUTION_ADMIN'),
  };
}

router.get('/institution', (req, res) => {
  const actor = getActorFromHeaders(req);
  assertTenantAndBranchAccess(actor, state.institution.tenantId);
  res.json({
    institution: state.institution,
    branches: state.branches,
    products: state.products,
    templates: state.templates,
  });
});

router.patch('/institution/product', (req, res) => {
  try {
    const actor = getActorFromHeaders(req);
    assertTenantAndBranchAccess(actor, state.institution.tenantId);
    const { productId, enabled } = req.body;
    const product = state.products.find((p) => p.id === productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const before = { enabled: product.enabled };
    product.enabled = Boolean(enabled);
    appendAudit({
      tenantId: actor.tenantId,
      branchId: actor.branchId,
      actorUserId: actor.userId,
      action: 'PRODUCT_TOGGLED',
      recordType: 'PRODUCT',
      recordId: product.id,
      beforeValue: before,
      afterValue: { enabled: product.enabled },
      reason: 'Product catalogue updated',
    });
    res.json({ product });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

router.get('/members', (req, res) => {
  try {
    const actor = getActorFromHeaders(req);
    assertTenantAndBranchAccess(actor, state.institution.tenantId);
    const visible = state.members.filter((m) => {
      try {
        assertTenantAndBranchAccess(actor, m.tenantId, m.branchId);
        return true;
      } catch {
        return false;
      }
    });
    res.json({ members: visible });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

router.post('/requests', (req, res) => {
  try {
    const actor = getActorFromHeaders(req);
    const { memberId, itemIds } = req.body;
    const member = state.members.find((m) => m.id === memberId);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    assertTenantAndBranchAccess(actor, member.tenantId, member.branchId);

    const { rawToken, tokenHash } = generateUploadToken();
    const expiresAt = new Date(Date.now() + 72 * 3600 * 1000).toISOString();

    for (const itemId of itemIds || []) {
      const item = state.checklistItems.find((i) => i.id === itemId);
      if (item && item.status === 'NOT_REQUESTED') {
        validateStatusTransition({ fromStatus: item.status, toStatus: 'REQUESTED', actorUserId: actor.userId });
        item.status = 'REQUESTED';
      }
    }

    const docReq = {
      id: `req-${Date.now()}`,
      tenantId: actor.tenantId,
      branchId: member.branchId,
      memberId: member.id,
      tokenHash,
      expiresAt,
      itemIds: itemIds || [],
      status: 'OPEN',
    };
    state.requests.push(docReq);
    appendAudit({
      tenantId: actor.tenantId,
      branchId: member.branchId,
      actorUserId: actor.userId,
      action: 'DOCUMENT_REQUEST_CREATED',
      recordType: 'DOCUMENT_REQUEST',
      recordId: docReq.id,
      afterValue: { memberId: member.id, itemCount: docReq.itemIds.length },
    });

    res.status(201).json({ request: docReq, uploadToken: rawToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/upload/:token', (req, res) => {
  const tokenHash = sha256Hex(req.params.token);
  const found = state.requests.find((r) => r.tokenHash === tokenHash);
  if (!found) return res.status(404).json({ error: 'Invalid upload token' });
  if (new Date(found.expiresAt).getTime() < Date.now()) {
    return res.status(410).json({ error: 'Upload token expired' });
  }
  const member = state.members.find((m) => m.id === found.memberId);
  const items = state.checklistItems.filter((i) => found.itemIds.includes(i.id));
  res.json({
    institutionName: state.institution.legalName,
    memberName: member?.fullName,
    expiresAt: found.expiresAt,
    items,
  });
});

router.post('/upload/:token', upload.single('file'), (req, res) => {
  try {
    const tokenHash = sha256Hex(req.params.token);
    const found = state.requests.find((r) => r.tokenHash === tokenHash);
    if (!found) return res.status(404).json({ error: 'Invalid upload token' });
    if (!req.file) return res.status(400).json({ error: 'File is required' });

    const validated = validateUploadedBuffer(req.file.buffer);
    const dup = state.documents.find(
      (d) => d.memberId === found.memberId && d.sha256Hash === validated.sha256Hash
    );
    if (dup) return res.status(409).json({ error: 'Duplicate file detected by SHA-256 hash' });

    const itemId = String(req.body.checklistItemId || found.itemIds[0]);
    const item = state.checklistItems.find((i) => i.id === itemId);
    if (!item) return res.status(404).json({ error: 'Checklist item not found' });

    validateStatusTransition({
      fromStatus: item.status,
      toStatus: 'RECEIVED',
      actorUserId: found.memberId,
      reason: 'Member portal upload',
    });
    item.status = 'UNDER_REVIEW';
    item.updatedAt = new Date().toISOString();

    const doc = {
      id: `doc-${Date.now()}`,
      tenantId: found.tenantId,
      branchId: found.branchId,
      memberId: found.memberId,
      checklistItemId: item.id,
      originalFilename: req.file.originalname,
      ...validated,
      status: 'UNDER_REVIEW',
    };
    state.documents.push(doc);

    appendAudit({
      tenantId: found.tenantId,
      branchId: found.branchId,
      actorUserId: null,
      action: 'MEMBER_DOCUMENT_UPLOADED',
      recordType: 'DOCUMENT',
      recordId: doc.id,
      afterValue: { filename: doc.originalFilename, sha256Hash: doc.sha256Hash },
    });

    res.status(201).json({ document: doc, status: 'UNDER_REVIEW' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/review', (req, res) => {
  try {
    const actor = getActorFromHeaders(req);
    const { itemId, decision, reason } = req.body;
    const item = state.checklistItems.find((i) => i.id === itemId);
    if (!item) return res.status(404).json({ error: 'Checklist item not found' });

    assertTenantAndBranchAccess(actor, item.tenantId, item.branchId);
    const transition = validateStatusTransition({
      fromStatus: item.status,
      toStatus: decision,
      actorUserId: actor.userId,
      reason,
    });

    item.status = transition.toStatus;
    item.lastReason = transition.reason;
    item.updatedAt = transition.transitionedAt;

    const memberItems = state.checklistItems.filter((i) => i.memberId === item.memberId);
    const completenessPct = calculateChecklistCompleteness(memberItems);

    appendAudit({
      tenantId: actor.tenantId,
      branchId: item.branchId,
      actorUserId: actor.userId,
      action: `CHECKLIST_ITEM_${transition.toStatus}`,
      recordType: 'CHECKLIST_ITEM',
      recordId: item.id,
      beforeValue: { status: transition.fromStatus },
      afterValue: { status: transition.toStatus, completenessPct },
      reason: transition.reason,
    });

    res.json({ item, completenessPct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/audit', (req, res) => {
  const actor = getActorFromHeaders(req);
  assertTenantAndBranchAccess(actor, state.institution.tenantId);
  res.json({ auditEvents: state.auditEvents });
});

router.get('/reports/export', (req, res) => {
  const actor = getActorFromHeaders(req);
  assertTenantAndBranchAccess(actor, state.institution.tenantId);
  const type = String(req.query.type || 'completeness');

  appendAudit({
    tenantId: actor.tenantId,
    branchId: actor.branchId,
    actorUserId: actor.userId,
    action: 'REPORT_EXPORTED',
    recordType: 'REPORT',
    recordId: type,
    reason: 'Authorized staff CSV export',
  });

  const csvLines = [
    'MemberNumber,FullName,MemberType,BranchId,KYCStatus',
    ...state.members.map((m) => `${m.memberNumber},"${m.fullName}",${m.memberType},${m.branchId},${m.kycStatus}`),
  ];
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="clarioloop_coop_${type}.csv"`);
  res.send(csvLines.join('\n'));
});

export default router;
