import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ArrowLeft } from 'lucide-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import AIAssistantModal from './components/AIAssistantModal';
import FirmSwitcherModal from './components/FirmSwitcherModal';
import MobileBottomNav from './components/MobileBottomNav';
import MobileSidebarDrawer from './components/MobileSidebarDrawer';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import PortalAuthGateway from './components/PortalAuthGateway';
import RoleGatewayModal from './components/RoleGatewayModal';
import IndustrySelector from './components/IndustrySelector';
import InstagramProfileFeed from './components/InstagramProfileFeed';
import NotificationsPage from './components/NotificationsPage';
import { mockFirms } from './data/mockData';

const Dashboard = lazy(() => import('./components/Dashboard'));
const ClientList = lazy(() => import('./components/ClientList'));
const RequestBuilder = lazy(() => import('./components/RequestBuilder'));
const ClientUploadPortal = lazy(() => import('./components/ClientUploadPortal'));
const ReminderSettings = lazy(() => import('./components/ReminderSettings'));
const SubscriptionPlans = lazy(() => import('./components/SubscriptionPlans'));
const ReportsView = lazy(() => import('./components/ReportsView'));
const DocumentsView = lazy(() => import('./components/DocumentsView'));
const AdminPortal = lazy(() => import('./components/AdminPortal'));
const CooperativePortal = lazy(() => import('./components/CooperativePortal'));
const EducationPortal = lazy(() => import('./components/EducationPortal'));
const InsurancePortal = lazy(() => import('./components/InsurancePortal'));

const VALID_VERTICALS = ['ca', 'insurance', 'education', 'cooperative'];

function getInitialVertical() {
  const params = new URLSearchParams(window.location.search);
  const urlVert = params.get('industry');
  if (urlVert && VALID_VERTICALS.includes(urlVert)) {
    return urlVert;
  }
  const savedVert = sessionStorage.getItem('clarioloop_vertical');
  if (savedVert && VALID_VERTICALS.includes(savedVert)) {
    return savedVert;
  }
  return null;
}

function PortalLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        <span className="text-xs font-bold">Loading workspace...</span>
      </div>
    </div>
  );
}

