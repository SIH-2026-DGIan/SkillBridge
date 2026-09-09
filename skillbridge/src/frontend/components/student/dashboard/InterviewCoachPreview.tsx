import { Video, ArrowRight, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';

interface InterviewHistory {
  id: string;
  role: string;
  type: string;
  score: number;
  date: string;
}

export function InterviewCoachPreview({ lastInterview }: { lastInterview?: InterviewHistory }) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-indigo-100 flex items-center justify-between bg-white/50">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Video className="w-4 h-4 text-indigo-600" />
          AI Interview Coach
        </h2>
        <span className="text-[10px] font-bold tracking-wider uppercase bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-sm">
          Gemini Live
        </span>
      </div>
      
      <div className="p-5 relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Activity className="w-24 h-24 text-indigo-600" />
        </div>
        
        <p className="text-sm text-slate-700 mb-5 relative z-10">
          Practice a real-time voice interview for your target role. The AI adapts questions to your answers and gives personalized feedback.
        </p>

        {!lastInterview ? (
          <div className="space-y-4 relative z-10">
            <div className="p-3 bg-white/60 border border-indigo-50 rounded-lg backdrop-blur-sm">
              <div className="text-xs font-semibold text-slate-600 text-center">
                Start your first practice interview
              </div>
            </div>
            <Link href="/student/interview" className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-sm">
              Start Interview
            </Link>
          </div>
        ) : (
          <div className="space-y-4 relative z-10">
            <div className="p-3 bg-white border border-indigo-100 rounded-lg shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Last Interview
                </div>
                <div className="text-sm font-bold text-slate-900 truncate max-w-[150px]">
                  {lastInterview.role}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium mb-1">Score</div>
                <div className="text-lg font-black text-emerald-600">
                  {lastInterview.score}%
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link href="/student/interview" className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-sm">
                Practice Again
              </Link>
              <Link href="/student/interview" className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-white text-slate-700 border border-slate-200 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all">
                View History
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
