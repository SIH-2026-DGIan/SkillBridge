import { FolderOpen, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PortfolioStatus {
  hasResume: boolean;
  hasAssessment: boolean;
  skillsCount: number;
}

export function PortfolioPreview({ status }: { status: PortfolioStatus }) {
  const checklist = [
    { label: 'Resume', completed: status.hasResume },
    { label: 'Skills', completed: status.skillsCount > 0 },
    { label: 'Projects', completed: false },
    { label: 'Certifications', completed: false },
    { label: 'Internships', completed: false },
  ];

  const completedCount = checklist.filter(i => i.completed).length;
  const totalCount = checklist.length;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/50">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-emerald-500" />
          Your Portfolio
        </h2>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-700">Readiness Score</span>
          <span className="text-xs font-bold text-emerald-600">
            {completedCount === 0 ? '0% / Not started' : `${Math.round((completedCount / totalCount) * 100)}%`}
          </span>
        </div>
        
        <div className="space-y-3">
          {checklist.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              {item.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300 shrink-0" />
              )}
              <span className={cn(
                "text-xs font-medium",
                item.completed ? "text-slate-700" : "text-slate-500"
              )}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
        
        <Link href="/student/portfolio" className="inline-flex items-center justify-center w-full px-4 py-2 mt-5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors">
          Build Your Portfolio &rarr;
        </Link>
      </div>
    </div>
  );
}
