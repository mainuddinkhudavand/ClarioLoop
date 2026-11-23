import React from 'react';

export default function Logo({ size = 'default', showTagline = false, className = '' }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Precision Geometric Infinity Loop with Vibrant Indigo-Violet-Cyan Flow */}
      <div className={`relative flex items-center justify-center shrink-0 ${isLarge ? 'w-11 h-11' : isSmall ? 'w-7 h-7' : 'w-8 h-8'}`}>
        <svg 
          viewBox="0 0 100 60" 
          className="w-full h-full drop-shadow-sm transition-transform hover:scale-105 duration-300"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="clarioInfinityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="nodeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
          </defs>
          
          {/* Continuous smooth infinity loop path */}
          <path 
            d="M 32,15 C 45,15 55,45 68,45 C 77,45 85,37 85,30 C 85,23 77,15 68,15 C 55,15 45,45 32,45 C 23,45 15,37 15,30 C 15,23 23,15 32,15 Z" 
            stroke="url(#clarioInfinityGrad)" 
            strokeWidth="9" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Active Flow Pulse Nodes */}
          <circle cx="68" cy="30" r="3.5" fill="url(#nodeGlow)" />
          <circle cx="32" cy="30" r="3.5" fill="#4F46E5" />
        </svg>
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-slate-900 ${isLarge ? 'text-2xl' : isSmall ? 'text-base' : 'text-xl'}`}>
            C<span className="text-indigo-600">loop</span>
          </span>
          <span className="text-[9px] uppercase font-extrabold tracking-widest px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/80">
            AI
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-500 font-medium">
            Automated Client Document Collection
          </span>
        )}
      </div>
    </div>
  );
}
