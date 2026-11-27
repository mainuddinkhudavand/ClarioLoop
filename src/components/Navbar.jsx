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
  Plus,
  Menu,
  ShieldCheck,
  UserCheck,
  Landmark,
  GraduationCap,
  Umbrella,
  CreditCard,
  X,
  LogOut
} from 'lucide-react';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  onOpenAI, 
  activeFirm, 
  onOpenFirmSwitcher,
  onOpenMobileMenu,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onEnterVertical,
  onLogout
}) {
  const isHome = currentView === 'home';
  const showIndustryNav = currentView === 'home' || currentView === 'subscriptions';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Vertical Portals */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Mobile Menu Hamburger (Shown on Home, Subscriptions, and CA Portal; Co-op/Edu/Ins use their own PortalSidebar drawer) */}
          {onOpenMobileMenu && !['coop', 'edu', 'insurance'].includes(currentView) && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
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

          {/* 4 Industry Suites Navigation (Desktop — hidden when inside a specific portal) */}
          {showIndustryNav && (
            <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80">
            {/* CA Portal */}
            <button 
              onClick={() => {
                if (onEnterVertical) {
                  onEnterVertical('ca');
                } else {
                  setCurrentView('app');
                }
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                currentView === 'app' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'hover:text-indigo-600 text-slate-700'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>CA Practice</span>
            </button>

            {/* Cooperative Banking */}
            <button 
              onClick={() => {
                if (onEnterVertical) {
                  onEnterVertical('cooperative');
                } else {
                  setCurrentView('coop');
                }
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                currentView === 'coop' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'hover:text-emerald-700 text-slate-700'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-emerald-500" />
              <span>Co-op Banking</span>
            </button>

            {/* Education */}
            <button 
              onClick={() => {
                if (onEnterVertical) {
                  onEnterVertical('education');
                } else {
                  setCurrentView('edu');
                }
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                currentView === 'edu' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'hover:text-blue-700 text-slate-700'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
              <span>Education</span>
            </button>

            {/* Insurance */}
            <button 
              onClick={() => {
                if (onEnterVertical) {
                  onEnterVertical('insurance');
                } else {
                  setCurrentView('insurance');
                }
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                currentView === 'insurance' 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'hover:text-purple-700 text-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
              <span>Insurance</span>
            </button>

            {/* Subscriptions */}
            <button 
              onClick={() => setCurrentView('subscriptions')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                currentView === 'subscriptions' 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'hover:text-slate-900 text-slate-700'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-500" />
              <span>Subscriptions</span>
            </button>
          </nav>
          )}
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* User Profile / KYC Pill + Logout when signed in */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 p-1 sm:p-1.5 sm:pr-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-left shadow-2xs shrink-0"
                title="Click to View Verified Profile & KYC Details"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-extrabold text-[10px] flex items-center justify-center">
                  {currentUser.avatarInitials || 'RS'}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-[11px] font-bold text-slate-800 block truncate max-w-[100px] leading-tight">
                    {currentUser.name}
                  </span>
                  {currentUser.isKycVerified ? (
                    <span className="text-[9px] font-black text-emerald-600 flex items-center gap-0.5 leading-tight">
                      <ShieldCheck className="w-2.5 h-2.5" /> KYC VERIFIED
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-amber-600 leading-tight">
                      KYC PENDING
                    </span>
                  )}
                </div>
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-rose-600 hover:text-rose-700 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-all whitespace-nowrap shrink-0"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth && onOpenAuth('ca')}
              className="text-[11px] sm:text-xs font-bold text-indigo-600 hover:text-indigo-800 px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/80 transition-all whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
          )}

          {/* Home Button (Shown when inside a portal) */}
          {!isHome && (
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              <Home className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
