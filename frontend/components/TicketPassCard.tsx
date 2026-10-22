'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Ticket, AlertTriangle, CheckCircle2, XCircle, QrCode } from 'lucide-react';
import { RegistrationItem } from '@/lib/types';
import { api } from '@/lib/api';

interface TicketPassCardProps {
  registration: RegistrationItem;
  onCancelled: (id: number) => void;
}

export default function TicketPassCard({
  registration,
  onCancelled,
}: TicketPassCardProps) {
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const event = registration.event;
  const isCancelled = registration.status === 'CANCELLED';

  const dateObj = new Date(event.start_time);
  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCancel = async () => {
    if (!window.confirm(`Are you sure you want to cancel your pass for "${event.title}"? Your spot will be released immediately.`)) {
      return;
    }
    setCancelling(true);
    setError(null);
    try {
      await api.cancelRegistration(registration.id);
      onCancelled(registration.id);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel registration.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className={`relative flex flex-col md:flex-row rounded-3xl overflow-hidden border transition-all duration-300 ${
      isCancelled
        ? 'bg-slate-900/40 border-slate-800 opacity-60'
        : 'glass-panel border-card-border hover:border-slate-600 shadow-xl'
    }`}>
      {/* Event Details Section */}
      <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary-600/20 text-primary-400 border border-primary-500/30">
              {event.category.name}
            </span>
            {isCancelled ? (
              <span className="flex items-center space-x-1 text-xs font-bold text-rose-400">
                <XCircle className="w-3.5 h-3.5" />
                <span>CANCELLED</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ACTIVE PASS</span>
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-white leading-snug">
            {event.title}
          </h3>

          <div className="mt-3 space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
              <span>{formattedDate} • {formattedTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-accent-cyan flex-shrink-0" />
              <span>{event.venue.name}, {event.venue.city}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-xs text-rose-400 flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-3 border-t border-card-border/50 flex items-center justify-between text-xs text-slate-500">
          <span>Booked on {new Date(registration.created_at).toLocaleDateString()}</span>
          {!isCancelled && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:underline transition-colors"
            >
              {cancelling ? 'Releasing spot...' : 'Cancel RSVP'}
            </button>
          )}
        </div>
      </div>

      {/* Ticket Pass Stub (Right Side) */}
      <div className="relative md:w-64 p-6 bg-slate-950/80 border-t md:border-t-0 md:border-l border-dashed border-card-border/80 flex flex-col items-center justify-center text-center space-y-3">
        {/* Pass code representation */}
        <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 shadow-inner">
          <QrCode className="w-12 h-12 text-primary-400" />
        </div>

        <div className="space-y-1 w-full">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Cryptographic Fast-Pass ID
          </span>
          <div className="font-mono text-[11px] font-bold text-slate-300 break-all bg-slate-900/90 py-1 px-2 rounded-lg border border-slate-800">
            {registration.ticket_code.slice(0, 18)}...
          </div>
        </div>

        <div className="text-[10px] text-slate-500">
          Present at {event.venue.name} gate
        </div>
      </div>
    </div>
  );
}
