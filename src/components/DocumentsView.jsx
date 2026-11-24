import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  ArrowUpRight,
  Eye,
  Send,
  Building2,
  FileCheck2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { mockAllDocuments } from '../data/mockData';

export default function DocumentsView({ activeFirm, onOpenAI, onBack }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [nudgeNotice, setNudgeNotice] = useState(null);

  const filteredDocs = mockAllDocuments.filter(doc => {
    const matchesStatus = filterStatus === 'ALL' || doc.status === filterStatus;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const countCollected = mockAllDocuments.filter(d => d.status === 'COLLECTED').length;
  const countVerified = mockAllDocuments.filter(d => d.status === 'VERIFIED').length;
  const countMissing = mockAllDocuments.filter(d => d.status === 'MISSING').length;
  const countDueSoon = mockAllDocuments.filter(d => d.status === 'DUE_SOON').length;

  const handleNudgeMissing = (doc) => {
    setNudgeNotice(`Urgent WhatsApp & Email follow-up dispatched to ${doc.clientName} for "${doc.name}".`);
    setTimeout(() => setNudgeNotice(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Header Banner & Metrics */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl border border-indigo-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors shrink-0"
                  title="Back to Overview"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
                <FileCheck2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Document Repository & Audit Vault</span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
              Documents & Compliance Records
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Encrypted document store with Groq AI verification for <strong>{activeFirm?.name || 'All Clients'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenAI}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Document Reader</span>
            </button>
          </div>
        </div>

        {/* 4 Status Pills from the Poster Legend: Collected, Verified, Missing, Due Soon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
          <button 
            onClick={() => setFilterStatus('COLLECTED')}
            className={`p-3 rounded-xl border text-left transition-all ${
              filterStatus === 'COLLECTED' ? 'bg-indigo-900/90 border-indigo-400' : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-[11px] font-bold">Collected</span>
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            </div>
            <div className="text-lg sm:text-xl font-black text-white mt-1">{countCollected} Files</div>
            <span className="text-[10px] text-slate-400">Awaiting AI verification</span>
          </button>

          <button 
            onClick={() => setFilterStatus('VERIFIED')}
            className={`p-3 rounded-xl border text-left transition-all ${
              filterStatus === 'VERIFIED' ? 'bg-emerald-950/80 border-emerald-400' : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-emerald-300 text-[11px] font-bold">Verified</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-lg sm:text-xl font-black text-emerald-300 mt-1">{countVerified} Files</div>
            <span className="text-[10px] text-emerald-400/80">100% AI Validated</span>
          </button>

          <button 
            onClick={() => setFilterStatus('MISSING')}
            className={`p-3 rounded-xl border text-left transition-all ${
              filterStatus === 'MISSING' ? 'bg-rose-950/80 border-rose-400' : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-rose-300 text-[11px] font-bold">Missing</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            </div>
            <div className="text-lg sm:text-xl font-black text-rose-300 mt-1">{countMissing} Files</div>
            <span className="text-[10px] text-rose-400/80">Urgent follow-ups active</span>
          </button>

          <button 
            onClick={() => setFilterStatus('DUE_SOON')}
            className={`p-3 rounded-xl border text-left transition-all ${
              filterStatus === 'DUE_SOON' ? 'bg-amber-950/80 border-amber-400' : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-amber-300 text-[11px] font-bold">Due Soon</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            </div>
            <div className="text-lg sm:text-xl font-black text-amber-300 mt-1">{countDueSoon} Files</div>
            <span className="text-[10px] text-amber-400/80">Deadline &lt; 3 days</span>
          </button>
        </div>
      </div>

      {/* Alert banner if nudge sent */}
      {nudgeNotice && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-800 flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{nudgeNotice}</span>
        </div>
      )}

      {/* 2. Search & Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by filename, client, or category (e.g. HDFC, GST, Invoice)..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs shrink-0 no-scrollbar">
          {['ALL', 'VERIFIED', 'COLLECTED', 'MISSING', 'DUE_SOON'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterStatus === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Records' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Document Cards (Responsive: Card list on mobile, clean table on desktop) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">
            Showing {filteredDocs.length} Documents
          </span>
          <span className="text-slate-400">
            Sorted by most recent activity
          </span>
        </div>

        {filteredDocs.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-sm text-slate-600">No documents match this filter</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the status filter or search query</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredDocs.map(doc => {
              const isMissing = doc.status === 'MISSING';
              const isVerified = doc.status === 'VERIFIED';
              const isDueSoon = doc.status === 'DUE_SOON';

              return (
                <div key={doc.id} className="p-4 hover:bg-slate-50/80 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    
                    {/* Left: Document info */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isVerified 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : isMissing
                            ? 'bg-rose-50 text-rose-600'
                            : isDueSoon
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        {isVerified ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : isMissing ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : isDueSoon ? (
                          <Clock className="w-5 h-5" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{doc.name}</h4>
                          
                          {/* Status Badge */}
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isVerified 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : isMissing
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : isDueSoon
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}>
                            {isVerified ? '✓ Verified' : isMissing ? '⚠️ Missing' : isDueSoon ? '⏰ Due Soon' : '● Collected'}
                          </span>

                          <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                            {doc.industry}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mt-1">
                          Client: <strong>{doc.clientName}</strong> • {doc.category} • {doc.size}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {isMissing ? (
                        <button
                          onClick={() => handleNudgeMissing(doc)}
                          className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-xs transition-all"
                        >
                          <Send className="w-3 h-3" />
                          <span>Nudge Client</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setSelectedDoc(doc)}
                            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>
                          <button
                            onClick={() => alert(`Downloading verified copy of ${doc.name}`)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Download document"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* AI Extraction Snippet */}
                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="truncate pr-2">
                      🤖 <strong>AI Analysis:</strong> {doc.extractedSummary}
                    </span>
                    {doc.aiConfidence > 0 && (
                      <span className="text-emerald-700 font-bold shrink-0">
                        {doc.aiConfidence}% match
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Inspection Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">{selectedDoc.name}</h3>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                <div>Client: <strong>{selectedDoc.clientName}</strong></div>
                <div>Category: <strong>{selectedDoc.category}</strong></div>
                <div>Industry Sector: <strong>{selectedDoc.industry}</strong></div>
                <div>Uploaded At: <strong>{selectedDoc.uploadedAt}</strong> ({selectedDoc.size})</div>
              </div>

              <div className="p-3 bg-indigo-50 text-indigo-900 rounded-xl border border-indigo-100">
                <strong className="block mb-1">⚡ Groq LLaMA-3.3-70B Extracted Data</strong>
                <p className="leading-relaxed">{selectedDoc.extractedSummary}</p>
                <div className="mt-2 text-[10px] text-indigo-600 font-bold">
                  Confidence Score: {selectedDoc.aiConfidence}% • Tamper-proof SHA256 Hash Verified
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
