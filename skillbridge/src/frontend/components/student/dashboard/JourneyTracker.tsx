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
  subtitle?: string;
}

interface JourneyTrackerProps {
  stages: JourneyStage[];
}

export function JourneyTracker({ stages }: JourneyTrackerProps) {
  return (
    <section className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-start gap-4 overflow-x-auto scrollbar-none pb-2">
          
          <div className="flex items-center gap-2 sm:gap-4 min-w-max flex-1">
            {stages.map((stage, idx) => {
              const isCompleted = stage.isCompleted;
              const isCurrent = stage.isCurrent;
              const isPending = !isCompleted && !isCurrent;

              return (
                <div key={stage.id} className="flex items-center group">
                  <Link
                    href={stage.href}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl transition-all min-w-[160px]",
                      isCompleted && "hover:bg-emerald-50/50",
                      isCurrent && "bg-blue-50/50 border border-blue-200 shadow-xs",
                      isPending && "hover:bg-slate-50/80 opacity-60 hover:opacity-100"
                    )}
                  >
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white shrink-0 shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : isCurrent ? (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold shrink-0 shadow-xs ring-4 ring-blue-100">
                          {idx + 1}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-[11px] font-bold shrink-0">
                          {idx + 1}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm font-bold tracking-tight",
                          isCompleted && "text-slate-900",
                          isCurrent && "text-blue-900",
                          isPending && "text-slate-500"
                        )}>
                          {stage.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] uppercase tracking-wider bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">
                            Current
                          </span>
                        )}
                      </div>
                      <span className={cn(
                        "text-[11px] leading-tight max-w-[140px]",
                        isCompleted ? "text-emerald-600 font-medium" : (isCurrent ? "text-blue-600 font-medium" : "text-slate-400")
                      )}>
                        {stage.subtitle || (isCompleted ? "Complete" : isPending ? "Locked" : "Action Required")}
                      </span>
                    </div>
                  </Link>

                  {idx < stages.length - 1 && (
                    <div className="px-2 sm:px-4 text-slate-300 shrink-0">
                      <ChevronRight className="w-5 h-5 stroke-[1.5]" />
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
