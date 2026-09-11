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
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
          Next Best Action
        </h2>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      <div className="relative flex-1 rounded-2xl bg-[#0F172A] text-white p-6 sm:p-8 shadow-lg border border-slate-800 overflow-hidden group flex flex-col justify-center">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:14px_24px] opacity-20"></div>
        
        {/* Glowing orb */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-600/30 rounded-full blur-3xl pointer-events-none transition-opacity group-hover:opacity-60" />

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 mb-4">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">AI Recommended</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3 leading-tight">
              {action.title}
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-lg font-medium">
              {action.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-auto">
            <Link
              href={action.ctaHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
            >
              <span>{action.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            {action.secondaryCtaText && action.secondaryCtaHref && (
              <Link
                href={action.secondaryCtaHref}
                className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-bold border border-slate-700 transition-colors text-center"
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
