import React from 'react';
import { 
  Home, 
  LayoutDashboard, 
  FileCheck2, 
  Smartphone, 
  Sparkles
} from 'lucide-react';

export default function MobileBottomNav({ 
  currentView, 
  setCurrentView, 
  activeTab, 
  setActiveTab, 
  onOpenAI 
}) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {/* 1. Home */}
      <button
        onClick={() => setCurrentView('home')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
          currentView === 'home' 
            ? 'text-indigo-600 font-extrabold scale-105' 
            : 'text-slate-500 hover:text-slate-900 font-semibold'
        }`}
      >
        <Home className="w-4 h-4" />
        <span className="text-[10px]">Home</span>
      </button>

      {/* 2. Workspace Overview */}
      <button
        onClick={() => {
          setCurrentView('app');
          setActiveTab('dashboard');
        }}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
          currentView === 'app' && activeTab === 'dashboard' 
            ? 'text-indigo-600 font-extrabold scale-105' 
            : 'text-slate-500 hover:text-slate-900 font-semibold'
        }`}
      >
        <LayoutDashboard className="w-4 h-4" />
        <span className="text-[10px]">Overview</span>
      </button>

      {/* 3. Requests Desk */}
      <button
        onClick={() => {
          setCurrentView('app');
          setActiveTab('requests');
        }}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
          currentView === 'app' && activeTab === 'requests' 
            ? 'text-indigo-600 font-extrabold scale-105' 
            : 'text-slate-500 hover:text-slate-900 font-semibold'
        }`}
      >
        <FileCheck2 className="w-4 h-4" />
        <span className="text-[10px]">Requests</span>
      </button>

      {/* 4. AI Copilot Scanner */}
      <button
        onClick={onOpenAI}
        className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-indigo-700 bg-indigo-50 font-bold transition-all border border-indigo-200/60"
      >
        <Sparkles className="w-4 h-4 text-indigo-600" />
        <span className="text-[10px]">AI Copilot</span>
      </button>

      {/* 5. Instagram-Style Profile Tab */}
      <button
        onClick={() => {
          setCurrentView('app');
          setActiveTab('profile');
        }}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
          currentView === 'app' && activeTab === 'profile'
            ? 'text-slate-950 font-black scale-105'
            : 'text-slate-500 hover:text-slate-900 font-semibold'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${
            currentView === 'app' && activeTab === 'profile'
              ? 'bg-indigo-600 text-white ring-2 ring-slate-900 ring-offset-1'
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          CA
        </div>
        <span className="text-[10px]">Profile</span>
      </button>
    </div>
  );
}
