import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Building2, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Zap,
  Sparkles,
  Check,
  Download,
  Clock,
  Award
} from 'lucide-react';

export default function RazorpayModal({ 
  isOpen, 
  onClose, 
  plan, 
  planTier,
  firm, 
  firmName,
  firmEmail,
  onPaymentSuccess,
  onSuccess 
}) {
  const activePlan = plan || planTier;
  const activeFirm = firm || {
    name: firmName || 'Your Practice / Company',
    partnerName: 'Managing Partner',
    email: firmEmail || 'billing@firm.in',
    phone: '+91 98765 43210'
  };
  const handleSuccessCallback = onPaymentSuccess || onSuccess;

  if (!isOpen || !activePlan) return null;

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [upiId, setUpiId] = useState(activeFirm?.email ? activeFirm.email.split('@')[0] + '@okhdfcbank' : 'partner@okhdfcbank');
  const [showQR, setShowQR] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState(null);

  // Parse numeric amount
  const numericAmount = parseInt((activePlan.priceINR || '1999').replace(/[^0-9]/g, '')) || 1999;
  const gstAmount = Math.round(numericAmount * 0.18);
  const totalPayable = numericAmount + gstAmount;

  const handlePay = () => {
    setProcessing(true);

    setTimeout(() => {
      const generatedId = 'pay_RZP' + Math.floor(100000000 + Math.random() * 900000000);
      const receipt = {
        paymentId: generatedId,
        orderId: 'order_CL' + Math.floor(100000 + Math.random() * 900000),
        planName: activePlan.name,
        amountPaid: totalPayable,
        baseAmount: numericAmount,
        gstAmount,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        firmName: activeFirm.name,
        partnerName: activeFirm.partnerName
      };

      setPaymentReceipt(receipt);
      setIsSuccess(true);
      setProcessing(false);

      if (handleSuccessCallback) {
        handleSuccessCallback(activePlan, receipt);
      }
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-indigo-200/80 overflow-hidden flex flex-col my-auto max-h-[96vh] overflow-y-auto animate-scaleUp">
        
        {/* ================= COLORFUL GRADIENT HEADER ================= */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white p-5 sm:p-6 relative overflow-hidden">
          {/* Subtle glowing background ambient balls */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center font-black text-white shadow-md">
                <Zap className="w-6 h-6 text-amber-300 fill-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-200 bg-cyan-900/60 px-2 py-0.5 rounded-full border border-cyan-400/30">
                    Razorpay Verified
                  </span>
                  <span className="text-[10px] text-white/80 font-bold hidden sm:inline">
                    🔒 256-Bit SSL
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                  Secure Checkout • Cloop™
                </h3>
              </div>
            </div>

            <button 
              onClick={onClose} 
              disabled={processing}
              className="p-2 text-white/80 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 transition-all shrink-0"
              title="Close Checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Plan Banner inside Header */}
          <div className="relative mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-900 font-extrabold text-[11px] shadow-sm">
                {activePlan.name} Tier
              </span>
              <span className="text-white/90 font-medium truncate max-w-[180px]">
                {activeFirm.name}
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-white">₹{totalPayable.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-cyan-200 block">incl. 18% GST</span>
            </div>
          </div>
        </div>

        {/* ================= BODY CONTENT ================= */}
        {!isSuccess ? (
          <div className="p-4 sm:p-6 space-y-4 text-xs">
            
            {/* Colorful Order Details Summary */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-blue-50/80 border border-indigo-200/80 space-y-2">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold">Base Subscription ({activePlan.period || 'Monthly'}):</span>
                <strong className="text-slate-900 font-bold">₹{numericAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold">Statutory GST (CGST 9% + SGST 9%):</span>
                <span className="text-slate-600">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-indigo-200/60 flex items-center justify-between text-slate-900">
                <div>
                  <span className="text-xs font-black block">Total Amount Payable:</span>
                  <span className="text-[10px] text-indigo-600 font-semibold">Immediate access & tax invoice</span>
                </div>
                <span className="text-xl font-black bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                  ₹{totalPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Plan Perks Strip */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
              <div className="flex items-center gap-1.5 p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-semibold">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{activePlan.clientCapacity || 'Up to 30 Clients'}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-blue-50 text-blue-800 rounded-xl border border-blue-200 font-semibold">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>AI Invoice Scanner</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-purple-50 text-purple-800 rounded-xl border border-purple-200 font-semibold">
                <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>WhatsApp Follow-ups</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 font-semibold">
                <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Dedicated CA Isolation</span>
              </div>
            </div>

            {/* Colorful Payment Method Selector Tabs */}
            <div className="space-y-2 pt-1">
              <label className="font-extrabold text-slate-900 block text-xs">
                Select Your Payment Method:
              </label>

              <div className="grid grid-cols-3 gap-2">
                {/* Method 1: UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-2xl border-2 font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-indigo-600" />
                  <span className="text-xs font-extrabold">Instant UPI</span>
                  <span className="text-[9px] text-indigo-600/80 font-bold bg-indigo-100/70 px-1.5 py-0.2 rounded">Zero Fee</span>
                </button>

                {/* Method 2: Cards */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border-2 font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-extrabold">Cards</span>
                  <span className="text-[9px] text-blue-600/80 font-bold bg-blue-100/70 px-1.5 py-0.2 rounded">Visa/Master</span>
                </button>

                {/* Method 3: NetBanking */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-2xl border-2 font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-md ring-2 ring-purple-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-extrabold">NetBanking</span>
                  <span className="text-[9px] text-purple-600/80 font-bold bg-purple-100/70 px-1.5 py-0.2 rounded">All Banks</span>
                </button>
              </div>
            </div>

            {/* TAB 1: UPI Details */}
            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 text-xs">Enter UPI ID / VPA</span>
                  <button
                    type="button"
                    onClick={() => setShowQR(!showQR)}
                    className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-white px-2 py-1 rounded-lg border border-indigo-200 flex items-center gap-1 shadow-2xs"
                  >
                    <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{showQR ? 'Hide QR' : 'Show Dynamic QR'}</span>
                  </button>
                </div>

                {showQR ? (
                  <div className="p-4 bg-white rounded-xl border border-indigo-200 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="w-32 h-32 bg-slate-100 p-2 rounded-xl border border-slate-300 flex items-center justify-center shadow-inner">
                      <QrCode className="w-24 h-24 text-slate-800" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700">
                      Scan with any UPI App to Pay ₹{totalPayable.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400">GPay • PhonePe • Paytm • BHIM • CRED</span>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank"
                      className="w-full p-3 bg-white border border-indigo-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-xs"
                    />

                    {/* Supported UPI Apps Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400">Supported:</span>
                      <span className="text-[10px] font-bold bg-white text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">Google Pay</span>
                      <span className="text-[10px] font-bold bg-white text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md">PhonePe</span>
                      <span className="text-[10px] font-bold bg-white text-sky-700 border border-sky-200 px-2 py-0.5 rounded-md">Paytm</span>
                      <span className="text-[10px] font-bold bg-white text-orange-700 border border-orange-200 px-2 py-0.5 rounded-md">BHIM</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 2: Card Details */}
            {paymentMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 text-xs">Debit / Credit Card</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded">VISA</span>
                    <span className="text-[9px] font-black bg-rose-600 text-white px-1.5 py-0.5 rounded">MC</span>
                    <span className="text-[9px] font-black bg-emerald-600 text-white px-1.5 py-0.5 rounded">RuPay</span>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Card Number (4532 •••• •••• 9821)"
                  defaultValue="4532 8920 1823 9821"
                  className="w-full p-3 bg-white border border-blue-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    defaultValue="09/29"
                    className="p-2.5 bg-white border border-blue-200 rounded-xl text-xs font-mono font-bold text-center"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    defaultValue="482"
                    maxLength={3}
                    className="p-2.5 bg-white border border-blue-200 rounded-xl text-xs font-mono font-bold text-center"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: NetBanking */}
            {paymentMethod === 'netbanking' && (
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-2.5">
                <span className="font-extrabold text-slate-800 block text-xs">Select Indian Commercial Bank</span>
                <select className="w-full p-3 bg-white border border-purple-200 rounded-xl text-xs font-bold text-slate-800 shadow-xs">
                  <option>HDFC Bank Ltd</option>
                  <option>ICICI Bank Ltd</option>
                  <option>State Bank of India (SBI)</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                  <option>Bank of Baroda</option>
                  <option>Punjab National Bank</option>
                </select>
              </div>
            )}

            {/* Pay Button (Vibrant & Animated) */}
            <button
              onClick={handlePay}
              disabled={processing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {processing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Processing Razorpay Gateway...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-emerald-300" />
                  <span>Pay ₹{totalPayable.toLocaleString('en-IN')} via Razorpay</span>
                  <ArrowRight className="w-4 h-4 text-white/80" />
                </>
              )}
            </button>

            {/* Trust Footer */}
            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 pt-1">
              <span className="flex items-center gap-1 font-bold text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> 256-bit Bank Grade SSL
              </span>
              <span>•</span>
              <span className="font-semibold">PCI-DSS Level 1 Compliant</span>
            </div>
          </div>
        ) : (
          /* ================= COLORFUL SUCCESS & GST TAX INVOICE SCREEN ================= */
          <div className="p-6 text-center space-y-5 bg-gradient-to-b from-emerald-50/70 via-teal-50/40 to-white">
            
            <div className="relative mx-auto w-16 h-16">
              <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-xl animate-pulse" />
              <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full">
                ✓ Payment Verified & Activated
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                Welcome to {paymentReceipt?.planName} Plan!
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                <strong>{activeFirm.name}</strong> is now upgraded with full automation capabilities.
              </p>
            </div>

            {/* Colorful GST Tax Invoice Receipt Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-md text-left text-xs font-mono space-y-2.5">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">OFFICIAL GST TAX INVOICE</span>
                  <strong className="text-indigo-600 text-xs font-mono">{paymentReceipt?.orderId}</strong>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-md border border-emerald-200">
                  PAID
                </span>
              </div>

              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Razorpay Payment ID:</span>
                <strong className="text-slate-900">{paymentReceipt?.paymentId}</strong>
              </div>

              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Firm Account:</span>
                <span className="text-slate-900 font-bold">{paymentReceipt?.firmName}</span>
              </div>

              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Base Subscription:</span>
                <span>₹{paymentReceipt?.baseAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>GST (CGST 9% + SGST 9%):</span>
                <span>₹{paymentReceipt?.gstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900 text-sm">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-600 font-black">₹{paymentReceipt?.amountPaid.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Upgraded Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
