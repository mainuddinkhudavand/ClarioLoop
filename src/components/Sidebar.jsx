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
  UserPlus,
  User
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
  const liveDocCount = (activeFirm?.requests || []).reduce(
    (acc, r) => acc + (r.items || []).length,
    0
  );

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'requests', label: 'Requests', icon: FileCheck2, count: activeFirm?.requests?.length || 0 },
    { id: 'documents', label: 'Documents', icon: FileText, count: liveDocCount },
    { id: 'clients', label: 'Clients', icon: Users, count: activeFirm?.clients?.length || 0 },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'reminders', label: 'Smart Reminders', icon: BellRing },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/80 flex-col shrink-0 min-h-[calc(100vh-65px)]">
      {/* Top Active Firm Card */}
      <div className="p-4 border-b border-slate-100">
        <div className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white text-left shadow-sm">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div 
              className="w-9 h-9 rounded-xl text-white font-black flex items-center justify-center text-xs shrink-0 shadow-sm"
              style={{ backgroundColor: activeFirm?.brandingColor || '#4f46e5' }}
            >
              {activeFirm?.logoInitials || 'CA'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-extrabold text-white truncate leading-tight">
                {activeFirm?.name || 'Chartered Accountants'}
              </h4>
              <span className="text-[10px] text-indigo-200 font-semibold block leading-tight mt-0.5">
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
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/25' 
                  : item.highlight
                    ? 'text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/70'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {typeof item.count === 'number' && (
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {onBackHome && (
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onBackHome}
            className="w-full flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 py-2 rounded-xl text-xs font-bold transition-colors border border-slate-200 bg-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>
      )}
    </aside>
  );
}
