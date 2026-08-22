import React from 'react';

export default function SidebarItem({ icon, label, active, onClick, isOpen, isDark }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${active ? (isDark ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10' : 'bg-indigo-600 text-white shadow-md') : (isDark ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100')} ${!isOpen && 'justify-center'}`}>
      {icon}
      {isOpen && <span className="font-black text-[10px] uppercase tracking-widest">{label}</span>}
    </button>
  );
}
