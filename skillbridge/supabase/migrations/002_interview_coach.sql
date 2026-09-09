-- Create interview tables for AI Interview Coach

-- 1. interviews table
CREATE TABLE public.interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_role TEXT NOT NULL,
  interview_type TEXT NOT NULL,
  session_id TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned', 'failed'
  overall_score NUMERIC,
  evaluation JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. interview_messages table
CREATE TABLE public.interview_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_id UUID REFERENCES public.interviews(id) ON DELETE CASCADE,
  speaker TEXT NOT NULL, -- 'user' or 'ai'
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for performance
CREATE INDEX idx_interviews_user_id ON public.interviews(user_id);
CREATE INDEX idx_interviews_created_at ON public.interviews(created_at DESC);
CREATE INDEX idx_interview_messages_interview_id ON public.interview_messages(interview_id);

-- 4. Enable Row Level Security
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_messages ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Users can only view their own interviews
CREATE POLICY "Users can view own interviews"
ON public.interviews FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own interviews
CREATE POLICY "Users can insert own interviews"
ON public.interviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own interviews
CREATE POLICY "Users can update own interviews"
ON public.interviews FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can view messages of their own interviews
CREATE POLICY "Users can view messages of own interviews"
ON public.interview_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.interviews
    WHERE interviews.id = interview_messages.interview_id
    AND interviews.user_id = auth.uid()
  )
);

-- Users can insert messages to their own interviews
CREATE POLICY "Users can insert messages to own interviews"
ON public.interview_messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.interviews
    WHERE interviews.id = interview_messages.interview_id
    AND interviews.user_id = auth.uid()
  )
);
