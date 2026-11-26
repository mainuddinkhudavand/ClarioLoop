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
  Check,
  Landmark,
  GraduationCap,
  HeartPulse
} from 'lucide-react';

const ROLES_CONFIG = [
  { id: 'ca', label: 'CA Practice', icon: Building2, color: 'text-indigo-600', activeBg: 'bg-indigo-600 text-white', badge: 'ICAI COP VERIFIED' },
  { id: 'cooperative', label: 'Co-op Banking', icon: Landmark, color: 'text-emerald-600', activeBg: 'bg-emerald-600 text-white', badge: 'RCS AUDIT VERIFIED' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: 'text-blue-600', activeBg: 'bg-blue-600 text-white', badge: 'UGC ACCREDITED' },
  { id: 'insurance', label: 'Insurance', icon: ShieldCheck, color: 'text-purple-600', activeBg: 'bg-purple-600 text-white', badge: 'IRDAI LICENSED' },
  { id: 'client', label: 'Client User', icon: Users, color: 'text-teal-600', activeBg: 'bg-teal-600 text-white', badge: 'MCA & GST VERIFIED' },
  { id: 'admin', label: 'SuperAdmin', icon: ShieldCheck, color: 'text-rose-600', activeBg: 'bg-rose-600 text-white', badge: 'ROOT SYSTEM ADMIN' }
];

const DEMO_CREDENTIALS = {
  ca: {
    name: 'CA Rajesh Sharma (FCA, DISA)',
    email: 'rajesh@apexcafirm.in',
    phone: '+91 98765 43210',
    entityName: 'Apex & Partners Chartered Accountants',
    licenseNumber: 'ICAI FRN 129482W / M.No 094821',
    city: 'Mumbai, Maharashtra',
    badge: 'ICAI COP VERIFIED'
  },
  cooperative: {
    name: 'Ramesh Patil (Chief Executive Officer)',
    email: 'ceo@sahyadricoop.org.in',
    phone: '+91 98220 11223',
    entityName: 'Sahyadri Urban Co-operative Bank Ltd',
    licenseNumber: 'RCS Reg No. BOM/AR-1284/1984',
    city: 'Pune, Maharashtra',
    badge: 'RCS AUDIT VERIFIED'
  },
  education: {
    name: 'Dr. Sunita Kulkarni (Dean of Admissions)',
    email: 'admissions@rvce.edu.in',
    phone: '+91 98450 33445',
    entityName: 'RV College of Engineering & Autonomous Campus',
    licenseNumber: 'AISHE Code C-12849 • UGC Autonomy Ref 849/2020',
    city: 'Bengaluru, Karnataka',
    badge: 'NAAC A++ ACCREDITED'
  },
  insurance: {
    name: 'Anand Verma (Principal Broker)',
    email: 'anand@trivitainsurance.com',
    phone: '+91 98100 55667',
    entityName: 'Trivita Direct Insurance Brokers Ltd',
    licenseNumber: 'IRDAI Direct Broker License DB 842/2019',
    city: 'New Delhi, Delhi',
    badge: 'IRDAI LICENSED'
  },
  client: {
    name: 'Vikram Mehta (Director)',
    email: 'accounts@nexgendigital.io',
    phone: '+91 98111 22233',
    entityName: 'NexGen Digital Solutions Pvt Ltd',
    licenseNumber: 'GSTIN: 27AABCN1234F1Z5 • PAN: AABCN1234F',
    city: 'Pune, Maharashtra',
    badge: 'MCA & GST VERIFIED'
  },
  admin: {
    name: 'SuperAdmin (Platform Security Officer)',
    email: 'admin@clarioloop.com',
    phone: '+91 98000 00000',
    entityName: 'ClarioLoop Global Platform Operations',
    licenseNumber: 'ISO 27001 Certified • Bank Grade 256-bit',
    city: 'Bengaluru, Karnataka',
    badge: 'ROOT SYSTEM ADMIN'
  }
};

