import React, { useState, FormEvent } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, UserPlus, KeyRound, CheckCircle2 } from 'lucide-react';
import LogoIcon from '../LogoIcon';
import { loginAdmin, registerAdmin } from '../../services/firebase';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminLogin({ onSuccess, onCancel }: AdminLoginProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (authMode === 'register') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);

    try {
      if (authMode === 'login') {
        const res = await loginAdmin(email, password);
        if (res.success) {
          onSuccess();
        } else {
          setError(res.error || 'Authentication failed. Please verify your credentials.');
        }
      } else {
        const res = await registerAdmin(email, password);
        if (res.success) {
          setSuccessMsg('Admin account registered successfully in Firebase! Launching studio...');
          setTimeout(() => {
            onSuccess();
          }, 1200);
        } else {
          setError(res.error || 'Registration failed.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Connection error with Firebase authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050548] via-[#030330] to-black flex items-center justify-center p-4 sm:p-6 text-left">
      <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200/80 shadow-2xl p-8 sm:p-10 relative overflow-hidden">
        
        {/* Subtle Brand Accent Orb */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-48 h-48 bg-[#050548]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Logo & Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <LogoIcon className="w-14 h-14" />
          <div>
            <span className="font-black text-xs uppercase tracking-widest text-[#050548] block" style={{ fontFamily: 'Arial Black, sans-serif' }}>
              ENGRACED LOGISTICS
            </span>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
              Secure Operations Vault
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-black text-zinc-950 tracking-tight mb-1">
            {authMode === 'login' ? 'Executive Admin Gate' : 'Register Admin Account'}
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
            {authMode === 'login' 
              ? 'Authenticate with your official credentials to access publications, telemetry, and live database.' 
              : 'Create your primary administrator account linked directly to live Firebase Auth.'}
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="flex rounded-xl bg-zinc-100 p-1 mb-6 border border-zinc-200">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'login' 
                ? 'bg-white text-[#050548] shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <KeyRound size={13} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'register' 
                ? 'bg-white text-[#050548] shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <UserPlus size={13} />
            <span>Admin Sign Up</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1.5 font-mono">
              Administrator Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                required
                placeholder="admin@engracedlogistics.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#050548] transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1.5 font-mono">
              {authMode === 'login' ? 'Password / Security Key' : 'Create Password (min. 6 characters)'}
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#050548] transition-all font-sans"
              />
            </div>
          </div>

          {authMode === 'register' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1.5 font-mono">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#050548] transition-all font-sans"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#050548] hover:bg-[#030330] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer mt-2"
          >
            <span>
              {loading 
                ? 'Processing Firebase Auth...' 
                : authMode === 'login' 
                  ? 'Sign In to Secure Vault' 
                  : 'Complete Admin Registration'}
            </span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-between text-xs">
          <button
            onClick={onCancel}
            className="text-zinc-500 hover:text-zinc-900 font-semibold cursor-pointer"
          >
            &larr; Exit to Public Site
          </button>
          <span className="text-zinc-400 font-mono text-[10px]">Production SSL/TLS</span>
        </div>

      </div>
    </div>
  );
}