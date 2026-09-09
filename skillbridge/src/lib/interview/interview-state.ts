import { InterviewPhase, InterviewConfig, InterviewResult } from './interview-types';

export class InterviewState {
  private phase: InterviewPhase = 'history';
  private config: InterviewConfig | null = null;
  private result: InterviewResult | null = null;
  private transcript: { sender: 'ai' | 'user'; text: string; id: string; timestamp: Date }[] = [];
  
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // Getters
  getPhase() { return this.phase; }
  getConfig() { return this.config; }
  getResult() { return this.result; }
  getTranscript() { return this.transcript; }

  startSetup() {
    this.phase = 'setup';
    this.notify();
  }

  startInterview(config: InterviewConfig) {
    this.config = config;
    this.phase = 'interviewing';
    this.transcript = [];
    this.notify();
  }

  addMessage(sender: 'ai' | 'user', text: string) {
    this.transcript.push({ sender, text, id: Math.random().toString(36).substring(7), timestamp: new Date() });
    this.notify();
  }

  endInterview(result: InterviewResult) {
    this.result = result;
    this.phase = 'results';
    this.notify();
  }

  reset() {
    this.phase = 'history';
    this.config = null;
    this.result = null;
    this.transcript = [];
    this.notify();
  }
}

// Singleton instance for the session
export const interviewStore = new InterviewState();
