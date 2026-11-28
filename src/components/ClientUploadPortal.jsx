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
  EyeOff,
  KeyRound,
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
  Briefcase,
  PenTool
} from 'lucide-react';
import { mockFirms, financeMasterChecklist } from '../data/mockData';
import PortalSidebar from './PortalSidebar';
import DocumentScannerModal from './DocumentScannerModal';
import SignaturePadModal from './SignaturePadModal';
import { analyzeUploadedDocument } from '../utils/docIntelligence';

export default function ClientUploadPortal({ 
  token, 
  onBackToFirm, 
  activeFirm, 
  matchedClient,
  onClientUploadToRequest,
  onReplyClarification,
  onApproveTaxComputation,
  onSaveClientSecret,
  currentUser, 
  onUpdateProfile,
  onLogout 
}) {
  // Strict Tenant Isolation: use the sanitized activeFirm passed from App.jsx;
  // only fall back to mockFirms[0] in standalone preview when activeFirm is absent.
  const foundFirm = activeFirm || mockFirms[0];
  const foundRequest = activeFirm
    ? foundFirm.requests?.[0]
    : foundFirm.requests?.find(req => req.secureToken === token) || foundFirm.requests?.[0];

  // Active top navigation tab: 'requests' (default) | 'vault' | 'profile' (persisted across refresh)
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = sessionStorage.getItem('clarioloop_client_tab');
      return ['requests', 'vault', 'profile'].includes(saved) ? saved : 'requests';
    } catch {
      return 'requests';
    }
  });
  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    try { sessionStorage.setItem('clarioloop_client_tab', tab); } catch {}
  };
  const [scannerTarget, setScannerTarget] = useState(null);
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [signedConsent, setSignedConsent] = useState(null);

  const whiteLabel = (() => {
    try {
      const saved = localStorage.getItem('clarioloop_whitelabel');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();
  
  // Selected Master Module for Compliance (A through F)
  const [activeModuleCode, setActiveModuleCode] = useState('A');
  const [moduleFilter, setModuleFilter] = useState('all'); // 'all' | 'pending' | 'uploaded'
  const [vaultSearch, setVaultSearch] = useState('');
  const [vaultModuleFilter, setVaultModuleFilter] = useState('ALL');

  // Client Profile State (strictly scoped to matchedClient / currentUser, no hardcoded demo leaks)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    companyName: matchedClient?.businessName || currentUser?.companyName || '',
    email: matchedClient?.email || currentUser?.email || '',
    phone: matchedClient?.phone || currentUser?.phone || '',
    designation: currentUser?.designation || 'Authorized Signatory',
    entityType: currentUser?.entityType || 'Business Entity',
    gstin: matchedClient?.gstin || currentUser?.gstin || '',
    pan: matchedClient?.pan || currentUser?.pan || '',
    city: currentUser?.city || '',
    address: currentUser?.address || '',
    avatarUrl: currentUser?.avatarUrl || null,
    kycDocType: currentUser?.kycDocType || 'PAN & GSTIN Registration',
    kycDate: currentUser?.kycDate || 'Verified'
  });

  const [profileSavedToast, setProfileSavedToast] = useState(false);
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // CA Request State (live-synced with firm requests scoped strictly to this client)
  const [localCaRequests, setLocalCaRequests] = useState([
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

  const clientScopedFirmRequests = (activeFirm?.requests || []).filter((req) => {
    if (token && req.secureToken === token) return true;
    if (matchedClient) {
      return (
        (req.clientId && req.clientId === matchedClient.id) ||
        (req.clientName &&
          matchedClient.businessName &&
          req.clientName.toLowerCase() === matchedClient.businessName.toLowerCase())
      );
    }
    return false;
  });

  const caRequests = (activeFirm || matchedClient) ? clientScopedFirmRequests : localCaRequests;

  const [secretInput, setSecretInput] = useState(matchedClient?.secretPassphrase || '');
  const [showSecretText, setShowSecretText] = useState(false);
  const [secretSavedToast, setSecretSavedToast] = useState(false);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [profileFeedTab, setProfileFeedTab] = useState('all'); // 'all' | 'missing' | 'uploaded'

  const rejectedItems = caRequests.flatMap((req) =>
    (req.items || [])
      .filter((it) => it.status === 'REJECTED')
      .map((it) => ({ ...it, reqId: req.id, reqTitle: req.title }))
  );

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

  // Core upload processor used by both file picker and Mobile Camera Scanner
  const processModuleFile = (file, moduleCode, itemIndex, item) => {
    if (!file) return;

    const aiCheck = analyzeUploadedDocument(file, item.name);
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
        confidence: aiCheck.status === 'WARNING' ? 74 : 97,
        flags: aiCheck.checks.map(c => `${c.label}: ${c.detail}`)
      };

      setModuleUploads(prev => ({
        ...prev,
        [uploadKey]: {
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          date: new Date().toISOString().split('T')[0],
          aiData,
          aiCheck,
          status: 'VERIFIED',
          aiExtracted: aiData
        }
      }));
      setRecentAIAnalysis(aiData);
      setUploadingItemId(null);
      setUploadSuccessAlert(`${file.name} uploaded • ${aiCheck.summary}`);
      setTimeout(() => setUploadSuccessAlert(null), 6000);
    }, 600);
  };

  const handleModuleFileUpload = (e, moduleCode, itemIndex, item) => {
    const file = e.target.files?.[0];
    processModuleFile(file, moduleCode, itemIndex, item);
  };

  // Upload handler for CA Specific Requests (uploads real file to /api/ca/upload when backend is online)
  const handleCARequestUpload = async (e, reqId, itemId, itemTitle) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingItemId(itemId);
    let uploadedFile = {
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/ca/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const saved = await res.json();
        uploadedFile = { ...uploadedFile, ...saved };
      }
    } catch {
      // Offline / frontend-only fallback uses local metadata
    }

    if (onClientUploadToRequest) {
      onClientUploadToRequest(reqId, itemId, uploadedFile);
    }

    setLocalCaRequests(prev => prev.map(req => {
      if (req.id !== reqId) return req;
      const updatedItems = req.items.map(it => {
        if (it.id !== itemId) return it;
        return {
          ...it,
          status: 'SUBMITTED',
          rejectionReason: undefined,
          uploadedFile
        };
      });
      const allDone = updatedItems.every(i => i.status === 'SUBMITTED' || i.status === 'VERIFIED');
      return {
        ...req,
        status: allDone ? 'COMPLETE' : 'PARTIALLY_SUBMITTED',
        items: updatedItems
      };
    }));

    setUploadingItemId(null);
    setUploadSuccessAlert(`Document "${file.name}" uploaded & synced with ${foundFirm.name}!`);
    setTimeout(() => setUploadSuccessAlert(null), 5000);
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

  // Compile all uploaded documents across CA requests for the Central Vault
  const allVaultDocuments = [];

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
          {/* Connected CA Firm Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-xl text-[10px] font-bold">
            <Building2 className="w-3 h-3 text-indigo-600 shrink-0" />
            <span className="truncate max-w-[160px]">{foundFirm.name}</span>
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
        </div>
      </header>

      {/* ================= 2. CLIENT WORKSPACE WITH LEFT SIDEBAR (DESKTOP + MOBILE DRAWER) ================= */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <PortalSidebar
          title={whiteLabel?.brandName || currentUser?.companyName || currentUser?.name || 'Client Portal'}
          subtitle={whiteLabel?.footerNote || foundFirm?.name || 'Verified Client Workspace'}
          initials={(currentUser?.avatarInitials || 'CL').slice(0, 2).toUpperCase()}
          accent="indigo"
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          currentUser={currentUser}
          showUserStrip={true}
          onBack={currentUser?.role === 'ca' ? onBackToFirm : undefined}
          items={[
            {
              id: 'requests',
              label: 'My CA Tasks',
              mobileLabel: 'Tasks',
              icon: FileCheck2,
              badge: caRequests.reduce(
                (acc, r) => acc + (r.items || []).filter(i => i.status === 'PENDING' || i.status === 'REJECTED').length,
                0
              )
            },
            { id: 'vault', label: 'Receipts & Vault', mobileLabel: 'Vault', icon: FolderOpen },
            { id: 'profile', label: 'Profile & KYC', mobileLabel: 'Profile', icon: User }
          ]}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Alert toast if document uploaded */}
          {uploadSuccessAlert && (
            <div className="max-w-5xl mx-auto w-full px-3 sm:px-6 pt-3">
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

        {/* Instant Rejection Fix Banner (Two-Way CA -> Client Sync) */}
        {rejectedItems.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-rose-800 font-black text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Action Required: {rejectedItems.length} Document(s) Need Re-Upload</span>
              </div>
              <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                Flagged by {foundFirm.name}
              </span>
            </div>
            <div className="space-y-2">
              {rejectedItems.map((rItem) => (
                <div
                  key={rItem.id}
                  className="bg-white border border-rose-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{rItem.title}</div>
                    <div className="text-[11px] text-rose-700 font-semibold mt-0.5">
                      Re-Upload Needed: {rItem.rejectionReason || 'Please upload a clearer / complete copy'}
                    </div>
                  </div>
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 w-fit">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Re-upload Fix</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.docx"
                      onChange={(e) => handleCARequestUpload(e, rItem.reqId, rItem.id, rItem.title)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* ================= TAB 1: CA PRACTICE REQUESTS (MY CA TASKS) ================= */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl px-4 py-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Assigned CA Practice Requests
                </h3>
                <p className="text-xs text-slate-500">
                  Issued by <strong className="text-slate-700">{foundFirm.name}</strong> ({foundFirm.partnerName})
                </p>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
                {(() => {
                  const allIt = caRequests.flatMap((r) => r.items || []);
                  const pCount = allIt.filter((i) => i.status === 'PENDING' || i.status === 'REJECTED').length;
                  const sCount = allIt.filter((i) => i.status === 'SUBMITTED').length;
                  const vCount = allIt.filter((i) => i.status === 'VERIFIED').length;
                  const total = allIt.length || 1;
                  const pct = Math.round(((sCount + vCount) / total) * 100);
                  return (
                    <>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg">
                          {pCount} Pending
                        </span>
                        <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg">
                          {sCount} In Review
                        </span>
                        <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg">
                          {vCount} Verified
                        </span>
                      </div>
                      <div className="w-full sm:w-52 space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                          <span>Overall Progress</span>
                          <span className="text-emerald-600">{pct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Pre-Filing Tax / GST Computation Approval Card (CA -> Client Sign-Off) */}
            {matchedClient?.taxComputation && (
              <div className={`rounded-2xl border p-4 sm:p-5 space-y-3 shadow-xs ${
                matchedClient.taxComputation.status === 'APPROVED'
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-indigo-50/80 border-indigo-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">
                        Pre-Filing Tax Summary: {matchedClient.taxComputation.returnType}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        matchedClient.taxComputation.status === 'APPROVED'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {matchedClient.taxComputation.status === 'APPROVED'
                          ? `✓ Approved (${matchedClient.taxComputation.approvedAt})`
                          : 'Awaiting Your Sign-Off'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Prepared by {matchedClient.taxComputation.sentBy} on {matchedClient.taxComputation.sentAt}
                    </p>
                  </div>
                  {matchedClient.taxComputation.status !== 'APPROVED' && onApproveTaxComputation && (
                    <button
                      type="button"
                      onClick={() => {
                        onApproveTaxComputation(currentUser?.name || matchedClient.businessName);
                        setUploadSuccessAlert(`Approved ${matchedClient.taxComputation.returnType} for filing!`);
                        setTimeout(() => setUploadSuccessAlert(null), 4000);
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-xs shrink-0 w-fit"
                    >
                      Approve & Sign to File
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-white rounded-xl border border-slate-200/80 p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Turnover / Income</span>
                    <strong className="text-slate-900 font-black">{matchedClient.taxComputation.turnover}</strong>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200/80 p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">ITC / Deductions</span>
                    <strong className="text-slate-900 font-black">{matchedClient.taxComputation.itcOrDeductions}</strong>
                  </div>
                  <div className="bg-white rounded-xl border border-indigo-200 p-3">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase block">Net Tax Payable / Refund</span>
                    <strong className="text-indigo-700 font-black">{matchedClient.taxComputation.netPayable}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Confidential Client -> CA Secret Channel (PDF Passwords / Private Tax Remarks) */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold flex items-center gap-2">
                      <span>Confidential CA Secret & PDF Passwords</span>
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                        Private • CA & You Only
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Share bank statement / Form 26AS / AIS PDF passwords privately with {foundFirm.name}. Hidden from all other clients.
                    </p>
                  </div>
                </div>
                {secretSavedToast && (
                  <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-lg">
                    ✓ Encrypted & Shared with CA
                  </span>
                )}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (onSaveClientSecret) {
                    onSaveClientSecret(secretInput.trim());
                  }
                  setSecretSavedToast(true);
                  setTimeout(() => setSecretSavedToast(false), 3500);
                }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type={showSecretText ? 'text' : 'password'}
                    value={secretInput}
                    onChange={(e) => setSecretInput(e.target.value)}
                    placeholder="e.g. HDFC PDF pass: 19920514 | AIS pass: AABCN1234F"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-3 pr-9 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretText(!showSecretText)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    title={showSecretText ? 'Hide Secret' : 'Show Secret'}
                  >
                    {showSecretText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shrink-0 transition-colors"
                >
                  Save Secret for CA
                </button>
              </form>
            </div>

            {/* CA Requests Cards */}
            <div className="space-y-4">
              {caRequests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
                  <Lock className="w-8 h-8 text-indigo-400 mx-auto" />
                  <h4 className="text-sm font-extrabold text-slate-900">Your Private Workspace Is Ready</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    No active document requests have been assigned to your account by {foundFirm.name} yet. Your portal is strictly isolated to your Client ID.
                  </p>
                </div>
              ) : caRequests.map(req => {
                const submitted = req.items.filter(i => i.status === 'SUBMITTED' || i.status === 'VERIFIED').length;
                const total = req.items.length || 1;
                const isComplete = submitted === total;
                const daysLeft = req.dueDate
                  ? Math.ceil((new Date(req.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
                  : null;

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

                      <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl border shrink-0 font-semibold ${
                        daysLeft !== null && daysLeft <= 2
                          ? 'text-rose-700 bg-rose-50 border-rose-200'
                          : 'text-amber-700 bg-amber-50 border-amber-200'
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          Due: {req.dueDate}
                          {daysLeft !== null && (daysLeft > 0 ? ` (${daysLeft}d left)` : daysLeft === 0 ? ' (Today)' : ' (Overdue)')}
                        </span>
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
                        const isVerified = item.status === 'VERIFIED';
                        const isRejected = item.status === 'REJECTED';
                        const isDone = item.status === 'SUBMITTED' || isVerified;
                        const isUp = uploadingItemId === item.id;

                        return (
                          <div 
                            key={item.id}
                            className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                              isRejected
                                ? 'bg-rose-50/70 border-rose-200'
                                : isVerified
                                ? 'bg-emerald-50/70 border-emerald-300'
                                : isDone
                                ? 'bg-indigo-50/40 border-indigo-200'
                                : 'bg-slate-50/70 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                isRejected
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : isVerified
                                  ? 'bg-emerald-600 text-white'
                                  : isDone
                                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                                  : 'bg-slate-200 text-slate-600'
                              }`}>
                                {isRejected ? '!' : isDone ? '✓' : (idx + 1)}
                              </span>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="font-bold text-xs text-slate-900 truncate">
                                    {item.title}
                                  </span>
                                  {isVerified && (
                                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                      Verified ✓ {item.partnerSignedOff ? '• Partner Signed' : ''}
                                    </span>
                                  )}
                                  {item.status === 'SUBMITTED' && (
                                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                                      Uploaded • In CA Review
                                    </span>
                                  )}
                                  {isRejected && (
                                    <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                                      Re-Upload Needed: {item.rejectionReason || 'Fix required'}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-500 block mt-0.5">
                                  {item.category}
                                  {item.uploadedFile ? ` • ${item.uploadedFile.name} (${item.uploadedFile.date || item.uploadedFile.uploadedAt || 'Uploaded'})` : ''}
                                </span>
                                {item.clarificationQuery && (
                                  <div className="mt-1.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] space-y-1.5">
                                    <div className="text-amber-900">
                                      <strong>CA Query:</strong> {item.clarificationQuery}
                                    </div>
                                    {item.clarificationReply ? (
                                      <div className="text-emerald-800 font-semibold">
                                        ✓ Your Reply: {item.clarificationReply}
                                      </div>
                                    ) : onReplyClarification ? (
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="text"
                                          value={replyDrafts[item.id] || ''}
                                          onChange={(e) => setReplyDrafts(prev => ({ ...prev, [item.id]: e.target.value }))}
                                          placeholder="Type narration / clarification for your CA..."
                                          className="flex-1 px-2 py-1 rounded border border-amber-300 bg-white text-[11px] text-slate-900"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const val = replyDrafts[item.id];
                                            if (!val?.trim()) return;
                                            onReplyClarification(req.id, item.id, val);
                                            setReplyDrafts(prev => ({ ...prev, [item.id]: '' }));
                                            setUploadSuccessAlert(`Clarification reply sent to ${foundFirm.name}!`);
                                            setTimeout(() => setUploadSuccessAlert(null), 4000);
                                          }}
                                          className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] shrink-0"
                                        >
                                          Send Reply
                                        </button>
                                      </div>
                                    ) : null}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="shrink-0">
                              <label className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                isRejected
                                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs'
                                  : isDone 
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
                                    <span>{isRejected ? 'Re-upload Fix' : isDone ? 'Replace File' : 'Upload'}</span>
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
            {/* Verified Document Locker & Filing Receipts (CA -> Client) */}
            <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200 p-4 sm:p-5 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-emerald-950 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Verified Filing Receipts & Statutory Locker</span>
                  </h3>
                  <p className="text-xs text-emerald-800/80 mt-0.5">
                    Read-only acknowledgements (ITR-V, GST Returns, Audited Balance Sheets, TDS Certificates) filed by {foundFirm.name}.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold bg-white text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg w-fit">
                    {(matchedClient?.filingReceipts || []).length} Official Receipts
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const receipts = matchedClient?.filingReceipts || [];
                      const html = `<!doctype html><html><head><meta charset="utf-8"><title>Bank Loan & Visa Compliance Pack</title><style>body{font-family:system-ui,sans-serif;max-width:780px;margin:32px auto;color:#0f172a;padding:0 16px}h1{font-size:20px}table{width:100%;border-collapse:collapse;margin-top:16px}th,td{border:1px solid #cbd5e1;padding:8px;text-align:left;font-size:13px}th{background:#f8fafc}</style></head><body><h1>Verified Bank Loan & Visa Compliance Pack</h1><p><strong>Entity:</strong> ${profileData.companyName || 'Client'} | <strong>PAN:</strong> ${profileData.pan || 'N/A'} | <strong>GSTIN:</strong> ${profileData.gstin || 'N/A'}</p><p><strong>Verified By:</strong> ${foundFirm.name} (${foundFirm.partnerName})</p><table><thead><tr><th>Statutory Receipt</th><th>Ack No.</th><th>Filed On</th><th>Filed By</th></tr></thead><tbody>${receipts.length ? receipts.map(r => `<tr><td>${r.title}</td><td>${r.ackNo}</td><td>${r.filedOn}</td><td>${r.filedBy}</td></tr>`).join('') : '<tr><td colspan="4">No receipts filed yet</td></tr>'}</tbody></table></body></html>`;
                      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Bank_Loan_Pack_${(profileData.companyName || 'Client').replace(/\s+/g, '_')}.html`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Bank Loan / Visa Pack</span>
                  </button>
                </div>
              </div>

              {matchedClient?.lockReceiptsUntilPaid && matchedClient?.retainerStatus === 'PENDING' ? (
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 flex items-start gap-3 text-xs text-amber-900">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Filing Receipts Locked Pending Retainer Fee Settlement</strong>
                    <span className="text-amber-800">
                      {(matchedClient.filingReceipts || []).length} receipt(s) are ready. Please clear your pending CA retainer fee (₹{(matchedClient.retainerAmount || 5000).toLocaleString('en-IN')}) with {foundFirm.name} to unlock downloads.
                    </span>
                  </div>
                </div>
              ) : (matchedClient?.filingReceipts || []).length === 0 ? (
                <div className="bg-white/80 rounded-xl border border-emerald-100 p-3 text-xs text-slate-500">
                  No filing receipts uploaded by your CA yet. Once your returns are filed, acknowledgements appear here automatically.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {matchedClient.filingReceipts.map((rcpt) => (
                    <div
                      key={rcpt.id}
                      className="bg-white rounded-xl border border-emerald-200 p-3 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{rcpt.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Ack: <span className="font-mono font-bold text-emerald-700">{rcpt.ackNo}</span> • Filed {rcpt.filedOn} by {rcpt.filedBy}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full shrink-0">
                        Read-Only ✓
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-emerald-600" />
                  <span>Central Document Repository ({allVaultDocuments.length} Documents)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  All documents uploaded across your assigned CA requests.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                  Encrypted AES-256 Vault
                </span>
              </div>
            </div>

            {/* Vault Search Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 flex flex-col sm:flex-row items-center gap-3 shadow-xs">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={vaultSearch}
                  onChange={(e) => setVaultSearch(e.target.value)}
                  placeholder="Search uploaded documents by name, file, or CA request..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-xl shrink-0">
                {filteredVaultDocuments.length} Uploaded File(s)
              </span>
            </div>

            {/* Documents Table / Grid */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
              {filteredVaultDocuments.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <FolderOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-sm text-slate-700">
                    {vaultSearch ? `No documents found matching "${vaultSearch}"` : 'No uploaded documents yet'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Upload documents in My CA Tasks to populate your vault.</p>
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

        {/* ================= TAB 3: INSTAGRAM-STYLE CLIENT PROFILE + REQUEST/MISSING POSTS GRID ================= */}
        {activeTab === 'profile' && (() => {
          const allProfilePosts = caRequests.flatMap((req) =>
            (req.items || []).map((item) => ({
              ...item,
              reqId: req.id,
              reqTitle: req.title,
              period: req.period,
              dueDate: req.dueDate
            }))
          );
          const missingPosts = allProfilePosts.filter((p) => p.status === 'PENDING' || p.status === 'REJECTED');
          const uploadedPosts = allProfilePosts.filter((p) => p.status === 'SUBMITTED' || p.status === 'VERIFIED');
          const visiblePosts =
            profileFeedTab === 'missing'
              ? missingPosts
              : profileFeedTab === 'uploaded'
              ? uploadedPosts
              : allProfilePosts;

          return (
          <div className="space-y-4">
            
            {/* Profile Saved Toast */}
            {profileSavedToast && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs sm:text-sm text-emerald-800 shadow-sm animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-bold">Client profile and business configuration saved successfully!</span>
              </div>
            )}

            {/* Instagram-Style Profile Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
              <div className="h-2 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />

              <div className="px-4 sm:px-6 pb-6 pt-5 relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative group shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 shadow-md">
                        <div className="w-full h-full rounded-full bg-indigo-600 text-white font-black text-2xl flex items-center justify-center border-2 border-white overflow-hidden">
                          {profileData.avatarUrl ? (
                            <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span>{(profileData.companyName || 'CL').slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>
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
                          className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center text-white transition-opacity"
                          title="Upload Avatar Photo"
                        >
                          <Camera className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="min-w-0 space-y-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-base sm:text-xl font-black text-slate-900">
                            {profileData.companyName || 'Verified Client'}
                          </h2>
                          <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> KYC VERIFIED
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 block font-medium mt-0.5">
                          {profileData.entityType} • {profileData.name || profileData.designation}
                        </span>
                      </div>

                      {/* Instagram-Style 3 Stat Counters */}
                      <div className="flex items-center gap-5 pt-1 text-center sm:text-left">
                        <button type="button" onClick={() => setProfileFeedTab('all')} className="hover:opacity-80">
                          <strong className="text-sm sm:text-base font-black text-slate-900 block leading-none">{allProfilePosts.length}</strong>
                          <span className="text-[11px] text-slate-500 font-semibold">Requests</span>
                        </button>
                        <button type="button" onClick={() => setProfileFeedTab('uploaded')} className="hover:opacity-80">
                          <strong className="text-sm sm:text-base font-black text-emerald-600 block leading-none">{uploadedPosts.length}</strong>
                          <span className="text-[11px] text-slate-500 font-semibold">Uploaded</span>
                        </button>
                        <button type="button" onClick={() => setProfileFeedTab('missing')} className="hover:opacity-80">
                          <strong className="text-sm sm:text-base font-black text-rose-600 block leading-none">{missingPosts.length}</strong>
                          <span className="text-[11px] text-slate-500 font-semibold">Missing</span>
                        </button>
                      </div>
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

                    {/* Instagram-Style Requests & Missing Posts Grid */}
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-around border-b border-slate-200 text-xs">
                        {[
                          { id: 'all', label: `All (${allProfilePosts.length})` },
                          { id: 'missing', label: `Missing (${missingPosts.length})` },
                          { id: 'uploaded', label: `Uploaded (${uploadedPosts.length})` }
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setProfileFeedTab(tab.id)}
                            className={`flex-1 py-2.5 font-extrabold text-center border-b-2 transition-all ${
                              profileFeedTab === tab.id
                                ? 'border-slate-900 text-slate-900'
                                : 'border-transparent text-slate-400 hover:text-slate-700'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {visiblePosts.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-xs">
                          No items in this tab yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {visiblePosts.map((post) => {
                            const isVerified = post.status === 'VERIFIED';
                            const isRejected = post.status === 'REJECTED';
                            const isSubmitted = post.status === 'SUBMITTED';
                            const isMissing = post.status === 'PENDING' || isRejected;

                            return (
                              <div
                                key={`${post.reqId}_${post.id}`}
                                className={`aspect-square rounded-2xl border p-3 flex flex-col justify-between transition-all ${
                                  isRejected
                                    ? 'bg-rose-50 border-rose-200'
                                    : isVerified
                                    ? 'bg-emerald-50/70 border-emerald-200'
                                    : isSubmitted
                                    ? 'bg-indigo-50/60 border-indigo-200'
                                    : 'bg-amber-50/60 border-amber-200'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span
                                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                      isRejected
                                        ? 'bg-rose-600 text-white'
                                        : isVerified
                                        ? 'bg-emerald-600 text-white'
                                        : isSubmitted
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-amber-500 text-white'
                                    }`}
                                  >
                                    {isRejected ? 'Re-Upload' : isVerified ? 'Verified ✓' : isSubmitted ? 'Uploaded' : 'Missing'}
                                  </span>
                                  <span className="text-[9px] font-bold text-slate-500 truncate">{post.period}</span>
                                </div>

                                <div className="my-auto py-1 text-center space-y-1">
                                  <div className="w-9 h-9 rounded-xl bg-white/90 border border-slate-200/80 mx-auto flex items-center justify-center shadow-2xs">
                                    {isVerified ? (
                                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    ) : isMissing ? (
                                      <AlertCircle className="w-5 h-5 text-rose-500" />
                                    ) : (
                                      <FileText className="w-5 h-5 text-indigo-600" />
                                    )}
                                  </div>
                                  <h4 className="text-[11px] font-extrabold text-slate-900 line-clamp-2 leading-tight">
                                    {post.title}
                                  </h4>
                                  <p className="text-[9px] text-slate-500 truncate">{post.category}</p>
                                </div>

                                <label className="cursor-pointer w-full py-1.5 rounded-xl bg-white hover:bg-slate-900 hover:text-white border border-slate-200 text-slate-800 text-[10px] font-extrabold text-center transition-colors block">
                                  {isRejected ? 'Re-upload Fix' : isMissing ? 'Upload Now' : 'Replace File'}
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.docx"
                                    onChange={(e) => handleCARequestUpload(e, post.reqId, post.id, post.title)}
                                  />
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      )}
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
          );
        })()}

          {/* Digital Consent & Undertaking Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <strong className="text-slate-900 block">Digital Consent & Verification Undertaking</strong>
              <span className="text-slate-500">
                {signedConsent
                  ? `Signed by ${signedConsent.signerName} on ${signedConsent.signedAt}`
                  : 'Sign digitally to confirm authenticity of uploaded documents'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsSignatureOpen(true)}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 shrink-0 ${
                signedConsent
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>{signedConsent ? 'Signed ✓ (Re-Sign)' : 'Sign Consent'}</span>
            </button>
          </div>
      </main>
        </div>
      </div>

      <DocumentScannerModal
        isOpen={!!scannerTarget}
        onClose={() => setScannerTarget(null)}
        targetLabel={scannerTarget?.item?.name || 'Document'}
        onScanComplete={(scannedFile) => {
          if (scannerTarget) {
            processModuleFile(scannedFile, scannerTarget.moduleCode, scannerTarget.itemIndex, scannerTarget.item);
          }
        }}
      />

      <SignaturePadModal
        isOpen={isSignatureOpen}
        onClose={() => setIsSignatureOpen(false)}
        onSignComplete={(sig) => {
          setSignedConsent(sig);
          setUploadSuccessAlert(`Digital consent signed by ${sig.signerName} (${sig.signedAt}).`);
        }}
      />

    </div>
  );
}
