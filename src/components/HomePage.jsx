import React, { useState } from 'react';
import Logo from './Logo';
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Smartphone,
  Check,
  Building2,
  Landmark,
  GraduationCap,
  Users,
  UserCheck,
  CreditCard,
  UploadCloud,
  Cpu,
  FileSearch,
  BellRing,
  Calendar,
  BarChart3,
  Sparkles,
  Lock
} from 'lucide-react';
import { coreFeatures, financeMasterChecklist } from '../data/mockData';

const pillarIconMap = {
  UploadCloud,
  Cpu,
  FileSearch,
  BellRing,
  Calendar,
  ShieldCheck,
  BarChart3
};

const VERTICAL_HOME_CONFIG = {
  ca: {
    badge: 'CA & TAX AUDIT',
    title: 'CA & Tax Audit Document Workspace',
    subtitle: 'Automated client document collection, Tax Audit (44AB), GST, ROC & TDS compliance for Chartered Accountants and their Clients.',
    heroGradient: 'from-slate-950 via-indigo-950 to-slate-950',
    glowBg: 'bg-indigo-500/25',
    accentText: 'text-indigo-600',
    pillClass: 'bg-indigo-500/20 border-indigo-400/30 text-indigo-200',
    deskTopBar: 'from-indigo-600 to-blue-600',
    clientTopBar: 'from-teal-500 to-emerald-600',
    deskIconBg: 'bg-gradient-to-br from-indigo-600 to-blue-600',
    clientIconBg: 'bg-gradient-to-br from-teal-500 to-emerald-600',
    primaryBtn: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white',
    secondaryBtn: 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white',
    subBtn: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200',
    highlightBorder: 'hover:border-indigo-300',
    deskRole: 'ca',
    clientRole: 'client',
    desk: {
      title: 'CA Practice Desk',
      subtitle: 'For Chartered Accountants, tax consultants, audit managers & article staff',
      icon: Building2,
      badge: 'AUDIT DESK',
      badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      features: [
        'Practice dashboard, client CRM & engagement letters',
        'Tax Audit (44AB), GST, TDS & ROC compliance checklists',
        'Automated WhatsApp & Email reminders with instant stop on upload',
        'AI document reader & verification reports'
      ],
      cta: 'Login / Register as CA Practice'
    },
    client: {
      title: 'Client / Taxpayer Portal',
      subtitle: 'For corporate clients, directors, proprietors & taxpayers',
      icon: Smartphone,
      badge: 'CLIENT PORTAL',
      badgeClass: 'bg-teal-50 text-teal-700 border border-teal-200',
      features: [
        'Simple document upload for PAN, GST, bank statements & financials',
        'Real-time verification status & missing document alerts',
        'Encrypted 256-bit upload with instant acknowledgement',
        'Stops automated reminders immediately after upload'
      ],
      cta: 'Login / Register as Client'
    },
    highlights: [
      'ITR, AIS & 26AS Collection',
      'GSTR-1 / GSTR-3B & Ledgers',
      'Section 44AB Tax Audit Pack',
      'Payroll, Form 24Q/26Q & EPF/ESI',
      'MCA / ROC & Board Resolutions',
      'Automated Client Follow-ups'
    ]
  },

  insurance: {
    badge: 'INSURANCE & CLAIMS',
    title: 'Insurance & Claims Document Workspace',
    subtitle: 'Streamlined KYC, policy servicing, renewals, and cashless/reimbursement claim documentation for Insurance Agencies, Brokers & Policyholders.',
    heroGradient: 'from-slate-950 via-purple-950 to-slate-950',
    glowBg: 'bg-purple-500/25',
    accentText: 'text-purple-600',
    pillClass: 'bg-purple-500/20 border-purple-400/30 text-purple-200',
    deskTopBar: 'from-purple-600 to-fuchsia-600',
    clientTopBar: 'from-violet-600 to-indigo-600',
    deskIconBg: 'bg-gradient-to-br from-purple-600 to-fuchsia-600',
    clientIconBg: 'bg-gradient-to-br from-violet-600 to-indigo-600',
    primaryBtn: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white',
    secondaryBtn: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white',
    subBtn: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200',
    highlightBorder: 'hover:border-purple-300',
    deskRole: 'insurance',
    clientRole: 'ins_client',
    desk: {
      title: 'Agency & Broker Claims Desk',
      subtitle: 'For insurance agents, brokerages, TPAs, surveyors & corporate agencies',
      icon: ShieldCheck,
      badge: 'CLAIMS DESK',
      badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200',
      features: [
        'Life, Health, Motor & General insurance document checklists',
        'Cashless TPA pre-auth, hospital bills & motor FIR claim tracking',
        'Policy renewal reminders & nominee documentation',
        'Full audit log & review queue for claim readiness'
      ],
      cta: 'Login / Register as Agency / Broker'
    },
    client: {
      title: 'Policyholder / Claimant Portal',
      subtitle: 'For policyholders, insured members, nominees & claimants',
      icon: Users,
      badge: 'POLICYHOLDER',
      badgeClass: 'bg-violet-50 text-violet-700 border border-violet-200',
      features: [
        'Upload Aadhaar, PAN, policy copy & medical/accident bills',
        'Submit discharge summaries, RC/DL & bank cancelled cheque',
        'Track claim document review & missing item status',
        'Receive instant acknowledgement on submission'
      ],
      cta: 'Login / Register as Policyholder'
    },
    highlights: [
      'Life Death & Maturity Claims',
      'Health Cashless & Reimbursement',
      'Motor Accident & Damage Claims',
      'Nominee & Beneficiary KYC',
      'Corporate / Group Insurance',
      'Policy Renewal & Servicing'
    ]
  },

  education: {
    badge: 'EDUCATION & ADMISSIONS',
    title: 'Education & Admissions Document Workspace',
    subtitle: 'End-to-end student intake verification, scholarship DBT tracking, placements, and exit clearance for Institutions and Students.',
    heroGradient: 'from-slate-950 via-blue-950 to-slate-950',
    glowBg: 'bg-blue-500/25',
    accentText: 'text-blue-600',
    pillClass: 'bg-blue-500/20 border-blue-400/30 text-blue-200',
    deskTopBar: 'from-blue-600 to-indigo-600',
    clientTopBar: 'from-sky-500 to-cyan-600',
    deskIconBg: 'bg-gradient-to-br from-blue-600 to-indigo-600',
    clientIconBg: 'bg-gradient-to-br from-sky-500 to-cyan-600',
    primaryBtn: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white',
    secondaryBtn: 'bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white',
    subBtn: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
    highlightBorder: 'hover:border-blue-300',
    deskRole: 'education',
    clientRole: 'edu_student',
    desk: {
      title: 'Admissions & Staff Desk',
      subtitle: 'For registrars, admission officers, HODs & campus auditors',
      icon: GraduationCap,
      badge: 'ADMISSIONS DESK',
      badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
      features: [
        'Student intake & document verification across all routes',
        'Govt scholarship & DBT Aadhaar-seeding tracker',
        'UGC anti-ragging undertakings & placement consent tracking',
        'Exit / No-Dues clearance & NAAC/NIRF ready records'
      ],
      cta: 'Login / Register as Institution Staff'
    },
    client: {
      title: 'Student / Parent Portal',
      subtitle: 'For applicants, enrolled students & parents/guardians',
      icon: UserCheck,
      badge: 'STUDENT PORTAL',
      badgeClass: 'bg-sky-50 text-sky-700 border border-sky-200',
      features: [
        'Upload 10th/12th marks cards, TC, migration & rank cards',
        'Submit income, caste & scholarship concession certificates',
        'Track document verification & fee clearance receipts',
        'Get instant alerts if any admission file is pending'
      ],
      cta: 'Login / Register as Student / Parent'
    },
    highlights: [
      'Admissions & Identity Verification',
      'Marks Cards, TC & Migration',
      'Scholarship & DBT Aadhaar Seeding',
      'Hostel & Anti-Ragging Undertakings',
      'Placements & Internship Records',
      'Exit / No-Dues Clearance'
    ]
  },

  cooperative: {
    badge: 'CO-OPERATIVE BANKING',
    title: 'Co-operative Banking & PACS Workspace',
    subtitle: 'Daily Pigmy collection sheets, loan sanction dossiers, member KYC, and RCS audit readiness for Societies and Members.',
    heroGradient: 'from-slate-950 via-emerald-950 to-slate-950',
    glowBg: 'bg-emerald-500/25',
    accentText: 'text-emerald-600',
    pillClass: 'bg-emerald-500/20 border-emerald-400/30 text-emerald-200',
    deskTopBar: 'from-emerald-600 to-teal-600',
    clientTopBar: 'from-teal-500 to-cyan-600',
    deskIconBg: 'bg-gradient-to-br from-emerald-600 to-teal-600',
    clientIconBg: 'bg-gradient-to-br from-teal-500 to-cyan-600',
    primaryBtn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white',
    secondaryBtn: 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white',
    subBtn: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200',
    highlightBorder: 'hover:border-emerald-300',
    deskRole: 'cooperative',
    clientRole: 'coop_member',
    desk: {
      title: 'Society & Field Agent Desk',
      subtitle: 'For branch managers, cashiers, secretaries & pigmy agents',
      icon: Landmark,
      badge: 'SOCIETY DESK',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      features: [
        'Daily Pigmy collection sheet, agent routes & cash remittance',
        'Crop, Gold, MSME & Housing loan document scrutiny',
        'RCS compliance, board minutes & statutory audit areas',
        'Member KYC & nominee verification management'
      ],
      cta: 'Login / Register as Society Desk'
    },
    client: {
      title: 'Member / Account Holder Portal',
      subtitle: 'For society members, borrowers, farmers & daily depositors',
      icon: Users,
      badge: 'MEMBER PORTAL',
      badgeClass: 'bg-teal-50 text-teal-700 border border-teal-200',
      features: [
        'Digital passbook balance & daily Pigmy collection entries',
        'Upload land records (RTC/Pahani) & loan KYC documents',
        'Track loan approval status & share capital records',
        'Instant digital acknowledgement on submission'
      ],
      cta: 'Login / Register as Member'
    },
    highlights: [
      'Daily Pigmy Agent Collections',
      'Crop, Gold & Housing Loan Dossiers',
      'Member KYC & Share Capital',
      'Land Records (RTC / Pahani)',
      'RCS Audit & Board Minutes',
      'Instant Deposit Acknowledgements'
    ]
  }
};

