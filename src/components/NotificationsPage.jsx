import React, { useState } from 'react';
import {
  Bell,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  MessageSquare,
  CheckCheck
} from 'lucide-react';

export default function NotificationsPage({
  notifications = [],
  onBack,
  onNavigateWorkspace
}) {
  const [filter, setFilter] = useState('ALL');
  const [readIds, setReadIds] = useState([]);

  const filtered = notifications.filter((n) => {
    if (filter === 'ALL') return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-6 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-600" />
            <span>Back</span>
          </button>

          {notifications.length > 0 && unreadCount > 0 && (
            <button
              type="button"
              onClick={() => setReadIds(notifications.map((n) => n.id))}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All Read ({unreadCount})</span>
            </button>
          )}
        </div>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-lg border border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black">Notifications &amp; Live Activity</h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Full feed of client uploads, rejections, clarifications, and approvals
              </p>
            </div>
          </div>
          <span className="text-xs font-extrabold bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl w-fit">
            {unreadCount} Unread • {notifications.length} Total
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { id: 'ALL', label: `All (${notifications.length})` },
            { id: 'UPLOAD', label: 'Uploads & Reviews' },
            { id: 'REJECTED', label: 'Re-Upload Needed' },
            { id: 'QUERY', label: 'Queries & Approvals' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-bold border transition-all ${
                filter === tab.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Full-Page Notifications List */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center space-y-2 text-slate-400">
              <Bell className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-bold text-sm text-slate-700">No notifications in this category</p>
              <p className="text-xs text-slate-500">New uploads, rejections, and client replies will appear here live.</p>
            </div>
          ) : (
            filtered.map((n, idx) => {
              const isRead = readIds.includes(n.id);
              const isRejected = n.type === 'REJECTED';
              const isQuery = n.type === 'QUERY';
              return (
                <div
                  key={n.id || idx}
                  onClick={() => !isRead && setReadIds((prev) => [...prev, n.id])}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors cursor-pointer ${
                    isRead ? 'bg-white opacity-75' : 'bg-indigo-50/30 hover:bg-indigo-50/60'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isRejected
                          ? 'bg-rose-100 text-rose-600'
                          : isQuery
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {isRejected ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : isQuery ? (
                        <MessageSquare className="w-4 h-4" />
                      ) : (
                        <UploadCloud className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">{n.title}</h3>
                        {!isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{n.detail}</p>
                      {n.time && (
                        <span className="text-[10px] font-mono text-indigo-600 block mt-1">{n.time}</span>
                      )}
                    </div>
                  </div>

                  {onNavigateWorkspace && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateWorkspace();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-900 hover:text-white border border-slate-200 text-slate-700 text-xs font-bold shrink-0 w-fit transition-colors"
                    >
                      Open Desk
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
