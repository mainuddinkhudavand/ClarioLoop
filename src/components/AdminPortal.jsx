import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Users, 
  FileText, 
  CreditCard, 
  Activity, 
  Server, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ArrowUpRight, 
  Database, 
  Lock, 
  Sparkles,
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  Sliders,
  DollarSign,
  Download,
  Filter,
  Check,
  ChevronRight,
  UserCheck,
  Edit3,
  Trash2,
  X,
  Phone,
  Mail,
  MapPin,
  Tag,
  UserPlus,
  MessageSquare,
  Clock,
  Smartphone,
  Monitor,
  Send,
  Radio,
  Wifi,
  Globe,
  LogOut
} from 'lucide-react';
import ClientCRMView from './ClientCRMView';

// Live Active User Sessions (Multi-Portal Directory)
const initialLiveUsers = [
  {
    id: 'SES-10291',
    name: 'CA Rajesh Sharma (FCA, DISA)',
    email: 'rajesh@apexcafirm.in',
    phone: '+91 98765 43210',
    role: 'CA',
    roleBadge: 'CA Practice Partner',
    organization: 'Apex & Partners Chartered Accountants',
    orgDetail: 'FRN 102938W • Mumbai',
    device: 'Chrome 124 • macOS Sonoma',
    deviceType: 'desktop',
    ip: '103.21.58.12',
    city: 'Mumbai, Maharashtra',
    loginTime: 'Today, 10:42 AM',
    lastActive: 'Active now',
    status: 'ONLINE',
    isKycVerified: true,
    kycType: 'ICAI COP Certificate',
    sessionDuration: '1h 32m',
    currentModule: 'Tax Audit Section 44AB Checklist'
  },
  {
    id: 'SES-20492',
    name: 'Vikram Mehta (Director of Finance)',
    email: 'accounts@nexgendigital.io',
    phone: '+91 98111 22233',
    role: 'CLIENT',
    roleBadge: 'Corporate Client',
    organization: 'NexGen Digital Solutions Pvt Ltd',
    orgDetail: 'GSTIN: 27AABCN1234F1Z5 • Pune',
    device: 'Mobile Safari • iOS 18 (iPhone 16 Pro)',
    deviceType: 'mobile',
    ip: '49.36.128.90',
    city: 'Pune, Maharashtra',
    loginTime: 'Today, 11:15 AM',
    lastActive: 'Active 2m ago',
    status: 'ONLINE',
    isKycVerified: true,
    kycType: 'Company PAN & COI',
    sessionDuration: '45m',
    currentModule: 'Client Upload Portal (Item 2 of 2)'
  },
  {
    id: 'SES-00100',
    name: 'Root Platform Admin',
    email: 'admin@clarioloop.com',
    phone: '+91 98000 11111',
    role: 'ADMIN',
    roleBadge: 'Platform SuperAdmin',
    organization: 'ClarioLoop Platform Infrastructure',
    orgDetail: 'Tier-1 Root Security Clearance',
    device: 'Edge 123 • Windows 11 Enterprise',
    deviceType: 'desktop',
    ip: '14.143.190.22',
    city: 'Bengaluru, Karnataka',
    loginTime: 'Today, 09:00 AM',
    lastActive: 'Active now',
    status: 'ONLINE',
    isKycVerified: true,
    kycType: 'Govt Enterprise Security Pass',
    sessionDuration: '3h 15m',
    currentModule: 'Tenant Monitoring & Partition Health'
  },
  {
    id: 'SES-10294',
    name: 'CA Bhavin Kothari (FCA, LLB)',
    email: 'bhavin@kotharitax.in',
    phone: '+91 98250 12345',
    role: 'CA',
    roleBadge: 'CA Practice Partner',
    organization: 'Kothari & Mehta Tax Advisory LLP',
    orgDetail: 'FRN 124890S • Ahmedabad',
    device: 'Firefox 125 • Windows 11',
    deviceType: 'desktop',
    ip: '117.218.42.15',
    city: 'Ahmedabad, Gujarat',
    loginTime: 'Today, 10:10 AM',
    lastActive: 'Active 8m ago',
    status: 'ONLINE',
    isKycVerified: true,
    kycType: 'ICAI Membership Card',
    sessionDuration: '1h 50m',
    currentModule: 'GST Reconciliation & Form 9C'
  },
  {
    id: 'SES-10295',
    name: 'CA Ananya Singhania (ACA, CS)',
    email: 'ananya@singhaniaauditors.com',
    phone: '+91 99100 88776',
    role: 'CA',
    roleBadge: 'CA Practice Partner',
    organization: 'Singhania & Co. Corporate Auditors',
    orgDetail: 'FRN 059281N • New Delhi',
    device: 'Chrome 124 • macOS Sequoia',
    deviceType: 'desktop',
    ip: '122.160.180.44',
    city: 'New Delhi, Delhi NCR',
    loginTime: 'Today, 11:30 AM',
    lastActive: 'Active now',
    status: 'ONLINE',
    isKycVerified: true,
    kycType: 'ICAI COP Certificate',
    sessionDuration: '32m',
    currentModule: 'Transfer Pricing Documentation'
  },
  {
    id: 'SES-20496',
    name: 'Amitabh Sen (CFO)',
    email: 'finance@vanguardlogistics.in',
    phone: '+91 99112 33445',
    role: 'CLIENT',
    roleBadge: 'Corporate Client',
    organization: 'Vanguard Logistics & Freight LLP',
    orgDetail: 'GSTIN: 07AAEFV9012M1Z2 • Delhi',
    device: 'Chrome Mobile • Android 15 (Pixel 8)',
    deviceType: 'mobile',
    ip: '182.73.24.110',
    city: 'Gurugram, Haryana',
    loginTime: 'Today, 11:02 AM',
    lastActive: 'Active 12m ago',
    status: 'ONLINE',
    isKycVerified: true,
    kycType: 'LLP Agreement & PAN',
    sessionDuration: '58m',
    currentModule: 'Uploading Bank Current Statement'
  },
  {
    id: 'SES-20497',
    name: 'Kailash Patel (Proprietor)',
    email: 'kailash@zenithretail.com',
    phone: '+91 98450 67890',
    role: 'CLIENT',
    roleBadge: 'Corporate Client',
    organization: 'Zenith Retail Supermart',
    orgDetail: 'GSTIN: 29AABCZ5512B1Z8 • Bengaluru',
    device: 'Safari • iPadOS 17.5',
    deviceType: 'tablet',
    ip: '106.51.78.33',
    city: 'Bengaluru, Karnataka',
    loginTime: 'Today, 11:20 AM',
    lastActive: 'Active 4m ago',
    status: 'ONLINE',
    isKycVerified: true,
    kycType: 'GST REG-06 Certificate',
    sessionDuration: '40m',
    currentModule: 'Submitting Sales Register & Invoices'
  },
  {
    id: 'SES-10298',
    name: 'Pooja V. (Article Assistant)',
    email: 'pooja.intern@apexca.in',
    phone: '+91 98200 99881',
    role: 'CA',
    roleBadge: 'Audit Article Assistant',
    organization: 'Apex & Partners Chartered Accountants',
    orgDetail: 'Article Trainee Reg # WIR049281',
    device: 'Chrome 124 • Windows 10',
    deviceType: 'desktop',
    ip: '103.21.58.14',
    city: 'Mumbai, Maharashtra',
    loginTime: 'Today, 09:30 AM',
    lastActive: 'Active 1m ago',
    status: 'ONLINE',
    isKycVerified: true,
    kycType: 'ICAI Article Registration Letter',
    sessionDuration: '2h 30m',
    currentModule: 'Groq AI OCR Document Verification'
  },
  {
    id: 'SES-10299',
    name: 'Rohan Mehta (Senior Auditor)',
    email: 'rohan.audit@apexca.in',
    phone: '+91 98200 44332',
    role: 'CA',
    roleBadge: 'Senior Audit Manager',
    organization: 'Apex & Partners Chartered Accountants',
    orgDetail: 'Audit Manager • Mumbai Branch',
    device: 'Chrome 124 • macOS Sonoma',
    deviceType: 'desktop',
    ip: '103.21.58.16',
    city: 'Mumbai, Maharashtra',
    loginTime: 'Today, 09:45 AM',
    lastActive: 'Active 15m ago',
    status: 'ONLINE',
    isKycVerified: true,
    kycType: 'ICAI Membership Proof',
    sessionDuration: '2h 15m',
    currentModule: 'Statutory Audit Report Generator'
  },
  {
    id: 'SES-20500',
    name: 'Deepak Chopra (Director)',
    email: 'accounts@quantumcloud.co',
    phone: '+91 98100 23456',
    role: 'CLIENT',
    roleBadge: 'Corporate Client',
    organization: 'Quantum Cloud Technologies Ltd',
    orgDetail: 'GSTIN: 33AAECQ1122D1Z4 • Chennai',
    device: 'Samsung Internet • Android 14',
    deviceType: 'mobile',
    ip: '157.48.90.112',
    city: 'Chennai, Tamil Nadu',
    loginTime: 'Today, 11:38 AM',
    lastActive: 'Active 3m ago',
    status: 'ONLINE',
    isKycVerified: true,
    kycType: 'Corporate Certificate of Inc.',
    sessionDuration: '22m',
    currentModule: 'Reviewing Statutory Document Request'
  },
  {
    id: 'SES-20501',
    name: 'Sunil Rao (Finance Lead)',
    email: 'finance@raopharmachem.com',
    phone: '+91 98400 98765',
    role: 'CLIENT',
    roleBadge: 'Corporate Client',
    organization: 'Rao PharmaChem Specialties Pvt Ltd',
    orgDetail: 'GSTIN: 36AAECR9988E1Z1 • Hyderabad',
    device: 'Chrome 124 • Windows 11',
    deviceType: 'desktop',
    ip: '183.82.112.50',
    city: 'Hyderabad, Telangana',
    loginTime: 'Today, 10:55 AM',
    lastActive: 'Active 19m ago',
    status: 'ONLINE',
    isKycVerified: true,
    kycType: 'Drug License & GSTIN',
    sessionDuration: '1h 05m',
    currentModule: 'Uploading Form 26AS Tax Credit'
  },
  {
    id: 'SES-10302',
    name: 'CA Neha Agarwal (FCA)',
    email: 'neha@agarwaltax.in',
    phone: '+91 98300 55443',
    role: 'CA',
    roleBadge: 'CA Practice Partner',
    organization: 'Agarwal & Associates Chartered Accountants',
    orgDetail: 'FRN 089123E • Kolkata',
    device: 'Chrome 124 • Windows 11',
    deviceType: 'desktop',
    ip: '115.187.45.66',
    city: 'Kolkata, West Bengal',
    loginTime: 'Today, 11:00 AM',
    lastActive: 'Active 6m ago',
    status: 'ONLINE',
    isKycVerified: true,
    kycType: 'ICAI COP Certificate',
    sessionDuration: '1h 00m',
    currentModule: 'Automated WhatsApp Client Reminders'
  }
];

