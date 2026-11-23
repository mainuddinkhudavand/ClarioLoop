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
  Repeat
} from 'lucide-react';
import { mockClients } from '../data/mockData';

export default function RequestBuilder({ onCreated, activeFirm }) {
  const firmClients = activeFirm?.clients && activeFirm.clients.length > 0 ? activeFirm.clients : mockClients;
  const [selectedClient, setSelectedClient] = useState(firmClients[0]?.id || 'c1');
  const [requestTitle, setRequestTitle] = useState('December 2026 Monthly Accounting & GST Verification');
  const [period, setPeriod] = useState('December 2026');
  const [dueDate, setDueDate] = useState('2026-12-10');
  const [isRecurring, setIsRecurring] = useState(true);
  const [recurrence, setRecurrence] = useState('MONTHLY');
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Request Builder & Recurring Checklists</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Create structured document checklists, set due dates, and schedule automatic reminders
        </p>
      </div>

      {/* Reusable Template Quick-Pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Load Pre-built CA Checklist Template:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyTemplate('bookkeeping')}
            className="text-xs font-semibold px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg border border-teal-200 transition-colors"
          >
            📋 Monthly Bookkeeping
          </button>
          <button
            onClick={() => applyTemplate('gst')}
            className="text-xs font-semibold px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg border border-blue-200 transition-colors"
          >
            ⚡ GST Returns (GSTR-3B/1)
          </button>
          <button
            onClick={() => applyTemplate('tax')}
            className="text-xs font-semibold px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200 transition-colors"
          >
            📑 ITR Tax Season
          </button>
        </div>
      </div>

      {/* Main Request Form */}
      <form onSubmit={handleDispatch} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Client *</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-semibold"
            >
              {firmClients.map(c => (
                <option key={c.id} value={c.id}>{c.businessName} ({c.contactPerson})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Request Title *</label>
            <input
              type="text"
              value={requestTitle}
              onChange={(e) => setRequestTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Filing / Accounting Period</label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="e.g. November 2026"
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Submission Due Date *</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Recurrence Schedule</label>
            <div className="flex items-center gap-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>Auto-recur every month</span>
              </label>
            </div>
          </div>
        </div>

        {/* Checklist Item List Builder */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm">Requested Items ({items.length})</h3>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 text-xs text-teal-700 hover:text-teal-900 font-bold bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200/60"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Document Item</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {items.map((item, idx) => (
              <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
                <span className="font-mono text-slate-400 font-bold text-xs w-5">{idx + 1}.</span>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                  className="flex-1 bg-white p-2 rounded-lg border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <select
                  value={item.category}
                  onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                  className="bg-white p-2 rounded-lg border border-slate-200 text-xs text-slate-700"
                >
                  <option>Accounting & Bookkeeping</option>
                  <option>GST & Indirect Tax</option>
                  <option>Income Tax</option>
                  <option>Banking & Finance</option>
                  <option>Audit & Assurance</option>
                  <option>Payroll & Employee Records</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Client will receive a passwordless, mobile-friendly upload link via WhatsApp & Email.
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-teal-900/20 text-xs transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Generate & Send Request Link</span>
          </button>
        </div>

        {createdSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Request successfully created! Secure client portal link generated and dispatched.</span>
          </div>
        )}
      </form>
    </div>
  );
}
