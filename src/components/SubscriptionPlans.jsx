import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Zap, 
  Clock,
  Lock,
  Building2
} from 'lucide-react';
import { subscriptionTiers } from '../data/mockData';
import RazorpayModal from './RazorpayModal';

export default function SubscriptionPlans({ activeFirm, onSubscriptionUpdated }) {
  const currentPlan = activeFirm?.subscription?.plan || 'PROFESSIONAL';
  const isTrial = activeFirm?.subscription?.status === 'TRIAL';
  const trialDays = activeFirm?.subscription?.trialDaysRemaining || 11;

  // Razorpay Checkout State
  const [selectedTierForCheckout, setSelectedTierForCheckout] = useState(null);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [successNotification, setSuccessNotification] = useState(null);

  const handleOpenRazorpay = (tier) => {
    setSelectedTierForCheckout(tier);
    setIsRazorpayOpen(true);
  };

  const handlePaymentSuccess = (tier, receipt) => {
    if (onSubscriptionUpdated) {
      onSubscriptionUpdated(activeFirm.id, {
        plan: tier.id,
        status: 'ACTIVE',
        trialDaysRemaining: 0,
        clientLimit: tier.id === 'STARTER' ? 10 : tier.id === 'BUSINESS' ? 100 : tier.id === 'ENTERPRISE' ? 300 : 30
      });
    }

    setSuccessNotification(`Payment verified! Razorpay Transaction ID: ${receipt.paymentId}. ${activeFirm.name} is now on ${tier.name} Plan.`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
          Integrated Razorpay Billing
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Subscribe to ClarioLoop for {activeFirm?.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Secure UPI, Debit/Credit Card, and NetBanking payments powered directly by Razorpay.
        </p>
      </div>

      {/* Subscription Status Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl border border-indigo-900/60 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                {activeFirm?.name}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                !isTrial ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700' : 'bg-amber-900/80 text-amber-300 border border-amber-700'
              }`}>
                {!isTrial ? 'Active Paid' : `${trialDays} Days Left in Free Trial`}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              Current Plan: {currentPlan} Tier ({activeFirm?.subscription?.clientLimit || 30} Client Limit)
            </h3>
          </div>
        </div>

        {isTrial && (
          <button
            onClick={() => handleOpenRazorpay(subscriptionTiers.find(t => t.id === 'PROFESSIONAL') || subscriptionTiers[1])}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/30 transition-all shrink-0 flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Pay via Razorpay & Activate</span>
          </button>
        )}
      </div>

      {successNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold text-center animate-fadeIn shadow-sm">
          {successNotification}
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {subscriptionTiers.map(tier => {
          const isCurrentActive = currentPlan === tier.id;
          const isRec = tier.recommended;

          return (
            <div
              key={tier.id}
              className={`bg-white rounded-2xl p-5 border flex flex-col justify-between transition-all relative ${
                isCurrentActive
                  ? 'border-emerald-600 ring-2 ring-emerald-600/30 shadow-lg'
                  : isRec 
                    ? 'border-indigo-600 ring-2 ring-indigo-600/30 shadow-lg' 
                    : 'border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {isRec && !isCurrentActive && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  Most Popular
                </div>
              )}

              {isCurrentActive && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  Current Firm Plan
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-base">{tier.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                    {tier.clientCapacity}
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
                      <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
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
                    isCurrentActive
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : isRec 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isCurrentActive ? `Renew ${tier.name}` : `Pay via Razorpay`}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Security Note */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-6">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          Official Razorpay Payment Gateway
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <CreditCard className="w-4 h-4 text-indigo-600" />
          UPI, Google Pay, PhonePe, Cards, NetBanking
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <Zap className="w-4 h-4 text-indigo-600" />
          Instant GST Tax Invoicing for {activeFirm?.name}
        </span>
      </div>

      {/* Embedded Razorpay Modal */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        plan={selectedTierForCheckout}
        firm={activeFirm}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
