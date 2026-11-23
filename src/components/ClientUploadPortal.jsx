import React, { useState } from 'react';
import Logo from './Logo';
import { 
  UploadCloud, 
  FileCheck, 
  Clock, 
  AlertCircle, 
  Camera, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Lock,
  ArrowLeft,
  RefreshCw,
  Building2
} from 'lucide-react';
import { mockFirms } from '../data/mockData';

export default function ClientUploadPortal({ token, onBackToFirm, activeFirm }) {
  // Find which request and firm this token belongs to
  let foundFirm = activeFirm || mockFirms[0];
  let foundRequest = foundFirm.requests?.[0];

  for (const f of mockFirms) {
    const r = f.requests?.find(req => req.secureToken === token);
    if (r) {
      foundFirm = f;
      foundRequest = r;
      break;
    }
  }

  const [request, setRequest] = useState(foundRequest || {
    title: 'Monthly Document Collection',
    clientName: 'Valued Client',
    dueDate: '2026-11-30',
    items: [
      { id: '1', title: 'Bank Account Current Statement', category: 'Banking & Finance', isRequired: true, status: 'PENDING' },
      { id: '2', title: 'Sales Register & Tax Invoices', category: 'Accounting & Bookkeeping', isRequired: true, status: 'PENDING' }
    ]
  });

  const [activeItemId, setActiveItemId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [recentAIAnalysis, setRecentAIAnalysis] = useState(null);

  // File upload simulation with AI extraction
  const handleFileUpload = (e, item) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setActiveItemId(item.id);
    setUploadSuccess(null);

    setTimeout(() => {
      const fileNameLower = file.name.toLowerCase();
      let docType = 'Sales / Purchase Invoice';
      let amount = '₹ 54,200.00';

      if (fileNameLower.includes('bank') || fileNameLower.includes('stmt')) {
        docType = 'Bank Current Account Statement';
        amount = 'Closing Bal: ₹ 3,92,400';
      } else if (fileNameLower.includes('gst') || fileNameLower.includes('3b')) {
        docType = 'GSTR-3B Tax Receipt';
        amount = 'Tax Paid: ₹ 14,800';
      }

      const aiData = {
        documentType: docType,
        supplierName: request.clientName,
        invoiceNumber: 'INV-' + Math.floor(10000 + Math.random() * 90000),
        invoiceDate: new Date().toLocaleDateString('en-IN'),
        gstin: '27AABCN8492K1Z9',
        totalAmount: amount,
        confidence: 96,
        flags: ['Valid digital syntax', 'Matches checklist period']
      };

      const updatedItems = request.items.map(i => {
        if (i.id === item.id) {
          return {
            ...i,
            status: 'SUBMITTED',
            uploadedFile: {
              name: file.name,
              size: `${(file.size / 1024).toFixed(1)} KB`,
              date: new Date().toISOString().split('T')[0],
              aiExtracted: aiData
            }
          };
        }
        return i;
      });

      const allSubmitted = updatedItems.every(i => i.status === 'SUBMITTED');
      const updatedStatus = allSubmitted ? 'COMPLETE' : 'PARTIALLY_SUBMITTED';

      setRequest({
        ...request,
        status: updatedStatus,
        items: updatedItems
      });

      setRecentAIAnalysis(aiData);
      setUploading(false);
      setActiveItemId(null);
      setUploadSuccess(`Successfully uploaded and verified "${file.name}"!`);
    }, 1500);
  };

  const submittedCount = request.items.filter(i => i.status === 'SUBMITTED').length;
  const totalCount = request.items.length;
  const isAllComplete = submittedCount === totalCount;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
      {/* Top Header / Portal Branding */}
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="small" showTagline={false} />
          <span className="text-slate-400 text-xs hidden sm:inline">• Client Upload Vault</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-800">
            <Lock className="w-3 h-3 text-indigo-400" />
            <span className="font-semibold">Encrypted Client Vault</span>
          </div>

          {onBackToFirm && (
            <button
              onClick={onBackToFirm}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Practice</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl w-full mx-auto p-4 sm:p-6 my-auto">
        {/* CA Firm Request Banner */}
        <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-5 sm:p-6 shadow-xl mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-5 h-5 rounded text-[10px] font-black text-white flex items-center justify-center"
                  style={{ backgroundColor: foundFirm.brandingColor || '#4f46e5' }}
                >
                  {foundFirm.logoInitials || 'CA'}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                  Document Request from {foundFirm.name}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                {request.title}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Client: <strong className="text-slate-200">{request.clientName}</strong> • Lead CA: {foundFirm.partnerName}
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Due Date</span>
              <span className="text-xs sm:text-sm font-bold text-amber-300 flex items-center sm:justify-end gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                {new Date(request.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">
                {submittedCount} of {totalCount} documents uploaded
              </span>
              <span className={`font-bold ${isAllComplete ? 'text-emerald-400' : 'text-indigo-400'}`}>
                {isAllComplete ? '✓ All Complete' : `${Math.round((submittedCount / totalCount) * 100)}% Complete`}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isAllComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-blue-500'
                }`}
                style={{ width: `${(submittedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>

          {isAllComplete && (
            <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl flex items-center gap-3 text-xs text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                <strong>All documents submitted!</strong> Automated reminders have halted. {foundFirm.name} has been notified.
              </span>
            </div>
          )}
        </div>

        {/* Upload Success Alert */}
        {uploadSuccess && (
          <div className="mb-6 p-4 bg-indigo-950/80 border border-indigo-700 rounded-xl flex items-start gap-3 text-xs text-indigo-200 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{uploadSuccess}</span>
              {recentAIAnalysis && (
                <div className="mt-1.5 p-2 bg-slate-900/60 rounded border border-indigo-900/60 font-mono text-[11px] text-indigo-300">
                  ⚡ AI Classified: <strong>{recentAIAnalysis.documentType}</strong> ({recentAIAnalysis.totalAmount})
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interactive Checklist Items */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase font-bold tracking-wider text-slate-400 px-1">
            Required Documents Checklist
          </h2>

          {request.items.map(item => {
            const isDone = item.status === 'SUBMITTED' || item.status === 'VERIFIED';
            const isCurrentUploading = uploading && activeItemId === item.id;

            return (
              <div 
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  isDone 
                    ? 'bg-slate-800/50 border-emerald-900/60' 
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isDone ? 'bg-emerald-900/60 text-emerald-400' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{item.title}</h3>
                        {item.isRequired && (
                          <span className="text-[10px] font-semibold text-rose-400 bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-900">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                      
                      {isDone && item.uploadedFile && (
                        <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-300 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-900/50">
                          <FileCheck className="w-3.5 h-3.5" />
                          <span className="font-medium truncate max-w-[200px]">{item.uploadedFile.name}</span>
                          <span className="text-emerald-500 font-mono">({item.uploadedFile.size})</span>
                          <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-1.5 py-0.5 rounded ml-auto">
                            AI Verified
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <label className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isDone 
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                    } ${isCurrentUploading ? 'opacity-70 pointer-events-none' : ''}`}>
                      {isCurrentUploading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Scanning with AI...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{isDone ? 'Re-upload' : 'Upload File'}</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.docx"
                        onChange={(e) => handleFileUpload(e, item)}
                        disabled={uploading}
                      />
                    </label>

                    {/* Mobile Camera Fast-Snap Button */}
                    <label className="cursor-pointer sm:hidden p-2 bg-slate-700 hover:bg-slate-600 text-indigo-300 rounded-lg" title="Take photo with camera">
                      <Camera className="w-4 h-4" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment" 
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, item)}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Client Help Note */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>
            Files uploaded here are encrypted and sent directly to <strong>{foundFirm.name}</strong>.
          </p>
          <p className="mt-1">
            Queries? Contact your accounting team at <span className="text-indigo-400">{foundFirm.email}</span>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-slate-400 text-[11px] border-t border-slate-800">
        Powered by ClarioLoop • Multi-Tenant Document Automation for Indian CA Practices
      </footer>
    </div>
  );
}
