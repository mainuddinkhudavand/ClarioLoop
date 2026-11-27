import React, { useState } from 'react';
import { ArrowLeft, Menu, X } from 'lucide-react';

const ACCENT_CLASSES = {
  emerald: {
    badge: 'bg-emerald-600',
    active: 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20',
    mobileBtn: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  blue: {
    badge: 'bg-blue-600',
    active: 'bg-blue-600 text-white shadow-sm shadow-blue-600/20',
    mobileBtn: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  purple: {
    badge: 'bg-purple-600',
    active: 'bg-purple-600 text-white shadow-sm shadow-purple-600/20',
    mobileBtn: 'bg-purple-50 text-purple-800 border-purple-200'
  },
  indigo: {
    badge: 'bg-indigo-600',
    active: 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20',
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
  onBack
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = ACCENT_CLASSES[accent] || ACCENT_CLASSES.indigo;
  const activeItem = items.find((i) => i.id === activeTab) || items[0];

  const renderSidebarBody = (isMobile = false) => (
    <>
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
        <div className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-left min-w-0">
          <div className={`w-8 h-8 rounded-lg ${theme.badge} text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs`}>
            {initials}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-extrabold text-slate-900 truncate leading-tight">
              {title}
            </h4>
            <span className="text-[10px] text-slate-500 font-bold block truncate leading-tight mt-0.5">
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

      <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/50">
        {currentUser && (
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
            <span>Back to Landing Page</span>
          </button>
        )}
      </div>
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
    </>
  );
}
