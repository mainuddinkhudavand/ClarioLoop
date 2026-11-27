import React, { useState } from 'react';
import { 
  FilePlus2, 
  Trash2, 
  Plus, 
  Calendar, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Clock,
  Layers,
  Repeat,
  ArrowLeft,
  Check,
  Info,
  AlertCircle,
  ShieldCheck,
  Tag,
  BookmarkCheck,
  FileText
} from 'lucide-react';
import { mockClients, financeMasterChecklist } from '../data/mockData';

export default function RequestBuilder({ onCreated, activeFirm, onBack }) {
  const firmClients = activeFirm?.clients && activeFirm.clients.length > 0 ? activeFirm.clients : mockClients;
  const [selectedClient, setSelectedClient] = useState(firmClients[0]?.id || 'c1');
  const [requestTitle, setRequestTitle] = useState('December 2026 Monthly Accounting & GST Verification');
  const [period, setPeriod] = useState('December 2026');
  const [dueDate, setDueDate] = useState('2026-12-10');
  const [isRecurring, setIsRecurring] = useState(true);
  const [approvalOwner, setApprovalOwner] = useState('CA Partner / Reviewer');
  const [createdSuccess, setCreatedSuccess] = useState(false);
  const [activeModuleCode, setActiveModuleCode] = useState(null);

  const [items, setItems] = useState([
    { id: 1, title: 'Bank Account Current Statement (PDF)', category: 'Banking & Finance', tag: 'Mandatory', isRequired: true, acceptedTypes: 'PDF' },
    { id: 2, title: 'Sales Register & B2B Tax Invoices', category: 'Accounting & Bookkeeping', tag: 'Mandatory', isRequired: true, acceptedTypes: 'XLSX, CSV' },
    { id: 3, title: 'Purchase Invoices & Supplier Bills for ITC', category: 'Accounting & Bookkeeping', tag: 'Mandatory', isRequired: true, acceptedTypes: 'PDF, XLSX' },
    { id: 4, title: 'GST Payment Challan / Electronic Cash Ledger', category: 'GST & Indirect Tax', tag: 'Conditional', isRequired: false, acceptedTypes: 'PDF' }
  ]);

  // Apply one of the 6 Master Modules from 1. Finance & Accounting
  const applyMasterModule = (code) => {
    setActiveModuleCode(code);
    const mod = financeMasterChecklist.find(m => m.code === code);
    if (!mod) return;

    setRequestTitle(`${mod.title} - Compliance Checklist`);
    setItems(mod.items.map((item, idx) => ({
      id: Date.now() + idx,
      title: item.name,
      category: item.category || 'Compliance',
      tag: item.defaultTag || 'Mandatory',
      isRequired: item.defaultTag === 'Mandatory',
      acceptedTypes: item.acceptedTypes || 'PDF'
    })));
  };

  // Toggle item requirement tag between Mandatory, Conditional, and Not Applicable
  const toggleItemTag = (id) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      const nextTag = item.tag === 'Mandatory' 
        ? 'Conditional' 
        : item.tag === 'Conditional' 
          ? 'Not Applicable' 
          : 'Mandatory';
      return {
        ...item,
        tag: nextTag,
        isRequired: nextTag === 'Mandatory'
      };
    }));
  };

  const addItem = () => {
    setItems([
      ...items,
      { 
        id: Date.now(), 
        title: 'Additional Required Document', 
        category: 'Accounting & Bookkeeping', 
        tag: 'Mandatory',
        isRequired: true, 
        acceptedTypes: 'PDF' 
      }
    ]);
  };

  const removeItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const handleDispatch = (e) => {
    e.preventDefault();
    setCreatedSuccess(true);
    setTimeout(() => {
      setCreatedSuccess(false);
      if (onCreated) onCreated();
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 w-full overflow-hidden">
      
      {/* Header with Back button */}
      <div className="flex items-center gap-2.5 sm:gap-3">
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
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
            Request Builder & Master Checklists
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate hidden sm:block">
            Pre-configured operational checklists for CA firms, tax consultants, accountants & auditors
          </p>
        </div>
      </div>

      {/* ================= FINANCE & ACCOUNTING WORKFLOW SELECTOR ================= */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>1. Finance & Accounting — Select Compliance Workflow</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              Users: CA firms, tax consultants, accountants, auditors and bookkeeping firms
            </span>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 w-fit">
            6 Ready Modules
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {financeMasterChecklist.map((mod) => {
            const isSelected = activeModuleCode === mod.code;
            return (
              <button
                key={mod.code}
                type="button"
                onClick={() => applyMasterModule(mod.code)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-50 hover:bg-indigo-50/60 text-slate-700 border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-indigo-200' : 'text-indigo-600'}`}>
                    Workflow {mod.code}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-200/70 text-slate-600'
                  }`}>
                    {mod.items.length} Docs
                  </span>
                </div>
                <strong className="text-xs font-bold leading-tight block">
                  {mod.title}
                </strong>
                <p className={`text-[10px] line-clamp-1 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {mod.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Request Form */}
      <form onSubmit={handleDispatch} className="bg-white p-3.5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 sm:space-y-5 text-xs w-full overflow-hidden">
        
        {/* Client & Title Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="min-w-0">
            <label className="font-bold text-slate-700 block mb-1">Select Client *</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 font-semibold text-xs truncate"
            >
              {firmClients.map(c => (
                <option key={c.id} value={c.id}>{c.businessName} ({c.contactPerson})</option>
              ))}
            </select>
          </div>

          <div className="min-w-0">
            <label className="font-bold text-slate-700 block mb-1">Request Title *</label>
            <input
              type="text"
              value={requestTitle}
              onChange={(e) => setRequestTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 font-semibold text-xs"
            />
          </div>
        </div>

        {/* Period, Due Date, Approval Owner & Recurrence Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="min-w-0">
            <label className="font-bold text-slate-700 block mb-1">Requested Period</label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="e.g. FY 2026-27"
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 text-xs"
            />
          </div>

          <div className="min-w-0">
            <label className="font-bold text-slate-700 block mb-1">Submission Due Date *</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 font-semibold text-xs"
            />
          </div>

          <div className="min-w-0">
            <label className="font-bold text-slate-700 block mb-1">Approval Owner</label>
            <input
              type="text"
              value={approvalOwner}
              onChange={(e) => setApprovalOwner(e.target.value)}
              placeholder="e.g. CA Partner"
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 text-xs"
            />
          </div>

          <div className="min-w-0 flex flex-col justify-center">
            <label className="font-bold text-slate-700 block mb-1">Recurrence Schedule</label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 py-1">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className="text-xs">Auto-recur monthly</span>
            </label>
          </div>
        </div>

        {/* ================= REQUESTED ITEMS (Trackable Document Requirements) ================= */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  Document Requirements Checklist ({items.length})
                </h3>
                <span className="text-[10px] text-slate-500">
                  ({items.filter(i => i.tag === 'Mandatory').length} Mandatory • {items.filter(i => i.tag === 'Conditional').length} Conditional • {items.filter(i => i.tag === 'Not Applicable').length} N/A)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Tip: Click on the tag pill (Mandatory / Conditional / N/A) to toggle requirements for this client.
              </span>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 text-xs text-indigo-700 hover:text-indigo-900 font-bold bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200/80 shrink-0 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Add Custom Document</span>
            </button>
          </div>

          {/* Responsive Item Cards List */}
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {items.map((item, idx) => {
              const tagColor = 
                item.tag === 'Mandatory' 
                  ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' 
                  : item.tag === 'Conditional' 
                    ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' 
                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200';

              return (
                <div 
                  key={item.id} 
                  className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all ${
                    item.tag === 'Not Applicable'
                      ? 'bg-slate-50/50 border-slate-200/60 opacity-60'
                      : 'bg-white border-slate-200 shadow-2xs hover:border-indigo-300'
                  }`}
                >
                  {/* Desktop View (md+) */}
                  <div className="hidden md:flex items-center gap-3">
                    <span className="font-mono text-slate-400 font-bold text-xs w-6 shrink-0">
                      {idx + 1}.
                    </span>

                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                      placeholder="Document title / description"
                      className="flex-1 min-w-0 bg-slate-50/50 hover:bg-white focus:bg-white p-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />

                    <span className="text-[10px] text-slate-400 font-medium px-2 shrink-0 truncate max-w-[130px]" title={item.category}>
                      {item.category}
                    </span>

                    {/* Tag Selector Pill: Mandatory / Conditional / Not Applicable */}
                    <button
                      type="button"
                      onClick={() => toggleItemTag(item.id)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-black uppercase tracking-wider transition-all shrink-0 ${tagColor}`}
                      title="Click to cycle Mandatory -> Conditional -> Not Applicable"
                    >
                      {item.tag || 'Mandatory'}
                    </button>

                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                      {item.acceptedTypes || 'PDF'}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile View (< md) */}
                  <div className="md:hidden space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 font-bold font-mono text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>

                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                        placeholder="Document title"
                        className="flex-1 min-w-0 bg-slate-50 focus:bg-white p-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 bg-rose-50 rounded-lg shrink-0"
                        title="Remove document item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-0.5 text-[10px]">
                      <span className="text-slate-400 truncate max-w-[120px]">
                        {item.category}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleItemTag(item.id)}
                          className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${tagColor}`}
                        >
                          {item.tag || 'Mandatory'}
                        </button>
                        <span className="font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.acceptedTypes || 'PDF'}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Bar (Mobile Friendly: Stacks vertically on phone) */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 leading-relaxed">
            Client receives a passwordless, mobile-friendly upload link via WhatsApp & Email.
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-indigo-600/25 text-xs transition-all shrink-0 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Generate & Send Request Link ({items.length} Docs)</span>
          </button>
        </div>

        {createdSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Request successfully created! Secure client portal link generated and dispatched.</span>
          </div>
        )}
      </form>

    </div>
  );
}
