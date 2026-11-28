import React, { useRef, useState } from 'react';
import { PenTool, Check, RotateCcw, X, ShieldCheck } from 'lucide-react';

export default function SignaturePadModal({
  isOpen,
  onClose,
  onSignComplete,
  title = 'Digital Consent & Undertaking',
  statement = 'I hereby confirm that all uploaded documents are genuine, accurate, and authorized for compliance verification.'
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signerName, setSignerName] = useState('');

  if (!isOpen) return null;

  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const startDraw = (e) => {
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (e.touches) e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => setIsDrawing(false);

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirm = () => {
    if (!hasDrawn && !signerName.trim()) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onSignComplete({
      signerName: signerName.trim() || 'Authorized Signatory',
      signatureDataUrl: dataUrl,
      signedAt: new Date().toLocaleString('en-IN')
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-scaleUp">
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black">{title}</h3>
              <p className="text-[11px] text-slate-300">Timestamped Digital Sign-Off</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
            {statement}
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Name of Signatory *</label>
            <input
              type="text"
              placeholder="e.g. Vikram Mehta"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Draw Signature Below</label>
              <button
                type="button"
                onClick={handleClear}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            </div>
            <canvas
              ref={canvasRef}
              width={460}
              height={150}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
              className="w-full h-36 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 touch-none cursor-crosshair"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Audit timestamp recorded
            </span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold">
                Cancel
              </button>
              <button
                type="button"
                disabled={!hasDrawn && !signerName.trim()}
                onClick={handleConfirm}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Sign & Submit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
