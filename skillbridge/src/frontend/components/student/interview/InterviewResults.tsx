'use client';

import { useEffect, useState } from 'react';
import { interviewStore } from '@/lib/interview/interview-state';
import { evaluateInterview } from '@/lib/interview/interview-scoring';
import { type InterviewResult } from '@/lib/interview/interview-types';
import { CheckCircle, AlertTriangle, Save, Loader2, BarChart2, TrendingUp, Target } from 'lucide-react';
import Link from 'next/link';

export function InterviewResults() {
  const [result, setResult] = useState<InterviewResult | null>(interviewStore.getResult());
  const transcript = interviewStore.getTranscript();
  const config = interviewStore.getConfig();
  const [isSaved, setIsSaved] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    const processInterview = async () => {
      try {
        if (!config || transcript.length === 0) return;
        
        setIsEvaluating(true);
        setIsSaved(true); // Already saved by InterviewRoom

        // Run evaluation
        const evaluation = await evaluateInterview(transcript, config);
        setResult(evaluation);
        interviewStore.endInterview(evaluation); // Save to store

        // In P1/P2, we will also update the Supabase record with this evaluation score.
        // For P0, we just show it.

      } catch (err) {
        console.error("Failed to evaluate interview", err);
      } finally {
        setIsEvaluating(false);
      }
    };

    if (!result || result.score.overall === 0) {
      processInterview();
    }
  }, [transcript, config]);

  const MetricBar = ({ label, value }: { label: string, value: number }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="font-bold text-slate-900">{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${
            value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-500' : 'bg-rose-500'
          }`} 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        <div className="px-8 py-10 text-center border-b border-slate-100 bg-slate-50">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Interview Completed</h2>
          <p className="text-slate-600">
            Your {config?.targetRole || 'practice'} interview has concluded.
          </p>
          
          <div className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${isSaved ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
            <Save className={`w-4 h-4 ${isSaved ? '' : 'animate-pulse'}`} />
            {isSaved ? 'Session Saved' : 'Saving Transcript...'}
          </div>
        </div>

        <div className="p-8">
          {isEvaluating ? (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-8 flex flex-col items-center justify-center text-center mb-8">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
              <h4 className="font-bold text-indigo-900 mb-2">Analyzing Performance</h4>
              <p className="text-sm text-indigo-700 max-w-md">
                Our Evaluation Engine is reviewing your transcript to generate a detailed breakdown of your technical accuracy, problem solving, and communication.
              </p>
            </div>
          ) : result && result.score.overall > 0 ? (
            <div className="mb-10">
              <div className="grid md:grid-cols-2 gap-10">
                
                {/* Metrics */}
                <div>
                  <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-indigo-600" /> 
                    Performance Breakdown
                  </h3>
                  
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="text-4xl font-black text-indigo-600">{result.score.overall}%</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Overall Score</div>
                  </div>

                  <div className="space-y-5">
                    <MetricBar label="Technical Knowledge" value={result.score.technical} />
                    <MetricBar label="Problem Solving" value={result.score.problemSolving} />
                    <MetricBar label="Answer Relevance" value={result.score.relevance} />
                    <MetricBar label="Communication" value={result.score.communication} />
                    <MetricBar label="Presentation" value={result.score.presentation} />
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" /> 
                    Actionable Feedback
                  </h3>

                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-emerald-700 mb-3 uppercase tracking-wider">What you did well</h4>
                    <ul className="space-y-3">
                      {result.strengths.map((str, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-700">
                          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-rose-700 mb-3 uppercase tracking-wider">Work on</h4>
                    <ul className="space-y-3">
                      {result.weaknesses.map((wk, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-700">
                          <TrendingUp className="w-5 h-5 text-rose-500 shrink-0" />
                          <span>{wk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => interviewStore.reset()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Practice Again
            </button>
            <Link 
              href="/student/skill-gaps"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-700 border border-indigo-200 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
            >
              View Skill Gaps
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
