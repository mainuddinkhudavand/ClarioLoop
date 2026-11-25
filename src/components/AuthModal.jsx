import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Users, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  CheckCircle2, 
  FileText, 
  UploadCloud, 
  X, 
  Sparkles, 
  ArrowRight, 
  Award,
  IdCard,
  Building,
  Key,
  Check
} from 'lucide-react';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  defaultRole = 'ca', // 'admin' | 'ca' | 'client'
  onAuthSuccess 
}) {
  if (!isOpen) return null;

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState(defaultRole); // 'admin' | 'ca' | 'client'
  
  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    // CA Specific
    firmName: '',
    icaiNumber: '',
    membershipType: 'FCA',
    city: '',
    // Client Specific
    companyName: '',
    gstin: '',
    pan: '',
    clientType: 'Private Limited',
    // KYC Verification Proof
    kycDocType: 'PAN',
    kycDocNumber: '',
    kycFileUploaded: false,
    kycFileName: ''
  });

  const [kycProcessing, setKycProcessing] = useState(false);
  const [kycVerified, setKycVerified] = useState(false);

  const handleSimulateKYCUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setKycProcessing(true);
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          kycFileUploaded: true,
          kycFileName: file.name
        }));
        setKycVerified(true);
        setKycProcessing(false);
      }, 1200);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create session profile
    const userProfile = {
      id: 'usr_' + Math.floor(100000 + Math.random() * 900000),
      name: formData.name || (role === 'admin' ? 'Root Administrator' : role === 'ca' ? 'CA Rajesh Sharma (FCA)' : 'NexGen Digital Solutions'),
      email: formData.email || (role === 'admin' ? 'admin@clarioloop.com' : role === 'ca' ? 'rajesh@apexcafirm.in' : 'accounts@nexgen.io'),
      phone: formData.phone || '+91 98765 43210',
      role: role,
      firmName: formData.firmName || 'Apex & Partners Chartered Accountants',
      icaiNumber: formData.icaiNumber || 'FRN 129482W',
      companyName: formData.companyName || 'NexGen Digital Solutions Pvt Ltd',
      gstin: formData.gstin || '27AABCN1234F1Z5',
      pan: formData.pan || 'AABCN1234F',
      isKycVerified: mode === 'register' ? kycVerified : true,
      kycDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      avatarInitials: (formData.name || (role === 'admin' ? 'AD' : role === 'ca' ? 'CA' : 'CL')).slice(0, 2).toUpperCase()
    };

    if (onAuthSuccess) {
      onAuthSuccess(userProfile);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[94vh] animate-scaleUp">
        
        {/* Header */}
        <div className={`p-5 sm:p-6 text-white relative overflow-hidden ${
          role === 'admin' 
            ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950' 
            : role === 'ca'
              ? 'bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900'
              : 'bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-950'
        }`}>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-white shadow-md">
                {role === 'admin' && <ShieldCheck className="w-6 h-6 text-rose-400" />}
                {role === 'ca' && <Building2 className="w-6 h-6 text-indigo-300" />}
                {role === 'client' && <Users className="w-6 h-6 text-emerald-300" />}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {mode === 'login' ? 'Sign In to ClarioLoop' : 'Create Verified Profile'}
                </h3>
                <span className="text-[11px] text-white/80 font-medium">
                  {role === 'admin' ? 'SuperAdmin Control Portal' : role === 'ca' ? 'Chartered Accountant Portal' : 'Client Document Portal'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Switcher Chips */}
          <div className="grid grid-cols-3 gap-1.5 mt-4 pt-3 border-t border-white/15 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setRole('ca')}
              className={`py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                role === 'ca' 
                  ? 'bg-white text-indigo-900 shadow-sm font-extrabold' 
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>CA Practice</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('client')}
              className={`py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                role === 'client' 
                  ? 'bg-white text-emerald-900 shadow-sm font-extrabold' 
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Client User</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                role === 'admin' 
                  ? 'bg-white text-rose-900 shadow-sm font-extrabold' 
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SuperAdmin</span>
            </button>
          </div>
        </div>

        {/* Tab Switch: Login vs Register */}
        <div className="flex border-b border-slate-100 bg-slate-50 px-6 pt-3 text-xs font-bold gap-4">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`pb-3 border-b-2 transition-all ${
              mode === 'login' ? 'border-indigo-600 text-indigo-600 font-black' : 'border-transparent text-slate-500'
            }`}
          >
            Existing User Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
              mode === 'register' ? 'border-indigo-600 text-indigo-600 font-black' : 'border-transparent text-slate-500'
            }`}
          >
            <span>Register & KYC Verification</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
              Instant Badge
            </span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5 overflow-y-auto text-xs">
          
          {/* Quick Demo Autofill Hint */}
          <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200/60 flex items-center justify-between text-indigo-900 text-[11px]">
            <span>💡 <strong>Quick Demo:</strong> One-click sign in with pre-filled verified profile.</span>
            <button
              type="button"
              onClick={() => {
                if (mode === 'register') {
                  setFormData({
                    name: role === 'ca' ? 'CA Priya Nair' : role === 'client' ? 'Vikram Mehta' : 'Admin Operations',
                    email: role === 'ca' ? 'priya@nairca.in' : role === 'client' ? 'vikram@mehtaindustries.com' : 'admin@clarioloop.com',
                    phone: '+91 98234 56789',
                    password: 'password123',
                    firmName: 'Nair & Associates Chartered Accountants',
                    icaiNumber: 'FRN 149201W',
                    city: 'Bengaluru, Karnataka',
                    companyName: 'Mehta Precision Engineering Pvt Ltd',
                    gstin: '29AABCM9876C1Z4',
                    pan: 'AABCM9876C',
                    clientType: 'Private Limited',
                    kycDocType: 'PAN',
                    kycDocNumber: 'AABCM9876C',
                    kycFileUploaded: true,
                    kycFileName: 'PAN_Card_Signed_Verification.pdf'
                  });
                  setKycVerified(true);
                } else {
                  setFormData(prev => ({
                    ...prev,
                    email: role === 'admin' ? 'admin@clarioloop.com' : role === 'ca' ? 'partner@apexcafirm.in' : 'accounts@nexgen.io',
                    password: 'password123'
                  }));
                }
              }}
              className="text-indigo-700 hover:text-indigo-900 font-bold underline shrink-0 ml-2"
            >
              Autofill
            </button>
          </div>

          {/* REGISTER MODE FIELDS */}
          {mode === 'register' && (
            <>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name / Authorized Signatory *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. CA Rajesh Sharma / Priya Nair"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* Role Specific Registration Fields */}
              {role === 'ca' && (
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">CA Firm Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Apex Chartered Accountants"
                      value={formData.firmName}
                      onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ICAI Reg / FRN *</label>
                    <input
                      type="text"
                      required
                      placeholder="FRN 129482W"
                      value={formData.icaiNumber}
                      onChange={(e) => setFormData({ ...formData, icaiNumber: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-medium"
                    />
                  </div>
                </div>
              )}

              {role === 'client' && (
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Company / Entity Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="NexGen Tech Pvt Ltd"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">GSTIN *</label>
                    <input
                      type="text"
                      required
                      placeholder="27AABCN1234F1Z5"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-medium"
                    />
                  </div>
                </div>
              )}

              {/* KYC VERIFICATION BOX */}
              <div className="p-3.5 bg-gradient-to-br from-indigo-50/70 via-teal-50/40 to-emerald-50/60 rounded-2xl border border-indigo-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Identity KYC Verification Document</span>
                  </div>
                  {kycVerified ? (
                    <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Check className="w-3 h-3" /> KYC Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      Required for Badge
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Document Type</label>
                    <select
                      value={formData.kycDocType}
                      onChange={(e) => setFormData({ ...formData, kycDocType: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                    >
                      <option value="PAN">PAN Card (Taxpayer)</option>
                      <option value="AADHAAR">Aadhaar Card (UIDAI)</option>
                      <option value="ICAI_CARD">ICAI Member ID Card</option>
                      <option value="GST_CERT">GST Registration (REG-06)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Document Number</label>
                    <input
                      type="text"
                      placeholder="e.g. AABCN1234F"
                      value={formData.kycDocNumber}
                      onChange={(e) => setFormData({ ...formData, kycDocNumber: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-semibold"
                    />
                  </div>
                </div>

                {/* File Upload Trigger */}
                <div className="border border-dashed border-indigo-300 rounded-xl p-2.5 bg-white/80 text-center">
                  {formData.kycFileUploaded ? (
                    <div className="flex items-center justify-between text-xs text-emerald-800 px-2">
                      <span className="truncate font-medium">{formData.kycFileName || 'KYC_Document_Uploaded.pdf'}</span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">✓ Validated</span>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.png" 
                        onChange={handleSimulateKYCUpload} 
                        className="hidden" 
                      />
                      <div className="flex items-center justify-center gap-1.5 text-indigo-700 font-bold text-xs py-1">
                        <UploadCloud className="w-4 h-4 text-indigo-600" />
                        <span>{kycProcessing ? 'Verifying with OCR...' : 'Upload KYC Proof (PDF/JPG)'}</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </>
          )}

          {/* COMMON LOGIN / REGISTER FIELDS */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder={role === 'admin' ? 'admin@clarioloop.com' : 'partner@firm.in'}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-medium"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3.5 px-4 rounded-2xl text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 ${
                role === 'admin' 
                  ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/30' 
                  : role === 'ca'
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
              }`}
            >
              <span>{mode === 'login' ? `Sign In to ${role.toUpperCase()} Portal` : 'Complete KYC & Create Profile'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] text-center text-slate-400">
            Protected by ClarioLoop Enterprise Auth • 256-Bit SSL • ISO 27001
          </p>
        </form>

      </div>
    </div>
  );
}
