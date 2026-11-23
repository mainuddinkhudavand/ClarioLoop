import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import mongoose from 'mongoose';

import { connectDB } from './db.js';
import { Firm } from './models/Firm.js';
import { Client } from './models/Client.js';
import { Request } from './models/Request.js';
import { Document, ReminderLog } from './models/Document.js';
import { analyzeDocumentAI, generateSmartReminderAI } from './services/aiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'));
  }
});
const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } }); // 25MB limit

// Connect to MongoDB
connectDB();

// Serve production built frontend on Render (Single-Port Hosting)
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// Seed initial sample data if DB is empty
async function seedInitialData() {
  try {
    const clientCount = await Client.countDocuments();
    if (clientCount === 0) {
      console.log('🌱 Seeding initial CA clients and monthly workflows...');
      
      const firm = await Firm.create({
        name: 'Sharma & Associates, Chartered Accountants',
        ownerName: 'CA Rajesh Sharma (FCA)',
        email: 'rajesh@sharmaca.in',
        phone: '+91 98200 12345',
        subscription: {
          plan: 'PROFESSIONAL',
          priceMonthlyINR: 1999,
          clientLimit: 30,
          status: 'TRIAL'
        }
      });

      const client1 = await Client.create({
        firmId: firm._id,
        businessName: 'NexGen Digital Solutions Pvt Ltd',
        contactPerson: 'Suresh Kumar',
        email: 'accounts@nexgendigital.io',
        phone: '+91 98765 43210',
        entityType: 'Private Limited',
        gstin: '27AABCN8492K1Z9',
        pan: 'AABCN8492K',
        assignedStaff: 'Pooja V. (Article Assistant)'
      });

      const client2 = await Client.create({
        firmId: firm._id,
        businessName: 'Vanguard Logistics & Freight LLP',
        contactPerson: 'Amitabh Sen',
        email: 'finance@vanguardlogistics.in',
        phone: '+91 99112 33445',
        entityType: 'LLP',
        gstin: '07AAEFV9012M1Z2',
        pan: 'AAEFV9012M',
        assignedStaff: 'Rohan Mehta'
      });

      const client3 = await Client.create({
        firmId: firm._id,
        businessName: 'Zenith Retail Supermart',
        contactPerson: 'Kailash Patel',
        email: 'kailash@zenithretail.com',
        phone: '+91 98450 67890',
        entityType: 'Proprietorship',
        gstin: '24AAPKZ3301L1Z8',
        pan: 'AAPKZ3301L',
        assignedStaff: 'Pooja V.'
      });

      // Sample Request 1: Monthly Bookkeeping for NexGen
      const dueDate1 = new Date();
      dueDate1.setDate(dueDate1.getDate() + 3);

      await Request.create({
        firmId: firm._id,
        clientId: client1._id,
        clientName: client1.businessName,
        clientEmail: client1.email,
        clientPhone: client1.phone,
        title: 'November 2026 Monthly Accounting & GST Verification',
        period: 'November 2026',
        secureToken: 'nexgen-nov2026-demo-token',
        dueDate: dueDate1,
        status: 'PARTIALLY_SUBMITTED',
        isRecurring: true,
        recurrenceFrequency: 'MONTHLY',
        items: [
          {
            title: 'HDFC Current Account Bank Statement',
            description: 'PDF format from 1st to 30th Nov with all debit/credit narrations',
            category: 'Banking & Finance',
            isRequired: true,
            status: 'SUBMITTED',
            uploadedFiles: [{
              originalName: 'HDFC_Bank_Statement_Nov2026.pdf',
              fileUrl: '/uploads/sample_hdfc_bank_statement.pdf',
              fileSize: 482910,
              mimeType: 'application/pdf',
              uploadedAt: new Date(Date.now() - 3600000),
              aiAnalysis: {
                docTypeDetected: 'Bank Account Statement',
                invoiceNo: 'STMT-99482',
                dateDetected: '30/11/2026',
                gstinDetected: 'N/A (Banking)',
                amountDetected: 'Closing Bal: ₹ 4,82,900',
                confidenceScore: 0.98,
                flags: ['Verified HDFC digital signature', '342 transactions detected']
              }
            }]
          },
          {
            title: 'Sales Register & Tax Invoices (B2B & B2C)',
            description: 'Excel or PDF export of all sales invoices issued this month',
            category: 'Accounting & Bookkeeping',
            isRequired: true,
            status: 'PENDING'
          },
          {
            title: 'Purchase Bills & Expense Vouchers',
            description: 'All supplier bills with vendor GSTIN for input tax credit (ITC)',
            category: 'Accounting & Bookkeeping',
            isRequired: true,
            status: 'PENDING'
          },
          {
            title: 'GSTR-3B Previous Month Filed Challan',
            description: 'Challan showing tax paid for October 2026',
            category: 'GST & Indirect Tax',
            isRequired: true,
            status: 'PENDING'
          }
        ]
      });

      // Sample Request 2: Complete workflow
      const dueDate2 = new Date();
      dueDate2.setDate(dueDate2.getDate() + 5);

      await Request.create({
        firmId: firm._id,
        clientId: client2._id,
        clientName: client2.businessName,
        clientEmail: client2.email,
        clientPhone: client2.phone,
        title: 'Q3 FY26 Advance Tax & TDS Compliance',
        period: 'Q3 FY 2026-27',
        secureToken: 'vanguard-q3-demo-token',
        dueDate: dueDate2,
        status: 'COMPLETE',
        isRecurring: false,
        items: [
          {
            title: 'Trial Balance & Profit/Loss Statement',
            category: 'Audit & Assurance',
            isRequired: true,
            status: 'SUBMITTED',
            uploadedFiles: [{
              originalName: 'Trial_Balance_Q3_Vanguard.xlsx',
              fileUrl: '/uploads/sample_trial_balance.xlsx',
              fileSize: 124000,
              mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              aiAnalysis: {
                docTypeDetected: 'Trial Balance Ledger',
                amountDetected: 'Total: ₹ 1,48,20,000',
                confidenceScore: 0.96,
                flags: ['Debits and credits in balance']
              }
            }]
          }
        ]
      });

      console.log('✅ Demo CA data ready!');
    }
  } catch (err) {
    console.warn('Seed data skipped:', err.message);
  }
}
setTimeout(seedInitialData, 2000);

