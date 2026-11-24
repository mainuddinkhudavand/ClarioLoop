import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Filter, 
  Plus, 
  Search, 
  FileText, 
  ExternalLink, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Send,
  Zap,
  Building2,
  FileCheck2,
  Layers,
  Award
} from 'lucide-react';
import { crmDashboardMetrics, crmPipelineStages, mockCrmLeads, crmSaaSPackages, industryWorkflows } from '../data/mockData';

export default function ClientCRMView({ activeFirm, onConvertToClient, onBack }) {
  const [leads, setLeads] = useState(mockCrmLeads);
  const [activeStageFilter, setActiveStageFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [selectedLeadForAI, setSelectedLeadForAI] = useState(null);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState(null);
  const [actionSuccessNotice, setActionSuccessNotice] = useState(null);

  // New Lead Form State
  const [newLead, setNewLead] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    industry: 'Finance & Accounting',
    serviceRequired: 'Monthly GST & Bookkeeping Compliance',
    expectedValue: '35000',
    source: 'Website Form',
    priority: 'HIGH'
  });

  // Filter leads
  const filteredLeads = leads.filter(l => {
    const matchesStage = activeStageFilter === 'ALL' || l.stage === activeStageFilter;
    const matchesSearch = l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.serviceRequired.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  // Add Lead
  const handleCreateLead = (e) => {
    e.preventDefault();
    if (!newLead.companyName || !newLead.contactPerson) return;

    const leadObj = {
      id: 'lead-' + Date.now(),
      companyName: newLead.companyName,
      contactPerson: newLead.contactPerson,
      email: newLead.email,
      phone: newLead.phone,
      industry: newLead.industry,
      serviceRequired: newLead.serviceRequired,
      expectedValue: parseInt(newLead.expectedValue) || 25000,
      source: newLead.source,
      stage: 'NEW',
      priority: newLead.priority,
      aiScore: 85,
      aiCategory: 'Hot Prospect',
      aiSummary: 'Fresh inbound lead captured. High potential for recurring compliance retainer.',
      followUpDue: 'Tomorrow, 10:00 AM',
      isOverdue: false,
      assignedTo: activeFirm?.partnerName || 'CA Partner',
      createdDate: new Date().toISOString().split('T')[0],
      notes: 'Captured via Client Acquisition CRM module.',
      interactions: []
    };

    setLeads([leadObj, ...leads]);
    setShowAddLeadModal(false);
    setActionSuccessNotice(`Lead "${newLead.companyName}" successfully captured!`);
    setTimeout(() => setActionSuccessNotice(null), 4000);
    setNewLead({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      industry: 'Finance & Accounting',
      serviceRequired: 'Monthly GST & Bookkeeping Compliance',
      expectedValue: '35000',
      source: 'Website Form',
      priority: 'HIGH'
    });
  };

  // Move Lead Stage
  const handleMoveStage = (leadId, newStage) => {
    setLeads(leads.map(l => l.id === leadId ? { ...l, stage: newStage } : l));
  };

  // Convert Lead to Document Collection Client (Proposal Step 5)
  const handleConvertLeadToWorkflow = (lead) => {
    handleMoveStage(lead.id, 'CONVERTED');
    if (onConvertToClient) {
      onConvertToClient({
        id: 'c-' + Date.now(),
        businessName: lead.companyName,
        contactPerson: lead.contactPerson,
        email: lead.email,
        phone: lead.phone,
        entityType: 'Private Limited',
        industry: lead.industry,
        assignedStaff: lead.assignedTo,
        missingCount: 3
      });
    }
    setActionSuccessNotice(`🎉 Successfully converted "${lead.companyName}" into an active client! Document collection workspace launched.`);
    setTimeout(() => setActionSuccessNotice(null), 5000);
  };

  // Quick Action Dispatch (WhatsApp, Call, Email)
  const handleAction = (type, lead) => {
    if (type === 'whatsapp') {
      const msg = `Hello ${lead.contactPerson}, this is ${activeFirm?.name || 'Cloop'}. Following up regarding your enquiry for ${lead.serviceRequired}. When would be a good time to connect?`;
      window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
      setActionSuccessNotice(`Dispatched WhatsApp follow-up to ${lead.contactPerson}`);
    } else if (type === 'call') {
      window.open(`tel:${lead.phone}`, '_self');
      setActionSuccessNotice(`Call initiated with ${lead.contactPerson}`);
    } else if (type === 'email') {
      window.open(`mailto:${lead.email}?subject=${encodeURIComponent('Engagement Proposal - ' + lead.serviceRequired)}`, '_blank');
      setActionSuccessNotice(`Drafted email for ${lead.email}`);
    }
    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      
      {/* 1. Header Banner & Proposal Title */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl border border-indigo-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors shrink-0"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Client Acquisition CRM Module</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              From First Enquiry to Final Document.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Capture prospects, qualify leads, schedule follow-ups, and seamlessly 1-click convert won deals into ClarioLoop document collection workflows.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddLeadModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Capture New Lead</span>
            </button>
          </div>
        </div>

        {/* ================= 4 METRICS FROM THE PROPOSAL DASHBOARD CONCEPT ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          
          {/* Metric 1: Total Leads */}
          <div className="bg-slate-800/70 p-3 sm:p-4 rounded-2xl border border-slate-700/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Total Leads</span>
              <span className="w-2 h-2 rounded-full bg-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1.5">
              {crmDashboardMetrics.totalLeads}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">All prospects in workspace</span>
          </div>

          {/* Metric 2: Follow-ups Due */}
          <div className="bg-slate-800/70 p-3 sm:p-4 rounded-2xl border border-slate-700/80">
            <div className="flex items-center justify-between text-amber-300 text-xs font-semibold">
              <span>Follow-ups Due</span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1.5">
              {crmDashboardMetrics.followUpsDue}
            </div>
            <span className="text-[11px] text-amber-400/80 mt-0.5 block">Tasks requiring attention</span>
          </div>

          {/* Metric 3: Converted Clients */}
          <div className="bg-slate-800/70 p-3 sm:p-4 rounded-2xl border border-slate-700/80">
            <div className="flex items-center justify-between text-emerald-300 text-xs font-semibold">
              <span>Converted Clients</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1.5">
              {crmDashboardMetrics.convertedClients}
            </div>
            <span className="text-[11px] text-emerald-400/80 mt-0.5 block">Prospects converted to clients</span>
          </div>

          {/* Metric 4: Potential Revenue */}
          <div className="bg-slate-800/70 p-3 sm:p-4 rounded-2xl border border-slate-700/80">
            <div className="flex items-center justify-between text-cyan-300 text-xs font-semibold">
              <span>Potential Revenue</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-300 mt-1.5">
              {crmDashboardMetrics.potentialRevenue}
            </div>
            <span className="text-[11px] text-cyan-400/80 mt-0.5 block">Estimated pipeline value</span>
          </div>

        </div>
      </div>

      {/* Success Notice Banner */}
      {actionSuccessNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs sm:text-sm text-emerald-900 font-semibold flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessNotice}</span>
        </div>
      )}

      {/* 2. End-to-End Client Journey Progress Bar (Section 3 of PDF) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
          End-to-End Client Lifecycle Journey (From Proposal Section 3):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
            <strong className="block text-[11px] font-black">1. Capture Lead</strong>
            <span className="text-[10px] text-blue-700">Web forms, WhatsApp, CSV import</span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900">
            <strong className="block text-[11px] font-black">2. Qualify</strong>
            <span className="text-[10px] text-purple-700">Industry, priority & AI score</span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900">
            <strong className="block text-[11px] font-black">3. Follow Up</strong>
            <span className="text-[10px] text-indigo-700">WhatsApp, Call & Task logs</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
            <strong className="block text-[11px] font-black">4. Convert</strong>
            <span className="text-[10px] text-amber-700">Proposals, negotiation & value</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 col-span-2 sm:col-span-1">
            <strong className="block text-[11px] font-black">5. Document Workflow</strong>
            <span className="text-[10px] text-emerald-700 font-bold">1-Click Client Onboarding</span>
          </div>
        </div>
      </div>

      {/* 3. Search & Pipeline Stage Tabs (Scrollable on mobile) */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads by company name, contact person, or required service..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <span className="text-xs text-slate-500 font-bold self-center">
            {filteredLeads.length} Leads Displayed
          </span>
        </div>

        {/* Pipeline Stage Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setActiveStageFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all ${
              activeStageFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Leads ({leads.length})
          </button>

          {crmPipelineStages.map(stage => {
            const stageCount = leads.filter(l => l.stage === stage.id).length;
            const isSelected = activeStageFilter === stage.id;

            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageFilter(stage.id)}
                className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{stage.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {stageCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Leads List / Cards (Mobile-friendly Stack) */}
      <div className="space-y-3">
        {filteredLeads.length === 0 ? (
          <div className="bg-white p-12 text-center text-slate-400 rounded-2xl border border-slate-200">
            <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-sm text-slate-700">No leads match this stage filter</p>
            <p className="text-xs text-slate-500 mt-1">Tap "Capture New Lead" to add prospects to your pipeline.</p>
          </div>
        ) : (
          filteredLeads.map(lead => {
            const stageConfig = crmPipelineStages.find(s => s.id === lead.stage) || crmPipelineStages[0];
            const isConverted = lead.stage === 'CONVERTED';

            return (
              <div 
                key={lead.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all space-y-3"
              >
                {/* Header: Company, Stage Badge & Value */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                        {lead.companyName}
                      </h3>
                      
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${stageConfig.lightColor}`}>
                        {stageConfig.name}
                      </span>

                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {lead.industry}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1">
                      Contact: <strong>{lead.contactPerson}</strong> • {lead.email} • {lead.phone}
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                      Expected Value
                    </span>
                    <span className="text-base sm:text-lg font-black text-slate-900">
                      ₹{lead.expectedValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Service Requirement & AI Lead Insights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Service Required:
                    </span>
                    <strong className="text-slate-800 text-xs block leading-snug">
                      {lead.serviceRequired}
                    </strong>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Lead Source: {lead.source}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Follow-Up Schedule:
                      </span>
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Clock className={`w-3.5 h-3.5 ${lead.isOverdue ? 'text-rose-500' : 'text-indigo-600'}`} />
                        <span className={lead.isOverdue ? 'text-rose-600' : 'text-slate-800'}>
                          {lead.followUpDue}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Assigned: {lead.assignedTo}
                    </span>
                  </div>

                  {/* AI Scoring Pill */}
                  <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-indigo-700">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-600" /> AI Lead Scoring
                        </span>
                        <span>{lead.aiScore}% Match</span>
                      </div>
                      <p className="text-[11px] text-indigo-900 font-medium mt-1 line-clamp-2 leading-relaxed">
                        {lead.aiSummary}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedLeadForAI(lead)}
                      className="text-[10px] font-extrabold text-indigo-700 hover:text-indigo-900 underline mt-1 text-left"
                    >
                      ✨ Generate AI Pitch & Notes →
                    </button>
                  </div>
                </div>

                {/* Communication & Conversion Action Strip */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  {/* Communication Buttons (Click-to-Call, WhatsApp, Email) */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction('whatsapp', lead)}
                      className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors"
                      title="Chat on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={() => handleAction('call', lead)}
                      className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors"
                      title="Call Lead"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>Call</span>
                    </button>

                    <button
                      onClick={() => handleAction('email', lead)}
                      className="flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors"
                      title="Email Proposal"
                    >
                      <Mail className="w-3.5 h-3.5 text-purple-600" />
                      <span>Email</span>
                    </button>
                  </div>

                  {/* Stage Mover & Seamless Conversion to Document Workflow */}
                  <div className="flex items-center gap-2">
                    <select
                      value={lead.stage}
                      onChange={(e) => handleMoveStage(lead.id, e.target.value)}
                      className="p-1.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-800"
                    >
                      {crmPipelineStages.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>

                    {/* Step 5: Convert Lead to Client Workflow Bridge */}
                    {!isConverted ? (
                      <button
                        onClick={() => handleConvertLeadToWorkflow(lead)}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs shadow-md transition-all transform hover:-translate-y-0.5"
                        title="1-Click Convert into Active Document Workflow"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Convert to Client</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
                        ✓ Active Client Workspace
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* 5. Recommended SaaS Packaging Strip (Section 6 & 7 of Proposal) */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 space-y-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-800">
            Modular SaaS Architecture
          </span>
          <h3 className="text-base sm:text-lg font-black text-white mt-1.5">
            Subscribe to CRM Alone, Document Automation Alone, or Combined
          </h3>
          <p className="text-xs text-slate-400">
            Separate modules operating on a shared secure customer database with strict tenant-level isolation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {crmSaaSPackages.map(pkg => (
            <div 
              key={pkg.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                pkg.recommended 
                  ? 'bg-indigo-950/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/30' 
                  : 'bg-slate-800/70 border-slate-700/80'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white/10 text-white">
                    {pkg.badge}
                  </span>
                  <span className="text-base font-black text-white">{pkg.priceINR}</span>
                </div>
                <h4 className="font-extrabold text-sm text-white">{pkg.name}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">{pkg.description}</p>
                
                <ul className="space-y-1.5 pt-2 border-t border-slate-700/60 text-[11px] text-slate-300">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => alert(`Subscribed to ${pkg.name}!`)}
                className={`mt-4 w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                  pkg.recommended 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' 
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                Choose {pkg.name.split(' ')[0]}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL: ADD NEW PROSPECT LEAD ================= */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-900 text-base">Capture New Prospect Lead</h3>
              </div>
              <button onClick={() => setShowAddLeadModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={newLead.companyName}
                    onChange={(e) => setNewLead({ ...newLead, companyName: e.target.value })}
                    placeholder="e.g. Apex Biotech Pvt Ltd"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={newLead.contactPerson}
                    onChange={(e) => setNewLead({ ...newLead, contactPerson: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="accounts@company.in"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Industry Sector</label>
                  <select
                    value={newLead.industry}
                    onChange={(e) => setNewLead({ ...newLead, industry: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
                  >
                    {industryWorkflows.map(wf => (
                      <option key={wf.id} value={wf.name}>{wf.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Expected Deal Value (₹)</label>
                  <input
                    type="number"
                    value={newLead.expectedValue}
                    onChange={(e) => setNewLead({ ...newLead, expectedValue: e.target.value })}
                    placeholder="45000"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Service Required / Engagement Scope</label>
                <input
                  type="text"
                  value={newLead.serviceRequired}
                  onChange={(e) => setNewLead({ ...newLead, serviceRequired: e.target.value })}
                  placeholder="e.g. Monthly GST Filing, ROC Annual Filing"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
                >
                  Save & Add to Pipeline
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL: GROQ AI LEAD PITCH & SCORING ================= */}
      {selectedLeadForAI && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Groq AI Lead Intelligence</h3>
                  <span className="text-[10px] text-slate-500 font-medium">Model: Groq LLaMA-3.3-70B</span>
                </div>
              </div>
              <button onClick={() => setSelectedLeadForAI(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div>Prospect: <strong>{selectedLeadForAI.companyName}</strong></div>
                <div>Contact: <strong>{selectedLeadForAI.contactPerson}</strong> ({selectedLeadForAI.phone})</div>
                <div>Target Scope: <strong>{selectedLeadForAI.serviceRequired}</strong></div>
                <div>Expected Value: <strong className="text-indigo-600">₹{selectedLeadForAI.expectedValue.toLocaleString('en-IN')}</strong></div>
              </div>

              {/* AI Pitch Draft */}
              <div className="p-3.5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800 block">
                  ✨ AI-Drafted High-Conversion WhatsApp Pitch:
                </span>
                <p className="text-slate-700 font-mono text-[11px] leading-relaxed bg-white p-3 rounded-xl border border-indigo-100">
                  {`"Hello ${selectedLeadForAI.contactPerson}! We noticed your firm is scaling ${selectedLeadForAI.industry} operations. At ${activeFirm?.name || 'our practice'}, we eliminate document chasing with automated WhatsApp submission links. Would you be open to a 10-minute briefing on automating your ${selectedLeadForAI.serviceRequired}?"`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedLeadForAI(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleAction('whatsapp', selectedLeadForAI);
                  setSelectedLeadForAI(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Send via WhatsApp Now</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
