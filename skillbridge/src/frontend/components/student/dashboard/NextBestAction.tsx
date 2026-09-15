import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export interface NextActionData {
  title: string;
  description: string;
  impactReason?: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export function NextBestAction({ action, userName }: { action: NextActionData; userName: string }) {
  return (
    <div className="flex flex-col h-full">
      {/* Section label */}
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Next Best Action
        </h2>
        <div className="flex-1 h-px bg-slate-200" aria-hidden="true" />
      </div>

      {/* Card */}
      <div className="relative flex-1 rounded-2xl bg-white border border-blue-200 shadow-sm overflow-hidden flex flex-col">
        {/* Blue accent top bar */}
        <div className="h-1 w-full bg-blue-600 shrink-0" aria-hidden="true" />

        <div className="flex flex-col flex-1 p-6 sm:p-8">
          {/* Step badge */}
          <div className="flex items-center gap-2.5 mb-5">
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs shadow-sm"
              aria-label="Step 01"
            >
              01
            </span>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Priority Action
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mb-3 leading-tight">
            {action.title}
          </h3>

          {/* Description */}
          <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed mb-5 max-w-lg">
            {action.description}
          </p>

          {/* Impact callout */}
          {action.impactReason && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100 mb-6">
              <Zap className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-blue-700 font-medium leading-relaxed">
                <span className="font-bold">Why this matters: </span>
                {action.impactReason}
              </p>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-auto">
            <Link
              href={action.ctaHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-bold transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {action.ctaText}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            {action.secondaryCtaText && action.secondaryCtaHref && (
              <Link
                href={action.secondaryCtaHref}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              >
                {action.secondaryCtaText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
