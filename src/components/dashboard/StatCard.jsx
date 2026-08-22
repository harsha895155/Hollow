import React from 'react';

export default function StatCard({ title, value, icon, isBlue, color, dark }) {
  return (
    <div
      className={`p-7 rounded-[32px] border transition-all duration-500 hover:translate-y-[-6px] ${
        isBlue
          ? 'bg-blue-600 border-blue-500 shadow-2xl shadow-blue-900/30 text-white'
          : dark
          ? 'bg-[#0d0d0f] border-white/5'
          : 'bg-white border-black/5 shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-3 rounded-2xl ${
            isBlue ? 'bg-white/20' : dark ? 'bg-white/5' : 'bg-black/5'
          }`}
        >
          {icon}
        </div>
      </div>
      <p className={`text-[10px] font-bold uppercase tracking-[0.2em] opacity-50`}>{title}</p>
      <h3 className={`text-2xl font-black mt-1 leading-tight tracking-tight ${!isBlue && color}`}>
        {value}
      </h3>
    </div>
  );
}