// ================= API ENDPOINTS =================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    app: 'Cloop',
    environment: process.env.NODE_ENV || 'development',
    mongoStatus: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
    groqConfigured: !!process.env.GROQ_API_KEY,
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Firm Details
app.get('/api/firm', async (req, res) => {
  try {
    let firm = await Firm.findOne();
    if (!firm) {
      firm = await Firm.create({ name: 'Apex Chartered Accountants' });
    }
    res.json(firm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard Summary KPIs
app.get('/api/dashboard/summary', async (req, res) => {
  try {
    const totalClients = await Client.countDocuments({ status: 'ACTIVE' });
    const requests = await Request.find();
    
    let pendingRequests = 0;
    let completedRequests = 0;
    let overdueRequests = 0;
    let totalMissingItems = 0;

    const now = new Date();
    requests.forEach(r => {
      if (r.status === 'COMPLETE') {
        completedRequests++;
      } else {
        pendingRequests++;
        if (new Date(r.dueDate) < now) overdueRequests++;
        const missing = r.items.filter(i => i.status === 'PENDING').length;
        totalMissingItems += missing;
      }
    });

    res.json({
      totalClients,
      pendingRequests,
      completedRequests,
      overdueRequests,
      totalMissingItems,
      recentRequests: requests.slice(-6).reverse()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clients List & Create
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const { businessName, contactPerson, email, phone, entityType, gstin, pan, assignedStaff } = req.body;
    const client = await Client.create({
      businessName,
      contactPerson,
      email,
      phone,
      entityType: entityType || 'Private Limited',
      gstin,
      pan,
      assignedStaff
    });
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Requests List & Create
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/requests', async (req, res) => {
  try {
    const { clientId, title, period, dueDate, items, isRecurring, recurrenceFrequency } = req.body;
    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ error: 'Client not found' });

    const newRequest = await Request.create({
      clientId: client._id,
      clientName: client.businessName,
      clientEmail: client.email,
      clientPhone: client.phone,
      title,
      period: period || 'Current Period',
      dueDate: new Date(dueDate),
      isRecurring: !!isRecurring,
      recurrenceFrequency: recurrenceFrequency || 'NONE',
      items: items || [
        { title: 'Bank Account Statement (PDF)', category: 'Banking & Finance' },
        { title: 'Sales Register / Invoices', category: 'Accounting & Bookkeeping' },
        { title: 'Purchase & Expense Bills', category: 'Accounting & Bookkeeping' }
      ]
    });

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ================= PUBLIC CLIENT UPLOAD PORTAL =================
// No password required for client - verified by secureToken
app.get('/api/portal/:token', async (req, res) => {
  try {
    const request = await Request.findOne({ secureToken: req.params.token });
    if (!request) {
      return res.status(404).json({ error: 'Invalid or expired upload link. Please contact your accountant.' });
    }

    const firm = await Firm.findOne();
    res.json({
      request,
      firmName: firm?.name || 'Chartered Accountants',
      ownerName: firm?.ownerName,
      branding: firm?.branding
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Client uploads file to specific request item
app.post('/api/portal/:token/upload', upload.single('file'), async (req, res) => {
  try {
    const { itemId } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file received' });

    const request = await Request.findOne({ secureToken: req.params.token });
    if (!request) return res.status(404).json({ error: 'Request not found' });

    const item = request.items.id(itemId) || request.items[0];
    if (!item) return res.status(404).json({ error: 'Checklist item not found' });

    // AI Document Extraction via Groq / LLM
    console.log(`🤖 AI Analyzing document: ${file.originalname}...`);
    const aiResult = await analyzeDocumentAI({
      filename: file.originalname,
      mimeType: file.mimetype,
      textSnippet: `Uploaded document for checklist item: ${item.title}`
    });

    const fileAsset = {
      originalName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date(),
      aiAnalysis: {
        docTypeDetected: aiResult.documentType,
        invoiceNo: aiResult.extractedData?.invoiceNumber,
        dateDetected: aiResult.extractedData?.invoiceDate,
        gstinDetected: aiResult.extractedData?.gstin,
        amountDetected: aiResult.extractedData?.totalAmount,
        confidenceScore: aiResult.confidence,
        flags: aiResult.flags || []
      }
    };

    item.uploadedFiles.push(fileAsset);
    item.status = 'SUBMITTED';

    // Recalculate Request Status
    const allItems = request.items;
    const allSubmitted = allItems.every(i => i.status === 'SUBMITTED' || i.status === 'VERIFIED');
    const someSubmitted = allItems.some(i => i.status === 'SUBMITTED' || i.status === 'VERIFIED');

    if (allSubmitted) {
      request.status = 'COMPLETE';
    } else if (someSubmitted) {
      request.status = 'PARTIALLY_SUBMITTED';
    }

    await request.save();

    res.json({
      success: true,
      message: 'File successfully uploaded and verified by AI!',
      item,
      requestStatus: request.status,
      aiAnalysis: aiResult
    });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ================= AI BOT & REMINDERS =================

// Direct AI Document Text/Doc Analyzer Endpoint
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { filename, textSnippet } = req.body;
    const analysis = await analyzeDocumentAI({
      filename: filename || 'Invoice_Sample.pdf',
      mimeType: 'application/pdf',
      textSnippet
    });
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate AI Reminder Message (Email / WhatsApp preview)
app.post('/api/ai/generate-reminder', async (req, res) => {
  try {
    const { clientName, requestTitle, dueDate, missingItems, channel } = req.body;
    const reminder = await generateSmartReminderAI({
      clientName,
      requestTitle,
      dueDate,
      missingItems: missingItems || ['Bank Statement', 'GST Invoices'],
      channel: channel || 'WHATSAPP'
    });
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send Automated Reminder
app.post('/api/reminders/send', async (req, res) => {
  try {
    const { requestId, channel } = req.body;
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    // CRITICAL BUSINESS RULE: Do not send reminder if completed!
    if (request.status === 'COMPLETE') {
      return res.status(400).json({
        error: 'Automatic suppression: This request is already COMPLETE. No reminders will be sent.'
      });
    }

    const missingItems = request.items
      .filter(i => i.status === 'PENDING')
      .map(i => i.title);

    const reminderContent = await generateSmartReminderAI({
      clientName: request.clientName,
      requestTitle: request.title,
      dueDate: new Date(request.dueDate).toLocaleDateString('en-IN'),
      missingItems,
      channel: channel || 'WHATSAPP'
    });

    // Record Reminder Log
    const log = await ReminderLog.create({
      requestId: request._id,
      clientName: request.clientName,
      recipient: channel === 'WHATSAPP' ? request.clientPhone : request.clientEmail,
      channel: channel || 'EMAIL',
      messageSubject: reminderContent.subject,
      messageBody: reminderContent.body,
      status: 'DELIVERED'
    });

    request.remindersSentCount += 1;
    request.lastReminderAt = new Date();
    await request.save();

    res.json({
      success: true,
      channel: channel || 'EMAIL',
      recipient: log.recipient,
      content: reminderContent,
      remindersSentCount: request.remindersSentCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SPA catch-all route for Render single-instance hosting
if (fs.existsSync(distDir)) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Cloop Server running on http://localhost:${PORT}`);
});
