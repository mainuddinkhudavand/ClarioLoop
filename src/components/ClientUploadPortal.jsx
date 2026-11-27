import React, { useState, useRef } from 'react';
import Logo from './Logo';
import { 
  UploadCloud, 
  FileCheck, 
  Clock, 
  AlertCircle, 
  Camera, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Lock, 
  ArrowLeft, 
  RefreshCw,
  Building2,
  ShieldCheck,
  Download,
  Layers,
  FolderOpen,
  User,
  Edit3,
  Calendar,
  Check,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  Eye,
  Info,
  Building,
  Image,
  LogOut,
  FileCheck2,
  Phone,
  Mail,
  MapPin,
  X,
  Save,
  Briefcase
} from 'lucide-react';
import { mockFirms, financeMasterChecklist } from '../data/mockData';

export default function ClientUploadPortal({ 
  token, 
  onBackToFirm, 
  activeFirm, 
  currentUser, 
  onUpdateProfile,
  onLogout 
}) {
  // Find which request and firm this token belongs to
  let foundFirm = activeFirm || mockFirms[0];
  let foundRequest = foundFirm.requests?.[0];

  for (const f of mockFirms) {
    const r = f.requests?.find(req => req.secureToken === token);
    if (r) {
      foundFirm = f;
      foundRequest = r;
      break;
    }
  }

  // Active top navigation tab: 'modules' | 'requests' | 'vault' | 'profile'
  const [activeTab, setActiveTab] = useState('modules');
  
  // Selected Master Module for Compliance (A through F)
  const [activeModuleCode, setActiveModuleCode] = useState('A');
  const [moduleFilter, setModuleFilter] = useState('all'); // 'all' | 'pending' | 'uploaded'
  const [vaultSearch, setVaultSearch] = useState('');
  const [vaultModuleFilter, setVaultModuleFilter] = useState('ALL');

  // Client Profile State & Edit Mode Toggle
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Vikram Mehta (Director)',
    companyName: currentUser?.companyName || 'NexGen Digital Solutions Pvt Ltd',
    email: currentUser?.email || 'accounts@nexgendigital.io',
    phone: currentUser?.phone || '+91 98111 22233',
    designation: currentUser?.designation || 'Director of Finance',
    entityType: currentUser?.entityType || 'Private Limited',
    gstin: currentUser?.gstin || '27AABCN1234F1Z5',
    pan: currentUser?.pan || 'AABCN1234F',
    city: currentUser?.city || 'Pune, Maharashtra',
    address: currentUser?.address || 'Tech Park One, Viman Nagar, Pune, Maharashtra 411014',
    bio: currentUser?.bio || 'High-growth technology company focused on cross-border SaaS workflows, enterprise IT infrastructure and digital compliance.',
    coverUrl: currentUser?.coverUrl || null,
    avatarUrl: currentUser?.avatarUrl || null,
    kycDocType: currentUser?.kycDocType || 'Company PAN & Certificate of Incorporation',
    kycDate: currentUser?.kycDate || 'Nov 2026'
  });

  const [profileSavedToast, setProfileSavedToast] = useState(false);
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // CA Request State
  const [caRequests, setCaRequests] = useState([
    foundRequest || {
      id: 'req-nov-2026',
      title: 'November 2026 Monthly Bookkeeping & GST Records',
      clientName: currentUser?.companyName || 'NexGen Digital Solutions Pvt Ltd',
      period: 'November 2026',
      dueDate: '2026-11-30',
      status: 'PARTIALLY_SUBMITTED',
      items: [
        { id: 'ca_1', title: 'HDFC Current Account Bank Statement (PDF)', category: 'Banking & Finance', isRequired: true, status: 'SUBMITTED', uploadedFile: { name: 'HDFC_Statement_Nov2026.pdf', size: '482 KB', date: '2026-11-24' } },
        { id: 'ca_2', title: 'Sales Register & Tax Invoices (B2B & B2C)', category: 'Accounting & Bookkeeping', isRequired: true, status: 'PENDING' },
        { id: 'ca_3', title: 'Vendor Purchase Invoices & Expenses', category: 'Accounting & Bookkeeping', isRequired: true, status: 'PENDING' },
        { id: 'ca_4', title: 'GST Payment Challan (Form PMT-06)', category: 'GST & Indirect Tax', isRequired: true, status: 'PENDING' }
      ]
    },
    {
      id: 'req-q3-advance',
      title: 'FY 2026-27 Q3 Advance Tax & TDS Working Verification',
      clientName: currentUser?.companyName || 'NexGen Digital Solutions Pvt Ltd',
      period: 'Q3 (Oct-Dec 2026)',
      dueDate: '2026-12-15',
      status: 'PENDING',
      items: [
        { id: 'ca_q3_1', title: 'Advance Tax Calculation Sheet', category: 'Income Tax', isRequired: true, status: 'PENDING' },
        { id: 'ca_q3_2', title: 'Form 26AS & AIS Tax Credit Reconciled', category: 'Income Tax', isRequired: true, status: 'PENDING' },
        { id: 'ca_q3_3', title: 'Monthly TDS Payment Challans (ITNS 281)', category: 'Payroll & TDS', isRequired: true, status: 'PENDING' }
      ]
    }
  ]);

  // Uploaded documents storage across the 6 Master Modules
  const [moduleUploads, setModuleUploads] = useState({
    'A_0': {
      name: 'NexGen_Company_PAN_Card.pdf',
      size: '280 KB',
      date: '2026-11-20',
      status: 'VERIFIED',
      aiExtracted: {
        documentType: 'Permanent Account Number (PAN)',
        totalAmount: 'N/A',
        confidence: 99,
        supplierName: 'NexGen Digital Solutions Pvt Ltd',
        gstin: '27AABCN1234F1Z5',
        flags: ['PAN checksum syntax 100% verified', 'Matches ROC filing']
      }
    },
    'A_3': {
      name: 'Certificate_of_Incorporation_MCA.pdf',
      size: '890 KB',
      date: '2026-11-20',
      status: 'VERIFIED',
      aiExtracted: {
        documentType: 'Certificate of Incorporation (Form 11)',
        totalAmount: 'CIN: U72200PN2024PTC198421',
        confidence: 100,
        supplierName: 'Registrar of Companies, Pune',
        gstin: '27AABCN1234F1Z5',
        flags: ['Valid MCA digital signature verified', 'Active Status']
      }
    },
    'C_0': {
      name: 'GST_Registration_Certificate_REG06.pdf',
      size: '410 KB',
      date: '2026-11-21',
      status: 'VERIFIED',
      aiExtracted: {
        documentType: 'GST Registration Certificate (REG-06)',
        totalAmount: 'GSTIN: 27AABCN1234F1Z5',
        confidence: 98,
        supplierName: 'NexGen Digital Solutions Pvt Ltd',
        gstin: '27AABCN1234F1Z5',
        flags: ['Principal place of business verified', 'Active Taxpayer']
      }
    }
  });

  const [uploadingItemId, setUploadingItemId] = useState(null);
  const [recentAIAnalysis, setRecentAIAnalysis] = useState(null);
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState(null);

  // File upload simulation for Master Modules
  const handleModuleFileUpload = (e, moduleCode, itemIndex, item) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadKey = `${moduleCode}_${itemIndex}`;
    setUploadingItemId(uploadKey);
    setUploadSuccessAlert(null);

    setTimeout(() => {
      const fileNameLower = file.name.toLowerCase();
      let docType = item.name;
      let amount = '₹ 68,450.00';

      if (fileNameLower.includes('bank') || fileNameLower.includes('stmt')) {
        docType = 'Bank Account Current Statement';
        amount = 'Closing Bal: ₹ 4,82,900.00';
      } else if (fileNameLower.includes('gst') || fileNameLower.includes('3b')) {
        docType = 'GST Payment Challan / PMT-06';
        amount = 'Tax Paid: ₹ 24,900.00';
      } else if (fileNameLower.includes('pan')) {
        docType = 'Permanent Account Number (PAN)';
        amount = 'N/A';
      }

      const aiData = {
        documentType: docType,
        supplierName: profileData.companyName,
        invoiceNumber: 'DOC-' + Math.floor(10000 + Math.random() * 90000),
        invoiceDate: new Date().toLocaleDateString('en-IN'),
        gstin: profileData.gstin,
        totalAmount: amount,
        confidence: 97,
        flags: ['Digital OCR structural syntax verified', 'Compliant with period requirements']
      };

      setModuleUploads(prev => ({
        ...prev,
        [uploadKey]: {
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          date: new Date().toISOString().split('T')[0],
          status: 'VERIFIED',
          aiExtracted: aiData
        }
      }));

      setRecentAIAnalysis(aiData);
      setUploadingItemId(null);
      setUploadSuccessAlert(`Successfully uploaded and AI-verified "${file.name}" for ${item.name}!`);
      setTimeout(() => setUploadSuccessAlert(null), 6000);
    }, 1200);
  };

  // Upload handler for CA Specific Requests
  const handleCARequestUpload = (e, reqId, itemId, itemTitle) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingItemId(itemId);
    setTimeout(() => {
      setCaRequests(prev => prev.map(req => {
        if (req.id !== reqId) return req;
        const updatedItems = req.items.map(it => {
          if (it.id !== itemId) return it;
          return {
            ...it,
            status: 'SUBMITTED',
            uploadedFile: {
              name: file.name,
              size: `${(file.size / 1024).toFixed(1)} KB`,
              date: new Date().toISOString().split('T')[0]
            }
          };
        });
        const allDone = updatedItems.every(i => i.status === 'SUBMITTED');
        return {
          ...req,
          status: allDone ? 'COMPLETE' : 'PARTIALLY_SUBMITTED',
          items: updatedItems
        };
      }));

      setUploadingItemId(null);
      setUploadSuccessAlert(`Document "${file.name}" uploaded to CA Request!`);
      setTimeout(() => setUploadSuccessAlert(null), 5000);
    }, 1200);
  };

  // Profile Picture Upload Handler
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData(prev => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Cover Picture Upload Handler
  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData(prev => ({ ...prev, coverUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Profile Handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile(profileData);
    }
    setIsEditingProfile(false);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 4000);
  };

  // Download Classified Document Info (JSON, CSV, or Text Audit Slip)
  const handleDownloadClassified = (data, format = 'json', defaultName = 'classified_document_info') => {
    let content = '';
    let mimeType = 'application/json';
    let ext = 'json';

    const docType = data?.documentType || 'Tax / Compliance Document';
    const totalAmount = data?.totalAmount || '₹ 54,200.00';
    const supplier = data?.supplierName || profileData.companyName;
    const invNo = data?.invoiceNumber || 'INV-2026-09182';
    const gstin = data?.gstin || profileData.gstin;
    const flags = data?.flags || ['Valid digital syntax', 'Matches checklist period'];

    if (format === 'json') {
      content = JSON.stringify({
        classificationReport: {
          platform: 'ClarioLoop Compliance AI',
          documentType: docType,
          clientName: supplier,
          gstin: gstin,
          referenceNumber: invNo,
          totalVerifiedAmount: totalAmount,
          aiConfidenceScore: data?.confidence ? `${data.confidence}%` : '97.2%',
          verificationStatus: 'VERIFIED_AUDIT_READY',
          verificationTimestamp: new Date().toISOString(),
          complianceChecks: flags
        }
      }, null, 2);
      mimeType = 'application/json';
      ext = 'json';
    } else if (format === 'csv') {
      const rows = [
        ['Field', 'Extracted Value'],
        ['Document Classification', docType],
        ['Entity / Client Name', supplier],
        ['GSTIN Identifier', gstin],
        ['Invoice / Reference Number', invNo],
        ['Total Verified Amount', totalAmount],
        ['AI Confidence Score', data?.confidence ? `${data.confidence}%` : '97.2%'],
        ['Verification Status', 'PASSED & AUDIT READY'],
        ['Timestamp', new Date().toISOString()]
      ];
      content = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
      mimeType = 'text/csv;charset=utf-8;';
      ext = 'csv';
    } else {
      content = `==========================================================
CLARIOLOOP COMPLIANCE PLATFORM - CLASSIFIED DOCUMENT INFO
==========================================================
Document Type : ${docType}
Entity Name   : ${supplier}
GSTIN         : ${gstin}
Reference No  : ${invNo}
Total Amount  : ${totalAmount}
Status        : 100% VERIFIED & SYNCHRONIZED
AI Engine     : Groq LLaMA-3.3-70B OCR Pipeline
Date Verified : ${new Date().toLocaleDateString('en-IN')}
----------------------------------------------------------
Audit Checklist Flags:
${flags.map(f => `  ✓ ${f}`).join('\n')}
----------------------------------------------------------
Official Audit Slip generated for ${foundFirm.name}
==========================================================`;
      mimeType = 'text/plain;charset=utf-8;';
      ext = 'txt';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${defaultName}_${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Compile all uploaded documents across modules for the Central Vault
  const allVaultDocuments = [];
  
  financeMasterChecklist.forEach(mod => {
    mod.items.forEach((item, idx) => {
      const uploadKey = `${mod.code}_${idx}`;
      const upload = moduleUploads[uploadKey];
      if (upload) {
        allVaultDocuments.push({
          id: uploadKey,
          title: item.name,
          category: item.category,
          source: `Module ${mod.code}: ${mod.title}`,
          moduleCode: mod.code,
          fileName: upload.name,
          size: upload.size,
          date: upload.date,
          status: upload.status,
          aiExtracted: upload.aiExtracted
        });
      }
    });
  });

  caRequests.forEach(req => {
    req.items.forEach(it => {
      if (it.uploadedFile) {
        allVaultDocuments.push({
          id: it.id,
          title: it.title,
          category: it.category,
          source: `CA Request: ${req.title}`,
          moduleCode: 'CA',
          fileName: it.uploadedFile.name,
          size: it.uploadedFile.size,
          date: it.uploadedFile.date || '2026-11-25',
          status: 'SUBMITTED',
          aiExtracted: it.uploadedFile.aiExtracted
        });
      }
    });
  });

  const filteredVaultDocuments = allVaultDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(vaultSearch.toLowerCase()) || 
                          doc.fileName.toLowerCase().includes(vaultSearch.toLowerCase());
    const matchesModule = vaultModuleFilter === 'ALL' || doc.moduleCode === vaultModuleFilter;
    return matchesSearch && matchesModule;
  });

  const activeModule = financeMasterChecklist.find(m => m.code === activeModuleCode) || financeMasterChecklist[0];
  const activeModuleUploadedCount = activeModule.items.filter((_, idx) => !!moduleUploads[`${activeModule.code}_${idx}`]).length;
  const activeModuleTotalCount = activeModule.items.length;
  const activeModulePct = Math.round((activeModuleUploadedCount / activeModuleTotalCount) * 100);

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col w-full max-w-full overflow-x-hidden font-sans">
      
      {/* ================= 1. CLIENT PORTAL HEADER (CLEAN WHITE) ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <Logo size="small" inverted={false} showTagline={false} />
          <span className="text-slate-400 text-xs hidden md:inline truncate">
            • Client Compliance Portal
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Client Identity Chip */}
          <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-200 px-2.5 py-1 rounded-xl text-left">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
              {profileData.companyName.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block min-w-0">
              <span className="text-[11px] font-bold text-slate-800 truncate block max-w-[150px]">
                {profileData.companyName}
              </span>
              <span className="text-[9px] text-slate-500 block font-mono">
                {profileData.gstin}
              </span>
            </div>
          </div>

          {/* KYC Status Badge */}
          <div className="flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">KYC VERIFIED</span>
            <span className="sm:hidden">KYC</span>
          </div>

          {/* Connected CA Firm Badge */}
          <div className="hidden lg:flex items-center gap-1.5 bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-xl text-[10px] font-bold">
            <Building2 className="w-3 h-3 text-indigo-600 shrink-0" />
            <span className="truncate max-w-[140px]">{foundFirm.name}</span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-xl border border-rose-200 transition-all"
              title="Sign Out of Client Portal"
            >
              <span>Sign Out</span>
            </button>
          )}

          {onBackToFirm && (
            <button
              onClick={onBackToFirm}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-all border border-slate-200 shadow-2xs shrink-0"
              title="Exit Portal"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Back to App</span>
            </button>
          )}
        </div>
      </header>

      {/* ================= 2. CLIENT SUBNAV TABS (WHITE & CRISP) ================= */}
      <nav className="bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center gap-1 sm:gap-4 overflow-x-auto no-scrollbar text-xs font-extrabold sticky top-[53px] z-30 shadow-2xs">
        <button
          onClick={() => setActiveTab('modules')}
          className={`py-3 px-2 sm:px-3 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'modules'
              ? 'border-indigo-600 text-indigo-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Compliance Modules (A–F)</span>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.2 rounded-full">
            6 Ready
          </span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`py-3 px-2 sm:px-3 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'requests'
              ? 'border-indigo-600 text-indigo-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-amber-600" />
          <span>CA Requests</span>
          <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded-full">
            {caRequests.length} Active
          </span>
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className={`py-3 px-2 sm:px-3 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'vault'
              ? 'border-indigo-600 text-indigo-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderOpen className="w-4 h-4 text-emerald-600" />
          <span>Document Vault</span>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded-full">
            {allVaultDocuments.length} Files
          </span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-2 sm:px-3 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4 text-cyan-600" />
          <span>Company Profile</span>
          {isEditingProfile && (
            <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded-full animate-pulse">
              Editing
            </span>
          )}
        </button>
      </nav>

      {/* Alert toast if document uploaded */}
      {uploadSuccessAlert && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-3">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-2 text-xs text-emerald-800 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{uploadSuccessAlert}</span>
            </div>
            <button onClick={() => setUploadSuccessAlert(null)} className="text-emerald-600 hover:text-emerald-900">✕</button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 pt-4 pb-24 sm:pb-8 space-y-5">
        
        {/* ================= TAB 1: 1. FINANCE & ACCOUNTING MASTER MODULES (A through F) ================= */}
        {activeTab === 'modules' && (
          <div className="space-y-4">
            {/* Module Selector Cards */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Choose Compliance Module:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {financeMasterChecklist.map((mod) => {
                  const isSelected = activeModuleCode === mod.code;
                  const modUploadsCount = mod.items.filter((_, idx) => !!moduleUploads[`${mod.code}_${idx}`]).length;
                  const modTotal = mod.items.length;
                  const modDone = modUploadsCount === modTotal;

                  return (
                    <button
                      key={mod.code}
                      type="button"
                      onClick={() => {
                        setActiveModuleCode(mod.code);
                        setModuleFilter('all');
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25 ring-2 ring-indigo-400/40'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-xs font-bold leading-tight block">
                          {mod.title}
                        </strong>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                          modDone ? 'bg-emerald-500 text-white' : isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {modUploadsCount}/{modTotal}
                        </span>
                      </div>

                      {/* Small progress bar */}
                      <div className="w-full h-1 bg-slate-200/80 rounded-full overflow-hidden mt-1">
                        <div 
                          className={`h-full rounded-full ${modDone ? 'bg-emerald-400' : isSelected ? 'bg-white' : 'bg-indigo-600'}`}
                          style={{ width: `${Math.round((modUploadsCount / modTotal) * 100)}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Module Detail & Checklist (Clean White) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {activeModule.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeModule.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block">
                      {activeModuleUploadedCount} of {activeModuleTotalCount} Uploaded
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      {activeModulePct}% Complete
                    </span>
                  </div>
                </div>
              </div>

              {/* Filter tabs for checklist: All | Pending | Uploaded */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-bold text-[11px]">Filter:</span>
                <button
                  type="button"
                  onClick={() => setModuleFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    moduleFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({activeModule.items.length})
                </button>
                <button
                  type="button"
                  onClick={() => setModuleFilter('pending')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    moduleFilter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Pending ({activeModuleTotalCount - activeModuleUploadedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setModuleFilter('uploaded')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    moduleFilter === 'uploaded' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Uploaded ({activeModuleUploadedCount})
                </button>
              </div>

              {/* Items List (Light, Clean White Cards) */}
              <div className="space-y-2.5">
                {activeModule.items
                  .map((item, idx) => ({ ...item, originalIndex: idx }))
                  .filter(item => {
                    const isUploaded = !!moduleUploads[`${activeModule.code}_${item.originalIndex}`];
                    if (moduleFilter === 'pending') return !isUploaded;
                    if (moduleFilter === 'uploaded') return isUploaded;
                    return true;
                  })
                  .map((item) => {
                    const uploadKey = `${activeModule.code}_${item.originalIndex}`;
                    const upload = moduleUploads[uploadKey];
                    const isUploading = uploadingItemId === uploadKey;

                    return (
                      <div
                        key={uploadKey}
                        className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                          upload
                            ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs'
                            : 'bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                              upload 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {upload ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : (item.originalIndex + 1)}
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900 break-words">
                                  {item.name}
                                </h4>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full ${
                                  item.defaultTag === 'Mandatory'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {item.defaultTag}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                                <span>Category: <strong className="text-slate-700">{item.category}</strong></span>
                                <span>•</span>
                                <span>Accepted: <strong className="font-mono text-indigo-700">{item.acceptedTypes || 'PDF'}</strong></span>
                              </div>

                              {/* Uploaded File Pill & Instant AI Classification Info */}
                              {upload && (
                                <div className="mt-2.5 p-2.5 bg-white rounded-xl border border-emerald-200 text-[11px] text-slate-800 space-y-1.5 shadow-2xs">
                                  <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <div className="flex items-center gap-1.5 truncate">
                                      <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                      <span className="font-bold text-slate-900 truncate max-w-[200px]">{upload.name}</span>
                                      <span className="text-[10px] text-emerald-600 font-semibold">({upload.size})</span>
                                    </div>
                                    <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                                      ✓ AI Verified
                                    </span>
                                  </div>

                                  {/* Download Classified Info Options */}
                                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-100">
                                    <span className="text-[10px] text-slate-400 font-semibold">Download:</span>
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadClassified(upload.aiExtracted, 'json', `${item.name.replace(/\s+/g, '_')}_classified`)}
                                      className="px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] border border-indigo-200 flex items-center gap-1 shadow-2xs"
                                    >
                                      <Download className="w-2.5 h-2.5" />
                                      <span>JSON Data</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadClassified(upload.aiExtracted, 'csv', `${item.name.replace(/\s+/g, '_')}_classified`)}
                                      className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200 flex items-center gap-1 shadow-2xs"
                                    >
                                      <Download className="w-2.5 h-2.5" />
                                      <span>CSV Sheet</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadClassified(upload.aiExtracted, 'txt', `${item.name.replace(/\s+/g, '_')}_audit_slip`)}
                                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] border border-slate-200 flex items-center gap-1"
                                    >
                                      <Download className="w-2.5 h-2.5 text-amber-600" />
                                      <span>Audit Slip</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Button: Upload / Re-upload */}
                          <div className="shrink-0 flex items-center gap-2 pt-2 sm:pt-0">
                            <label className={`cursor-pointer flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                              upload
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20'
                            } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}>
                              {isUploading ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Scanning...</span>
                                </>
                              ) : (
                                <>
                                  <UploadCloud className="w-3.5 h-3.5" />
                                  <span>{upload ? 'Replace File' : 'Upload File'}</span>
                                </>
                              )}
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.docx,.json"
                                onChange={(e) => handleModuleFileUpload(e, activeModule.code, item.originalIndex, item)}
                                disabled={isUploading}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: SEPARATE CA PRACTICE REQUESTS (CLEAN WHITE) ================= */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-amber-500" />
                  <span>Assigned CA Practice Requests</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct document collection requests issued by {foundFirm.name} ({foundFirm.partnerName}).
                </p>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl w-fit">
                {caRequests.length} Active Batches
              </span>
            </div>

            {/* CA Requests Cards */}
            <div className="space-y-4">
              {caRequests.map(req => {
                const submitted = req.items.filter(i => i.status === 'SUBMITTED').length;
                const total = req.items.length;
                const isComplete = submitted === total;

                return (
                  <div key={req.id} className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 space-y-4 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            isComplete ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}>
                            {isComplete ? '✓ Completed' : 'In Progress'}
                          </span>
                          <span className="text-xs text-slate-500">Period: <strong className="text-slate-800">{req.period}</strong></span>
                        </div>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
                          {req.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Due: {req.dueDate}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5 text-slate-600">
                        <span>Documents: <strong className="text-slate-900">{submitted} of {total} Submitted</strong></span>
                        <span className="font-bold text-indigo-600">{Math.round((submitted / total) * 100)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                          style={{ width: `${Math.round((submitted / total) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Items Checklist for this CA Request */}
                    <div className="space-y-2 pt-1">
                      {req.items.map((item, idx) => {
                        const isDone = item.status === 'SUBMITTED';
                        const isUp = uploadingItemId === item.id;

                        return (
                          <div 
                            key={item.id}
                            className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                              isDone ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50/70 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                                isDone ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-600'
                              }`}>
                                {isDone ? '✓' : (idx + 1)}
                              </span>
                              <div className="min-w-0">
                                <span className="font-bold text-xs text-slate-900 truncate block">
                                  {item.title}
                                </span>
                                <span className="text-[10px] text-slate-500 block">
                                  {item.category}
                                </span>
                              </div>
                            </div>

                            <div className="shrink-0">
                              <label className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                isDone 
                                  ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200' 
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                              } ${isUp ? 'opacity-70 pointer-events-none' : ''}`}>
                                {isUp ? (
                                  <>
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                    <span>Uploading...</span>
                                  </>
                                ) : (
                                  <>
                                    <UploadCloud className="w-3 h-3" />
                                    <span>{isDone ? 'Replace File' : 'Upload'}</span>
                                  </>
                                )}
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.docx"
                                  onChange={(e) => handleCARequestUpload(e, req.id, item.id, item.title)}
                                  disabled={isUp}
                                />
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 3: CENTRALIZED DOCUMENT VAULT (CLEAN WHITE) ================= */}
        {activeTab === 'vault' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-emerald-600" />
                  <span>Central Document Repository ({allVaultDocuments.length} Documents)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  All verified documents uploaded across Compliance Modules and assigned CA requests.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                  Encrypted AES-256 Vault
                </span>
              </div>
            </div>

            {/* Vault Search & Filter Controls */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 flex flex-col sm:flex-row items-center gap-3 shadow-xs">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={vaultSearch}
                  onChange={(e) => setVaultSearch(e.target.value)}
                  placeholder="Search repository by document name, file, or statutory category..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs no-scrollbar">
                <button
                  type="button"
                  onClick={() => setVaultModuleFilter('ALL')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                    vaultModuleFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Sources
                </button>
                {['A', 'B', 'C', 'D', 'E', 'F', 'CA'].map(code => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setVaultModuleFilter(code)}
                    className={`px-2 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                      vaultModuleFilter === code ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {code === 'CA' ? 'CA Requests' : `Mod ${code}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Documents Table / Grid */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
              {filteredVaultDocuments.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <FolderOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-sm text-slate-700">No documents found matching "{vaultSearch}"</p>
                  <p className="text-xs text-slate-500 mt-1">Upload documents in the Compliance Modules tab to populate your vault.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredVaultDocuments.map((doc, idx) => (
                    <div key={doc.id || idx} className="p-3.5 sm:p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {doc.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                            <span className="text-emerald-700 font-mono font-bold">{doc.fileName}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span className="text-indigo-600 font-semibold">{doc.source}</span>
                            <span>•</span>
                            <span>Uploaded: {doc.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleDownloadClassified(doc.aiExtracted || { documentType: doc.title }, 'json', `${doc.title.replace(/\s+/g, '_')}_data`)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-[10px] flex items-center gap-1 shadow-2xs"
                          title="Download JSON Data"
                        >
                          <Download className="w-3 h-3" />
                          <span>JSON</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadClassified(doc.aiExtracted || { documentType: doc.title }, 'csv', `${doc.title.replace(/\s+/g, '_')}_sheet`)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[10px] flex items-center gap-1 shadow-2xs"
                          title="Download CSV Sheet"
                        >
                          <Download className="w-3 h-3" />
                          <span>CSV</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadClassified(doc.aiExtracted || { documentType: doc.title }, 'txt', `${doc.title.replace(/\s+/g, '_')}_slip`)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-[10px] flex items-center gap-1"
                          title="Download Audit Slip"
                        >
                          <Download className="w-3 h-3 text-amber-600" />
                          <span>Slip</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 4: CLIENT PROFILE WITH EDIT OPTION (BEAUTIFUL WHITE THEME) ================= */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            
            {/* Profile Saved Toast */}
            {profileSavedToast && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs sm:text-sm text-emerald-800 shadow-sm animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-bold">Client profile and business configuration saved successfully!</span>
              </div>
            )}

            {/* Profile Header Card with Cover and Avatar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
              
              {/* Cover Photo */}
              <div className="relative h-40 sm:h-52 w-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-800 overflow-hidden">
                {profileData.coverUrl ? (
                  <img src={profileData.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-25">
                    <Building className="w-20 h-20 text-white" />
                  </div>
                )}
                
                <input
                  type="file"
                  ref={coverInputRef}
                  onChange={handleCoverChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {isEditingProfile && (
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white font-bold text-xs backdrop-blur-md border border-slate-700 flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Camera className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Change Cover</span>
                  </button>
                )}
              </div>

              {/* Avatar & Header Details */}
              <div className="px-4 sm:px-6 pb-6 pt-0 relative">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
                  <div className="flex items-end gap-3.5">
                    <div className="relative group">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg border-4 border-white overflow-hidden shrink-0">
                        {profileData.avatarUrl ? (
                          <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span>{profileData.companyName.slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={avatarInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden"
                      />
                      {isEditingProfile && (
                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          className="absolute inset-0 bg-slate-900/60 rounded-2xl flex items-center justify-center text-white transition-opacity"
                          title="Upload Avatar Photo"
                        >
                          <Camera className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-xl font-black text-slate-900">
                          {profileData.companyName}
                        </h2>
                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> KYC VERIFIED
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 block font-medium mt-0.5">
                        {profileData.entityType} • {profileData.name} ({profileData.designation})
                      </span>
                    </div>
                  </div>

                  {/* Top Action: Edit Profile Toggle Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!isEditingProfile ? (
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveProfile}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Content: Switch between Read-Only View and Active Edit Form */}
                {!isEditingProfile ? (
                  /* ================= READ-ONLY PROFILE SUMMARY ================= */
                  <div className="space-y-4 pt-3 border-t border-slate-100 text-xs">
                    
                    {/* Information Grid Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      
                      <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-indigo-600" /> Legal Entity & Classification
                        </span>
                        <strong className="text-sm font-bold text-slate-900 block">{profileData.companyName}</strong>
                        <span className="text-xs text-slate-600 block">{profileData.entityType}</span>
                      </div>

                      <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                          <User className="w-3 h-3 text-indigo-600" /> Authorized Signatory
                        </span>
                        <strong className="text-sm font-bold text-slate-900 block">{profileData.name}</strong>
                        <span className="text-xs text-slate-600 block">{profileData.designation}</span>
                      </div>

                      <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                          <Phone className="w-3 h-3 text-indigo-600" /> Contact Details
                        </span>
                        <strong className="text-xs font-bold text-slate-900 block">{profileData.email}</strong>
                        <span className="text-xs text-slate-600 block">{profileData.phone}</span>
                      </div>

                      <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Company PAN
                        </span>
                        <strong className="text-sm font-mono font-bold text-indigo-700 block">{profileData.pan}</strong>
                        <span className="text-[10px] text-emerald-600 font-bold">✓ Income Tax Verified</span>
                      </div>

                      <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          GSTIN Registration
                        </span>
                        <strong className="text-sm font-mono font-bold text-indigo-700 block">{profileData.gstin}</strong>
                        <span className="text-[10px] text-emerald-600 font-bold">✓ Active Regular Taxpayer</span>
                      </div>

                      <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-indigo-600" /> Location / Region
                        </span>
                        <strong className="text-xs font-bold text-slate-900 block">{profileData.city}</strong>
                        <span className="text-[11px] text-slate-500 truncate block">{profileData.address}</span>
                      </div>
                    </div>

                    {/* Company Bio */}
                    <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-indigo-600" /> Business Overview & Core Operations
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {profileData.bio}
                      </p>
                    </div>

                    {/* Statutory KYC Clearance Certificate Box */}
                    <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="text-slate-900 block text-xs sm:text-sm">Compliance Clearance: Level-3 Passed</strong>
                          <span className="text-slate-600 text-[11px] block">Verified via {profileData.kycDocType} • Audit Validated {profileData.kycDate}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-white border border-emerald-300 px-3 py-1 rounded-full w-fit">
                        ISO 27001 Validated
                      </span>
                    </div>
                  </div>
                ) : (
                  /* ================= ACTIVE EDIT PROFILE FORM ================= */
                  <form onSubmit={handleSaveProfile} className="space-y-4 pt-3 border-t border-slate-100 text-xs animate-fadeIn">
                    <div className="flex items-center justify-between bg-indigo-50/80 p-3 rounded-xl border border-indigo-200 text-indigo-900 text-xs">
                      <span className="font-bold flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                        Editing Profile Details (Make changes below and click Save):
                      </span>
                      <span className="text-[10px] text-indigo-700 font-semibold">Active Edit Mode</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Company / Entity Legal Name *</label>
                        <input
                          type="text"
                          value={profileData.companyName}
                          onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Entity Classification *</label>
                        <select
                          value={profileData.entityType}
                          onChange={(e) => setProfileData({ ...profileData, entityType: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                          <option>Private Limited</option>
                          <option>LLP (Limited Liability Partnership)</option>
                          <option>Partnership Firm</option>
                          <option>Proprietorship</option>
                          <option>Public Limited</option>
                          <option>Trust / Society</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Authorized Contact Person *</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Designation</label>
                        <input
                          type="text"
                          value={profileData.designation}
                          onChange={(e) => setProfileData({ ...profileData, designation: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Official Email Address *</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                        <input
                          type="text"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Company PAN (10 Digits) *</label>
                        <input
                          type="text"
                          value={profileData.pan}
                          onChange={(e) => setProfileData({ ...profileData, pan: e.target.value.toUpperCase() })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">GSTIN (15 Digits) *</label>
                        <input
                          type="text"
                          value={profileData.gstin}
                          onChange={(e) => setProfileData({ ...profileData, gstin: e.target.value.toUpperCase() })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">City & State</label>
                        <input
                          type="text"
                          value={profileData.city}
                          onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Registered Office Address</label>
                        <input
                          type="text"
                          value={profileData.address}
                          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-bold text-slate-700 block mb-1">Company Bio & Core Business Activities</label>
                        <textarea
                          rows={3}
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Profile Changes</span>
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
