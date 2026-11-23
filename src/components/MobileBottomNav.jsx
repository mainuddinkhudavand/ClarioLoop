import React from 'react';
import { 
  Home, 
  LayoutDashboard, 
  Users, 
  Smartphone, 
  Sparkles,
  FileCheck2
} from 'lucide-react';

export default function MobileBottomNav({ 
  currentView, 
  setCurrentView, 
  activeTab, 
  setActiveTab, 
  onOpenAI 
}) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2 flex items-center justify-around shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {/* 1. Home */}
      <button
        onClick={() => setCurrentView('home')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
          currentView === 'home' 
            ? 'text-indigo-600 font-extrabold scale-105' 
            : 'text-slate-500 hover:text-slate-900 font-semibold'
        }`}
      >
        <Home className="w-4 h-4" />
        <span className="text-[10px]">Home</span>
      </button>

      {/* 2. CA Workspace */}
      <button
        onClick={() => {
          setCurrentView('app');
          setActiveTab('dashboard');
        }}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
          currentView === 'app' && activeTab === 'dashboard' 
            ? 'text-indigo-600 font-extrabold scale-105' 
            : 'text-slate-500 hover:text-slate-900 font-semibold'
        }`}
      >
        <LayoutDashboard className="w-4 h-4" />
        <span className="text-[10px]">Overview</span>
      </button>

      {/* 3. Clients */}
      <button
        onClick={() => {
          setCurrentView('app');
          setActiveTab('clients');
        }}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
          currentView === 'app' && activeTab === 'clients' 
            ? 'text-indigo-600 font-extrabold scale-105' 
            : 'text-slate-500 hover:text-slate-900 font-semibold'
        }`}
      >
        <Users className="w-4 h-4" />
        <span className="text-[10px]">Clients</span>
      </button>

      {/* 4. Client Mobile Portal Preview */}
      <button
        onClick={() => setCurrentView('portal')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
          currentView === 'portal' 
            ? 'text-indigo-600 font-extrabold scale-105' 
            : 'text-slate-500 hover:text-slate-900 font-semibold'
        }`}
      >
        <div className="relative">
          <Smartphone className="w-4 h-4" />
          <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
        </div>
        <span className="text-[10px]">Client Link</span>
      </button>

      {/* 5. AI Copilot Scanner */}
      <button
        onClick={onOpenAI}
        className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-indigo-700 bg-indigo-50 font-bold transition-all border border-indigo-200/60"
      >
        <Sparkles className="w-4 h-4 text-indigo-600" />
        <span className="text-[10px]">AI Copilot</span>
      </button>
    </div>
  );
}
