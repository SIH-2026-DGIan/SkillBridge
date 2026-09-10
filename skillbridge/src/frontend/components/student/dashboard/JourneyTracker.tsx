'use client';

import { Check, Lock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface JourneyStage {
  id: string;
  label: string;
  href: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface JourneyTrackerProps {
  stages: JourneyStage[];
}

export function JourneyTracker({ stages }: JourneyTrackerProps) {
  return (
    <section className="bg-white border-b border-slate-200/80 sticky top-[57px] z-20 shadow-xs">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-2 hidden xl:inline">
              Career Journey:
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 min-w-max flex-1 justify-between">
            {stages.map((stage, idx) => {
              const isCompleted = stage.isCompleted;
              const isCurrent = stage.isCurrent;
              const isPending = !isCompleted && !isCurrent;

              return (
                <div key={stage.id} className="flex items-center">
                  <Link
                    href={stage.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                      isCompleted && "bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 border border-emerald-200/60",
                      isCurrent && "bg-blue-50 text-blue-700 border-2 border-blue-600 shadow-xs ring-2 ring-blue-100",
                      isPending && "bg-slate-50 text-slate-500 hover:bg-slate-100/80 border border-slate-200/60"
                    )}
                  >
                    {isCompleted ? (
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    ) : isCurrent ? (
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold shrink-0 animate-pulse">
                        {idx + 1}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-slate-500 text-[10px] font-bold shrink-0">
                        {idx + 1}
                      </span>
                    )}

                    <span className="whitespace-nowrap tracking-tight">{stage.label}</span>

                    {isCurrent && (
                      <span className="text-[9px] uppercase tracking-wider bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold ml-1">
                        Current
                      </span>
                    )}
                  </Link>

                  {idx < stages.length - 1 && (
                    <div className="px-1.5 sm:px-2 text-slate-300 shrink-0">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
