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
  LogOut,
  Bell
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
  onLogout,
  selectedVertical,
  onChangeVertical,
  notifications = [],
  onOpenNotifications
}) {
  const isHome = currentView === 'home';
  const isSubscribed = activeFirm?.subscription?.status === 'ACTIVE';
  const showVerticalControls = (currentView === 'home' || currentView === 'subscriptions') && !isSubscribed;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Vertical Portals */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Mobile Menu Hamburger (Shown on Home, Subscriptions, and CA Portal; Co-op/Edu/Ins use their own PortalSidebar drawer) */}
          {onOpenMobileMenu && !['coop', 'edu', 'insurance'].includes(currentView) && (
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

          {/* Single-Industry Nav Links */}
          {showVerticalControls && (
            <nav className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80">
              <button 
                onClick={() => setCurrentView('subscriptions')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
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
          {/* User Profile / KYC Pill + Notification Bell + Logout when signed in */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => onOpenNotifications && onOpenNotifications()}
                className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                title="Open Notifications Center"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
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
              onClick={() => onOpenAuth && onOpenAuth(selectedVertical || 'ca')}
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
