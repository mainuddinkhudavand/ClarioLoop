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
  ArrowLeft
} from 'lucide-react';
import { mockClients, mockRequests } from '../data/mockData';

export default function ReportsView({ activeFirm, onBack }) {
  const [downloadNotice, setDownloadNotice] = useState(null);

  const handleExportCSV = () => {
    setDownloadNotice('Generating detailed compliance audit report in CSV / Excel format...');
    setTimeout(() => {
      setDownloadNotice('Report generated and downloaded: "ClarioLoop_Audit_Report_Nov2026.csv"');
      setTimeout(() => setDownloadNotice(null), 3500);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs transition-colors shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-600" />
              <span>Back</span>
            </button>
          )}
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Compliance & Audit Reports</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Client-wise submission metrics, overdue follow-up velocity, and audit readiness exports
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <ArrowDownToLine className="w-4 h-4 text-teal-400" />
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
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Practice Document Collection Velocity</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">3.4 Days</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> 62% faster
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Average time from request to client upload</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Client Completion Rate</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-teal-600">88.5%</span>
            <span className="text-xs text-slate-500 font-medium">Prior to statutory due date</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Eliminating last-minute filing panics</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Automated Chasing Hours Saved</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-600">42 Hours</span>
            <span className="text-xs text-blue-700 font-bold">This Month</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Saved on manual WhatsApp calls & emails</p>
        </div>
      </div>

      {/* Client Compliance Table */}
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
              {mockRequests.map(r => {
                const sub = r.items.filter(i => i.status === 'SUBMITTED').length;
                const tot = r.items.length;
                const score = Math.round((sub / tot) * 100);

                return (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-5 font-bold text-slate-900">{r.clientName}</td>
                    <td className="p-3.5 text-slate-500">Pvt Ltd / LLP</td>
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
    </div>
  );
}
