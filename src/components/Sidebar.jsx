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
  ChevronDown
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onBackHome, 
  activeFirm, 
  onOpenFirmSwitcher 
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Practice Overview', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients Directory', icon: Users, count: activeFirm?.clients?.length || 0 },
    { id: 'requests', label: 'Checklist Requests', icon: FileCheck2, count: activeFirm?.requests?.length || 0 },
    { id: 'portal', label: 'Client Upload Portal', icon: Smartphone, highlight: true },
    { id: 'ai-analyzer', label: 'AI Document Reader', icon: Sparkles },
    { id: 'reminders', label: 'Smart Reminders', icon: BellRing },
    { id: 'reports', label: 'Compliance Reports', icon: BarChart3 },
    { id: 'subscriptions', label: 'Subscription Plans', icon: CreditCard },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/80 flex-col shrink-0 min-h-[calc(100vh-65px)]">
      {/* Top Active Firm Card & Practice Switcher */}
      <div className="p-4 border-b border-slate-100">
        <button
          onClick={onOpenFirmSwitcher}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all text-left"
          title="Click to Switch CA Practice"
        >
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
              <span className="text-[10px] text-indigo-600 font-bold block leading-tight mt-0.5">
                {activeFirm?.city || 'India'} • Switch ▼
              </span>
            </div>
          </div>
        </button>
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

              {item.count !== undefined && item.count > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Switch to Home button */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <button
          onClick={onOpenFirmSwitcher}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>+ Register New CA Firm</span>
        </button>

        <button
          onClick={onBackHome}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Home Page</span>
        </button>
      </div>
    </aside>
  );
}
