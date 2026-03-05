import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  LayoutDashboard, Receipt, FileText, Settings,
  Plus, Menu, X, ArrowUpRight, ArrowDownRight,
  CreditCard, TrendingUp, Moon, Sun, Globe, Layers,
  CheckCircle2, FileDown, Printer, Trash2
} from 'lucide-react';

const COLORS = ['#6366f1','#a855f7','#ec4899','#f97316','#10b981','#06b6d4','#4f46e5'];
const CATEGORIES = ['General','Food','Transport','Shopping','Utilities','Health','Entertainment','Salary','Freelance','Investment'];

// ── Theme helper ──────────────────────────────────────────────────────────────
function getTheme(dark) {
  return {
    bg:      dark ? 'bg-transparent'                        : 'bg-transparent',
    card:    dark ? 'bg-[#0f172a]/80 backdrop-blur-3xl border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.15)] hover:border-indigo-400/50 transition-all' : 'bg-white/40 backdrop-blur-3xl border-white/60 shadow-[0_0_40px_rgba(124,58,237,0.2)]',
    sidebar: dark ? 'bg-slate-950/80 backdrop-blur-3xl border-r border-indigo-500/20' : 'bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-500 text-white border-transparent shadow-2xl',
    header:  dark ? 'bg-slate-950/40 border-b border-indigo-500/20 backdrop-blur-2xl' : 'bg-white/20 border-white/30 backdrop-blur-2xl',
    input:   dark ? 'bg-slate-900 border-indigo-500/30 text-white shadow-[0_0_20px_rgba(79,70,229,0.1)]' : 'bg-white/80 border-indigo-200 text-slate-900 shadow-xl',
    text:    dark ? 'text-indigo-50'  : 'text-indigo-950',
    muted:   dark ? 'text-indigo-400' : 'text-indigo-600',
    border:  dark ? 'border-indigo-500/20': 'border-white/40',
    hover:   dark ? 'hover:bg-indigo-500/10' : 'hover:bg-white/60',
    prefRow: dark ? 'bg-slate-900/60 border border-indigo-500/20 shadow-lg' : 'bg-white/60 border border-white shadow-xl',
  };
}

