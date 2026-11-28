import React, { useState, useRef, useEffect } from 'react';
import { Camera, RotateCw, Sparkles, Check, X, UploadCloud } from 'lucide-react';

export default function DocumentScannerModal({ isOpen, onClose, onScanComplete, targetLabel = 'Document' }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [enhanced, setEnhanced] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [fileName, setFileName] = useState('scanned_document.jpg');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const isRotated = rotation % 180 !== 0;
      const maxDim = 1400;
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      canvas.width = isRotated ? h : w;
      canvas.height = isRotated ? w : h;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      if (enhanced) {
        ctx.filter = 'grayscale(100%) contrast(145%) brightness(108%)';
      } else {
        ctx.filter = 'none';
      }
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();
    };
    img.src = imageSrc;
  }, [imageSrc, enhanced, rotation]);

  if (!isOpen) return null;

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name.replace(/\.[^/.]+$/, '') + '_scanned.jpg');
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target?.result || null);
      setRotation(0);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveScan = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const scannedFile = new File([blob], fileName, { type: 'image/jpeg' });
        onScanComplete(scannedFile);
        setImageSrc(null);
        onClose();
      },
      'image/jpeg',
      0.88
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-scaleUp">
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black">Mobile Document Scanner</h3>
              <p className="text-[11px] text-slate-300 truncate max-w-[230px]">{targetLabel}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 text-xs">
          {!imageSrc ? (
            <label className="w-full py-10 px-4 rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <Camera className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-slate-900 text-sm">Take Photo or Choose Image</span>
              <span className="text-[11px] text-slate-500 text-center">
                Auto-enhances contrast, removes shadows, and compresses for fast upload
              </span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFilePick}
              />
            </label>
          ) : (
            <>
              <div className="bg-slate-950 rounded-2xl p-2 flex items-center justify-center max-h-[320px] overflow-hidden border border-slate-800">
                <canvas ref={canvasRef} className="max-h-[300px] max-w-full rounded-lg object-contain" />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEnhanced(!enhanced)}
                    className={`px-3 py-2 rounded-xl border font-bold flex items-center gap-1.5 ${
                      enhanced
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{enhanced ? 'Auto-Enhanced' : 'Original'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Rotate</span>
                  </button>
                </div>

                <label className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold cursor-pointer flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Retake</span>
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFilePick} />
                </label>
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!imageSrc}
              onClick={handleSaveScan}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Use Scanned Document</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
