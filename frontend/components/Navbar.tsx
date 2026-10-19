'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Calendar, Ticket, PlusCircle, LogIn, LogOut, User as UserIcon, BookOpen } from 'lucide-react';
import { getAuthToken, getCurrentUsername, clearAuthTokens } from '@/lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    const storedUser = getCurrentUsername();
    if (token && storedUser) {
      setUsername(storedUser);
    } else {
      setUsername(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    clearAuthTokens();
    setUsername(null);
    window.location.href = '/';
  };

  const navLinks = [
    { href: '/', label: 'Explore Events', icon: Calendar },
    { href: '/my-events', label: 'My Passes', icon: Ticket, requiresAuth: true },
    { href: '/create-event', label: 'Host Event', icon: PlusCircle, requiresAuth: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-card-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-indigo-500 to-accent-cyan flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                LocalPulse
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Event Discovery & Fast-Pass</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            if (item.requiresAuth && !username) return null;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <a
            href="http://localhost:8000/api/docs/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-indigo-400 hover:bg-slate-800/40 rounded-lg transition-colors border border-transparent hover:border-slate-800"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>OpenAPI Docs</span>
          </a>
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center space-x-3">
          {username ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-slate-200">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>{username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:bg-slate-800/80 transition-all border border-card-border"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 shadow-md shadow-primary-600/30 transition-all hover:scale-[1.02]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
