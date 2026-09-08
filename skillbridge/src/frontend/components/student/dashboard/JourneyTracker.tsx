import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const JOURNEY_STEPS = [
  { id: 'profile', label: 'Profile', href: '/student/profile' },
  { id: 'assess', label: 'Check Your Skills', href: '/student/assessment' },
  { id: 'skills', label: 'Your Skills', href: '/student/skills' },
  { id: 'gaps', label: 'Skills to Improve', href: '/student/skill-gaps' },
  { id: 'learn', label: 'Learn', href: '/student/learning' },
  { id: 'match', label: 'Find Opportunities', href: '/student/opportunities' },
  { id: 'apply', label: 'Apply', href: '/student/applications' },
];

export function JourneyTracker({ activeStep }: { activeStep: number }) {
  return (
    <section className="bg-white border-b border-[#E2E8F0] overflow-x-auto hide-scrollbar">
      <div className="px-6 lg:px-8 py-4 flex items-center min-w-max">
        {JOURNEY_STEPS.map((step, idx) => {
          const isCompleted = idx < activeStep;
          const isActive = idx === activeStep;
          const isNext = idx === activeStep + 1;
          const isLocked = idx > activeStep;

          return (
            <div key={step.id} className="flex items-center">
              <Link 
                href={isLocked ? '#' : step.href} 
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors",
                  isCompleted ? "bg-emerald-50 hover:bg-emerald-100" :
                  isActive ? "bg-blue-50 border border-blue-200" :
                  "hover:bg-slate-50",
                  isLocked && "opacity-60 cursor-not-allowed hover:bg-transparent"
                )}
                onClick={(e) => isLocked && e.preventDefault()}
              >
                {isCompleted ? (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                ) : isActive ? (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                ) : isLocked ? (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-400 shrink-0 border border-slate-200">
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                ) : (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-400 font-bold text-[10px] border border-slate-200 shrink-0">
                    {idx + 1}
                  </span>
                )}
                
                <span className={cn(
                  "text-xs font-semibold whitespace-nowrap",
                  isCompleted ? "text-emerald-700" :
                  isActive ? "text-blue-700" :
                  "text-slate-500"
                )}>
                  {step.label}
                </span>
              </Link>
              
              {idx < JOURNEY_STEPS.length - 1 && (
                <div className={cn(
                  "w-6 h-px mx-2",
                  isCompleted ? "bg-emerald-300" : "bg-[#E2E8F0]"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
