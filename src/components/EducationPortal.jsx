import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  FileCheck2, 
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
  Award, 
  Sparkles, 
  ChevronRight, 
  Building2, 
  FileSpreadsheet, 
  Check, 
  AlertTriangle,
  FileText,
  BadgeCheck,
  Calendar,
  School,
  Briefcase,
  User
} from 'lucide-react';
import { educationMasterChecklist, mockEducationalInstitutions } from '../data/verticalData';
import AIAssistantModal from './AIAssistantModal';

export default function EducationPortal({ 
  onBack, 
  onOpenSubscribe, 
  initialRole = 'admin',
  currentUser,
  onOpenAuth
}) {
  const [institutions, setInstitutions] = useState(mockEducationalInstitutions);
  const [selectedInstId, setSelectedInstId] = useState('edu-1');
  const [viewRole, setViewRole] = useState(initialRole); // 'admin' | 'student'
  const [isAIClassifierOpen, setIsAIClassifierOpen] = useState(false);

  React.useEffect(() => {
    if (initialRole) setViewRole(initialRole);
  }, [initialRole]);
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' | 'scholarships' | 'safety' | 'placements' | 'staff_audit'
  const [selectedModuleCode, setSelectedModuleCode] = useState('ED-A');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [auditSlipNotification, setAuditSlipNotification] = useState(null);

  const activeInstitution = institutions.find(i => i.id === selectedInstId) || institutions[0];

  // Mock Uploaded Student Documents
  const [uploadedDocs, setUploadedDocs] = useState({
    'Completed admission/application form with application number': {
      fileName: 'RVCE_Admission_Form_2026_USN084.pdf',
      size: '1.4 MB',
      uploadedAt: 'Today, 10:15 AM',
      status: 'VERIFIED',
      verifiedBy: 'Admissions Office'
    },
    'Recent passport-size photograph of student': {
      fileName: 'Student_Passport_Photo.jpg',
      size: '220 KB',
      uploadedAt: 'Today, 10:16 AM',
      status: 'VERIFIED',
      verifiedBy: 'Admissions Office'
    },
    'Class 10 / SSLC marks card or equivalent certificate': {
      fileName: 'Class10_SSLC_MarksCard_CBSE.pdf',
      size: '520 KB',
      uploadedAt: 'Today, 10:18 AM',
      status: 'VERIFIED',
      verifiedBy: 'Academic Registrar'
    },
    'Class 12 / PUC marks card or equivalent certificate': {
      fileName: 'Class12_PUC_Science_MarksCard.pdf',
      size: '640 KB',
      uploadedAt: 'Today, 10:20 AM',
      status: 'VERIFIED',
      verifiedBy: 'Academic Registrar'
    },
    'Counselling / seat allotment / admission order copy': {
      fileName: 'KEA_CET_Seat_Allotment_Order_CS.pdf',
      size: '480 KB',
      uploadedAt: 'Yesterday, 03:30 PM',
      status: 'VERIFIED',
      verifiedBy: 'Dean of Engineering'
    },
    'Anti-ragging undertaking by student and parent/guardian (UGC)': {
      fileName: 'UGC_Anti_Ragging_Affidavit_Executed.pdf',
      size: '710 KB',
      uploadedAt: '24-Nov-2026',
      status: 'VERIFIED',
      verifiedBy: 'Student Welfare Officer'
    }
  });

  // Handle Mock Upload
  const handleSimulateUpload = (itemName) => {
    const fakeFile = {
      fileName: itemName.replace(/[^a-zA-Z0-9]/g, '_') + '_Verified.pdf',
      size: '790 KB',
      uploadedAt: 'Just now',
      status: 'VERIFIED',
      verifiedBy: 'AI Academic Reader + Dean Desk'
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
    let filename = `ClarioLoop_Edu_${activeInstitution.id}_AdmissionSlip.${format}`;

    if (format === 'json') {
      mimeType = 'application/json';
      content = JSON.stringify({
        institution: activeInstitution.name,
        code: activeInstitution.aicteCode || activeInstitution.affiliationCode,
        city: activeInstitution.city,
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
CLARIOLOOP EDU - STUDENT ADMISSION AUDIT VERIFICATION SLIP
=====================================================
Institution: ${activeInstitution.name}
Code: ${activeInstitution.aicteCode || activeInstitution.affiliationCode}
City: ${activeInstitution.city}
Generated: ${timeStr}
Accreditation Compliance: UGC / AICTE / NAAC Criteria Compliant

STUDENT ADMISSION DOSSIER (SAMPLE):
Student: Ananya Deshmukh (USN: 1RV26CS084)
Programme: B.Tech Computer Science & Engineering (Semester 1)
Admission Category: Government CET Allotment (General Merit)

VERIFIED DOCUMENTS:
${Object.entries(uploadedDocs).map(([k, v], idx) => `${idx + 1}. [${v.status}] ${k} (${v.fileName}) - Checked by ${v.verifiedBy}`).join('\n')}

Originals Inspection: Inspected and Returned to Student under UGC Circular Guidelines.
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

    setAuditSlipNotification(`Downloaded ${format.toUpperCase()} Admission Slip successfully.`);
    setTimeout(() => setAuditSlipNotification(null), 3500);
  };

  const activeModule = educationMasterChecklist.find(m => m.code === selectedModuleCode) || educationMasterChecklist[0];

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
                <ArrowLeft className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {activeInstitution.name}
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                  Education Suite
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Code: {activeInstitution.aicteCode || activeInstitution.affiliationCode} • {activeInstitution.city}
              </p>
            </div>
          </div>

          {/* Switcher & Actions */}
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            {/* Institution Switcher */}
            <select
              value={selectedInstId}
              onChange={(e) => setSelectedInstId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>
                  🎓 {inst.name.split(' ')[0]}... ({inst.city})
                </option>
              ))}
            </select>

            {/* Mode Switcher: Admin vs Student */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-bold">
              <button
                onClick={() => setViewRole('admin')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewRole === 'admin'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <School className="w-3.5 h-3.5" />
                <span>Admissions Desk</span>
              </button>
              <button
                onClick={() => setViewRole('student')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewRole === 'student'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student Vault</span>
              </button>
            </div>

            {/* Built-in AI Marksheet & Certificate Classifier */}
            <button
              onClick={() => setIsAIClassifierOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs border border-indigo-200 transition-all flex items-center gap-1.5 shadow-2xs"
              title="Groq AI Marksheet & Certificate Classification"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">AI Marksheet Classifier</span>
            </button>

            {onOpenSubscribe && (
              <button
                onClick={() => onOpenSubscribe('education')}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upgrade Edu Plan</span>
              </button>
            )}

            {/* Edu Sign In / Verified Profile Pill */}
            {currentUser && currentUser.role === 'education' ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-left">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-extrabold text-[9px] flex items-center justify-center">
                  {currentUser.avatarInitials || 'ED'}
                </div>
                <div className="hidden sm:block">
                  <span className="text-[10px] font-bold text-slate-800 block truncate max-w-[110px] leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[8px] font-black text-blue-700 block leading-tight">
                    ✓ UGC ACCREDITED
                  </span>
                </div>
              </div>
            ) : onOpenAuth ? (
              <button
                onClick={() => onOpenAuth('education')}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-extrabold text-xs border border-blue-300 shadow-2xs transition-all flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Edu Sign In</span>
              </button>
            ) : null}
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Operational Blueprint Banner from ClarioLoop Edu PDF */}
        <div className="bg-white border border-blue-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <h3 className="text-sm font-extrabold text-slate-900">
                ClarioLoop Edu • Student Document Collection & NAAC/NBA Accreditation Master
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
              Configurable document collection checklist for <strong>Schools, PU Colleges, Degree Colleges, Engineering Colleges, and Universities</strong>. 
              Standardized requirement labels: <strong>Core</strong> (commonly required), <strong>Conditional</strong> (only when applicable), and <strong>Optional</strong> (institutional purpose). Privacy-by-design & UGC data-minimisation safeguards.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleDownloadAuditSlip('txt')}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Admission Slip .TXT</span>
            </button>
            <button
              onClick={() => handleDownloadAuditSlip('csv')}
              className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs border border-blue-200 flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Audit Slip Alert */}
        {auditSlipNotification && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{auditSlipNotification}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 1: INSTITUTION ADMIN / ADMISSIONS DESK */}
        {/* ============================================================== */}
        {viewRole === 'admin' && (
          <div className="space-y-6">
            
            {/* Top Academic Gauges */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Enrolled Students</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {activeInstitution.studentsCount.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  92.4% Full Dossiers Verified
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Scholarships & DBT</span>
                  <Award className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  482 Beneficiaries
                </div>
                <div className="text-[11px] text-purple-600 font-semibold mt-1">
                  SSP, NSP & Fee Concessions
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>NAAC / NBA Criteria</span>
                  <FileText className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  A++ Grade Ready
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  Student Progression Indexed
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Campus Safety Compliance</span>
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  100% Anti-Ragging
                </div>
                <div className="text-[11px] text-indigo-600 font-semibold mt-1">
                  UGC Undertakings On File
                </div>
              </div>
            </div>

            {/* Subnav Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto no-scrollbar text-xs font-bold">
              {[
                { id: 'modules', label: 'Admission Checklists (ED-A to F)', icon: BookOpen },
                { id: 'scholarships', label: 'Scholarships & DBT Tracker', icon: Award },
                { id: 'safety', label: 'Anti-Ragging & Institutional Forms', icon: ShieldCheck },
                { id: 'placements', label: 'Internships & Career Services', icon: Briefcase }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-700 font-black'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: ADMISSION MODULES */}
            {activeTab === 'modules' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Module Selector Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 px-1">
                    Academic Sections
                  </div>
                  {educationMasterChecklist.map(mod => {
                    const isSelected = mod.code === selectedModuleCode;
                    return (
                      <button
                        key={mod.code}
                        onClick={() => setSelectedModuleCode(mod.code)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-500 text-blue-950 ring-2 ring-blue-500/20 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
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
                          <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                            Section {activeModule.code}
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
                                ? 'bg-blue-600 text-white shadow-2xs'
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
                        placeholder="Search student requirements, marks card, certificates, or quotas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                onClick={() => alert(`Verified copy of "${uploadInfo.fileName}" stored in university registrar repository.`)}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
                              >
                                <span>View Document</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSimulateUpload(item.name)}
                                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-all"
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

            {/* TAB 2: SCHOLARSHIPS DESK */}
            {activeTab === 'scholarships' && (
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    State & National Scholarship Documentation Desk (SSP / NSP)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aadhaar NPCI DBT Seeding, Tahsildar Income & Caste certificates, and fee concession approvals.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-slate-500">Post-Matric State Scholarship</span>
                    <strong className="text-base text-slate-900 block">340 Applications</strong>
                    <span className="text-[11px] text-emerald-600 font-bold">100% DBT Seeded</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-slate-500">Merit Fee Concessions</span>
                    <strong className="text-base text-slate-900 block">85 Students</strong>
                    <span className="text-[11px] text-blue-600 font-bold">Approved by Dean</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-slate-500">Pending Government DBT Sync</span>
                    <strong className="text-base text-amber-600 block">18 Students</strong>
                    <span className="text-[11px] text-slate-500">Automated SMS nudge sent</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CAMPUS SAFETY & ANTI-RAGGING */}
            {activeTab === 'safety' && (
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    UGC Mandatory Anti-Ragging Undertakings & Campus Rules
                  </h3>
                  <p className="text-xs text-slate-500">
                    Every admitted student and parent/guardian executes UGC affidavits and code of conduct declarations.
                  </p>
                </div>

                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <strong className="text-blue-950 font-bold">UGC Compliance Status: 100% Signed Undertakings</strong>
                  </div>
                  <p className="text-blue-900 leading-relaxed">
                    All 2,840 admitted students have executed the online national anti-ragging declaration reference numbers on file.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: PLACEMENTS & CAREER */}
            {activeTab === 'placements' && (
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Training, Internship & Campus Placement Records
                  </h3>
                  <p className="text-xs text-slate-500">
                    Internship completion certificates, student profile sharing consent, and company offer letters.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block font-bold">Internship Completion Certificates</strong>
                    <span className="text-slate-500">380/420 Final Year B.Tech submitted</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block font-bold">Recruiter Consent Declarations</strong>
                    <span className="text-emerald-700 font-bold">Signed for 48 tier-1 corporate partners</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: STUDENT / APPLICANT VAULT */}
        {/* ============================================================== */}
        {viewRole === 'student' && (
          <div className="space-y-6">
            
            {/* Student Profile Card */}
            <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shrink-0">
                  AD
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Ananya Deshmukh
                    </h3>
                    <span className="text-[10px] font-black bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                      USN: 1RV26CS084
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    B.Tech Computer Science (Sem 1) • Quota: CET GM • Mobile: +91 99123 44556
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadAuditSlip('txt')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Download Admission Slip</span>
                </button>
              </div>
            </div>

            {/* Admission Progress */}
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Admission Dossier Completion</span>
                <span className="text-emerald-600 font-black">100% Completed (All Core Documents Verified)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[100%]" />
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Original certificates inspected and returned per UGC guidelines. Verified copies safely archived.
              </p>
            </div>

            {/* Verified Student Documents */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900">
                Your Submitted & Verified Academic Records
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

      {/* Internal AI Marksheet Classifier Modal */}
      <AIAssistantModal 
        isOpen={isAIClassifierOpen} 
        onClose={() => setIsAIClassifierOpen(false)} 
      />

    </div>
  );
}
