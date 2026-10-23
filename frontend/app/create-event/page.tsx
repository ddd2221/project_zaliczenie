'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Calendar, MapPin, Users, DollarSign, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api, getAuthToken } from '@/lib/api';
import { Category, Venue } from '@/lib/types';

export default function CreateEventPage() {
  const router = useRouter();
  const token = getAuthToken();

  const [categories, setCategories] = useState<Category[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [venueId, setVenueId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalCapacity, setTotalCapacity] = useState('');
  const [price, setPrice] = useState('0.00');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80');
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [catData, venueData] = await Promise.all([
          api.getCategories(),
          api.getVenues(),
        ]);
        setCategories(catData);
        setVenues(venueData);
        if (catData.length > 0) setCategoryId(String(catData[0].id));
        if (venueData.length > 0) setVenueId(String(venueData[0].id));
      } catch (err: any) {
        setError(err.message || 'Failed to load categories and venues.');
      }
    }
    loadData();
  }, []);

  const selectedVenueObj = venues.find((v) => String(v.id) === venueId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      router.push('/login');
      return;
    }

    if (!title || !categoryId || !venueId || !startTime || !totalCapacity) {
      setError('Please fill in all required fields.');
      return;
    }

    const capNum = parseInt(totalCapacity, 10);
    if (selectedVenueObj && capNum > selectedVenueObj.capacity) {
      setError(`Capacity cannot exceed venue limit (${selectedVenueObj.capacity} seats).`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.createEvent({
        title,
        category_id: parseInt(categoryId, 10),
        venue_id: parseInt(venueId, 10),
        start_time: new Date(startTime).toISOString(),
        end_time: endTime ? new Date(endTime).toISOString() : null,
        total_capacity: capNum,
        price: parseFloat(price) || 0.0,
        image_url: imageUrl,
        description,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-6 rounded-3xl glass-panel border border-card-border space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-2">
          <PlusCircle className="w-7 h-7 text-primary-400" />
          <span>Host a Local Event</span>
        </h1>
        <p className="text-xs text-slate-400">
          Publish a community meetup, music gig, or tech workshop. Real-time capacity and ticket tracking are automatically provisioned.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl glass-panel border border-card-border space-y-5">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>Event published successfully! Redirecting to feed...</span>
          </div>
        )}

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Event Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Lower Silesia Rust Hackathon & Showcase"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-card-border text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
        </div>

        {/* Category & Venue Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Category <span className="text-rose-400">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-card-border text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Venue & Location <span className="text-rose-400">*</span>
            </label>
            <select
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-card-border text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.city} - Max {v.capacity})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Start & End Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Start Date & Time <span className="text-rose-400">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-card-border text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-card-border text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
        </div>

        {/* Capacity & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Total Capacity <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              value={totalCapacity}
              onChange={(e) => setTotalCapacity(e.target.value)}
              placeholder={selectedVenueObj ? `Max ${selectedVenueObj.capacity}` : '100'}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-card-border text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Price (PLN, 0 = Free)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-card-border text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
        </div>

        {/* Image URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Poster / Cover Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-card-border text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Description & Agenda
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Outline schedule, featured speakers, guidelines, or requirements..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-card-border text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white shadow-lg shadow-primary-600/30 transition-all hover:scale-[1.01] flex items-center justify-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{loading ? 'Publishing Event...' : 'Publish Event to LocalPulse'}</span>
        </button>
      </form>
    </div>
  );
}
