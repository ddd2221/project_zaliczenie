'use client';

import React from 'react';
import { Calendar, MapPin, Users, Ticket, ArrowRight, CheckCircle2 } from 'lucide-react';
import { EventItem } from '@/lib/types';

interface EventCardProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
}

export default function EventCard({ event, onSelect }: EventCardProps) {
  const dateObj = new Date(event.start_time);
  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isSoldOut = event.remaining_spots <= 0;
  const isUrgent = !isSoldOut && event.remaining_spots <= 10;

  return (
    <div className="group relative flex flex-col rounded-2xl glass-panel overflow-hidden border border-card-border hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1">
      {/* Event Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-900/80 backdrop-blur-md text-primary-400 border border-slate-700/60 shadow-sm">
            {event.category.name}
          </span>
        </div>

        {/* Spot Status Badge */}
        <div className="absolute top-3 right-3">
          {isSoldOut ? (
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-500/90 text-white shadow-md">
              Sold Out
            </span>
          ) : isUrgent ? (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/90 text-slate-950 shadow-md animate-pulse">
              Only {event.remaining_spots} left!
            </span>
          ) : (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
              {event.remaining_spots} spots open
            </span>
          )}
        </div>

        {/* Price Tag overlay bottom right */}
        <div className="absolute bottom-3 right-3">
          <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs font-bold text-white">
            {Number(event.price) === 0 ? (
              <span className="text-emerald-400">FREE</span>
            ) : (
              <span>{Number(event.price).toFixed(2)} PLN</span>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Date & Time */}
          <div className="flex items-center space-x-2 text-xs font-medium text-primary-400 mb-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate} • {formattedTime}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-100 group-hover:text-primary-400 transition-colors line-clamp-2">
            {event.title}
          </h3>

          {/* Venue & City */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-2">
            <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="truncate">{event.venue.name}, {event.venue.city}</span>
          </div>
        </div>

        {/* Capacity Bar & Action */}
        <div className="pt-3 border-t border-card-border/60 space-y-3">
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="flex items-center space-x-1">
                <Users className="w-3 h-3 text-slate-500" />
                <span>Capacity</span>
              </span>
              <span>{event.total_capacity - event.remaining_spots} / {event.total_capacity} booked</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isSoldOut
                    ? 'bg-rose-500'
                    : event.reserved_percentage > 80
                    ? 'bg-amber-400'
                    : 'bg-primary-500'
                }`}
                style={{ width: `${event.reserved_percentage}%` }}
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => onSelect(event)}
            disabled={isSoldOut}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
              isSoldOut
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40'
                : 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white shadow-lg shadow-primary-600/20 hover:scale-[1.01]'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{isSoldOut ? 'Event Sold Out' : 'Quick RSVP & Pass'}</span>
            {!isSoldOut && <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />}
          </button>
        </div>
      </div>
    </div>
  );
}