export default function HomePage({
  selectedVertical = 'ca',
  onSelectRole,
  onChangeVertical,
  onOpenSubscriptions
}) {
  const cfg = VERTICAL_HOME_CONFIG[selectedVertical] || VERTICAL_HOME_CONFIG.ca;
  const DeskIcon = cfg.desk.icon;
  const ClientIcon = cfg.client.icon;
  const [activeFinanceModule, setActiveFinanceModule] = useState('A');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ================= EXECUTIVE DARK HERO ================= */}
      <section className={`relative overflow-hidden pt-8 pb-24 sm:pt-12 sm:pb-28 bg-gradient-to-br ${cfg.heroGradient} text-white border-b border-slate-800`}>
        <div className={`absolute -top-20 left-1/2 -translate-x-1/2 w-[620px] h-[280px] rounded-full blur-3xl pointer-events-none ${cfg.glowBg}`} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between gap-2 mb-6 sm:mb-8">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-[11px] font-black uppercase tracking-wider ${cfg.pillClass}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{cfg.badge}</span>
            </span>

            {onChangeVertical && (
              <button
                type="button"
                onClick={onChangeVertical}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 px-3.5 py-1.5 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Switch Industry</span>
              </button>
            )}
          </div>

          <div className="text-center max-w-3xl mx-auto space-y-3.5">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              {cfg.title}
            </h1>
            <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {cfg.subtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-[11px] font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit Encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Separate Desk & Member Access
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Real-Time Status Tracking
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FLOATING 2 ROLE CARDS ================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-10 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Side 1: Desk / Staff / Agency */}
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden flex flex-col justify-between">
            <div className={`h-1.5 w-full bg-gradient-to-r ${cfg.deskTopBar}`} />
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${cfg.deskIconBg} text-white flex items-center justify-center shadow-md`}>
                    <DeskIcon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${cfg.desk.badgeClass}`}>
                    {cfg.desk.badge}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">{cfg.desk.title}</h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cfg.desk.subtitle}</p>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
                  {cfg.desk.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className={`w-3 h-3 ${cfg.accentText}`} />
                      </span>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSelectRole(cfg.deskRole)}
                  className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${cfg.primaryBtn}`}
                >
                  <span>{cfg.desk.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Side 2: Client / Policyholder / Student / Member */}
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden flex flex-col justify-between">
            <div className={`h-1.5 w-full bg-gradient-to-r ${cfg.clientTopBar}`} />
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${cfg.clientIconBg} text-white flex items-center justify-center shadow-md`}>
                    <ClientIcon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${cfg.client.badgeClass}`}>
                    {cfg.client.badge}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">{cfg.client.title}</h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cfg.client.subtitle}</p>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
                  {cfg.client.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </span>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSelectRole(cfg.clientRole)}
                  className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${cfg.secondaryBtn}`}
                >
                  <span>{cfg.client.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RELEVANT INDUSTRY HIGHLIGHTS ================= */}
      <section className="py-12 sm:py-14 bg-white border-t border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
          <div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                Included in {cfg.badge}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Built-in checklists, secure document collection & automated verification.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {cfg.highlights.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border border-slate-200/90 bg-slate-50/70 flex items-center gap-3 text-xs font-bold text-slate-800 transition-colors ${cfg.highlightBorder}`}
              >
                <div className={`w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 ${cfg.accentText}`}>
                  <Check className="w-4 h-4" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* CA-Only Statutory Checklist Preview */}
          {selectedVertical === 'ca' && (
            <div className="pt-2 space-y-3 bg-slate-50/60 p-4 sm:p-5 rounded-3xl border border-slate-200/80">
              <div className="flex flex-wrap gap-2">
                {financeMasterChecklist.map(mod => {
                  const isSelected = activeFinanceModule === mod.code;
                  return (
                    <button
                      key={mod.code}
                      type="button"
                      onClick={() => setActiveFinanceModule(mod.code)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mod.title}
                    </button>
                  );
                })}
              </div>
              {(() => {
                const currentMod = financeMasterChecklist.find(m => m.code === activeFinanceModule) || financeMasterChecklist[0];
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentMod.items.slice(0, 6).map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-slate-800 truncate">{item.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 shrink-0">
                          {item.defaultTag}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Core Platform Features with Icons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
            {coreFeatures.map(feat => {
              const FeatIcon = pillarIconMap[feat.icon] || Sparkles;
              return (
                <div
                  key={feat.id}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/90 text-center flex flex-col items-center gap-2"
                >
                  <div className={`w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center ${cfg.accentText}`}>
                    <FeatIcon className="w-4 h-4" />
                  </div>
                  <h3 className="text-[11px] font-black text-slate-900 leading-tight">
                    {feat.title}
                  </h3>
                  <span className="text-[9px] font-bold text-slate-500 block">
                    {feat.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 text-white py-7 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Logo size="small" inverted={true} showTagline={false} />
          <span className="text-[11px] text-slate-400">
            © 2026 ClarioLoop Technologies • 256-Bit Encrypted Document Workflows
          </span>
        </div>
      </footer>
    </div>
  );
}
