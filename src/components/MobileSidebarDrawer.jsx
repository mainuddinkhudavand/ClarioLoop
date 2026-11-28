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
  FileText,
  X,
  Home,
  ShieldCheck,
  Landmark,
  GraduationCap,
  ChevronRight,
  User
} from 'lucide-react';

export default function MobileSidebarDrawer({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  activeFirm,
  onOpenFirmSwitcher,
  onBackHome,
  onOpenClientPortal,
  currentUser,
  onOpenProfile,
  onOpenAuth,
  onEnterVertical,
  onOpenSubscriptions,
  currentView = 'home',
  selectedVertical = 'ca',
  onChangeVertical
}) {
  if (!isOpen) return null;
  const isInsideCAPortal = currentView === 'app';
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
        
        {/* Drawer Header with User / Sign-In Status */}
        <div className="p-4 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
              ClarioLoop Navigation
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
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenProfile) onOpenProfile();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-left transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div 
                  className="w-9 h-9 rounded-xl text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs"
                  style={{ backgroundColor: activeFirm?.brandingColor || '#4f46e5' }}
                >
                  {currentUser.avatarInitials || 'CA'}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-white truncate leading-tight">
                    {currentUser.name || currentUser.firmName || 'Verified User'}
                  </h4>
                  <span className="text-[11px] text-emerald-400 font-bold leading-tight mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{currentUser.kycBadge || 'KYC VERIFIED'}</span>
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </button>
          ) : (
            <div className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-left space-y-2">
              <div className="text-[11px] text-slate-300 font-bold">
                Sign in to access your industry desk
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenAuth) onOpenAuth('ca');
                }}
                className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center transition-colors"
              >
                Sign In / Register
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {/* Switch Industry (Only when not inside CA Portal) */}
          {!isInsideCAPortal && onChangeVertical && (
            <div className="p-3 space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onChangeVertical();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 border border-slate-200"
              >
                <span>Switch Industry</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>
            </div>
          )}

          {/* CA Workspace Modules (Shown when inside CA Portal) */}
          {isInsideCAPortal && currentUser && currentUser.role === 'ca' && (
            <nav className="p-3 space-y-1 text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-2 mb-1">
                CA Practice Menu
              </span>
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20' 
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span className="text-xs">{item.label}</span>
                    </div>
                    {typeof item.count === 'number' && (
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
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
          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 shrink-0">
          <button
            type="button"
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
