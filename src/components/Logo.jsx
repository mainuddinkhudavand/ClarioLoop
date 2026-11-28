import React from 'react';

export default function Logo({ size = 'default', showTagline = false, className = '', inverted = false }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 min-w-0 ${className}`}>
      {/* Official 3D ClarioLoop Ribbon Infinity Trademark Logo */}
      <div className={`relative flex items-center justify-center shrink-0 rounded-full overflow-hidden drop-shadow-sm transition-transform hover:scale-105 duration-300 ${
        inverted ? 'bg-white p-0.5 ring-2 ring-white/20' : 'bg-white ring-1 ring-slate-200/80'
      } ${
        isLarge ? 'w-12 h-12' : isSmall ? 'w-8 h-8' : 'w-9 h-9'
      }`}>
        <img 
          src="/logo.png" 
          alt="ClarioLoop Logo" 
          className="w-full h-full object-cover rounded-full"
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
        <div className="flex items-center">
          <span className={`font-black tracking-tight ${inverted ? 'text-white' : 'text-slate-900'} ${isLarge ? 'text-2xl' : isSmall ? 'text-base' : 'text-lg sm:text-xl'}`}>
            Clario<span className="text-indigo-600">Loop</span>
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
