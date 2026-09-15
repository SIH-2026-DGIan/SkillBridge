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
    <section
      className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-sm overflow-hidden"
      aria-label="Career Journey Progress"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center overflow-x-auto scrollbar-none py-0">
          <div className="flex items-center min-w-max w-full">
            {stages.map((stage, idx) => {
              const isCompleted = stage.isCompleted;
              const isCurrent = stage.isCurrent;
              const isLocked = !isCompleted && !isCurrent;
              const isLastStage = idx === stages.length - 1;

              const StepContent = (
                <div
                  className={cn(
                    'flex items-center gap-2.5 px-3 sm:px-4 py-4 transition-all duration-200 relative',
                    isCurrent && 'bg-blue-50/60',
                    isCompleted && 'hover:bg-emerald-50/40',
                    isLocked && 'cursor-not-allowed opacity-55'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {/* Step indicator */}
                  <div className="relative shrink-0">
                    {isCompleted ? (
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white shadow-sm">
                        <Check className="w-2.5 h-2.5 stroke-[3]" aria-hidden="true" />
                      </span>
                    ) : isCurrent ? (
                      <>
                        {/* Pulse ring */}
                        <span className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping" aria-hidden="true" />
                        <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-sm ring-2 ring-blue-200">
                          {idx + 1}
                        </span>
                      </>
                    ) : (
                      <span
                        className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-150 border border-slate-200 text-slate-400"
                        aria-label="Locked"
                      >
                        <Lock className="w-2.5 h-2.5" aria-hidden="true" />
                      </span>
                    )}
                  </div>

                  {/* Label + microcopy */}
                  <div className="flex flex-col leading-none">
                    <span
                      className={cn(
                        'text-[13px] font-semibold tracking-tight whitespace-nowrap',
                        isCompleted && 'text-slate-700',
                        isCurrent && 'text-blue-900',
                        isLocked && 'text-slate-400'
                      )}
                    >
                      {stage.label}
                    </span>
                    {/* Show microcopy only on current + completed, keep locked minimal */}
                    {(isCurrent || isCompleted) && (
                      <span
                        className={cn(
                          'text-[11px] mt-0.5 whitespace-nowrap',
                          isCompleted && 'text-emerald-600 font-medium',
                          isCurrent && 'text-blue-600 font-medium'
                        )}
                      >
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-blue-500 inline-block" aria-hidden="true" />
                            {stage.subtitle || 'Action required'}
                          </span>
                        )}
                        {isCompleted && (stage.subtitle || 'Complete')}
                      </span>
                    )}
                  </div>
                </div>
              );

              return (
                <div key={stage.id} className="flex items-stretch">
                  {/* Only completed and current steps are navigable */}
                  {isLocked ? (
                    <div
                      role="button"
                      aria-disabled="true"
                      tabIndex={-1}
                      title={`${stage.label} — Complete earlier steps first`}
                    >
                      {StepContent}
                    </div>
                  ) : (
                    <Link
                      href={stage.href}
                      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 rounded"
                    >
                      {StepContent}
                    </Link>
                  )}

                  {/* Connector */}
                  {!isLastStage && (
                    <div
                      className="flex items-center px-1 text-slate-200 shrink-0 self-center"
                      aria-hidden="true"
                    >
                      <ChevronRight className="w-4 h-4 stroke-[1.5]" />
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
