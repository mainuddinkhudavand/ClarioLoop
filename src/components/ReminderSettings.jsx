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
  ArrowLeft
} from 'lucide-react';
import { mockRequests } from '../data/mockData';

export default function ReminderSettings({ activeFirm, onBack }) {
  const requests = activeFirm?.requests && activeFirm.requests.length > 0 ? activeFirm.requests : mockRequests;
  const [selectedRequest, setSelectedRequest] = useState(requests[0] || mockRequests[0]);
  const [channel, setChannel] = useState('WHATSAPP');
  const [sending, setSending] = useState(false);
  const [sentNotice, setSentNotice] = useState(null);

  const missingItems = selectedRequest.items.filter(i => i.status === 'PENDING');
  const isComplete = selectedRequest.status === 'COMPLETE';

  // Format message text
  const whatsappPreview = `Hello *${selectedRequest.clientName}*,

This is a gentle reminder from your accounting team at *Apex & Partners CA*.

We are awaiting the following documents for *${selectedRequest.title}* (Due: *${new Date(selectedRequest.dueDate).toLocaleDateString('en-IN')}*):

${missingItems.map(item => `• ${item.title}`).join('\n')}

Please click your secure link below to upload them from your phone:
https://clarioloop.onrender.com/portal/${selectedRequest.secureToken}

_Note: Automated reminders will stop immediately once your files are uploaded._
Thank you!`;

  const emailPreviewSubject = `Action Required: Outstanding Documents for ${selectedRequest.title}`;
  const emailPreviewBody = `Dear ${selectedRequest.clientName},

We hope you are well.

In order to prepare and finalize your accounting and tax compliance before the deadline (${new Date(selectedRequest.dueDate).toLocaleDateString('en-IN')}), please upload the following remaining documents:

${missingItems.map(item => `  - ${item.title}`).join('\n')}

You can submit your documents securely using your dedicated client link below:
https://clarioloop.onrender.com/portal/${selectedRequest.secureToken}

Warm regards,
CA Rajesh Sharma
Apex & Partners Chartered Accountants`;

  const handleSendReminder = () => {
    if (isComplete) return;
    setSending(true);
    setSentNotice(null);

    setTimeout(() => {
      setSending(false);
      setSentNotice(`Reminder successfully delivered via ${channel} to ${channel === 'WHATSAPP' ? selectedRequest.clientPhone : selectedRequest.clientEmail}!`);
      setTimeout(() => setSentNotice(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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
          <h1 className="text-xl font-extrabold text-slate-900">Smart Reminder Engine</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated, multi-channel client follow-ups that automatically halt when documents are uploaded
          </p>
        </div>
      </div>

      {/* Auto-Stop Guarantee Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-4 rounded-2xl border border-teal-800 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Guaranteed Client Goodwill</h3>
            <p className="text-xs text-teal-200 mt-0.5">
              Reminders <strong>auto-suppress immediately</strong> upon client submission. No double-chasing.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 px-3 py-1 rounded-full shrink-0">
          Auto-Stop Engine Active
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
    </div>
  );
}
