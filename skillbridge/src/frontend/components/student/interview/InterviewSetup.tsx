'use client';

import { useState } from 'react';
import { interviewStore } from '@/lib/interview/interview-state';
import { Video, Mic, Layout, Clock, Play, Loader2 } from 'lucide-react';
import { getSession } from '@/lib/user-session';
import { createInterviewSession } from '@/app/actions/interview.actions';

export function InterviewSetup() {
  const session = getSession();
  const defaultRole = session?.targetRole || 'Frontend Developer';
  
  const [role, setRole] = useState(defaultRole);
  const [type, setType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Adaptive');
  const [duration, setDuration] = useState('15 min');
  const [useCamera, setUseCamera] = useState(false);
  const [useScreen, setUseScreen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    try {
      setIsStarting(true);
      const sessionData = await createInterviewSession(role, type);
      
      interviewStore.startInterview({
        targetRole: role,
        type,
        difficulty,
        duration,
        useCamera,
        useScreen,
        interviewId: sessionData.interviewId,
        token: sessionData.token
      });
    } catch (err) {
      console.error("Failed to start interview", err);
      alert("Could not start the interview. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 mb-6">
          <Mic className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-3">AI Interview Coach</h1>
        <p className="text-slate-600 text-lg">Prepare for your next opportunity with a real-time adaptive voice interview.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Target Role</label>
              <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Interview Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option>Technical</option>
                  <option>Behavioral / HR</option>
                  <option>Project Deep-Dive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Difficulty</label>
                <select 
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option>Adaptive</option>
                  <option>Entry Level</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Permissions (Optional)</h3>
            
            <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input 
                type="checkbox" 
                checked={useCamera} 
                onChange={(e) => setUseCamera(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <div className="flex items-center gap-3 flex-1">
                <Video className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">Enable Camera</div>
                  <div className="text-xs text-slate-500">Practice maintaining eye contact and body language.</div>
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input 
                type="checkbox" 
                checked={useScreen} 
                onChange={(e) => setUseScreen(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <div className="flex items-center gap-3 flex-1">
                <Layout className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">Enable Screen Sharing</div>
                  <div className="text-xs text-slate-500">For whiteboard or code-pairing interviews.</div>
                </div>
              </div>
            </label>
          </div>
          
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
            <Clock className="w-4 h-4" /> {duration}
          </div>
          <button 
            onClick={handleStart}
            disabled={isStarting}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isStarting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            {isStarting ? 'Starting...' : 'Start Interview'}
          </button>
        </div>
      </div>
    </div>
  );
}
