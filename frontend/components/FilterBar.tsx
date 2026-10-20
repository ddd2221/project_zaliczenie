'use client';

import React from 'react';
import { Search, MapPin, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { Category } from '@/lib/types';

interface FilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedCity: string;
  setSelectedCity: (val: string) => void;
  availableOnly: boolean;
  setAvailableOnly: (val: boolean) => void;
  isFreeOnly: boolean;
  setIsFreeOnly: (val: boolean) => void;
  categories: Category[];
}

const CITIES = ['All Cities', 'Wrocław', 'Warszawa', 'Kraków', 'Poznań'];

export default function FilterBar({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  selectedCity,
  setSelectedCity,
  availableOnly,
  setAvailableOnly,
  isFreeOnly,
  setIsFreeOnly,
  categories,
}: FilterBarProps) {
  return (
    <div className="w-full space-y-4 mb-8">
      {/* Search & City bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title, topic, or venue..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all border border-card-border"
          />
        </div>

        <div className="relative min-w-[180px]">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl glass-dropdown text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all border border-card-border appearance-none cursor-pointer"
          >
            {CITIES.map((city) => (
              <option key={city} value={city === 'All Cities' ? '' : city} className="bg-slate-900 text-slate-200">
                {city}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* Category Pills & Quick Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === ''
                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30 font-semibold'
                : 'glass-panel text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? '' : cat.slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30 font-semibold'
                    : 'glass-panel text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                <span>{cat.name}</span>
                {cat.events_count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {cat.events_count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Toggles */}
        <div className="flex items-center space-x-4 text-xs text-slate-300 font-medium">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-primary-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span>Available Spots Only</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isFreeOnly}
              onChange={(e) => setIsFreeOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-primary-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span>Free Community Passes</span>
          </label>
        </div>
      </div>
    </div>
  );
}
