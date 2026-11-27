import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Zap, 
  Clock, 
  Lock, 
  Building2, 
  ArrowLeft,
  Landmark,
  GraduationCap,
  Umbrella,
  BadgeCheck
} from 'lucide-react';
import { VERTICAL_SUBSCRIPTIONS, VERTICAL_DEFINITIONS } from '../data/verticalData';
import RazorpayModal from './RazorpayModal';

export default function SubscriptionPlans({ 
  activeFirm, 
  onSubscriptionUpdated, 
  onBack,
  defaultVertical = 'ca'
}) {
  const [selectedVertical, setSelectedVertical] = useState(defaultVertical);

  const currentPlan = activeFirm?.subscription?.plan || 'PROFESSIONAL';
  const isTrial = activeFirm?.subscription?.status === 'TRIAL';
  const trialDays = activeFirm?.subscription?.trialDaysRemaining || 11;

  // Razorpay Checkout State
  const [selectedTierForCheckout, setSelectedTierForCheckout] = useState(null);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [successNotification, setSuccessNotification] = useState(null);

  const currentTiers = VERTICAL_SUBSCRIPTIONS[selectedVertical] || VERTICAL_SUBSCRIPTIONS.ca;
  const currentVerticalMeta = VERTICAL_DEFINITIONS.find(v => v.id === selectedVertical) || VERTICAL_DEFINITIONS[0];

  const handleOpenRazorpay = (tier) => {
    setSelectedTierForCheckout({
      ...tier,
      vertical: selectedVertical
    });
    setIsRazorpayOpen(true);
  };

  const handlePaymentSuccess = (tier, receipt) => {
    if (onSubscriptionUpdated && activeFirm) {
      onSubscriptionUpdated(activeFirm.id, {
        plan: tier.id,
        vertical: selectedVertical,
        status: 'ACTIVE',
        trialDaysRemaining: 0
      });
    }

    setSuccessNotification(`Payment verified! Razorpay Transaction ID: ${receipt.paymentId}. Upgraded to ${tier.name} (${currentVerticalMeta.name}).`);
    setTimeout(() => setSuccessNotification(null), 6000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {onBack && (
        <div className="flex items-center justify-start">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs transition-colors"
            title="Back to Previous Screen"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-600" />
            <span>Back</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
          Industry-Specific Subscription Plans
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Select Your ClarioLoop Vertical & Plan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Tailored quotas, document checklists, and compliance workflows built for Chartered Accountants, Cooperative Banks, Educational Institutions, and Insurance Agencies.
        </p>
      </div>

      {/* 4 VERTICAL TABS SELECTOR */}
      <div className="flex items-center justify-center">
        <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200/90 grid grid-cols-2 md:grid-cols-4 gap-1.5 w-full max-w-4xl">
          {[
            { id: 'ca', name: 'CA & Tax Audit', icon: Building2, color: 'text-indigo-600' },
            { id: 'cooperative', name: 'Cooperative Banking', icon: Landmark, color: 'text-emerald-600' },
            { id: 'education', name: 'Education & Campus', icon: GraduationCap, color: 'text-blue-600' },
            { id: 'insurance', name: 'Insurance & Claims', icon: ShieldCheck, color: 'text-purple-600' }
          ].map(v => {
            const Icon = v.icon;
            const isSelected = selectedVertical === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVertical(v.id)}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? v.color : 'text-slate-400'}`} />
                <span className="truncate">{v.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subscription Status Bar */}
      <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
            <BadgeCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-slate-900">
                {currentVerticalMeta.name}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Official Razorpay Automated Billing
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentVerticalMeta.tagline}
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-semibold self-start sm:self-auto">
          Tax Invoicing: <strong className="text-slate-800">18% GST Input Credit Eligible</strong>
        </div>
      </div>

      {successNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold text-center animate-fadeIn shadow-sm">
          {successNotification}
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {currentTiers.map(tier => {
          const isRec = tier.recommended;

          return (
            <div
              key={tier.id}
              className={`bg-white rounded-2xl p-5 sm:p-6 border flex flex-col justify-between transition-all relative ${
                isRec 
                  ? 'border-indigo-600 ring-2 ring-indigo-600/30 shadow-lg' 
                  : 'border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {isRec && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  Recommended For Most {currentVerticalMeta.shortName}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-base">{tier.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                    {tier.capacity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 min-h-[30px]">{tier.idealFor}</p>

                {/* Price Display */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">{tier.priceINR}</span>
                  <span className="text-xs text-slate-500 font-medium">/{tier.period.replace('per ', '')}</span>
                </div>

                {/* Features List */}
                <ul className="mt-5 space-y-2.5 text-xs text-slate-600">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleOpenRazorpay(tier)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                    isRec 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20' 
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Subscribe via Razorpay</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Security Note */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-6 shadow-xs">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Official Razorpay Payment Gateway (PCI-DSS Level 1)
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <CreditCard className="w-4 h-4 text-indigo-600" />
          UPI, Google Pay, PhonePe, Debit/Credit Cards, NetBanking
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <Zap className="w-4 h-4 text-amber-500" />
          Instant activation with zero setup delays
        </span>
      </div>

      {/* Embedded Razorpay Modal */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        plan={selectedTierForCheckout}
        firm={activeFirm || { name: `${currentVerticalMeta.name} Organization`, email: 'admin@organization.in' }}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
