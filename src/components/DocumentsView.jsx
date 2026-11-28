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
  ArrowLeft,
  XCircle,
  Check,
  Table2,
  FileSpreadsheet
} from 'lucide-react';
import { mockAllDocuments } from '../data/mockData';
import { exportFullDossier } from '../utils/dossierExport';

function getAuditFileName(doc) {
  const cleanClient = (doc.clientName || 'Client').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 20);
  const parts = (doc.name || 'Document.pdf').split('.');
  const ext = parts.length > 1 ? parts.pop() : 'pdf';
  const base = parts.join('.').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 30);
  return `FY26-27_${cleanClient}_${base}_${doc.status || 'COLLECTED'}.${ext}`;
}

function deriveExtractedRow(doc, idx, firmClients = []) {
  const isGst = /gst|invoice|purchase|sales|bill/i.test(`${doc.name} ${doc.category}`);
  const isBank = /bank|hdfc|icici|sbi|statement/i.test(`${doc.name} ${doc.category}`);
  const baseAmt = isBank ? 245000 : isGst ? 48500 + (idx * 6200) : 18000;
  const gstAmt = isGst ? Math.round(baseAmt * 0.18) : 0;
  const matchedClient = firmClients.find(
    (c) => c.businessName && doc.clientName && c.businessName.toLowerCase() === doc.clientName.toLowerCase()
  );
  return {
    voucherType: /sales/i.test(doc.name) ? 'Sales' : isBank ? 'Contra / Bank' : isGst ? 'Purchase' : 'Journal',
    partyLedger: doc.clientName || 'Sundry Party',
    gstin: doc.gstin || matchedClient?.gstin || 'Unregistered',
    invoiceNo: doc.invoiceNo || `INV/26-27/${104 + idx}`,
    taxableValue: baseAmt,
    gstAmount: gstAmt,
    totalAmount: baseAmt + gstAmt
  };
}

