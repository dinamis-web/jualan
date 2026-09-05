import React from 'react';

interface ProgressBarProps {
  progressPercentage: number;
  color?: 'emerald' | 'amber' | 'blue';
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progressPercentage,
  color = 'emerald',
  height = 'md',
  showLabel = false,
}) => {
  const clamped = Math.min(Math.max(progressPercentage, 0), 100);

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }[height];

  const colorClasses = {
    emerald: 'bg-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.4)]',
    amber: 'bg-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    blue: 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]',
  }[color];

  return (
    <div className="w-full">
      <div className={`w-full bg-white/5 rounded-full overflow-hidden ${heightClasses} p-0.5 border border-white/5`}>
        <div
          className={`${heightClasses} rounded-full transition-all duration-500 ease-out ${colorClasses}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1 text-xs text-gray-400 font-mono">
          <span>{clamped}% tercapai</span>
          <span>Target 100%</span>
        </div>
      )}
    </div>
  );
};
