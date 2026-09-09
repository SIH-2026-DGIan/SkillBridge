'use client';

import { useEffect, useState, useRef } from 'react';
import { interviewStore } from '@/lib/interview/interview-state';

export function TranscriptPanel() {
  const [messages, setMessages] = useState(interviewStore.getTranscript());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = interviewStore.subscribe(() => {
      setMessages([...interviewStore.getTranscript()]);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={scrollRef}
      className="h-full overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-200"
    >
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm text-center">
          <p>Connecting to AI Interviewer...</p>
          <p className="text-xs mt-2">The transcript will appear here.</p>
        </div>
      )}

      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1 mr-1">
            {msg.sender === 'user' ? 'You' : 'Interviewer'}
          </span>
          <div 
            className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : 'bg-slate-100 text-slate-800 rounded-tl-sm'
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}
