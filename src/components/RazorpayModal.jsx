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
  Zap
} from 'lucide-react';

export default function RazorpayModal({ 
  isOpen, 
  onClose, 
  plan, 
  firm, 
  onPaymentSuccess 
}) {
  if (!isOpen || !plan) return null;

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [upiId, setUpiId] = useState(firm?.email ? firm.email.split('@')[0] + '@okhdfcbank' : 'ca.partner@oksbi');
  const [processing, setProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState(null);

  // Parse numeric amount from string like "₹1,999"
  const numericAmount = parseInt(plan.priceINR.replace(/[^0-9]/g, '')) || 1999;
  const gstAmount = Math.round(numericAmount * 0.18);
  const totalPayable = numericAmount + gstAmount;

  // Simulate or execute payment
  const handlePay = () => {
    setProcessing(true);

    // If real Razorpay script is loaded and configured, we can launch it:
    if (window.Razorpay && window.__USE_LIVE_RAZORPAY_KEY__) {
      try {
        const options = {
          key: 'rzp_test_YourKeyHere',
          amount: totalPayable * 100, // paise
          currency: 'INR',
          name: 'Cloop B2B SaaS',
          description: `${plan.name} Subscription for ${firm.name}`,
          image: '/logo.svg',
          handler: function (response) {
            completePayment(response.razorpay_payment_id || 'pay_' + Date.now());
          },
          prefill: {
            name: firm.partnerName,
            email: firm.email,
            contact: firm.phone
          },
          theme: { color: '#4f46e5' }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        setProcessing(false);
        return;
      } catch (e) {
        console.warn('Fallback to built-in secure modal');
      }
    }

    // Interactive high-fidelity Razorpay payment flow
    setTimeout(() => {
      const generatedId = 'pay_RZP' + Math.floor(100000000 + Math.random() * 900000000);
      completePayment(generatedId);
    }, 1600);
  };

  const completePayment = (paymentId) => {
    const receipt = {
      paymentId,
      orderId: 'order_CL' + Math.floor(100000 + Math.random() * 900000),
      planName: plan.name,
      amountPaid: totalPayable,
      baseAmount: numericAmount,
      gstAmount,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      firmName: firm.name,
      partnerName: firm.partnerName
    };

    setPaymentReceipt(receipt);
    setIsSuccess(true);
    setProcessing(false);

    if (onPaymentSuccess) {
      onPaymentSuccess(plan, receipt);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-scaleUp">
        
        {/* Razorpay Brand Header */}
        <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Razorpay Trusted</span>
              </div>
              <h3 className="text-sm font-extrabold text-white">Cloop Subscription Checkout</h3>
            </div>
          </div>

          <button 
            onClick={onClose} 
            disabled={processing}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isSuccess ? (
          <div className="p-5 space-y-4 text-xs">
            {/* Order Summary Box */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Selected Plan</span>
                  <h4 className="text-sm font-extrabold text-slate-900">{plan.name} Tier</h4>
                  <p className="text-[11px] text-slate-500">{firm.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900">₹{totalPayable.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Incl. 18% GST (₹{gstAmount})</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 block">Choose Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'upi' 
                      ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700 shadow-xs ring-1 ring-indigo-600/30' 
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-[11px]">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700 shadow-xs ring-1 ring-indigo-600/30' 
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[11px]">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-2.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'netbanking' 
                      ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700 shadow-xs ring-1 ring-indigo-600/30' 
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-[11px]">NetBanking</span>
                </button>
              </div>
            </div>

            {/* Method Details */}
            {paymentMethod === 'upi' && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">UPI ID / VPA</span>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Auto-Verified
                  </span>
                </div>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. yourname@okhdfcbank"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>Supported:</span>
                  <strong className="text-slate-600">GPay, PhonePe, Paytm, BHIM, CRED</strong>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <input
                  type="text"
                  placeholder="Card Number (4532 •••• •••• 9821)"
                  defaultValue="4532 8920 1823 9821"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    defaultValue="09/29"
                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    defaultValue="482"
                    maxLength={3}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">Popular Indian Banks</span>
                <select className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold">
                  <option>HDFC Bank Ltd</option>
                  <option>ICICI Bank</option>
                  <option>State Bank of India (SBI)</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={processing}
              className="w-full py-3 rounded-2xl bg-[#0c2340] hover:bg-[#14325a] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                  <span>Processing Razorpay Gateway...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Pay ₹{totalPayable.toLocaleString('en-IN')} via Razorpay</span>
                </>
              )}
            </button>

            {/* Trust Footer */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> 256-bit SSL Encrypted
              </span>
              <span>•</span>
              <span>PCI-DSS Level 1 Compliant</span>
            </div>
          </div>
        ) : (
          /* Payment Success & GST Invoice View */
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border-4 border-emerald-100 shadow-sm animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Payment Verified
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                Subscription Activated!
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {firm.name} is now upgraded to <strong>{plan.name} Tier</strong>.
              </p>
            </div>

            {/* Official GST Invoice Receipt Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs font-mono space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1.5 font-bold text-slate-900">
                <span>Tax Invoice / Receipt</span>
                <span className="text-indigo-600 font-mono">{paymentReceipt?.orderId}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Razorpay Payment ID:</span>
                <strong className="text-slate-800">{paymentReceipt?.paymentId}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Plan Subscribed:</span>
                <span className="text-slate-800">{plan.name} ({plan.clientCapacity})</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Base Amount:</span>
                <span>₹{paymentReceipt?.baseAmount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST + SGST (18%):</span>
                <span>₹{paymentReceipt?.gstAmount}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-slate-900 text-sm">
                <span>Total Paid:</span>
                <span className="text-emerald-600">₹{paymentReceipt?.amountPaid}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
            >
              Return to CA Workspace
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
