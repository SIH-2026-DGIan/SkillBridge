'use client';

import { Sparkles, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const INDUSTRY_WORKFLOW_STEPS = [
  { step: '1. Post Job', label: 'Define role requirements', status: 'completed' },
  { step: '2. AI Match', label: 'Deterministic candidate scoring', status: 'completed' },
  { step: '3. Shortlist', label: 'Review verified evidence', status: 'active' },
  { step: '4. Technical Interview', label: 'Schedule rounds with partner TPO', status: 'pending' },
  { step: '5. Offer & Hire', label: 'Confirm placement outcome', status: 'pending' },
];

export function EmployerJourney() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Employer Recruitment Lifecycle
          </h2>
        </div>
        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
          Active Stage: Candidate Shortlisting &amp; Technical Interviews
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {INDUSTRY_WORKFLOW_STEPS.map((s, idx) => {
          const isCompleted = s.status === 'completed';
          const isActive = s.status === 'active';

          return (
            <div
              key={s.step}
              className={cn(
                'p-3 rounded-xl text-center flex flex-col items-center transition-all',
                isActive && 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs',
                isCompleted && 'bg-emerald-50/80 text-emerald-800 border border-emerald-200/60',
                !isActive && !isCompleted && 'bg-slate-50 text-slate-500 border border-slate-200/60'
              )}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={cn(
                    'w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black',
                    isActive && 'bg-white text-blue-700',
                    isCompleted && 'bg-emerald-600 text-white',
                    !isActive && !isCompleted && 'bg-slate-200 text-slate-500'
                  )}
                >
                  {isCompleted ? <Check className="w-2.5 h-2.5" /> : idx + 1}
                </span>
                <span className={cn('text-xs font-extrabold truncate', isActive ? 'text-white' : 'text-slate-800')}>
                  {s.step}
                </span>
              </div>
              <p
                className={cn(
                  'text-[10px] truncate max-w-full font-medium',
                  isActive ? 'text-blue-100' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                )}
              >
                {s.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
