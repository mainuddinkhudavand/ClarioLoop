import React from 'react';
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
  Building2
} from 'lucide-react';
import { complianceDeadlines } from '../data/mockData';

export default function Dashboard({ 
  activeFirm, 
  onNewRequest, 
  onOpenPortal, 
  onOpenReminders,
  onOpenFirmSwitcher
}) {
  const clients = activeFirm?.clients || [];
  const requests = activeFirm?.requests || [];

  const pendingRequests = requests.filter(r => r.status !== 'COMPLETE');
  const completedRequests = requests.filter(r => r.status === 'COMPLETE');
  const overdueRequests = requests.filter(r => r.status === 'OVERDUE');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Multi-Tenant CA Practice Workspace</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-black text-white">
              {activeFirm?.name || 'Chartered Accountants'}
            </h1>
            <button
              onClick={onOpenFirmSwitcher}
              className="text-[11px] font-bold bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-400/30 text-indigo-300 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <span>Switch Practice</span>
            </button>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Lead: <strong>{activeFirm?.partnerName}</strong> • {activeFirm?.city} • {clients.length} Active Clients
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenReminders}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <Send className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reminder Queue</span>
          </button>
          <button
            onClick={onNewRequest}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Practice Clients</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{clients.length}</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> Live
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Limit: {activeFirm?.subscription?.clientLimit || 30} on {activeFirm?.subscription?.plan || 'Pro'}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Batches</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileClock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{pendingRequests.length}</span>
            <span className="text-xs text-amber-600 font-bold">Awaiting client files</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Auto-reminders running</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Overdue Follow-ups</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600">{overdueRequests.length}</span>
            <span className="text-xs text-rose-600 font-bold">Past deadline</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">WhatsApp alert scheduled</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Completed Workflows</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{completedRequests.length}</span>
            <span className="text-xs text-emerald-700 font-bold">100% verified</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Ready for Tally / ClearTax</span>
        </div>
      </div>

      {/* Main Grid: Client Document Matrix & Statutory Compliance Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Client Document Collection Batches */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">{activeFirm?.name} — Collection Batches</h2>
              <p className="text-xs text-slate-500">Real-time status of document requests across your clients</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              {requests.length} Active Batches
            </span>
          </div>

          {requests.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {requests.map(req => {
                const submittedCount = req.items.filter(i => i.status === 'SUBMITTED' || i.status === 'VERIFIED').length;
                const totalItems = req.items.length;
                const progressPct = Math.round((submittedCount / totalItems) * 100);

                return (
                  <div key={req.id} className="p-4 hover:bg-slate-50/80 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{req.clientName}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            req.status === 'COMPLETE' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : req.status === 'OVERDUE'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {req.status === 'COMPLETE' ? '✓ Complete' : req.status === 'OVERDUE' ? '⚠️ Overdue' : 'Partially Submitted'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{req.title}</p>
                      </div>

                      <button
                        onClick={() => onOpenPortal(req.secureToken)}
                        className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-200/60"
                      >
                        <span>Open Client Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                        <span>Documents: <strong>{submittedCount} / {totalItems} Received</strong></span>
                        <span className="font-bold">{progressPct}% Complete</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            req.status === 'COMPLETE' ? 'bg-emerald-500' : req.status === 'OVERDUE' ? 'bg-rose-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Missing items pills */}
                    {req.status !== 'COMPLETE' && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="text-[11px] text-slate-500 font-medium">Missing:</span>
                        {req.items.filter(i => i.status === 'PENDING').map(item => (
                          <span key={item.id} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            {item.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm font-bold text-slate-700">No active document requests for this CA firm yet.</p>
              <button
                onClick={onNewRequest}
                className="mt-3 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200"
              >
                + Create First Client Checklist
              </button>
            </div>
          )}
        </div>

        {/* Right 1 Col: Statutory Compliance Deadlines */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Statutory Compliance Due Dates</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Synchronized statutory tax deadlines for Indian accounting firms.
            </p>

            <div className="space-y-3">
              {complianceDeadlines.map((dl, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{dl.name}</h4>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {dl.date}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    dl.status === 'Priority' ? 'bg-rose-100 text-rose-800' :
                    dl.status === 'Upcoming' ? 'bg-amber-100 text-amber-800' :
                    dl.status === 'Filed' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {dl.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-xl text-xs text-indigo-900">
              <span className="font-bold block mb-1">🔒 Full Tenant Separation</span>
              Every CA firm operates on dedicated, isolated partitions. Clients only access their own assigned portal.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
