import React from 'react';

export default function Logo({ size = 'default', showTagline = false, className = '', inverted = false }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 min-w-0 ${className}`}>
      {/* Official 3D Cloop Ribbon Infinity Trademark Logo */}
      <div className={`relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden drop-shadow-sm transition-transform hover:scale-105 duration-300 ${
        isLarge ? 'w-12 h-12' : isSmall ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-9 h-9'
      }`}>
        <img 
          src="/logo.png" 
          alt="Cloop Logo" 
          className="w-full h-full object-contain filter drop-shadow-xs"
          onError={(e) => {
            // Graceful SVG fallback if image is loading
            e.currentTarget.style.display = 'none';
            if (e.currentTarget.nextSibling) {
              e.currentTarget.nextSibling.style.display = 'block';
            }
          }}
        />
        {/* Hidden Fallback SVG */}
        <svg 
          viewBox="0 0 100 60" 
          className="w-full h-full hidden"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="fallbackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A3FF" />
              <stop offset="50%" stopColor="#0051FF" />
              <stop offset="100%" stopColor="#8A2BE2" />
            </linearGradient>
          </defs>
          <path 
            d="M 32,15 C 45,15 55,45 68,45 C 77,45 85,37 85,30 C 85,23 77,15 68,15 C 55,15 45,45 32,45 C 23,45 15,37 15,30 C 15,23 23,15 32,15 Z" 
            stroke="url(#fallbackGrad)" 
            strokeWidth="9" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>

      <div className="flex flex-col text-left min-w-0">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className={`font-black tracking-tight ${inverted ? 'text-white' : 'text-slate-900'} ${isLarge ? 'text-2xl' : isSmall ? 'text-base' : 'text-lg sm:text-xl'}`}>
            C<span className="text-indigo-500">loop</span>
          </span>
          <span className={`text-[9px] uppercase font-extrabold tracking-widest px-1.5 py-0.5 rounded-md shrink-0 ${
            inverted 
              ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/80' 
              : 'bg-indigo-50 text-indigo-700 border border-indigo-200/80'
          }`}>
            TM
          </span>
        </div>
        {showTagline && (
          <span className={`text-[10px] sm:text-[11px] font-medium truncate ${inverted ? 'text-slate-400' : 'text-slate-500'}`}>
            Automated Client Document Collection
          </span>
        )}
      </div>
    </div>
  );
}
