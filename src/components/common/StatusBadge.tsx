import React from 'react';
import { PriorityTier } from '../../types';
import { Flame, Sun, CircleDot } from 'lucide-react';

interface StatusBadgeProps {
  priority: PriorityTier;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ priority, size = 'md' }) => {
  if (priority === 'HOT') {
    return (
      <span
        id={`badge-hot-${priority.toLowerCase()}`}
        className={`inline-flex items-center gap-1 font-bold rounded uppercase bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 ${
          size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
        }`}
      >
        <Flame className={size === 'sm' ? 'w-2.5 h-2.5 text-[#10B981]' : 'w-3 h-3 text-[#10B981]'} />
        <span>HOT</span>
      </span>
    );
  }

  if (priority === 'WARM') {
    return (
      <span
        id={`badge-warm-${priority.toLowerCase()}`}
        className={`inline-flex items-center gap-1 font-bold rounded uppercase bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 ${
          size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
        }`}
      >
        <Sun className={size === 'sm' ? 'w-2.5 h-2.5 text-[#F59E0B]' : 'w-3 h-3 text-[#F59E0B]'} />
        <span>WARM</span>
      </span>
    );
  }

  return (
    <span
      id={`badge-cold-${priority.toLowerCase()}`}
      className={`inline-flex items-center gap-1 font-mono font-medium rounded uppercase bg-white/5 text-gray-400 border border-white/5 ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      <CircleDot className={size === 'sm' ? 'w-2.5 h-2.5 text-gray-500' : 'w-3 h-3 text-gray-500'} />
      <span>COLD</span>
    </span>
  );
};
