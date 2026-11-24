import React, { useState } from 'react';
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
import AIAssistantModal from './components/AIAssistantModal';
import FirmSwitcherModal from './components/FirmSwitcherModal';
import MobileBottomNav from './components/MobileBottomNav';
import { mockFirms } from './data/mockData';

export default function App() {
  // Main view state: 'home' | 'app' | 'portal'
  const [currentView, setCurrentView] = useState('home');

  // Multi-Tenant CA Practices State
  const [firms, setFirms] = useState(mockFirms);
  const [activeFirmId, setActiveFirmId] = useState('firm-1');
  const [isFirmSwitcherOpen, setIsFirmSwitcherOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Sticky Navbar (Hidden in client upload portal view) */}
      {currentView !== 'portal' && (
        <Navbar 
          currentView={currentView}
          setCurrentView={setCurrentView}
          onOpenAI={() => setIsAIModalOpen(true)}
          activeFirm={activeFirm}
          onOpenFirmSwitcher={() => setIsFirmSwitcherOpen(true)}
        />
      )}

      {/* VIEW 1: HOME PAGE (DEFAULT) */}
      {currentView === 'home' && (
        <HomePage 
          onLaunchApp={() => setCurrentView('app')}
          onLaunchPortal={() => setCurrentView('portal')}
          onLaunchAI={() => setIsAIModalOpen(true)}
        />
      )}

      {/* VIEW 2: FULLSCREEN CLIENT MOBILE UPLOAD PORTAL */}
      {currentView === 'portal' && (
        <ClientUploadPortal 
          token={activePortalToken} 
          onBackToFirm={() => setCurrentView('home')} 
          activeFirm={activeFirm}
        />
      )}

      {/* VIEW 3: SIMPLIFIED CA APP WORKSPACE */}
      {currentView === 'app' && (
        <div className="flex-1 flex overflow-hidden bg-slate-50">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onBackHome={() => setCurrentView('home')}
            activeFirm={activeFirm}
            onOpenFirmSwitcher={() => setIsFirmSwitcherOpen(true)}
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
              />
            )}

            {activeTab === 'requests' && (
              <RequestBuilder 
                activeFirm={activeFirm}
                onCreated={() => setActiveTab('dashboard')} 
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

            {activeTab === 'reminders' && <ReminderSettings activeFirm={activeFirm} />}

            {activeTab === 'reports' && <ReportsView activeFirm={activeFirm} />}

            {activeTab === 'subscriptions' && (
              <SubscriptionPlans 
                activeFirm={activeFirm} 
                onSubscriptionUpdated={handleSubscriptionUpdated}
              />
            )}
          </main>
        </div>
      )}

      {/* Global AI Copilot Modal */}
      <AIAssistantModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
      />

      {/* Multi-Tenant CA Practice Switcher & Registration Modal */}
      <FirmSwitcherModal 
        isOpen={isFirmSwitcherOpen}
        onClose={() => setIsFirmSwitcherOpen(false)}
        firms={firms}
        activeFirmId={activeFirmId}
        onSelectFirm={(id) => setActiveFirmId(id)}
        onRegisterNewFirm={handleRegisterNewFirm}
      />

      {/* Native-Style Mobile Bottom Navigation Bar (Hidden in client upload portal view) */}
      {currentView !== 'portal' && (
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
