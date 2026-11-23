import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  firmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm' },
  businessName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  entityType: { 
    type: String, 
    enum: ['Private Limited', 'LLP', 'Proprietorship', 'Partnership', 'Individual', 'Trust/NGO'],
    default: 'Private Limited'
  },
  gstin: { type: String, uppercase: true },
  pan: { type: String, uppercase: true },
  assignedStaff: { type: String, default: 'Senior Accountant' },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now }
});

export const Client = mongoose.models.Client || mongoose.model('Client', ClientSchema);
