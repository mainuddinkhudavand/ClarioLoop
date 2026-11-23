import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  firmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm' },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  originalFilename: { type: String, required: true },
  storagePath: { type: String, required: true },
  fileSizeBytes: { type: Number, required: true },
  mimeType: { type: String, required: true },
  aiClassification: {
    category: String,
    documentType: String,
    extractedData: {
      supplierName: String,
      invoiceNumber: String,
      invoiceDate: String,
      gstin: String,
      totalAmount: String,
      period: String
    },
    flags: [String],
    confidence: Number,
    verifiedByProfessional: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now }
});

export const Document = mongoose.models.Document || mongoose.model('Document', DocumentSchema);

const ReminderLogSchema = new mongoose.Schema({
  firmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm' },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
  clientName: String,
  recipient: String,
  channel: { type: String, enum: ['EMAIL', 'WHATSAPP'], default: 'EMAIL' },
  messageSubject: String,
  messageBody: String,
  status: { type: String, enum: ['SENT', 'DELIVERED', 'STOPPED_AUTO_COMPLETE', 'FAILED'], default: 'SENT' },
  timestamp: { type: Date, default: Date.now }
});

export const ReminderLog = mongoose.models.ReminderLog || mongoose.model('ReminderLog', ReminderLogSchema);
