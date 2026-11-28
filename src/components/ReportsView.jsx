import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Users, 
  ArrowDownToLine,
  TrendingUp,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Plus,
  Search
} from 'lucide-react';
import { mockRequests } from '../data/mockData';

const INITIAL_UDINS = [
  { id: 'u-1', date: '2026-11-24', client: 'NexGen Digital Solutions Pvt Ltd', docType: 'Tax Audit Report (Form 3CD)', udin: '26142891AAAAAB4821', partner: 'CA Rajesh Sharma' },
  { id: 'u-2', date: '2026-11-18', client: 'Vanguard Logistics & Freight LLP', docType: 'Net Worth Certificate', udin: '26142891AAAAAC9910', partner: 'CA Rajesh Sharma' },
  { id: 'u-3', date: '2026-11-12', client: 'Zenith Retail Supermart', docType: 'Turnover Certificate (Bank)', udin: '26142891AAAAAD2204', partner: 'CA Rajesh Sharma' },
];

export default function ReportsView({ activeFirm, onBack }) {
  const [downloadNotice, setDownloadNotice] = useState(null);
  const [reportTab, setReportTab] = useState('ledger'); // 'ledger' | 'heatmap' | 'udin'
  const [udinSearch, setUdinSearch] = useState('');
  const [udins, setUdins] = useState(() => {
    try {
      const saved = localStorage.getItem('clarioloop_udins_v1');
      return saved ? JSON.parse(saved) : INITIAL_UDINS;
    } catch {
      return INITIAL_UDINS;
    }
  });
  const [newUdin, setNewUdin] = useState({ client: '', docType: 'Tax Audit Report (Form 3CD)', udin: '' });

  const requestsList = (activeFirm?.requests && activeFirm.requests.length > 0) ? activeFirm.requests : mockRequests;
  const clientsList = activeFirm?.clients || [];

  const handleSaveUdin = (e) => {
    e.preventDefault();
    if (!newUdin.client.trim() || !newUdin.udin.trim()) return;
    const next = [
      {
        id: `u-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        client: newUdin.client.trim(),
        docType: newUdin.docType,
        udin: newUdin.udin.trim().toUpperCase(),
        partner: activeFirm?.partnerName || 'CA Rajesh Sharma',
      },
      ...udins,
    ];
    setUdins(next);
    try { localStorage.setItem('clarioloop_udins_v1', JSON.stringify(next)); } catch {}
    setNewUdin({ client: '', docType: 'Tax Audit Report (Form 3CD)', udin: '' });
  };

  const handleExportCSV = () => {
    setDownloadNotice('Generating detailed compliance audit report in CSV / Excel format...');
    setTimeout(() => {
      setDownloadNotice('Report generated and downloaded: "ClarioLoop_Audit_Report_Nov2026.csv"');
      setTimeout(() => setDownloadNotice(null), 3500);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Compact Header Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-600" />
              <span>Back</span>
            </button>
          )}
          <h1 className="text-base sm:text-lg font-black text-slate-900">Compliance &amp; Audit Reports</h1>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-xs transition-all w-fit shrink-0"
        >
          <ArrowDownToLine className="w-3.5 h-3.5 text-teal-400" />
          <span>Export Practice Audit (CSV)</span>
        </button>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Summary Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-800 font-bold">Collection Velocity</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">3.4 Days</span>
            <span className="text-xs text-emerald-600 font-bold">62% faster</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Average time from request to upload</p>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-white p-4 rounded-2xl border border-teal-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-teal-800 font-bold">Client Completion Rate</span>
            <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-teal-700">88.5%</span>
            <span className="text-xs text-slate-500 font-medium">Before due date</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Zero last-minute filing panics</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-2xl border border-indigo-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-indigo-800 font-bold">Chasing Hours Saved</span>
            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-700">42 Hours</span>
            <span className="text-xs text-indigo-600 font-bold">This Month</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Saved on WhatsApp calls &amp; emails</p>
        </div>
      </div>

      {/* Practice Health Segmented Distribution Bar */}
      {(() => {
        const allItems = requestsList.flatMap((r) => r.items || []);
        const total = allItems.length || 1;
        const verified = allItems.filter((i) => i.status === 'VERIFIED').length;
        const submitted = allItems.filter((i) => i.status === 'SUBMITTED').length;
        const missing = total - verified - submitted;
        const vPct = Math.round((verified / total) * 100);
        const sPct = Math.round((submitted / total) * 100);
        const mPct = Math.max(0, 100 - vPct - sPct);
        return (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-2.5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong className="text-slate-900 font-extrabold">Practice Document Health Breakdown ({allItems.length} Total Items)</strong>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold">
                <span className="text-emerald-700">{verified} Verified ({vPct}%)</span>
                <span className="text-indigo-700">{submitted} In Review ({sPct}%)</span>
                <span className="text-rose-700">{missing} Pending/Rejected ({mPct}%)</span>
              </div>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
              {vPct > 0 && <div className="h-full bg-emerald-500 transition-all" style={{ width: `${vPct}%` }} />}
              {sPct > 0 && <div className="h-full bg-indigo-500 transition-all" style={{ width: `${sPct}%` }} />}
              {mPct > 0 && <div className="h-full bg-rose-400 transition-all" style={{ width: `${mPct}%` }} />}
            </div>
          </div>
        );
      })()}

      {/* Sub-Tabs: Compliance Ledger | GST/TDS Heatmap | UDIN Register */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 w-fit text-xs">
        {[
          { id: 'ledger', label: 'Compliance Ledger', icon: BarChart3 },
          { id: 'heatmap', label: 'GST & TDS Heatmap', icon: Calendar },
          { id: 'udin', label: `UDIN Register (${udins.length})`, icon: ShieldCheck },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setReportTab(t.id)}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                reportTab === t.id ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Client Compliance Table (Live) */}
      {reportTab === 'ledger' && (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Client-wise Compliance Health Ledger</h2>
          <span className="text-xs text-slate-500 font-medium">FY 2026-27</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="p-3.5 pl-5">Client Name</th>
                <th className="p-3.5">Entity</th>
                <th className="p-3.5">Active Period</th>
                <th className="p-3.5">Documents Required</th>
                <th className="p-3.5">Submitted</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-5">Compliance Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {requestsList.map(r => {
                const sub = (r.items || []).filter(i => i.status === 'SUBMITTED' || i.status === 'VERIFIED').length;
                const tot = (r.items || []).length || 1;
                const score = Math.round((sub / tot) * 100);

                return (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-5 font-bold text-slate-900">{r.clientName}</td>
                    <td className="p-3.5 text-slate-500">Business Client</td>
                    <td className="p-3.5 font-medium">{r.period}</td>
                    <td className="p-3.5 font-mono">{tot}</td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">{sub}</td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.status === 'COMPLETE' ? 'bg-emerald-100 text-emerald-800' :
                        r.status === 'OVERDUE' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3.5 pr-5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${score === 100 ? 'bg-emerald-500' : score > 50 ? 'bg-teal-500' : 'bg-rose-500'}`} 
                            style={{ width: `${score}%` }} 
                          />
                        </div>
                        <span className="font-mono text-[11px] font-semibold">{score}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* TAB 2: GST & TDS Monthly Heatmap Matrix */}
      {reportTab === 'heatmap' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">GSTR-1 / GSTR-3B / TDS Monthly Heatmap (FY 2026-27)</h2>
              <p className="text-[11px] text-slate-500">Spot filed, pending, and overdue statutory returns across all clients</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Filed</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> In Progress</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Pending</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="p-3 pl-4">Client</th>
                  {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                    <th key={m} className="p-3 text-center">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(clientsList.length > 0 ? clientsList : [{ id: 'c1', businessName: 'NexGen Digital Solutions Pvt Ltd', gstin: '27AABCN1234F1Z5' }]).map((c, cIdx) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-3 pl-4">
                      <div className="font-bold text-slate-900">{c.businessName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{c.gstin || c.pan}</div>
                    </td>
                    {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, mIdx) => {
                      const state = mIdx < 6 ? 'FILED' : mIdx === 6 ? (cIdx % 2 === 0 ? 'FILED' : 'PENDING') : mIdx === 7 ? 'IN_PROGRESS' : 'UPCOMING';
                      return (
                        <td key={m} className="p-3 text-center">
                          <span
                            title={`${m} 2026: ${state}`}
                            className={`inline-block w-3.5 h-3.5 rounded-full ${
                              state === 'FILED'
                                ? 'bg-emerald-500'
                                : state === 'IN_PROGRESS'
                                ? 'bg-amber-400'
                                : state === 'PENDING'
                                ? 'bg-rose-500'
                                : 'bg-slate-200'
                            }`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: UDIN & Acknowledgement Register */}
      {reportTab === 'udin' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">ICAI UDIN & Certificate Register</h2>
              <p className="text-[11px] text-slate-500">Searchable 18-digit UDIN log for Tax Audits, Balance Sheets, and Net Worth Certificates</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={udinSearch}
                onChange={(e) => setUdinSearch(e.target.value)}
                placeholder="Search client or UDIN..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              />
            </div>
          </div>

          <form onSubmit={handleSaveUdin} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <input
              type="text"
              value={newUdin.client}
              onChange={(e) => setNewUdin({ ...newUdin, client: e.target.value })}
              placeholder="Client Name *"
              required
              className="px-3 py-2 rounded-lg bg-white border border-slate-200 font-semibold"
            />
            <select
              value={newUdin.docType}
              onChange={(e) => setNewUdin({ ...newUdin, docType: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white border border-slate-200 font-semibold"
            >
              <option>Tax Audit Report (Form 3CD)</option>
              <option>Audited Balance Sheet</option>
              <option>Net Worth Certificate</option>
              <option>Turnover Certificate (Bank)</option>
            </select>
            <input
              type="text"
              value={newUdin.udin}
              onChange={(e) => setNewUdin({ ...newUdin, udin: e.target.value })}
              placeholder="18-Digit UDIN *"
              required
              className="px-3 py-2 rounded-lg bg-white border border-slate-200 font-mono uppercase"
            />
            <button type="submit" className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Log UDIN</span>
            </button>
          </form>

          <div className="divide-y divide-slate-100 text-xs">
            {udins
              .filter((u) => u.client.toLowerCase().includes(udinSearch.toLowerCase()) || u.udin.toLowerCase().includes(udinSearch.toLowerCase()))
              .map((u) => (
                <div key={u.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-900">{u.client}</div>
                    <div className="text-[11px] text-slate-500">{u.docType} • {u.partner} • {u.date}</div>
                  </div>
                  <span className="font-mono font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-lg w-fit">
                    {u.udin}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
