import React, { useState, useEffect } from 'react';
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
import CooperativePortal from './components/CooperativePortal';
import EducationPortal from './components/EducationPortal';
import InsurancePortal from './components/InsurancePortal';
import RoleGatewayModal from './components/RoleGatewayModal';
import { mockFirms } from './data/mockData';

export default function App() {
  // Main view state: 'home' | 'app' | 'portal' | 'admin' | 'auth_admin' | 'auth_ca' | 'auth_client'
  const [currentView, setCurrentView] = useState('home');

  // Multi-Tenant CA Practices State
  const [firms, setFirms] = useState(mockFirms);
  const [activeFirmId, setActiveFirmId] = useState('firm-1');
  const [isFirmSwitcherOpen, setIsFirmSwitcherOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [selectedSubscriptionVertical, setSelectedSubscriptionVertical] = useState('ca');

  // Vertical Role Gateway State (2 options: Desk vs Vault for CA, Co-op, Edu, Insurance)
  const [roleGatewayVertical, setRoleGatewayVertical] = useState(null); // 'ca' | 'cooperative' | 'education' | 'insurance' | null
  const [coopRole, setCoopRole] = useState('admin'); // 'admin' | 'member'
  const [eduRole, setEduRole] = useState('admin'); // 'admin' | 'student'
  const [insuranceRole, setInsuranceRole] = useState('admin'); // 'admin' | 'policyholder'

  // User Profile & Authentication State (Strict Privacy: Default null = Not Logged In)
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState('ca');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // App workspace inner tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activePortalToken, setActivePortalToken] = useState('nexgen-nov2026-demo-token');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Private Owner-Only Admin Access (URL: ?owner=admin or #/owner-admin, Shortcut: Ctrl+Shift+A)
  useEffect(() => {
    const openPrivateAdminGateway = () => {
      if (currentUser && currentUser.role === 'admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('auth_admin');
      }
    };

    const params = new URLSearchParams(window.location.search);
    if (params.get('owner') === 'admin' || window.location.hash === '#/owner-admin') {
      openPrivateAdminGateway();
    }

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        openPrivateAdminGateway();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentUser]);

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

  // 2-Option Role Gateway Selector for all 4 Verticals (CA vs Client, Admin vs Member/Student/Policyholder)
  const handleEnterVertical = (verticalKey) => {
    let vert = 'ca';
    if (verticalKey === 'coop' || verticalKey === 'cooperative') vert = 'cooperative';
    else if (verticalKey === 'edu' || verticalKey === 'education') vert = 'education';
    else if (verticalKey === 'insurance') vert = 'insurance';
    else if (verticalKey === 'ca' || verticalKey === 'app') vert = 'ca';
    setRoleGatewayVertical(vert);
  };

  const handleRoleGatewaySelect = (roleId) => {
    if (roleGatewayVertical === 'ca') {
      setRoleGatewayVertical(null);
      if (roleId === 'ca') {
        handleQuickSwitch('app');
      } else {
        handleQuickSwitch('portal');
      }
    } else if (roleGatewayVertical === 'cooperative') {
      setRoleGatewayVertical(null);
      setCoopRole(roleId);
      setCurrentView('coop');
    } else if (roleGatewayVertical === 'education') {
      setRoleGatewayVertical(null);
      setEduRole(roleId);
      setCurrentView('edu');
    } else if (roleGatewayVertical === 'insurance') {
      setRoleGatewayVertical(null);
      setInsuranceRole(roleId);
      setCurrentView('insurance');
    }
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
      if (currentUser && currentUser.role === 'admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('auth_admin');
      }
    } else if (target === 'coop') {
      setCurrentUser({
        id: 'coop-admin-vasant',
        role: 'coop_admin',
        name: 'Shri Vasantrao Kulkarni',
        email: 'chairman@sahyadricoop.in',
        phone: '+91 98450 84920',
        firmName: 'Sahyadri Urban Co-operative Credit Society Ltd',
        isKycVerified: true,
        kycDate: 'Nov 2026',
        kycDocType: 'RCS Registration & Board Authority',
        avatarInitials: 'VK',
        designation: 'Society Chairman & Director',
        city: 'Pune, Maharashtra',
        location: 'Pune, Maharashtra'
      });
      setCurrentView('coop');
    } else if (target === 'edu') {
      setCurrentUser({
        id: 'edu-dean-venkatesh',
        role: 'edu_admin',
        name: 'Dr. K. S. Venkatesh (Dean)',
        email: 'dean.admissions@rvinstitute.edu.in',
        phone: '+91 98800 11223',
        firmName: 'RV Institute of Technology & Autonomous University',
        isKycVerified: true,
        kycDate: 'Nov 2026',
        kycDocType: 'AICTE / University Directorate Record',
        avatarInitials: 'KV',
        designation: 'Principal & Head of Admissions',
        city: 'Bengaluru, Karnataka',
        location: 'Bengaluru, Karnataka'
      });
      setCurrentView('edu');
    } else if (target === 'insurance') {
      setCurrentUser({
        id: 'ins-broker-sunil',
        role: 'ins_broker',
        name: 'Sunil Mathur (Licenced Broker)',
        email: 'sunil@surakshainsurance.in',
        phone: '+91 98200 44332',
        firmName: 'Suraksha Insurance Advisory & Corporate Brokers',
        isKycVerified: true,
        kycDate: 'Nov 2026',
        kycDocType: 'IRDAI Direct Broker Licence DB-849',
        avatarInitials: 'SM',
        designation: 'Principal Officer & Broker Director',
        city: 'Mumbai, Maharashtra',
        location: 'Mumbai, Maharashtra'
      });
      setCurrentView('insurance');
    } else if (target === 'subscriptions') {
      setCurrentView('subscriptions');
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
          onEnterVertical={handleEnterVertical}
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
          onLaunchApp={() => handleEnterVertical('ca')}
          onLaunchPortal={() => handleQuickSwitch('portal')}
          onLaunchCoop={() => handleEnterVertical('cooperative')}
          onLaunchEdu={() => handleEnterVertical('education')}
          onLaunchInsurance={() => handleEnterVertical('insurance')}
          onEnterVertical={handleEnterVertical}
          onOpenSubscriptions={(vert) => {
            setSelectedSubscriptionVertical(vert || 'ca');
            setCurrentView('subscriptions');
          }}
          onLaunchAI={() => setIsAIModalOpen(true)}
          onQuickSwitch={handleQuickSwitch}
        />
      )}

      {/* VIEW: COOPERATIVE BANKING & SOCIETY SUITE */}
      {currentView === 'coop' && (
        <CooperativePortal 
          initialRole={coopRole}
          currentUser={currentUser}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenAuth={(vert) => {
            setAuthDefaultRole(vert || 'cooperative');
            setIsAuthModalOpen(true);
          }}
          onBack={() => setCurrentView('home')}
          onOpenSubscribe={(vert) => {
            setSelectedSubscriptionVertical(vert || 'cooperative');
            setCurrentView('subscriptions');
          }}
        />
      )}

      {/* VIEW: EDUCATION & ADMISSIONS SUITE */}
      {currentView === 'edu' && (
        <EducationPortal 
          initialRole={eduRole}
          currentUser={currentUser}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenAuth={(vert) => {
            setAuthDefaultRole(vert || 'education');
            setIsAuthModalOpen(true);
          }}
          onBack={() => setCurrentView('home')}
          onOpenSubscribe={(vert) => {
            setSelectedSubscriptionVertical(vert || 'education');
            setCurrentView('subscriptions');
          }}
        />
      )}

      {/* VIEW: INSURANCE & CLAIMS SUITE */}
      {currentView === 'insurance' && (
        <InsurancePortal 
          initialRole={insuranceRole}
          currentUser={currentUser}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenAuth={(vert) => {
            setAuthDefaultRole(vert || 'insurance');
            setIsAuthModalOpen(true);
          }}
          onBack={() => setCurrentView('home')}
          onOpenSubscribe={(vert) => {
            setSelectedSubscriptionVertical(vert || 'insurance');
            setCurrentView('subscriptions');
          }}
        />
      )}

      {/* VIEW: MULTI-VERTICAL SUBSCRIPTIONS */}
      {currentView === 'subscriptions' && (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
          <SubscriptionPlans 
            activeFirm={activeFirm} 
            onSubscriptionUpdated={handleSubscriptionUpdated}
            onBack={() => setCurrentView('home')}
            defaultVertical={selectedSubscriptionVertical}
          />
        </div>
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
            onUpdateProfile={(updated) => setCurrentUser(prev => ({ ...prev, ...updated }))}
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
            onOpenProfile={() => setIsProfileModalOpen(true)}
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
              onOpenClientPortal={() => setCurrentView('portal')}
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

      {/* 2-Option Role Gateway Selector Modal for CA, Co-op, Edu, Insurance */}
      <RoleGatewayModal
        isOpen={!!roleGatewayVertical}
        onClose={() => setRoleGatewayVertical(null)}
        vertical={roleGatewayVertical}
        onSelectRole={handleRoleGatewaySelect}
        onOpenAuth={(targetRole) => {
          setAuthDefaultRole(targetRole || roleGatewayVertical);
          setRoleGatewayVertical(null);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Global AI Copilot Modal */}
      <AIAssistantModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
      />

      {/* Mobile Sidebar Navigation Drawer */}
      <MobileSidebarDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        currentView={currentView}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeFirm={activeFirm}
        onOpenFirmSwitcher={() => setIsFirmSwitcherOpen(true)}
        onBackHome={() => setCurrentView('home')}
        onOpenClientPortal={() => setCurrentView('portal')}
        onEnterVertical={handleEnterVertical}
        onOpenSubscriptions={() => setCurrentView('subscriptions')}
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
          else if (profile.role === 'cooperative') {
            setCoopRole('admin');
            setCurrentView('coop');
          } else if (profile.role === 'education') {
            setEduRole('admin');
            setCurrentView('edu');
          } else if (profile.role === 'insurance') {
            setInsuranceRole('admin');
            setCurrentView('insurance');
          } else {
            setCurrentView('app');
          }
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

      {/* Native-Style Mobile Bottom Navigation Bar (Shown strictly inside CA Practice Portal) */}
      {currentView === 'app' && (
        <MobileBottomNav 
          currentView={currentView}
          setCurrentView={setCurrentView}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAI={() => setIsAIModalOpen(true)}
        />
      )}
    </div>
  );
}
