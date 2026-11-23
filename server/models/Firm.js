import mongoose from 'mongoose';

const FirmSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Apex Chartered Accountants' },
  ownerName: { type: String, default: 'CA Rajesh Sharma' },
  email: { type: String, required: true, default: 'admin@apexca.com' },
  phone: { type: String, default: '+91 98765 43210' },
  timezone: { type: String, default: 'Asia/Kolkata' },
  branding: {
    logoUrl: String,
    primaryColor: { type: String, default: '#0d9488' }
  },
  subscription: {
    plan: { type: String, enum: ['STARTER', 'PROFESSIONAL', 'BUSINESS', 'ENTERPRISE'], default: 'PROFESSIONAL' },
    priceMonthlyINR: { type: Number, default: 1999 },
    clientLimit: { type: Number, default: 30 },
    trialEndsAt: { type: Date, default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
    status: { type: String, enum: ['TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELLED'], default: 'TRIAL' }
  },
  createdAt: { type: Date, default: Date.now }
});

export const Firm = mongoose.models.Firm || mongoose.model('Firm', FirmSchema);
