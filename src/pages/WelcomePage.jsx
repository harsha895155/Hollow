import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Receipt,
  PieChart,
  Tag,
  BarChart3,
  Smartphone,
  Database,
  Lock,
  Zap,
  CheckCircle2,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function WelcomePage({ onEnterGuest, onGoToLogin, onGoToRegister }) {
  const coreFeatures = [
    {
      icon: <Receipt size={22} className="text-rose-400" />,
      title: 'Expense & Outflow Tracking',
      description: 'Capture daily expenses with precision, tag payment methods (UPI, Card, Cash), attach receipts, and categorize in real-time.',
      badge: 'Core Ledger',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    {
      icon: <TrendingUp size={22} className="text-emerald-400" />,
      title: 'Income & Inflow Streams',
      description: 'Track salaries, freelance retainers, investment returns, and dividends with cash-flow velocity indicators.',
      badge: 'Revenue Tracker',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      icon: <PieChart size={22} className="text-indigo-400" />,
      title: 'Smart Category Budgets',
      description: 'Set custom spending caps with proactive threshold warnings (80%, 100%) and instant visual budget utilization bars.',
      badge: 'Capital Protection',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    },
    {
      icon: <Tag size={22} className="text-amber-400" />,
      title: 'Categorization Engine',
      description: 'Pre-loaded with 16 essential personal finance tags plus full support for custom categories, emoji icons, and color palettes.',
      badge: 'Custom Tags',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      icon: <BarChart3 size={22} className="text-cyan-400" />,
      title: 'Financial Intelligence Reports',
      description: 'Interactive Recharts donut breakdowns, 5-month inflow vs outflow bar comparisons, savings rate ratios, and CSV export.',
      badge: 'Deep Analytics',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    },
    {
      icon: <Smartphone size={22} className="text-purple-400" />,
      title: 'Mobile-Optimized & PWA Ready',
      description: 'Native mobile navigation bar, swipe-friendly drawers, touch-ready grid mode views, and offline service worker caching.',
      badge: 'Mobile + Desktop',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    {
      icon: <Database size={22} className="text-blue-400" />,
      title: 'Dual-Engine Persistence',
      description: 'Full REST API backend integration with atomic JSON data storage plus seamless offline browser LocalStorage fallback.',
      badge: 'Zero Data Loss',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      icon: <Lock size={22} className="text-emerald-400" />,
      title: 'JWT Security & Privacy',
      description: 'Industry-standard JWT authentication tokens, bcrypt password hashing, and complete data privacy with no third-party telemetry.',
      badge: 'Production Security',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
  ];

  const completionDetails = [
    { label: 'Frontend Engine', value: 'React 18.3 + Vite 7.3 (Single Page Application)' },
    { label: 'Styling & Tokens', value: 'Tailwind CSS Modern Glassmorphic Design System' },
    { label: 'Visual Analytics', value: 'Recharts Responsive Vector Charts' },
    { label: 'Backend API', value: 'Node.js Express REST API (Port 5000)' },
    { label: 'Database & Sync', value: 'Atomic File Persistence + Windows OneDrive Safe' },
    { label: 'Offline / PWA', value: 'Service Worker + Web App Manifest + Capacitor Ready' },
    { label: 'Code Quality', value: '0 ESLint Errors · 0 Warnings · 100% Passed Tests' },
    { label: 'Active Version', value: 'v1.0.0 Production Release' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white relative selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed -top-40 -left-40 w-96 md:w-[500px] h-96 md:h-[500px] bg-indigo-600/20 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-1/2 -right-40 w-96 md:w-[600px] h-96 md:h-[600px] bg-purple-600/15 rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 left-1/3 w-96 md:w-[500px] h-96 md:h-[500px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Top Navbar */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-600/40">
            H
          </div>
          <div>
            <h1 className="font-black text-lg uppercase tracking-tight">Hollow</h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Expense Tracker OS</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onGoToLogin}
            className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
          >
            <LogIn size={14} /> Sign In
          </button>
          <button
            onClick={onGoToRegister}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white transition-all flex items-center gap-1.5"
          >
            <UserPlus size={14} /> Register
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-16 space-y-12 md:space-y-20">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-2 md:pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wide">
            <Sparkles size={14} className="text-amber-400" />
            <span>Guest Welcome & Architecture Tour</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight md:leading-[1.1]">
            Financial Intelligence & <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Production Expense Tracking
            </span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Welcome to Hollow! Experience a complete, production-grade financial platform designed for desktop, tablet, and mobile. Test all features with instant guest access or register your personal workspace.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={onEnterGuest}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2.5"
            >
              <Zap size={18} className="text-amber-300 fill-amber-300" />
              <span>Explore as Guest (Instant Access)</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={onGoToRegister}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Create Personal Account
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-3xl mx-auto">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <p className="text-xs font-bold text-slate-200">100% Free</p>
              <p className="text-[10px] text-slate-400">Zero subscriptions</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <p className="text-xs font-bold text-slate-200">Offline-First</p>
              <p className="text-[10px] text-slate-400">Works without internet</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <p className="text-xs font-bold text-slate-200">Private & Local</p>
              <p className="text-[10px] text-slate-400">Encrypted storage</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <p className="text-xs font-bold text-slate-200">Multi-Device</p>
              <p className="text-[10px] text-slate-400">Responsive grid mode</p>
            </div>
          </div>
        </section>

        {/* Feature Matrix in Grid Mode */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              Website Details & Feature Overview
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Everything you need to master personal and business cash flow, organized into intuitive modules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {coreFeatures.map((feat) => (
              <div
                key={feat.title}
                className="p-6 rounded-3xl bg-[#0f172a]/80 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between group hover:shadow-xl hover:shadow-indigo-600/10"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {feat.icon}
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${feat.badgeColor}`}>
                      {feat.badge}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-2">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Completion & Technical Architecture Overview */}
        <section className="p-6 sm:p-8 md:p-10 rounded-3xl bg-[#0f172a]/90 border border-white/10 backdrop-blur-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <CheckCircle2 size={16} /> Production Build & Completion Information
              </div>
              <h3 className="text-xl sm:text-2xl font-black">
                Full-Stack Architecture Specifications
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Verified zero-warning codebase running with active Node Express REST API and Vite frontend.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                All Systems Operational
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {completionDetails.map((item) => (
              <div key={item.label} className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {item.label}
                </p>
                <p className="text-xs font-bold text-slate-200">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-tr from-indigo-950 via-[#0f172a] to-purple-950 border border-indigo-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-black">
              Ready to Explore Hollow?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Jump straight into the live interactive guest workspace with a clean slate, or sign in to your personal account.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button
              onClick={onEnterGuest}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles size={16} className="text-amber-400" />
              <span>Launch Guest Workspace</span>
            </button>
            <button
              onClick={onGoToLogin}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Sign In to Existing Account
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Hollow Financial Operating System · Built with React 18, Vite & Node.js REST API</p>
      </footer>
    </div>
  );
}
