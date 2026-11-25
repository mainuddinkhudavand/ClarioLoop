import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import RequestBuilder from './components/RequestBuilder';
import ClientUploadPortal from './components/ClientUploadPortal';
import ReminderSettings from './components/ReminderSettings';
import SubscriptionPlans from './components/SubscriptionPlans';
import ReportsView from './components/ReportsView';
import WorkflowsView from './components/WorkflowsView';
import DocumentsView from './components/DocumentsView';
import ClientCRMView from './components/ClientCRMView';
import AIAssistantModal from './components/AIAssistantModal';
import FirmSwitcherModal from './components/FirmSwitcherModal';
import MobileBottomNav from './components/MobileBottomNav';
import MobileSidebarDrawer from './components/MobileSidebarDrawer';
import AdminPortal from './components/AdminPortal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import PortalAuthGateway from './components/PortalAuthGateway';
import { mockFirms } from './data/mockData';

export default function App() {
  // Main view state: 'home' | 'app' | 'portal' | 'admin' | 'auth_admin' | 'auth_ca' | 'auth_client'
  const [currentView, setCurrentView] = useState('home');

  // Multi-Tenant CA Practices State
  const [firms, setFirms] = useState(mockFirms);
  const [activeFirmId, setActiveFirmId] = useState('firm-1');
  const [isFirmSwitcherOpen, setIsFirmSwitcherOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // User Profile & Authentication State (Strict Privacy: Default null = Not Logged In)
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState('ca');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // App workspace inner tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activePortalToken, setActivePortalToken] = useState('nexgen-nov2026-demo-token');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Find currently active CA firm
  const activeFirm = firms.find(f => f.id === activeFirmId) || firms[0];

  // Register New CA Practice
  const handleRegisterNewFirm = (newFirm) => {
    setFirms(prev => [newFirm, ...prev]);
    setActiveFirmId(newFirm.id);
  };

  // Add client to a specific CA practice
  const handleAddClientToFirm = (firmId, newClient) => {
    setFirms(prev => prev.map(f => {
      if (f.id === firmId) {
        return {
          ...f,
          clients: [newClient, ...(f.clients || [])]
        };
      }
      return f;
    }));
  };

  // Update firm subscription on Razorpay payment success
  const handleSubscriptionUpdated = (firmId, newSubData) => {
    setFirms(prev => prev.map(f => {
      if (f.id === firmId) {
        return {
          ...f,
          subscription: {
            ...f.subscription,
            ...newSubData
          }
        };
      }
      return f;
    }));
  };

  // ⚡ 1-Click Fast Persona Switcher (Ultra User-Friendly for Developers, Clients, and Evaluators)
  const handleQuickSwitch = (target) => {
    if (target === 'app' || target === 'ca') {
      setCurrentUser({
        id: 'ca-rajesh-sharma',
        role: 'ca',
        name: 'CA Rajesh Sharma (FCA, DISA)',
        email: 'rajesh@apexcafirm.in',
        phone: '+91 98765 43210',
        firmName: 'Apex & Partners Chartered Accountants',
        icaiNumber: 'FRN 102938W',
        isKycVerified: true,
        kycDate: 'Nov 2026',
        kycDocType: 'ICAI Certificate of Practice',
        avatarInitials: 'RS',
        designation: 'Senior Managing Partner (FCA)',
        city: 'Mumbai, Maharashtra',
        location: 'Mumbai, Maharashtra',
        bio: 'Senior Partner specializing in Corporate Statutory Audits, Transfer Pricing, and Section 44AB Tax Filings.'
      });
      setActiveFirmId('firm-1');
      setCurrentView('app');
    } else if (target === 'portal' || target === 'client') {
      setCurrentUser({
        id: 'client-nexgen',
        role: 'client',
        name: 'Vikram Mehta (Director)',
        email: 'accounts@nexgendigital.io',
        phone: '+91 98111 22233',
        companyName: 'NexGen Digital Solutions Pvt Ltd',
        pan: 'AABCN1234F',
        gstin: '27AABCN1234F1Z5',
        isKycVerified: true,
        kycDate: 'Nov 2026',
        kycDocType: 'Company PAN & Certificate of Incorporation',
        avatarInitials: 'VM',
        designation: 'Director of Finance',
        city: 'Pune, Maharashtra',
        location: 'Pune, Maharashtra',
        bio: 'High-growth technology company focused on cross-border SaaS workflows and digital compliance.'
      });
      setActivePortalToken('nexgen-nov2026-demo-token');
      setCurrentView('portal');
    } else if (target === 'admin') {
      setCurrentUser({
        id: 'admin-root',
        role: 'admin',
        name: 'Root Platform Admin',
        email: 'admin@clarioloop.com',
        phone: '+91 98000 11111',
        isKycVerified: true,
        kycDate: 'Nov 2026',
        kycDocType: 'Master Root Security Clearance',
        avatarInitials: 'AD',
        designation: 'Principal Operations & Security Architect',
        location: 'Bengaluru, Karnataka',
        bio: 'Principal System Operations & Security Architect at ClarioLoop.'
      });
      setCurrentView('admin');
    } else if (target === 'home') {
      setCurrentView('home');
    }
  };

  const isGatewayView = currentView.startsWith('auth_');

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Sticky Navbar (Hidden in client upload portal, admin portal, and dedicated gateway views) */}
      {currentView !== 'portal' && currentView !== 'admin' && !isGatewayView && (
        <Navbar 
          currentView={currentView}
          setCurrentView={setCurrentView}
          onOpenAI={() => setIsAIModalOpen(true)}
          activeFirm={activeFirm}
          onOpenFirmSwitcher={() => setIsFirmSwitcherOpen(true)}
          onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
          currentUser={currentUser}
          onQuickSwitch={handleQuickSwitch}
          onOpenAuth={(targetRole) => {
            setAuthDefaultRole(targetRole || 'ca');
            setIsAuthModalOpen(true);
          }}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />
      )}

      {/* VIEW 1: HOME PAGE (DEFAULT) */}
      {currentView === 'home' && (
        <HomePage 
          onLaunchApp={() => setCurrentView('auth_ca')}
          onLaunchPortal={() => setCurrentView('auth_client')}
          onLaunchAdmin={() => setCurrentView('auth_admin')}
          onLaunchAI={() => setIsAIModalOpen(true)}
          onQuickSwitch={handleQuickSwitch}
        />
      )}

      {/* DEDICATED PORTAL AUTH GATEWAYS (LOGIN + REGISTER WITH MANDATORY KYC) */}
      {currentView === 'auth_admin' && (
        <PortalAuthGateway
          portalType="admin"
          onSuccessLogin={(profile) => {
            setCurrentUser(profile);
            setCurrentView('admin');
          }}
          onBackToHome={() => setCurrentView('home')}
        />
      )}

      {currentView === 'auth_ca' && (
        <PortalAuthGateway
          portalType="ca"
          onSuccessLogin={(profile) => {
            setCurrentUser(profile);
            setCurrentView('app');
          }}
          onBackToHome={() => setCurrentView('home')}
        />
      )}

      {currentView === 'auth_client' && (
        <PortalAuthGateway
          portalType="client"
          onSuccessLogin={(profile) => {
            setCurrentUser(profile);
            setCurrentView('portal');
          }}
          onBackToHome={() => setCurrentView('home')}
        />
      )}

      {/* VIEW 2: FULLSCREEN CLIENT MOBILE UPLOAD PORTAL (Strict Privacy: Requires Client Login & KYC) */}
      {currentView === 'portal' && (
        currentUser && currentUser.role === 'client' ? (
          <ClientUploadPortal 
            token={activePortalToken} 
            onBackToFirm={() => setCurrentView('home')} 
            activeFirm={activeFirm}
            currentUser={currentUser}
            onQuickSwitch={handleQuickSwitch}
            onLogout={() => {
              setCurrentUser(null);
              setCurrentView('home');
            }}
          />
        ) : (
          <PortalAuthGateway
            portalType="client"
            onSuccessLogin={(profile) => {
              setCurrentUser(profile);
              setCurrentView('portal');
            }}
            onBackToHome={() => setCurrentView('home')}
          />
        )
      )}

      {/* VIEW 3: DEDICATED SUPERADMIN PORTAL (Strict Privacy: Requires SuperAdmin Login & KYC) */}
      {currentView === 'admin' && (
        currentUser && currentUser.role === 'admin' ? (
          <AdminPortal
            firms={firms}
            currentUser={currentUser}
            onQuickSwitch={handleQuickSwitch}
            onUpdateFirm={(updatedFirm) => {
              setFirms(prev => prev.map(f => f.id === updatedFirm.id ? updatedFirm : f));
            }}
            onDeleteFirm={(firmId) => {
              setFirms(prev => prev.filter(f => f.id !== firmId));
              if (activeFirmId === firmId) {
                const remaining = firms.filter(f => f.id !== firmId);
                if (remaining.length > 0) setActiveFirmId(remaining[0].id);
              }
            }}
            onSwitchToFirm={(firmId) => {
              setActiveFirmId(firmId);
              setCurrentView('app');
            }}
            onRegisterNewFirm={() => setIsFirmSwitcherOpen(true)}
            onBackToHome={() => setCurrentView('home')}
            onLogout={() => {
              setCurrentUser(null);
              setCurrentView('home');
            }}
          />
        ) : (
          <PortalAuthGateway
            portalType="admin"
            onSuccessLogin={(profile) => {
              setCurrentUser(profile);
              setCurrentView('admin');
            }}
            onBackToHome={() => setCurrentView('home')}
          />
        )
      )}

      {/* VIEW 4: SIMPLIFIED CA APP WORKSPACE (Strict Privacy: Requires CA Login & KYC) */}
      {currentView === 'app' && (
        currentUser && currentUser.role === 'ca' ? (
          <div className="flex-1 flex overflow-hidden bg-slate-50">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              onBackHome={() => setCurrentView('home')}
              activeFirm={activeFirm}
              onOpenFirmSwitcher={() => setIsFirmSwitcherOpen(true)}
              currentUser={currentUser}
              onQuickSwitch={handleQuickSwitch}
              onLogout={() => {
                setCurrentUser(null);
                setCurrentView('home');
              }}
            />

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
              {activeTab === 'dashboard' && (
                <Dashboard 
                  activeFirm={activeFirm}
                  onNewRequest={() => setActiveTab('requests')}
                  onOpenPortal={(token) => {
                    setActivePortalToken(token || 'nexgen-nov2026-demo-token');
                    setCurrentView('portal');
                  }}
                  onOpenReminders={() => setActiveTab('reminders')}
                  onOpenFirmSwitcher={() => setIsFirmSwitcherOpen(true)}
                />
              )}

              {activeTab === 'clients' && (
                <ClientList 
                  activeFirm={activeFirm}
                  onAddClientToFirm={handleAddClientToFirm}
                  onBack={() => setActiveTab('dashboard')}
                />
              )}

            {activeTab === 'requests' && (
              <RequestBuilder 
                activeFirm={activeFirm}
                onCreated={() => setActiveTab('dashboard')}
                onBack={() => setActiveTab('dashboard')} 
              />
            )}

            {activeTab === 'documents' && (
              <DocumentsView 
                activeFirm={activeFirm}
                onOpenAI={() => setIsAIModalOpen(true)}
                onBack={() => setActiveTab('dashboard')}
              />
            )}

            {activeTab === 'portal' && (
              <ClientUploadPortal 
                token={activePortalToken} 
                onBackToFirm={() => setActiveTab('dashboard')} 
                activeFirm={activeFirm}
              />
            )}

            {activeTab === 'ai-analyzer' && (
              <div className="space-y-6">
                <div className="text-center py-6">
                  <button
                    onClick={() => setIsAIModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-indigo-600/20 text-sm transition-all"
                  >
                    ✨ Launch Fullscreen Groq AI Document Copilot
                  </button>
                </div>
                <AIAssistantModal isOpen={true} onClose={() => setActiveTab('dashboard')} />
              </div>
            )}

            {activeTab === 'reminders' && (
              <ReminderSettings 
                activeFirm={activeFirm} 
                onBack={() => setActiveTab('dashboard')}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsView 
                activeFirm={activeFirm} 
                onBack={() => setActiveTab('dashboard')}
              />
            )}

            {activeTab === 'subscriptions' && (
              <SubscriptionPlans 
                activeFirm={activeFirm} 
                onSubscriptionUpdated={handleSubscriptionUpdated}
                onBack={() => setActiveTab('dashboard')}
              />
            )}
          </main>
        </div>
      ) : (
        <PortalAuthGateway
          portalType="ca"
          onSuccessLogin={(profile) => {
            setCurrentUser(profile);
            if (profile.firmName) {
              const existingFirm = firms.find(f => f.name.toLowerCase() === profile.firmName.toLowerCase());
              if (existingFirm) {
                setActiveFirmId(existingFirm.id);
              } else {
                const newFirm = {
                  id: 'firm-' + Date.now(),
                  name: profile.firmName,
                  partnerName: profile.name,
                  city: profile.city || 'India',
                  icaiNumber: profile.icaiNumber || 'FRN Pending',
                  clients: [],
                  requests: [],
                  logoInitials: profile.avatarInitials || 'CA',
                  brandingColor: '#4f46e5',
                  subscription: { plan: 'STARTER', status: 'ACTIVE' }
                };
                setFirms(prev => [newFirm, ...prev]);
                setActiveFirmId(newFirm.id);
              }
            }
            setCurrentView('app');
          }}
          onBackToHome={() => setCurrentView('home')}
        />
      ))}

      {/* Global AI Copilot Modal */}
      <AIAssistantModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
      />

      {/* Mobile Sidebar Navigation Drawer */}
      <MobileSidebarDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeFirm={activeFirm}
        onOpenFirmSwitcher={() => setIsFirmSwitcherOpen(true)}
        onBackHome={() => setCurrentView('home')}
        onOpenAdmin={() => setCurrentView('admin')}
        onOpenClientPortal={() => setCurrentView('portal')}
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAuth={(role) => {
          setAuthDefaultRole(role || 'ca');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Role-Based Authentication Modal (Login & Register with KYC) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultRole={authDefaultRole}
        onAuthSuccess={(profile) => {
          setCurrentUser(profile);
          if (profile.role === 'admin') setCurrentView('admin');
          else if (profile.role === 'client') setCurrentView('portal');
          else setCurrentView('app');
        }}
      />

      {/* User Profile & KYC Verification Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={currentUser}
        onUpdateProfile={(updatedProfile) => {
          setCurrentUser(updatedProfile);
        }}
        onLogout={() => {
          setCurrentUser(null);
          setCurrentView('home');
        }}
      />

      {/* Native-Style Mobile Bottom Navigation Bar (Hidden in client portal and admin views) */}
      {currentView !== 'portal' && currentView !== 'admin' && (
        <MobileBottomNav 
          currentView={currentView}
          setCurrentView={setCurrentView}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAI={() => setIsAIModalOpen(true)}
        />
      )}

      {/* Universal Floating Quick Role Switcher (Provides instant 1-click developer, client & CA navigation) */}
      <aside aria-label="Portal Switcher" className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl shadow-2xl border border-slate-700/90 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold max-w-[95vw] overflow-x-auto">
        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1 shrink-0">
          <span>⚡ Fast Switch:</span>
        </span>
        <button
          onClick={() => handleQuickSwitch('home')}
          className={`px-2.5 py-1 rounded-xl transition-all shrink-0 ${currentView === 'home' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
        >
          Home
        </button>
        <button
          onClick={() => handleQuickSwitch('app')}
          className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 shrink-0 ${currentView === 'app' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
        >
          <span>💼 CA Practice</span>
        </button>
        <button
          onClick={() => handleQuickSwitch('portal')}
          className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 shrink-0 ${currentView === 'portal' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
        >
          <span>📱 Client Mobile</span>
        </button>
        <button
          onClick={() => handleQuickSwitch('admin')}
          className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 shrink-0 ${currentView === 'admin' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
        >
          <span>🛡️ SuperAdmin</span>
        </button>
      </aside>
    </div>
  );
}
