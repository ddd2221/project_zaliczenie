'use client';

import React from 'react';

export function CardSkeleton() {
  return (
    <div className="rounded-2xl glass-panel overflow-hidden border border-card-border p-4 space-y-4 animate-pulse">
      <div className="h-44 w-full bg-slate-800/80 rounded-xl" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-800/60 rounded w-1/2" />
      </div>
      <div className="h-2 bg-slate-800 rounded-full w-full" />
      <div className="h-9 bg-slate-800/90 rounded-xl w-full" />
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
