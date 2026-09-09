export type InterviewPhase = 'history' | 'setup' | 'interviewing' | 'results';

export interface InterviewConfig {
  targetRole: string;
  type: string;
  difficulty: string;
  duration: string;
  useCamera: boolean;
  useScreen: boolean;
  interviewId?: string;
  token?: string;
}

export interface InterviewMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export interface InterviewScore {
  overall: number;
  technical: number;
  problemSolving: number;
  relevance: number;
  communication: number;
  presentation: number;
}

export interface InterviewResult {
  score: InterviewScore;
  strengths: string[];
  weaknesses: string[];
}
