'use client';

import { useEffect, useState, useRef } from 'react';
import { interviewStore } from '@/lib/interview/interview-state';
import { AudioStreamManager } from '@/lib/interview/audio-stream';
import { GeminiLiveClient } from '@/lib/interview/gemini-live';
import { Mic, MicOff, PhoneOff, Video, Share, AudioLines } from 'lucide-react';
import { TranscriptPanel } from '@/frontend/components/student/interview/TranscriptPanel';

export function InterviewRoom() {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioManagerRef = useRef<AudioStreamManager | null>(null);
  const geminiClientRef = useRef<GeminiLiveClient | null>(null);

  useEffect(() => {
    // Initialize session
    const audioManager = new AudioStreamManager();
    const geminiClient = new GeminiLiveClient();

    audioManagerRef.current = audioManager;
    geminiClientRef.current = geminiClient;

    const setupSession = async () => {
      try {
        await audioManager.startRecording();
        geminiClient.connect();

        // Wire Audio -> Gemini
        audioManager.onAudioData = (base64Pcm) => {
          if (isMicOn) {
            geminiClient.sendAudio(base64Pcm);
          }
        };

        // Wire Gemini -> Audio
        geminiClient.onAudioReceived = (base64Pcm) => {
          audioManager.playAudioBase64(base64Pcm);
          setIsAiSpeaking(true);
          // Very simple heuristic for speaking indicator timeout
          setTimeout(() => setIsAiSpeaking(false), 500); 
        };

        geminiClient.onTextReceived = (text, isFinal) => {
          // Add to transcript
          interviewStore.addMessage('ai', text);
        };

        geminiClient.onError = (err) => {
          setError(err.message);
        };

        setIsConnected(true);
      } catch (err: any) {
        setError(err.message || 'Failed to start interview');
      }
    };

    setupSession();

    return () => {
      audioManager.stop();
      geminiClient.disconnect();
    };
  }, [isMicOn]);

  const handleEnd = async () => {
    if (audioManagerRef.current) audioManagerRef.current.stop();
    if (geminiClientRef.current) geminiClientRef.current.disconnect();
    setIsConnected(false);
    
    const config = interviewStore.getConfig();
    const transcript = interviewStore.getTranscript();
    
    try {
      if (config?.interviewId) {
        // Import finalizeInterview dynamically or at top of file
        const { finalizeInterview } = await import('@/app/actions/interview.actions');
        await finalizeInterview(
          config.interviewId, 
          transcript.map(msg => ({ speaker: msg.sender, content: msg.text })), 
          'completed'
        );
      }
    } catch (err) {
      console.error("Error finalizing interview:", err);
    }
    
    // Move to results phase
    interviewStore.endInterview({
      score: { overall: 0, technical: 0, problemSolving: 0, relevance: 0, communication: 0, presentation: 0 },
      strengths: [],
      weaknesses: []
    });
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-4 p-4 max-w-7xl mx-auto">
      {/* Left Column: AI Presentation */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 bg-slate-900 rounded-2xl overflow-hidden relative shadow-lg flex items-center justify-center border border-slate-800">
          
          <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
            <span className="text-white text-xs font-bold font-mono">
              {isConnected ? 'AI INTERVIEWER' : 'CONNECTING...'}
            </span>
          </div>

          {/* AI Digital Human Placeholder */}
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl ${isAiSpeaking ? 'animate-pulse scale-105 transition-transform' : 'transition-transform'}`}>
                <AudioLines className={`w-12 h-12 text-white ${isAiSpeaking ? 'opacity-100 animate-bounce' : 'opacity-50'}`} />
              </div>
              {isAiSpeaking && (
                <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-20"></div>
              )}
            </div>
            <div className="text-white/60 text-sm font-medium tracking-widest uppercase">
              {isAiSpeaking ? 'Speaking...' : 'Listening...'}
            </div>
          </div>

        </div>

        {/* Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center gap-4 shrink-0">
          <button 
            onClick={() => setIsMicOn(!isMicOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMicOn ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-rose-100 text-rose-600 hover:bg-rose-200'}`}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          <button className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center cursor-not-allowed">
            <Video className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center cursor-not-allowed">
            <Share className="w-5 h-5" />
          </button>
          
          <div className="w-px h-8 bg-slate-200 mx-2"></div>
          
          <button 
            onClick={handleEnd}
            className="px-6 h-12 rounded-full bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors flex items-center gap-2"
          >
            <PhoneOff className="w-4 h-4" /> End Interview
          </button>
        </div>
      </div>

      {/* Right Column: Transcript */}
      <div className="w-full md:w-[400px] bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Live Transcript</h3>
        </div>
        <div className="flex-1 overflow-hidden">
          <TranscriptPanel />
        </div>
      </div>
    </div>
  );
}
