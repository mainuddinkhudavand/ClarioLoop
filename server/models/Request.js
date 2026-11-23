import mongoose from 'mongoose';
import crypto from 'crypto';

const RequestItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { 
    type: String, 
    enum: [
      'Accounting & Bookkeeping',
      'GST & Indirect Tax',
      'Income Tax',
      'Company & Corporate Compliance',
      'Payroll & Employee Records',
      'Banking & Finance',
      'Audit & Assurance',
      'MSME & Licences',
      'Legal & Contracts',
      'Other'
    ],
    default: 'Accounting & Bookkeeping'
  },
  isRequired: { type: Boolean, default: true },
  status: { type: String, enum: ['PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
  uploadedFiles: [{
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    originalName: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String,
    uploadedAt: { type: Date, default: Date.now },
    aiAnalysis: {
      docTypeDetected: String,
      invoiceNo: String,
      dateDetected: String,
      gstinDetected: String,
      amountDetected: String,
      confidenceScore: Number,
      flags: [String]
    }
  }]
});

const RequestSchema = new mongoose.Schema({
  firmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String },
  title: { type: String, required: true }, // e.g. "November 2026 Monthly Bookkeeping & GST Records"
  period: { type: String, default: 'November 2026' },
  secureToken: { 
    type: String, 
    unique: true, 
    default: () => crypto.randomBytes(16).toString('hex') 
  },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['NOT_SENT', 'SENT', 'PARTIALLY_SUBMITTED', 'COMPLETE', 'OVERDUE'], 
    default: 'SENT' 
  },
  isRecurring: { type: Boolean, default: false },
  recurrenceFrequency: { type: String, enum: ['MONTHLY', 'QUARTERLY', 'ANNUALLY', 'NONE'], default: 'NONE' },
  items: [RequestItemSchema],
  remindersSentCount: { type: Number, default: 0 },
  lastReminderAt: { type: Date },
  autoRemindersEnabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const Request = mongoose.models.Request || mongoose.model('Request', RequestSchema);
