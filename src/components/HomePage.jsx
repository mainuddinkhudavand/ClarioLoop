import React, { useState } from 'react';
import Logo from './Logo';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Smartphone, 
  UploadCloud, 
  BellRing, 
  MessageSquare, 
  Zap, 
  Check, 
  ChevronRight, 
  FileText, 
  Lock, 
  TrendingUp, 
  FileCheck2, 
  Users, 
  Cpu, 
  FileSearch, 
  Calendar, 
  BarChart3, 
  Calculator, 
  Scale, 
  HeartPulse, 
  GraduationCap, 
  Building, 
  Umbrella, 
  Factory, 
  Truck, 
  Handshake, 
  Play,
  Layers,
  AlertCircle,
  Tag,
  CreditCard
} from 'lucide-react';
import { coreFeatures, industryWorkflows, financeMasterChecklist } from '../data/mockData';

// Icon lookup for 7 pillars
const pillarIconMap = {
  UploadCloud,
  Cpu,
  FileSearch,
  BellRing,
  Calendar,
  ShieldCheck,
  BarChart3
};

// Icon lookup for 10 industries
const industryIconMap = {
  Calculator,
  Users,
  Scale,
  HeartPulse,
  Cross: HeartPulse,
  GraduationCap,
  Building,
  Umbrella,
  Factory,
  Truck,
  Handshake
};

