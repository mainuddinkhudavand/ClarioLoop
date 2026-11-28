import React, { useState } from 'react';
import { 
  BellRing, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Mail, 
  Clock, 
  ShieldAlert, 
  Sparkles,
  Smartphone,
  Check,
  ArrowLeft,
  Link2,
  Palette
} from 'lucide-react';
import { mockRequests } from '../data/mockData';

export default function ReminderSettings({ activeFirm, onBack }) {
  const requests = activeFirm?.requests && activeFirm.requests.length > 0 ? activeFirm.requests : mockRequests;
  const [selectedRequestId, setSelectedRequestId] = useState(requests[0]?.id || mockRequests[0]?.id);
  const selectedRequest = requests.find(r => r.id === selectedRequestId) || requests[0] || mockRequests[0];
  const setSelectedRequest = (r) => setSelectedRequestId(r?.id);
  const [channel, setChannel] = useState('WHATSAPP');
  const [sending, setSending] = useState(false);
  const [sentNotice, setSentNotice] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Smart Escalation Cadence Rules (persisted)
  const [escalation, setEscalation] = useState(() => {
    try {
      const saved = localStorage.getItem('clarioloop_escalation');
      return saved ? JSON.parse(saved) : { day1: 'WHATSAPP', day3: 'EMAIL', day7: 'MANAGER_ALERT', autoStop: true };
    } catch {
      return { day1: 'WHATSAPP', day3: 'EMAIL', day7: 'MANAGER_ALERT', autoStop: true };
    }
  });

  // White-Label Client Portal Branding (persisted)
  const [whiteLabel, setWhiteLabel] = useState(() => {
    try {
      const saved = localStorage.getItem('clarioloop_whitelabel');
      return saved ? JSON.parse(saved) : { brandName: activeFirm?.name || '', accentColor: '#4f46e5', footerNote: 'Secure Encrypted Client Upload Portal' };
    } catch {
      return { brandName: activeFirm?.name || '', accentColor: '#4f46e5', footerNote: 'Secure Encrypted Client Upload Portal' };
    }
  });

  const saveEscalation = (next) => {
    setEscalation(next);
    localStorage.setItem('clarioloop_escalation', JSON.stringify(next));
  };

  const saveWhiteLabel = (next) => {
    setWhiteLabel(next);
    localStorage.setItem('clarioloop_whitelabel', JSON.stringify(next));
  };

  const magicLinkUrl = `${window.location.origin}/?token=${selectedRequest.secureToken || 'nexgen-nov2026-demo-token'}`;

  const handleCopyMagicLink = () => {
    navigator.clipboard?.writeText(magicLinkUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const missingItems = (selectedRequest.items || []).filter(i => i.status === 'PENDING' || i.status === 'REJECTED');
  const isComplete = selectedRequest.status === 'COMPLETE';
  const firmLabel = activeFirm?.name || 'your CA Practice';
  const partnerLabel = activeFirm?.partnerName || 'Lead Partner';

  // Format message text
  const whatsappPreview = `Hello *${selectedRequest.clientName}*,

This is a gentle reminder from *${firmLabel}*.

We are awaiting the following documents for *${selectedRequest.title}* (Due: *${new Date(selectedRequest.dueDate).toLocaleDateString('en-IN')}*):

${missingItems.map(item => `• ${item.title}`).join('\n')}

Please click your secure link below to upload them from your phone:
${magicLinkUrl}

_Note: Automated reminders will stop immediately once your files are uploaded._
Thank you!`;

  const emailPreviewSubject = `Action Required: Outstanding Documents for ${selectedRequest.title}`;
  const emailPreviewBody = `Dear ${selectedRequest.clientName},

We hope you are well.

In order to prepare and finalize your accounting and tax compliance before the deadline (${new Date(selectedRequest.dueDate).toLocaleDateString('en-IN')}), please upload the following remaining documents:

${missingItems.map(item => `  - ${item.title}`).join('\n')}

You can submit your documents securely using your dedicated client link below:
${magicLinkUrl}

Warm regards,
${partnerLabel}
${firmLabel}`;

  const handleSendReminder = () => {
    if (isComplete) return;
    setSending(true);
    setSentNotice(null);

    if (channel === 'WHATSAPP') {
      const phone = (selectedRequest.clientPhone || '').replace(/\D/g, '');
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(whatsappPreview)}`, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = `mailto:${selectedRequest.clientEmail || ''}?subject=${encodeURIComponent(emailPreviewSubject)}&body=${encodeURIComponent(emailPreviewBody)}`;
    }

    setTimeout(() => {
      setSending(false);
      setSentNotice(`Reminder opened via ${channel} for ${channel === 'WHATSAPP' ? selectedRequest.clientPhone : selectedRequest.clientEmail}!`);
      setTimeout(() => setSentNotice(null), 4000);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Compact Header Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex items-center justify-between gap-3">
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
          <h1 className="text-base sm:text-lg font-black text-slate-900 truncate">Smart Reminder Engine</h1>
        </div>
        <span className="text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 rounded-xl shrink-0">
          Auto-Stop Active
        </span>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Target Request Selection */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3 text-xs">
          <label className="font-bold text-slate-800 block">Select Active Request</label>
          <div className="space-y-2">
            {requests.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRequest(r)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedRequest.id === r.id 
                    ? 'border-teal-500 bg-teal-50/50 shadow-xs ring-1 ring-teal-500/30' 
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate max-w-[170px]">{r.clientName}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    r.status === 'COMPLETE' ? 'bg-emerald-100 text-emerald-800' :
                    r.status === 'OVERDUE' ? 'bg-rose-100 text-rose-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {r.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 truncate">{r.title}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Reminders Sent: {r.remindersSent}
                </span>
              </button>
            ))}
          </div>

          {/* Delivery Channels */}
          <div className="pt-3 border-t border-slate-100">
            <label className="font-bold text-slate-800 block mb-2">Delivery Channel</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setChannel('WHATSAPP')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-bold text-xs transition-all ${
                  channel === 'WHATSAPP' 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => setChannel('EMAIL')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-bold text-xs transition-all ${
                  channel === 'EMAIL' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Live Message Preview & Trigger */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {channel === 'WHATSAPP' ? 'WhatsApp Template Preview' : 'Email Template Preview'}
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                To: {channel === 'WHATSAPP' ? selectedRequest.clientPhone : selectedRequest.clientEmail}
              </span>
            </div>

            {/* Simulated WhatsApp or Email UI */}
            {channel === 'WHATSAPP' ? (
              <div className="bg-[#efeae2] p-4 rounded-xl border border-slate-300 font-sans shadow-inner max-w-lg">
                <div className="bg-white p-3.5 rounded-lg rounded-tl-none shadow-sm text-xs text-slate-800 whitespace-pre-line leading-relaxed border-l-4 border-emerald-500">
                  {whatsappPreview}
                  <div className="text-[10px] text-slate-400 text-right mt-2 flex items-center justify-end gap-1">
                    <span>10:30 AM</span>
                    <Check className="w-3 h-3 text-blue-500" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-2">
                <div className="bg-white p-2.5 rounded border border-slate-200 text-[11px]">
                  <span className="text-slate-400">Subject: </span>
                  <strong>{emailPreviewSubject}</strong>
                </div>
                <div className="bg-white p-3.5 rounded border border-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {emailPreviewBody}
                </div>
              </div>
            )}

            {isComplete && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>All items submitted! Reminders are automatically halted for this client.</span>
              </div>
            )}
          </div>

          {/* Trigger Action */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Trigger manually or let the 09:00 AM daily background worker send it.
            </span>

            <button
              onClick={handleSendReminder}
              disabled={sending || isComplete}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-all ${
                isComplete 
                  ? 'bg-slate-400 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-teal-900/20'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sending ? 'Dispatching...' : `Send ${channel} Reminder Now`}</span>
            </button>
          </div>

          {sentNotice && (
            <div className="mt-3 p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>{sentNotice}</span>
            </div>
          )}
        </div>

      </div>

      {/* Magic-Link, Smart Escalation Rules & White-Label Branding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Escalation Cadence + Magic Link */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Escalation Cadence & Magic Link</span>
            </h3>
            <label className="flex items-center gap-1.5 font-bold text-emerald-700 cursor-pointer">
              <input
                type="checkbox"
                checked={escalation.autoStop}
                onChange={(e) => saveEscalation({ ...escalation, autoStop: e.target.checked })}
                className="rounded text-emerald-600"
              />
              <span>Auto-Stop on Upload</span>
            </label>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 block">Day 1</span>
              <strong className="text-slate-800">WhatsApp</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 block">Day 3</span>
              <strong className="text-slate-800">Email Nudge</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 block">Day 7</span>
              <strong className="text-rose-600">Partner Alert</strong>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="font-bold text-slate-700 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>1-Tap Client Magic Upload Link</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={magicLinkUrl}
                className="flex-1 p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-600"
              />
              <button
                type="button"
                onClick={handleCopyMagicLink}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shrink-0"
              >
                {copiedLink ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* White-Label Client Portal Branding */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3 text-xs">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-600" />
            <span>White-Label Client Portal Branding</span>
          </h3>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Custom Portal Brand Name</label>
            <input
              type="text"
              placeholder="e.g. Apex & Partners Client Vault"
              value={whiteLabel.brandName}
              onChange={(e) => saveWhiteLabel({ ...whiteLabel, brandName: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
            />
          </div>
          <div className="grid grid-cols-3 gap-3 items-center">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Accent Color</label>
              <input
                type="color"
                value={whiteLabel.accentColor}
                onChange={(e) => saveWhiteLabel({ ...whiteLabel, accentColor: e.target.value })}
                className="w-full h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5"
              />
            </div>
            <div className="col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Portal Subtitle / Note</label>
              <input
                type="text"
                value={whiteLabel.footerNote}
                onChange={(e) => saveWhiteLabel({ ...whiteLabel, footerNote: e.target.value })}
                className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
