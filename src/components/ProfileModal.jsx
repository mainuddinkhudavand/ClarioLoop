import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Award, 
  X, 
  LogOut, 
  FileText, 
  Calendar,
  Lock,
  Camera,
  Image,
  Edit3,
  Check,
  Globe,
  Briefcase,
  Sparkles,
  Upload
} from 'lucide-react';

export default function ProfileModal({ 
  isOpen, 
  onClose, 
  userProfile, 
  onUpdateProfile,
  onLogout 
}) {
  if (!isOpen || !userProfile) return null;

  const [isEditing, setIsEditing] = useState(false);
  const coverInputRef = React.useRef(null);
  const avatarInputRef = React.useRef(null);

  const [formData, setFormData] = useState({
    name: userProfile.name || '',
    email: userProfile.email || '',
    phone: userProfile.phone || '',
    bio: userProfile.bio || (userProfile.role === 'ca' 
      ? 'Senior Partner specializing in Corporate Statutory Audits, Transfer Pricing, and Section 44AB Tax Filings.' 
      : userProfile.role === 'client' 
        ? 'High-growth technology company focused on cross-border SaaS workflows and digital services.'
        : 'Principal System Operations & Security Architect at ClarioLoop.'),
    designation: userProfile.designation || (userProfile.role === 'ca' ? 'Senior Managing Partner (FCA)' : userProfile.role === 'client' ? 'Director of Finance' : 'Lead Security Auditor'),
    location: userProfile.location || (userProfile.city || 'Mumbai, Maharashtra'),
    website: userProfile.website || (userProfile.role === 'ca' ? 'https://apexcafirm.in' : 'https://nexgendigital.io'),
    firmName: userProfile.firmName || '',
    icaiNumber: userProfile.icaiNumber || '',
    companyName: userProfile.companyName || '',
    gstin: userProfile.gstin || '',
    pan: userProfile.pan || '',
    avatarUrl: userProfile.avatarUrl || null,
    coverUrl: userProfile.coverUrl || null
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target.result;
        setFormData(prev => ({ ...prev, avatarUrl: result }));
        if (onUpdateProfile) {
          onUpdateProfile({
            ...userProfile,
            ...formData,
            avatarUrl: result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target.result;
        setFormData(prev => ({ ...prev, coverUrl: result }));
        // Also auto-save to parent profile so it persists immediately
        if (onUpdateProfile) {
          onUpdateProfile({
            ...userProfile,
            ...formData,
            coverUrl: result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPreset = (gradientCss) => {
    setFormData(prev => ({ ...prev, coverUrl: gradientCss }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...userProfile,
      ...formData,
      avatarInitials: (formData.name || 'CL').slice(0, 2).toUpperCase()
    };
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[94vh] animate-scaleUp text-xs">
        
        {/* ================= COVER PICTURE HEADER ================= */}
        <div className="relative h-36 sm:h-44 w-full bg-slate-800 overflow-hidden group">
          {formData.coverUrl ? (
            <img 
              src={formData.coverUrl} 
              alt="Profile Cover" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className={`w-full h-full ${
              userProfile.role === 'admin'
                ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950'
                : userProfile.role === 'ca'
                  ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800'
                  : 'bg-gradient-to-r from-teal-700 via-emerald-700 to-slate-900'
            } flex items-center justify-center text-white/20`}>
              <Sparkles className="w-24 h-24 stroke-[1]" />
            </div>
          )}

          {/* Close & Action Badges on Cover */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            {/* Edit Switch Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white font-bold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cover Photo Upload Button (Direct File Upload) */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-20">
            <label
              htmlFor="profile-cover-file-input"
              className="cursor-pointer px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white font-bold text-[11px] backdrop-blur-md border border-white/30 flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Camera className="w-3.5 h-3.5 text-indigo-300" />
              <span>Change Cover Photo</span>
            </label>
            <input 
              id="profile-cover-file-input"
              ref={coverInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleCoverChange} 
              style={{ display: 'none' }}
            />
          </div>

          {/* Role Pill on Cover */}
          <div className="absolute top-3 left-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              {userProfile.role.toUpperCase()} PORTAL PROFILE
            </span>
          </div>
        </div>

        {/* ================= AVATAR & QUICK IDENTITY STRIP ================= */}
        <div className="px-6 pb-2 pt-0 relative bg-white border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 -mt-12 sm:-mt-14 mb-3">
            
            {/* Avatar with Upload Badge */}
            <div className="relative group w-24 h-24 sm:w-28 sm:h-28">
              <div className="w-full h-full rounded-3xl bg-white p-1 shadow-xl border-2 border-slate-100 overflow-hidden">
                {formData.avatarUrl ? (
                  <img 
                    src={formData.avatarUrl} 
                    alt={formData.name} 
                    className="w-full h-full rounded-2xl object-cover" 
                  />
                ) : (
                  <div className={`w-full h-full rounded-2xl font-black text-2xl sm:text-3xl flex items-center justify-center text-white ${
                    userProfile.role === 'admin' 
                      ? 'bg-rose-600' 
                      : userProfile.role === 'ca' 
                        ? 'bg-indigo-600' 
                        : 'bg-emerald-600'
                  }`}>
                    {formData.name.slice(0, 2).toUpperCase() || 'CL'}
                  </div>
                )}
              </div>

              {/* Avatar Upload Trigger */}
              <label
                htmlFor="profile-avatar-file-input"
                className="cursor-pointer absolute bottom-1 right-1 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition-transform hover:scale-110 border-2 border-white z-20"
                title="Change Avatar Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </label>
              <input 
                id="profile-avatar-file-input"
                ref={avatarInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                style={{ display: 'none' }}
              />
            </div>

            {/* Official KYC Verified Badge */}
            <div className="flex items-center gap-2 shrink-0">
              {userProfile.isKycVerified ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-extrabold shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>KYC VERIFIED</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 font-extrabold">
                  <span>KYC PENDING</span>
                </div>
              )}
            </div>
          </div>

          {/* User Name & Designation */}
          <div className="space-y-0.5">
            <h3 className="text-lg font-black text-slate-900 leading-tight">
              {formData.name}
            </h3>
            <p className="text-xs font-bold text-indigo-600">
              {formData.designation}
            </p>
            <p className="text-[11px] text-slate-500 flex items-center gap-2 pt-0.5">
              <span>{userProfile.role === 'ca' ? userProfile.firmName : userProfile.companyName || 'ClarioLoop Platform'}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-slate-400" /> {formData.location}
              </span>
            </p>
          </div>
        </div>

        {/* ================= PROFILE BODY CONTENT ================= */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* EDIT MODE FORM */}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 font-medium space-y-2">
                <p>Editing your public profile details. Updates will reflect across your workspace and client communications.</p>
                
                {/* Secondary In-Form Cover & Avatar File Trigger */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-indigo-200/60">
                  <span className="text-[10px] font-bold text-indigo-700">Media Uploads:</span>
                  <label
                    htmlFor="profile-cover-file-input"
                    className="cursor-pointer px-2.5 py-1 rounded-lg bg-white border border-indigo-300 text-indigo-700 font-bold hover:bg-indigo-100 flex items-center gap-1 shadow-2xs"
                  >
                    <Image className="w-3 h-3" />
                    <span>Upload Cover Photo</span>
                  </label>
                  <label
                    htmlFor="profile-avatar-file-input"
                    className="cursor-pointer px-2.5 py-1 rounded-lg bg-white border border-indigo-300 text-indigo-700 font-bold hover:bg-indigo-100 flex items-center gap-1 shadow-2xs"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Upload Profile Avatar</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Designation *</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City / Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Bio Textarea */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Professional Bio / Overview *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Describe your practice, audit focus, services offered, or company profile..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                  />
                </div>
                {userProfile.role === 'ca' ? (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ICAI Reg / FRN</label>
                    <input
                      type="text"
                      value={formData.icaiNumber}
                      onChange={(e) => setFormData({ ...formData, icaiNumber: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-medium"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">GSTIN</label>
                    <input
                      type="text"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-medium"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          ) : (
            /* VIEW MODE */
            <>
              {/* Bio Box */}
              <div>
                <h4 className="font-extrabold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  <span>About & Professional Bio</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                  {formData.bio}
                </p>
              </div>

              {/* Information Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block font-semibold">Email</span>
                    <strong className="text-slate-900 truncate block">{formData.email}</strong>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block font-semibold">Phone</span>
                    <strong className="text-slate-900 truncate block">{formData.phone}</strong>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block font-semibold">Website</span>
                    <a href={formData.website} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold truncate block hover:underline">
                      {formData.website}
                    </a>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {userProfile.role === 'ca' ? 'ICAI FRN' : 'GSTIN'}
                    </span>
                    <strong className="text-slate-900 font-mono truncate block">
                      {userProfile.role === 'ca' ? formData.icaiNumber : formData.gstin}
                    </strong>
                  </div>
                </div>
              </div>

              {/* KYC Compliance Status Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 text-xs">Verified Regulatory Compliance</h5>
                    <p className="text-[11px] text-slate-600">
                      ID verification completed on {userProfile.kycDate || 'Nov 2026'}. All documents ISO 27001 encrypted.
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-black text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shrink-0">
                  VERIFIED
                </span>
              </div>
            </>
          )}

          {/* Sign Out Button */}
          {!isEditing && (
            <div className="pt-2">
              <button
                onClick={() => {
                  if (onLogout) onLogout();
                  onClose();
                }}
                className="w-full py-2.5 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