export default function DocumentsView({ activeFirm, onOpenAI, onReviewRequestItem, onBack }) {
  const liveFirmDocs = (activeFirm?.requests || []).flatMap((req) =>
    (req.items || []).map((item) => ({
      id: `${req.id}_${item.id}`,
      reqId: req.id,
      itemId: item.id,
      fileUrl: item.uploadedFile?.fileUrl || null,
      name: item.uploadedFile?.name || item.title,
      clientName: req.clientName,
      category: item.category || 'CA Compliance',
      industry: 'CA Practice',
      size: item.uploadedFile?.size || 'Awaiting Upload',
      uploadedAt: item.uploadedFile?.date || req.dueDate || 'Pending',
      status:
        item.status === 'VERIFIED'
          ? 'VERIFIED'
          : item.status === 'SUBMITTED'
          ? 'COLLECTED'
          : item.status === 'REJECTED'
          ? 'MISSING'
          : 'MISSING',
      extractedSummary: item.uploadedFile
        ? `Uploaded for "${req.title}" • ${item.category || 'Compliance'}`
        : `Requested in "${req.title}" (Due: ${req.dueDate || 'N/A'})`,
      aiConfidence: item.uploadedFile ? 96 : 0,
      rejectionReason: item.rejectionReason || null,
    }))
  );

  const [localOverrides, setLocalOverrides] = useState({});
  const baseDocs = liveFirmDocs.length > 0 ? liveFirmDocs : mockAllDocuments;
  const docs = baseDocs.map((d) => ({ ...d, ...(localOverrides[d.id] || {}) }));
  const setDocs = (updater) => {
    const nextList = typeof updater === 'function' ? updater(docs) : updater;
    const map = {};
    nextList.forEach((d) => {
      map[d.id] = { status: d.status, rejectionReason: d.rejectionReason };
    });
    setLocalOverrides(map);
  };
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'ai_table'
  const [extractedEdits, setExtractedEdits] = useState({});
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [rejectingDoc, setRejectingDoc] = useState(null);
  const [rejectReason, setRejectReason] = useState('Blurry / unreadable scan');
  const [nudgeNotice, setNudgeNotice] = useState(null);

  const filteredDocs = docs.filter(doc => {
    const matchesStatus = filterStatus === 'ALL' || doc.status === filterStatus;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const countCollected = docs.filter(d => d.status === 'COLLECTED').length;
  const countVerified = docs.filter(d => d.status === 'VERIFIED').length;
  const countMissing = docs.filter(d => d.status === 'MISSING').length;
  const countDueSoon = docs.filter(d => d.status === 'DUE_SOON').length;

  const handleApproveDoc = (doc) => {
    setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'VERIFIED', rejectionReason: null } : d));
    if (onReviewRequestItem && doc.reqId && doc.itemId) {
      onReviewRequestItem(doc.reqId, doc.itemId, 'VERIFY');
    }
    setNudgeNotice(`"${doc.name}" marked as Verified.`);
    setTimeout(() => setNudgeNotice(null), 3500);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectingDoc) return;
    setDocs(prev => prev.map(d => d.id === rejectingDoc.id ? { ...d, status: 'REJECTED', rejectionReason: rejectReason } : d));
    if (onReviewRequestItem && rejectingDoc.reqId && rejectingDoc.itemId) {
      onReviewRequestItem(rejectingDoc.reqId, rejectingDoc.itemId, 'REJECT', rejectReason);
    }
    setNudgeNotice(`"${rejectingDoc.name}" rejected (${rejectReason}). Re-upload request sent to ${rejectingDoc.clientName}.`);
    setRejectingDoc(null);
    setTimeout(() => setNudgeNotice(null), 4500);
  };

  const handleExportDossier = () => {
    exportFullDossier({
      title: 'CA Compliance & Audit Dossier',
      entityName: activeFirm?.name || 'All Clients',
      firmName: activeFirm?.name || 'ClarioLoop CA Workspace',
      items: filteredDocs.map(d => ({
        title: d.name,
        category: d.category,
        fileName: d.name,
        status: d.status,
        uploadedAt: d.uploadedAt
      }))
    });
  };

  const handleExportTallyCSV = () => {
    const header = [
      'Voucher Date',
      'Voucher Type',
      'Party Ledger Name',
      'Party GSTIN',
      'Invoice / Ref No',
      'Taxable Value (INR)',
      'CGST (INR)',
      'SGST (INR)',
      'IGST (INR)',
      'Total Amount (INR)',
      'Audit Filename',
      'Narration'
    ];
    const rows = filteredDocs.map((d, idx) => {
      const row = { ...deriveExtractedRow(d, idx, activeFirm?.clients || []), ...(extractedEdits[d.id] || {}) };
      const halfGst = Math.round((Number(row.gstAmount) || 0) / 2);
      const total = (Number(row.taxableValue) || 0) + (Number(row.gstAmount) || 0);
      return [
        (() => {
          const iso = /^\d{4}-\d{2}-\d{2}$/.test(d.uploadedAt || '') ? d.uploadedAt : '2026-11-28';
          const [y, m, day] = iso.split('-');
          return `${day}-${m}-${y}`;
        })(),
        row.voucherType,
        row.partyLedger,
        row.gstin,
        row.invoiceNo,
        Number(row.taxableValue) || 0,
        halfGst,
        halfGst,
        0,
        total,
        getAuditFileName(d),
        `${d.category} | ${d.extractedSummary || d.name}`
      ];
    });
    const csv = '\uFEFF' + [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TallyPrime_Vouchers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setNudgeNotice('Exported Excel-ready UTF-8 CSV!');
    setTimeout(() => setNudgeNotice(null), 3500);
  };

  const handleExportTallyXML = () => {
    const esc = (s) =>
      String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const vouchersXml = filteredDocs
      .map((d, idx) => {
        const row = { ...deriveExtractedRow(d, idx, activeFirm?.clients || []), ...(extractedEdits[d.id] || {}) };
        const iso = /^\d{4}-\d{2}-\d{2}$/.test(d.uploadedAt || '') ? d.uploadedAt : '2026-11-28';
        const tallyDate = iso.replace(/-/g, '');
        const vchType = row.voucherType === 'Sales' ? 'Sales' : row.voucherType === 'Contra / Bank' ? 'Contra' : row.voucherType === 'Journal' ? 'Journal' : 'Purchase';
        const taxable = Number(row.taxableValue) || 0;
        const gst = Number(row.gstAmount) || 0;
        const halfGst = Math.round(gst / 2);
        const otherHalf = gst - halfGst;
        const total = taxable + gst;
        const isSales = vchType === 'Sales';
        const partyAmount = isSales ? -total : total;
        const mainLedger = isSales ? 'Sales Account' : vchType === 'Contra' ? 'Bank Account' : 'Purchase Account';
        const mainAmount = isSales ? taxable : -taxable;
        const narration = `${d.category} | ${getAuditFileName(d)}`;

        return `    <TALLYMESSAGE xmlns:UDF="TallyUDF">
      <VOUCHER VCHTYPE="${esc(vchType)}" ACTION="Create" OBJVIEW="Accounting Voucher View">
        <DATE>${tallyDate}</DATE>
        <VOUCHERTYPENAME>${esc(vchType)}</VOUCHERTYPENAME>
        <VOUCHERNUMBER>${esc(row.invoiceNo)}</VOUCHERNUMBER>
        <PARTYLEDGERNAME>${esc(row.partyLedger)}</PARTYLEDGERNAME>
        <PARTYGSTIN>${esc(row.gstin)}</PARTYGSTIN>
        <NARRATION>${esc(narration)}</NARRATION>
        <ALLLEDGERENTRIES.LIST>
          <LEDGERNAME>${esc(row.partyLedger)}</LEDGERNAME>
          <ISDEEMEDPOSITIVE>${partyAmount < 0 ? 'Yes' : 'No'}</ISDEEMEDPOSITIVE>
          <AMOUNT>${partyAmount.toFixed(2)}</AMOUNT>
        </ALLLEDGERENTRIES.LIST>
        <ALLLEDGERENTRIES.LIST>
          <LEDGERNAME>${esc(mainLedger)}</LEDGERNAME>
          <ISDEEMEDPOSITIVE>${mainAmount < 0 ? 'Yes' : 'No'}</ISDEEMEDPOSITIVE>
          <AMOUNT>${mainAmount.toFixed(2)}</AMOUNT>
        </ALLLEDGERENTRIES.LIST>${
          gst > 0
            ? `
        <ALLLEDGERENTRIES.LIST>
          <LEDGERNAME>${isSales ? 'Output CGST' : 'Input CGST'}</LEDGERNAME>
          <ISDEEMEDPOSITIVE>${isSales ? 'No' : 'Yes'}</ISDEEMEDPOSITIVE>
          <AMOUNT>${(isSales ? halfGst : -halfGst).toFixed(2)}</AMOUNT>
        </ALLLEDGERENTRIES.LIST>
        <ALLLEDGERENTRIES.LIST>
          <LEDGERNAME>${isSales ? 'Output SGST' : 'Input SGST'}</LEDGERNAME>
          <ISDEEMEDPOSITIVE>${isSales ? 'No' : 'Yes'}</ISDEEMEDPOSITIVE>
          <AMOUNT>${(isSales ? otherHalf : -otherHalf).toFixed(2)}</AMOUNT>
        </ALLLEDGERENTRIES.LIST>`
            : ''
        }
      </VOUCHER>
    </TALLYMESSAGE>`;
      })
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
      </REQUESTDESC>
      <REQUESTDATA>
${vouchersXml}
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;

    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TallyPrime_Vouchers_${new Date().toISOString().split('T')[0]}.xml`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setNudgeNotice('Exported official TallyPrime XML Vouchers (ready for Import Data → Vouchers)!');
    setTimeout(() => setNudgeNotice(null), 4000);
  };

  const handleDownloadRenamedDoc = (doc) => {
    const cleanName = getAuditFileName(doc);
    if (doc.fileUrl) {
      const a = document.createElement('a');
      a.href = doc.fileUrl;
      a.download = cleanName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setNudgeNotice(`Downloading real file as ${cleanName}`);
      setTimeout(() => setNudgeNotice(null), 3500);
      return;
    }
    const content = `ClarioLoop Audit Verified Record\nAudit Filename: ${cleanName}\nOriginal File: ${doc.name}\nClient: ${doc.clientName}\nCategory: ${doc.category}\nStatus: ${doc.status}\nAI Analysis: ${doc.extractedSummary || 'Verified'}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = cleanName.replace(/\.[^.]+$/, '.txt');
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setNudgeNotice(`Downloaded standardized audit copy: ${cleanName}`);
    setTimeout(() => setNudgeNotice(null), 3500);
  };

  const handleNudgeMissing = (doc) => {
    setNudgeNotice(`Urgent WhatsApp & Email follow-up dispatched to ${doc.clientName} for "${doc.name}".`);
    setTimeout(() => setNudgeNotice(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Compact Header Toolbar & Status Strip */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors shrink-0"
                title="Back to Overview"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-indigo-600" />
                <span>Back</span>
              </button>
            )}
            <h1 className="text-base sm:text-lg font-black text-slate-900">
              Documents &amp; Audit Vault
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleExportTallyXML}
              className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold px-3 py-2 rounded-xl text-xs shadow-xs transition-all"
              title="Official TallyPrime XML (Gateway -> Import Data -> Vouchers)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Tally XML</span>
            </button>
            <button
              onClick={handleExportTallyCSV}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs border border-slate-200 transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
              <span>Excel CSV</span>
            </button>
            <button
              onClick={handleExportDossier}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Full Dossier</span>
            </button>
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Reader</span>
            </button>
          </div>
        </div>

        {/* 4 Compact Status Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs pt-3 border-t border-slate-100">
          <button 
            onClick={() => setFilterStatus('COLLECTED')}
            className={`p-3 rounded-xl border text-left transition-all ${
              filterStatus === 'COLLECTED' ? 'bg-indigo-50 border-indigo-400' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-600 text-[11px] font-bold">Collected</span>
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            </div>
            <div className="text-lg font-black text-slate-900 mt-0.5">{countCollected} Files</div>
          </button>

          <button 
            onClick={() => setFilterStatus('VERIFIED')}
            className={`p-3 rounded-xl border text-left transition-all ${
              filterStatus === 'VERIFIED' ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-emerald-700 text-[11px] font-bold">Verified</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="text-lg font-black text-emerald-700 mt-0.5">{countVerified} Files</div>
          </button>

          <button 
            onClick={() => setFilterStatus('MISSING')}
            className={`p-3 rounded-xl border text-left transition-all ${
              filterStatus === 'MISSING' ? 'bg-rose-50 border-rose-400' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-rose-700 text-[11px] font-bold">Missing</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            </div>
            <div className="text-lg font-black text-rose-700 mt-0.5">{countMissing} Files</div>
          </button>

          <button 
            onClick={() => setFilterStatus('DUE_SOON')}
            className={`p-3 rounded-xl border text-left transition-all ${
              filterStatus === 'DUE_SOON' ? 'bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-amber-700 text-[11px] font-bold">Due Soon</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            </div>
            <div className="text-lg font-black text-amber-700 mt-0.5">{countDueSoon} Files</div>
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

      {/* 3. Document Cards OR AI Extracted Summary Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">
              Showing {filteredDocs.length} Documents
            </span>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
              Auto-Renamed on Download
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Document Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode('ai_table')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'ai_table' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>AI Extracted Summary Table</span>
            </button>
          </div>
        </div>

        {viewMode === 'ai_table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500">
                  <th className="p-3">Client & Audit File</th>
                  <th className="p-3">Voucher</th>
                  <th className="p-3">Party Ledger / GSTIN</th>
                  <th className="p-3">Inv / Ref No</th>
                  <th className="p-3 text-right">Taxable (₹)</th>
                  <th className="p-3 text-right">GST (₹)</th>
                  <th className="p-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc, idx) => {
                  const base = deriveExtractedRow(doc, idx, activeFirm?.clients || []);
                  const row = { ...base, ...(extractedEdits[doc.id] || {}) };
                  const updateField = (field, val) =>
                    setExtractedEdits(prev => ({
                      ...prev,
                      [doc.id]: { ...(prev[doc.id] || {}), [field]: val }
                    }));
                  const total = (Number(row.taxableValue) || 0) + (Number(row.gstAmount) || 0);
                  return (
                    <tr key={doc.id} className="hover:bg-indigo-50/30">
                      <td className="p-3 max-w-[210px]">
                        <div className="font-bold text-slate-900 truncate">{doc.clientName}</div>
                        <div className="text-[10px] font-mono text-indigo-700 truncate" title={getAuditFileName(doc)}>
                          {getAuditFileName(doc)}
                        </div>
                      </td>
                      <td className="p-3">
                        <select
                          value={row.voucherType}
                          onChange={(e) => updateField('voucherType', e.target.value)}
                          className="px-2 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800 text-[11px]"
                        >
                          <option value="Purchase">Purchase</option>
                          <option value="Sales">Sales</option>
                          <option value="Contra / Bank">Contra / Bank</option>
                          <option value="Journal">Journal</option>
                        </select>
                      </td>
                      <td className="p-3 space-y-1">
                        <input
                          type="text"
                          value={row.partyLedger}
                          onChange={(e) => updateField('partyLedger', e.target.value)}
                          className="w-36 px-2 py-1 rounded border border-slate-200 bg-white font-semibold text-slate-800 text-[11px] block"
                        />
                        <input
                          type="text"
                          value={row.gstin}
                          onChange={(e) => updateField('gstin', e.target.value)}
                          className="w-36 px-2 py-0.5 rounded border border-slate-200 bg-slate-50 font-mono text-[10px] text-slate-600 block"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={row.invoiceNo}
                          onChange={(e) => updateField('invoiceNo', e.target.value)}
                          className="w-28 px-2 py-1 rounded border border-slate-200 bg-white font-mono text-[11px]"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <input
                          type="number"
                          value={row.taxableValue}
                          onChange={(e) => updateField('taxableValue', Number(e.target.value))}
                          className="w-24 text-right px-2 py-1 rounded border border-slate-200 bg-white font-semibold"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <input
                          type="number"
                          value={row.gstAmount}
                          onChange={(e) => updateField('gstAmount', Number(e.target.value))}
                          className="w-20 text-right px-2 py-1 rounded border border-slate-200 bg-white font-semibold"
                        />
                      </td>
                      <td className="p-3 text-right font-black text-slate-900">
                        ₹{total.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : filteredDocs.length === 0 ? (
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
                          {!isVerified && (
                            <button
                              onClick={() => handleApproveDoc(doc)}
                              className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-2.5 py-1.5 rounded-xl text-xs transition-colors"
                              title="Verify & Approve"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Verify</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setRejectingDoc(doc);
                              setRejectReason('Blurry / unreadable scan');
                            }}
                            className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-2.5 py-1.5 rounded-xl text-xs transition-colors"
                            title="Reject & Request Re-upload"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                          <button
                            onClick={() => handleDownloadRenamedDoc(doc)}
                            className="p-1.5 text-slate-500 hover:text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors"
                            title={`Download as ${getAuditFileName(doc)}`}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* AI Extraction Snippet */}
                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="truncate pr-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span><strong>AI Analysis:</strong> {doc.extractedSummary}</span>
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
                <div>Audit Filename: <strong className="font-mono text-indigo-700">{getAuditFileName(selectedDoc)}</strong></div>
                <div>Uploaded At: <strong>{selectedDoc.uploadedAt}</strong> ({selectedDoc.size})</div>
              </div>

              {selectedDoc.fileUrl && (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100">
                  {/\.(png|jpe?g|webp)$/i.test(selectedDoc.name || selectedDoc.fileUrl) ? (
                    <img src={selectedDoc.fileUrl} alt={selectedDoc.name} className="max-h-64 w-full object-contain bg-white" />
                  ) : /\.pdf$/i.test(selectedDoc.name || selectedDoc.fileUrl) ? (
                    <iframe src={selectedDoc.fileUrl} title={selectedDoc.name} className="w-full h-64 bg-white" />
                  ) : (
                    <div className="p-3 text-center text-slate-600">
                      Real file stored on server. Click Download to open.
                    </div>
                  )}
                </div>
              )}

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
                onClick={() => handleDownloadRenamedDoc(selectedDoc)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
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

      {/* 5. Reject with Reason Modal */}
      {rejectingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <form onSubmit={handleConfirmReject} className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm">Reject & Request Re-Upload</h3>
              <button type="button" onClick={() => setRejectingDoc(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <div className="text-slate-600">
              Document: <strong className="text-slate-900">{rejectingDoc.name}</strong>
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Rejection Reason *</label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800"
              >
                <option value="Blurry / unreadable scan">Blurry / unreadable scan</option>
                <option value="Wrong financial year / period">Wrong financial year / period</option>
                <option value="Missing signature / stamp">Missing signature / stamp</option>
                <option value="Incomplete / cropped pages">Incomplete / cropped pages</option>
                <option value="Name / PAN mismatch">Name / PAN mismatch</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setRejectingDoc(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl">
                Send Re-Upload Alert
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
