'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Lock, User, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.login({ username, password });
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="max-w-md mx-auto my-10 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white">Sign In to LocalPulse</h1>
        <p className="text-xs text-slate-400">
          Authenticate with JWT Bearer Token & Sliding Refresh Tokens
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl glass-panel border border-card-border space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Username</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. demo"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-card-border text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-card-border text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white shadow-lg shadow-primary-600/30 transition-all hover:scale-[1.01] flex items-center justify-center space-x-2"
        >
          <LogIn className="w-4 h-4" />
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
        </button>

        {/* Demo Accounts Quick-Fill Section */}
        <div className="pt-4 border-t border-card-border/60 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 block text-center">
            One-Click Demo Credentials:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('demo', 'demo123')}
              className="py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-700 transition-colors"
            >
              demo / demo123
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin', 'admin123')}
              className="py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-700 transition-colors"
            >
              admin / admin123
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary-400 hover:underline font-semibold">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}
