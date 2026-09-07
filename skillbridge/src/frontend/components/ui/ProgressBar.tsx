import React from 'react';
import { scoreBarColor, cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  showLabel?: boolean;
  className?: string;
  barClassName?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  className,
  barClassName,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span className="font-semibold text-gray-700">{percentage}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-500 rounded-full', scoreBarColor(percentage), barClassName)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
