import React from 'react';

export default function ReportMetric({ label, value, isDark, color = 'text-indigo-500' }) {
  return (
    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
      <p className="text-[9px] uppercase font-black tracking-widest opacity-40 mb-2">{label}</p>
      <h4 className={`text-2xl font-black ${color}`}>{value}</h4>
    </div>
  );
}