export default function AdminPortal({ 
  firms, 
  onUpdateFirm,
  onDeleteFirm,
  onSwitchToFirm, 
  onRegisterNewFirm, 
  onBackToHome,
  currentUser,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('firms'); // 'firms' | 'crm' | 'users' | 'overview' | 'subscriptions' | 'system'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('ALL');
  const [editingFirm, setEditingFirm] = useState(null);

  // Live Users & Sessions State
  const [liveUsers, setLiveUsers] = useState(initialLiveUsers);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL'); // 'ALL' | 'CA' | 'CLIENT' | 'ADMIN'
  const [sessionToast, setSessionToast] = useState(null);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Live User Statistics
  const totalLiveUsers = liveUsers.length;
  const caUsersCount = liveUsers.filter(u => u.role === 'CA').length;
  const clientUsersCount = liveUsers.filter(u => u.role === 'CLIENT').length;
  const adminUsersCount = liveUsers.filter(u => u.role === 'ADMIN').length;

  const handleTerminateSession = (userId, userName) => {
    setLiveUsers(prev => prev.filter(u => u.id !== userId));
    setSessionToast(`Forcefully terminated active session for ${userName}. User has been logged out.`);
    setTimeout(() => setSessionToast(null), 4000);
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastModalOpen(false);
      setBroadcastMessage('');
      setSessionToast(`Broadcast dispatched to all ${totalLiveUsers} live users successfully.`);
      setTimeout(() => setSessionToast(null), 4000);
    }, 1200);
  };

  const filteredLiveUsers = liveUsers.filter(u => {
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    const matchesSearch = 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.organization.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.city.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.ip.includes(userSearch) ||
      u.device.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.currentModule.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Platform Aggregate Metrics
  const totalFirms = firms.length;
  const totalClients = firms.reduce((sum, f) => sum + (f.clients?.length || 0), 0);
  const totalRequests = firms.reduce((sum, f) => sum + (f.requests?.length || 0), 0);
  
  // Platform MRR Calculation
  const totalMRR = firms.reduce((sum, f) => {
    const plan = f.subscription?.plan;
    if (plan === 'BUSINESS') return sum + 3999;
    if (plan === 'PROFESSIONAL') return sum + 1999;
    return sum + 999;
  }, 0);

  const filteredFirms = firms.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (f.icaiNumber && f.icaiNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPlan = filterPlan === 'ALL' || f.subscription?.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingFirm) return;
    if (onUpdateFirm) {
      onUpdateFirm(editingFirm);
    }
    setEditingFirm(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="bg-white border-b border-slate-200/90 px-4 sm:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                ClarioLoop SuperAdmin Portal
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                Root Access
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Multi-Tenant Architecture • Platform Health & Tenant CRM
            </p>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2.5">
          {currentUser && (
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-xl text-left">
              <div className="w-6 h-6 rounded-lg bg-rose-600 text-white font-extrabold text-[10px] flex items-center justify-center">
                {currentUser.avatarInitials || 'AD'}
              </div>
              <div className="hidden sm:block">
                <span className="text-[11px] font-bold text-slate-900 block leading-tight">{currentUser.name}</span>
                <span className="text-[9px] font-black text-rose-600 block leading-tight">SUPERADMIN</span>
              </div>
            </div>
          )}
          <button
            onClick={onLogout || onBackToHome}
            className="text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl border border-rose-200 transition-all flex items-center gap-1.5"
            title="Sign out of Admin Session"
          >
            <span>Sign Out</span>
          </button>
          <button
            onClick={onBackToHome}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center gap-1.5"
          >
            <span>Exit Portal</span>
          </button>
        </div>
      </header>

      {/* Subnav Navigation */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar text-xs font-bold shadow-2xs">
        <button
          onClick={() => setActiveTab('firms')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'firms' 
              ? 'border-indigo-600 text-indigo-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4 text-indigo-600" />
          <span>Tenant Practices ({totalFirms})</span>
        </button>

        {/* Live Logged-In Users Tab */}
        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'users' 
              ? 'border-indigo-600 text-indigo-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Live Logged-In Users</span>
          <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-black">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {totalLiveUsers} Online
          </span>
        </button>

        {/* CRM Exclusively under Admin */}
        <button
          onClick={() => setActiveTab('crm')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'crm' 
              ? 'border-indigo-600 text-indigo-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserPlus className="w-4 h-4 text-cyan-600" />
          <span>Client Acquisition CRM (248)</span>
          <span className="text-[9px] bg-cyan-50 text-cyan-800 border border-cyan-200 px-1.5 py-0.2 rounded-full font-black">
            ADMIN ONLY
          </span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'overview' 
              ? 'border-indigo-600 text-indigo-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4 text-indigo-600" />
          <span>Platform Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'subscriptions' 
              ? 'border-indigo-600 text-indigo-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4 text-indigo-600" />
          <span>Revenue & Plans</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'system' 
              ? 'border-indigo-600 text-indigo-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Server className="w-4 h-4 text-indigo-600" />
          <span>Infrastructure & AI Gateway</span>
        </button>
      </div>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 sm:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full space-y-6">

        {/* Global Platform KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Card 1: Live Logged-In Users Counter */}
          <div 
            onClick={() => setActiveTab('users')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group ${
              activeTab === 'users'
                ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-400/20 shadow-sm'
                : 'bg-white border-slate-200/90 hover:border-emerald-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-emerald-700 font-extrabold flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Live Users Online</span>
              </span>
              <span className="flex items-center gap-1 text-[9px] text-emerald-700 font-black bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2 group-hover:text-emerald-600 transition-colors flex items-baseline gap-1.5">
              <span>{totalLiveUsers}</span>
              <span className="text-xs font-bold text-slate-400">logged in</span>
            </div>
            <div className="text-[11px] text-slate-600 font-bold mt-1 truncate">
              {caUsersCount} CAs • {clientUsersCount} Clients • {adminUsersCount} Admin
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Tenant CA Firms</span>
              <Building2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              {totalFirms} Practices
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 100% Tenant Isolation
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Admin CRM Pipeline</span>
              <UserPlus className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              248 Leads
            </div>
            <div className="text-[11px] text-cyan-600 font-bold mt-1">
              ₹12.4L Pipeline Value
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Platform MRR</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              ₹{totalMRR.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 font-bold mt-1">
              Razorpay recurring billing
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl col-span-2 lg:col-span-1 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>AI OCR Gateway</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              99.8% Uptime
            </div>
            <div className="text-[11px] text-purple-600 font-bold mt-1">
              Groq Llama-3.3-70B Active
            </div>
          </div>
        </div>

        {/* TAB 1: TENANT FIRMS MANAGEMENT (WITH EDIT & OPTIONS) */}
        {activeTab === 'firms' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search firms by name, partner, city, or ICAI FRN..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ALL">All Subscription Plans</option>
                  <option value="STARTER">Starter Tier</option>
                  <option value="PROFESSIONAL">Professional Tier</option>
                  <option value="BUSINESS">Business Tier</option>
                </select>

                <button
                  onClick={() => onRegisterNewFirm()}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 transition-all shadow-sm shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add CA Practice</span>
                </button>
              </div>
            </div>

            {/* Firms Table / Card List */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold bg-slate-50/50">
                <span>Displaying {filteredFirms.length} of {firms.length} Tenant Workspaces</span>
                <span>Role: SuperAdministrator</span>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredFirms.map(firm => {
                  return (
                    <div 
                      key={firm.id}
                      className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-base shadow-xs shrink-0"
                          style={{ backgroundColor: firm.brandingColor || '#4f46e5' }}
                        >
                          {firm.logoInitials}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                              {firm.name}
                            </h3>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {firm.subscription?.plan || 'PROFESSIONAL'}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active Tenant
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                            <span>Lead: <strong className="text-slate-800">{firm.partnerName}</strong></span>
                            <span>•</span>
                            <span>{firm.city}</span>
                            <span>•</span>
                            <span className="font-mono text-[11px] text-slate-700">{firm.icaiNumber}</span>
                          </div>

                          <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2">
                            <span>👥 <strong>{firm.clients?.length || 0}</strong> Clients</span>
                            <span>📁 <strong>{firm.requests?.length || 0}</strong> Requests</span>
                            <span>⚡ DB: <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded font-mono">ca_tenant_{firm.id}</code></span>
                          </div>
                        </div>
                      </div>

                      {/* Admin Options & Actions */}
                      <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                        {/* Edit Button */}
                        <button
                          onClick={() => setEditingFirm(firm)}
                          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all border border-slate-200"
                          title="Edit Practice Details & Subscription"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="hidden sm:inline">Edit Firm</span>
                        </button>

                        {/* Open CA Workspace */}
                        <button
                          onClick={() => onSwitchToFirm(firm.id)}
                          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                          title="Impersonate and enter this CA Firm workspace"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>CA Portal</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete/Suspend Option */}
                        {firms.length > 1 && onDeleteFirm && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to suspend/remove tenant ${firm.name}?`)) {
                                onDeleteFirm(firm.id);
                              }
                            }}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors"
                            title="Remove Tenant Firm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLIENT ACQUISITION CRM (ADMIN EXCLUSIVE) */}
        {activeTab === 'crm' && (
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50/70 border border-indigo-200/90 rounded-2xl flex items-center justify-between shadow-xs">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-indigo-600" />
                  <span>Centralized Admin Client Acquisition CRM</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Full lead pipeline, conversion stages, and automated client onboarding to CA practice databases.
                </p>
              </div>
              <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full border border-indigo-200">
                248 Total Inquiries
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden p-2 sm:p-4 shadow-xs">
              <ClientCRMView 
                activeFirm={firms[0]} 
                onConvertToClient={(client) => {
                  alert(`Client "${client.clientName}" converted and registered into CA workspace!`);
                }}
              />
            </div>
          </div>
        )}

        {/* TAB: LIVE LOGGED-IN USERS & SESSIONS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Session Toast Alert */}
            {sessionToast && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 flex items-center justify-between animate-fadeIn shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{sessionToast}</span>
                </div>
                <button onClick={() => setSessionToast(null)} className="text-emerald-600 hover:text-emerald-900">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Top Command Toolbar */}
            <div className="bg-white border border-slate-200/90 p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
                    <span>Real-Time Active User Sessions ({totalLiveUsers})</span>
                  </h3>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-black">
                    100% KYC Verified Sessions
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Live multi-portal telemetry monitoring CA partners, corporate clients uploading documents, and platform staff.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setBroadcastModalOpen(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast System Alert</span>
                </button>

                <button
                  onClick={() => {
                    setSessionToast(`Synchronized real-time heartbeats for all ${totalLiveUsers} active user sessions.`);
                    setTimeout(() => setSessionToast(null), 3500);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all flex items-center gap-1.5"
                  title="Ping Active Sessions"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Refresh Sessions</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div 
                onClick={() => setUserRoleFilter('ALL')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${userRoleFilter === 'ALL' ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 text-slate-900 shadow-xs' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-xs'}`}
              >
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Total Online</span>
                <span className="text-xl font-black text-slate-900 block mt-0.5">{totalLiveUsers} Users</span>
                <span className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-emerald-600" /> All portals active
                </span>
              </div>

              <div 
                onClick={() => setUserRoleFilter('CA')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${userRoleFilter === 'CA' ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 text-slate-900 shadow-xs' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-xs'}`}
              >
                <span className="text-[10px] font-bold text-indigo-600 block uppercase">CA Practice Partners</span>
                <span className="text-xl font-black text-indigo-700 block mt-0.5">{caUsersCount} Online</span>
                <span className="text-[10px] text-slate-500 font-semibold mt-1">Audit & Checklist desks</span>
              </div>

              <div 
                onClick={() => setUserRoleFilter('CLIENT')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${userRoleFilter === 'CLIENT' ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 text-slate-900 shadow-xs' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-xs'}`}
              >
                <span className="text-[10px] font-bold text-emerald-600 block uppercase">Corporate Clients</span>
                <span className="text-xl font-black text-emerald-700 block mt-0.5">{clientUsersCount} Uploading</span>
                <span className="text-[10px] text-slate-500 font-semibold mt-1">Mobile upload vaults</span>
              </div>

              <div 
                onClick={() => setUserRoleFilter('ADMIN')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${userRoleFilter === 'ADMIN' ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-500/20 text-slate-900 shadow-xs' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-xs'}`}
              >
                <span className="text-[10px] font-bold text-rose-600 block uppercase">SuperAdmin Staff</span>
                <span className="text-xl font-black text-rose-700 block mt-0.5">{adminUsersCount} Operator</span>
                <span className="text-[10px] text-slate-500 font-semibold mt-1">Root infrastructure</span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search active users by name, email, firm, company, IP address, device, or city..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
                {userSearch && (
                  <button 
                    onClick={() => setUserSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Role Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  { id: 'ALL', label: `All (${totalLiveUsers})` },
                  { id: 'CA', label: `CAs (${caUsersCount})` },
                  { id: 'CLIENT', label: `Clients (${clientUsersCount})` },
                  { id: 'ADMIN', label: `Admin (${adminUsersCount})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setUserRoleFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                      userRoleFilter === tab.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Directory: Mobile Cards (visible on mobile) + Desktop Table (visible on md+) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
              {/* Mobile Card List (md:hidden) */}
              <div className="md:hidden divide-y divide-slate-100">
                {filteredLiveUsers.map(user => (
                  <div key={user.id} className="p-3.5 space-y-2.5 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center text-white shrink-0 ${
                          user.role === 'ADMIN' ? 'bg-rose-600' : user.role === 'CA' ? 'bg-indigo-600' : 'bg-emerald-600'
                        }`}>
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="font-extrabold text-slate-900 text-xs truncate max-w-[150px]">
                              {user.name}
                            </span>
                            {user.isKycVerified && (
                              <span className="text-[8px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded-full inline-flex items-center gap-0.5">
                                <ShieldCheck className="w-2.5 h-2.5" /> KYC
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {user.email}
                          </span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 ${
                        user.role === 'ADMIN'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : user.role === 'CA'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {user.role}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80">
                      <div>
                        <span className="text-slate-400 block text-[9px]">Organization</span>
                        <strong className="text-slate-800 truncate block">{user.organization}</strong>
                        <span className="text-slate-500 text-[9px] font-mono truncate block">{user.orgDetail}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Device & IP</span>
                        <div className="text-slate-700 flex items-center gap-1 truncate">
                          {user.deviceType === 'mobile' ? (
                            <Smartphone className="w-3 h-3 text-emerald-600 shrink-0" />
                          ) : (
                            <Monitor className="w-3 h-3 text-indigo-600 shrink-0" />
                          )}
                          <span className="truncate">{user.city}</span>
                        </div>
                        <span className="text-slate-500 font-mono text-[9px] block">{user.ip}</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-slate-200/60">
                        <span className="text-slate-400 block text-[9px]">Active Workflow Task</span>
                        <span className="text-indigo-600 font-bold truncate block">⚡ {user.currentModule}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Online: {user.sessionDuration} ({user.lastActive})</span>
                      </span>
                      <button
                        onClick={() => handleTerminateSession(user.id, user.name)}
                        className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[10px] transition-all inline-flex items-center gap-1"
                        title="Force logout"
                      >
                        <LogOut className="w-3 h-3 text-rose-600" />
                        <span>Terminate</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table (hidden md:block) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">Live User Identity</th>
                      <th className="py-3.5 px-4">Portal & Role</th>
                      <th className="py-3.5 px-4">Organization / Identifier</th>
                      <th className="py-3.5 px-4">Device & IP Address</th>
                      <th className="py-3.5 px-4">Active Workflow / Ping</th>
                      <th className="py-3.5 px-4 text-right">Admin Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLiveUsers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50/70 transition-colors group">
                        {/* 1. User Identity */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <div className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center text-white shadow-xs ${
                                user.role === 'ADMIN' ? 'bg-rose-600' : user.role === 'CA' ? 'bg-indigo-600' : 'bg-emerald-600'
                              }`}>
                                {user.name.slice(0, 2).toUpperCase()}
                              </div>
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" title="Online Live" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-extrabold text-slate-900 text-xs block leading-tight">
                                  {user.name}
                                </span>
                                {user.isKycVerified && (
                                  <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full inline-flex items-center gap-0.5">
                                    <ShieldCheck className="w-2.5 h-2.5" /> KYC VERIFIED
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                                {user.email} • {user.phone}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Portal & Role */}
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider inline-block ${
                            user.role === 'ADMIN'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : user.role === 'CA'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {user.roleBadge}
                          </span>
                        </td>

                        {/* 3. Organization & Identifier */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-800 truncate max-w-[200px]">
                            {user.organization}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                            {user.orgDetail}
                          </span>
                        </td>

                        {/* 4. Device & IP Address */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            {user.deviceType === 'mobile' ? (
                              <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <Monitor className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            )}
                            <span className="truncate max-w-[180px]">{user.device}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5 flex items-center gap-1">
                            <Globe className="w-2.5 h-2.5 text-slate-400" />
                            <span>{user.ip} • {user.city}</span>
                          </span>
                        </td>

                        {/* 5. Active Workflow / Ping */}
                        <td className="py-4 px-4">
                          <div className="text-slate-800 font-bold truncate max-w-[190px]">
                            {user.currentModule}
                          </div>
                          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{user.lastActive} (Session: {user.sessionDuration})</span>
                          </div>
                        </td>

                        {/* 6. Admin Actions */}
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleTerminateSession(user.id, user.name)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 border border-rose-200 font-bold text-[11px] transition-all inline-flex items-center gap-1 shadow-2xs"
                            title="Force logout and revoke user access"
                          >
                            <LogOut className="w-3 h-3 text-rose-600" />
                            <span>Terminate</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredLiveUsers.length === 0 && (
                <div className="py-12 text-center text-slate-500">
                  <Users className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-50" />
                  <p className="font-bold text-sm">No active user sessions matched "{userSearch}"</p>
                  <button 
                    onClick={() => { setUserSearch(''); setUserRoleFilter('ALL'); }}
                    className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
                  >
                    Reset Search & Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span>Tenant Data Isolation Status</span>
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every CA firm operates on a strictly partitioned tenant architecture. No firm can view clients, GSTINs, or uploaded document tokens of any other firm.
                </p>
                <div className="space-y-2 text-xs">
                  {firms.map(f => (
                    <div key={f.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <strong className="text-slate-900 block">{f.name}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">Partition ID: tenant_{f.id}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Encrypted & Isolated
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-600" />
                  <span>System Resource Allocation</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Total Document Storage Used</span>
                      <strong className="text-slate-900">1.84 GB / 500 GB</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full w-[12%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Groq OCR Token Budget (Monthly)</span>
                      <strong className="text-slate-900">4.2M / 50M tokens</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-rose-500 h-full w-[24%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>WhatsApp Notification Queue</span>
                      <strong className="text-emerald-600 font-bold">Active (0 stalled)</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[100%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SUBSCRIPTIONS & REVENUE */}
        {activeTab === 'subscriptions' && (
          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-black text-slate-900">Razorpay Multi-Tenant Billing Stream</h3>
              <p className="text-xs text-slate-500">Live subscription plans managed by practice tier</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold block">Starter Tier</span>
                <span className="text-xl font-black text-slate-900 block mt-1">₹999 / mo</span>
                <span className="text-[11px] text-slate-500 mt-2 block">Up to 10 active clients</span>
              </div>
              <div className="p-4 bg-indigo-50/60 rounded-xl border-2 border-indigo-500 ring-1 ring-indigo-500/20 shadow-xs">
                <span className="text-indigo-700 font-bold block">Professional Tier (Most Popular)</span>
                <span className="text-xl font-black text-indigo-900 block mt-1">₹1,999 / mo</span>
                <span className="text-[11px] text-indigo-600 font-semibold mt-2 block">Up to 30 active clients + AI OCR</span>
              </div>
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200">
                <span className="text-purple-700 font-bold block">Business Tier</span>
                <span className="text-xl font-black text-slate-900 block mt-1">₹3,999 / mo</span>
                <span className="text-[11px] text-slate-500 mt-2 block">Up to 100 active clients + custom domain</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: INFRASTRUCTURE & GATEWAYS */}
        {activeTab === 'system' && (
          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" />
              <span>Core Microservices & API Integrations</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 block">Groq Cloud AI OCR Engine</strong>
                  <span className="text-[10px] text-slate-500">Model: llama-3.3-70b-versatile</span>
                </div>
                <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">CONNECTED</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 block">Razorpay Payment Gateway</strong>
                  <span className="text-[10px] text-slate-500">UPI, QR Code, NetBanking, Cards</span>
                </div>
                <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">VERIFIED</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================= EDIT FIRM MODAL ================= */}
      {editingFirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs text-slate-700">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Edit CA Tenant Practice</h3>
                  <span className="text-[10px] text-slate-500 font-mono">ID: {editingFirm.id}</span>
                </div>
              </div>
              <button 
                onClick={() => setEditingFirm(null)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Firm Name *</label>
                <input
                  type="text"
                  required
                  value={editingFirm.name}
                  onChange={(e) => setEditingFirm({ ...editingFirm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lead Partner Name *</label>
                  <input
                    type="text"
                    required
                    value={editingFirm.partnerName}
                    onChange={(e) => setEditingFirm({ ...editingFirm, partnerName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">City / Location *</label>
                  <input
                    type="text"
                    required
                    value={editingFirm.city}
                    onChange={(e) => setEditingFirm({ ...editingFirm, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ICAI Reg / FRN</label>
                  <input
                    type="text"
                    value={editingFirm.icaiNumber || ''}
                    onChange={(e) => setEditingFirm({ ...editingFirm, icaiNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subscription Plan</label>
                  <select
                    value={editingFirm.subscription?.plan || 'PROFESSIONAL'}
                    onChange={(e) => setEditingFirm({
                      ...editingFirm,
                      subscription: {
                        ...editingFirm.subscription,
                        plan: e.target.value
                      }
                    })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  >
                    <option value="STARTER">STARTER (₹999/mo)</option>
                    <option value="PROFESSIONAL">PROFESSIONAL (₹1,999/mo)</option>
                    <option value="BUSINESS">BUSINESS (₹3,999/mo)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Branding Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={editingFirm.brandingColor || '#4f46e5'}
                    onChange={(e) => setEditingFirm({ ...editingFirm, brandingColor: e.target.value })}
                    className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer p-0.5"
                  />
                  <span className="font-mono text-slate-600">{editingFirm.brandingColor || '#4f46e5'}</span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingFirm(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= BROADCAST SYSTEM ALERT MODAL ================= */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs text-slate-700">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <Send className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Broadcast Alert to All Active Users</h3>
                  <span className="text-[10px] text-slate-500">Delivered in real-time to {totalLiveUsers} live logged-in sessions</span>
                </div>
              </div>
              <button 
                onClick={() => setBroadcastModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Message Content *</label>
                <textarea
                  rows={4}
                  required
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="e.g. System notice: Scheduled GST portal sync will run at 2:00 AM IST. Please ensure pending uploads are saved."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-xs leading-relaxed"
                />
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-[11px] text-indigo-900 space-y-1">
                <span className="font-bold block text-indigo-950">Delivery Targets:</span>
                <span>• {caUsersCount} Chartered Accountant Practice Partners</span>
                <br />
                <span>• {clientUsersCount} Corporate Clients active in Upload Portal</span>
                <br />
                <span>• {adminUsersCount} SuperAdmin Operator</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBroadcastModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={broadcastSent}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{broadcastSent ? 'Sending...' : 'Send Broadcast Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
