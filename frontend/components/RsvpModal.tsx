'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Calendar, MapPin, Ticket, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { EventItem, RegistrationItem } from '@/lib/types';
import { api, getAuthToken } from '@/lib/api';
import CapacityBar from './CapacityBar';

interface RsvpModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (eventId: number, remainingSpots: number) => void;
}

export default function RsvpModal({
  event,
  isOpen,
  onClose,
  onSuccess,
}: RsvpModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedPass, setConfirmedPass] = useState<RegistrationItem | null>(null);

  if (!isOpen) return null;

  const token = getAuthToken();
  const dateObj = new Date(event.start_time);
  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleBooking = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.registerEvent(event.id);
      setConfirmedPass(response.registration);
      onSuccess(event.id, response.remaining_spots);
    } catch (err: any) {
      setError(err.message || 'Failed to complete registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-slate-700/80 overflow-hidden shadow-2xl">
        {/* Header Image */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700/60"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-5 right-5">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary-600/90 text-white shadow-sm">
              {event.category.name}
            </span>
            <h2 className="text-xl font-bold text-white mt-1.5 leading-tight line-clamp-1">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Confirmed State */}
          {confirmedPass ? (
            <div className="space-y-5 text-center py-2 animate-fadeIn">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">RSVP Successfully Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Your spot has been atomically locked in the database via PostgreSQL <code className="text-indigo-400">SELECT ... FOR UPDATE</code>.
                </p>
              </div>

              {/* Digital Pass Box */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-left space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Fast-Pass UUID</span>
                  <span className="text-emerald-400 font-semibold uppercase">Confirmed</span>
                </div>
                <div className="font-mono text-xs font-bold text-primary-300 break-all bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {confirmedPass.ticket_code}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/my-events"
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white flex items-center justify-center space-x-2 transition-all shadow-lg shadow-primary-600/30"
                >
                  <Ticket className="w-4 h-4" />
                  <span>View in My Passes</span>
                </Link>
                <button
                  onClick={onClose}
                  className="py-3 px-5 rounded-xl text-xs font-semibold glass-panel text-slate-300 hover:text-white transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Event Metadata */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span>{formattedDate} at {formattedTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-accent-cyan flex-shrink-0" />
                  <span>{event.venue.name} — {event.venue.address}, {event.venue.city}</span>
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <div className="text-xs text-slate-400 leading-relaxed max-h-24 overflow-y-auto pr-1">
                  {event.description}
                </div>
              )}

              {/* Capacity utilization */}
              <CapacityBar
                totalCapacity={event.total_capacity}
                remainingSpots={event.remaining_spots}
              />

              {/* Concurrency guarantee badge */}
              <div className="flex items-start space-x-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  Protected by PostgreSQL row-level pessimistic lock (<code className="text-indigo-400">select_for_update</code>). Overbooking is mathematically impossible.
                </span>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Auth Guard vs RSVP Action */}
              {!token ? (
                <div className="p-4 rounded-2xl bg-primary-950/40 border border-primary-500/20 text-center space-y-3">
                  <p className="text-xs text-slate-300">
                    Sign in to your LocalPulse account to claim your pass.
                  </p>
                  <div className="flex items-center justify-center space-x-3">
                    <Link
                      href="/login"
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-all shadow-md"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 rounded-xl text-xs font-semibold glass-panel text-slate-300 hover:text-white transition-all"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleBooking}
                  disabled={loading || event.remaining_spots <= 0}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                    event.remaining_spots <= 0
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                      : 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white shadow-lg shadow-primary-600/30 hover:scale-[1.01]'
                  }`}
                >
                  <Ticket className="w-4 h-4" />
                  <span>{loading ? 'Locking Spot in Database...' : 'Confirm Instant RSVP & Pass'}</span>
                  {!loading && event.remaining_spots > 0 && <ArrowRight className="w-4 h-4" />}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
