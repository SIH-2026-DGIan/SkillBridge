import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface NextActionData {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

export function NextBestAction({ action, userName }: { action: NextActionData; userName: string }) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm border border-blue-100/50">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100/50 border border-blue-200/50 text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Your Next Step
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-slate-900">
            {action.title}, {userName.split(' ')[0]}!
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            {action.description}
          </p>
        </div>
        
        <div className="shrink-0">
          <Link 
            href={action.ctaHref}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 hover:shadow-md transition-all group w-full md:w-auto"
          >
            {action.ctaText} 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
