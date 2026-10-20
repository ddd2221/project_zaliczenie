'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Zap, AlertCircle, RefreshCw } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import EventCard from '@/components/EventCard';
import RsvpModal from '@/components/RsvpModal';
import { api } from '@/lib/api';
import { EventItem, Category } from '@/lib/types';

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [isFreeOnly, setIsFreeOnly] = useState<boolean>(false);

  // Selected event for RSVP modal
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null);

  // Initial fetch for categories
  useEffect(() => {
    async function initTaxonomies() {
      try {
        const catData = await api.getCategories();
        setCategories(catData);
      } catch (err) {
        console.warn('Could not load categories:', err);
      }
    }
    initTaxonomies();
  }, []);

  // Fetch events on filter change
  useEffect(() => {
    let isCancelled = false;
    async function loadEvents() {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string> = {};
        if (search.trim()) params.search = search.trim();
        if (selectedCategory) params.category = selectedCategory;
        if (selectedCity) params.city = selectedCity;
        if (availableOnly) params.available_only = 'true';
        if (isFreeOnly) params.is_free = 'true';

        const data = await api.getEvents(params);
        if (!isCancelled) {
          setEvents(data.results || []);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err.message || 'Failed to fetch events from API.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    const timer = setTimeout(() => {
      loadEvents();
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [search, selectedCategory, selectedCity, availableOnly, isFreeOnly]);

  const handleReservationSuccess = (eventId: number, remainingSpots: number) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId
          ? {
              ...ev,
              remaining_spots: remainingSpots,
              reserved_percentage: Math.min(
                100,
                Math.round(((ev.total_capacity - remainingSpots) / ev.total_capacity) * 100)
              ),
              is_sold_out: remainingSpots <= 0,
            }
          : ev
      )
    );
  };

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative rounded-3xl glass-panel p-8 sm:p-12 overflow-hidden border border-card-border">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-semibold text-primary-400">
            <Zap className="w-3.5 h-3.5 animate-bounce" />
            <span>High-Throughput Concurrency Engine with Row-Level Locking</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Discover & Reserve Exclusive Local Experiences in Poland.
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
            From tech hackathons in Wrocław to underground jazz sessions and summer festivals. Instant 1-click
            RSVP with cryptographically verifiable UUID4 digital ticket passes.
          </p>
        </div>
      </section>

      {/* Filter and Search Interface */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        availableOnly={availableOnly}
        setAvailableOnly={setAvailableOnly}
        isFreeOnly={isFreeOnly}
        setIsFreeOnly={setIsFreeOnly}
        categories={categories}
      />

      {/* Events Grid or States */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="rounded-2xl glass-panel h-80 border border-card-border animate-pulse p-4 space-y-4"
            >
              <div className="w-full h-40 bg-slate-800 rounded-xl" />
              <div className="h-4 bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
              <div className="h-8 bg-slate-800 rounded mt-4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl glass-panel border border-rose-500/30 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Connection to LocalPulse API</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">{error}</p>
          <p className="text-xs text-slate-500">
            Ensure backend server is running on <code className="text-primary-400">http://localhost:8000</code> or Docker Compose.
          </p>
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 rounded-3xl glass-panel border border-card-border text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No matching events found</h3>
          <p className="text-xs text-slate-400">
            Try adjusting your search criteria, clearing the city filter, or disabling the "Available Spots" toggle.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing <strong className="text-slate-200">{events.length}</strong> events</span>
            <span>Sorted by earliest date</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={(ev) => setActiveModalEvent(ev)}
              />
            ))}
          </div>
        </div>
      )}

      {/* RSVP Modal */}
      {activeModalEvent && (
        <RsvpModal
          event={activeModalEvent}
          isOpen={!!activeModalEvent}
          onClose={() => setActiveModalEvent(null)}
          onSuccess={handleReservationSuccess}
        />
      )}
    </div>
  );
}
