import React, { useState } from 'react';
import { 
  GitBranch, 
  Plus, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  Play, 
  Clock, 
  AlertCircle,
  FileText,
  Search,
  Check,
  Send,
  Zap,
  Building2,
  Users,
  Scale,
  Cross,
  GraduationCap,
  Building,
  Umbrella,
  Factory,
  Truck,
  Handshake,
  Calculator
} from 'lucide-react';
import { industryWorkflows } from '../data/mockData';

// Map icon string names to Lucide icon components
const iconMap = {
  Calculator,
  Users,
  Scale,
  Cross,
  GraduationCap,
  Building,
  Umbrella,
  Factory,
  Truck,
  Handshake
};

export default function WorkflowsView({ onLaunchWorkflow, activeFirm }) {
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWorkflowModal, setActiveWorkflowModal] = useState(null);
  const [launchedSuccess, setLaunchedSuccess] = useState(null);

  const filteredWorkflows = industryWorkflows.filter(wf => {
    const matchesCategory = selectedIndustry === 'all' || wf.id === selectedIndustry;
    const matchesSearch = wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wf.subtext.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wf.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTriggerWorkflow = (wf) => {
    setLaunchedSuccess(`Workflow "${wf.name}" triggered successfully for ${activeFirm?.name || 'Firm'}! Client links and automated reminder queues generated.`);
    setActiveWorkflowModal(null);
    setTimeout(() => setLaunchedSuccess(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl border border-indigo-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
              <span>Universal Workflow Automation</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              All Industries • All Document Workflows
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Standardize, automate, and collect required documents from clients, candidates, patients, vendors, and students across 10 distinct industries.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setActiveWorkflowModal(industryWorkflows[0])}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Custom Workflow</span>
            </button>
          </div>
        </div>

        {/* Quick KPI stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/60 p-2.5 sm:p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-[11px] block">Industries Supported</span>
            <strong className="text-white text-base sm:text-lg font-black">10 Sectors</strong>
          </div>
          <div className="bg-slate-800/60 p-2.5 sm:p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-[11px] block">Active Workflows</span>
            <strong className="text-indigo-300 text-base sm:text-lg font-black">248 In-Flight</strong>
          </div>
          <div className="bg-slate-800/60 p-2.5 sm:p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-[11px] block">Average Completion</span>
            <strong className="text-emerald-400 text-base sm:text-lg font-black">86.4%</strong>
          </div>
          <div className="bg-slate-800/60 p-2.5 sm:p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-[11px] block">AI Auto-Classified</span>
            <strong className="text-cyan-300 text-base sm:text-lg font-black">1,840 Docs</strong>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {launchedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{launchedSuccess}</div>
        </div>
      )}

      {/* 2. Search & Industry Selector Chips (Horizontal scrollable on mobile) */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workflows, industries, or required documents (e.g., KYC, GST, Title Deed)..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <span className="text-xs text-slate-500 font-bold shrink-0 self-center">
            Showing {filteredWorkflows.length} of 10 Industries
          </span>
        </div>

        {/* Industry Pill Buttons (Scrollable horizontally) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedIndustry('all')}
            className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all ${
              selectedIndustry === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            All 10 Industries
          </button>

          {industryWorkflows.map(wf => {
            const isSelected = selectedIndustry === wf.id;
            return (
              <button
                key={wf.id}
                onClick={() => setSelectedIndustry(wf.id)}
                className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <span>{wf.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Grid of Industry Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredWorkflows.map(wf => {
          const Icon = iconMap[wf.icon] || GitBranch;

          return (
            <div 
              key={wf.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-4 sm:p-5 space-y-3.5">
                {/* Header: Icon + Sector */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl ${wf.lightBg} ${wf.textColor} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate">
                        {wf.name}
                      </h3>
                      <span className="text-[11px] font-bold text-slate-500 block truncate">
                        {wf.subtext}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    {wf.completionRate}% Done
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {wf.description}
                </p>

                {/* Checklist Preview */}
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Automated Document Checklist ({wf.sampleChecklist.length} Items):
                  </span>
                  <ul className="space-y-1">
                    {wf.sampleChecklist.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-slate-700 text-[11px] truncate">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                    {wf.sampleChecklist.length > 3 && (
                      <li className="text-[10px] font-bold text-indigo-600 pl-5">
                        +{wf.sampleChecklist.length - 3} more compliance items...
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500">
                  ⚡ <strong>{wf.activeRequests}</strong> active requests
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveWorkflowModal(wf)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-200/80 transition-colors"
                  >
                    View Steps
                  </button>
                  <button
                    onClick={() => handleTriggerWorkflow(wf)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Launch</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Workflow Detail & Checklist Modal */}
      {activeWorkflowModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-extrabold text-white truncate">
                    {activeWorkflowModal.name} Workflow
                  </h3>
                  <span className="text-xs text-indigo-300 font-medium">
                    {activeWorkflowModal.subtext}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveWorkflowModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Workflow Overview</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {activeWorkflowModal.description}
                </p>
              </div>

              {/* Checklist */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center justify-between">
                  <span>Standard Document Checklist</span>
                  <span className="text-xs font-normal text-slate-500">
                    {activeWorkflowModal.sampleChecklist.length} Required Files
                  </span>
                </h4>
                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  {activeWorkflowModal.sampleChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-slate-200/60">
                      <div className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <strong className="text-slate-900 text-xs block">{item}</strong>
                        <span className="text-[10px] text-slate-500">Mandatory • Groq AI OCR Verification Enabled</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reminder Rules */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 space-y-1">
                <strong className="block font-bold">⚡ Automated Follow-Up Protocol</strong>
                <p className="text-[11px] leading-relaxed">
                  WhatsApp and Email reminders dispatch every 48 hours before the deadline. The moment all {activeWorkflowModal.sampleChecklist.length} items are uploaded, follow-ups cease automatically.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setActiveWorkflowModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleTriggerWorkflow(activeWorkflowModal)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Deploy Workflow Now</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
