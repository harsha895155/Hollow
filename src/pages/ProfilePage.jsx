import React, { useState } from 'react';
import { User, KeyRound, CheckCircle2, AlertCircle, Save, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { themeTokens, currencyCode } = useTheme();

  const isGuest = user?.id === 'demo_user' || user?.isGuest || user?.role === 'guest' || user?.email === 'guest@hollow.finance' || user?.email === 'alex.vance@hollow.finance';

  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isGuest) return; // Prevent any updates for guest accounts

    setMessage(null);
    setError(null);

    if (newPassword) {
      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match.');
        return;
      }
      if (!currentPassword) {
        setError('Please enter your current password to verify identity.');
        return;
      }
    }

    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      setMessage('Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className={`p-6 md:p-8 rounded-3xl ${themeTokens.card} flex flex-col sm:flex-row sm:items-center justify-between gap-5`}>
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-xl shrink-0">
            {isGuest ? 'G' : (user?.name ? user.name.charAt(0).toUpperCase() : 'U')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                {isGuest ? 'Guest Explorer' : (user?.name || 'Authorized Account')}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isGuest ? 'guest@hollow.finance' : (user?.email || 'user@hollow.app')} · Personal Finance Workspace
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isGuest 
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                  : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              }`}>
                {isGuest ? 'Guest Sandbox Session' : 'Active Verified Session'}
              </span>
            </div>
          </div>
        </div>

        {isGuest && (
          <button
            onClick={logout}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-bold text-slate-800 dark:text-white transition-all text-center border border-slate-300 dark:border-white/10"
          >
            Switch Account
          </button>
        )}
      </div>

      {/* Guest Mode Notice & Read-Only Information */}
      {isGuest ? (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-start gap-3">
            <ShieldAlert size={20} className="shrink-0 mt-0.5 text-amber-400" />
            <div>
              <p className="font-bold text-amber-300">Guest Account · Profile Editing Disabled</p>
              <p className="text-[11px] text-amber-400/90 mt-1 leading-relaxed">
                You are currently exploring Hollow in a guest sandbox session. Personal account details, credentials, and password changes are disabled for guest sessions. To configure and save personalized credentials, please register your own account.
              </p>
            </div>
          </div>

          {/* Read-Only Account Details in Grid Mode */}
          <div className={`p-6 md:p-8 rounded-3xl ${themeTokens.card} space-y-6`}>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-white/10">
              <UserCheck size={18} className="text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Account Specifications (Read-Only)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Full Name
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Guest Explorer
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Email Address
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  guest@hollow.finance
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Access Level
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Guest Sandbox (Full Feature Access)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Active Currency
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {currencyCode}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-slate-900/50 border border-indigo-200/80 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-indigo-600 dark:text-amber-400" /> Want your own personalized profile?
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Register a personal account to customize your name, avatar, and secure your financial data with cloud sync.
                </p>
              </div>
              <button
                onClick={logout}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 shrink-0"
              >
                Create Personal Account
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Regular Registered User: Editable Profile & Security Form */
        <>
          {message && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} /> {message}
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleUpdate} className={`p-6 md:p-8 rounded-3xl ${themeTokens.card} space-y-6`}>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-white/10">
              <User size={18} className="text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold outline-none ${themeTokens.input}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold outline-none opacity-60 cursor-not-allowed ${themeTokens.input}`}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 pb-2 border-b border-slate-200 dark:border-white/10">
              <KeyRound size={18} className="text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Security & Password Change
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold outline-none ${themeTokens.input}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold outline-none ${themeTokens.input}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold outline-none ${themeTokens.input}`}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all active:scale-95 disabled:opacity-50"
              >
                <Save size={15} /> {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
