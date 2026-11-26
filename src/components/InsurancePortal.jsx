import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  HeartHandshake, 
  FileCheck2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  UploadCloud, 
  Download, 
  Search, 
  Filter, 
  ArrowLeft, 
  Plus, 
  Sparkles, 
  ChevronRight, 
  Building2, 
  FileSpreadsheet, 
  Check, 
  AlertTriangle,
  FileText,
  BadgeCheck,
  Calendar,
  Briefcase,
  Car,
  Activity,
  Umbrella,
  DollarSign,
  User
} from 'lucide-react';
import { insuranceMasterChecklist, mockInsuranceAgencies } from '../data/verticalData';
import AIAssistantModal from './AIAssistantModal';

export default function InsurancePortal({ 
  onBack, 
  onOpenSubscribe, 
  initialRole = 'admin',
  currentUser,
  onOpenAuth
}) {
  const [agencies, setAgencies] = useState(mockInsuranceAgencies);
  const [selectedAgencyId, setSelectedAgencyId] = useState('ins-1');
  const [viewRole, setViewRole] = useState(initialRole); // 'admin' | 'policyholder'
  const [isAIClassifierOpen, setIsAIClassifierOpen] = useState(false);

  React.useEffect(() => {
    if (initialRole) setViewRole(initialRole);
  }, [initialRole]);
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' | 'claims' | 'renewals' | 'corporate'
  const [selectedModuleCode, setSelectedModuleCode] = useState('INS-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [auditSlipNotification, setAuditSlipNotification] = useState(null);

  const activeAgency = agencies.find(a => a.id === selectedAgencyId) || agencies[0];

  // Uploaded docs mock state
  const [uploadedDocs, setUploadedDocs] = useState({
    'Full legal name and basic customer information form': {
      fileName: 'Life_Proposal_Form_DigitallySigned.pdf',
      size: '1.6 MB',
      uploadedAt: 'Today, 11:20 AM',
      status: 'VERIFIED',
      verifiedBy: 'Underwriting Team'
    },
    'PAN card or Form 60, as applicable': {
      fileName: 'Customer_PAN_Card_Valid.pdf',
      size: '280 KB',
      uploadedAt: 'Today, 11:22 AM',
      status: 'VERIFIED',
      verifiedBy: 'KYC Operations'
    },
    'Aadhaar or accepted officially valid identity document (OVD)': {
      fileName: 'Govt_OVD_Identity_Masked.pdf',
      size: '410 KB',
      uploadedAt: 'Today, 11:23 AM',
      status: 'VERIFIED',
      verifiedBy: 'KYC Operations'
    },
    'Vehicle Registration Certificate (RC book / smart card)': {
      fileName: 'Vehicle_RC_MH12_AB8899.pdf',
      size: '590 KB',
      uploadedAt: 'Yesterday, 02:40 PM',
      status: 'VERIFIED',
      verifiedBy: 'Motor Underwriting'
    },
    'Hospital admission record and discharge summary with clinical history': {
      fileName: 'ApolloHospital_DischargeSummary_Cashless.pdf',
      size: '1.8 MB',
      uploadedAt: '24-Nov-2026',
      status: 'VERIFIED',
      verifiedBy: 'TPA Claim Assayer'
    },
    'Final itemised hospital bill with payment receipts and paid stamp': {
      fileName: 'Final_Itemised_Hospital_Bill_Settled.pdf',
      size: '1.2 MB',
      uploadedAt: '24-Nov-2026',
      status: 'VERIFIED',
      verifiedBy: 'TPA Claim Assayer'
    }
  });

  // Handle Mock Upload
  const handleSimulateUpload = (itemName) => {
    const fakeFile = {
      fileName: itemName.replace(/[^a-zA-Z0-9]/g, '_') + '_Verified.pdf',
      size: '820 KB',
      uploadedAt: 'Just now',
      status: 'VERIFIED',
      verifiedBy: 'AI Document Extractor + Surveyor'
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
    let filename = `ClarioLoop_Insurance_${activeAgency.id}_AuditSlip.${format}`;

    if (format === 'json') {
      mimeType = 'application/json';
      content = JSON.stringify({
        agency: activeAgency.name,
        irdaiReg: activeAgency.irdaiNumber,
        city: activeAgency.city,
        generatedAt: timeStr,
        verifiedDocs: uploadedDocs
      }, null, 2);
    } else if (format === 'csv') {
      mimeType = 'text/csv';
      content = 'Document Requirement,Uploaded File,File Size,Upload Timestamp,Verification Status,Reviewing Officer\n' +
        Object.entries(uploadedDocs).map(([k, v]) => 
          `"${k}","${v.fileName}","${v.size}","${v.uploadedAt}","${v.status}","${v.verifiedBy}"`
        ).join('\n');
    } else {
      content = `=====================================================
CLARIOLOOP INSURANCE - CLIENT DOSSIER & CLAIMS AUDIT SLIP
=====================================================
Agency / Broker: ${activeAgency.name}
IRDAI Reg No: ${activeAgency.irdaiNumber}
Jurisdiction: ${activeAgency.city}
Generated: ${timeStr}
Compliance Status: IRDAI KYC, Proposal & Claims Guidelines Compliant

POLICYHOLDER DOSSIER:
Policyholder: Rajeshwar Sen (Client ID: INS-CL-9920)
Active Policies: HDFC Life Click2Protect (Sum Assured: ₹1.0 Cr), Star Health Family Optima (₹10 Lakh), ICICI Lombard Motor Comprehensive

VERIFIED DOCUMENTS:
${Object.entries(uploadedDocs).map(([k, v], idx) => `${idx + 1}. [${v.status}] ${k} (${v.fileName}) - Reviewed by ${v.verifiedBy}`).join('\n')}

IRDAI Regulatory Boundary:
Document collection platform for authorized distribution. All underwriting and claim settlements remain with the respective insurer.
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

    setAuditSlipNotification(`Downloaded ${format.toUpperCase()} Insurance Audit Slip successfully.`);
    setTimeout(() => setAuditSlipNotification(null), 3500);
  };

  const activeModule = insuranceMasterChecklist.find(m => m.code === selectedModuleCode) || insuranceMasterChecklist[0];

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
                <ArrowLeft className="w-4 h-4 text-purple-600" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {activeAgency.name}
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full">
                  Insurance & Claims Suite
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                IRDAI: {activeAgency.irdaiNumber} • {activeAgency.city}
              </p>
            </div>
          </div>

          {/* Switcher & Actions */}
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            {/* Agency Switcher */}
            <select
              value={selectedAgencyId}
              onChange={(e) => setSelectedAgencyId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {agencies.map(a => (
                <option key={a.id} value={a.id}>
                  🛡️ {a.name.split(' ')[0]}... ({a.city})
                </option>
              ))}
            </select>

            {/* Mode Switcher: Agency Admin vs Policyholder */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-bold">
              <button
                onClick={() => setViewRole('admin')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewRole === 'admin'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Broker Desk</span>
              </button>
              <button
                onClick={() => setViewRole('policyholder')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewRole === 'policyholder'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Policyholder Locker</span>
              </button>
            </div>

            {/* Built-in AI Medical & Claim Dossier Classifier */}
            <button
              onClick={() => setIsAIClassifierOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs border border-indigo-200 transition-all flex items-center gap-1.5 shadow-2xs"
              title="Groq AI Medical Bill & Claim Dossier Classification"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">AI Claim Classifier</span>
            </button>

            {onOpenSubscribe && (
              <button
                onClick={() => onOpenSubscribe('insurance')}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upgrade Agency Plan</span>
              </button>
            )}

            {/* Insurance Sign In / Verified Profile Pill */}
            {currentUser && currentUser.role === 'insurance' ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-50 border border-purple-200 text-left">
                <div className="w-6 h-6 rounded-lg bg-purple-600 text-white font-extrabold text-[9px] flex items-center justify-center">
                  {currentUser.avatarInitials || 'IN'}
                </div>
                <div className="hidden sm:block">
                  <span className="text-[10px] font-bold text-slate-800 block truncate max-w-[110px] leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[8px] font-black text-purple-700 block leading-tight">
                    ✓ IRDAI LICENSED
                  </span>
                </div>
              </div>
            ) : onOpenAuth ? (
              <button
                onClick={() => onOpenAuth('insurance')}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-extrabold text-xs border border-purple-300 shadow-2xs transition-all flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-purple-600" />
                <span>Insurance Sign In</span>
              </button>
            ) : null}
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Operational Blueprint Banner from ClarioLoop Insurance PDF */}
        <div className="bg-white border border-purple-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-purple-600 shrink-0" />
              <h3 className="text-sm font-extrabold text-slate-900">
                ClarioLoop Insurance • Section-Wise Client & Claims Document Checklist
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
              Covers <strong>LIC, Life, Health, Motor, General Insurance, Claims, and Renewals</strong>. 
              Designed for insurance agents, agencies, brokers, and distribution teams. Field design with Mandatory, Conditional, and Optional flags, IRDAI data privacy safeguards.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleDownloadAuditSlip('txt')}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-purple-600" />
              <span>Claims Slip .TXT</span>
            </button>
            <button
              onClick={() => handleDownloadAuditSlip('csv')}
              className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs border border-purple-200 flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Audit Slip Alert */}
        {auditSlipNotification && (
          <div className="p-3 bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
            <span>{auditSlipNotification}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 1: BROKER DESK & AGENCY VIEW */}
        {/* ============================================================== */}
        {viewRole === 'admin' && (
          <div className="space-y-6">
            
            {/* Top Operational Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Active Policyholders</span>
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {activeAgency.activeClientsCount.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  100% KYC & CIS Delivered
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Claims Settled</span>
                  <HeartHandshake className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {activeAgency.claimsProcessedCount} Settled
                </div>
                <div className="text-[11px] text-slate-500 font-semibold mt-1">
                  Cashless TPA & Motor Survey
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Upcoming Renewals</span>
                  <Calendar className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  64 Policies Due
                </div>
                <div className="text-[11px] text-amber-600 font-semibold mt-1">
                  Auto-reminders active
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>IRDAI Compliance</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Verified Clean
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  Annual Broker Audit Passed
                </div>
              </div>
            </div>

            {/* Subnav Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto no-scrollbar text-xs font-bold">
              {[
                { id: 'modules', label: 'Proposal Checklists (INS-1 to 6)', icon: FileText },
                { id: 'claims', label: 'Claims Desk (Death, Health, Motor)', icon: HeartHandshake },
                { id: 'renewals', label: 'Renewals & Servicing', icon: Calendar },
                { id: 'corporate', label: 'Corporate Group Insurance', icon: Building2 }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-purple-600 text-purple-700 font-black'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: PROPOSAL MODULES */}
            {activeTab === 'modules' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Module Selector Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 px-1">
                    Insurance Categories
                  </div>
                  {insuranceMasterChecklist.map(mod => {
                    const isSelected = mod.code === selectedModuleCode;
                    return (
                      <button
                        key={mod.code}
                        onClick={() => setSelectedModuleCode(mod.code)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-purple-50/80 border-purple-500 text-purple-950 ring-2 ring-purple-500/20 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {mod.code}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {mod.items.length} items
                          </span>
                        </div>
                        <h4 className="font-extrabold text-xs mt-1.5 line-clamp-1">
                          {mod.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {mod.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Module Checklist Table */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                            Category {activeModule.code}
                          </span>
                          <h2 className="text-base font-black text-slate-900">
                            {activeModule.title}
                          </h2>
                        </div>
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
                                ? 'bg-purple-600 text-white shadow-2xs'
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
                        placeholder="Search policy proposals, RC book, medical test, or claim papers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Checklist List */}
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
                                onClick={() => alert(`Verified document "${uploadInfo.fileName}" transmitted to insurer underwriters.`)}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
                              >
                                <span>View File</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSimulateUpload(item.name)}
                                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-all"
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

            {/* TAB 2: CLAIMS DESK */}
            {activeTab === 'claims' && (
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Comprehensive Claims Intake & Processing Desk
                  </h3>
                  <p className="text-xs text-slate-500">
                    Specialized workflows for Life Death Claims, Health Cashless/Reimbursement, and Motor Accident Surveys.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <strong className="text-xs text-slate-900 font-black block">🕊️ Life Death Claims (12 items)</strong>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                      <li>Municipal Death Certificate</li>
                      <li>Original Policy Bond & Discharge Form</li>
                      <li>Claimant KYC & Bank Mandate</li>
                      <li>Hospital Records & FIR (for Accidental)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <strong className="text-xs text-slate-900 font-black block">🏥 Health Hospital Claims (17 items)</strong>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                      <li>Discharge Summary with clinical history</li>
                      <li>Final Itemised Hospital Bill & Receipts</li>
                      <li>Doctor Prescriptions & Pharmacy Bills</li>
                      <li>Diagnostic & Laboratory Investigation Reports</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <strong className="text-xs text-slate-900 font-black block">🚗 Motor Damage Claims (14 items)</strong>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                      <li>Claim Intimation & Accident Spot Photos</li>
                      <li>Vehicle RC & Driving Licence (DL)</li>
                      <li>Authorized Garage Repair Estimate</li>
                      <li>Surveyor Inspection & Assessment Voucher</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: RENEWALS */}
            {activeTab === 'renewals' && (
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Policy Renewals & Premium Servicing Engine
                  </h3>
                  <p className="text-xs text-slate-500">
                    Automated renewal notices, NCB continuity tracking, and lapse revival declarations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-bold">Renewals Due Next 30 Days</span>
                    <strong className="text-xl font-black text-slate-900 block mt-0.5">64 Policies</strong>
                    <span className="text-purple-600 font-bold">₹14.2L Premium Target</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-bold">Automated WhatsApp Reminders</span>
                    <strong className="text-xl font-black text-emerald-700 block mt-0.5">98% Delivered</strong>
                    <span className="text-slate-500">Includes payment link</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-bold">No Claim Bonus (NCB) Retained</span>
                    <strong className="text-xl font-black text-blue-700 block mt-0.5">50% Max NCB</strong>
                    <span className="text-slate-500">Discounts verified</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CORPORATE */}
            {activeTab === 'corporate' && (
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Corporate & Group Insurance Client Portfolios
                  </h3>
                  <p className="text-xs text-slate-500">
                    Group Term Life, Group Mediclaim, employee census schedules, and fire asset registers.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <strong className="text-slate-900 font-bold block">NexGen Digital Solutions Pvt Ltd • Group Health Cover</strong>
                  <p className="text-slate-600">
                    120 Employees Covered • Annual Premium: ₹18.5 Lakh • TPA: MediAssist India
                  </p>
                  <span className="inline-block text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Employee Census Active • Mid-term Addition Ready
                  </span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: POLICYHOLDER / INSURED VAULT */}
        {/* ============================================================== */}
        {viewRole === 'policyholder' && (
          <div className="space-y-6">
            
            {/* Policyholder Profile Summary */}
            <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-black text-lg flex items-center justify-center shrink-0">
                  RS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Rajeshwar Sen
                    </h3>
                    <span className="text-[10px] font-black bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full">
                      Client ID: INS-CL-9920
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    HDFC Life (₹1.0 Cr) • Star Health (₹10L) • ICICI Lombard Motor • Mobile: +91 98200 88776
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadAuditSlip('txt')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-purple-600" />
                  <span>Download Policy Locker Slip</span>
                </button>
              </div>
            </div>

            {/* Active Cover Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <span className="text-xs text-slate-500 font-bold block">Life Term Cover</span>
                <span className="text-2xl font-black text-slate-900 block mt-1">₹1,00,00,000</span>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                  Next Due: October 2027 • Active Policy
                </span>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <span className="text-xs text-slate-500 font-bold block">Family Health Mediclaim</span>
                <span className="text-2xl font-black text-slate-900 block mt-1">₹10,00,000</span>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                  Cashless TPA Card Active (4 Members)
                </span>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <span className="text-xs text-slate-500 font-bold block">Motor Comprehensive</span>
                <span className="text-2xl font-black text-purple-700 block mt-1">IDV ₹8,50,000</span>
                <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
                  50% No Claim Bonus (NCB) Protected
                </span>
              </div>
            </div>

            {/* Verified Insurance Documents */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900">
                Your Policy Vault & Verified Claim Submissions
              </h3>

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

      {/* Internal AI Medical & Claim Classifier Modal */}
      <AIAssistantModal 
        isOpen={isAIClassifierOpen} 
        onClose={() => setIsAIClassifierOpen(false)} 
      />

    </div>
  );
}
