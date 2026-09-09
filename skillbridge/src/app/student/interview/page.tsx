'use client';

import { useState, useEffect } from 'react';
import { interviewStore } from '@/lib/interview/interview-state';
import { InterviewSetup } from '@/frontend/components/student/interview/InterviewSetup';

import { InterviewRoom } from '@/frontend/components/student/interview/InterviewRoom';
import { InterviewResults } from '@/frontend/components/student/interview/InterviewResults';
import { InterviewHistory } from '@/frontend/components/student/interview/InterviewHistory';

export default function InterviewPage() {
  const [phase, setPhase] = useState(interviewStore.getPhase());

  useEffect(() => {
    // Check if we should default to setup instead of history (if history is empty)
    if (interviewStore.getPhase() === 'history') {
      const historyStr = localStorage.getItem('sb_interview_history');
      if (!historyStr || JSON.parse(historyStr).length === 0) {
        interviewStore.startSetup();
      }
    }

    const unsubscribe = interviewStore.subscribe(() => {
      setPhase(interviewStore.getPhase());
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-full bg-slate-50 relative">
      {phase === 'history' && <InterviewHistory />}
      {phase === 'setup' && <InterviewSetup />}
      {phase === 'interviewing' && <InterviewRoom />}
      {phase === 'results' && <InterviewResults />}
    </div>
  );
}
