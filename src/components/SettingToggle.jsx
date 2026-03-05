import React from 'react';

export default function SettingToggle({ icon, title, desc, active, onToggle, isDark }) {
  return (
    <div className={`flex items-center justify-between p-5 rounded-2xl ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">{icon}</div>
        <div>
          <p className="text-sm font-black uppercase tracking-tight">{title}</p>
          <p className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">{desc}</p>
        </div>
      </div>
      <button onClick={onToggle} className={`w-12 h-6 rounded-full p-1 transition-all ${active ? 'bg-indigo-600' : 'bg-slate-700'}`}>
        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
