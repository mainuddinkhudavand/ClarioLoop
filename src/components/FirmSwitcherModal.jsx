import React, { useState } from 'react';
import { 
  Building2, 
  Check, 
  Plus, 
  X, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Users, 
  FileText,
  UserCheck
} from 'lucide-react';

export default function FirmSwitcherModal({ 
  isOpen, 
  onClose, 
  firms, 
  activeFirmId, 
  onSelectFirm, 
  onRegisterNewFirm 
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'create'
  const [newFirm, setNewFirm] = useState({
    name: '',
    partnerName: '',
    city: '',
    icaiNumber: '',
    email: '',
    phone: '',
    plan: 'PROFESSIONAL'
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newFirm.name || !newFirm.partnerName) return;

    const initials = newFirm.name
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'CA';

    const createdFirm = {
      id: 'firm-' + (firms.length + 1),
      ...newFirm,
      brandingColor: '#4f46e5',
      logoInitials: initials,
      subscription: {
        plan: newFirm.plan,
        clientLimit: newFirm.plan === 'STARTER' ? 10 : newFirm.plan === 'BUSINESS' ? 100 : 30,
        status: 'TRIAL',
        trialDaysRemaining: 14
      },
      clients: [],
      requests: []
    };

    onRegisterNewFirm(createdFirm);
    onSelectFirm(createdFirm.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Select or Register CA Practice</h3>
              <p className="text-xs text-slate-400">Multi-tenant workspace isolation for different CA firms</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50 px-5 pt-3 gap-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'list' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Switch Existing Practice ({firms.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'create' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register New CA Firm</span>
          </button>
        </div>

        {/* Tab 1: List & Switch */}
        {activeTab === 'list' && (
          <div className="p-5 overflow-y-auto space-y-3 flex-1">
            <div className="text-[11px] text-slate-500 mb-2 font-medium">
              Choose a Chartered Accountant practice to enter its isolated workspace:
            </div>

            {firms.map(firm => {
              const isSelected = firm.id === activeFirmId;

              return (
                <div
                  key={firm.id}
                  onClick={() => {
                    onSelectFirm(firm.id);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected 
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600/30' 
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-sm"
                      style={{ backgroundColor: firm.brandingColor || '#4f46e5' }}
                    >
                      {firm.logoInitials}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-slate-900">{firm.name}</h4>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{firm.partnerName}</p>
                      
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {firm.city}
                        </span>
                        <span>•</span>
                        <span className="font-mono">{firm.icaiNumber}</span>
                        <span>•</span>
                        <span><strong>{firm.clients?.length || 0}</strong> Clients</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg bg-indigo-50">
                        Switch
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Register New Firm */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreate} className="p-5 overflow-y-auto space-y-3.5 text-xs flex-1">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 text-xs">
              <strong>Multi-Tenant Architecture:</strong> Your firm receives an isolated database partition. No other CA firm can ever see your clients or confidential documents.
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">CA Firm Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Verma & Singhal Chartered Accountants"
                value={newFirm.name}
                onChange={(e) => setNewFirm({ ...newFirm, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Lead Partner Name *</label>
                <input
                  type="text"
                  required
                  placeholder="CA Ritu Verma (FCA)"
                  value={newFirm.partnerName}
                  onChange={(e) => setNewFirm({ ...newFirm, partnerName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">City / State *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune, Maharashtra"
                  value={newFirm.city}
                  onChange={(e) => setNewFirm({ ...newFirm, city: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">ICAI Reg / FRN Number</label>
                <input
                  type="text"
                  placeholder="FRN 149281W"
                  value={newFirm.icaiNumber}
                  onChange={(e) => setNewFirm({ ...newFirm, icaiNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Starting Plan</label>
                <select
                  value={newFirm.plan}
                  onChange={(e) => setNewFirm({ ...newFirm, plan: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                >
                  <option value="STARTER">Starter (₹999/mo - Up to 10 clients)</option>
                  <option value="PROFESSIONAL">Professional (₹1,999/mo - Up to 30 clients)</option>
                  <option value="BUSINESS">Business (₹3,999/mo - Up to 100 clients)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Practice Email *</label>
                <input
                  type="email"
                  required
                  placeholder="contact@verma-ca.com"
                  value={newFirm.email}
                  onChange={(e) => setNewFirm({ ...newFirm, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98220 12345"
                  value={newFirm.phone}
                  onChange={(e) => setNewFirm({ ...newFirm, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
              >
                Back to List
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
              >
                Create Practice Workspace
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
