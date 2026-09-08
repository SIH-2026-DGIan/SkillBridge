import { BookOpen, PlayCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  progress: number;
}

export function LearningPreview({ courses }: { courses?: Course[] }) {
  const activeCourses = courses || [];

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/50">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-500" />
          Keep Learning
        </h2>
      </div>
      
      <div className="p-5">
        {activeCourses.length === 0 ? (
          <div className="text-center space-y-2 py-2">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-100">
              <BookOpen className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-sm font-semibold text-slate-700">No active courses</div>
            <div className="text-xs text-slate-500">Your personalized learning recommendations will appear after we understand your skills and goals.</div>
            <Link href="/student/assessment" className="inline-flex items-center justify-center w-full px-4 py-2 mt-3 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
              Check Your Skills &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activeCourses.map((course) => (
              <div key={course.id} className="group flex items-start gap-3 cursor-pointer">
                <div className="mt-0.5 shrink-0">
                  <PlayCircle className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 bg-slate-100 rounded-full h-1">
                      <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 shrink-0">{course.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
            
            <Link href="/student/learning" className="inline-flex items-center justify-center w-full gap-1.5 px-4 py-2 mt-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors">
              View All Learning <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