export default function HomePage({ 
  onLaunchApp, 
  onLaunchPortal, 
  onLaunchAI,
  onLaunchCoop,
  onLaunchEdu,
  onLaunchInsurance,
  onOpenSubscriptions,
  onEnterVertical
}) {
  const [selectedIndustryModal, setSelectedIndustryModal] = useState(null);
  const [activeFinanceModule, setActiveFinanceModule] = useState('A');

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500 selection:text-white">
      
      {/* ================= HERO SECTION (Matches Blueprint & Poster) ================= */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24 border-b border-slate-100">
        {/* Soft Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[520px] bg-gradient-to-b from-indigo-50/70 via-blue-50/40 to-transparent -z-10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Slogan from Poster */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-extrabold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>One Platform • All Industries • All Your Document Workflows</span>
            </div>
          </div>

          {/* Main Headline from Poster */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Collect. Verify.{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Manage. Complete.
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed pt-1">
              The smart and secure way to collect, verify and manage documents from <strong>clients, employees, students, patients, vendors and more</strong> — across every sector.
            </p>

            {/* Action CTAs: Explore Universal Industry Suites */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <a
                href="#industry-suites"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <span>Explore Industry Suites</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 pt-3">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Zero client passwords
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Bank-grade 256-bit encryption
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Instant stop on upload
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4 DEDICATED INDUSTRY OPERATING SUITES ================= */}
      <section id="industry-suites" className="py-14 sm:py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Dedicated Flagship Solutions
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
              Four Purpose-Built Portals for Your Industry
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl mx-auto leading-relaxed">
              Every vertical runs on its own specialized master checklists, role-based workflows, separate subscription pricing, and counterpart portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. CA & Tax Audit Suite */}
            <div className="bg-slate-50/60 rounded-3xl p-5 sm:p-6 border border-slate-200 flex flex-col justify-between hover:border-indigo-400 hover:shadow-xl transition-all group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                    <Building className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                    Finance & Tax
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  CA & Tax Audit Suite
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  For Chartered Accountants, tax consultants, and corporate statutory auditors.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-1 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Modules A–F (Tax Audit, GST, ROC, TDS)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Passwordless Client Mobile Upload Vault</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Starting ₹999/mo (Starter, Pro, Business)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 space-y-2">
                <button
                  onClick={() => onEnterVertical ? onEnterVertical('ca') : onLaunchApp()}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Launch CA Practice Desk</span>
                </button>
                <button
                  onClick={() => onOpenSubscriptions && onOpenSubscriptions('ca')}
                  className="w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                  <span>View CA Subscriptions</span>
                </button>
              </div>
            </div>

            {/* 2. Cooperative Banking & Society Suite */}
            <div className="bg-slate-50/60 rounded-3xl p-5 sm:p-6 border border-slate-200 flex flex-col justify-between hover:border-emerald-400 hover:shadow-xl transition-all group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                    <Building className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Banking & PACS
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  Co-op Banking & Societies
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  For Credit Societies, PACS, Urban Co-op Banks & DCCB branches.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-1 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Modules 1–12 (Pigmy, RD, FD, Crop Loans)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Field Agent Daily Sheet & Cash Remittance</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Starting ₹1,499/mo (Society, PACS, DCCB)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 space-y-2">
                <button
                  onClick={() => onEnterVertical ? onEnterVertical('cooperative') : onLaunchCoop()}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Launch Co-op Desk</span>
                </button>
                <button
                  onClick={() => onOpenSubscriptions && onOpenSubscriptions('cooperative')}
                  className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Co-op Subscriptions</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                </button>
              </div>
            </div>

            {/* 3. Education & Admissions Suite */}
            <div className="bg-slate-50/60 rounded-3xl p-5 sm:p-6 border border-slate-200 flex flex-col justify-between hover:border-blue-400 hover:shadow-xl transition-all group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    Academic
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  Education & Admissions
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  For Schools, PU Colleges, Degree Institutions & Autonomous Universities.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-1 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Modules A–J (Admissions, Marks, TC, UGC)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Aadhaar-seeding DBT & Scholarship Tracker</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Starting ₹1,299/mo (Campus, College, Univ)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 space-y-2">
                <button
                  onClick={() => onEnterVertical ? onEnterVertical('education') : onLaunchEdu()}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Launch Education Desk</span>
                </button>
                <button
                  onClick={() => onOpenSubscriptions && onOpenSubscriptions('education')}
                  className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Edu Subscriptions</span>
                  <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
                </button>
              </div>
            </div>

            {/* 4. Insurance & Claims Suite */}
            <div className="bg-slate-50/60 rounded-3xl p-5 sm:p-6 border border-slate-200 flex flex-col justify-between hover:border-purple-400 hover:shadow-xl transition-all group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                    Claims & IRDAI
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  Insurance & Claims Suite
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  For Insurance Agents, Brokerages, TPAs, Surveyors & Corporate Agencies.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-1 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Modules 1–14 (Life, Health, Motor & Claims)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Cashless Hospital Bills & FIR Motor Claims</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Starting ₹799/mo (Solo, Broker, Corporate)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 space-y-2">
                <button
                  onClick={() => onEnterVertical ? onEnterVertical('insurance') : onLaunchInsurance()}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Launch Insurance Desk</span>
                </button>
                <button
                  onClick={() => onOpenSubscriptions && onOpenSubscriptions('insurance')}
                  className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Insurance Subscriptions</span>
                  <ChevronRight className="w-3.5 h-3.5 text-purple-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7 CORE FEATURE PILLARS (Exact Row from the Poster) ================= */}
      <section className="py-12 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Core Document Automation
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Engineered to replace manual email and WhatsApp document follow-up chaos.
            </p>
          </div>

          {/* 7 Feature Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {coreFeatures.map(feat => {
              const Icon = pillarIconMap[feat.icon] || Sparkles;

              return (
                <div 
                  key={feat.id}
                  className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col items-center text-center justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 leading-tight">
                      {feat.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug line-clamp-3">
                      {feat.description}
                    </p>
                  </div>
                  <span className="mt-2 text-[9px] font-bold text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded-full">
                    {feat.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= WHO CAN USE CLARIOLOOP? (All 10 Industries from Poster) ================= */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Universal Sector Coverage
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
              Who Can Use <span className="text-indigo-600">ClarioLoop</span>?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select any industry below to inspect pre-configured checklists and automated workflows:
            </p>
          </div>

          {/* Additional Industry Checklists Grid (excludes sectors already covered by the 4 Flagship Suites above) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {industryWorkflows
              .filter(wf => !['finance-accounting', 'education', 'insurance-banking'].includes(wf.id))
              .map(wf => {
              const Icon = industryIconMap[wf.icon] || Users;

              return (
                <button
                  key={wf.id}
                  onClick={() => setSelectedIndustryModal(wf)}
                  className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-indigo-400 transition-all text-left flex flex-col justify-between group transform hover:-translate-y-1"
                >
                  <div>
                    <div className={`w-10 h-10 rounded-xl ${wf.lightBg} ${wf.textColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                      {wf.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-400 block mt-0.5">
                      {wf.subtext}
                    </span>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-indigo-600 font-bold">
                    <span>View Checklist</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FOOTER BANNER (Exact Match from Poster) ================= */}
      <footer className="bg-slate-950 text-white py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <Logo size="small" inverted={true} showTagline={false} />
            <div className="h-4 w-px bg-slate-700 hidden sm:block" />
            <p className="text-xs text-slate-400">
              The Universal Document Workflow Platform for Modern Businesses
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchApp}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all"
            >
              <span>Go Digital with ClarioLoop</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-4 border-t border-slate-900 text-center text-[10px] text-slate-500">
          © 2026 ClarioLoop Technologies Inc. All Rights Reserved. • ISO 27001 Certified • Bank Grade 256-Bit SSL
        </div>
      </footer>

      {/* ================= MODAL: INDUSTRY DETAIL CHECKLIST ================= */}
      {selectedIndustryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {selectedIndustryModal.id === 'finance-accounting' ? (
            /* Rich Full-Featured Master Checklist Modal for 1. Finance & Accounting */
            <div className="bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] animate-scaleUp">
              {/* Modal Header */}
              <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-white truncate">
                        Finance & Accounting Master Checklist
                      </h3>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                        Operational Template
                      </span>
                    </div>
                    <span className="text-xs text-indigo-300 font-medium truncate block">
                      Users: CA firms, tax consultants, accountants, auditors and bookkeeping firms
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedIndustryModal(null)} 
                  className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Module Sub-Tabs */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
                <div>
                  <span className="text-xs font-bold text-slate-800 block mb-2">
                    Select Workflow Module:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {financeMasterChecklist.map(mod => {
                      const isSelected = activeFinanceModule === mod.code;
                      return (
                        <button
                          key={mod.code}
                          type="button"
                          onClick={() => setActiveFinanceModule(mod.code)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-[11px] font-bold line-clamp-1">
                            {mod.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Module Detailed Checklist */}
                {(() => {
                  const currentModule = financeMasterChecklist.find(m => m.code === activeFinanceModule) || financeMasterChecklist[0];
                  return (
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                            {currentModule.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {currentModule.description}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 shrink-0">
                          {currentModule.items.length} Statutory Items
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                        {currentModule.items.map((item, idx) => (
                          <div 
                            key={idx}
                            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-indigo-300 transition-all flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <div className="min-w-0">
                                <span className="font-bold text-xs text-slate-800 truncate block">
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-slate-400 block truncate">
                                  {item.category}
                                </span>
                              </div>
                            </div>

                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                              item.defaultTag === 'Mandatory' 
                                ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {item.defaultTag}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Select, customize, and dispatch this checklist to any client in seconds.
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button 
                    onClick={() => setSelectedIndustryModal(null)}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedIndustryModal(null);
                      onLaunchApp();
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Open in Request Builder</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Standard Modal for other industries */
            <div className="bg-white w-full max-w-lg rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {selectedIndustryModal.name} Checklist
                  </h3>
                  <span className="text-xs text-slate-500">{selectedIndustryModal.subtext}</span>
                </div>
                <button onClick={() => setSelectedIndustryModal(null)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedIndustryModal.description}
              </p>

              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Standard Automated Requirements:
                </span>
                {selectedIndustryModal.sampleChecklist.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button 
                  onClick={() => setSelectedIndustryModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setSelectedIndustryModal(null);
                    onLaunchApp();
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Launch in Workspace</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
