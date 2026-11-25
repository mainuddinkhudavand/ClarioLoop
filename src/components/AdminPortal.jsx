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
  UserCheck
} from 'lucide-react';

export default function AdminPortal({ 
  firms, 
  onSwitchToFirm, 
  onRegisterNewFirm, 
  onBackToHome 
}) {
  const [activeTab, setActiveTab] = useState('firms'); // 'overview' | 'firms' | 'subscriptions' | 'system'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('ALL');
  const [selectedFirmDetail, setSelectedFirmDetail] = useState(null);

  // Platform Aggregate Metrics
  const totalFirms = firms.length;
  const totalClients = firms.reduce((sum, f) => sum + (f.clients?.length || 0), 0);
  const totalRequests = firms.reduce((sum, f) => sum + (f.requests?.length || 0), 0);
  const activeFirms = firms.filter(f => f.subscription?.status === 'ACTIVE' || f.subscription?.status === 'TRIAL').length;
  
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                ClarioLoop SuperAdmin Portal
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full">
                Root Access
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Multi-Tenant Architecture • Platform Health & Subscriptions
            </p>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBackToHome}
            className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <span>Exit Portal</span>
          </button>
        </div>
      </header>

      {/* Subnav Navigation */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-8 flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar text-xs font-bold">
        <button
          onClick={() => setActiveTab('firms')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'firms' 
              ? 'border-indigo-500 text-indigo-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Tenant Firms ({totalFirms})</span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'overview' 
              ? 'border-indigo-500 text-indigo-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Platform Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'subscriptions' 
              ? 'border-indigo-500 text-indigo-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Revenue & Plans</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`py-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'system' 
              ? 'border-indigo-500 text-indigo-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Infrastructure & AI Gateway</span>
        </button>
      </div>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">

        {/* Global Platform KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Total CA Firms</span>
              <Building2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-2">
              {totalFirms} Practices
            </div>
            <div className="text-[11px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 100% Tenant Isolation
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Total Client Base</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-2">
              {totalClients} Registered
            </div>
            <div className="text-[11px] text-cyan-400 font-bold mt-1">
              Active document consumers
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Platform MRR</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-2">
              ₹{totalMRR.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 font-bold mt-1">
              Razorpay recurring billing
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>OCR & AI Gateway</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-purple-300 mt-2">
              99.8% Uptime
            </div>
            <div className="text-[11px] text-purple-400 font-bold mt-1">
              Groq Llama-3.3-70B Active
            </div>
          </div>
        </div>

        {/* TAB 1: TENANT FIRMS MANAGEMENT */}
        {activeTab === 'firms' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search firms by name, partner, city, or ICAI FRN..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">All Subscription Plans</option>
                  <option value="STARTER">Starter Tier</option>
                  <option value="PROFESSIONAL">Professional Tier</option>
                  <option value="BUSINESS">Business Tier</option>
                </select>

                <button
                  onClick={() => onRegisterNewFirm()}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 transition-all shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add CA Practice</span>
                </button>
              </div>
            </div>

            {/* Firms Table / Card List */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>Displaying {filteredFirms.length} of {firms.length} Tenant Workspaces</span>
                <span>Role: SuperAdministrator</span>
              </div>

              <div className="divide-y divide-slate-800">
                {filteredFirms.map(firm => {
                  return (
                    <div 
                      key={firm.id}
                      className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-base shadow-sm shrink-0"
                          style={{ backgroundColor: firm.brandingColor || '#4f46e5' }}
                        >
                          {firm.logoInitials}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                              {firm.name}
                            </h3>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {firm.subscription?.plan || 'PROFESSIONAL'}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Active Tenant
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                            <span>Lead: <strong className="text-slate-200">{firm.partnerName}</strong></span>
                            <span>•</span>
                            <span>{firm.city}</span>
                            <span>•</span>
                            <span className="font-mono text-[11px] text-slate-300">{firm.icaiNumber}</span>
                          </div>

                          <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2">
                            <span>👥 <strong>{firm.clients?.length || 0}</strong> Clients Registered</span>
                            <span>📁 <strong>{firm.requests?.length || 0}</strong> Request Batches</span>
                            <span>⚡ Isolated DB Partition: <code className="text-indigo-400">ca_tenant_{firm.id}</code></span>
                          </div>
                        </div>
                      </div>

                      {/* Admin Actions */}
                      <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                        <button
                          onClick={() => onSwitchToFirm(firm.id)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30"
                          title="Impersonate and enter this CA Firm workspace"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Open CA Portal</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-400" />
                  <span>Tenant Data Isolation Status</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every CA firm operates on a strictly partitioned tenant architecture. No firm can view clients, GSTINs, or uploaded document tokens of any other firm.
                </p>
                <div className="space-y-2 text-xs">
                  {firms.map(f => (
                    <div key={f.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <strong className="text-white block">{f.name}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">Partition ID: tenant_{f.id}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                        Encrypted & Isolated
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span>System Resource Allocation</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Total Document Storage Used</span>
                      <strong className="text-white">1.84 GB / 500 GB</strong>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-[12%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Groq OCR Token Budget (Monthly)</span>
                      <strong className="text-white">4.2M / 50M tokens</strong>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-rose-500 h-full w-[24%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>WhatsApp Notification Queue</span>
                      <strong className="text-emerald-400">Active (0 stalled)</strong>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[100%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SUBSCRIPTIONS & REVENUE */}
        {activeTab === 'subscriptions' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
            <div>
              <h3 className="text-base font-black text-white">Razorpay Multi-Tenant Billing Stream</h3>
              <p className="text-xs text-slate-400">Live subscription plans managed by practice tier</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Starter Tier</span>
                <span className="text-xl font-black text-white block mt-1">₹999 / mo</span>
                <span className="text-[11px] text-slate-500 mt-2 block">Up to 10 active clients</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-indigo-900/60 ring-1 ring-indigo-500/30">
                <span className="text-indigo-400 font-bold block">Professional Tier (Most Popular)</span>
                <span className="text-xl font-black text-white block mt-1">₹1,999 / mo</span>
                <span className="text-[11px] text-slate-500 mt-2 block">Up to 30 active clients + AI OCR</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-purple-400 font-bold block">Business Tier</span>
                <span className="text-xl font-black text-white block mt-1">₹3,999 / mo</span>
                <span className="text-[11px] text-slate-500 mt-2 block">Up to 100 active clients + custom domain</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INFRASTRUCTURE & GATEWAYS */}
        {activeTab === 'system' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 text-xs">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Core Microservices & API Integrations</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-white block">Groq Cloud AI OCR Engine</strong>
                  <span className="text-[10px] text-slate-500">Model: llama-3.3-70b-versatile</span>
                </div>
                <span className="text-emerald-400 font-bold text-[10px]">CONNECTED</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-white block">Razorpay Payment Gateway</strong>
                  <span className="text-[10px] text-slate-500">UPI, QR Code, NetBanking, Cards</span>
                </div>
                <span className="text-emerald-400 font-bold text-[10px]">VERIFIED</span>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
