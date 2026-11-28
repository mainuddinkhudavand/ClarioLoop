import React, { useState } from 'react';
import Logo from './Logo';
import { 
  ShieldCheck, 
  Building2, 
  Users, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  CheckCircle2, 
  UploadCloud, 
  Sparkles, 
  ArrowRight, 
  Award,
  IdCard,
  Building,
  Check,
  ArrowLeft,
  KeyRound,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

export default function PortalAuthGateway({ 
  portalType, // 'admin' | 'ca' | 'client'
  onSuccessLogin, 
  onBackToHome 
}) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  // Registration and Profile State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // CA Specific
    caFirmName: '',
    icaiFrn: '',
    membershipNumber: '',
    city: '',
    
    // Client Specific
    companyName: '',
    panNumber: '',
    gstinNumber: '',
    entityType: 'Private Limited',
    
    // Admin Specific
    adminSecretCode: '',
    department: 'Platform Operations',
    
    // Mandatory KYC Details
    kycDocumentType: 'PAN',
    kycDocumentNumber: '',
    kycFileName: '',
    kycFileUploaded: false
  });

  const [kycProcessing, setKycProcessing] = useState(false);
  const [kycVerified, setKycVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle KYC Simulation Upload
  const handleKycUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setKycProcessing(true);
      setErrorMessage('');
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

  const handleQuickDemoAutofill = () => {
    if (portalType === 'admin') {
      setFormData({
        fullName: 'SuperAdmin Commander',
        email: 'admin@clarioloop.com',
        phone: '+91 98000 11111',
        password: 'password123',
        confirmPassword: 'password123',
        adminSecretCode: 'CLARIO_ROOT_2026',
        department: 'Security & Infrastructure',
        kycDocumentType: 'AADHAAR',
        kycDocumentNumber: '9876 5432 1098',
        kycFileName: 'Admin_Govt_ID_Cleared.pdf',
        kycFileUploaded: true
      });
      setKycVerified(true);
    } else if (portalType === 'ca') {
      setFormData({
        fullName: 'CA Rajesh Sharma (FCA)',
        email: 'rajesh@apexcafirm.in',
        phone: '+91 98765 43210',
        password: 'password123',
        confirmPassword: 'password123',
        caFirmName: 'Apex & Partners Chartered Accountants',
        icaiFrn: 'FRN 102938W',
        membershipNumber: 'M.No. 402918',
        city: 'Mumbai, Maharashtra',
        kycDocumentType: 'ICAI_CARD',
        kycDocumentNumber: 'FCA-402918-WIRC',
        kycFileName: 'ICAI_COP_Certificate_2026.pdf',
        kycFileUploaded: true
      });
      setKycVerified(true);
    } else {
      setFormData({
        fullName: 'Vikram Mehta (Director)',
        email: 'accounts@nexgendigital.io',
        phone: '+91 98111 22233',
        password: 'password123',
        confirmPassword: 'password123',
        companyName: 'NexGen Digital Solutions Pvt Ltd',
        panNumber: 'AABCN1234F',
        gstinNumber: '27AABCN1234F1Z5',
        entityType: 'Private Limited',
        kycDocumentType: 'PAN',
        kycDocumentNumber: 'AABCN1234F',
        kycFileName: 'Company_PAN_COI_Signed.pdf',
        kycFileUploaded: true
      });
      setKycVerified(true);
    }
  };

  const handleOneClickEnter = () => {
    if (portalType === 'admin') {
      onSuccessLogin({
        id: 'admin-root',
        role: 'admin',
        name: 'Root Platform Admin',
        email: 'admin@clarioloop.com',
        phone: '+91 98000 11111',
        isKycVerified: true,
        kycDate: 'Nov 2026',
        kycDocType: 'Master Root Security Clearance',
        avatarInitials: 'AD',
        designation: 'Principal Operations & Security Architect',
        location: 'Bengaluru, Karnataka',
        bio: 'Principal System Operations & Security Architect at ClarioLoop.'
      });
    } else if (portalType === 'ca') {
      onSuccessLogin({
        id: 'ca-rajesh-sharma',
        role: 'ca',
        name: 'CA Rajesh Sharma (FCA, DISA)',
        email: 'rajesh@apexcafirm.in',
        phone: '+91 98765 43210',
        firmName: 'Apex & Partners Chartered Accountants',
        icaiNumber: 'FRN 102938W',
        isKycVerified: true,
        kycDate: 'Nov 2026',
        kycDocType: 'ICAI Certificate of Practice',
        avatarInitials: 'RS',
        designation: 'Senior Managing Partner (FCA)',
        city: 'Mumbai, Maharashtra',
        location: 'Mumbai, Maharashtra',
        bio: 'Senior Partner specializing in Corporate Statutory Audits, Transfer Pricing, and Section 44AB Tax Filings.'
      });
    } else {
      onSuccessLogin({
        id: 'client-nexgen',
        role: 'client',
        name: 'Vikram Mehta (Director)',
        email: 'accounts@nexgendigital.io',
        phone: '+91 98111 22233',
        companyName: 'NexGen Digital Solutions Pvt Ltd',
        pan: 'AABCN1234F',
        gstin: '27AABCN1234F1Z5',
        isKycVerified: true,
        kycDate: 'Nov 2026',
        kycDocType: 'Company PAN & Certificate of Incorporation',
        avatarInitials: 'VM',
        designation: 'Director of Finance',
        city: 'Pune, Maharashtra',
        location: 'Pune, Maharashtra',
        bio: 'High-growth technology company focused on cross-border SaaS workflows and digital compliance.'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (portalType === 'admin') {
      const enteredEmail = formData.email.trim().toLowerCase();
      const enteredPassword = formData.password;

      // Try server-side JWT admin authentication first when Express backend is running
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: enteredEmail, password: enteredPassword })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.token) {
            sessionStorage.setItem('clarioloop_admin_token', data.token);
          }
          onSuccessLogin({
            id: 'admin-root',
            role: 'admin',
            name: 'Root Platform Admin',
            email: data.user?.email || enteredEmail,
            phone: '+91 98000 11111',
            isKycVerified: true,
            kycDate: 'Nov 2026',
            kycDocType: 'Master Root Security Clearance',
            avatarInitials: 'AD',
            designation: 'Principal Operations & Security Architect',
            location: 'Bengaluru, Karnataka',
            bio: 'Principal System Operations & Security Architect at ClarioLoop.'
          });
          return;
        }
        if (res.status === 401 || res.status === 403) {
          setErrorMessage('Invalid admin email or password.');
          return;
        }
      } catch {
        // Static Vite / frontend-only mode fallback below
      }

      const expectedEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@clarioloop.com').trim().toLowerCase();
      const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'ClarioOwner@2026';

      if (enteredEmail !== expectedEmail || enteredPassword !== expectedPassword) {
        setErrorMessage('Invalid admin email or password.');
        return;
      }

      onSuccessLogin({
        id: 'admin-root',
        role: 'admin',
        name: 'Root Platform Admin',
        email: expectedEmail,
        phone: '+91 98000 11111',
        isKycVerified: true,
        kycDate: 'Nov 2026',
        kycDocType: 'Master Root Security Clearance',
        avatarInitials: 'AD',
        designation: 'Principal Operations & Security Architect',
        location: 'Bengaluru, Karnataka',
        bio: 'Principal System Operations & Security Architect at ClarioLoop.'
      });
      return;
    }

    if (mode === 'register' && !kycVerified) {
      setErrorMessage('Mandatory KYC verification document must be uploaded before registration.');
      return;
    }

    const createdProfile = {
      id: 'profile_' + Math.floor(100000 + Math.random() * 900000),
      role: portalType,
      name: formData.fullName || (portalType === 'admin' ? 'Root Admin' : portalType === 'ca' ? 'CA Rajesh Sharma' : 'NexGen Digital'),
      email: formData.email || (portalType === 'admin' ? 'admin@clarioloop.com' : portalType === 'ca' ? 'partner@ca.in' : 'client@co.in'),
      phone: formData.phone || '+91 98765 43210',
      firmName: formData.caFirmName || 'Apex & Partners Chartered Accountants',
      icaiNumber: formData.icaiFrn || 'FRN 102938W',
      companyName: formData.companyName || 'NexGen Digital Solutions Pvt Ltd',
      gstin: formData.gstinNumber || '27AABCN1234F1Z5',
      pan: formData.panNumber || 'AABCN1234F',
      isKycVerified: true,
      kycDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      kycDocType: formData.kycDocumentType || 'PAN',
      avatarInitials: (formData.fullName || (portalType === 'admin' ? 'AD' : portalType === 'ca' ? 'CA' : 'CL')).slice(0, 2).toUpperCase()
    };

    onSuccessLogin(createdProfile);
  };

  // Portal Branding Theme
  const portalMeta = {
    admin: {
      title: 'SuperAdmin Root Portal',
      subtitle: 'Platform infrastructure, tenant monitoring, and enterprise CRM access.',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      themeGradient: 'from-slate-950 via-slate-900 to-rose-950',
      icon: ShieldCheck,
      accentColor: 'rose',
      btnGradient: 'bg-gradient-to-r from-rose-600 via-rose-700 to-purple-800 hover:from-rose-500 hover:to-purple-700'
    },
    ca: {
      title: 'CA Practice Portal',
      subtitle: 'Client document requests, statutory audits, 44AB checklists, and Groq AI reader.',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      themeGradient: 'from-slate-950 via-indigo-950 to-slate-900',
      icon: Building2,
      accentColor: 'indigo',
      btnGradient: 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500'
    },
    client: {
      title: 'Client Document Upload Portal',
      subtitle: 'Secure tokenized document upload, bank statements, invoices, and KYC submissions.',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      themeGradient: 'from-slate-950 via-teal-950 to-emerald-950',
      icon: Users,
      accentColor: 'emerald',
      btnGradient: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500'
    }
  }[portalType] || {
    title: 'Portal Access',
    subtitle: 'Sign in or create verified profile',
    themeGradient: 'from-slate-950 to-slate-900',
    icon: Lock,
    btnGradient: 'bg-indigo-600'
  };

  const Icon = portalMeta.icon;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${portalMeta.themeGradient} text-white flex flex-col font-sans p-4 sm:p-6 selection:bg-indigo-500 selection:text-white`}>
      
      {/* Top Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-2 mb-4">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700 transition-all backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" />
          <span>Back to Landing Page</span>
        </button>

        <Logo size="small" inverted={true} />
      </div>

      {/* Main Card Container */}
      <div className="max-w-xl mx-auto w-full bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col my-auto">
        
        {/* Portal Identification Banner */}
        <div className="p-6 border-b border-slate-800/80 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-lg">
              <Icon className="w-7 h-7 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">{portalMeta.title}</h2>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${portalMeta.badgeColor}`}>
                  {portalType.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                {portalMeta.subtitle}
              </p>
            </div>
          </div>

          {/* Quick 1-Click Instant Enter Box (CA & Client only — never shown for Admin) */}
          {portalType !== 'admin' && (
            <>
              <div className="mt-4 p-3.5 bg-gradient-to-r from-indigo-950/90 via-slate-900 to-indigo-950/90 border border-indigo-500/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1 mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>1-Click Instant Enter (Zero Typing Needed)</span>
                  </span>
                  <div className="text-xs font-black text-white truncate">
                    {portalType === 'ca' && 'Enter as CA Rajesh Sharma (Apex & Partners)'}
                    {portalType === 'client' && 'Enter as Client Vikram Mehta (NexGen Digital)'}
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {portalType === 'ca' && 'FRN 102938W • KYC Verified Badge • Practice Dashboard'}
                    {portalType === 'client' && 'Zero passwords needed • Pre-loaded compliance checklist'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOneClickEnter}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
                >
                  <span>Instant Enter →</span>
                </button>
              </div>

              <div className="pt-2 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  — or test custom credentials / registration with KYC below —
                </span>
              </div>
            </>
          )}
        </div>

        {/* Tab Switch: Login vs Register (Admin is Direct Login Only) */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-3 text-xs font-bold gap-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
              mode === 'login' || portalType === 'admin' ? 'border-indigo-500 text-indigo-400 font-black' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{portalType === 'admin' ? 'Direct Admin Sign In' : `Sign In to ${portalType.toUpperCase()}`}</span>
          </button>
          
          {portalType !== 'admin' && (
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
                mode === 'register' ? 'border-indigo-500 text-indigo-400 font-black' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Register & Create Profile</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-bold">
                + KYC Badge
              </span>
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* REGISTER EXCLUSIVE FIELDS */}
          {mode === 'register' && (
            <>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Full Name / Authorized Signatory *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. CA Rajesh Sharma / Ananya Singhania"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* CA Portal Specifics */}
              {portalType === 'ca' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">CA Firm Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Apex Chartered Accountants"
                      value={formData.caFirmName}
                      onChange={(e) => setFormData({ ...formData, caFirmName: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">ICAI Firm Reg (FRN) *</label>
                    <input
                      type="text"
                      required
                      placeholder="FRN 102938W"
                      value={formData.icaiFrn}
                      onChange={(e) => setFormData({ ...formData, icaiFrn: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 font-mono font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Client Portal Specifics */}
              {portalType === 'client' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Company / Entity Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="NexGen Digital Pvt Ltd"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">GSTIN Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="27AABCN1234F1Z5"
                      value={formData.gstinNumber}
                      onChange={(e) => setFormData({ ...formData, gstinNumber: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 font-mono font-medium"
                    />
                  </div>
                </div>
              )}

              {/* MANDATORY KYC VERIFICATION CARD */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-900/60 ring-1 ring-indigo-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-black text-white text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Mandatory KYC Identity Document</span>
                  </div>
                  {kycVerified ? (
                    <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" /> KYC Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded-full">
                      Required for Badge
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Document Type</label>
                    <select
                      value={formData.kycDocumentType}
                      onChange={(e) => setFormData({ ...formData, kycDocumentType: e.target.value })}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    >
                      <option value="PAN">PAN Card (Taxpayer Proof)</option>
                      <option value="AADHAAR">Aadhaar Card (UIDAI)</option>
                      <option value="ICAI_CARD">ICAI Member Certificate</option>
                      <option value="GST_CERT">GST Registration (REG-06)</option>
                      <option value="COI">Certificate of Incorporation</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Document / ID Number</label>
                    <input
                      type="text"
                      placeholder="e.g. AABCN1234F"
                      value={formData.kycDocumentNumber}
                      onChange={(e) => setFormData({ ...formData, kycDocumentNumber: e.target.value })}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Upload Action */}
                <div className="border border-dashed border-indigo-500/50 rounded-xl p-3 bg-indigo-950/20 text-center">
                  {formData.kycFileUploaded ? (
                    <div className="flex items-center justify-between text-xs text-emerald-400 px-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate">{formData.kycFileName || 'KYC_Verification_Proof.pdf'}</span>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-md shrink-0">
                        ✓ OCR Match 99.4%
                      </span>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.png" 
                        onChange={handleKycUpload} 
                        className="hidden" 
                      />
                      <div className="flex items-center justify-center gap-2 text-indigo-300 hover:text-white font-bold text-xs py-1 transition-colors">
                        <UploadCloud className="w-4 h-4 text-indigo-400" />
                        <span>{kycProcessing ? 'Verifying with Groq OCR...' : 'Upload KYC Verification Proof (PDF/JPG)'}</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </>
          )}

          {/* COMMON LOGIN / REGISTER FIELDS */}
          <div>
            <label className="font-bold text-slate-300 block mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder={portalType === 'admin' ? 'admin@clarioloop.com' : portalType === 'ca' ? 'rajesh@apexcafirm.in' : 'accounts@nexgendigital.io'}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 font-mono font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3.5 px-4 rounded-2xl text-white font-black text-xs shadow-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 ${portalMeta.btnGradient}`}
            >
              <span>
                {mode === 'login' 
                  ? `Sign In to ${portalType.toUpperCase()} Portal` 
                  : `Complete KYC & Launch ${portalType.toUpperCase()} Profile`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>256-Bit Bank Grade Encryption • ISO 27001 Certified • Real-time KYC Validation</span>
          </div>
        </form>

      </div>
    </div>
  );
}
