import React from 'react';
import Logo from './Logo';
import {
  Building2,
  ShieldCheck,
  GraduationCap,
  Landmark,
  ArrowRight,
  Lock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const INDUSTRIES = [
  {
    id: 'ca',
    isLive: true,
    title: 'CA & Tax Audit',
    subtitle: 'Chartered Accountants, Tax Consultants & Corporate Clients',
    role1: 'CA Practice Desk',
    role2: 'Client / Taxpayer Portal',
    icon: Building2,
    topBar: 'from-indigo-600 via-blue-600 to-cyan-500',
    badgeBg: 'bg-gradient-to-br from-indigo-600 to-blue-600',
    pill: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    rolePill: 'bg-indigo-50/70 text-indigo-700 border-indigo-200/70',
    border: 'hover:border-indigo-400',
    btn: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white'
  },
  {
    id: 'cooperative',
    isLive: true,
    title: 'Co-operative Banking',
    subtitle: 'Credit Societies, PACS, Urban Co-op Banks & Members',
    role1: 'Society & Field Agent Desk',
    role2: 'Member / Account Holder',
    icon: Landmark,
    topBar: 'from-emerald-600 via-teal-500 to-cyan-500',
    badgeBg: 'bg-gradient-to-br from-emerald-600 to-teal-500',
    pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rolePill: 'bg-emerald-50/70 text-emerald-700 border-emerald-200/70',
    border: 'hover:border-emerald-400',
    btn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
  },
  {
    id: 'insurance',
    isLive: false,
    title: 'Insurance & Claims',
    subtitle: 'Insurance Agencies, Brokerages, Claims Desk & Policyholders',
    role1: 'Agency & Broker Claims Desk',
    role2: 'Policyholder / Claimant',
    icon: ShieldCheck,
    topBar: 'from-purple-600 via-fuchsia-600 to-pink-500',
    badgeBg: 'bg-gradient-to-br from-purple-600 to-fuchsia-600',
    pill: 'bg-slate-100 text-slate-500 border-slate-200',
    rolePill: 'bg-slate-50 text-slate-500 border-slate-200',
    border: 'opacity-75',
    btn: 'bg-slate-200 text-slate-600 cursor-not-allowed'
  },
  {
    id: 'education',
    isLive: false,
    title: 'Education & Admissions',
    subtitle: 'Schools, Colleges, Autonomous Campuses & Students',
    role1: 'Admissions & Staff Desk',
    role2: 'Student / Parent Portal',
    icon: GraduationCap,
    topBar: 'from-blue-600 via-sky-500 to-cyan-500',
    badgeBg: 'bg-gradient-to-br from-blue-600 to-sky-500',
    pill: 'bg-slate-100 text-slate-500 border-slate-200',
    rolePill: 'bg-slate-50 text-slate-500 border-slate-200',
    border: 'opacity-75',
    btn: 'bg-slate-200 text-slate-600 cursor-not-allowed'
  }
];

export default function IndustrySelector({ onSelectIndustry }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Executive Dark Top Banner */}
      <div className="relative overflow-hidden bg-slate-950 text-white pt-10 pb-24 sm:pt-14 sm:pb-28 px-4 sm:px-8 border-b border-slate-800">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[680px] h-[300px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto relative text-center space-y-4">
          <div className="flex justify-center">
            <Logo size="large" inverted={true} showTagline={false} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-indigo-200 text-[11px] font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Isolated Sector Workspaces</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            Select Your Industry Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Choose your sector to enter its dedicated workspace, role-based login, and compliance checklists.
          </p>
        </div>
      </div>

      {/* Floating 4 Industry Cards */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 -mt-14 pb-12 relative z-10 flex-1 flex flex-col justify-between space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {INDUSTRIES.map((ind) => {
            const Icon = ind.icon;
            return (
              <button
                key={ind.id}
                type="button"
                disabled={!ind.isLive}
                onClick={() => ind.isLive && onSelectIndustry(ind.id)}
                className={`bg-white rounded-3xl border border-slate-200/90 overflow-hidden text-left flex flex-col justify-between transition-all group ${ind.border}`}
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${ind.topBar}`} />
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5 w-full">
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className={`w-12 h-12 rounded-2xl ${ind.badgeBg} text-white flex items-center justify-center shadow-md ${ind.isLive ? 'group-hover:scale-105' : 'grayscale'} transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${ind.pill}`}>
                        {ind.isLive ? 'Live Portal' : 'Phase 2 • Coming Soon'}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                        {ind.title}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {ind.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${ind.rolePill}`}>
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        {ind.role1}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${ind.rolePill}`}>
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        {ind.role2}
                      </span>
                    </div>
                  </div>

                  <div className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${ind.btn}`}>
                    <span>{ind.isLive ? `Enter ${ind.title}` : 'Coming in Phase 2'}</span>
                    {ind.isLive && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-semibold">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>256-Bit Encrypted • Completely Isolated Industry Workspaces</span>
        </div>
      </div>
    </div>
  );
}
