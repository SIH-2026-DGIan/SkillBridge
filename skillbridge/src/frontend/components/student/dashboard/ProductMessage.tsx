import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ProductMessage() {
  return (
    <section className="bg-[#111827] text-white px-6 lg:px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400">
          <Sparkles className="w-3.5 h-3.5" />
        </span>
        <span className="text-xs font-medium text-slate-300">
          SkillBridge 2.0 is live! Discover your AI-matched career pathways today.
        </span>
      </div>
      <Link href="#" className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1">
        Read the launch notes <ArrowRight className="w-3 h-3" />
      </Link>
    </section>
  );
}
