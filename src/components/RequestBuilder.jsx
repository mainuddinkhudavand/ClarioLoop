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
  Check
} from 'lucide-react';
import { mockClients } from '../data/mockData';

export default function RequestBuilder({ onCreated, activeFirm, onBack }) {
  const firmClients = activeFirm?.clients && activeFirm.clients.length > 0 ? activeFirm.clients : mockClients;
  const [selectedClient, setSelectedClient] = useState(firmClients[0]?.id || 'c1');
  const [requestTitle, setRequestTitle] = useState('December 2026 Monthly Accounting & GST Verification');
  const [period, setPeriod] = useState('December 2026');
  const [dueDate, setDueDate] = useState('2026-12-10');
  const [isRecurring, setIsRecurring] = useState(true);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const [items, setItems] = useState([
    { id: 1, title: 'Bank Account Current Statement (PDF)', category: 'Banking & Finance', isRequired: true },
    { id: 2, title: 'Sales Register & B2B Tax Invoices', category: 'Accounting & Bookkeeping', isRequired: true },
    { id: 3, title: 'Purchase Invoices & Supplier Bills for ITC', category: 'Accounting & Bookkeeping', isRequired: true },
    { id: 4, title: 'GST Payment Challan / Electronic Cash Ledger', category: 'GST & Indirect Tax', isRequired: true }
  ]);

  // Template switchers
  const applyTemplate = (tpl) => {
    if (tpl === 'bookkeeping') {
      setRequestTitle('Monthly Bookkeeping & Accounting Documents');
      setItems([
        { id: 1, title: 'Bank Statement (PDF / Excel with all transactions)', category: 'Banking & Finance', isRequired: true },
        { id: 2, title: 'Sales Invoices & Credit Notes', category: 'Accounting & Bookkeeping', isRequired: true },
        { id: 3, title: 'Vendor Purchase Bills & Cash Vouchers', category: 'Accounting & Bookkeeping', isRequired: true },
        { id: 4, title: 'Salary Slips & Reimbursement Register', category: 'Payroll & Employee Records', isRequired: false }
      ]);
    } else if (tpl === 'gst') {
      setRequestTitle('Monthly GST Return (GSTR-3B & GSTR-1) Filing Records');
      setItems([
        { id: 1, title: 'Outward Sales Summary & E-Way Bills', category: 'GST & Indirect Tax', isRequired: true },
        { id: 2, title: 'Supplier Invoices for GSTR-2B ITC Matching', category: 'GST & Indirect Tax', isRequired: true },
        { id: 3, title: 'Tax Payment Challan (Form GST PMT-06)', category: 'GST & Indirect Tax', isRequired: true }
      ]);
    } else if (tpl === 'tax') {
      setRequestTitle('Income Tax Return (ITR) Filing & Tax Season Checklists');
      setItems([
        { id: 1, title: 'Form 16 / 16A Salary & TDS Certificates', category: 'Income Tax', isRequired: true },
        { id: 2, title: 'Form 26AS & AIS / TIS Annual Information Statement', category: 'Income Tax', isRequired: true },
        { id: 3, title: 'Capital Gains Statement (Zerodha, Groww, CAMS)', category: 'Income Tax', isRequired: false },
        { id: 4, title: 'Housing Loan Interest & 80C Investment Proofs', category: 'Income Tax', isRequired: false }
      ]);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), title: 'Additional Required Document', category: 'Accounting & Bookkeeping', isRequired: true }
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
            Request Builder & Recurring Checklists
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate hidden sm:block">
            Create structured document checklists, set due dates, and schedule automatic reminders
          </p>
        </div>
      </div>

      {/* Reusable Template Quick-Pills */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Load Pre-built Checklist Template:
        </span>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => applyTemplate('bookkeeping')}
            className="text-xs font-semibold px-2.5 sm:px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-lg border border-indigo-200 transition-colors"
          >
            📋 Monthly Bookkeeping
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('gst')}
            className="text-xs font-semibold px-2.5 sm:px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg border border-blue-200 transition-colors"
          >
            ⚡ GST Returns (GSTR-3B/1)
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('tax')}
            className="text-xs font-semibold px-2.5 sm:px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200 transition-colors"
          >
            📑 ITR Tax Season
          </button>
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

        {/* Period, Due Date & Recurrence Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="min-w-0">
            <label className="font-bold text-slate-700 block mb-1">Filing / Accounting Period</label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="e.g. November 2026"
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

          <div className="min-w-0 flex flex-col justify-center">
            <label className="font-bold text-slate-700 block mb-1">Recurrence Schedule</label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 py-1">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className="text-xs">Auto-recur every month</span>
            </label>
          </div>
        </div>

        {/* ================= REQUESTED ITEMS (100% Mobile Responsive) ================= */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                Requested Items ({items.length})
              </h3>
              <span className="text-[10px] text-slate-400 block sm:hidden">
                Checklist items sent to client
              </span>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 text-xs text-indigo-700 hover:text-indigo-900 font-bold bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200/80 shrink-0 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Add Item</span>
            </button>
          </div>

          {/* Responsive Item Cards List */}
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div 
                key={item.id} 
                className="p-3 sm:p-3.5 bg-slate-50/90 rounded-xl sm:rounded-2xl border border-slate-200/80 space-y-2.5 transition-all hover:border-slate-300"
              >
                {/* Desktop View (md+): Single Inline Row with perfect flexing */}
                <div className="hidden md:flex items-center gap-3">
                  <span className="font-mono text-slate-400 font-bold text-xs w-6 shrink-0">
                    {idx + 1}.
                  </span>

                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                    placeholder="Document title / description"
                    className="flex-1 min-w-0 bg-white p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />

                  <select
                    value={item.category}
                    onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                    className="w-56 shrink-0 bg-white p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium"
                  >
                    <option>Accounting & Bookkeeping</option>
                    <option>GST & Indirect Tax</option>
                    <option>Income Tax</option>
                    <option>Banking & Finance</option>
                    <option>Audit & Assurance</option>
                    <option>Payroll & Employee Records</option>
                  </select>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-600 shrink-0 px-2">
                    <input
                      type="checkbox"
                      checked={item.isRequired}
                      onChange={(e) => updateItem(item.id, 'isRequired', e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    <span>Required</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors shrink-0"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile View (< md): Clean, Stacked Card that NEVER overflows */}
                <div className="md:hidden space-y-2">
                  {/* Top Row: Index + Document Title Input + Delete Button */}
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                      placeholder="e.g. Bank Statement (PDF)"
                      className="flex-1 min-w-0 bg-white p-2 rounded-lg border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 rounded-lg shrink-0"
                      title="Remove document item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom Row: Category Dropdown + Required Checkbox */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <select
                      value={item.category}
                      onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                      className="flex-1 min-w-0 bg-white p-2 rounded-lg border border-slate-200 text-[11px] text-slate-700 font-medium truncate"
                    >
                      <option>Accounting & Bookkeeping</option>
                      <option>GST & Indirect Tax</option>
                      <option>Income Tax</option>
                      <option>Banking & Finance</option>
                      <option>Audit & Assurance</option>
                      <option>Payroll & Employee Records</option>
                    </select>

                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shrink-0">
                      <input
                        type="checkbox"
                        checked={item.isRequired}
                        onChange={(e) => updateItem(item.id, 'isRequired', e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                      <span>Required</span>
                    </label>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar (Mobile Friendly: Stacks vertically on phone) */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 leading-relaxed">
            Client receives a passwordless, mobile-friendly upload link via WhatsApp & Email.
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-indigo-600/25 text-xs transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Generate & Send Request Link</span>
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
