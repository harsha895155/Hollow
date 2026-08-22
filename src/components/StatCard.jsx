import React from 'react';

export default function StatCard({ title, value, icon, isBlue, color, theme, isCompact }) {
  return (
    <div className={`${isCompact ? 'p-5' : 'p-8'} rounded-[32px] border transition-all duration-500 group ${isBlue ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-900/40 text-white' : theme.card}`}>
      <div className={`flex justify-between items-start ${isCompact ? 'mb-4' : 'mb-8'}`}>
        <div className={`${isCompact ? 'p-2' : 'p-3'} rounded-xl shadow-inner ${isBlue ? 'bg-white/10' : 'bg-indigo-500/10 text-indigo-400'}`}>{icon}</div>
      </div>
      <p className={`text-[9px] font-black uppercase tracking-[0.2em] opacity-40 ${isBlue && 'opacity-80'}`}>{title}</p>
      <h3 className={`${isCompact ? 'text-lg' : 'text-2xl'} font-black mt-1 leading-tight tracking-tighter ${!isBlue && color}`}>{value}</h3>
    </div>
  );
}
