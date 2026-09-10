'use client';

import { useEffect, useState, useRef } from 'react';
import { interviewStore } from '@/lib/interview/interview-state';
import { AudioStreamManager } from '@/lib/interview/audio-stream';
import { GeminiLiveClient } from '@/lib/interview/gemini-live';
import { Mic, MicOff, PhoneOff, Video, Share, AudioLines } from 'lucide-react';
import dynamic from 'next/dynamic';
import { TranscriptPanel } from '@/frontend/components/student/interview/TranscriptPanel';

const Avatar3D = dynamic(
  () => import('@/frontend/components/student/interview/Avatar3D').then((mod) => mod.Avatar3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    ),
  }
);

export function InterviewRoom() {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Text Mode Fallback
  const [isTextMode, setIsTextMode] = useState(false);
  const [textInput, setTextInput] = useState('');

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
        if (!isTextMode) {
          await audioManager.startRecording();
        }
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
  }, [isMicOn, isTextMode]);

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || !geminiClientRef.current) return;
    
    // Send to Gemini
    geminiClientRef.current.sendText(textInput);
    
    // Add to transcript
    interviewStore.addMessage('user', textInput);
    
    setTextInput('');
  };

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
        const { evaluation } = await finalizeInterview(
          config.interviewId, 
          transcript.map(msg => ({ speaker: msg.sender, content: msg.text })), 
          'completed',
          config
        );
        
        if (evaluation) {
          // Move to results phase with the server-evaluated score
          interviewStore.endInterview(evaluation);
        } else {
          // The interview ended before any messages were exchanged (or evaluation failed)
          console.warn("No evaluation returned from server. Generating fallback.");
          interviewStore.endInterview({
            score: { overall: 0, technical: 0, problemSolving: 0, relevance: 0, communication: 0, presentation: 0 },
            strengths: ["None (Interview ended too early)"],
            weaknesses: ["Insufficient data to evaluate"]
          });
        }
      }
    } catch (err) {
      console.error("Error finalizing interview:", err);
      interviewStore.endInterview({
        score: { overall: 0, technical: 0, problemSolving: 0, relevance: 0, communication: 0, presentation: 0 },
        strengths: ["Failed to generate evaluation"],
        weaknesses: ["An unexpected error occurred. Please try again."]
      });
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-4 p-4 max-w-7xl mx-auto">
      {/* Left Column: AI Presentation */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 bg-slate-900 rounded-2xl overflow-hidden relative shadow-lg flex items-center justify-center border border-slate-800">
          
          {/* 3D AI Avatar always visible as background */}
          <Avatar3D isSpeaking={isAiSpeaking} />

          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
              <div className="text-center p-6 bg-slate-900 rounded-xl border border-rose-500/30 max-w-md shadow-2xl">
                <div className="text-rose-500 font-bold mb-2 text-lg">Microphone Access Error</div>
                <p className="text-slate-300 text-sm mb-6">{error}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button 
                    onClick={handleEnd}
                    className="px-6 py-2.5 bg-rose-600/10 text-rose-500 border border-rose-500/30 text-sm font-bold rounded-lg hover:bg-rose-500/20 transition-colors w-full sm:w-auto"
                  >
                    Go Back
                  </button>
                  <button 
                    onClick={() => { setError(null); setIsTextMode(true); }}
                    className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                  >
                    Text Chat Mode
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 z-10 pointer-events-none">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                <span className="text-white text-xs font-bold font-mono">
                  {isConnected ? 'AI INTERVIEWER' : 'CONNECTING...'}
                </span>
              </div>
              
              {/* Speaking Indicator overlay */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 pointer-events-none shadow-lg">
                <div className="text-white/90 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                  {isAiSpeaking ? (
                    <>
                      <AudioLines className="w-3 h-3 animate-pulse" />
                      Speaking...
                    </>
                  ) : 'Listening...'}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 shrink-0">
          
          {isTextMode && (
            <form onSubmit={handleSendText} className="flex gap-2 w-full">
              <input 
                type="text" 
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your response to the AI here..."
                className="flex-1 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                type="submit" 
                disabled={!textInput.trim() || !isConnected} 
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                Send
              </button>
            </form>
          )}

          <div className="flex items-center justify-center gap-4 w-full">
            {!isTextMode && (
              <button 
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMicOn ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-rose-100 text-rose-600 hover:bg-rose-200'}`}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
            )}
            
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
