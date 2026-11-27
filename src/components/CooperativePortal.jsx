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
  const [selectedModuleCode, setSelectedModuleCode] = useState('M1');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [auditSlipNotification, setAuditSlipNotification] = useState(null);

  const activeSociety = societies.find(s => s.id === selectedSocietyId) || societies[0];

  // Uploaded docs mock state
  const [uploadedDocs, setUploadedDocs] = useState({
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
  });

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

  // Handle Mock File Upload
  const handleSimulateUpload = (itemName) => {
    const fakeFile = {
      fileName: itemName.replace(/[^a-zA-Z0-9]/g, '_') + '_2026.pdf',
      size: '840 KB',
      uploadedAt: 'Just now',
      status: 'VERIFIED',
      verifiedBy: 'AI Document Engine + Teller'
    };
    setUploadedDocs(prev => ({
      ...prev,
      [itemName]: fakeFile
    }));
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
      
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                title="Back to Home"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
              <Landmark className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {activeSociety.name}
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Cooperative Banking Suite
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Reg: {activeSociety.registrationNumber} • {activeSociety.city}
              </p>
            </div>
          </div>

          {/* Persona View Switcher & Action Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            {/* Society Switcher Dropdown */}
            <select
              value={selectedSocietyId}
              onChange={(e) => setSelectedSocietyId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {societies.map(s => (
                <option key={s.id} value={s.id}>
                  {s.type.includes('PACS') ? '🌾 ' : '🏦 '} {s.name.split(' ')[0]}... ({s.city})
                </option>
              ))}
            </select>

            {/* View Mode Switcher: Society Admin vs Member Portal */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-bold">
              <button
                onClick={() => setViewRole('admin')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewRole === 'admin'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Society Desk</span>
              </button>
              <button
                onClick={() => setViewRole('member')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewRole === 'member'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Member Vault</span>
              </button>
            </div>

            {/* Built-in AI Document Classifier Button */}
            <button
              onClick={() => setIsAIClassifierOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs border border-indigo-200 transition-all flex items-center gap-1.5 shadow-2xs"
              title="Groq AI Document Reader & Classification"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">AI Loan Classifier</span>
            </button>

            {onOpenSubscribe && (
              <button
                onClick={() => onOpenSubscribe('cooperative')}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upgrade Co-op Plan</span>
              </button>
            )}

            {/* Co-op Sign In / Clickable Verified Profile Pill */}
            {currentUser ? (
              <button
                type="button"
                onClick={() => onOpenProfile && onOpenProfile()}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition-colors"
                title="View & Edit Your Profile"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-extrabold text-[9px] flex items-center justify-center">
                  {currentUser.avatarInitials || 'CP'}
                </div>
                <div className="hidden sm:block">
                  <span className="text-[10px] font-bold text-slate-800 block truncate max-w-[110px] leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[8px] font-black text-emerald-700 block leading-tight">
                    ✓ {currentUser.kycBadge || 'PROFILE VERIFIED'}
                  </span>
                </div>
              </button>
            ) : onOpenAuth ? (
              <button
                onClick={() => onOpenAuth('cooperative')}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-300 shadow-2xs transition-all flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Co-op Sign In</span>
              </button>
            ) : null}
          </div>

        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Operational Blueprint Guide Banner (From PDF Page 2) */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="text-sm font-extrabold text-slate-900">
                Cooperative Banking & Society Operational Checklist Framework
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
              Configurable document and collection workflow platform for <strong>Cooperative Credit Societies, PACS, Urban Cooperative Banks (UCB), and DCCBs</strong>. 
              Features 7 standardized workflow statuses: <em>Not Requested • Requested • Received • Under Review • Accepted • Rejected • Not Applicable</em>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleDownloadAuditSlip('txt')}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Audit Slip .TXT</span>
            </button>
            <button
              onClick={() => handleDownloadAuditSlip('csv')}
              className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Audit Slip Download Notification */}
        {auditSlipNotification && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{auditSlipNotification}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 1: SOCIETY ADMIN & DESK VIEW */}
        {/* ============================================================== */}
        {viewRole === 'admin' && (
          <div className="space-y-6">
            
            {/* Top Operational Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Registered Members</span>
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {activeSociety.membersCount.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  100% KYC & Share Subscribed
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Today's Pigmy Scroll</span>
                  <Coins className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  ₹{pigmyRoutes.reduce((acc, r) => acc + r.collectedToday, 0).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-500 font-semibold mt-1">
                  Across {activeSociety.pigmyAgentsCount} authorized field routes
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Active Loan Portfolio</span>
                  <FileText className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {activeSociety.activeLoansCount} Accounts
                </div>
                <div className="text-[11px] text-indigo-600 font-semibold mt-1">
                  Gold, Crop, MSME & Housing
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Audit & Governance</span>
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Clean Rating
                </div>
                <div className="text-[11px] text-purple-600 font-semibold mt-1">
                  RCS & Statutory Audit Ready
                </div>
              </div>
            </div>

            {/* Sub-Tabs Navigation */}
            <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto no-scrollbar text-xs font-bold">
              {[
                { id: 'modules', label: 'Master Checklists', icon: Layers },
                { id: 'pigmy', label: 'Pigmy & Field Agents', icon: Coins },
                { id: 'loans', label: 'Loan Sanction Dossiers', icon: FileCheck2 },
                { id: 'governance', label: 'Audit & Board Minutes', icon: BookOpen }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-emerald-600 text-emerald-700 font-black'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
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
                              <button
                                onClick={() => alert(`Document "${uploadInfo.fileName}" is securely stored in society database.`)}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
                              >
                                <span>View File</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSimulateUpload(item.name)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-all"
                              >
                                <UploadCloud className="w-3.5 h-3.5" />
                                <span>Simulate Upload</span>
                              </button>
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
                      onClick={() => alert('New Pigmy Agent Route registered with KYC and commission rate.')}
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
                            alert(`Cash of ₹${agent.collectedToday} deposited at branch teller by Agent ${agent.name}. Scroll signed!`);
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

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: MEMBER / DEPOSITOR VAULT VIEW */}
        {/* ============================================================== */}
        {viewRole === 'member' && (
          <div className="space-y-6">
            {/* Member Profile Summary */}
            <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shrink-0">
                  SK
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Smt. Savitri Kulkarni
                    </h3>
                    <span className="text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Member # MEM-4920
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Branch: Belagavi Main • Share Capital: ₹2,000 (20 Shares) • Mobile: +91 98450 11223
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadAuditSlip('txt')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Download Passbook Slip</span>
                </button>
              </div>
            </div>

            {/* Passbook Gauges */}
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

            {/* Member KYC & Document Vault */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Your Verified Documents & Vault
                  </h3>
                  <p className="text-xs text-slate-500">
                    Uploaded documents verified by society cashier and panel legal counsel.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {Object.entries(uploadedDocs).map(([docName, info], i) => (
                  <div key={i} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-slate-900 block font-bold">{docName}</strong>
                      <span className="text-slate-500 text-[11px]">{info.fileName} • {info.size} • Verified by {info.verifiedBy}</span>
                    </div>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {info.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Internal AI Document Classifier Modal */}
      <AIAssistantModal 
        isOpen={isAIClassifierOpen} 
        onClose={() => setIsAIClassifierOpen(false)} 
      />

    </div>
  );
}