// ── Components ────────────────────────────────────────────────────────────────
function NavItem({ icon, label, active, onClick, open, dark }) {
  const base = 'w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest border-2';
  const style = active
    ? (dark ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-[0_0_25px_rgba(99,102,241,0.5)] scale-105' : 'bg-white text-indigo-600 border-white shadow-2xl scale-105')
    : (dark ? 'text-indigo-300/60 hover:text-white hover:bg-white/5 border-transparent' : 'text-white/80 hover:text-white hover:bg-white/20 border-transparent text-shadow');
  
  return (
    <button onClick={onClick} className={`${base} ${style} ${!open ? 'justify-center' : ''}`}>
      <div className={`${active ? 'scale-110' : ''}`}>
        {icon}
      </div>
      {open && <span>{label}</span>}
    </button>
  );
}

function StatCard({ title, value, icon, blue, color, dark, compact }) {
  const pad = compact ? 'p-5' : 'p-7';
  const mb  = compact ? 'mb-4' : 'mb-7';
  const sz  = compact ? 'text-lg' : 'text-2xl';

  // Light theme colorful variants
  const lightBg = title === 'Income' ? 'bg-emerald-50/80 border-emerald-100 shadow-emerald-100/30' :
                  title === 'Expenses' ? 'bg-rose-50/80 border-rose-100 shadow-rose-100/30' :
                  title === 'Savings' ? 'bg-cyan-50/80 border-cyan-100 shadow-cyan-100/30' :
                  'bg-white border-white shadow-indigo-100/30';

  const bg = blue
    ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-900/30 text-white'
    : (dark ? 'bg-[#1e293b]/60 border-[#1e293b]' : `${lightBg} shadow-xl backdrop-blur-md`);

  const iconBg = blue ? 'bg-white/15' : (dark ? 'bg-indigo-500/10 text-indigo-400' :
                 title === 'Income' ? 'bg-emerald-500/15 text-emerald-600' :
                 title === 'Expenses' ? 'bg-rose-500/15 text-rose-600' :
                 title === 'Savings' ? 'bg-cyan-500/15 text-cyan-600' :
                 'bg-indigo-500/15 text-indigo-600');

  return (
    <div className={`${pad} rounded-[28px] border transition-all duration-500 ${bg}`}>
      <div className={`${mb} flex items-start`}>
        <div className={`p-3 rounded-xl ${iconBg}`}>{icon}</div>
      </div>
      <p className={`text-[9px] font-black uppercase tracking-[.2em] ${blue ? 'opacity-80' : (dark ? 'opacity-40' : 'text-indigo-950/40')}`}>{title}</p>
      <h3 className={`${sz} font-black mt-1 leading-tight tracking-tighter ${!blue && color}`}>{value}</h3>
    </div>
  );
}

function TxItem({ tx, sym, onDelete, full, dark }) {
  const pos = tx.amount > 0;
  return (
    <div className={`flex items-center justify-between p-4 rounded-[22px] border transition-all duration-300 group ${dark ? 'bg-slate-900/60 border-indigo-500/10 hover:border-indigo-400/40 hover:scale-[1.02] shadow-[0_10px_30px_rgba(0,0,0,0.2)]' : 'bg-white/90 border-white hover:border-purple-400 hover:scale-[1.03] shadow-xl shadow-indigo-500/5'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg ${dark ? 'bg-indigo-500/10 text-indigo-400 shadow-[inset_0_0_15px_rgba(99,102,241,0.1)]' : 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-indigo-200'}`}>{tx.icon}</div>
        <div>
          <p className={`text-xs font-black uppercase tracking-tight ${dark ? 'text-indigo-50' : ''}`}>{tx.name}</p>
          {full && <p className={`text-[9px] opacity-40 mt-0.5 font-black ${dark ? 'text-indigo-400' : 'text-purple-600'}`}>{tx.date} · {tx.category}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className={`text-[11px] font-black ${pos ? (dark ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-2xl' : 'bg-emerald-500 text-white px-4 py-2 rounded-2xl shadow-lg shadow-emerald-200') : (dark ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-2 rounded-2xl' : 'bg-rose-500 text-white px-4 py-2 rounded-2xl shadow-lg shadow-rose-200')}`}>
          {pos ? '+' : '-'}{sym}{Math.abs(tx.amount).toLocaleString('en-IN')}
        </p>
        <button onClick={() => onDelete(tx.id)} className="opacity-0 group-hover:opacity-70 hover:!opacity-100 text-rose-400 flex items-center transition-opacity">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} className={`w-12 h-6 rounded-full p-1 transition-colors ${on ? 'bg-indigo-600' : 'bg-slate-700'}`}>
      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${on ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );
}

function PrefRow({ icon, title, desc, children, dark }) {
  return (
    <div className={`flex items-center justify-between p-5 rounded-2xl ${dark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">{icon}</div>
        <div>
          <p className="text-sm font-black uppercase tracking-tight">{title}</p>
          {desc && <p className="text-[9px] opacity-40 uppercase tracking-tight mt-0.5">{desc}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [entryOpen, setEntryOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  // Settings
  const [dark, setDark] = useState(false);
  const [compact, setCompact] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const sym = currency === 'INR' ? '₹' : '$';

  // New entry form
  const [form, setForm] = useState({ name: '', amount: '', type: 'expense', category: 'General' });

  const t = getTheme(dark);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 2800);
  };

  const downloadCSV = () => {
    if (transactions.length === 0) {
      showToast('No data to export');
      return;
    }
    const headers = 'Date,Name,Category,Type,Amount\n';
    const csv = transactions.map(t => `${t.date},"${t.name}",${t.category},${t.type},${t.amount}`).join('\n');
    const blob = new Blob([headers + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hollow_Intelligence_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Report Exported Successfully');
  };

  const metrics = useMemo(() => {
    const income  = transactions.filter(x => x.type === 'income').reduce((s, x) => s + x.amount, 0);
    const expense = Math.abs(transactions.filter(x => x.type === 'expense').reduce((s, x) => s + x.amount, 0));
    const balance = income - expense;
    const savings = income > 0 ? (((income - expense) / income) * 100).toFixed(1) : 0;
    const cats = {};
    transactions.forEach(x => {
      if (x.type === 'expense') cats[x.category] = (cats[x.category] || 0) + Math.abs(x.amount);
    });
    const pieData = Object.keys(cats).map(name => ({ name, value: cats[name] }));
    const topCat = Object.keys(cats).reduce((a, b) => cats[a] > cats[b] ? a : b, 'General');
    return { income, expense, balance, savings, pieData, topCat, count: transactions.length };
  }, [transactions]);

  const addEntry = (e) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.name.trim() || isNaN(amount) || amount <= 0) return;
    const entry = {
      id: Date.now(),
      name: form.name.trim(),
      amount: form.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      category: form.category,
      type: form.type,
      date: new Date().toLocaleDateString('en-IN'),
      icon: form.type === 'income' ? '💰' : '💸',
    };
    setTransactions(prev => [entry, ...prev]);
    setForm({ name: '', amount: '', type: 'expense', category: 'General' });
    setEntryOpen(false);
    showToast('Record Added');
  };

  const deleteTx = (id) => {
    setTransactions(prev => prev.filter(x => x.id !== id));
    showToast('Entry Deleted');
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={`flex h-screen overflow-hidden font-sans ${t.bg} ${t.text} transition-colors duration-300 relative`}>
      <style>{`
        * { scrollbar-width: none !important; -ms-overflow-style: none !important; }
        *::-webkit-scrollbar { display: none !important; }
        @keyframes cyber-glow {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `}</style>
      
      {/* Dynamic Nebula background for both themes */}
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        {dark ? (
          /* Cyber-Nebula for Dark Theme */
          <div className="absolute inset-0 bg-[#020617]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-[#0a0f2b] to-[#120a2b] animate-[cyber-glow_15s_ease_infinite] bg-[length:200%_200%]" />
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[160px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[160px] animate-pulse" />
            <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[140px]" />
            <div className="absolute bottom-[20%] left-[5%] w-[35%] h-[35%] bg-cyan-600/10 rounded-full blur-[120px]" />
          </div>
        ) : (
          /* Infinite Spectrum for Light Theme */
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 via-pink-500 to-yellow-400 animate-[rainbow_10s_linear_infinite] bg-[length:200%_200%] opacity-40">
            <style>{`
              @keyframes rainbow {
                0% { background-position: 0% 50% }
                50% { background-position: 100% 50% }
                100% { background-position: 0% 50% }
              }
            `}</style>
            <div className="absolute top-0 left-0 w-full h-full backdrop-blur-[80px]" />
          </div>
        )}
      </div>

      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]">
          <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20">
            <CheckCircle2 size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">{toast.msg}</span>
          </div>
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-[76px]'} border-r flex flex-col flex-shrink-0 transition-all duration-300 z-40 print:hidden ${t.sidebar}`}>
        <div className="p-7 flex items-center gap-3 overflow-hidden">
          <div className={`w-10 h-10 ${!dark ? 'bg-white' : 'bg-indigo-600'} rounded-xl flex items-center justify-center shrink-0 shadow-lg ${!dark ? 'shadow-white/20' : 'shadow-indigo-500/25'}`}>
            <span className={`font-black ${!dark ? 'text-indigo-600' : 'text-white'} text-xl italic underline decoration-2`}>H</span>
          </div>
          {sidebarOpen && (
            <span className={`font-black text-lg tracking-tight bg-clip-text text-transparent ${dark ? 'bg-gradient-to-r from-indigo-400 to-indigo-600' : 'bg-gradient-to-r from-white to-white/80'} uppercase whitespace-nowrap`}>
              Hollow
            </span>
          )}
        </div>
        <nav className="flex-1 px-3 flex flex-col gap-2">
          <NavItem icon={<LayoutDashboard size={19}/>} label="Dashboard" active={tab==='Dashboard'} onClick={()=>setTab('Dashboard')} open={sidebarOpen} dark={dark}/>
          <NavItem icon={<Receipt size={19}/>}         label="Ledger"    active={tab==='Transactions'} onClick={()=>setTab('Transactions')} open={sidebarOpen} dark={dark}/>
          <NavItem icon={<FileText size={19}/>}        label="Report"    onClick={()=>setReportOpen(true)} open={sidebarOpen} dark={dark}/>
          <NavItem icon={<Settings size={19}/>}        label="Settings"  active={tab==='Settings'} onClick={()=>setTab('Settings')} open={sidebarOpen} dark={dark}/>
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`h-[72px] border-b flex items-center justify-between px-7 backdrop-blur-xl z-30 flex-shrink-0 print:hidden ${t.header}`}>
          <div className="flex items-center gap-4">
            <button onClick={()=>setSidebarOpen(!sidebarOpen)} className={`p-2 rounded-lg ${t.hover} ${t.muted} transition-colors`}>
              <Menu size={22}/>
            </button>
            <h2 className="text-[10px] font-black tracking-[.2em] opacity-50 uppercase">{tab}</h2>
          </div>
          <button onClick={()=>setEntryOpen(true)} className={`${dark ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:scale-[1.02]'} text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 shadow-lg ${dark ? 'shadow-indigo-600/25' : 'shadow-purple-500/30'}`}>
            <Plus size={15}/> New Entry
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-7">
          <div className="max-w-7xl mx-auto">

            {/* ── Dashboard ── */}
            {tab === 'Dashboard' && (
              <div className="space-y-7">
                <div className={`grid gap-5 ${compact ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
                  <StatCard title="Liquidity" value={`${sym}${metrics.balance.toLocaleString('en-IN')}`} icon={<CreditCard size={17}/>} blue dark={dark} compact={compact}/>
                  <StatCard title="Income"    value={`${sym}${metrics.income.toLocaleString('en-IN')}`}   icon={<ArrowUpRight size={17}/>} color="text-indigo-400" dark={dark} compact={compact}/>
                  <StatCard title="Expenses"  value={`${sym}${metrics.expense.toLocaleString('en-IN')}`}  icon={<ArrowDownRight size={17}/>} color="text-rose-400" dark={dark} compact={compact}/>
                  <StatCard title="Savings"   value={`${metrics.savings}%`}                               icon={<TrendingUp size={17}/>} color="text-emerald-400" dark={dark} compact={compact}/>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Pie Chart */}
                  <div className={`lg:col-span-2 border rounded-[26px] p-7 ${t.card}`}>
                    <h3 className="text-[11px] font-black uppercase tracking-[.1em] mb-7 text-indigo-400">Capital Allocation</h3>
                    <div className="h-[280px] w-full">
                      {metrics.pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={metrics.pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={105} paddingAngle={6} dataKey="value" stroke="none">
                              {metrics.pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                            </Pie>
                            <Tooltip contentStyle={{ background: dark ? '#1e293b' : '#fff', border: 'none', borderRadius: 14, fontSize: 12 }}/>
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center opacity-20 italic text-[10px] font-black uppercase tracking-[.3em]">
                          No Outflow Recorded
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent */}
                  <div className={`border rounded-[26px] p-7 ${t.card}`}>
                    <h3 className="text-[11px] font-black uppercase tracking-[.1em] mb-5">Recent Ledger</h3>
                    <div className="space-y-3 max-h-[310px] overflow-y-auto">
                      {transactions.length === 0
                        ? <div className="text-center py-12 opacity-20 text-[10px] font-black uppercase tracking-[.2em] italic">NULL_DATA</div>
                        : transactions.slice(0, 6).map(tx => <TxItem key={tx.id} tx={tx} sym={sym} onDelete={deleteTx} dark={dark}/>)
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Ledger ── */}
            {tab === 'Transactions' && (
              <div className={`border rounded-[26px] p-7 ${t.card}`}>
                <h3 className="text-lg font-black uppercase tracking-tighter mb-7">Master Ledger</h3>
                <div className="space-y-3">
                  {transactions.length === 0
                    ? <div className="text-center py-16 opacity-20 text-[10px] font-black uppercase tracking-[.2em] italic">NULL_DATA</div>
                    : transactions.map(tx => <TxItem key={tx.id} tx={tx} sym={sym} onDelete={deleteTx} full dark={dark}/>)
                  }
                </div>
              </div>
            )}

            {/* ── Settings ── */}
            {tab === 'Settings' && (
              <div className="max-w-xl space-y-5">
                <div className={`border rounded-[26px] p-7 ${t.card}`}>
                  <h3 className="text-[11px] font-black uppercase tracking-[.1em] text-indigo-400 mb-6">System Preferences</h3>
                  <div className="space-y-3">
                    <PrefRow icon={dark ? <Moon size={17}/> : <Sun size={17}/>} title="Night Mode" desc="Switch between Light and Dark" dark={dark}>
                      <Toggle on={dark} onToggle={()=>setDark(!dark)}/>
                    </PrefRow>
                    <PrefRow icon={<Layers size={17}/>} title="Compact Layout" desc="High density data view" dark={dark}>
                      <Toggle on={compact} onToggle={()=>setCompact(!compact)}/>
                    </PrefRow>
                    <PrefRow icon={<Globe size={17}/>} title="Currency Unit" dark={dark}>
                      <select
                        value={currency}
                        onChange={e=>setCurrency(e.target.value)}
                        className={`bg-transparent border rounded-xl px-4 py-2 text-[11px] font-black outline-none ${t.border} ${t.text}`}
                      >
                        <option value="INR" className="bg-slate-900">INR (₹)</option>
                        <option value="USD" className="bg-slate-900">USD ($)</option>
                      </select>
                    </PrefRow>
                  </div>
                </div>

                <div className={`border border-rose-500/30 rounded-[26px] p-7 ${dark ? 'bg-rose-500/5' : 'bg-rose-50'}`}>
                  <h3 className="text-[15px] font-black text-rose-500 uppercase mb-2">Danger Zone</h3>
                  <p className="text-[10px] opacity-50 uppercase tracking-wider mb-5">All data will be permanently purged.</p>
                  <button
                    onClick={()=>{ if(window.confirm('Purge ALL data? This cannot be undone.')) { setTransactions([]); showToast('System Purged'); } }}
                    className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-[.2em] rounded-xl transition-colors"
                  >
                    Initiate Wipe Sequence
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Entry Modal ── */}
      {entryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl" onClick={e=>e.target===e.currentTarget&&setEntryOpen(false)}>
          <div className={`w-full max-w-md border rounded-[34px] p-9 shadow-2xl ${t.card}`}>
            <div className="flex justify-between items-center mb-7">
              <h3 className="text-xl font-black uppercase tracking-tighter">New Entry</h3>
              <button onClick={()=>setEntryOpen(false)} className={t.muted}><X size={22}/></button>
            </div>
            <form onSubmit={addEntry} className="space-y-4">
              <input
                required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                className={`w-full border rounded-2xl p-4 outline-none text-sm font-bold ${t.input}`}
                placeholder="Description"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required type="number" min="0.01" step="0.01" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}
                  className={`w-full border rounded-2xl p-4 outline-none text-sm font-bold ${t.input}`}
                  placeholder="0.00"
                />
                <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className={`w-full border rounded-2xl p-4 outline-none text-sm font-bold ${t.input}`}>
                  <option value="expense">💸 Expense</option>
                  <option value="income">💰 Income</option>
                </select>
              </div>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className={`w-full border rounded-2xl p-4 outline-none text-sm font-bold ${t.input}`}>
                {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
              <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-[.2em] shadow-xl shadow-indigo-600/30 transition-all active:scale-98 mt-2">
                Confirm Entry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Report Modal ── */}
      {reportOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${dark ? 'bg-slate-950/90' : 'bg-transparent'} backdrop-blur-2xl`} onClick={e=>e.target===e.currentTarget&&setReportOpen(false)}>
          
          {/* Internal Spectrum for Light Theme Modal */}
          {!dark && (
            <div className="absolute inset-0 z-0 opacity-60">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 animate-[gradient_15s_ease_infinite] bg-[length:400%_400%]" />
            </div>
          )}

          <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto border-2 rounded-[42px] p-10 shadow-[0_50px_100px_rgba(79,70,229,0.3)] relative z-10 ${dark ? 'bg-slate-900/90 border-slate-800 shadow-none' : 'bg-white/70 border-white shadow-2xl'}`}>
            <button onClick={()=>setReportOpen(false)} className={`absolute top-8 right-8 ${t.muted} hover:scale-110 transition-transform`}><X size={26}/></button>

            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/40 transform rotate-3">
                <FileText size={30} color="white"/>
              </div>
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Financial Intelligence</h3>
                <p className="text-[10px] opacity-60 tracking-[.5em] font-black uppercase italic mt-1 text-indigo-500">Global Statement Briefing</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-10">
              {[
                { label: 'Efficiency Rating', value: `${metrics.savings}%`, bg: 'bg-indigo-500', shadow: 'shadow-indigo-200', text: 'text-white' },
                { label: 'Net Liquidity', value: `${sym}${metrics.balance.toLocaleString()}`, bg: 'bg-emerald-500', shadow: 'shadow-emerald-200', text: 'text-white' },
                { label: 'Asset Cycle', value: metrics.count, bg: 'bg-purple-600', shadow: 'shadow-purple-200', text: 'text-white' },
              ].map(m => (
                <div key={m.label} className={`p-6 rounded-[28px] ${dark ? 'bg-slate-800/80' : `${m.bg} ${m.shadow} shadow-2xl transition-transform hover:scale-105`} flex flex-col items-center text-center`}>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'opacity-40' : 'opacity-80 text-white'} mb-3`}>{m.label}</p>
                  <h4 className={`text-2xl font-black ${dark ? 'text-indigo-400' : m.text}`}>{m.value}</h4>
                </div>
              ))}
            </div>

            <div className={`p-8 rounded-[32px] border-2 italic text-base leading-relaxed mb-10 transform -rotate-1 ${dark ? 'bg-indigo-500/5 border-indigo-500/20 text-slate-300 shadow-none' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-white text-indigo-900 shadow-xl shadow-indigo-500/5'}`}>
              <span className="text-4xl absolute -top-4 -left-2 opacity-20 text-indigo-400 font-serif">"</span>
              Intelligence scan indicates a primary concentration of outflow in{' '}
              <span className="text-purple-600 font-black not-italic underline decoration-indigo-300 decoration-4">#{metrics.topCat}</span>. 
              The velocity of your savings infrastructure is currently maintaining a stable{' '}
              <span className="text-emerald-500 font-black not-italic bg-emerald-50 px-2 rounded-lg">{metrics.savings}%</span> threshold.
            </div>

            <p className="text-[10px] font-black uppercase tracking-[.4em] text-indigo-600/60 mb-6 px-2">Detailed Asset Ledger</p>
            <div className="space-y-3 mb-10">
              {transactions.length === 0
                ? <div className="text-center py-12 opacity-20 text-xs font-black uppercase tracking-widest italic">VOID_DATA</div>
                : transactions.map(tx => (
                    <div key={tx.id} className={`flex justify-between items-center p-5 rounded-2xl border transition-all ${dark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-indigo-100/50 hover:shadow-lg hover:shadow-indigo-500/10'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-slate-800' : 'bg-indigo-50 text-indigo-600'}`}>
                          {tx.icon}
                        </div>
                        <span className="font-black text-[11px] uppercase tracking-tight">{tx.name} <span className="opacity-40 italic block text-[9px] mt-0.5">{tx.date}</span></span>
                      </div>
                      <span className={`font-black text-xs px-4 py-2 rounded-xl shadow-sm ${tx.amount>0 ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-indigo-600 text-white shadow-indigo-200'}`}>
                        {tx.amount>0?'+':''}{sym}{Math.abs(tx.amount).toLocaleString()}
                      </span>
                    </div>
                  ))}
            </div>

            <div className="flex gap-4 pt-4 border-t border-indigo-100/50">
              <button 
                onClick={downloadCSV}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-5 rounded-2xl font-black uppercase tracking-[.3em] text-[10px] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-indigo-500/30"
              >
                <FileDown size={18}/> Export System Intelligence
              </button>
              <button 
                onClick={()=>setReportOpen(false)}
                className={`px-10 py-5 rounded-2xl font-black uppercase tracking-[.3em] text-[10px] transition-all hover:bg-slate-100 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-2 border-indigo-100 text-indigo-600'}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
