'use client';

import React from 'react';
import { Users } from 'lucide-react';

interface CapacityBarProps {
  totalCapacity: number;
  remainingSpots: number;
  showLabels?: boolean;
}

export default function CapacityBar({
  totalCapacity,
  remainingSpots,
  showLabels = true,
}: CapacityBarProps) {
  const booked = totalCapacity - remainingSpots;
  const percentage = totalCapacity > 0 ? Math.min(100, Math.round((booked / totalCapacity) * 100)) : 100;
  const isSoldOut = remainingSpots <= 0;
  const isHighUrgency = !isSoldOut && remainingSpots <= 10;

  return (
    <div className="space-y-1.5 w-full">
      {showLabels && (
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center space-x-1.5 text-slate-400">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>Capacity Utilization</span>
          </span>
          <span className="font-semibold text-slate-300">
            {booked} / {totalCapacity} ({percentage}%)
          </span>
        </div>
      )}
      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative border border-slate-700/50">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isSoldOut
              ? 'bg-rose-500'
              : isHighUrgency
              ? 'bg-amber-400'
              : 'bg-gradient-to-r from-primary-500 to-indigo-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabels && (
        <div className="flex justify-between text-[11px]">
          <span className={isSoldOut ? 'text-rose-400 font-bold' : isHighUrgency ? 'text-amber-400 font-medium' : 'text-emerald-400'}>
            {isSoldOut ? 'Sold Out' : `${remainingSpots} spots remaining`}
          </span>
          <span className="text-slate-500">Live DB lock active</span>
        </div>
      )}
    </div>
  );
}
