import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileCheck2, 
  Smartphone, 
  Sparkles, 
  BellRing, 
  BarChart3, 
  CreditCard,
  ArrowLeft,
  Building2,
  ChevronDown,
  GitBranch,
  FileText,
  UserPlus
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onBackHome, 
  activeFirm, 
  onOpenFirmSwitcher,
  currentUser,
  onLogout,
  onOpenClientPortal
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'requests', label: 'Requests', icon: FileCheck2, count: activeFirm?.requests?.length || 0 },
    { id: 'documents', label: 'Documents', icon: FileText, count: 10 },
    { id: 'clients', label: 'Clients', icon: Users, count: activeFirm?.clients?.length || 0 },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'reminders', label: 'Smart Reminders', icon: BellRing },
    { id: 'ai-analyzer', label: 'AI Copilot Reader', icon: Sparkles },
    { id: 'subscriptions', label: 'Subscription Plans', icon: CreditCard },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/80 flex-col shrink-0 min-h-[calc(100vh-65px)]">
      {/* Top Active Firm Card */}
      <div className="p-4 border-b border-slate-100">
        <div className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-left">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div 
              className="w-8 h-8 rounded-lg text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs"
              style={{ backgroundColor: activeFirm?.brandingColor || '#4f46e5' }}
            >
              {activeFirm?.logoInitials || 'CA'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-extrabold text-slate-900 truncate leading-tight">
                {activeFirm?.name || 'Chartered Accountants'}
              </h4>
              <span className="text-[10px] text-slate-500 font-bold block leading-tight mt-0.5">
                {activeFirm?.city || 'India'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20' 
                  : item.highlight
                    ? 'text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/70'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom User & Home strip */}
      <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/50">
        {currentUser && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0">
                {currentUser.avatarInitials || 'CA'}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-900 block truncate leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-black text-emerald-600 block leading-tight">
                  ✓ KYC VERIFIED
                </span>
              </div>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-[10px] font-bold text-rose-600 hover:text-rose-800 px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors"
                title="Log out of CA practice"
              >
                Exit
              </button>
            )}
          </div>
        )}

        <button
          onClick={onBackHome}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </button>
      </div>
    </aside>
  );
}
