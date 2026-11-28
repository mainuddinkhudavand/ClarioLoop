import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Building2, 
  Mail, 
  Phone, 
  UserPlus, 
  X, 
  Sparkles,
  ArrowLeft,
  Link2,
  Send,
  FileCheck2,
  Lock,
  Check,
  Eye,
  EyeOff,
  KeyRound
} from 'lucide-react';

export default function ClientList({
  activeFirm,
  onAddClientToFirm,
  onUpdateClientMeta,
  onBulkRequestBlast,
  onBack
}) {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedBulkIds, setSelectedBulkIds] = useState([]);
  const [bulkPreset, setBulkPreset] = useState('Monthly GSTR-1 & GSTR-3B Pack');
  const [bulkDueDate, setBulkDueDate] = useState('2026-12-11');
  const [copiedClientId, setCopiedClientId] = useState(null);
  const [editingNotesClientId, setEditingNotesClientId] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [receiptTarget, setReceiptTarget] = useState(null);
  const [receiptTitle, setReceiptTitle] = useState('ITR-V Acknowledgement AY 2026-27');
  const [compTarget, setCompTarget] = useState(null);
  const [compForm, setCompForm] = useState({
    returnType: 'GSTR-3B (Nov 2026)',
    turnover: '₹ 18,40,000',
    itcOrDeductions: '₹ 1,92,400',
    netPayable: '₹ 42,180 Payable'
  });
  const [revealedSecretId, setRevealedSecretId] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    entityType: 'Private Limited',
    gstin: '',
    pan: '',
    assignedStaff: 'Senior Accountant'
  });

  const clients = activeFirm?.clients || [];
  const filteredClients = clients.filter(c => 
    c.businessName.toLowerCase().includes(search.toLowerCase()) ||
    (c.contactPerson || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.gstin && c.gstin.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!formData.businessName || !formData.email) return;

    const newClient = {
      id: 'c' + Date.now(),
      ...formData,
      missingCount: 0
    };

    if (onAddClientToFirm) {
      onAddClientToFirm(activeFirm.id, newClient);
    }
    setShowAddModal(false);
    setFormData({
      businessName: '',
      contactPerson: '',
      email: '',
      phone: '',
      entityType: 'Private Limited',
      gstin: '',
      pan: '',
      assignedStaff: 'Senior Accountant'
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Compact Header Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
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
          <h1 className="text-base sm:text-lg font-black text-slate-900 truncate">Clients Directory</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onBulkRequestBlast && (
            <button
              onClick={() => {
                setSelectedBulkIds((activeFirm?.clients || []).map(c => c.id));
                setShowBulkModal(true);
              }}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-xs transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Bulk Request Blast</span>
            </button>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-xs transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-between">
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="text-emerald-700 font-bold">✕</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder={`Search ${activeFirm?.name}'s clients by business name or GSTIN...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-xs bg-transparent border-none focus:outline-none text-slate-800"
        />
        <span className="text-xs text-slate-400 font-medium px-2">
          {filteredClients.length} Clients
        </span>
      </div>

      {/* Clients Cards Grid */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClients.map(client => (
            <div 
              key={client.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400" />
              <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                      {client.businessName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{client.businessName}</h3>
                      <span className="text-[11px] text-slate-500">{client.contactPerson}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {client.entityType}
                  </span>
                </div>

                {/* Tax & Contact Identifiers */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">GSTIN</span>
                    <span className="font-mono font-bold text-slate-800 text-[11px]">{client.gstin || 'Unregistered'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">PAN</span>
                    <span className="font-mono font-bold text-slate-800 text-[11px]">{client.pan || 'N/A'}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {client.email}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {client.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Document Collection Health, Maker-Checker Staff, Magic Link & CA-Only Notes */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500">Staff:</span>
                    <select
                      value={client.assignedStaff || 'Pooja V. (Article Assistant)'}
                      onChange={(e) => onUpdateClientMeta && onUpdateClientMeta(client.id, { assignedStaff: e.target.value })}
                      className="text-[11px] font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1"
                    >
                      <option value="Pooja V. (Article Assistant)">Pooja V. (Article Assistant)</option>
                      <option value="Rohan Mehta (Audit Senior)">Rohan Mehta (Audit Senior)</option>
                      <option value="CA Rajesh Sharma (Partner)">CA Rajesh Sharma (Partner)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {client.missingCount > 0 ? (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {client.missingCount} Missing Bills
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Up to date
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Row: Magic Link, CA Internal Notes, Upload Filing Receipt */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const tok = client.secureToken || `${client.id}-demo-token`;
                      navigator.clipboard?.writeText(`${window.location.origin}/?token=${tok}`);
                      setCopiedClientId(client.id);
                      setTimeout(() => setCopiedClientId(null), 2000);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-bold flex items-center gap-1"
                  >
                    <Link2 className="w-3 h-3" />
                    <span>{copiedClientId === client.id ? 'Magic Link Copied!' : `ID: ${client.id} • Copy Link`}</span>
                  </button>

                  <a
                    href={`https://wa.me/${(client.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Namaste ${client.businessName}, please upload your pending tax/GST documents here: ${window.location.origin}/?token=${client.secureToken || client.id}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1"
                    title="Send Magic Link via WhatsApp"
                  >
                    <Send className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>

                  {onUpdateClientMeta && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          const nextStatus = (client.retainerStatus || 'PAID') === 'PAID' ? 'PENDING' : 'PAID';
                          onUpdateClientMeta(client.id, { retainerStatus: nextStatus });
                          setToastMsg(`Retainer fee for ${client.businessName} marked ${nextStatus}.`);
                          setTimeout(() => setToastMsg(null), 3000);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 ${
                          (client.retainerStatus || 'PAID') === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                        title="Click to toggle Retainer Fee Paid / Pending"
                      >
                        <span>Fee: ₹{(client.retainerAmount || 5000).toLocaleString('en-IN')} • {client.retainerStatus || 'PAID'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onUpdateClientMeta(client.id, { lockReceiptsUntilPaid: !client.lockReceiptsUntilPaid });
                        }}
                        className={`px-2 py-1.5 rounded-lg border text-[10px] font-bold ${
                          client.lockReceiptsUntilPaid
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                        title="Lock Filing Receipts in Client Vault until retainer fee is Paid"
                      >
                        {client.lockReceiptsUntilPaid ? '🔒 Receipt Lock ON' : 'Receipt Lock OFF'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setCompTarget(client)}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-bold flex items-center gap-1"
                        title="Send GST/ITR Computation Summary for Client Approval"
                      >
                        <span>
                          {client.taxComputation?.status === 'APPROVED'
                            ? '✓ Tax Approved'
                            : client.taxComputation?.status === 'PENDING_CLIENT_APPROVAL'
                            ? '⏳ Awaiting Approval'
                            : '+ Tax Summary'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNotesClientId(editingNotesClientId === client.id ? null : client.id);
                          setNoteDraft(client.internalNotes || '');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold flex items-center gap-1"
                        title="Private CA working-paper notes (hidden from client)"
                      >
                        <Lock className="w-3 h-3" />
                        <span>Working Notes</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReceiptTarget(client)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold flex items-center gap-1"
                      >
                        <FileCheck2 className="w-3 h-3" />
                        <span>+ Filing Receipt ({(client.filingReceipts || []).length})</span>
                      </button>

                      {client.secretPassphrase && (
                        <button
                          type="button"
                          onClick={() => setRevealedSecretId(revealedSecretId === client.id ? null : client.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1"
                          title="Confidential PDF password / private note shared by client"
                        >
                          <KeyRound className="w-3 h-3 text-emerald-400" />
                          <span>
                            {revealedSecretId === client.id ? client.secretPassphrase : 'Client Secret ••••••'}
                          </span>
                          {revealedSecretId === client.id ? (
                            <EyeOff className="w-3 h-3 text-slate-300" />
                          ) : (
                            <Eye className="w-3 h-3 text-slate-300" />
                          )}
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* CA-Only Working-Paper Notes Editor (Never Visible to Client) */}
                {editingNotesClientId === client.id && (
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                    <span className="text-[10px] font-black uppercase text-amber-800 block">
                      Internal CA Working-Paper Note (Hidden from Client)
                    </span>
                    <textarea
                      rows={2}
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder="e.g. Check GSTR-2B vs Purchase Register mismatch for Nov..."
                      className="w-full p-2 rounded-lg bg-white border border-amber-200 text-xs text-slate-800"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingNotesClientId(null)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-[11px]"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateClientMeta(client.id, { internalNotes: noteDraft });
                          setEditingNotesClientId(null);
                          setToastMsg(`Saved internal CA note for ${client.businessName}.`);
                        }}
                        className="px-3 py-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                )}
              </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <p className="font-bold text-slate-700">No clients found for {activeFirm?.name}.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-3 text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-200"
          >
            + Add First Client
          </button>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 p-6 animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Add Client to {activeFirm?.name}</h3>
                <span className="text-xs text-slate-500">Client will be linked specifically to this CA practice</span>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company / Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Tech Solutions Pvt Ltd"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Manoj Sharma"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Entity Type</label>
                  <select
                    value={formData.entityType}
                    onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option>Private Limited</option>
                    <option>LLP</option>
                    <option>Proprietorship</option>
                    <option>Partnership</option>
                    <option>Individual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email (For Reminders) *</label>
                  <input
                    type="email"
                    required
                    placeholder="accounts@client.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">GSTIN</label>
                  <input
                    type="text"
                    placeholder="27AABCN8492K1Z9"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">PAN</label>
                  <input
                    type="text"
                    placeholder="AABCN8492K"
                    value={formData.pan}
                    onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
                >
                  Save Client to {activeFirm?.logoInitials}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Request Blast Modal */}
      {showBulkModal && onBulkRequestBlast && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="bg-indigo-600 p-4 sm:p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Bulk Request Blast</h3>
                <p className="text-xs text-indigo-100 mt-0.5">Send a unified GST / Audit / Tax checklist to selected clients</p>
              </div>
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedBulkIds.length === 0) return;
                const presetItemsMap = {
                  'Monthly GSTR-1 & GSTR-3B Pack': [
                    { title: 'GSTR-1 Sales Register & B2B Invoices', category: 'GST & Indirect Tax' },
                    { title: 'Purchase Register & ITC Reconciliation (GSTR-2B)', category: 'GST & Indirect Tax' },
                    { title: 'Bank Statement (Current Account PDF)', category: 'Banking & Finance' },
                  ],
                  'FY 2026-27 Income Tax & 44AB Audit Pack': [
                    { title: 'Audited Trial Balance & Tally Backup', category: 'Accounting & Bookkeeping' },
                    { title: 'Form 26AS & AIS Statement', category: 'Income Tax' },
                    { title: 'Bank Interest & Loan Repayment Certificates', category: 'Banking & Finance' },
                  ],
                  'Monthly TDS Challan (ITNS 281) & Deduction Sheet': [
                    { title: 'Salary & Contractor Payment Sheet', category: 'Payroll' },
                    { title: 'TDS Challan (ITNS 281) Payment Receipt', category: 'Income Tax' },
                  ],
                };
                onBulkRequestBlast({
                  clientIds: selectedBulkIds,
                  title: bulkPreset,
                  dueDate: bulkDueDate,
                  items: presetItemsMap[bulkPreset] || presetItemsMap['Monthly GSTR-1 & GSTR-3B Pack'],
                });
                setShowBulkModal(false);
                setSelectedBulkIds([]);
                setToastMsg(`Sent "${bulkPreset}" to ${selectedBulkIds.length} client(s)`);
                setTimeout(() => setToastMsg(null), 4000);
              }}
              className="p-5 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Checklist Template</label>
                <select
                  value={bulkPreset}
                  onChange={(e) => setBulkPreset(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900"
                >
                  <option value="Monthly GSTR-1 & GSTR-3B Pack">Monthly GSTR-1 & GSTR-3B Pack</option>
                  <option value="FY 2026-27 Income Tax & 44AB Audit Pack">FY 2026-27 Income Tax & 44AB Audit Pack</option>
                  <option value="Monthly TDS Challan (ITNS 281) & Deduction Sheet">Monthly TDS Challan (ITNS 281) & Deduction Sheet</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={bulkDueDate}
                  onChange={(e) => setBulkDueDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700">Select Clients ({selectedBulkIds.length} selected)</label>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedBulkIds(
                        selectedBulkIds.length === clients.length ? [] : clients.map((c) => c.id)
                      )
                    }
                    className="text-[11px] font-bold text-indigo-600 hover:underline"
                  >
                    {selectedBulkIds.length === clients.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                  {clients.map((c) => {
                    const checked = selectedBulkIds.includes(c.id);
                    return (
                      <label key={c.id} className="flex items-center gap-2.5 p-2.5 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setSelectedBulkIds((prev) =>
                              checked ? prev.filter((id) => id !== c.id) : [...prev, c.id]
                            )
                          }
                          className="rounded border-slate-300 text-indigo-600"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 truncate">{c.businessName}</div>
                          <div className="text-[10px] text-slate-500">{c.contactPerson || c.contactName || 'Director'} • {c.gstin || c.pan}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedBulkIds.length === 0}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold shadow-sm"
                >
                  Blast to {selectedBulkIds.length} Client(s)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Filing Receipt Modal (CA -> Client Vault) */}
      {receiptTarget && onUpdateClientMeta && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Upload Filing Receipt to Client Locker</h3>
                <p className="text-[11px] text-emerald-100 truncate">{receiptTarget.businessName}</p>
              </div>
              <button
                type="button"
                onClick={() => setReceiptTarget(null)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!receiptTitle.trim()) return;
                const newReceipt = {
                  id: `rcpt-${Date.now()}`,
                  title: receiptTitle.trim(),
                  filedOn: new Date().toISOString().split('T')[0],
                  filedBy: activeFirm?.partnerName || 'CA Rajesh Sharma',
                  ackNo: `ACK-${Math.floor(10000000 + Math.random() * 90000000)}`,
                };
                const existing = receiptTarget.filingReceipts || [];
                onUpdateClientMeta(receiptTarget.id, {
                  filingReceipts: [newReceipt, ...existing],
                });
                setToastMsg(`Filing receipt "${newReceipt.title}" pushed to ${receiptTarget.businessName}'s Vault`);
                setTimeout(() => setToastMsg(null), 4000);
                setReceiptTarget(null);
              }}
              className="p-5 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Receipt / Statutory Document Title</label>
                <input
                  type="text"
                  value={receiptTitle}
                  onChange={(e) => setReceiptTitle(e.target.value)}
                  required
                  placeholder="e.g. ITR-V Acknowledgement AY 2026-27"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'ITR-V Acknowledgement AY 2026-27',
                  'GSTR-3B Filed Return (Nov 2026)',
                  'Audited Balance Sheet & Form 3CD',
                  'Form 16A TDS Certificate (Q2)',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setReceiptTitle(preset)}
                    className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-semibold"
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReceiptTarget(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                >
                  Push to Client Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Pre-Filing Tax Computation Modal (CA -> Client Approval) */}
      {compTarget && onUpdateClientMeta && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Send Tax Summary for Client Approval</h3>
                <p className="text-[11px] text-indigo-100 truncate">{compTarget.businessName}</p>
              </div>
              <button
                type="button"
                onClick={() => setCompTarget(null)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateClientMeta(compTarget.id, {
                  taxComputation: {
                    ...compForm,
                    status: 'PENDING_CLIENT_APPROVAL',
                    sentAt: new Date().toISOString().split('T')[0],
                    sentBy: activeFirm?.partnerName || 'CA Desk'
                  }
                });
                setToastMsg(`Tax computation sent to ${compTarget.businessName} for pre-filing sign-off!`);
                setTimeout(() => setToastMsg(null), 4000);
                setCompTarget(null);
              }}
              className="p-5 space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Return / Period</label>
                <input
                  type="text"
                  value={compForm.returnType}
                  onChange={(e) => setCompForm({ ...compForm, returnType: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Turnover / Income</label>
                  <input
                    type="text"
                    value={compForm.turnover}
                    onChange={(e) => setCompForm({ ...compForm, turnover: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ITC / Deductions</label>
                  <input
                    type="text"
                    value={compForm.itcOrDeductions}
                    onChange={(e) => setCompForm({ ...compForm, itcOrDeductions: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Net Tax Payable / Refund</label>
                <input
                  type="text"
                  value={compForm.netPayable}
                  onChange={(e) => setCompForm({ ...compForm, netPayable: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-indigo-700"
                />
              </div>
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCompTarget(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
                >
                  Send to Client Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
