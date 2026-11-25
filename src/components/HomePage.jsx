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
  Play
} from 'lucide-react';
import { subscriptionTiers, coreFeatures, industryWorkflows } from '../data/mockData';
import RazorpayModal from './RazorpayModal';

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

export default function HomePage({ onLaunchApp, onLaunchPortal, onLaunchAdmin, onLaunchAI }) {
  const [heroUploaded, setHeroUploaded] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState(null);
  const [selectedIndustryModal, setSelectedIndustryModal] = useState(null);

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

            {/* Action CTAs: 3 Dedicated Portals */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              {/* 1. CA Practice Portal */}
              <button
                onClick={onLaunchApp}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <span>Launch CA Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 2. Client Mobile Upload Portal */}
              <button
                onClick={onLaunchPortal}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-sm border border-emerald-200 transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Client Mobile Portal</span>
              </button>

              {/* 3. SuperAdmin Portal */}
              <button
                onClick={onLaunchAdmin}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-extrabold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>SuperAdmin Portal</span>
              </button>
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

          {/* ================= INTERACTIVE DUAL-DEVICE SHOWCASE (Matching Laptop + Mobile in Poster) ================= */}
          <div className="mt-10 sm:mt-12 max-w-5xl mx-auto rounded-3xl bg-slate-900 p-3 sm:p-5 shadow-2xl border border-slate-800 relative">
            <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/80">
              {/* Window Header */}
              <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 pl-2 truncate">
                    clarioloop.com • Document Collection Overview
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
                    Live Demo
                  </span>
                </div>
              </div>

              {/* Showcase Grid: Laptop Overview (Left) + Phone Client Upload (Right) */}
              <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 text-slate-100">
                
                {/* Left: Document Collection Overview with 82% Gauge */}
                <div className="space-y-4 bg-slate-900/70 p-4 sm:p-5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                        Workflow Dashboard
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">Document Collection Overview</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700">
                      248 In-Flight
                    </span>
                  </div>

                  {/* 4 Mini KPI Cards */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                      <span className="text-slate-400 text-[9px] block">Requests</span>
                      <strong className="text-white text-sm font-black">248</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800">
                      <span className="text-emerald-400 text-[9px] block">Completed</span>
                      <strong className="text-emerald-300 text-sm font-black">196</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800">
                      <span className="text-amber-400 text-[9px] block">Pending</span>
                      <strong className="text-amber-300 text-sm font-black">32</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800">
                      <span className="text-rose-400 text-[9px] block">Missing</span>
                      <strong className="text-rose-300 text-sm font-black">20</strong>
                    </div>
                  </div>

                  {/* Document Progress 82% Widget */}
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="stroke-slate-700"
                            strokeWidth="3.5"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="stroke-indigo-500"
                            strokeWidth="3.5"
                            strokeDasharray="82, 100"
                            strokeLinecap="round"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute text-[11px] font-black text-white">82%</span>
                      </div>
                      <div className="text-xs">
                        <strong className="text-white block">Document Progress</strong>
                        <span className="text-[11px] text-slate-400">196 of 248 collected</span>
                      </div>
                    </div>

                    <div className="text-[10px] space-y-0.5 text-right">
                      <span className="text-emerald-400 block">● Collected</span>
                      <span className="text-teal-400 block">● Verified</span>
                      <span className="text-rose-400 block">● Missing</span>
                      <span className="text-amber-400 block">● Due Soon</span>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800">
                    <span>Missing Doc Engine: Active</span>
                    <button onClick={onLaunchApp} className="text-indigo-400 hover:text-indigo-300 font-bold">
                      Open Dashboard →
                    </button>
                  </div>
                </div>

                {/* Right: What the Client Sees (Smartphone Screen from Poster) */}
                <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-indigo-500/40 shadow-inner flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-white">Mobile Upload Portal</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                        Zero Passwords
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      Clients simply tap their secure link to photograph or upload files. Tap below to simulate:
                    </p>

                    {/* Interactive Click-to-Upload Trigger */}
                    <button
                      onClick={() => setHeroUploaded(!heroUploaded)}
                      className={`w-full p-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 ${
                        heroUploaded 
                          ? 'border-emerald-500/80 bg-emerald-950/40 text-emerald-300' 
                          : 'border-indigo-500/60 bg-indigo-950/30 text-indigo-200 hover:bg-indigo-950/50'
                      }`}
                    >
                      <UploadCloud className={`w-6 h-6 ${heroUploaded ? 'text-emerald-400' : 'text-indigo-400 animate-bounce'}`} />
                      <span className="text-xs font-bold">
                        {heroUploaded ? '✓ Document Uploaded & AI Verified!' : 'Drag & Drop or Choose Files'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {heroUploaded ? 'Reminders stopped • CA dashboard notified' : 'Tap to test the instant client upload simulation'}
                      </span>
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Encrypted 256-bit SSL</span>
                    <button onClick={onLaunchPortal} className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                      <span>Preview Client View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

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
              The 7 Pillars of Document Automation
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

          {/* 10 Industry Tiles Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {industryWorkflows.map(wf => {
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

      {/* ================= SUBSCRIPTION PRICING SECTION ================= */}
      <section className="py-14 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Transparent Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Simple Plans for Solopreneurs & Large Practices
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Start with a 14-day free trial. Upgrade seamlessly with instant Razorpay checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subscriptionTiers.map(tier => (
              <div 
                key={tier.id}
                className={`rounded-2xl p-5 bg-white border flex flex-col justify-between transition-all ${
                  tier.recommended 
                    ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20' 
                    : 'border-slate-200/80 shadow-xs hover:border-slate-300'
                }`}
              >
                <div>
                  {tier.recommended && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded-full inline-block mb-2">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-extrabold text-base text-slate-900">{tier.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">{tier.priceINR}</span>
                    <span className="text-xs text-slate-500">{tier.period}</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 mt-1 block">{tier.clientCapacity}</span>

                  <ul className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                    {tier.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setCheckoutTier(tier)}
                  className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    tier.recommended 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  Subscribe via Razorpay
                </button>
              </div>
            ))}
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
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
        </div>
      )}

      {/* Razorpay Subscription Modal */}
      {checkoutTier && (
        <RazorpayModal
          isOpen={true}
          onClose={() => setCheckoutTier(null)}
          plan={checkoutTier}
          firm={{
            name: 'Your Practice / Company',
            partnerName: 'Managing Partner',
            email: 'contact@firm.in',
            phone: '+91 98765 43210'
          }}
          onPaymentSuccess={() => {
            setCheckoutTier(null);
            onLaunchApp();
          }}
        />
      )}

    </div>
  );
}
