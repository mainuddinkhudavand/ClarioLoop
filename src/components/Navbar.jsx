import React, { useState } from 'react';
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
  UserCheck,
  Landmark,
  GraduationCap,
  Umbrella,
  CreditCard,
  X
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
  onEnterVertical
}) {
  const isHome = currentView === 'home';
  const [isVerticalDropdownOpen, setIsVerticalDropdownOpen] = useState(false);

  const verticalLinks = [
    { id: 'app', label: 'CA & Tax Audit', icon: Building2, color: 'text-indigo-600', badge: 'Tax & Audit' },
    { id: 'coop', label: 'Cooperative Banking & PACS', icon: Landmark, color: 'text-emerald-600', badge: 'Banking' },
    { id: 'edu', label: 'Education & Admissions', icon: GraduationCap, color: 'text-blue-600', badge: 'Academic' },
    { id: 'insurance', label: 'Insurance & Claims', icon: ShieldCheck, color: 'text-purple-600', badge: 'Claims' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Vertical Portals */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Mobile Menu Hamburger */}
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

          {/* 4 Industry Suites Navigation (Desktop) */}
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

            {/* SuperAdmin */}
            <button 
              onClick={() => {
                if (currentUser && currentUser.role === 'admin') {
                  setCurrentView('admin');
                } else {
                  setCurrentView('auth_admin');
                }
              }}
              className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                currentView === 'admin' 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'hover:text-slate-900 text-slate-600'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Quick Dropdown for Medium screens */}
          <div className="relative lg:hidden">
            <button
              onClick={() => setIsVerticalDropdownOpen(!isVerticalDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200"
            >
              <span>Suites</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isVerticalDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs space-y-1 animate-fadeIn">
                <div className="px-2 py-1 text-[10px] font-black uppercase text-slate-400">
                  Select Industry Portal
                </div>
                {verticalLinks.map(v => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setIsVerticalDropdownOpen(false);
                      if (onEnterVertical) {
                        const targetKey = v.id === 'app' ? 'ca' : v.id === 'coop' ? 'cooperative' : v.id === 'edu' ? 'education' : v.id;
                        onEnterVertical(targetKey);
                      } else {
                        setCurrentView(v.id);
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center justify-between transition-colors ${
                      currentView === v.id ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <v.icon className={`w-3.5 h-3.5 ${v.color}`} />
                      <span>{v.label}</span>
                    </div>
                  </button>
                ))}
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setCurrentView('subscriptions');
                      setIsVerticalDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2 text-slate-700 hover:bg-slate-50"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                    <span>Industry Subscriptions</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          {/* User Profile / KYC Pill */}
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 p-1.5 pr-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-left shadow-2xs"
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
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuth && onOpenAuth('ca')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/80 transition-all"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Primary View Switcher Button */}
          {isHome ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentView('app')}
                className="flex items-center gap-1.5 text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Launch Portal</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 sm:px-4 py-2 rounded-xl shadow-sm transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
