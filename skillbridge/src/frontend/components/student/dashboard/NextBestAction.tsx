import Link from 'next/link';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';

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
  const firstName = userName?.split(' ')[0] || 'Candidate';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-6 sm:p-7 shadow-sm border border-blue-500/30">
      {/* Subtle decorative background circles */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 -mb-12 w-48 h-48 bg-indigo-400/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-blue-100 text-[11px] font-bold uppercase tracking-wider mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Recommended Next Best Step</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
            {action.title}
          </h2>

          <p className="text-blue-100/90 text-sm leading-relaxed mb-3">
            {action.description}
          </p>

          {action.impactReason && (
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-200 bg-black/15 px-3 py-1.5 rounded-lg border border-white/10">
              <span className="text-amber-300 font-bold">Why:</span>
              <span>{action.impactReason}</span>
            </div>
          )}
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {action.secondaryCtaText && action.secondaryCtaHref && (
            <Link
              href={action.secondaryCtaHref}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all backdrop-blur-xs text-center"
            >
              {action.secondaryCtaText}
            </Link>
          )}

          <Link
            href={action.ctaHref}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-black shadow-md hover:shadow-lg transition-all group text-center"
          >
            <span>{action.ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
