import React from 'react';
import Logo from './Logo';
import { 
  Sparkles, 
  Smartphone, 
  LayoutDashboard, 
  ArrowRight,
  ArrowLeft,
  Home,
  Building2,
  ChevronDown,
  Plus,
  Menu,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  onOpenAI, 
  activeFirm, 
  onOpenFirmSwitcher,
  onOpenMobileMenu
}) {
  const isHome = currentView === 'home';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Switcher */}
        <div className="flex items-center gap-2 sm:gap-6 min-w-0">
          {/* Mobile Menu Hamburger (Visible on mobile when in CA Workspace) */}
          {!isHome && onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <button 
            onClick={() => setCurrentView('home')} 
            className="focus:outline-none text-left shrink-0"
          >
            <Logo size="small" showTagline={false} className="sm:hidden" />
            <Logo size="default" showTagline={false} className="hidden sm:flex" />
          </button>

          {/* Active CA Firm Selector Pill (Visible everywhere) */}
          <button
            onClick={onOpenFirmSwitcher}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold text-slate-800 transition-all shadow-xs"
            title="Switch CA Practice Workspace or Register a New One"
          >
            <div 
              className="w-5 h-5 rounded-md text-white font-extrabold text-[10px] flex items-center justify-center shrink-0"
              style={{ backgroundColor: activeFirm?.brandingColor || '#4f46e5' }}
            >
              {activeFirm?.logoInitials || 'CA'}
            </div>
            <span className="truncate max-w-[180px]">{activeFirm?.name || 'Select CA Firm'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* 3 Explicit Portal Links (Visible on desktop) */}
          <nav className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80">
            {/* 1. SuperAdmin Portal */}
            <button 
              onClick={() => setCurrentView('admin')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                currentView === 'admin' 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'hover:text-slate-900 text-slate-600'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
              <span>Admin Portal</span>
            </button>

            {/* 2. CA Workspace Portal */}
            <button 
              onClick={() => setCurrentView('app')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                currentView === 'app' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'hover:text-indigo-600 text-slate-600'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>CA Portal</span>
            </button>

            {/* 3. Client Upload Portal */}
            <button 
              onClick={() => setCurrentView('portal')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                currentView === 'portal' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'hover:text-emerald-700 text-slate-600'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              <span>Client Portal</span>
            </button>
          </nav>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          {/* Practice Switcher Mobile Button */}
          <button
            onClick={onOpenFirmSwitcher}
            className="sm:hidden p-2 rounded-xl bg-slate-100 text-slate-700"
            title="Switch CA Firm"
          >
            <Building2 className="w-4 h-4" />
          </button>

          {/* AI Copilot Quick Trigger */}
          <button
            onClick={onOpenAI}
            className="hidden md:flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl border border-indigo-200/80 transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Copilot</span>
          </button>

          {/* Primary View Switcher Button */}
          {isHome ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentView('app')}
                className="flex items-center gap-1.5 text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 sm:px-4 py-2 rounded-xl shadow-md shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Open CA Portal</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3.5 sm:px-4 py-2 rounded-xl shadow-sm transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
