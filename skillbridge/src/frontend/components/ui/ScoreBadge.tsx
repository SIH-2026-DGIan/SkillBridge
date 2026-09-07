import React from 'react';
import { scoreBgColor, cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  label?: string;
  className?: string;
}

export function ScoreBadge({ score, label, className }: ScoreBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
        scoreBgColor(score),
        className
      )}
    >
      {label && <span className="opacity-80 font-normal">{label}:</span>}
      <span>{score}%</span>
    </span>
  );
}
