import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';
import type { NextActionData } from './NextBestAction';

export function RecommendedActions({ actions }: { actions: NextActionData[] }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Action Queue
        </h2>
        <div className="flex-1 h-px bg-slate-200" aria-hidden="true" />
      </div>

      {/* Action list — secondary weight, compact rows */}
      <div
        className="flex flex-col gap-2 flex-1"
        role="list"
        aria-label="Secondary action queue"
      >
        {actions.map((action, idx) => {
          // Actions in queue start at 02
          const stepNum = String(idx + 2).padStart(2, '0');
          // Treat as "available" if href is set (business logic already filters)
          const isAvailable = Boolean(action.ctaHref);

          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group"
              role="listitem"
            >
              <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                {/* Left: step + content */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Step number */}
                  <span
                    className="shrink-0 w-6 h-6 rounded-md bg-slate-100 text-slate-400 font-mono text-[11px] font-bold flex items-center justify-center"
                    aria-label={`Step ${stepNum}`}
                  >
                    {stepNum}
                  </span>

                  {/* Text */}
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors truncate">
                      {action.title}
                    </h3>
                    {action.description && (
                      <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                        {action.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: CTA or locked */}
                <div className="shrink-0">
                  {isAvailable ? (
                    <Link
                      href={action.ctaHref}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label={`${action.ctaText} — ${action.title}`}
                    >
                      <span className="hidden sm:inline">{action.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-400 border border-slate-200 text-xs font-medium cursor-not-allowed"
                      title="Complete earlier steps first"
                      aria-label="Locked — complete earlier steps first"
                    >
                      <Lock className="w-3 h-3" aria-hidden="true" />
                      <span className="hidden sm:inline">Locked</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
