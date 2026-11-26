import React from 'react';
import { 
  Building2, 
  Smartphone, 
  Landmark, 
  Users, 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  HeartPulse, 
  ArrowRight, 
  Check, 
  X, 
  Sparkles,
  Lock,
  FileCheck2,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';

const VERTICAL_CONFIGS = {
  ca: {
    id: 'ca',
    title: 'CA & Tax Audit Suite',
    tagline: 'Finance, Statutory Audit, GST & ROC Compliance',
    badge: 'FINANCE & TAX',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Select your role to access the Chartered Accountant workspace or the Client upload portal.',
    options: [
      {
        id: 'ca',
        title: 'Chartered Accountant / Practice',
        subtitle: 'For CA partners, audit managers, staff & article assistants',
        badge: 'AUDIT DESK',
        badgeColor: 'bg-indigo-600 text-white',
        icon: Building2,
        accentColor: 'indigo',
        cardBorder: 'hover:border-indigo-500 hover:shadow-indigo-500/10',
        buttonClass: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25',
        buttonLabel: 'Enter CA Practice Desk',
        features: [
          'Practice dashboard, client CRM & engagement letters',
          'Tax Audit (44AB), GST & ROC compliance checklists (Modules A–F)',
          'Automated WhatsApp/Email reminders & AI anomaly detection',
          'TDS & PF/ESI filing tracker with statutory due dates'
        ]
      },
      {
        id: 'client',
        title: 'Client / Taxpayer',
        subtitle: 'For corporate clients, directors, business owners & taxpayers',
        badge: 'CLIENT VAULT',
        badgeColor: 'bg-emerald-600 text-white',
        icon: Smartphone,
        accentColor: 'emerald',
        cardBorder: 'hover:border-emerald-500 hover:shadow-emerald-500/10',
        buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25',
        buttonLabel: 'Enter Client Mobile Portal',
        features: [
          'Zero password, OTP/token secured mobile document vault',
          'Instant photo/PDF upload for PAN, GST, bank & audit requests',
          'Real-time verification status & verified document receipts',
          'Stops automated reminder notifications on upload'
        ]
      }
    ]
  },

  cooperative: {
    id: 'cooperative',
    title: 'Cooperative Banking & Societies',
    tagline: 'PACS, Urban Co-op Banks, Credit Societies & DCCBs',
    badge: 'BANKING & PACS',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Select your role to access the Society Branch Desk or the Member Self-Service Vault.',
    options: [
      {
        id: 'admin',
        title: 'Society Desk & Field Agent',
        subtitle: 'For branch managers, cashiers, secretaries & pigmy agents',
        badge: 'BRANCH DESK',
        badgeColor: 'bg-emerald-600 text-white',
        icon: Landmark,
        accentColor: 'emerald',
        cardBorder: 'hover:border-emerald-500 hover:shadow-emerald-500/10',
        buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25',
        buttonLabel: 'Enter Society Desk',
        features: [
          'Daily Pigmy collection sheet, agent routes & cash remittance',
          'Crop, Gold, MSME & Housing loan document scrutiny',
          'RCS compliance, board minutes & 12 master audit areas',
          'Multi-branch member KYC & nominee verification desk'
        ]
      },
      {
        id: 'member',
        title: 'Member / Account Holder',
        subtitle: 'For society members, borrowers, farmers & daily depositors',
        badge: 'MEMBER VAULT',
        badgeColor: 'bg-teal-600 text-white',
        icon: Users,
        accentColor: 'teal',
        cardBorder: 'hover:border-teal-500 hover:shadow-teal-500/10',
        buttonClass: 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/25',
        buttonLabel: 'Enter Member Vault',
        features: [
          'Digital passbook balance & daily Pigmy collection entries',
          'Upload land records (RTC/Pahani) & loan KYC documents',
          'Track loan approval status, share capital & dividend slips',
          'Instant SMS & digital acknowledgement on deposit'
        ]
      }
    ]
  },

  education: {
    id: 'education',
    title: 'Education & Admissions Suite',
    tagline: 'Colleges, Universities, Autonomous Campuses & Schools',
    badge: 'ACADEMIC & CAMPUS',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Select your role to access the Admissions Office Desk or the Student Document Vault.',
    options: [
      {
        id: 'admin',
        title: 'Admissions Desk & Admin',
        subtitle: 'For registrars, admission officers, HODs & campus auditors',
        badge: 'ADMISSIONS DESK',
        badgeColor: 'bg-blue-600 text-white',
        icon: GraduationCap,
        accentColor: 'blue',
        cardBorder: 'hover:border-blue-500 hover:shadow-blue-500/10',
        buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25',
        buttonLabel: 'Enter Admissions Desk',
        features: [
          '10-Area Student Intake & Verification framework (Modules ED A–F)',
          'Govt scholarship & DBT Aadhaar-seeding tracker (NPCI)',
          'UGC anti-ragging undertakings & 9-point faculty staff audit',
          'NAAC/NIRF documentary compliance & exportable rolls'
        ]
      },
      {
        id: 'student',
        title: 'Student / Applicant / Parent',
        subtitle: 'For enrolled students, candidates, fee payers & guardians',
        badge: 'STUDENT VAULT',
        badgeColor: 'bg-indigo-600 text-white',
        icon: UserCheck,
        accentColor: 'indigo',
        cardBorder: 'hover:border-indigo-500 hover:shadow-indigo-500/10',
        buttonClass: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25',
        buttonLabel: 'Enter Student Vault',
        features: [
          'Upload 10th/12th marks cards, TC, migration & rank cards',
          'Submit income, caste & category concession certificates',
          'Track scholarship status & college fee clearance receipt',
          'Instant admission checklist verification progress bar'
        ]
      }
    ]
  },

  insurance: {
    id: 'insurance',
    title: 'Insurance & Claims Management',
    tagline: 'Life, Health, Motor, General & Group Underwriting',
    badge: 'INSURANCE & CLAIMS',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Select your role to access the Broker Claims Desk or the Policyholder Locker.',
    options: [
      {
        id: 'admin',
        title: 'Agency & Broker Claims Desk',
        subtitle: 'For licensed brokers, agency principals & claim surveyors',
        badge: 'BROKER DESK',
        badgeColor: 'bg-purple-600 text-white',
        icon: ShieldCheck,
        accentColor: 'purple',
        cardBorder: 'hover:border-purple-500 hover:shadow-purple-500/10',
        buttonClass: 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/25',
        buttonLabel: 'Enter Broker Desk',
        features: [
          'Life, Health, Motor & Group proposal scrutiny (14 Areas)',
          'Hospital bill, pharmacy voucher & discharge summary verification',
          'Accident survey reports, RC/DL & NCB retention management',
          'IRDAI compliance checklist, AML checks & agency pipeline'
        ]
      },
      {
        id: 'policyholder',
        title: 'Policyholder / Claimant',
        subtitle: 'For insured individuals, vehicle owners & beneficiaries',
        badge: 'POLICYHOLDER LOCKER',
        badgeColor: 'bg-amber-600 text-white',
        icon: HeartPulse,
        accentColor: 'amber',
        cardBorder: 'hover:border-amber-500 hover:shadow-amber-500/10',
        buttonClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/25',
        buttonLabel: 'Enter Policyholder Locker',
        features: [
          'Submit hospital bills, lab tests & cashless claim dossiers',
          'Declare Pre-Existing Disease (PED) & lifestyle questionnaire',
          'Upload vehicle damage photos, police FIR & driving license',
          'Download active verified policy locker & settlement slips'
        ]
      }
    ]
  }
};

export default function RoleGatewayModal({ 
  isOpen, 
  onClose, 
  vertical = 'ca', 
  onSelectRole,
  onOpenAuth
}) {
  if (!isOpen) return null;

  const currentConfig = VERTICAL_CONFIGS[vertical] || VERTICAL_CONFIGS.ca;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-5 sm:p-6 relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-1.5 pr-8">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border inline-block ${currentConfig.badgeColor}`}>
              {currentConfig.badge}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {currentConfig.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {currentConfig.description}
            </p>
          </div>
        </div>

        {/* 2 Options Cards Grid */}
        <div className="p-5 sm:p-7 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {currentConfig.options.map(option => {
              const Icon = option.icon;
              return (
                <div
                  key={option.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border-2 border-slate-200/90 shadow-sm flex flex-col justify-between transition-all group ${option.cardBorder}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${option.badgeColor}`}>
                        {option.badge}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                      {option.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {option.subtitle}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                      {option.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug text-[11px] sm:text-xs">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => onSelectRole(option.id)}
                      className={`w-full py-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${option.buttonClass}`}
                    >
                      <span>{option.buttonLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-slate-200/80 text-[11px]">
            <span className="text-slate-500">
              You can toggle between Desk and Vault roles at any time inside the portal.
            </span>
            {onOpenAuth && (
              <button
                type="button"
                onClick={() => onOpenAuth(vertical)}
                className="font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200/80 transition-all"
              >
                <span>Sign In to {currentConfig.title.split(' ')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
