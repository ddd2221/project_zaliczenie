'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Ticket, Calendar, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import TicketPassCard from '@/components/TicketPassCard';
import { api, getAuthToken } from '@/lib/api';
import { RegistrationItem } from '@/lib/types';

export default function MyEventsPage() {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = getAuthToken();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function loadRegistrations() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getMyRegistrations();
        const list = Array.isArray(data) ? data : (data as any).results || [];
        setRegistrations(list);
      } catch (err: any) {
        setError(err.message || 'Failed to load your ticket passes.');
      } finally {
        setLoading(false);
      }
    }

    loadRegistrations();
  }, [token]);

  const handleCancelled = (id: number) => {
    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === id ? { ...reg, status: 'CANCELLED' as const } : reg
      )
    );
  };

  if (!token) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl glass-panel border border-card-border text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400">
          <Ticket className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Sign In to View Passes</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Your reserved event passes and entry QR codes are safely stored in your account.
          </p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/30 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold glass-panel text-slate-300 hover:text-white transition-all"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  const activePasses = registrations.filter((r) => r.status === 'CONFIRMED');

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-card-border">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-primary-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Ticket Wallet</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            My Event Passes
          </h1>
          <p className="text-xs text-slate-400">
            Show your cryptographically verified UUID4 pass at the venue entrance.
          </p>
        </div>

        <div className="flex items-center space-x-4 px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <div>
            <div className="text-xl font-bold text-white">{activePasses.length}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Passes</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <div className="text-xl font-bold text-slate-400">{registrations.length}</div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Total History</div>
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="rounded-3xl glass-panel h-48 border border-card-border animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl glass-panel border border-rose-500/30 text-center space-y-2">
          <AlertCircle className="w-6 h-6 text-rose-400 mx-auto" />
          <p className="text-xs text-slate-300">{error}</p>
        </div>
      ) : registrations.length === 0 ? (
        <div className="p-12 rounded-3xl glass-panel border border-card-border text-center space-y-4">
          <Calendar className="w-10 h-10 text-slate-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No active passes yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't reserved any tickets yet. Explore upcoming concerts, tech summits, and local workshops.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20 transition-all"
          >
            <span>Explore Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <TicketPassCard
              key={reg.id}
              registration={reg}
              onCancelled={handleCancelled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
