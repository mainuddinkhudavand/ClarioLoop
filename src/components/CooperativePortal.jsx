import React, { useState } from 'react';
import { 
  Landmark, 
  Users, 
  Coins, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  UploadCloud, 
  Download, 
  Search, 
  Filter, 
  ArrowLeft, 
  Plus, 
  Calendar, 
  UserCheck, 
  Sparkles, 
  ChevronRight, 
  DollarSign, 
  BookOpen, 
  BadgeCheck, 
  Phone, 
  MapPin, 
  FileCheck2, 
  AlertTriangle, 
  Building2,
  RefreshCw,
  TrendingUp,
  Share2,
  Layers,
  FileSpreadsheet,
  User
} from 'lucide-react';
import { cooperativeMasterChecklist, mockCooperativeSocieties } from '../data/verticalData';
import AIAssistantModal from './AIAssistantModal';
import PortalSidebar from './PortalSidebar';
import InstagramProfileFeed from './InstagramProfileFeed';

export default function CooperativePortal({ 
  onBack, 
  onOpenSubscribe, 
  initialRole = 'admin',
  currentUser,
  onOpenAuth,
  onOpenProfile
}) {
  const [societies, setSocieties] = useState(mockCooperativeSocieties);
  const [selectedSocietyId, setSelectedSocietyId] = useState('coop-1');
  const [viewRole, setViewRole] = useState(initialRole); // 'admin' | 'member'
  const [isAIClassifierOpen, setIsAIClassifierOpen] = useState(false);

  React.useEffect(() => {
    if (initialRole) setViewRole(initialRole);
  }, [initialRole]);
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' | 'pigmy' | 'loans' | 'governance' | 'members'
  const [memberTab, setMemberTab] = useState('tasks'); // 'tasks' | 'vault' | 'profile'
  const [isEditingMemberProfile, setIsEditingMemberProfile] = useState(false);
  const [memberProfile, setMemberProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('clarioloop_coop_member_profile_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: currentUser?.name || 'Smt. Savitri Kulkarni',
      memberId: 'MEM-4920',
      mobile: currentUser?.phone || '+91 98450 11223',
      branch: 'Belagavi Main',
      nomineeName: 'Raghavendra Kulkarni (Spouse)',
    };
  });
  const [selectedModuleCode, setSelectedModuleCode] = useState('M1');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [auditSlipNotification, setAuditSlipNotification] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  const activeSociety = societies.find(s => s.id === selectedSocietyId) || societies[0];

  // Uploaded docs state (persisted in localStorage + live cross-tab sync for Branch <-> Member)
  const INITIAL_COOP_DOCS = {
    'Membership / account opening application': {
      fileName: 'Member_Application_Form_8492.pdf',
      size: '1.2 MB',
      uploadedAt: 'Today, 09:45 AM',
      status: 'VERIFIED',
      verifiedBy: 'Branch Cashier'
    },
    'Member/customer full name and member ID': {
      fileName: 'Govt_Aadhaar_KYC_Verified.pdf',
      size: '420 KB',
      uploadedAt: 'Today, 09:47 AM',
      status: 'VERIFIED',
      verifiedBy: 'Branch Manager'
    },
    'PAN or Form 60, as applicable': {
      fileName: 'PAN_Card_Scanned_Proof.pdf',
      size: '310 KB',
      uploadedAt: 'Today, 09:48 AM',
      status: 'VERIFIED',
      verifiedBy: 'Branch Manager'
    },
    'Daily deposit agreed contribution (e.g. ₹100/day)': {
      fileName: 'Pigmy_Agreement_Mandate_Rs100.pdf',
      size: '640 KB',
      uploadedAt: 'Yesterday, 04:30 PM',
      status: 'VERIFIED',
      verifiedBy: 'Field Inspector'
    },
    'Gold appraisal and valuation report by certified appraiser': {
      fileName: 'Certified_Gold_Appraisal_Report_22K.pdf',
      size: '880 KB',
      uploadedAt: '24-Nov-2026',
      status: 'VERIFIED',
      verifiedBy: 'Appraiser S. Joshi'
    }
  };
  const [uploadedDocs, setUploadedDocs] = useState(() => {
    try {
      const saved = localStorage.getItem('clarioloop_coop_docs_v1');
      return saved ? JSON.parse(saved) : INITIAL_COOP_DOCS;
    } catch {
      return INITIAL_COOP_DOCS;
    }
  });

  React.useEffect(() => {
    try { localStorage.setItem('clarioloop_coop_docs_v1', JSON.stringify(uploadedDocs)); } catch {}
  }, [uploadedDocs]);

  React.useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'clarioloop_coop_docs_v1' && e.newValue) {
        try { setUploadedDocs(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Backend cross-device sync for Co-op Branch <-> Member
  const coopHydratedRef = React.useRef(false);
  const lastCoopJsonRef = React.useRef('');

  React.useEffect(() => {
    let active = true;
    const pullCoop = async (isInitial = false) => {
      try {
        const res = await fetch('/api/coop/workspace');
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        if (data?.uploadedDocs && typeof data.uploadedDocs === 'object') {
          const remoteStr = JSON.stringify(data.uploadedDocs);
          if (remoteStr !== lastCoopJsonRef.current) {
            lastCoopJsonRef.current = remoteStr;
            setUploadedDocs(data.uploadedDocs);
          }
        } else if (isInitial) {
          lastCoopJsonRef.current = JSON.stringify(uploadedDocs);
          await fetch('/api/coop/workspace', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uploadedDocs })
          });
        }
      } catch {
        // offline fallback uses localStorage
      } finally {
        if (isInitial) coopHydratedRef.current = true;
      }
    };
    pullCoop(true);
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') pullCoop(false);
    }, 5000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  React.useEffect(() => {
    if (!coopHydratedRef.current) return;
    const nextStr = JSON.stringify(uploadedDocs);
    if (nextStr === lastCoopJsonRef.current) return;
    lastCoopJsonRef.current = nextStr;
    fetch('/api/coop/workspace', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadedDocs })
    }).catch(() => {});
  }, [uploadedDocs]);

  // Mock Field Agent Pigmy Data
  const [pigmyRoutes, setPigmyRoutes] = useState([
    {
      agentId: 'AGT-01',
      name: 'Ramesh Patil',
      territory: 'Route 1 • Market Yard & Grain Bazaar',
      assignedMembers: 110,
      collectedToday: 18400,
      targetToday: 20000,
      remittedToBranch: true,
      lastCollectionTime: '11:15 AM'
    },
    {
      agentId: 'AGT-02',
      name: 'Somnath Ghorpade',
      territory: 'Route 2 • Shivaji Chowk & Industrial Area',
      assignedMembers: 95,
      collectedToday: 24500,
      targetToday: 25000,
      remittedToBranch: false,
      lastCollectionTime: '11:40 AM'
    },
    {
      agentId: 'AGT-03',
      name: 'Deepak Sawant',
      territory: 'Route 3 • Agricultural APMC & Farmer Mandi',
      assignedMembers: 140,
      collectedToday: 32000,
      targetToday: 35000,
      remittedToBranch: true,
      lastCollectionTime: '10:50 AM'
    }
  ]);

  // Real File Upload Handler (uploads binary to /api/coop/upload when backend is online)
  const handleRealUpload = async (itemName, file, isMember = false) => {
    if (!file) return;
    let uploadedRecord = {
      fileName: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      uploadedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      fileUrl: URL.createObjectURL(file),
      status: isMember ? 'SUBMITTED' : 'VERIFIED',
      verifiedBy: isMember ? 'Awaiting Branch Review' : 'Branch Desk'
    };

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/coop/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const saved = await res.json();
        uploadedRecord = { ...uploadedRecord, ...saved };
      }
    } catch {
      // Fallback to local object URL when running without Express
    }

    setUploadedDocs(prev => ({
      ...prev,
      [itemName]: uploadedRecord
    }));
    setAuditSlipNotification(`"${file.name}" uploaded & synced with Society Branch!`);
    setTimeout(() => setAuditSlipNotification(null), 4000);
  };

  // Export Audit Slip
  const handleDownloadAuditSlip = (format = 'txt') => {
    const timeStr = new Date().toLocaleString();
    let content = '';
    let mimeType = 'text/plain';
    let filename = `ClarioLoop_Coop_${activeSociety.id}_AuditSlip.${format}`;

    if (format === 'json') {
      mimeType = 'application/json';
      content = JSON.stringify({
        institution: activeSociety.name,
        regNumber: activeSociety.registrationNumber,
        city: activeSociety.city,
        generatedAt: timeStr,
        verifiedDocs: uploadedDocs,
        pigmyRoutesSummary: pigmyRoutes
      }, null, 2);
    } else if (format === 'csv') {
      mimeType = 'text/csv';
      content = 'Item Name,File Name,Size,Uploaded At,Status,Reviewer\n' +
        Object.entries(uploadedDocs).map(([k, v]) => 
          `"${k}","${v.fileName}","${v.size}","${v.uploadedAt}","${v.status}","${v.verifiedBy}"`
        ).join('\n');
    } else {
      content = `=====================================================
CLARIOLOOP COOPERATIVE OPERATIONS AUDIT VERIFICATION SLIP
=====================================================
Institution: ${activeSociety.name}
Registration No: ${activeSociety.registrationNumber}
Jurisdiction: ${activeSociety.city}
Generated: ${timeStr}
Compliance Status: KYC & Bye-Laws Compliant

VERIFIED DOCUMENT DOSSIERS:
${Object.entries(uploadedDocs).map(([k, v], idx) => `${idx + 1}. [${v.status}] ${k} (${v.fileName}) - Reviewed by ${v.verifiedBy}`).join('\n')}

FIELD PIGMY SUMMARY:
Total Routes: ${pigmyRoutes.length}
Total Daily Collections Today: ₹${pigmyRoutes.reduce((acc, r) => acc + r.collectedToday, 0).toLocaleString('en-IN')}

This is an automated operational checklist slip for statutory inspection under Cooperative Societies Act.
=====================================================`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setAuditSlipNotification(`Downloaded ${format.toUpperCase()} Audit Slip successfully.`);
    setTimeout(() => setAuditSlipNotification(null), 3500);
  };

  const activeModule = cooperativeMasterChecklist.find(m => m.code === selectedModuleCode) || cooperativeMasterChecklist[0];

  const filteredItems = activeModule.items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const isUploaded = !!uploadedDocs[item.name];
    if (statusFilter === 'UPLOADED') return matchesSearch && isUploaded;
    if (statusFilter === 'PENDING') return matchesSearch && !isUploaded;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 pb-20">
      {/* Main Workspace Area */}
      <main className="w-full">
        {/* Audit Slip Download Notification */}
        {auditSlipNotification && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{auditSlipNotification}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 1: SOCIETY ADMIN & DESK VIEW (Clean Sidebar + Workspace) */}
        {/* ============================================================== */}
        {viewRole === 'admin' && (
          <div className="space-y-6">
            {/* Workspace with CA-style Left Sidebar */}
            <div className="flex flex-col md:flex-row bg-white overflow-hidden">
              <PortalSidebar
                title={activeSociety.name}
                subtitle={activeSociety.city}
                initials="SC"
                accent="emerald"
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  if (tab === 'ai') setIsAIClassifierOpen(true);
                  else setActiveTab(tab);
                }}
                currentUser={currentUser}
                onBack={onBack}
                items={[
                  { id: 'modules', label: 'Master Checklists', icon: Layers },
                  { id: 'pigmy', label: 'Pigmy & Field Agents', icon: Coins },
                  { id: 'loans', label: 'Loan Sanction Dossiers', icon: FileCheck2 },
                  { id: 'governance', label: 'Audit & Board Minutes', icon: BookOpen },
                  { id: 'ai', label: 'AI Loan Classifier', icon: Sparkles },
                  { id: 'profile', label: 'Profile', mobileLabel: 'Profile', icon: User }
                ]}
              />

              <div className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 bg-slate-50/50 pb-24 md:pb-8 space-y-6">
            
            {/* Top Operational Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/80 p-4 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between text-xs text-emerald-800 font-bold">
                  <span>Registered Members</span>
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                  {activeSociety.membersCount.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  100% KYC &amp; Share Subscribed
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200/80 p-4 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between text-xs text-amber-800 font-bold">
                  <span>Today's Pigmy Scroll</span>
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                    <Coins className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                  ₹{pigmyRoutes.reduce((acc, r) => acc + r.collectedToday, 0).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-amber-700 font-semibold mt-1">
                  Across {activeSociety.pigmyAgentsCount} authorized routes
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-200/80 p-4 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between text-xs text-indigo-800 font-bold">
                  <span>Active Loan Portfolio</span>
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-2xs">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                  {activeSociety.activeLoansCount} Accounts
                </div>
                <div className="text-[11px] text-indigo-600 font-semibold mt-1">
                  Gold, Crop, MSME &amp; Housing
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200/80 p-4 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between text-xs text-purple-800 font-bold">
                  <span>Audit &amp; Governance</span>
                  <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                  Clean Rating
                </div>
                <div className="text-[11px] text-purple-600 font-semibold mt-1">
                  RCS &amp; Statutory Audit Ready
                </div>
              </div>
            </div>

            {/* TAB CONTENT 1: MASTER MODULES */}
            {activeTab === 'modules' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Module Selector Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 px-1">
                    Cooperative Modules
                  </div>
                  {cooperativeMasterChecklist.map(mod => {
                    const isSelected = mod.code === selectedModuleCode;
                    return (
                      <button
                        key={mod.code}
                        onClick={() => setSelectedModuleCode(mod.code)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <h4 className="font-extrabold text-xs line-clamp-1">
                          {mod.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {mod.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Module Checklists Table / Cards */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Module Header & Search */}
                  <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h2 className="text-base font-black text-slate-900">
                          {activeModule.title}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          {activeModule.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {['ALL', 'PENDING', 'UPLOADED'].map(f => (
                          <button
                            key={f}
                            onClick={() => setStatusFilter(f)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                              statusFilter === f
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search checklist documents, category, or legal requirements..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Checklist Items List */}
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100">
                    {filteredItems.map((item, idx) => {
                      const uploadInfo = uploadedDocs[item.name];
                      return (
                        <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-xs text-slate-900">
                                {item.name}
                              </span>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                item.defaultTag === 'Mandatory'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {item.defaultTag}
                              </span>
                              <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                {item.category}
                              </span>
                            </div>

                            {uploadInfo ? (
                              <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold pt-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{uploadInfo.fileName} ({uploadInfo.size})</span>
                                <span>•</span>
                                <span className="text-slate-500 font-normal">{uploadInfo.uploadedAt}</span>
                                <span>•</span>
                                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  {uploadInfo.status}
                                </span>
                              </div>
                            ) : (
                              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                                <AlertCircle className="w-3 h-3 text-amber-500" />
                                <span>Accepted format: {item.acceptedTypes}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {uploadInfo ? (
                              <>
                                {uploadInfo.status === 'SUBMITTED' && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setUploadedDocs((prev) => ({
                                        ...prev,
                                        [item.name]: { ...uploadInfo, status: 'VERIFIED', verifiedBy: 'Branch Manager' }
                                      }))
                                    }
                                    className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                                  >
                                    Verify ✓
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setPreviewDoc({ title: item.name, ...uploadInfo })}
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
                                >
                                  <span>View File</span>
                                </button>
                              </>
                            ) : (
                              <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-all">
                                <UploadCloud className="w-3.5 h-3.5" />
                                <span>Upload File</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.docx"
                                  onChange={(e) => handleRealUpload(item.name, e.target.files?.[0], false)}
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT 2: PIGMY & FIELD AGENTS */}
            {activeTab === 'pigmy' && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <Coins className="w-4 h-4 text-amber-500" />
                        <span>Daily Pigmy Field Collection Sheets & Sequence Controls</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Live monitoring of field collection agents, receipt sequence registers, and daily branch remittances.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const nextIdx = pigmyRoutes.length + 1;
                        setPigmyRoutes(prev => [
                          ...prev,
                          {
                            agentId: `AGT-0${nextIdx}`,
                            name: `Field Agent ${nextIdx}`,
                            territory: `Route ${nextIdx} • New Collection Zone`,
                            assignedMembers: 45,
                            collectedToday: 0,
                            targetToday: 15000,
                            remittedToBranch: false,
                            lastCollectionTime: 'Just added'
                          }
                        ]);
                        setAuditSlipNotification(`Registered Route AGT-0${nextIdx} in Daily Pigmy Sheet.`);
                        setTimeout(() => setAuditSlipNotification(null), 3500);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Pigmy Agent</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pigmyRoutes.map(agent => (
                    <div key={agent.agentId} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 font-black text-xs flex items-center justify-center border border-amber-200">
                            {agent.agentId}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs text-slate-900">{agent.name}</h4>
                            <span className="text-[10px] text-slate-500 font-mono">Territory: {agent.territory.split('•')[0]}</span>
                          </div>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          agent.remittedToBranch
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                        }`}>
                          {agent.remittedToBranch ? 'REMITTED' : 'IN FIELD'}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                        <div className="flex justify-between text-slate-500">
                          <span>Members Covered:</span>
                          <strong className="text-slate-800">{agent.assignedMembers} Members</strong>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Today's Total:</span>
                          <strong className="text-emerald-700 font-black">₹{agent.collectedToday.toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Daily Target:</span>
                          <span className="text-slate-700">₹{agent.targetToday.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Last Sync:</span>
                          <span className="text-slate-500 font-mono">{agent.lastCollectionTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => {
                            setPigmyRoutes(prev => prev.map(a => a.agentId === agent.agentId ? { ...a, remittedToBranch: true } : a));
                            setAuditSlipNotification(`Cash of ₹${agent.collectedToday.toLocaleString('en-IN')} remitted at branch teller by ${agent.name}. Scroll signed!`);
                            setTimeout(() => setAuditSlipNotification(null), 4000);
                          }}
                          disabled={agent.remittedToBranch}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                            agent.remittedToBranch
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                          }`}
                        >
                          {agent.remittedToBranch ? '✓ Branch Scroll Signed' : 'Sign Cash Remittance Scroll'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: LOAN SANCTION DOSSIERS */}
            {activeTab === 'loans' && (
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      Loan Document Dossiers by Loan Category
                    </h3>
                    <p className="text-xs text-slate-500">
                      Standardized checklists for Crop Loans, Gold Loans, MSME, and Housing Loans under Section 6 of Cooperative Guidelines.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs text-slate-900 font-black">🌾 Agricultural / Crop Loan Dossier</strong>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">11 Requirements</span>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                      <li>Land Ownership Record (RTC / Pahani / 7/12)</li>
                      <li>Mutation Extract & Land Survey Details</li>
                      <li>Crop & Cultivation Certificate from Revenue Dept</li>
                      <li>Existing Loan & Liability Declaration (No Dues)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs text-slate-900 font-black">🪙 Gold Loan Appraisal Dossier</strong>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-bold">8 Requirements</span>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                      <li>Gold Appraisal Report by certified assayer</li>
                      <li>Gross weight, net weight & purity in karats</li>
                      <li>Pledge Acknowledgement & Safe Custody Locker Slip</li>
                      <li>Customer photograph with pledged ornaments</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: GOVERNANCE & MINUTES */}
            {activeTab === 'governance' && (
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Statutory Governance, Board Resolutions & Inspection Logs
                  </h3>
                  <p className="text-xs text-slate-500">
                    Registrar of Cooperative Societies (RCS) bye-law records, meeting quorum, and Action-Taken Reports (ATR).
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'Resolution 2026/11: Member Admission Batch 48', date: '18-Nov-2026', status: 'Passed Unanimously', note: 'Approved 42 new individual members with full share capital.' },
                    { title: 'Resolution 2026/10: Revision of Gold Loan LTV to 75%', date: '04-Nov-2026', status: 'RCS Compliant', note: 'Per RBI / State Cooperative circular on gold loan limits.' },
                    { title: 'Statutory Inspection ATR: Cash-in-hand Escalation Policy', date: '22-Oct-2026', status: 'Closure Approved', note: 'Automated notification configured for field collections exceeding ₹50,000.' }
                  ].map((res, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <strong className="text-xs text-slate-900 block">{res.title}</strong>
                        <span className="text-[11px] text-slate-500">{res.note}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-400 font-mono">{res.date}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {res.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <InstagramProfileFeed
                name={activeSociety.name}
                subtitle={`${activeSociety.city} • Co-operative Banking & Society`}
                initials="SC"
                accent="emerald"
                badgeText="RCS VERIFIED"
                posts={cooperativeMasterChecklist.flatMap((mod) =>
                  (mod.items || []).map((item, idx) => {
                    const up = uploadedDocs[item.name];
                    return {
                      id: `${mod.code}_${idx}`,
                      title: item.name,
                      subtitle: mod.title,
                      category: mod.code,
                      period: mod.code,
                      status: up ? (up.status || 'SUBMITTED') : 'PENDING'
                    };
                  })
                )}
                onPostAction={() => setActiveTab('modules')}
                actionLabelMissing="Upload KYC"
                actionLabelDone="View Checklist"
                profileFields={[
                  { key: 'city', label: 'City / Branch', value: activeSociety.city || '' },
                  { key: 'regNo', label: 'Registration No.', value: activeSociety.registrationNumber || '' },
                ]}
                onSaveProfile={(updated) => {
                  setSocieties(prev => prev.map(s =>
                    s.id === activeSociety.id
                      ? {
                          ...s,
                          name: updated.name || s.name,
                          city: updated.city || s.city,
                          registrationNumber: updated.regNo || s.registrationNumber,
                        }
                      : s
                  ));
                }}
              />
            )}

              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: MEMBER / ACCOUNT HOLDER PORTAL (Client-Portal Style) */}
        {/* ============================================================== */}
        {viewRole === 'member' && (() => {
          const memberChecklist = cooperativeMasterChecklist.slice(0, 3).flatMap((m) =>
            (m.items || []).slice(0, 3).map((it) => ({ ...it, moduleTitle: m.title }))
          );
          const pendingMemberCount = memberChecklist.filter((it) => !uploadedDocs[it.name]).length;
          const memberName = memberProfile.name || currentUser?.name || 'Smt. Savitri Kulkarni';
          const memberInitials = memberName.slice(0, 2).toUpperCase();

          return (
            <div className="flex flex-col md:flex-row bg-white overflow-hidden min-h-[calc(100vh-120px)]">
              <PortalSidebar
                title={memberName}
                subtitle={`${activeSociety.name} • MEM-4920`}
                initials={memberInitials}
                accent="emerald"
                activeTab={memberTab}
                setActiveTab={setMemberTab}
                currentUser={currentUser}
                onBack={onBack}
                items={[
                  {
                    id: 'tasks',
                    label: 'My Society Tasks',
                    mobileLabel: 'Tasks',
                    icon: FileCheck2,
                    badge: pendingMemberCount
                  },
                  {
                    id: 'vault',
                    label: 'Passbook & Vault',
                    mobileLabel: 'Vault',
                    icon: BookOpen
                  },
                  {
                    id: 'profile',
                    label: 'Profile',
                    mobileLabel: 'Profile',
                    icon: User
                  }
                ]}
              />

              <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 bg-slate-50/50 pb-24 md:pb-8 space-y-5">
                {memberTab === 'tasks' && (
                  <div className="max-w-4xl mx-auto space-y-4">
                    <div className="bg-white border border-slate-200/80 rounded-2xl px-4 py-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900">
                          Assigned Society KYC &amp; Loan Tasks
                        </h3>
                        <p className="text-xs text-slate-500">
                          {activeSociety.name} ({activeSociety.city}) • Syncs live with Branch Desk
                        </p>
                      </div>
                      <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl w-fit shrink-0">
                        {memberChecklist.length - pendingMemberCount} / {memberChecklist.length} Completed
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {memberChecklist.map((item, idx) => {
                        const up = uploadedDocs[item.name];
                        const isVerified = up?.status === 'VERIFIED';
                        return (
                          <div
                            key={idx}
                            className={`bg-white rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs ${
                              isVerified ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-xs sm:text-sm text-slate-900">{item.name}</span>
                                <span
                                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                    isVerified
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : up
                                      ? 'bg-indigo-100 text-indigo-700'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {isVerified ? 'Verified ✓' : up ? 'Uploaded • In Branch Review' : 'Pending'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {item.moduleTitle}
                                {up ? ` • ${up.fileName} (${up.size})` : ` • Accepted: ${item.acceptedTypes}`}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {up && (
                                <button
                                  type="button"
                                  onClick={() => setPreviewDoc({ title: item.name, ...up })}
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                                >
                                  View File
                                </button>
                              )}
                              <label className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5">
                                <UploadCloud className="w-3.5 h-3.5" />
                                <span>{up ? 'Replace' : 'Upload'}</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.docx"
                                  onChange={(e) => handleRealUpload(item.name, e.target.files?.[0], true)}
                                />
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {memberTab === 'vault' && (
                  <div className="max-w-4xl mx-auto space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900">Member Passbook &amp; Document Vault</h3>
                        <p className="text-xs text-slate-500">Branch: Belagavi Main • Share Capital: ₹2,000 (20 Shares)</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadAuditSlip('txt')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 w-fit"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Passbook Slip</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                        <span className="text-xs text-slate-500 font-bold block">Daily Pigmy Deposit Balance</span>
                        <span className="text-2xl font-black text-slate-900 block mt-1">₹32,400</span>
                        <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                          Agreed: ₹100 / day • 324 Days Collected
                        </span>
                      </div>
                      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                        <span className="text-xs text-slate-500 font-bold block">Recurring Deposit (RD-104)</span>
                        <span className="text-2xl font-black text-slate-900 block mt-1">₹60,000</span>
                        <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
                          ₹5,000 / month • Maturity: March 2027
                        </span>
                      </div>
                      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                        <span className="text-xs text-slate-500 font-bold block">Active Gold Loan (GL-882)</span>
                        <span className="text-2xl font-black text-indigo-700 block mt-1">₹1,25,000</span>
                        <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                          Regular Interest Paid • 42g Pledged 22K
                        </span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                      <h4 className="text-sm font-black text-slate-900">Your Verified Documents ({Object.keys(uploadedDocs).length})</h4>
                      <div className="divide-y divide-slate-100">
                        {Object.entries(uploadedDocs).map(([docName, info], i) => (
                          <div key={i} className="py-3 flex items-center justify-between gap-2 text-xs">
                            <div className="min-w-0">
                              <strong className="text-slate-900 block font-bold truncate">{docName}</strong>
                              <span className="text-slate-500 text-[11px]">{info.fileName} • {info.size} • {info.verifiedBy}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => setPreviewDoc({ title: docName, ...info })}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                              >
                                View
                              </button>
                              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                {info.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {memberTab === 'profile' && (
                  <div className="space-y-4 max-w-4xl mx-auto">
                    <InstagramProfileFeed
                      name={memberName}
                      subtitle={`Member # ${memberProfile.memberId} • ${memberProfile.branch} • ${activeSociety.name}`}
                      initials={memberInitials}
                      accent="emerald"
                      badgeText="KYC VERIFIED"
                      posts={memberChecklist.map((item, idx) => {
                        const up = uploadedDocs[item.name];
                        return {
                          id: `mem-${idx}`,
                          title: item.name,
                          subtitle: item.moduleTitle,
                          category: item.category,
                          period: 'Member KYC',
                          status: up ? (up.status || 'SUBMITTED') : 'PENDING'
                        };
                      })}
                      onPostAction={() => setMemberTab('tasks')}
                      actionLabelMissing="Upload Now"
                      actionLabelDone="View Task"
                    />

                    {/* Member KYC & Edit Profile Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4 text-xs">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <h4 className="font-black text-slate-900 text-sm">Member KYC &amp; Account Details</h4>
                          <p className="text-[11px] text-slate-500">Update your mobile, branch, or nominee information</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEditingMemberProfile(!isEditingMemberProfile)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                          {isEditingMemberProfile ? 'Cancel' : 'Edit Profile'}
                        </button>
                      </div>

                      {!isEditingMemberProfile ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Member Name</span>
                            <strong className="text-slate-900 font-bold">{memberProfile.name}</strong>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Mobile Number</span>
                            <strong className="text-slate-900 font-bold">{memberProfile.mobile}</strong>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Home Branch</span>
                            <strong className="text-slate-900 font-bold">{memberProfile.branch}</strong>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Registered Nominee</span>
                            <strong className="text-slate-900 font-bold">{memberProfile.nomineeName}</strong>
                          </div>
                        </div>
                      ) : (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            try { localStorage.setItem('clarioloop_coop_member_profile_v1', JSON.stringify(memberProfile)); } catch {}
                            setIsEditingMemberProfile(false);
                            setAuditSlipNotification('Member profile updated successfully!');
                            setTimeout(() => setAuditSlipNotification(null), 3500);
                          }}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                        >
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">Member Name</label>
                            <input
                              type="text"
                              value={memberProfile.name}
                              onChange={(e) => setMemberProfile({ ...memberProfile, name: e.target.value })}
                              required
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
                            <input
                              type="text"
                              value={memberProfile.mobile}
                              onChange={(e) => setMemberProfile({ ...memberProfile, mobile: e.target.value })}
                              required
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">Home Branch</label>
                            <input
                              type="text"
                              value={memberProfile.branch}
                              onChange={(e) => setMemberProfile({ ...memberProfile, branch: e.target.value })}
                              required
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">Registered Nominee</label>
                            <input
                              type="text"
                              value={memberProfile.nomineeName}
                              onChange={(e) => setMemberProfile({ ...memberProfile, nomineeName: e.target.value })}
                              required
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                            />
                          </div>
                          <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                            <button
                              type="submit"
                              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold"
                            >
                              Save Member Profile
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

      </main>

      {/* Real File Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="min-w-0">
                <h3 className="font-extrabold text-slate-900 text-sm truncate">{previewDoc.title}</h3>
                <p className="text-[11px] text-slate-500">{previewDoc.fileName} • {previewDoc.size}</p>
              </div>
              <button type="button" onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>
            {previewDoc.fileUrl ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100">
                {/\.(png|jpe?g|webp)$/i.test(previewDoc.fileName || previewDoc.fileUrl) ? (
                  <img src={previewDoc.fileUrl} alt={previewDoc.fileName} className="max-h-64 w-full object-contain bg-white" />
                ) : /\.pdf$/i.test(previewDoc.fileName || previewDoc.fileUrl) ? (
                  <iframe src={previewDoc.fileUrl} title={previewDoc.fileName} className="w-full h-64 bg-white" />
                ) : (
                  <div className="p-4 text-center text-slate-600">File ready for download below.</div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                Verified record on file ({previewDoc.status} • {previewDoc.verifiedBy}).
              </div>
            )}
            <div className="flex justify-end gap-2">
              {previewDoc.fileUrl && (
                <a
                  href={previewDoc.fileUrl}
                  download={previewDoc.fileName}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Download
                </a>
              )}
              <button type="button" onClick={() => setPreviewDoc(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internal AI Document Classifier Modal */}
      <AIAssistantModal 
        isOpen={isAIClassifierOpen} 
        onClose={() => setIsAIClassifierOpen(false)} 
      />

    </div>
  );
}
