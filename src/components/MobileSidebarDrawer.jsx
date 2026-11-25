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
  Building2,
  ChevronDown,
  GitBranch,
  FileText,
  UserPlus,
  X,
  Home,
  ShieldCheck
} from 'lucide-react';

export default function MobileSidebarDrawer({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  activeFirm,
  onOpenFirmSwitcher,
  onBackHome,
  onOpenAdmin,
  onOpenClientPortal
}) {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'requests', label: 'Requests', icon: FileCheck2, count: activeFirm?.requests?.length || 2 },
    { id: 'documents', label: 'Documents', icon: FileText, count: 10 },
    { id: 'clients', label: 'Clients', icon: Users, count: activeFirm?.clients?.length || 3 },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'reminders', label: 'Smart Reminders', icon: BellRing },
    { id: 'ai-analyzer', label: 'AI Copilot Reader', icon: Sparkles },
    { id: 'subscriptions', label: 'Subscription Plans', icon: CreditCard },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-slideRight overflow-hidden">
        
        {/* Drawer Header with Firm Switcher */}
        <div className="p-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
              CA Workspace Menu
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              title="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {currentUser ? (
            <div className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-left">
              <div className="flex items-center gap-2.5 min-w-0">
                <div 
                  className="w-9 h-9 rounded-xl text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs"
                  style={{ backgroundColor: activeFirm?.brandingColor || '#4f46e5' }}
                >
                  {currentUser.avatarInitials || 'CA'}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-white truncate leading-tight">
                    {currentUser.firmName || activeFirm?.name || 'Chartered Accountants'}
                  </h4>
                  <span className="text-[11px] text-emerald-400 font-bold block leading-tight mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>KYC VERIFIED</span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-left space-y-2">
              <div className="text-[11px] text-slate-300 font-bold">
                Guest Visitor (Private Workspace Locked)
              </div>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenAuth) onOpenAuth('ca');
                }}
                className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center"
              >
                Sign In / KYC Register
              </button>
            </div>
          )}
        </div>

        {/* 3 Explicit Portals Switcher Strip */}
        <div className="p-2.5 bg-slate-100 border-b border-slate-200">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-1 mb-1.5">
            Switch Portal:
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
            <button
              onClick={() => {
                onClose();
                if (onOpenAdmin) onOpenAdmin();
              }}
              className="p-2 rounded-xl bg-slate-900 text-white flex items-center justify-center gap-1.5 shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={() => {
                onClose();
                if (onOpenClientPortal) onOpenClientPortal();
              }}
              className="p-2 rounded-xl bg-emerald-600 text-white flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-white" />
              <span>Client Portal</span>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto text-xs">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="text-xs">{item.label}</span>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50">
          <button
            onClick={() => {
              onClose();
              onBackHome();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors shadow-2xs"
          >
            <Home className="w-3.5 h-3.5 text-indigo-600" />
            <span>Back to Home</span>
          </button>
        </div>

      </div>
    </div>
  );
}
