import React, { useState } from 'react';
import { 
  Users, 
  FileClock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  Send, 
  Plus, 
  Calendar, 
  Sparkles, 
  ExternalLink, 
  Clock,
  Building2,
  FileSearch,
  Check,
  TrendingUp,
  AlertCircle,
  Smartphone,
  RefreshCw,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { complianceDeadlines } from '../data/mockData';

export default function Dashboard({ 
  activeFirm, 
  onNewRequest, 
  onOpenPortal, 
  onOpenReminders,
  onOpenFirmSwitcher,
  onOpenCRM,
  onNavigateTab,
  onReviewRequestItem,
  onAskClarification,
  onCloneMonthlyRequests,
  onToggleAutoRecurring
}) {
  const clients = activeFirm?.clients || [];
  const requests = activeFirm?.requests || [];

  const [filterMissingOnly, setFilterMissingOnly] = useState(false);
  const [partnerQueueOnly, setPartnerQueueOnly] = useState(false);
  const [queryItemId, setQueryItemId] = useState(null);
  const [queryDraft, setQueryDraft] = useState('');
  const [nudgeSuccess, setNudgeSuccess] = useState(null);

  const pendingRequests = requests.filter(r => r.status !== 'COMPLETE');
  const completedRequests = requests.filter(r => r.status === 'COMPLETE');
  const overdueRequests = requests.filter(r => r.status === 'OVERDUE');

  // Live KPI metrics derived directly from activeFirm.requests
  const allItems = requests.flatMap(r => r.items || []);
  const totalRequests = requests.length;
  const totalCompleted = requests.filter(r => r.status === 'COMPLETE').length;
  const totalPending = requests.filter(r => r.status !== 'COMPLETE').length;
  const totalMissing = allItems.filter(i => i.status === 'PENDING' || i.status === 'REJECTED').length;
  const totalVerifiedDocs = allItems.filter(i => i.status === 'VERIFIED').length;
  const totalSubmittedDocs = allItems.filter(i => i.status === 'SUBMITTED').length;
  const progressPct = allItems.length > 0
    ? Math.round(((totalVerifiedDocs + totalSubmittedDocs) / allItems.length) * 100)
    : 0;

  const handleNudgeMissing = (clientName, count) => {
    setNudgeSuccess(`Dispatched automated reminder to ${clientName} for ${count} missing document(s).`);
    setTimeout(() => setNudgeSuccess(null), 4000);
  };

  const displayedRequests = requests.filter(r => {
    if (filterMissingOnly && r.status === 'COMPLETE') return false;
    if (partnerQueueOnly) {
      return (r.items || []).some(
        i => (i.status === 'SUBMITTED' || i.status === 'VERIFIED') && i.reviewStage !== 'PARTNER_SIGNED'
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Compact Practice Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-base sm:text-lg font-black text-slate-900">
          Practice Overview
        </h1>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <button
            onClick={onNewRequest}
            className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Request</span>
          </button>
          <button
            onClick={onOpenReminders}
            className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Send className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Reminders</span>
          </button>
          {onCloneMonthlyRequests && (
            <button
              onClick={() => {
                onCloneMonthlyRequests();
                setNudgeSuccess('Cloned monthly GST/TDS checklist for all active clients for next period!');
                setTimeout(() => setNudgeSuccess(null), 4000);
              }}
              className="flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-bold transition-all"
              title="Clone last month's GST & TDS requests for all clients in 1 click"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Clone Monthly</span>
            </button>
          )}
          {onToggleAutoRecurring && (
            <label
              className="inline-flex items-center gap-2.5 cursor-pointer bg-slate-100 hover:bg-slate-200/70 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold select-none transition-all"
              title="Automatically schedule monthly GST/TDS requests on the 1st of every month"
            >
              <input
                type="checkbox"
                checked={!!activeFirm?.autoRecurringMonthly}
                onChange={onToggleAutoRecurring}
                className="sr-only"
              />
              <span>Auto-Schedule</span>
              <span
                className={`relative inline-flex h-5 w-10 shrink-0 items-center rounded-full transition-colors duration-200 ${
                  activeFirm?.autoRecurringMonthly ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    activeFirm?.autoRecurringMonthly ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Alert banner if nudge sent */}
      {nudgeSuccess && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-800 flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{nudgeSuccess}</span>
        </div>
      )}

      {/* 2. Top Blueprint Section: Document Collection Overview (Matches Laptop Screen) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Document Collection Overview
            </h2>
            <p className="text-xs text-slate-500">
              Cross-client tracking: Requests, Completed, Pending & Missing files
            </p>
          </div>
        </div>

        {/* 4 Executive KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* 1. Requests */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-700">
              <span>Requests</span>
              <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-2xs">
                <FileClock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalRequests}</div>
            <span className="text-[11px] text-indigo-600 font-semibold mt-0.5 block">Total active batches</span>
          </div>

          {/* 2. Completed */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Completed</span>
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">{totalCompleted}</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">100% verified</span>
          </div>

          {/* 3. Pending */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between text-xs font-bold text-amber-700">
              <span>Pending</span>
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">{totalPending}</div>
            <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">Awaiting upload</span>
          </div>

          {/* 4. Missing */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-white border border-rose-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between text-xs font-bold text-rose-700">
              <span>Missing</span>
              <div className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-2xs">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-700 mt-2">{totalMissing}</div>
            <span className="text-[11px] text-rose-600 font-semibold mt-0.5 block">Action required</span>
          </div>

        </div>

        {/* Team Workload & Client Ownership Strip */}
        {clients.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 font-bold">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>Team Workload ({clients.length} Clients):</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {Object.entries(
                clients.reduce((acc, c) => {
                  const staff = (c.assignedStaff || 'Pooja V. (Article Assistant)').split(' (')[0];
                  acc[staff] = (acc[staff] || 0) + 1;
                  return acc;
                }, {})
              ).map(([staff, count]) => (
                <span
                  key={staff}
                  className="text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg"
                >
                  {staff}: <strong className="text-indigo-700">{count}</strong>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Middle Section: Document Progress Circular Gauge + Real-time Collection Batches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Document Progress Circular Gauge Widget (Exact match from Laptop Screen) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm">Document Progress</h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                Live Status
              </span>
            </div>

            {/* Circular Gauge Graphic */}
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-100"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  {/* Progress Circle (Live) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-indigo-600 transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - progressPct / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Center Content */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">{progressPct}%</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Complete</span>
                </div>
              </div>
            </div>

            {/* Live Legend: Collected, Verified, Missing, In Review */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Collected</span>
                </span>
                <strong className="text-slate-900">{totalVerifiedDocs + totalSubmittedDocs} Docs</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span>Verified</span>
                </span>
                <strong className="text-slate-900">{totalVerifiedDocs} Docs</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Missing / Rejected</span>
                </span>
                <strong className="text-rose-600">{totalMissing} Docs</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>In CA Review</span>
                </span>
                <strong className="text-amber-600">{totalSubmittedDocs} Docs</strong>
              </div>
            </div>

            {/* Client-by-Client Completion Breakdown */}
            {requests.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Client Completion Breakdown
                </span>
                {requests.slice(0, 4).map((r) => {
                  const done = (r.items || []).filter((i) => i.status === 'SUBMITTED' || i.status === 'VERIFIED').length;
                  const tot = (r.items || []).length || 1;
                  const pct = Math.round((done / tot) * 100);
                  return (
                    <div key={r.id} className="space-y-1 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 truncate max-w-[160px]">{r.clientName}</span>
                        <span className="font-mono font-bold text-indigo-700">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 block leading-tight">
              Automated reminders actively dispatching for {totalMissing} missing/pending item(s).
            </span>
          </div>
        </div>

        {/* Collection Batches List (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {partnerQueueOnly
                    ? '✍️ Ready for Partner Sign-Off Queue'
                    : filterMissingOnly
                    ? '⚠️ Batches With Missing Documents'
                    : 'Active Document Collection Batches'}
                </h3>
                <p className="text-xs text-slate-500">Live client uploads, queries, and checklist status</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setFilterMissingOnly(!filterMissingOnly)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                    filterMissingOnly
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  <FileSearch className="w-3 h-3" />
                  <span>Missing ({totalMissing})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPartnerQueueOnly(!partnerQueueOnly)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                    partnerQueueOnly
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Partner Sign-Off Queue</span>
                </button>
                <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                  {displayedRequests.length} Batches
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {displayedRequests.map(req => {
                const submittedCount = req.items.filter(i => i.status === 'SUBMITTED' || i.status === 'VERIFIED').length;
                const totalItems = req.items.length;
                const reqProgress = Math.round((submittedCount / totalItems) * 100);
                const missingItems = req.items.filter(i => i.status === 'PENDING');

                return (
                  <div key={req.id} className="p-4 hover:bg-slate-50/80 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 truncate">{req.clientName}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            req.status === 'COMPLETE' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : req.status === 'OVERDUE'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {req.status === 'COMPLETE' ? '✓ Complete' : req.status === 'OVERDUE' ? '⚠️ Overdue' : 'Partially Submitted'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{req.title}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {missingItems.length > 0 && (
                          <a
                            href={`https://wa.me/${(req.clientPhone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Namaste ${req.clientName}, ${missingItems.length} document(s) are pending for "${req.title}" (Due: ${req.dueDate}). Upload here: ${window.location.origin}/?token=${req.secureToken}`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => handleNudgeMissing(req.clientName, missingItems.length)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg border border-rose-200"
                            title="Send WhatsApp reminder with Magic Link"
                          >
                            WhatsApp Nudge ({missingItems.length})
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                        <span>Documents: <strong>{submittedCount} / {totalItems} Received</strong></span>
                        <span className="font-bold">{reqProgress}% Complete</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            req.status === 'COMPLETE' ? 'bg-emerald-500' : req.status === 'OVERDUE' ? 'bg-rose-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${reqProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Submitted / Rejected / Missing Items with Live CA Two-Way Review & Query Sheet */}
                    {(req.items || []).length > 0 && (
                      <div className="mt-2.5 space-y-1.5">
                        {req.items.map(item => (
                          <div key={item.id} className="bg-slate-50 px-2.5 py-2 rounded-lg border border-slate-200/70 space-y-1.5">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                  item.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                                  item.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                                  item.status === 'SUBMITTED' ? 'bg-indigo-100 text-indigo-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>
                                  {item.status}
                                </span>
                                <span className="font-semibold text-slate-800 truncate">{item.title}</span>
                                {item.reviewStage === 'PARTNER_SIGNED' && (
                                  <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                                    Partner Signed ✓
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                {onAskClarification && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setQueryItemId(queryItemId === item.id ? null : item.id);
                                      setQueryDraft(item.clarificationQuery || '');
                                    }}
                                    className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[10px] flex items-center gap-1"
                                    title="Ask client clarification on this item"
                                  >
                                    <MessageSquare className="w-2.5 h-2.5" />
                                    <span>Query</span>
                                  </button>
                                )}
                                {onReviewRequestItem && (item.status === 'SUBMITTED' || item.status === 'VERIFIED') && (
                                  <>
                                    {item.status !== 'VERIFIED' && (
                                      <button
                                        type="button"
                                        onClick={() => onReviewRequestItem(req.id, item.id, 'VERIFY')}
                                        className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                                      >
                                        Verify ✓
                                      </button>
                                    )}
                                    {item.reviewStage !== 'PARTNER_SIGNED' && (
                                      <button
                                        type="button"
                                        onClick={() => onReviewRequestItem(req.id, item.id, 'PARTNER_SIGN_OFF')}
                                        className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px]"
                                      >
                                        Sign-Off
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => onReviewRequestItem(req.id, item.id, 'REJECT', 'Unclear / wrong period — please re-upload')}
                                      className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[10px]"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Existing Query & Client Reply Thread */}
                            {item.clarificationQuery && (
                              <div className="text-[10px] bg-amber-50/80 border border-amber-200 rounded px-2 py-1 text-amber-900 space-y-0.5">
                                <div><strong>CA Query:</strong> {item.clarificationQuery}</div>
                                {item.clarificationReply ? (
                                  <div className="text-emerald-800"><strong>Client Reply:</strong> {item.clarificationReply}</div>
                                ) : (
                                  <div className="text-amber-700 italic">Awaiting client reply...</div>
                                )}
                              </div>
                            )}

                            {/* Inline Query Input */}
                            {queryItemId === item.id && onAskClarification && (
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!queryDraft.trim()) return;
                                  onAskClarification(req.id, item.id, queryDraft);
                                  setQueryItemId(null);
                                  setQueryDraft('');
                                  setNudgeSuccess(`Clarification query sent to ${req.clientName} for "${item.title}".`);
                                  setTimeout(() => setNudgeSuccess(null), 3500);
                                }}
                                className="flex items-center gap-1.5 pt-1"
                              >
                                <input
                                  type="text"
                                  value={queryDraft}
                                  onChange={(e) => setQueryDraft(e.target.value)}
                                  placeholder="e.g. What is ₹48,500 NEFT on 14th Nov?"
                                  className="flex-1 px-2 py-1 rounded border border-amber-300 bg-white text-[11px] text-slate-900"
                                />
                                <button
                                  type="submit"
                                  className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px]"
                                >
                                  Send Query
                                </button>
                              </form>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Live CA <-> Client Activity Timeline */}
                    {(req.timeline || []).length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500">
                        <span className="font-bold text-slate-600">Audit Trail:</span>
                        {req.timeline.slice(0, 3).map(ev => (
                          <span key={ev.id} className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                            <span className="font-mono text-slate-400">{ev.at}</span>
                            <strong className="text-slate-700">{ev.actor}:</strong>
                            <span>{ev.action}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Client document portal links work on any smartphone with 0 passwords</span>
            <span className="font-bold text-indigo-600">Encrypted AES-256</span>
          </div>
        </div>

      </div>

      {/* 4. Statutory Compliance Calendar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">Upcoming Statutory Deadlines</h3>
          </div>
          <span className="text-xs text-slate-500">Automated reminder sync enabled</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {complianceDeadlines.map((dl, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
              <div>
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                  dl.status === 'Priority' ? 'bg-rose-100 text-rose-800' :
                  dl.status === 'Upcoming' ? 'bg-amber-100 text-amber-800' :
                  dl.status === 'Filed' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {dl.status}
                </span>
                <h4 className="text-xs font-bold text-slate-800 mt-1.5">{dl.name}</h4>
              </div>
              <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-2">
                <Clock className="w-3 h-3 text-slate-400" />
                Due: {dl.date}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
