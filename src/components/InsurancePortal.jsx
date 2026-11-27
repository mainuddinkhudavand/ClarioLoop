import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  Clock,
  UploadCloud,
  Download,
  ArrowLeft,
  Plus,
  Sparkles,
  AlertTriangle,
  FileText,
  Calendar,
  User,
  LayoutDashboard,
  FolderKanban,
  FileSearch,
  RefreshCw,
  BookOpen,
  BarChart3,
  Settings,
  ShieldAlert,
  Share2,
  XCircle,
  Ban,
} from 'lucide-react';
import { mockInsuranceAgencies } from '../data/verticalData';
import AIAssistantModal from './AIAssistantModal';
import PortalSidebar from './PortalSidebar';

const INSURERS = [
  { id: 'insurer-lic', name: 'LIC of India', code: 'LIC' },
  { id: 'insurer-hdfc', name: 'HDFC ERGO General Insurance', code: 'HDFC_ERGO' },
  { id: 'insurer-star', name: 'Star Health & Allied Insurance', code: 'STAR_HEALTH' },
];

const INITIAL_PRODUCTS = [
  { id: 'prd-1', insurerId: 'insurer-lic', category: 'LIFE', code: 'LIC_JEEVAN_UMANG', name: 'LIC Jeevan Umang', enabled: true },
  { id: 'prd-2', insurerId: 'insurer-lic', category: 'LIFE', code: 'LIC_TECH_TERM', name: 'LIC Tech Term Plan', enabled: true },
  { id: 'prd-3', insurerId: 'insurer-star', category: 'HEALTH', code: 'STAR_COMPREHENSIVE', name: 'Star Comprehensive Health', enabled: true },
  { id: 'prd-4', insurerId: 'insurer-hdfc', category: 'MOTOR', code: 'HDFC_MOTOR_COMP', name: 'HDFC ERGO Motor Comprehensive', enabled: true },
  { id: 'prd-5', insurerId: 'insurer-hdfc', category: 'GENERAL', code: 'HDFC_FIRE_LAGHU', name: 'Bharat Laghu Udyam Fire', enabled: true },
  { id: 'prd-6', insurerId: 'insurer-hdfc', category: 'GENERAL', code: 'HDFC_MARINE_LEGACY', name: 'Legacy Marine Hull (Disabled)', enabled: false },
];

const CUSTOMER_TYPES = [
  { id: 'INDIVIDUAL', label: 'Individual' },
  { id: 'SALARIED', label: 'Salaried' },
  { id: 'BUSINESS_PROPRIETOR', label: 'Business / Proprietor' },
  { id: 'SELF_EMPLOYED_PROF', label: 'Self-Employed Professional' },
  { id: 'COMPANY_PARTNERSHIP', label: 'Company / Partnership' },
  { id: 'NRI', label: 'NRI' },
  { id: 'CORPORATE_GROUP', label: 'Corporate / Group' },
];

const READY_TEMPLATE_SUMMARIES = [
  { name: 'Basic Customer Information', count: 14, scope: 'All Cases' },
  { name: 'KYC & Identity (Aadhaar Optional)', count: 10, scope: 'All Cases' },
  { name: 'Life / LIC Proposal', count: 20, scope: 'Proposal' },
  { name: 'Health Proposal', count: 17, scope: 'Proposal' },
  { name: 'Motor Proposal & Renewal', count: 15, scope: 'Motor' },
  { name: 'General Insurance (Home, Fire, Shop, Marine, Travel, PA, Machinery, CV)', count: 8, scope: '8 Sub-Types' },
  { name: 'Life Death Claim', count: 12, scope: 'Claim' },
  { name: 'Life Maturity / Survival Claim', count: 7, scope: 'Claim' },
  { name: 'Policy Servicing', count: 10, scope: 'Servicing' },
  { name: 'Health Claim (Cashless & Reimbursement)', count: 17, scope: 'Claim' },
  { name: 'Motor Accident / Damage Claim', count: 14, scope: 'Claim' },
  { name: 'Nominee / Beneficiary Documentation', count: 9, scope: 'Life/Health/PA' },
  { name: 'Income & Financial Evidence (By Customer Type)', count: 7, scope: 'Conditional' },
  { name: 'Corporate / Group Insurance', count: 15, scope: 'Group' },
  { name: 'Policy Renewal & Premium Servicing', count: 11, scope: 'Renewal' },
];

