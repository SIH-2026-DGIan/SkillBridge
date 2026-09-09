'use client';

import { useEffect, useState } from 'react';
import { interviewStore } from '@/lib/interview/interview-state';
import { Video, Calendar, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { getInterviewHistory } from '@/app/actions/interview.actions';

export function InterviewHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getInterviewHistory();
        setHistory(data);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, []);

  const handleStartNew = () => {
    interviewStore.startSetup();
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (history.length === 0) {
    // If no history, just go straight to setup
    // But for safety, we render a clean empty state in case they land here
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 mb-6">
          <Video className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-3">AI Interview Coach</h1>
        <p className="text-slate-600 text-lg mb-8">Prepare for your next opportunity with a real-time adaptive voice interview.</p>
        <button 
          onClick={handleStartNew}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" /> Start First Interview
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">Interview Coach</h1>
          <p className="text-slate-500 text-sm">Review past performance or start a new session.</p>
        </div>
        <button 
          onClick={handleStartNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Start New Interview
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-slate-900 text-sm">Recent Interviews</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {history.map((item) => (
            <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
              <div>
                <div className="font-bold text-slate-900 text-lg mb-1">{item.role}</div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5"><Video className="w-4 h-4" /> {item.type}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(item.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-600">{item.score}%</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Score</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
