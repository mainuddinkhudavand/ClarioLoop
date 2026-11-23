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
  Users
} from 'lucide-react';
import { subscriptionTiers } from '../data/mockData';
import RazorpayModal from './RazorpayModal';

export default function HomePage({ onLaunchApp, onLaunchPortal, onLaunchAI }) {
  // Interactive Hero Preview state
  const [heroUploaded, setHeroUploaded] = useState(false);
  const [activeTab, setActiveTab] = useState('portal');
  const [checkoutTier, setCheckoutTier] = useState(null);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500 selection:text-white">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-100">
        {/* Soft Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-indigo-50/70 via-blue-50/40 to-transparent -z-10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Eyebrow Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Next-Gen Document Automation for CA & Bookkeeping Firms</span>
              <ArrowRight className="w-3 h-3 text-indigo-400" />
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Stop Chasing Clients for Documents.{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Automate Checklists & Follow-ups.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed pt-2">
              ClarioLoop sends recurring monthly document requests, provides a passwordless mobile upload link for your clients, verifies invoices with AI, and <strong>stops reminders automatically</strong> once submitted.
            </p>

            {/* Hero Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <button
                onClick={onLaunchApp}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5"
              >
                <span>Launch CA Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onLaunchPortal}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold text-sm border border-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-indigo-600" />
                <span>Test Client Mobile Portal</span>
              </button>

              <button
                onClick={onLaunchAI}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 text-teal-800 font-bold text-sm border border-teal-200 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Try Groq AI Scanner</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-3">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> 14-day free trial
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Zero client password friction
              </span>
            </div>
          </div>

          {/* ================= INTERACTIVE HERO PRODUCT PREVIEW ================= */}
          <div className="mt-12 max-w-5xl mx-auto rounded-3xl bg-slate-900 p-3 sm:p-5 shadow-2xl border border-slate-800 relative">
            <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/80">
              {/* Window Header */}
              <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono text-slate-400 pl-3">
                    app.clarioloop.com • Apex Chartered Accountants Workspace
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
                    Live Demo
                  </span>
                </div>
              </div>

              {/* Interactive Showcase Grid */}
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-100">
                {/* Left: CA Firm's Perspective */}
                <div className="space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">CA Workspace View</span>
                      <h4 className="text-sm font-bold text-white mt-0.5">NexGen Digital Solutions Pvt Ltd</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      heroUploaded ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' : 'bg-amber-900/60 text-amber-300 border border-amber-700'
                    }`}>
                      {heroUploaded ? '✓ 100% Complete' : 'Partially Submitted (3 Missing)'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                      <span className="flex items-center gap-2 text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>HDFC Bank Statement (PDF)</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">Received</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                      <span className="flex items-center gap-2 text-slate-200">
                        {heroUploaded ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
                        <span>GST Sales Register & Invoices</span>
                      </span>
                      <span className={`text-[10px] font-mono ${heroUploaded ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {heroUploaded ? 'AI Verified' : 'Awaiting'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                      <span className="flex items-center gap-2 text-slate-200">
                        {heroUploaded ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
                        <span>Vendor Purchase Bills for ITC</span>
                      </span>
                      <span className={`text-[10px] font-mono ${heroUploaded ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {heroUploaded ? 'AI Verified' : 'Awaiting'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800">
                    <span>Due Date: <strong>28th Nov 2026</strong></span>
                    <span className="text-indigo-400 font-semibold">Auto-reminders on WhatsApp</span>
                  </div>
                </div>

                {/* Right: What the Client Sees (Frictionless Mobile Experience) */}
                <div className="bg-slate-900 p-5 rounded-xl border border-indigo-500/40 shadow-inner flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-white">Client's Mobile Upload Link</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-medium">No Password Needed</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Your client simply clicks a secure WhatsApp link and snaps a photo of their bills directly from their phone camera:
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
                        {heroUploaded ? '✓ Bill Uploaded & Verified by Groq AI!' : 'Click to Simulate Client Uploading Bills'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {heroUploaded ? 'Status updated to Complete • Reminders stopped' : 'Try clicking here to test the live workflow'}
                      </span>
                    </button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Client receives zero spam</span>
                    <button onClick={onLaunchPortal} className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                      <span>Open Full Portal</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= MARKET POSITIONING (From Blueprint & Image) ================= */}
      <section className="py-14 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              The ClarioLoop Solution
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              How Modern CA Firms Manage Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              ClarioLoop integrates cleanly with your existing accounting and compliance software stack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Accounting Records</span>
              <h4 className="text-base font-extrabold text-slate-900 mt-1">TallyPrime / Zoho Books</h4>
              <p className="text-xs text-slate-500 mt-1">Maintains ledger entries, vouchers, and financial statements.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tax & GST Filings</span>
              <h4 className="text-base font-extrabold text-slate-900 mt-1">ClearTax / Winman</h4>
              <p className="text-xs text-slate-500 mt-1">Handles computation, GSTR returns, and tax preparation.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Office Workflows</span>
              <h4 className="text-base font-extrabold text-slate-900 mt-1">Jamku / Zoho Practice</h4>
              <p className="text-xs text-slate-500 mt-1">Manages tasks, deadlines, and staff assignment.</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-5 rounded-2xl shadow-md border border-indigo-500">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Client Document Collection</span>
              <h4 className="text-base font-extrabold text-white mt-1">ClarioLoop AI</h4>
              <p className="text-xs text-indigo-100 mt-1">
                <strong>Replaces WhatsApp/Email chasing</strong> with automated collection, instant AI extraction & auto-stop reminders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3-STEP WORKFLOW ================= */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              How ClarioLoop Simplifies Your Practice in 3 Steps
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Designed from the ground up for Chartered Accountants, Tax Consultants & Bookkeepers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">Create or Reuse Checklists</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Choose from pre-built Indian CA templates (Monthly Bookkeeping, GSTR-3B, Advance Tax, ITR Season). Set due dates and recurring rules.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">Client Snaps & Uploads</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Clients open their personalized link on their smartphone. Zero passwords or app download required. They can snap bill photos directly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Verifies & Reminders Halt</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Groq AI classifies documents, extracts Invoice # and GSTIN, updates your missing item status, and shuts off follow-ups automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRICING SECTION ================= */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Straightforward Indian Pricing
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Plans Built for Solo CAs & Growing Firms
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              All plans include a 14-day free trial. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {subscriptionTiers.map(tier => {
              const isRec = tier.recommended;

              return (
                <div
                  key={tier.id}
                  className={`bg-white rounded-2xl p-5 border flex flex-col justify-between transition-all relative ${
                    isRec 
                      ? 'border-indigo-600 ring-2 ring-indigo-600/30 shadow-xl' 
                      : 'border-slate-200 shadow-xs hover:border-slate-300'
                  }`}
                >
                  {isRec && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      Recommended
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-slate-900 text-base">{tier.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                        {tier.clientCapacity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 min-h-[30px]">{tier.idealFor}</p>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">{tier.priceINR}</span>
                      <span className="text-xs text-slate-500 font-medium">/{tier.period.replace('per ', '')}</span>
                    </div>

                    <ul className="mt-5 space-y-2.5 text-xs text-slate-600">
                      {tier.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setCheckoutTier(tier)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                        isRec 
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/20' 
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Subscribe via Razorpay</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="small" showTagline={true} />
          
          <div className="text-xs text-slate-500 text-center sm:text-right">
            <p>© 2026 ClarioLoop Technologies. Designed for Chartered Accountants & Bookkeepers.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Secure MongoDB Atlas Cluster0 • Groq AI Document Copilot • Capacitor Android Ready
            </p>
          </div>
        </div>
      </footer>

      {/* Razorpay Subscription Modal on Home Page */}
      <RazorpayModal
        isOpen={!!checkoutTier}
        onClose={() => setCheckoutTier(null)}
        plan={checkoutTier}
        firm={{ name: 'Apex Chartered Accountants', partnerName: 'CA Rajesh Sharma', email: 'rajesh@apexca.in', phone: '+91 98200 45890' }}
        onPaymentSuccess={(tier, receipt) => {
          setTimeout(() => {
            setCheckoutTier(null);
            onLaunchApp();
          }, 2000);
        }}
      />

    </div>
  );
}