export default function AuthModal({ 
  isOpen, 
  onClose, 
  defaultRole = 'ca', 
  onAuthSuccess 
}) {
  if (!isOpen) return null;

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState(defaultRole || 'ca');
  
  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    entityName: '',
    licenseNumber: '',
    city: '',
    kycDocType: 'Govt Certificate',
    kycDocNumber: '',
    kycFileUploaded: false,
    kycFileName: ''
  });

  const [kycProcessing, setKycProcessing] = useState(false);
  const [kycVerified, setKycVerified] = useState(false);

  const activeRoleConfig = ROLES_CONFIG.find(r => r.id === role) || ROLES_CONFIG[0];
  const demoData = DEMO_CREDENTIALS[role] || DEMO_CREDENTIALS.ca;

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
      }, 1000);
    }
  };

  const handleAutofill = () => {
    if (mode === 'register') {
      setFormData({
        name: demoData.name,
        email: demoData.email,
        phone: demoData.phone,
        password: 'password123',
        entityName: demoData.entityName,
        licenseNumber: demoData.licenseNumber,
        city: demoData.city,
        kycDocType: 'Official Registration Proof',
        kycDocNumber: demoData.licenseNumber,
        kycFileUploaded: true,
        kycFileName: `${role}_verified_registration.pdf`
      });
      setKycVerified(true);
    } else {
      setFormData(prev => ({
        ...prev,
        email: demoData.email,
        password: 'password123'
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create session profile tailored to industry
    const userProfile = {
      id: 'usr_' + Math.floor(100000 + Math.random() * 900000),
      name: formData.name || demoData.name,
      email: formData.email || demoData.email,
      phone: formData.phone || demoData.phone,
      role: role,
      firmName: formData.entityName || demoData.entityName,
      companyName: formData.entityName || demoData.entityName,
      entityName: formData.entityName || demoData.entityName,
      licenseNumber: formData.licenseNumber || demoData.licenseNumber,
      icaiNumber: role === 'ca' ? (formData.licenseNumber || demoData.licenseNumber) : undefined,
      city: formData.city || demoData.city,
      isKycVerified: mode === 'register' ? kycVerified : true,
      kycBadge: demoData.badge,
      kycDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      avatarInitials: (formData.name || demoData.name).slice(0, 2).toUpperCase()
    };

    if (onAuthSuccess) {
      onAuthSuccess(userProfile);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[94vh] animate-scaleUp">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 sm:p-6 text-white relative overflow-hidden border-b border-slate-800">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-white shadow-md">
                <activeRoleConfig.icon className={`w-6 h-6 text-white`} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {mode === 'login' ? 'Sign In to ClarioLoop' : 'Create Verified Industry Account'}
                </h3>
                <span className="text-[11px] text-slate-300 font-medium">
                  {activeRoleConfig.label} • {demoData.badge}
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

          {/* 6 Industry Role Switcher Chips */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mt-4 pt-3 border-t border-white/15 text-[10px] font-bold">
            {ROLES_CONFIG.map(r => {
              const Icon = r.icon;
              const isSelected = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setRole(r.id);
                    if (r.id === 'admin') setMode('login');
                  }}
                  className={`py-1.5 px-2 rounded-xl transition-all flex flex-col items-center justify-center gap-1 ${
                    isSelected 
                      ? `${r.activeBg} font-black shadow-sm ring-2 ring-white/30 scale-102` 
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="truncate w-full text-center">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Switch: Login vs Register (Register Hidden for SuperAdmin) */}
        <div className="flex border-b border-slate-100 bg-slate-50 px-6 pt-3 text-xs font-bold gap-4">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`pb-3 border-b-2 transition-all ${
              mode === 'login' ? 'border-indigo-600 text-indigo-600 font-black' : 'border-transparent text-slate-500'
            }`}
          >
            {role === 'admin' ? 'SuperAdmin Sign In Only' : 'Existing Account Login'}
          </button>
          
          {role !== 'admin' && (
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
                mode === 'register' ? 'border-indigo-600 text-indigo-600 font-black' : 'border-transparent text-slate-500'
              }`}
            >
              <span>Register New Practice / Entity</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                KYC Badge
              </span>
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5 overflow-y-auto text-xs">
          
          {/* Quick Demo Autofill Hint */}
          <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200/80 flex items-center justify-between text-indigo-950 text-[11px]">
            <span>💡 <strong>Quick Demo:</strong> Click autofill to test verified <strong>{activeRoleConfig.label}</strong> access.</span>
            <button
              type="button"
              onClick={handleAutofill}
              className="text-indigo-700 hover:text-indigo-900 font-black underline shrink-0 ml-2"
            >
              Autofill Credentials
            </button>
          </div>

          {/* REGISTER MODE FIELDS */}
          {mode === 'register' && (
            <>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Authorized Person Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={demoData.name}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* Entity Name & Statutory Registration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {role === 'ca' ? 'CA Firm Name *' : role === 'cooperative' ? 'Society / Bank Name *' : role === 'education' ? 'Institution / University *' : role === 'insurance' ? 'Agency / Brokerage *' : 'Company / Business Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={demoData.entityName}
                    value={formData.entityName}
                    onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {role === 'ca' ? 'ICAI FRN / Reg *' : role === 'cooperative' ? 'RCS Registration No. *' : role === 'education' ? 'AISHE / UGC Code *' : role === 'insurance' ? 'IRDAI License No. *' : 'GSTIN / PAN *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={demoData.licenseNumber}
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">City & State *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* Instant Verification Upload */}
              <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
                <span className="font-black text-slate-800 text-[11px] block">
                  Verify Credentials & Statutory Registration Proof
                </span>
                <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl cursor-pointer bg-white transition-all">
                  <UploadCloud className="w-5 h-5 text-indigo-600 mb-1" />
                  <span className="text-[11px] font-bold text-slate-700">
                    {formData.kycFileName || 'Upload Registration Certificate / License'}
                  </span>
                  <span className="text-[9px] text-slate-400">PDF, PNG, JPG up to 10MB</span>
                  <input type="file" onChange={handleSimulateKYCUpload} className="hidden" />
                </label>

                {kycProcessing && (
                  <span className="text-indigo-600 font-bold text-[10px] flex items-center gap-1.5 animate-pulse">
                    <Sparkles className="w-3 h-3" /> Verifying statutory register with national registry...
                  </span>
                )}
                {kycVerified && (
                  <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Statutory registration verified: {demoData.badge}
                  </span>
                )}
              </div>
            </>
          )}

          {/* COMMON LOGIN / REGISTRATION FIELDS */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Official Work Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder={demoData.email}
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
                className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>{mode === 'login' ? `Sign In as ${activeRoleConfig.label}` : `Complete Registration & Launch Desk`}</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </form>

      </div>
    </div>
  );
}
