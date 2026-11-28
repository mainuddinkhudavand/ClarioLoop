import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Grid3X3,
  Clock,
  Edit3,
  Save,
  X
} from 'lucide-react';

const ACCENT_RING = {
  indigo: 'from-indigo-600 via-purple-600 to-pink-500',
  emerald: 'from-emerald-500 via-teal-500 to-cyan-500',
  blue: 'from-blue-600 via-indigo-500 to-sky-400',
  purple: 'from-purple-600 via-fuchsia-500 to-pink-500',
};

const ACCENT_BG = {
  indigo: 'bg-indigo-600',
  emerald: 'bg-emerald-600',
  blue: 'bg-blue-600',
  purple: 'bg-purple-600',
};

export default function InstagramProfileFeed({
  name = 'Verified Workspace',
  subtitle = '',
  initials = 'CL',
  accent = 'indigo',
  badgeText = 'KYC VERIFIED',
  posts = [],
  onPostAction,
  actionLabelMissing = 'Open Task',
  actionLabelDone = 'View Record',
  profileFields = [],
  onSaveProfile,
}) {
  const [feedTab, setFeedTab] = useState('all'); // 'all' | 'missing' | 'uploaded'
  const [isEditing, setIsEditing] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [draft, setDraft] = useState(() => ({
    name,
    subtitle,
    ...Object.fromEntries(profileFields.map((f) => [f.key, f.value || '']))
  }));

  React.useEffect(() => {
    setDraft({
      name,
      subtitle,
      ...Object.fromEntries(profileFields.map((f) => [f.key, f.value || '']))
    });
  }, [name, subtitle, JSON.stringify(profileFields)]);

  const isDoneStatus = (s) => s === 'SUBMITTED' || s === 'VERIFIED' || s === 'CLEARED';
  const isMissingStatus = (s) => !isDoneStatus(s);

  const missingPosts = posts.filter((p) => isMissingStatus(p.status));
  const uploadedPosts = posts.filter((p) => isDoneStatus(p.status));
  const visiblePosts =
    feedTab === 'missing' ? missingPosts : feedTab === 'uploaded' ? uploadedPosts : posts;

  const ringGrad = ACCENT_RING[accent] || ACCENT_RING.indigo;
  const avatarBg = ACCENT_BG[accent] || ACCENT_BG.indigo;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Instagram-Style Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className={`h-2 w-full bg-gradient-to-r ${ringGrad}`} />

        <div className="px-4 sm:px-6 py-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full p-0.5 bg-gradient-to-tr ${ringGrad} shadow-md shrink-0`}>
                <div className={`w-full h-full rounded-full ${avatarBg} text-white font-black text-2xl flex items-center justify-center border-2 border-white`}>
                  {(initials || 'CL').slice(0, 2).toUpperCase()}
                </div>
              </div>

              <div className="min-w-0 space-y-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-xl font-black text-slate-900 truncate">
                      {name}
                    </h2>
                    <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> {badgeText}
                    </span>
                  </div>
                  {subtitle && (
                    <span className="text-xs text-slate-500 block font-medium mt-0.5 truncate">
                      {subtitle}
                    </span>
                  )}
                </div>

                {/* Instagram-Style 3 Stat Counters */}
                <div className="flex items-center gap-6 pt-1">
                  <button type="button" onClick={() => setFeedTab('all')} className="text-left hover:opacity-80">
                    <strong className="text-sm sm:text-base font-black text-slate-900 block leading-none">
                      {posts.length}
                    </strong>
                    <span className="text-[11px] text-slate-500 font-semibold">Requests</span>
                  </button>
                  <button type="button" onClick={() => setFeedTab('uploaded')} className="text-left hover:opacity-80">
                    <strong className="text-sm sm:text-base font-black text-emerald-600 block leading-none">
                      {uploadedPosts.length}
                    </strong>
                    <span className="text-[11px] text-slate-500 font-semibold">Uploaded</span>
                  </button>
                  <button type="button" onClick={() => setFeedTab('missing')} className="text-left hover:opacity-80">
                    <strong className="text-sm sm:text-base font-black text-rose-600 block leading-none">
                      {missingPosts.length}
                    </strong>
                    <span className="text-[11px] text-slate-500 font-semibold">Missing</span>
                  </button>
                </div>
              </div>
            </div>

            {onSaveProfile && (
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center gap-1.5 shrink-0 w-fit"
              >
                {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            )}
          </div>

          {savedToast && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {isEditing && onSaveProfile && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSaveProfile(draft);
                setIsEditing(false);
                setSavedToast(true);
                setTimeout(() => setSavedToast(false), 3500);
              }}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Display Name</label>
                <input
                  type="text"
                  value={draft.name || ''}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subtitle / Role</label>
                <input
                  type="text"
                  value={draft.subtitle || ''}
                  onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-semibold"
                />
              </div>
              {profileFields.map((f) => (
                <div key={f.key}>
                  <label className="font-bold text-slate-700 block mb-1">{f.label}</label>
                  <input
                    type="text"
                    value={draft[f.key] || ''}
                    onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-semibold"
                  />
                </div>
              ))}
              <div className="sm:col-span-2 flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* Instagram-Style Feed Sub-Tabs */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-around border-b border-slate-200 text-xs">
              {[
                { id: 'all', label: `All (${posts.length})`, icon: Grid3X3 },
                { id: 'missing', label: `Missing (${missingPosts.length})`, icon: AlertCircle },
                { id: 'uploaded', label: `Uploaded (${uploadedPosts.length})`, icon: CheckCircle2 },
              ].map((t) => {
                const Icon = t.icon;
                const active = feedTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFeedTab(t.id)}
                    className={`flex-1 py-2.5 font-extrabold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                      active
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Posts Grid */}
            {visiblePosts.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                No items in this tab yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {visiblePosts.map((post, idx) => {
                  const isVerified = post.status === 'VERIFIED' || post.status === 'CLEARED';
                  const isRejected = post.status === 'REJECTED';
                  const isSubmitted = post.status === 'SUBMITTED' || post.status === 'UNDER_REVIEW';
                  const isMissing = !isVerified && !isSubmitted;

                  return (
                    <div
                      key={post.id || idx}
                      className={`aspect-square rounded-2xl border p-3 flex flex-col justify-between transition-all ${
                        isRejected
                          ? 'bg-rose-50 border-rose-200'
                          : isVerified
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : isSubmitted
                          ? 'bg-indigo-50/60 border-indigo-200'
                          : 'bg-amber-50/60 border-amber-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                            isRejected
                              ? 'bg-rose-600 text-white'
                              : isVerified
                              ? 'bg-emerald-600 text-white'
                              : isSubmitted
                              ? 'bg-indigo-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {isRejected ? 'Re-Upload' : isVerified ? 'Verified ✓' : isSubmitted ? 'In Review' : 'Missing'}
                        </span>
                        {post.period && (
                          <span className="text-[9px] font-bold text-slate-500 truncate">{post.period}</span>
                        )}
                      </div>

                      <div className="my-auto py-1 text-center space-y-1">
                        <div className="w-9 h-9 rounded-xl bg-white/90 border border-slate-200/80 mx-auto flex items-center justify-center shadow-2xs">
                          {isVerified ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : isMissing ? (
                            <AlertCircle className="w-5 h-5 text-rose-500" />
                          ) : (
                            <FileText className="w-5 h-5 text-indigo-600" />
                          )}
                        </div>
                        <h4 className="text-[11px] font-extrabold text-slate-900 line-clamp-2 leading-tight">
                          {post.title}
                        </h4>
                        {post.subtitle && (
                          <p className="text-[9px] text-slate-500 truncate">{post.subtitle}</p>
                        )}
                      </div>

                      {onPostAction ? (
                        <button
                          type="button"
                          onClick={() => onPostAction(post)}
                          className="w-full py-1.5 rounded-xl bg-white hover:bg-slate-900 hover:text-white border border-slate-200 text-slate-800 text-[10px] font-extrabold text-center transition-colors"
                        >
                          {isMissing ? actionLabelMissing : actionLabelDone}
                        </button>
                      ) : (
                        <div className="text-[9px] font-bold text-slate-500 text-center flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.category || 'Compliance'}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
