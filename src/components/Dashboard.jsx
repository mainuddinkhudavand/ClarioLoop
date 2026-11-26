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
  Smartphone
} from 'lucide-react';
import { complianceDeadlines } from '../data/mockData';

export default function Dashboard({ 
  activeFirm, 
  onNewRequest, 
  onOpenPortal, 
  onOpenReminders,
  onOpenFirmSwitcher,
  onOpenCRM,
  onNavigateTab
}) {
  const clients = activeFirm?.clients || [];
  const requests = activeFirm?.requests || [];

  const [filterMissingOnly, setFilterMissingOnly] = useState(false);
  const [nudgeSuccess, setNudgeSuccess] = useState(null);

  const pendingRequests = requests.filter(r => r.status !== 'COMPLETE');
  const completedRequests = requests.filter(r => r.status === 'COMPLETE');
  const overdueRequests = requests.filter(r => r.status === 'OVERDUE');

  // Exact metrics shown on the laptop in the blueprint poster:
  const totalRequests = 248;
  const totalCompleted = 196;
  const totalPending = 32;
  const totalMissing = 20;
  const progressPct = 82; // 82% Complete gauge

  const handleNudgeMissing = (clientName, count) => {
    setNudgeSuccess(`Dispatched automated reminder to ${clientName} for ${count} missing document(s).`);
    setTimeout(() => setNudgeSuccess(null), 4000);
  };

  const displayedRequests = filterMissingOnly 
    ? requests.filter(r => r.status !== 'COMPLETE')
    : requests;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Practice Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Universal Document Workflow Platform</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h1 className="text-base sm:text-xl md:text-2xl font-black text-white break-words leading-tight">
              {activeFirm?.name || 'Chartered Accountants'}
            </h1>
            <span className="w-fit inline-flex items-center text-xs font-bold bg-indigo-600/30 border border-indigo-400/30 text-indigo-200 px-3 py-1.5 rounded-xl">
              {activeFirm?.city || 'India'}
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mt-1 truncate">
            Lead Partner: <strong>{activeFirm?.partnerName}</strong> • {activeFirm?.city}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto pt-2 sm:pt-0">
          <button
            onClick={() => onOpenPortal && onOpenPortal('nexgen-nov2026-demo-token')}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
            title="Open the client mobile upload portal"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Client Mobile Portal</span>
          </button>
          <button
            onClick={onNewRequest}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-md shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 order-first sm:order-last"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Request</span>
          </button>
          <button
            onClick={onOpenReminders}
            className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-all truncate"
          >
            <Send className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Reminders</span>
          </button>
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMissingOnly(!filterMissingOnly)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                filterMissingOnly 
                  ? 'bg-rose-50 border-rose-300 text-rose-700' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileSearch className="w-3.5 h-3.5 text-rose-500" />
              <span>{filterMissingOnly ? 'Show All Batches' : 'Filter 20 Missing Docs'}</span>
            </button>
          </div>
        </div>

        {/* 4 Overview KPI Cards: 248 Requests, 196 Completed, 32 Pending, 20 Missing */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* 1. Requests */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-700">
              <span>Requests</span>
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalRequests}</div>
            <span className="text-[11px] text-indigo-600 font-medium mt-0.5 block">Total created</span>
          </div>

          {/* 2. Completed */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Completed</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">{totalCompleted}</div>
            <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">100% verified</span>
          </div>

          {/* 3. Pending */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
            <div className="flex items-center justify-between text-xs font-bold text-amber-700">
              <span>Pending</span>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">{totalPending}</div>
            <span className="text-[11px] text-amber-600 font-medium mt-0.5 block">Awaiting upload</span>
          </div>

          {/* 4. Missing */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-50/70 border border-rose-100">
            <div className="flex items-center justify-between text-xs font-bold text-rose-700">
              <span>Missing</span>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-700 mt-2">{totalMissing}</div>
            <span className="text-[11px] text-rose-600 font-medium mt-0.5 block">Action required</span>
          </div>

        </div>
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
                  {/* Progress Circle (82%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-indigo-600 transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - 0.82)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Center Content */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">82%</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Complete</span>
                </div>
              </div>
            </div>

            {/* Blueprint Poster Legend: Collected, Verified, Missing, Due Soon */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Collected</span>
                </span>
                <strong className="text-slate-900">196 Docs</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span>Verified</span>
                </span>
                <strong className="text-slate-900">184 Docs</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Missing</span>
                </span>
                <strong className="text-rose-600">20 Docs</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Due Soon</span>
                </span>
                <strong className="text-amber-600">12 Docs</strong>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 block leading-tight">
              Automated reminders actively dispatching for the 20 missing documents.
            </span>
          </div>
        </div>

        {/* Collection Batches List (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {filterMissingOnly ? '⚠️ Batches With Missing Documents' : 'Active Document Collection Batches'}
                </h3>
                <p className="text-xs text-slate-500">Live client uploads and checklist status</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                {displayedRequests.length} Batches
              </span>
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
                          <button
                            onClick={() => handleNudgeMissing(req.clientName, missingItems.length)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg border border-rose-200"
                          >
                            Nudge ({missingItems.length})
                          </button>
                        )}
                        <button
                          onClick={() => onOpenPortal(req.secureToken)}
                          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-200/60"
                        >
                          <span>Open Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
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

                    {/* Missing items pills */}
                    {missingItems.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">Missing:</span>
                        {missingItems.map(item => (
                          <span key={item.id} className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200/70">
                            {item.title}
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
