import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { NextActionData } from './NextBestAction';

export function RecommendedActions({ actions }: { actions: NextActionData[] }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
          Recommended Next Steps
        </h2>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      <div className="flex flex-col gap-3">
        {actions.map((action, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-sm hover:shadow-md group">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-0.5 font-mono text-slate-300 font-bold text-lg">
                0{idx + 1}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {action.title}
                </h3>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5 leading-relaxed">
                  {action.description}
                </p>
                {action.impactReason && (
                  <p className="text-[10px] text-slate-400 mt-1 italic">
                    {action.impactReason}
                  </p>
                )}
              </div>
            </div>
            
            <div className="shrink-0">
              <Link
                href={action.ctaHref}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 text-xs font-bold transition-colors w-full sm:w-auto justify-center"
              >
                {action.ctaText}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