export default function App() {
  // Pre-Home Industry Selector State: persisted in URL (?industry=...) & sessionStorage
  const [selectedVertical, setSelectedVertical] = useState(getInitialVertical);

  // Sync selectedVertical to URL query param & sessionStorage
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedVertical && VALID_VERTICALS.includes(selectedVertical)) {
      sessionStorage.setItem('clarioloop_vertical', selectedVertical);
      url.searchParams.set('industry', selectedVertical);
    } else {
      sessionStorage.removeItem('clarioloop_vertical');
      url.searchParams.delete('industry');
    }
    window.history.replaceState({}, '', url.toString());
  }, [selectedVertical]);

  // Main view state: 'home' | 'app' | 'portal' | 'admin' | 'auth_admin' | 'auth_ca' | 'auth_client' (persisted in sessionStorage across refresh)
  const [currentView, setCurrentView] = useState(() => {
    try {
      return sessionStorage.getItem('clarioloop_view') || 'home';
    } catch {
      return 'home';
    }
  });

  // Multi-Tenant CA Practices State (Persisted for Two-Way CA <-> Client Sync)
  const [firms, setFirms] = useState(() => {
    try {
      const saved = localStorage.getItem('clarioloop_firms_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(f => {
          const seen = new Set();
          const dedupedReqs = (f.requests || []).filter(r => {
            const key = `${(r.clientId || r.clientName || '').toLowerCase()}__${(r.title || '').toLowerCase()}__${(r.period || '').toLowerCase()}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          return { ...f, requests: dedupedReqs };
        });
      }
      return mockFirms;
    } catch {
      return mockFirms;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('clarioloop_firms_v1', JSON.stringify(firms));
    } catch {
      // ignore storage quota errors
    }
  }, [firms]);

  // Level 1 Sync: Instant cross-tab live sync via browser storage events
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'clarioloop_firms_v1' && e.newValue) {
        try {
          const next = JSON.parse(e.newValue);
          if (Array.isArray(next)) setFirms(next);
        } catch {
          // ignore parse errors
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Level 2 Sync: Cross-device Express backend sync (GET on mount + 5s poll + PUT on change)
  const remoteHydratedRef = React.useRef(false);
  const lastRemoteJsonRef = React.useRef('');

  useEffect(() => {
    let active = true;
    const pullWorkspace = async (isInitial = false) => {
      try {
        const res = await fetch('/api/ca/workspace');
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        if (Array.isArray(data?.firms) && data.firms.length > 0) {
          const remoteStr = JSON.stringify(data.firms);
          if (remoteStr !== lastRemoteJsonRef.current) {
            lastRemoteJsonRef.current = remoteStr;
            setFirms(data.firms);
          }
        } else if (isInitial) {
          // Seed backend with current local workspace on first run
          const seedStr = JSON.stringify(firms);
          lastRemoteJsonRef.current = seedStr;
          await fetch('/api/ca/workspace', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firms })
          });
        }
      } catch {
        // Backend offline: localStorage + Level 1 tab sync continues seamlessly
      } finally {
        if (isInitial) remoteHydratedRef.current = true;
      }
    };

    pullWorkspace(true);
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        pullWorkspace(false);
      }
    }, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!remoteHydratedRef.current) return;
    const nextStr = JSON.stringify(firms);
    if (nextStr === lastRemoteJsonRef.current) return;
    lastRemoteJsonRef.current = nextStr;

    fetch('/api/ca/workspace', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firms })
    }).catch(() => {
      // ignore when running frontend-only without Express
    });
  }, [firms]);
  const [activeFirmId, setActiveFirmId] = useState(() => {
    try {
      return sessionStorage.getItem('clarioloop_firm_id') || 'firm-1';
    } catch {
      return 'firm-1';
    }
  });
  const [isFirmSwitcherOpen, setIsFirmSwitcherOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [selectedSubscriptionVertical, setSelectedSubscriptionVertical] = useState('ca');

  // Vertical Role Gateway State (2 options: Desk vs Vault for CA, Co-op, Edu, Insurance)
  const [roleGatewayVertical, setRoleGatewayVertical] = useState(null); // 'ca' | 'cooperative' | 'education' | 'insurance' | null
  const [coopRole, setCoopRole] = useState(() => {
    try { return sessionStorage.getItem('clarioloop_coop_role') || 'admin'; } catch { return 'admin'; }
  });
  const [eduRole, setEduRole] = useState(() => {
    try { return sessionStorage.getItem('clarioloop_edu_role') || 'admin'; } catch { return 'admin'; }
  });
  const [insuranceRole, setInsuranceRole] = useState(() => {
    try { return sessionStorage.getItem('clarioloop_ins_role') || 'admin'; } catch { return 'admin'; }
  });

  // User Profile & Authentication State (Persisted in sessionStorage across page refresh; cleared on logout)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('clarioloop_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState('ca');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [returnViewAfterNotif, setReturnViewAfterNotif] = useState('app');

  // App workspace inner tab (persisted across refresh)
  const [activeTab, setActiveTab] = useState(() => {
    try { return sessionStorage.getItem('clarioloop_tab') || 'dashboard'; } catch { return 'dashboard'; }
  });
  const [activePortalToken, setActivePortalToken] = useState(() => {
    try { return sessionStorage.getItem('clarioloop_portal_token') || 'nexgen-nov2026-demo-token'; } catch { return 'nexgen-nov2026-demo-token'; }
  });
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Persist navigation & session state across browser refresh
  useEffect(() => {
    try {
      sessionStorage.setItem('clarioloop_view', currentView);
      sessionStorage.setItem('clarioloop_tab', activeTab);
      sessionStorage.setItem('clarioloop_firm_id', activeFirmId);
      sessionStorage.setItem('clarioloop_portal_token', activePortalToken);
      sessionStorage.setItem('clarioloop_coop_role', coopRole);
      sessionStorage.setItem('clarioloop_edu_role', eduRole);
      sessionStorage.setItem('clarioloop_ins_role', insuranceRole);
      if (currentUser) {
        sessionStorage.setItem('clarioloop_user', JSON.stringify(currentUser));
      } else {
        sessionStorage.removeItem('clarioloop_user');
      }
    } catch {
      // ignore storage errors
    }
  }, [currentView, activeTab, activeFirmId, activePortalToken, coopRole, eduRole, insuranceRole, currentUser]);

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
    } else if (params.get('token')) {
      const tok = params.get('token');
      setSelectedVertical('ca');
      setActivePortalToken(tok);
      let resolvedClient = null;
      let resolvedReq = null;
      for (const f of firms) {
        const c = (f.clients || []).find(cl => cl.secureToken === tok);
        const r = (f.requests || []).find(rq => rq.secureToken === tok);
        if (c || r) {
          resolvedClient = c || (f.clients || []).find(cl => cl.id === r?.clientId || cl.businessName === r?.clientName);
          resolvedReq = r;
          break;
        }
      }
      setCurrentUser(prev => prev || {
        id: 'client-magic-' + tok.slice(0, 6),
        role: 'client',
        name: resolvedClient?.contactPerson || resolvedReq?.clientName || 'Verified Client',
        email: resolvedClient?.email || resolvedReq?.clientEmail || '',
        companyName: resolvedClient?.businessName || resolvedReq?.clientName || '',
        gstin: resolvedClient?.gstin || '',
        isKycVerified: true,
        avatarInitials: (resolvedClient?.businessName || resolvedReq?.clientName || 'CL').slice(0, 2).toUpperCase(),
        magicToken: tok
      });
      setCurrentView('portal');
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

  // Add client to a specific CA practice (generates unique clientId + secureToken)
  const handleAddClientToFirm = (firmId, newClient) => {
    const clientWithToken = {
      ...newClient,
      firmId,
      secureToken: newClient.secureToken || `${(newClient.businessName || 'client').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8)}-${Date.now().toString(36)}`,
      internalNotes: newClient.internalNotes || '',
      filingReceipts: newClient.filingReceipts || []
    };
    setFirms(prev => prev.map(f => {
      if (f.id === firmId) {
        return {
          ...f,
          clients: [clientWithToken, ...(f.clients || [])]
        };
      }
      return f;
    }));
  };

  // Two-Way Sync 1: Client uploads file -> CA dashboard updates to SUBMITTED/COLLECTED & auto-stops reminders
  const handleClientUploadToRequest = (reqId, itemId, uploadedFile) => {
    setFirms(prev => prev.map(f => {
      if (f.id !== activeFirmId) return f;
      const nextRequests = (f.requests || []).map(req => {
        if (req.id !== reqId) return req;
        const nextItems = (req.items || []).map(it =>
          it.id === itemId
            ? { ...it, status: 'SUBMITTED', rejectionReason: null, uploadedFile }
            : it
        );
        const allDone = nextItems.every(it => it.status === 'SUBMITTED' || it.status === 'VERIFIED');
        const targetItem = (req.items || []).find(it => it.id === itemId);
        const event = {
          id: `tl-${Date.now()}`,
          at: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          actor: req.clientName || 'Client',
          action: `Uploaded "${uploadedFile?.name || targetItem?.title || 'Document'}"`
        };
        return {
          ...req,
          items: nextItems,
          status: allDone ? 'COMPLETE' : 'PARTIALLY_SUBMITTED',
          remindersStopped: allDone,
          timeline: [event, ...(req.timeline || [])].slice(0, 15)
        };
      });
      return { ...f, requests: nextRequests };
    }));
  };

  // Two-Way Sync 2: CA verifies, rejects with reason, or gives Partner Sign-Off -> Client portal updates immediately
  const handleCAReviewRequestItem = (reqId, itemId, action, reason = '') => {
    setFirms(prev => prev.map(f => {
      if (f.id !== activeFirmId) return f;
      const nextRequests = (f.requests || []).map(req => {
        if (req.id !== reqId) return req;
        const nextItems = (req.items || []).map(it => {
          if (it.id !== itemId) return it;
          if (action === 'VERIFY') {
            return { ...it, status: 'VERIFIED', rejectionReason: null, reviewStage: 'ARTICLE_CHECKED' };
          }
          if (action === 'PARTNER_SIGN_OFF') {
            return { ...it, status: 'VERIFIED', rejectionReason: null, reviewStage: 'PARTNER_SIGNED' };
          }
          if (action === 'REJECT') {
            return { ...it, status: 'REJECTED', rejectionReason: reason || 'Re-upload required by CA', reviewStage: null };
          }
          return it;
        });
        const allVerified = nextItems.every(it => it.status === 'VERIFIED' || it.status === 'SUBMITTED');
        const targetItem = (req.items || []).find(it => it.id === itemId);
        const event = {
          id: `tl-${Date.now()}`,
          at: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          actor: f.partnerName || 'CA Desk',
          action:
            action === 'VERIFY'
              ? `Verified "${targetItem?.title || 'Document'}"`
              : action === 'PARTNER_SIGN_OFF'
              ? `Partner Signed Off "${targetItem?.title || 'Document'}"`
              : `Rejected "${targetItem?.title || 'Document'}" (${reason || 'Re-upload needed'})`
        };
        return {
          ...req,
          items: nextItems,
          status: allVerified ? 'COMPLETE' : 'PARTIALLY_SUBMITTED',
          timeline: [event, ...(req.timeline || [])].slice(0, 15)
        };
      });
      return { ...f, requests: nextRequests };
    }));
  };

  // Client approves pre-filing Tax / GST Computation sent by CA
  const handleApproveTaxComputation = (clientId, approvedBy) => {
    setFirms(prev => prev.map(f => {
      if (f.id !== activeFirmId) return f;
      return {
        ...f,
        clients: (f.clients || []).map(c =>
          c.id === clientId && c.taxComputation
            ? {
                ...c,
                taxComputation: {
                  ...c.taxComputation,
                  status: 'APPROVED',
                  approvedBy: approvedBy || c.contactPerson || 'Client',
                  approvedAt: new Date().toISOString().split('T')[0]
                }
              }
            : c
        )
      };
    }));
  };

  // Create a single new CA Request from RequestBuilder
  const handleCreateRequest = ({ clientId, title, period, dueDate, isRecurring, items }) => {
    setFirms(prev => prev.map(f => {
      if (f.id !== activeFirmId) return f;
      const client = (f.clients || []).find(c => c.id === clientId) || f.clients?.[0];
      const newReq = {
        id: `req-${Date.now()}`,
        firmId: f.id,
        clientId: client?.id || clientId,
        clientName: client?.businessName || 'Client',
        clientEmail: client?.email || '',
        clientPhone: client?.phone || '',
        title: title || 'Compliance Document Request',
        period: period || 'Current Period',
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        secureToken: client?.secureToken || `${client?.id || 'client'}-${Date.now().toString(36)}`,
        status: 'PENDING',
        isRecurring: !!isRecurring,
        remindersSent: 1,
        timeline: [
          {
            id: `tl-${Date.now()}`,
            at: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            actor: f.partnerName || 'CA Desk',
            action: `Created request "${title || 'Compliance Document Request'}"`
          }
        ],
        items: (items || [])
          .filter(it => it.tag !== 'Not Applicable')
          .map((it, idx) => ({
            id: `ri-${Date.now()}-${idx}`,
            title: it.title,
            category: it.category || 'Compliance',
            isRequired: it.tag === 'Mandatory' || !!it.isRequired,
            status: 'PENDING'
          }))
      };
      return { ...f, requests: [newReq, ...(f.requests || [])] };
    }));
  };

  // CA Bulk Request Blast across multiple selected clients
  const handleBulkRequestBlast = ({ clientIds, title, dueDate, items }) => {
    setFirms(prev => prev.map(f => {
      if (f.id !== activeFirmId) return f;
      const targets = (f.clients || []).filter(c => clientIds.includes(c.id));
      const existing = f.requests || [];
      const periodLabel = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      const existingKeys = new Set(
        existing.map(r => `${(r.clientId || r.clientName || '').toLowerCase()}__${(r.title || '').toLowerCase()}__${(r.period || '').toLowerCase()}`)
      );
      const newRequests = targets
        .filter(c => !existingKeys.has(`${(c.id || c.businessName || '').toLowerCase()}__${title.toLowerCase()}__${periodLabel.toLowerCase()}`) &&
                     !existingKeys.has(`${(c.businessName || '').toLowerCase()}__${title.toLowerCase()}__${periodLabel.toLowerCase()}`))
        .map(c => ({
        id: 'req-' + Date.now() + '-' + c.id,
        firmId: f.id,
        clientId: c.id,
        clientName: c.businessName,
        clientEmail: c.email,
        clientPhone: c.phone,
        title,
        period: periodLabel,
        dueDate,
        secureToken: c.secureToken || `${c.id}-${Date.now().toString(36)}`,
        status: 'PENDING',
        remindersSent: 1,
          items: items.map((label, idx) => ({
          id: `bi-${Date.now()}-${c.id}-${idx}`,
          title: typeof label === 'string' ? label : label.title,
          category: (typeof label === 'object' && label.category) ? label.category : 'Bulk Compliance Request',
          isRequired: true,
          status: 'PENDING'
        }))
      }));
      return { ...f, requests: [...newRequests, ...existing] };
    }));
  };

  // CA 1-Click Query Sheet: Ask clarification on a specific request item
  const handleAskClarification = (reqId, itemId, question) => {
    if (!question?.trim()) return;
    setFirms(prev => prev.map(f => {
      if (f.id !== activeFirmId) return f;
      return {
        ...f,
        requests: (f.requests || []).map(req => {
          if (req.id !== reqId) return req;
          return {
            ...req,
            items: (req.items || []).map(it =>
              it.id === itemId
                ? { ...it, clarificationQuery: question.trim(), clarificationReply: '', clarificationAt: new Date().toISOString().split('T')[0] }
                : it
            )
          };
        })
      };
    }));
  };

  // Client -> CA reply to a clarification query
  const handleClientReplyClarification = (reqId, itemId, replyText) => {
    if (!replyText?.trim()) return;
    setFirms(prev => prev.map(f => {
      if (f.id !== activeFirmId) return f;
      return {
        ...f,
        requests: (f.requests || []).map(req => {
          if (req.id !== reqId) return req;
          return {
            ...req,
            items: (req.items || []).map(it =>
              it.id === itemId
                ? { ...it, clarificationReply: replyText.trim(), clarificationRepliedAt: new Date().toISOString().split('T')[0] }
                : it
            )
          };
        })
      };
    }));
  };

  // Monthly Auto-Recurring GST/TDS: Clone active requests for next period in 1 click
  const handleCloneMonthlyRequests = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const periodLabel = nextMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    const nextDue = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 11).toISOString().split('T')[0];

    setFirms(prev => prev.map(f => {
      if (f.id !== activeFirmId) return f;
      const existing = f.requests || [];
      const uniqueByClient = [];
      const seen = new Set();
      for (const r of existing) {
        const key = r.clientId || r.clientName;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueByClient.push(r);
        }
      }
      const clonedTitle = `${periodLabel} — Monthly GST & Bookkeeping Pack`;
      const existingKeys = new Set(
        existing.map(r => `${(r.clientId || r.clientName || '').toLowerCase()}__${(r.title || '').toLowerCase()}__${(r.period || '').toLowerCase()}`)
      );
      const cloned = uniqueByClient
        .filter(r => !existingKeys.has(`${(r.clientId || r.clientName || '').toLowerCase()}__${clonedTitle.toLowerCase()}__${periodLabel.toLowerCase()}`))
        .map((r, idx) => ({
        ...r,
        id: `req-clone-${Date.now()}-${idx}`,
        title: clonedTitle,
        period: periodLabel,
        dueDate: nextDue,
        status: 'PENDING',
        remindersSent: 0,
        items: (r.items || []).map((it, i) => ({
          id: `ci-${Date.now()}-${idx}-${i}`,
          title: it.title,
          category: it.category,
          isRequired: it.isRequired,
          status: 'PENDING',
        }))
      }));
      return { ...f, requests: [...cloned, ...existing] };
    }));
  };

  const handleToggleAutoRecurring = () => {
    setFirms(prev => prev.map(f =>
      f.id === activeFirmId ? { ...f, autoRecurringMonthly: !f.autoRecurringMonthly } : f
    ));
  };

  // Update CA client metadata (assignedStaff, CA-only internalNotes, or client-visible filingReceipts)
  const handleUpdateClientMeta = (clientId, patch) => {
    setFirms(prev => prev.map(f => {
      if (f.id !== activeFirmId) return f;
      return {
        ...f,
        clients: (f.clients || []).map(c => (c.id === clientId ? { ...c, ...patch } : c))
      };
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
    const vertical = roleGatewayVertical;
    setRoleGatewayVertical(null);

    if (vertical === 'ca') {
      if (roleId === 'ca') {
        if (currentUser?.role === 'ca') setCurrentView('app');
        else {
          setAuthDefaultRole('ca');
          setIsAuthModalOpen(true);
        }
      } else {
        if (currentUser?.role === 'client') setCurrentView('portal');
        else {
          setAuthDefaultRole('client');
          setIsAuthModalOpen(true);
        }
      }
    } else if (vertical === 'cooperative') {
      if (roleId === 'admin') {
        if (currentUser?.role === 'cooperative') {
          setCoopRole('admin');
          setCurrentView('coop');
        } else {
          setAuthDefaultRole('cooperative');
          setIsAuthModalOpen(true);
        }
      } else {
        if (currentUser?.role === 'coop_member') {
          setCoopRole('member');
          setCurrentView('coop');
        } else {
          setAuthDefaultRole('coop_member');
          setIsAuthModalOpen(true);
        }
      }
    } else if (vertical === 'education') {
      if (roleId === 'admin') {
        if (currentUser?.role === 'education') {
          setEduRole('admin');
          setCurrentView('edu');
        } else {
          setAuthDefaultRole('education');
          setIsAuthModalOpen(true);
        }
      } else {
        if (currentUser?.role === 'edu_student') {
          setEduRole('student');
          setCurrentView('edu');
        } else {
          setAuthDefaultRole('edu_student');
          setIsAuthModalOpen(true);
        }
      }
    } else if (vertical === 'insurance') {
      if (roleId === 'admin') {
        if (currentUser?.role === 'insurance') {
          setInsuranceRole('admin');
          setCurrentView('insurance');
        } else {
          setAuthDefaultRole('insurance');
          setIsAuthModalOpen(true);
        }
      } else {
        if (currentUser?.role === 'ins_client') {
          setInsuranceRole('policyholder');
          setCurrentView('insurance');
        } else {
          setAuthDefaultRole('ins_client');
          setIsAuthModalOpen(true);
        }
      }
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

  // Handle role selection directly from the single-industry HomePage
  const handleSelectHomeRole = (targetRole) => {
    if (targetRole === 'ca') {
      if (currentUser?.role === 'ca') setCurrentView('app');
      else {
        setAuthDefaultRole('ca');
        setIsAuthModalOpen(true);
      }
    } else if (targetRole === 'client') {
      if (currentUser?.role === 'client') setCurrentView('portal');
      else {
        setAuthDefaultRole('client');
        setIsAuthModalOpen(true);
      }
    } else if (targetRole === 'cooperative') {
      if (currentUser?.role === 'cooperative') {
        setCoopRole('admin');
        setCurrentView('coop');
      } else {
        setAuthDefaultRole('cooperative');
        setIsAuthModalOpen(true);
      }
    } else if (targetRole === 'coop_member') {
      if (currentUser?.role === 'coop_member') {
        setCoopRole('member');
        setCurrentView('coop');
      } else {
        setAuthDefaultRole('coop_member');
        setIsAuthModalOpen(true);
      }
    } else if (targetRole === 'education') {
      if (currentUser?.role === 'education') {
        setEduRole('admin');
        setCurrentView('edu');
      } else {
        setAuthDefaultRole('education');
        setIsAuthModalOpen(true);
      }
    } else if (targetRole === 'edu_student') {
      if (currentUser?.role === 'edu_student') {
        setEduRole('student');
        setCurrentView('edu');
      } else {
        setAuthDefaultRole('edu_student');
        setIsAuthModalOpen(true);
      }
    } else if (targetRole === 'insurance') {
      if (currentUser?.role === 'insurance') {
        setInsuranceRole('admin');
        setCurrentView('insurance');
      } else {
        setAuthDefaultRole('insurance');
        setIsAuthModalOpen(true);
      }
    } else if (targetRole === 'ins_client') {
      if (currentUser?.role === 'ins_client') {
        setInsuranceRole('policyholder');
        setCurrentView('insurance');
      } else {
        setAuthDefaultRole('ins_client');
        setIsAuthModalOpen(true);
      }
    }
  };

  const isGatewayView = currentView.startsWith('auth_');
  const showPreHomeSelector = currentView === 'home' && !selectedVertical;

  // Strictly scope notifications to the active sector & signed-in user role
  const liveNotifications = (() => {
    if (!currentUser) return [];

    if (currentUser.role === 'ca') {
      return (activeFirm?.requests || []).flatMap((req) => [
        ...(req.timeline || []).map((ev) => ({
          id: ev.id,
          type: 'UPLOAD',
          title: `${ev.actor} • ${req.clientName}`,
          detail: ev.action,
          time: ev.at
        })),
        ...(req.items || [])
          .filter((i) => i.status === 'REJECTED')
          .map((i) => ({
            id: `rej-${req.id}-${i.id}`,
            type: 'REJECTED',
            title: `Re-upload Needed • ${req.clientName}`,
            detail: `${i.title}: ${i.rejectionReason || 'Fix required'}`,
            time: req.dueDate
          })),
        ...(req.items || [])
          .filter((i) => i.clarificationQuery)
          .map((i) => ({
            id: `qry-${req.id}-${i.id}`,
            type: 'QUERY',
            title: `Clarification • ${req.clientName}`,
            detail: i.clarificationReply
              ? `Replied: "${i.clarificationReply}"`
              : `Asked: "${i.clarificationQuery}"`,
            time: i.clarificationRepliedAt || i.clarificationAt || req.dueDate
          }))
      ]);
    }

    if (currentUser.role === 'client') {
      const clientReqs = (activeFirm?.requests || []).filter(
        (r) =>
          (activePortalToken && r.secureToken === activePortalToken) ||
          (currentUser.companyName &&
            r.clientName?.toLowerCase() === currentUser.companyName.toLowerCase())
      );
      return clientReqs.flatMap((req) => [
        ...(req.items || [])
          .filter((i) => i.status === 'REJECTED')
          .map((i) => ({
            id: `crej-${req.id}-${i.id}`,
            type: 'REJECTED',
            title: `Re-upload Needed • ${req.title}`,
            detail: `${i.title}: ${i.rejectionReason || 'Fix required'}`,
            time: req.dueDate
          })),
        ...(req.items || [])
          .filter((i) => i.clarificationQuery && !i.clarificationReply)
          .map((i) => ({
            id: `cqry-${req.id}-${i.id}`,
            type: 'QUERY',
            title: `CA Query • ${i.title}`,
            detail: i.clarificationQuery,
            time: i.clarificationAt || req.dueDate
          }))
      ]);
    }

    if (currentUser.role === 'cooperative' || currentUser.role === 'coop_member') {
      try {
        const savedCoop = localStorage.getItem('clarioloop_coop_docs_v1');
        const docsMap = savedCoop ? JSON.parse(savedCoop) : {};
        return Object.entries(docsMap).map(([docName, info], idx) => ({
          id: `coop-notif-${idx}-${docName}`,
          type: info.status === 'SUBMITTED' ? 'QUERY' : 'UPLOAD',
          title: info.status === 'SUBMITTED' ? 'Member Upload • Review Needed' : 'Society KYC Verified',
          detail: `${docName} (${info.fileName})`,
          time: info.uploadedAt || 'Recent'
        }));
      } catch {
        return [];
      }
    }

    return [];
  })();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Sticky Navbar (Hidden in pre-home IndustrySelector, client upload portal, admin portal, notifications, and dedicated gateway views) */}
      {!showPreHomeSelector && currentView !== 'portal' && currentView !== 'admin' && currentView !== 'notifications' && !isGatewayView && (
        <Navbar 
          currentView={currentView}
          setCurrentView={setCurrentView}
          onOpenAI={() => setIsAIModalOpen(true)}
          activeFirm={activeFirm}
          onOpenFirmSwitcher={() => setIsFirmSwitcherOpen(true)}
          onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
          currentUser={currentUser}
          notifications={liveNotifications}
          onOpenNotifications={() => {
            setReturnViewAfterNotif(currentView);
            setCurrentView('notifications');
          }}
          onQuickSwitch={handleQuickSwitch}
          onEnterVertical={handleEnterVertical}
          selectedVertical={selectedVertical}
          onChangeVertical={() => {
            setSelectedVertical(null);
            setCurrentUser(null);
            setCurrentView('home');
          }}
          onOpenAuth={(targetRole) => {
            setAuthDefaultRole(targetRole || selectedVertical || 'ca');
            setIsAuthModalOpen(true);
          }}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onLogout={() => {
            setCurrentUser(null);
            setCurrentView('home');
          }}
        />
      )}

      {/* VIEW 0: PRE-HOME 4-INDUSTRY SELECTOR */}
      <Suspense fallback={<PortalLoader />}>
      {showPreHomeSelector && (
        <IndustrySelector
          onSelectIndustry={(vert) => {
            setSelectedVertical(vert);
            setSelectedSubscriptionVertical(vert);
            setCurrentView('home');
          }}
        />
      )}

      {/* VIEW 1: INDUSTRY-ISOLATED HOME PAGE */}
      {currentView === 'home' && selectedVertical && (
        <HomePage
          selectedVertical={selectedVertical}
          onSelectRole={handleSelectHomeRole}
          onChangeVertical={() => {
            setSelectedVertical(null);
            setCurrentUser(null);
            setCurrentView('home');
          }}
          onOpenSubscriptions={(vert) => {
            setSelectedSubscriptionVertical(vert || selectedVertical);
            setCurrentView('subscriptions');
          }}
        />
      )}

      {/* FULL-PAGE NOTIFICATIONS CENTER */}
      {currentView === 'notifications' && (
        <NotificationsPage
          notifications={liveNotifications}
          onBack={() => setCurrentView(returnViewAfterNotif || 'home')}
          onNavigateWorkspace={() => {
            if (currentUser?.role === 'ca') {
              setActiveTab('dashboard');
              setCurrentView('app');
            } else if (currentUser?.role === 'client') {
              setCurrentView('portal');
            } else if (currentUser?.role === 'cooperative' || currentUser?.role === 'coop_member') {
              setCurrentView('coop');
            } else {
              setCurrentView(returnViewAfterNotif || 'home');
            }
          }}
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
            lockVertical={!!selectedVertical}
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

      {/* VIEW 2: FULLSCREEN CLIENT MOBILE UPLOAD PORTAL (Strict Privacy: Scoped to Client, Internal Notes Stripped) */}
      {currentView === 'portal' && (
        currentUser && currentUser.role === 'client' ? (() => {
          const matchedClient = (activeFirm?.clients || []).find(
            c => (activePortalToken && c.secureToken === activePortalToken) ||
                 (currentUser.email && c.email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
                 (currentUser.companyName && c.businessName?.toLowerCase() === currentUser.companyName?.toLowerCase())
          ) || null;

          const safeClientData = matchedClient ? {
            id: matchedClient.id,
            businessName: matchedClient.businessName,
            gstin: matchedClient.gstin,
            pan: matchedClient.pan,
            email: matchedClient.email,
            phone: matchedClient.phone,
            filingReceipts: matchedClient.filingReceipts || [],
            secretPassphrase: matchedClient.secretPassphrase || '',
            taxComputation: matchedClient.taxComputation || null,
            retainerAmount: matchedClient.retainerAmount || 5000,
            retainerStatus: matchedClient.retainerStatus || 'PAID',
            lockReceiptsUntilPaid: !!matchedClient.lockReceiptsUntilPaid
          } : null;

          // Strictly sanitize activeFirm before passing to Client Portal:
          // Never expose other clients, their PAN/GSTINs, or CA-only internalNotes.
          const safeFirmForClient = activeFirm ? {
            id: activeFirm.id,
            name: activeFirm.name,
            partnerName: activeFirm.partnerName,
            logoInitials: activeFirm.logoInitials,
            email: activeFirm.email,
            phone: activeFirm.phone,
            requests: (activeFirm.requests || []).filter(r =>
              (activePortalToken && r.secureToken === activePortalToken) ||
              (matchedClient && (
                (r.clientId && r.clientId === matchedClient.id) ||
                (r.clientName && matchedClient.businessName && r.clientName.toLowerCase() === matchedClient.businessName.toLowerCase())
              ))
            )
          } : null;

          return (
            <ClientUploadPortal 
              token={activePortalToken} 
              onBackToFirm={() => setCurrentView('home')} 
              activeFirm={safeFirmForClient}
              matchedClient={safeClientData}
              onClientUploadToRequest={handleClientUploadToRequest}
              onReplyClarification={handleClientReplyClarification}
              onApproveTaxComputation={(approvedBy) => {
                if (matchedClient) {
                  handleApproveTaxComputation(matchedClient.id, approvedBy);
                }
              }}
              onSaveClientSecret={(secretVal) => {
                if (matchedClient) {
                  handleUpdateClientMeta(matchedClient.id, { secretPassphrase: secretVal });
                }
              }}
              currentUser={currentUser}
              onUpdateProfile={(updated) => {
                setCurrentUser(prev => ({ ...prev, ...updated }));
                if (matchedClient) {
                  handleUpdateClientMeta(matchedClient.id, {
                    ...(updated.companyName ? { businessName: updated.companyName } : {}),
                    ...(updated.email ? { email: updated.email } : {}),
                    ...(updated.phone ? { phone: updated.phone } : {}),
                    ...(updated.gstin ? { gstin: updated.gstin } : {}),
                    ...(updated.pan ? { pan: updated.pan } : {})
                  });
                }
              }}
              onQuickSwitch={handleQuickSwitch}
              onLogout={() => {
                setCurrentUser(null);
                setCurrentView('home');
              }}
            />
          );
        })() : (
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

            <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-3 sm:p-6 lg:p-8 pb-24 md:pb-8">
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
                  onReviewRequestItem={handleCAReviewRequestItem}
                  onAskClarification={handleAskClarification}
                  onCloneMonthlyRequests={handleCloneMonthlyRequests}
                  onToggleAutoRecurring={handleToggleAutoRecurring}
                />
              )}

              {activeTab === 'clients' && (
                <ClientList 
                  activeFirm={activeFirm}
                  onAddClientToFirm={handleAddClientToFirm}
                  onUpdateClientMeta={handleUpdateClientMeta}
                  onBulkRequestBlast={handleBulkRequestBlast}
                  onBack={() => setActiveTab('dashboard')}
                />
              )}

            {activeTab === 'requests' && (
              <RequestBuilder 
                activeFirm={activeFirm}
                onCreateRequest={handleCreateRequest}
                onCreated={() => setActiveTab('dashboard')}
                onBack={() => setActiveTab('dashboard')} 
              />
            )}

            {activeTab === 'documents' && (
              <DocumentsView 
                activeFirm={activeFirm}
                onOpenAI={() => setIsAIModalOpen(true)}
                onReviewRequestItem={handleCAReviewRequestItem}
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

            {activeTab === 'profile' && (
              <InstagramProfileFeed
                name={activeFirm?.name || 'CA Practice Desk'}
                subtitle={`${activeFirm?.partnerName || 'Lead Partner'} • ${activeFirm?.city || 'India'}`}
                initials={activeFirm?.logoInitials || 'CA'}
                accent="indigo"
                badgeText="ICAI PRACTICE"
                posts={(activeFirm?.requests || []).flatMap((req) =>
                  (req.items || []).map((it) => ({
                    id: `${req.id}_${it.id}`,
                    title: it.title,
                    subtitle: req.clientName,
                    category: it.category,
                    period: req.period,
                    status: it.status
                  }))
                )}
                onPostAction={() => setActiveTab('dashboard')}
                actionLabelMissing="Review Request"
                actionLabelDone="View in Desk"
                profileFields={[
                  { key: 'partnerName', label: 'Lead Partner', value: activeFirm?.partnerName || '' },
                  { key: 'city', label: 'City / Location', value: activeFirm?.city || '' },
                  { key: 'email', label: 'Practice Email', value: activeFirm?.email || '' },
                  { key: 'phone', label: 'Practice Phone', value: activeFirm?.phone || '' },
                ]}
                onSaveProfile={(updated) => {
                  setFirms(prev => prev.map(f =>
                    f.id === activeFirm?.id
                      ? {
                          ...f,
                          name: updated.name || f.name,
                          partnerName: updated.partnerName || f.partnerName,
                          city: updated.city || f.city,
                          email: updated.email || f.email,
                          phone: updated.phone || f.phone,
                        }
                      : f
                  ));
                }}
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
      </Suspense>

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
        selectedVertical={selectedVertical || 'ca'}
        onChangeVertical={() => {
          setSelectedVertical(null);
          setCurrentUser(null);
          setCurrentView('home');
        }}
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
          setAuthDefaultRole(role || selectedVertical || 'ca');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Role-Based Authentication Modal (Login & Register with KYC, scoped to selected industry) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultRole={authDefaultRole}
        allowedVertical={selectedVertical}
        onAuthSuccess={(profile) => {
          setCurrentUser(profile);
          if (profile.role === 'admin') setCurrentView('admin');
          else if (profile.role === 'client') setCurrentView('portal');
          else if (profile.role === 'cooperative') {
            setCoopRole('admin');
            setCurrentView('coop');
          } else if (profile.role === 'coop_member') {
            setCoopRole('member');
            setCurrentView('coop');
          } else if (profile.role === 'education') {
            setEduRole('admin');
            setCurrentView('edu');
          } else if (profile.role === 'edu_student') {
            setEduRole('student');
            setCurrentView('edu');
          } else if (profile.role === 'insurance') {
            setInsuranceRole('admin');
            setCurrentView('insurance');
          } else if (profile.role === 'ins_client') {
            setInsuranceRole('policyholder');
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
