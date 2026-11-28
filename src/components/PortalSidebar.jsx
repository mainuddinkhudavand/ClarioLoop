import React, { useState } from 'react';
import { ArrowLeft, Menu, X } from 'lucide-react';

const ACCENT_CLASSES = {
  emerald: {
    badge: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    active: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25',
    mobileBtn: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  blue: {
    badge: 'bg-gradient-to-br from-blue-500 to-sky-600',
    active: 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md shadow-blue-600/25',
    mobileBtn: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  purple: {
    badge: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
    active: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-600/25',
    mobileBtn: 'bg-purple-50 text-purple-800 border-purple-200'
  },
  indigo: {
    badge: 'bg-gradient-to-br from-indigo-600 to-blue-600',
    active: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/25',
    mobileBtn: 'bg-indigo-50 text-indigo-800 border-indigo-200'
  }
};

export default function PortalSidebar({
  title,
  subtitle,
  initials,
  accent = 'indigo',
  items = [],
  activeTab,
  setActiveTab,
  currentUser,
  showUserStrip = false,
  onBack
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = ACCENT_CLASSES[accent] || ACCENT_CLASSES.indigo;
  const activeItem = items.find((i) => i.id === activeTab) || items[0];

  const renderSidebarBody = (isMobile = false) => (
    <>
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
        <div className="w-full flex items-center gap-2.5 p-2.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white text-left min-w-0 shadow-sm">
          <div className={`w-9 h-9 rounded-xl ${theme.badge} text-white font-black flex items-center justify-center text-xs shrink-0 shadow-sm`}>
            {initials}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-extrabold text-white truncate leading-tight">
              {title}
            </h4>
            <span className="text-[10px] text-slate-300 font-semibold block truncate leading-tight mt-0.5">
              {subtitle}
            </span>
          </div>
        </div>
        {isMobile && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 shrink-0"
            title="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all text-left ${
                isActive
                  ? theme.active
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {(showUserStrip && currentUser) || onBack ? (
      <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/50">
        {showUserStrip && currentUser && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className={`w-7 h-7 rounded-lg ${theme.badge} text-white font-extrabold text-[10px] flex items-center justify-center shrink-0`}>
              {currentUser.avatarInitials || initials}
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
        )}

        {onBack && (
          <button
            type="button"
            onClick={() => {
              if (isMobile) setMobileOpen(false);
              onBack();
            }}
            className="w-full flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 py-2 rounded-xl text-xs font-bold transition-colors border border-slate-200 bg-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        )}
      </div>
      ) : null}
    </>
  );

  return (
    <>
      {/* Mobile Sidebar Trigger Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-3 py-2.5 flex items-center justify-between gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-extrabold ${theme.mobileBtn}`}
        >
          <Menu className="w-4 h-4" />
          <span>{title} Menu</span>
        </button>
        {activeItem && (
          <span className="text-xs font-bold text-slate-600 truncate">
            {activeItem.label}
          </span>
        )}
      </div>

      {/* Mobile Slide-Out Left Sidebar Drawer (Shows ONLY this portal's menu) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs animate-fadeIn"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[82vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-slideRight overflow-hidden">
            {renderSidebarBody(true)}
          </aside>
        </div>
      )}

      {/* Desktop Left Sidebar (Matches CA Portal Sidebar) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/80 flex-col shrink-0 min-h-[calc(100vh-120px)]">
        {renderSidebarBody(false)}
      </aside>

      {/* Instagram-Style Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_20px_rgba(15,23,42,0.06)]">
        {(items.length > 4
          ? [...items.filter((i) => i.id !== 'profile').slice(0, 3), ...items.filter((i) => i.id === 'profile')]
          : items
        ).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isProfile = item.id === 'profile';

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-all min-w-[64px] ${
                isActive ? 'text-slate-950 font-black' : 'text-slate-500 font-semibold'
              }`}
            >
              {isProfile ? (
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                    isActive
                      ? `${theme.badge} text-white ring-2 ring-slate-900 ring-offset-1`
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {initials}
                </div>
              ) : (
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 stroke-[2.4]' : 'text-slate-500'}`} />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
              <span className="text-[10px] leading-tight truncate max-w-[72px]">
                {item.mobileLabel || item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