const SAMPLE_CLIENTS = Array.from({ length: 20 }, (_, i) => {
  const n = i + 1;
  const cType = CUSTOMER_TYPES[i % CUSTOMER_TYPES.length].id;
  return {
    id: `cli-${n}`,
    clientCode: `CL-${2000 + n}`,
    fullName: cType === 'CORPORATE_GROUP' ? `Apex Tech Logistics Ltd #${n}` : `Insured Client ${n}`,
    customerType: cType,
    mobile: `+91 98100 ${10000 + n}`,
    preferredChannel: n % 3 === 0 ? 'EMAIL' : 'WHATSAPP',
    consentVersion: 'v1.2',
  };
});

export default function InsurancePortal({
  onBack,
  onOpenSubscribe,
  initialRole = 'admin',
  currentUser,
  onOpenAuth,
  onOpenProfile,
}) {
  const activeAgency = mockInsuranceAgencies[0];
  const [viewRole, setViewRole] = useState(initialRole); // 'admin' | 'policyholder'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [staffRole, setStaffRole] = useState('AGENCY_ADMIN'); // AGENCY_ADMIN | AUTHORISED_REVIEWER | AGENT_RM | AUDITOR
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [aiAssistEnabled, setAiAssistEnabled] = useState(false); // OFF by default
  const [isAIClassifierOpen, setIsAIClassifierOpen] = useState(false);

  // Cases & Review Queue state
  const [cases, setCases] = useState([
    {
      id: 'case-1',
      ref: 'PROP-LIC-2026-001',
      clientId: 'cli-2',
      clientName: 'Insured Client 2',
      insurerId: 'insurer-lic',
      insurerName: 'LIC of India',
      productName: 'LIC Jeevan Umang',
      category: 'LIFE',
      purpose: 'PROPOSAL',
      customerType: 'SALARIED',
      nomineeIsMinor: true,
      items: [
        { id: 'c1-1', name: 'Signed Life Proposal Form', req: 'MANDATORY', status: 'VERIFIED', sensitive: false },
        { id: 'c1-2', name: 'Last 3 Months Salary Slips (Salaried)', req: 'CONDITIONAL', status: 'UNDER_REVIEW', sensitive: false },
        { id: 'c1-3', name: 'Appointee / Guardian KYC (Minor Nominee)', req: 'CONDITIONAL', status: 'REQUESTED', sensitive: false },
        { id: 'c1-4', name: 'PAN Card / Form 60', req: 'MANDATORY', status: 'REJECTED_RESUBMISSION_REQUIRED', reason: 'Blurry scan; please re-upload.', sensitive: false },
      ],
    },
    {
      id: 'case-2',
      ref: 'CLM-STAR-2026-104',
      clientId: 'cli-3',
      clientName: 'Insured Client 3',
      insurerId: 'insurer-star',
      insurerName: 'Star Health & Allied',
      productName: 'Star Comprehensive Health',
      category: 'HEALTH',
      purpose: 'CLAIM',
      claimNumber: 'CLM-STAR-2026-104',
      intimationDate: '2026-11-18',
      insurerDecision: 'PENDING_INSURER_REVIEW',
      customerType: 'BUSINESS_PROPRIETOR',
      items: [
        { id: 'c2-1', name: 'Health Claim Form (Part A & B)', req: 'MANDATORY', status: 'VERIFIED', sensitive: false },
        { id: 'c2-2', name: 'Hospital Discharge Summary (Medical)', req: 'MANDATORY', status: 'UNDER_REVIEW', sensitive: true },
        { id: 'c2-3', name: 'Cashless Pre-Auth Estimate', req: 'CONDITIONAL', status: 'REQUESTED', sensitive: true },
      ],
    },
    {
      id: 'case-3',
      ref: 'REN-HDFC-2026-209',
      clientId: 'cli-4',
      clientName: 'Insured Client 4',
      insurerId: 'insurer-hdfc',
      insurerName: 'HDFC ERGO General',
      productName: 'HDFC ERGO Motor Comprehensive',
      category: 'MOTOR',
      purpose: 'RENEWAL',
      renewalDueDate: '2026-12-05',
      customerType: 'SELF_EMPLOYED_PROF',
      items: [
        { id: 'c3-1', name: 'RC Copy & Previous Policy', req: 'MANDATORY', status: 'VERIFIED', sensitive: false },
        { id: 'c3-2', name: 'Commercial Permit & Fitness (CV)', req: 'CONDITIONAL', status: 'UNDER_REVIEW', sensitive: false },
        { id: 'c3-3', name: 'Premium Payment Receipt Upload (Tracking Only)', req: 'MANDATORY', status: 'REQUESTED', sensitive: false },
      ],
    },
  ]);

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'aud-1',
      action: 'AGENCY_BOUNDARY_INITIALIZED',
      actor: 'SYSTEM',
      record: 'ag-1',
      reason: 'Workflow layer only; no underwriting, claims settlement, or premium collection',
      time: new Date().toLocaleString('en-IN'),
    },
  ]);

  // New Case Wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizard, setWizard] = useState({
    insurerId: 'insurer-lic',
    productId: 'prd-1',
    clientId: 'cli-1',
    customerType: 'SALARIED',
    purpose: 'PROPOSAL',
    nomineeIsMinor: false,
    isCommercialVehicle: false,
    isFinancedVehicle: false,
    claimVariant: 'CASHLESS',
  });
  const [generatedLink, setGeneratedLink] = useState(null);
  const [reviewReason, setReviewReason] = useState('');
  const [statusBanner, setStatusBanner] = useState(null);

  React.useEffect(() => {
    if (initialRole) setViewRole(initialRole);
  }, [initialRole]);

  const enabledProducts = products.filter((p) => p.enabled);

  const logAudit = (action, record, reason = '') => {
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        action,
        actor: staffRole,
        record,
        reason: reason || 'Authorised workflow action',
        time: new Date().toLocaleString('en-IN'),
      },
      ...prev,
    ]);
  };

  const handleCreateWizardCase = (e) => {
    e.preventDefault();
    const insurer = INSURERS.find((i) => i.id === wizard.insurerId);
    const product = enabledProducts.find((p) => p.id === wizard.productId) || enabledProducts[0];
    const client = SAMPLE_CLIENTS.find((c) => c.id === wizard.clientId) || SAMPLE_CLIENTS[0];

    const dynamicItems = [
      { id: `nw-${Date.now()}-1`, name: 'Basic Customer Information & Consent (14-item pack)', req: 'MANDATORY', status: 'REQUESTED', sensitive: false },
      { id: `nw-${Date.now()}-2`, name: 'Officially Valid KYC Proof (PAN / Form 60; Aadhaar Optional)', req: 'MANDATORY', status: 'REQUESTED', sensitive: false },
    ];
    if (wizard.customerType === 'SALARIED') {
      dynamicItems.push({ id: `nw-${Date.now()}-3`, name: 'Last 3 Months Salary Slips (Salaried Rule)', req: 'CONDITIONAL', status: 'REQUESTED', sensitive: false });
    }
    if (wizard.customerType === 'NRI') {
      dynamicItems.push({ id: `nw-${Date.now()}-4`, name: 'NRI Passport, Visa & NRE/NRO Proof', req: 'CONDITIONAL', status: 'REQUESTED', sensitive: false });
    }
    if (wizard.nomineeIsMinor) {
      dynamicItems.push({ id: `nw-${Date.now()}-5`, name: 'Appointee / Guardian KYC & Consent (Minor Nominee)', req: 'CONDITIONAL', status: 'REQUESTED', sensitive: false });
    }
    if (product?.category === 'MOTOR' && wizard.isCommercialVehicle) {
      dynamicItems.push({ id: `nw-${Date.now()}-6`, name: 'Commercial Permit & Fitness Certificate', req: 'CONDITIONAL', status: 'REQUESTED', sensitive: false });
    }
    if (product?.category === 'MOTOR' && wizard.isFinancedVehicle) {
      dynamicItems.push({ id: `nw-${Date.now()}-7`, name: 'Financer Hypothecation Endorsement', req: 'CONDITIONAL', status: 'REQUESTED', sensitive: false });
    }
    if (wizard.purpose === 'CLAIM' && product?.category === 'HEALTH') {
      dynamicItems.push({
        id: `nw-${Date.now()}-8`,
        name: wizard.claimVariant === 'CASHLESS' ? 'Cashless Pre-Auth & Estimate' : 'Original Paid Bills & Discharge Summary',
        req: 'CONDITIONAL',
        status: 'REQUESTED',
        sensitive: true,
      });
    }

    const newCase = {
      id: `case-${Date.now()}`,
      ref: `${wizard.purpose.slice(0, 3)}-${insurer?.code}-${Math.floor(100 + Math.random() * 900)}`,
      clientId: client.id,
      clientName: client.fullName,
      insurerId: insurer.id,
      insurerName: insurer.name,
      productName: product.name,
      category: product.category,
      purpose: wizard.purpose,
      customerType: wizard.customerType,
      nomineeIsMinor: wizard.nomineeIsMinor,
      claimNumber: wizard.purpose === 'CLAIM' ? `CLM-${Date.now().toString().slice(-5)}` : null,
      insurerDecision: wizard.purpose === 'CLAIM' ? 'PENDING_INSURER_REVIEW' : null,
      items: dynamicItems,
    };

    setCases((prev) => [newCase, ...prev]);
    const token = `ins_${Math.random().toString(36).slice(2, 10)}`;
    setGeneratedLink(`${window.location.origin}/?upload_token=${token}&case=${newCase.ref}`);
    logAudit('CASE_CREATED_WIZARD', newCase.ref, `${wizard.purpose} for ${wizard.customerType}`);
    setWizardOpen(false);
    setStatusBanner(`Case ${newCase.ref} created with ${dynamicItems.length} conditional items.`);
  };

  const handleReviewDecision = (caseId, itemId, decision) => {
    if (['REJECTED_RESUBMISSION_REQUIRED', 'NOT_APPLICABLE'].includes(decision) && !reviewReason.trim()) {
      setStatusBanner('Please enter a mandatory reason before rejecting or marking Not Applicable.');
      return;
    }
    setCases((prev) =>
      prev.map((c) =>
        c.id !== caseId
          ? c
          : {
              ...c,
              items: c.items.map((it) =>
                it.id !== itemId
                  ? it
                  : { ...it, status: decision, reason: reviewReason.trim() || null }
              ),
            }
      )
    );
    logAudit(`REVIEW_${decision}`, `${caseId}/${itemId}`, reviewReason.trim() || 'Verified by staff');
    setReviewReason('');
    setStatusBanner(`Item updated to ${decision.replace(/_/g, ' ')} and logged in audit trail.`);
  };

  const handleClientUpload = (caseId, itemId, file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowed.includes(file.type)) {
      setStatusBanner('Upload blocked: Only PDF, JPG, and PNG files are allowed.');
      return;
    }
    if (file.size < 200) {
      setStatusBanner('Readability check failed: File appears blank or unreadable.');
      return;
    }
    setCases((prev) =>
      prev.map((c) =>
        c.id !== caseId
          ? c
          : {
              ...c,
              items: c.items.map((it) =>
                it.id !== itemId ? it : { ...it, status: 'UNDER_REVIEW', reason: null }
              ),
            }
      )
    );
    logAudit('CLIENT_PORTAL_UPLOAD', `${caseId}/${itemId}`, `Uploaded ${file.name}`);
    setStatusBanner(`Confirmed: "${file.name}" passed type/readability checks and is Under Review.`);
  };

  const handleExportReport = (reportType) => {
    const lines = ['CaseRef,Insurer,Product,Purpose,DocumentName,Requirement,Status'];
    for (const c of cases) {
      for (const it of c.items) {
        lines.push(`${c.ref},"${c.insurerName}","${c.productName}",${c.purpose},"${it.name}",${it.req},${it.status}`);
      }
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ClarioLoop_Insurance_${reportType}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    logAudit('REPORT_EXPORTED_CSV', reportType, 'Logged agency CSV export');
    setStatusBanner(`Exported ${reportType} report and recorded event in permanent Audit Log.`);
  };

  const allowMedicalView = ['AGENCY_ADMIN', 'AUTHORISED_REVIEWER'].includes(staffRole);
  const reviewQueueItems = cases.flatMap((c) =>
    c.items
      .filter((it) => it.status === 'UNDER_REVIEW')
      .map((it) => ({ ...it, caseId: c.id, caseRef: c.ref, insurerName: c.insurerName, clientName: c.clientName }))
  );

  const clientCase = cases[0];
  const clientDone = clientCase.items.filter((i) => ['VERIFIED', 'UNDER_REVIEW', 'RECEIVED'].includes(i.status)).length;
  const clientPct = Math.round((clientDone / Math.max(clientCase.items.length, 1)) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0"
                title="Back to Home"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-black text-slate-900 truncate">
                  ClarioLoop Insurance
                </h1>
                <span className="text-[10px] font-black uppercase bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                  Workflow Layer Only
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {activeAgency.name} • LIC, Life, Health, Motor & General
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Role Toggle: Staff Desk vs Client Upload Page */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setViewRole('admin')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewRole === 'admin' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Staff Workspace
              </button>
              <button
                onClick={() => setViewRole('policyholder')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewRole === 'policyholder' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Client Upload Link
              </button>
            </div>

            {viewRole === 'admin' && aiAssistEnabled && (
              <button
                onClick={() => setIsAIClassifierOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs border border-indigo-200 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Assist (Advisory)</span>
              </button>
            )}

            {onOpenSubscribe && (
              <button
                onClick={() => onOpenSubscribe('insurance')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Plans
              </button>
            )}

            {currentUser ? (
              <button
                type="button"
                onClick={() => onOpenProfile && onOpenProfile()}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition-colors"
                title="View & Edit Your Profile"
              >
                <div className="w-6 h-6 rounded-lg bg-purple-600 text-white font-extrabold text-[9px] flex items-center justify-center">
                  {currentUser.avatarInitials || 'IN'}
                </div>
                <div className="hidden sm:block">
                  <span className="text-[10px] font-bold text-slate-800 block truncate max-w-[110px] leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[8px] font-black text-purple-700 block leading-tight">
                    ✓ {currentUser.kycBadge || 'PROFILE'}
                  </span>
                </div>
              </button>
            ) : onOpenAuth ? (
              <button
                onClick={() => onOpenAuth('insurance')}
                className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 font-bold text-xs flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5" /> Sign In
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 space-y-5">
        {statusBanner && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center justify-between">
            <span>{statusBanner}</span>
            <button onClick={() => setStatusBanner(null)} className="text-emerald-700 font-bold ml-3">
              Dismiss
            </button>
          </div>
        )}

        {viewRole === 'policyholder' ? (
          /* ================= CLIENT UPLOAD PAGE (NO LOGIN REQUIRED, OWN RECORDS ONLY) ================= */
          <div className="max-w-xl mx-auto space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                    Secure Single-Purpose Link
                  </span>
                  <h2 className="text-base font-black text-slate-900 mt-1">
                    {clientCase.clientName} — {clientCase.ref}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {clientCase.insurerName} • {clientCase.productName}
                  </p>
                </div>
                <span className="text-xs font-extrabold text-purple-700">{clientPct}%</span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 transition-all" style={{ width: `${clientPct}%` }} />
              </div>
              <p className="text-[11px] text-slate-500">
                Showing only your requested records. Accepted formats: PDF, JPG, PNG (readability & duplicate checks active).
              </p>
            </div>

            {clientCase.items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">{item.name}</h3>
                    <span className="text-[10px] font-bold text-slate-400">{item.req}</span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {item.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {item.reason && (
                  <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded-lg">
                    Note: {item.reason}
                  </p>
                )}

                {['REQUESTED', 'NOT_REQUESTED', 'REJECTED_RESUBMISSION_REQUIRED'].includes(item.status) && (
                  <label className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50/40 hover:bg-purple-50 text-purple-800 text-xs font-bold cursor-pointer">
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload PDF / JPG / PNG</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => handleClientUpload(clientCase.id, item.id, e.target.files?.[0])}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* ================= STAFF WORKSPACE WITH LEFT SIDEBAR ================= */
          <div className="flex flex-col md:flex-row bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <PortalSidebar
              title="Apex Insurance Desk"
              subtitle="Claims, KYC & Renewals"
              initials="IN"
              accent="purple"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentUser={currentUser}
              onBack={onBack}
              items={[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'clients', label: 'Clients', icon: Users },
                { id: 'cases', label: 'Cases', icon: FolderKanban },
                { id: 'review', label: 'Review Queue', icon: FileSearch },
                { id: 'claims', label: 'Claims & Servicing', icon: FileCheck2 },
                { id: 'renewals', label: 'Renewals', icon: RefreshCw },
                { id: 'templates', label: 'Templates', icon: BookOpen },
                { id: 'reports', label: 'Reports', icon: BarChart3 },
                { id: 'settings', label: 'Settings', icon: Settings },
                { id: 'audit', label: 'Audit Log', icon: ShieldAlert }
              ]}
            />
            <div className="flex-1 min-w-0 p-4 sm:p-6 bg-slate-50/50 space-y-5">

            {/* DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Agency Operations Dashboard</h2>
                    <p className="text-xs text-slate-500">
                      Role Preview: <strong>{staffRole}</strong> (Medical Docs Visible: {allowMedicalView ? 'Yes' : 'Restricted'})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={staffRole}
                      onChange={(e) => setStaffRole(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                    >
                      <option value="AGENCY_ADMIN">Agency Admin</option>
                      <option value="AUTHORISED_REVIEWER">Authorised Reviewer</option>
                      <option value="AGENT_RM">Agent / RM (Medical Hidden)</option>
                      <option value="AUDITOR">Auditor (Read-Only)</option>
                    </select>
                    <button
                      onClick={() => setWizardOpen(true)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> New Case Wizard
                    </button>
                  </div>
                </div>

                {generatedLink && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <strong className="text-emerald-900 block">WhatsApp-Shareable Secure Client Upload Link:</strong>
                      <span className="font-mono text-emerald-800 break-all">{generatedLink}</span>
                    </div>
                    <button
                      onClick={() => setViewRole('policyholder')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold shrink-0 flex items-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Open Client Link
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-white rounded-2xl border border-slate-200 p-4">
                    <div className="text-xs text-slate-500 font-bold">Total Clients</div>
                    <div className="text-2xl font-black mt-1">{SAMPLE_CLIENTS.length}</div>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-4">
                    <div className="text-xs text-slate-500 font-bold">Active Cases</div>
                    <div className="text-2xl font-black mt-1">{cases.length}</div>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-4">
                    <div className="text-xs text-slate-500 font-bold">Awaiting Review</div>
                    <div className="text-2xl font-black text-purple-700 mt-1">{reviewQueueItems.length}</div>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-4">
                    <div className="text-xs text-slate-500 font-bold">Enabled Products</div>
                    <div className="text-2xl font-black mt-1">{enabledProducts.length}</div>
                  </div>
                </div>
              </div>
            )}

            {/* CLIENTS */}
            {activeTab === 'clients' && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 font-extrabold text-sm">
                  Registered Clients (All 7 Customer Types • Consent Tracked)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                      <tr>
                        <th className="py-3 px-4">Code</th>
                        <th className="py-3 px-4">Full Name</th>
                        <th className="py-3 px-4">Customer Type</th>
                        <th className="py-3 px-4">Preferred Channel</th>
                        <th className="py-3 px-4">Consent Version</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {SAMPLE_CLIENTS.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-bold">{c.clientCode}</td>
                          <td className="py-3 px-4 font-semibold">{c.fullName}</td>
                          <td className="py-3 px-4">{c.customerType}</td>
                          <td className="py-3 px-4">{c.preferredChannel}</td>
                          <td className="py-3 px-4 text-emerald-700 font-bold">{c.consentVersion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CASES */}
            {activeTab === 'cases' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-extrabold">All Cases (Proposal, Servicing, Renewal, Claims)</h2>
                  <button
                    onClick={() => setWizardOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Case Wizard
                  </button>
                </div>
                {cases.map((c) => {
                  const verifiedCount = c.items.filter((i) => i.status === 'VERIFIED').length;
                  const pct = Math.round((verifiedCount / Math.max(c.items.length, 1)) * 100);
                  return (
                    <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-black bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                            {c.purpose} • {c.category}
                          </span>
                          <h3 className="text-sm font-extrabold mt-1">
                            {c.ref} — {c.clientName}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {c.insurerName} • {c.productName} • {c.customerType}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-extrabold text-purple-700">{pct}% Verified</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {c.items.map((it) => (
                          <div key={it.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                            <span className="truncate font-medium">
                              {it.sensitive && !allowMedicalView ? '🔒 [Restricted Medical Document]' : it.name}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 shrink-0">
                              {it.req} • {it.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* REVIEW QUEUE */}
            {activeTab === 'review' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 text-xs">
                  <label className="font-bold text-slate-700 block">
                    Review / Rejection / N/A Reason (Mandatory for Reject & Not Applicable)
                  </label>
                  <input
                    value={reviewReason}
                    onChange={(e) => setReviewReason(e.target.value)}
                    placeholder="Enter verification note or plain-language rejection reason..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                {reviewQueueItems.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                    All pending documents have been reviewed.
                  </div>
                ) : (
                  reviewQueueItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          {item.sensitive && !allowMedicalView
                            ? '🔒 Restricted Medical Document (Requires Reviewer/Admin Role)'
                            : item.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.caseRef} • {item.clientName} • {item.insurerName}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs flex-wrap">
                        <button
                          onClick={() => handleReviewDecision(item.caseId, item.id, 'VERIFIED')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verify
                        </button>
                        <button
                          onClick={() => handleReviewDecision(item.caseId, item.id, 'REJECTED_RESUBMISSION_REQUIRED')}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                        <button
                          onClick={() => handleReviewDecision(item.caseId, item.id, 'NOT_APPLICABLE')}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center gap-1"
                        >
                          <Ban className="w-3.5 h-3.5" /> N/A
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* CLAIMS & SERVICING */}
            {activeTab === 'claims' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 text-xs">
                <h2 className="text-sm font-extrabold">Claims & Policy Servicing Tracker</h2>
                <p className="text-slate-500">
                  Records insurer-requested additional documents and the insurer&apos;s decision. ClarioLoop Insurance never underwrites, approves, or settles claims.
                </p>
                {cases
                  .filter((c) => c.purpose === 'CLAIM' || c.purpose === 'POLICY_SERVICING')
                  .map((c) => (
                    <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="font-extrabold text-slate-900">
                        {c.ref} • {c.clientName} ({c.insurerName})
                      </div>
                      {c.claimNumber && (
                        <div>
                          Claim #: <strong>{c.claimNumber}</strong> | Intimation: {c.intimationDate} | Insurer Decision:{' '}
                          <span className="font-bold text-purple-700">{c.insurerDecision}</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* RENEWALS */}
            {activeTab === 'renewals' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
                <h2 className="text-sm font-extrabold">Renewals & Premium Receipt Tracking</h2>
                <p className="text-slate-500">
                  Tracks renewal reminders and client-uploaded premium payment receipts only. No premium collection, wallet, or payment gateway.
                </p>
                {cases
                  .filter((c) => c.purpose === 'RENEWAL')
                  .map((c) => (
                    <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <strong className="text-slate-900">{c.ref} — {c.productName}</strong>
                        <div className="text-slate-500">Due Date: {c.renewalDueDate} • Receipt Tracking Only</div>
                      </div>
                      <button
                        onClick={() => {
                          logAudit('RENEWAL_REMINDER_SENT', c.ref, 'WhatsApp/Email reminder respecting consent opt-out');
                          setStatusBanner(`Renewal reminder sent for ${c.ref} (zero sensitive details in message).`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold"
                      >
                        Send Safe Reminder
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {/* TEMPLATES */}
            {activeTab === 'templates' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {READY_TEMPLATE_SUMMARIES.map((tpl) => (
                  <div key={tpl.name} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                      {tpl.scope}
                    </span>
                    <div className="text-xs font-extrabold text-slate-900 pt-1">{tpl.name}</div>
                    <div className="text-[11px] text-slate-500">{tpl.count} configurable items</div>
                  </div>
                ))}
              </div>
            )}

            {/* REPORTS */}
            {activeTab === 'reports' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  'Missing Documents Report',
                  'Pending Reviews Report',
                  'Overdue Requests & Turnaround Time',
                  'Claim Document Completeness & Renewals Due',
                  'Audit Evidence Index',
                ].map((r) => (
                  <div key={r} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900">{r}</span>
                    <button
                      onClick={() => handleExportReport(r.replace(/\s+/g, '_').toLowerCase())}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold flex items-center gap-1 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" /> CSV (Logged)
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                {/* Mandatory Regulatory Boundary Disclaimer */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-950">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Regulatory Boundary & Disclaimer:</strong> Document requirements depend on the insurer, product, applicable law and case circumstances. Confirm current IRDAI and insurer requirements before use. This tool is not legal or regulatory advice.
                    <div className="mt-1 text-[11px] text-amber-800">
                      ClarioLoop Insurance is a workflow layer only. It does NOT underwrite, approve/settle claims, give regulated advice, sell policies, or collect/pool/remit premiums.
                    </div>
                  </div>
                </div>

                {/* Product Enable/Disable Catalogue */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                  <h3 className="text-sm font-extrabold">Products (Disabled Products Hidden Everywhere)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {products.map((p) => (
                      <div key={p.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold">{p.name}</div>
                          <div className="text-[10px] text-slate-500">{p.code} • {p.category}</div>
                        </div>
                        <button
                          onClick={() => {
                            setProducts((prev) =>
                              prev.map((x) => (x.id === p.id ? { ...x, enabled: !x.enabled } : x))
                            );
                            logAudit('PRODUCT_TOGGLED', p.code, `Set enabled=${!p.enabled}`);
                          }}
                          className={`px-3 py-1 rounded-lg font-bold ${
                            p.enabled ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {p.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optional AI Assist (OFF by default) */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between text-xs">
                  <div>
                    <h3 className="text-sm font-extrabold">Optional AI Assistance (Suggestion-Only)</h3>
                    <p className="text-slate-500 mt-0.5">
                      Off by default. Staff must confirm every extracted field; AI never verifies documents or trains on client files.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAiAssistEnabled(!aiAssistEnabled);
                      logAudit('AI_ASSIST_TOGGLED', 'ag-1', `AI Assist set to ${!aiAssistEnabled}`);
                    }}
                    className={`px-4 py-2 rounded-xl font-bold shrink-0 ${
                      aiAssistEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {aiAssistEnabled ? 'Enabled (Advisory)' : 'OFF (Default)'}
                  </button>
                </div>
              </div>
            )}

            {/* AUDIT LOG */}
            {activeTab === 'audit' && (
              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
                <div className="p-4 font-extrabold text-sm bg-slate-50 rounded-t-2xl">
                  Permanent Audit Log ({auditLogs.length} events)
                </div>
                {auditLogs.map((a) => (
                  <div key={a.id} className="p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="font-mono font-bold text-purple-700">{a.action}</span> •{' '}
                      <span className="font-semibold">{a.record}</span>
                      <div className="text-[11px] text-slate-500">
                        Actor: {a.actor} • Reason: {a.reason}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{a.time}</span>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        )}
      </main>

      {/* NEW CASE WIZARD MODAL */}
      {wizardOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateWizardCase}
            className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-5 space-y-3 text-xs shadow-2xl"
          >
            <h3 className="text-base font-black text-slate-900">New Case Wizard</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold block mb-1">Insurer</label>
                <select
                  value={wizard.insurerId}
                  onChange={(e) => setWizard({ ...wizard, insurerId: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50"
                >
                  {INSURERS.map((ins) => (
                    <option key={ins.id} value={ins.id}>{ins.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">Enabled Product</label>
                <select
                  value={wizard.productId}
                  onChange={(e) => setWizard({ ...wizard, productId: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50"
                >
                  {enabledProducts.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">Customer Type</label>
                <select
                  value={wizard.customerType}
                  onChange={(e) => setWizard({ ...wizard, customerType: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50"
                >
                  {CUSTOMER_TYPES.map((ct) => (
                    <option key={ct.id} value={ct.id}>{ct.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">Purpose</label>
                <select
                  value={wizard.purpose}
                  onChange={(e) => setWizard({ ...wizard, purpose: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option value="PROPOSAL">New Proposal</option>
                  <option value="POLICY_SERVICING">Policy Servicing</option>
                  <option value="RENEWAL">Renewal</option>
                  <option value="CLAIM">Claim</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="flex items-center gap-2 font-semibold">
                <input
                  type="checkbox"
                  checked={wizard.nomineeIsMinor}
                  onChange={(e) => setWizard({ ...wizard, nomineeIsMinor: e.target.checked })}
                />
                <span>Nominee is a Minor (adds Guardian/Appointee docs)</span>
              </label>
              <label className="flex items-center gap-2 font-semibold">
                <input
                  type="checkbox"
                  checked={wizard.isCommercialVehicle}
                  onChange={(e) => setWizard({ ...wizard, isCommercialVehicle: e.target.checked })}
                />
                <span>Commercial Vehicle (adds Permit & Fitness)</span>
              </label>
              <label className="flex items-center gap-2 font-semibold">
                <input
                  type="checkbox"
                  checked={wizard.isFinancedVehicle}
                  onChange={(e) => setWizard({ ...wizard, isFinancedVehicle: e.target.checked })}
                />
                <span>Financed Vehicle (adds Hypothecation letter)</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setWizardOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold"
              >
                Generate Checklist & Send Link
              </button>
            </div>
          </form>
        </div>
      )}

      <AIAssistantModal isOpen={isAIClassifierOpen} onClose={() => setIsAIClassifierOpen(false)} />
    </div>
  );
}
