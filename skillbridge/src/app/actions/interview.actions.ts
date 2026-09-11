'use server';

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { evaluateInterview } from '@/lib/interview/interview-scoring';
import { InterviewConfig } from '@/lib/interview/interview-types';

export async function createInterviewSession(targetRole: string, interviewType: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isDemoMode = process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project.supabase.co';

  if (!user && !isDemoMode) {
    throw new Error('Unauthorized');
  }

  const sessionId = Math.random().toString(36).substring(2, 15);
  let interviewId = 'demo-interview-' + sessionId;
  let token = 'mock-demo-token';

  if (!isDemoMode) {
    const { data, error } = await supabase
      .from('interviews')
      .insert({
        user_id: user!.id,
        target_role: targetRole,
        interview_type: interviewType,
        session_id: sessionId,
        status: 'in_progress'
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating interview:', error);
      throw new Error('Failed to create interview session');
    }
    
    interviewId = data.id;
    const { data: sessionData } = await supabase.auth.getSession();
    token = sessionData.session?.access_token || token;
  }
  
  return { 
    interviewId, 
    sessionId,
    token 
  };
}

export async function finalizeInterview(
  interviewId: string, 
  messages: { speaker: string, content: string }[],
  status: 'completed' | 'abandoned' | 'failed',
  config: InterviewConfig
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isDemoMode = process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project.supabase.co';

  if (!user && !isDemoMode) {
    throw new Error('Unauthorized');
  }

  let evaluation = null;
  
  if (isDemoMode) {
    if (status === 'completed' && messages.length > 0) {
      try {
        const transcript = messages.map((msg, idx) => ({ 
          id: `msg-${idx}`,
          sender: msg.speaker as 'user' | 'ai', 
          text: msg.content,
          timestamp: new Date()
        }));
        evaluation = await evaluateInterview(transcript, config);
      } catch (err) {
        console.error('Error generating evaluation:', err);
      }
    }
    revalidatePath('/student/interview');
    return { success: true, evaluation };
  }

  // Calculate duration (approximate for MVP based on created_at and now)
  const { data: interview } = await supabase
    .from('interviews')
    .select('started_at')
    .eq('id', interviewId)
    .single();

  const durationSeconds = interview?.started_at 
    ? Math.floor((Date.now() - new Date(interview.started_at).getTime()) / 1000)
    : 0;

  // 1. Update interview status
  await supabase
    .from('interviews')
    .update({ 
      status, 
      ended_at: new Date().toISOString(),
      duration_seconds: durationSeconds
    })
    .eq('id', interviewId)
    .eq('user_id', user!.id);

  // 2. Save all messages if there are any
  if (messages.length > 0) {
    const formattedMessages = messages.map(msg => ({
      interview_id: interviewId,
      speaker: msg.speaker,
      content: msg.content
    }));

    const { error } = await supabase
      .from('interview_messages')
      .insert(formattedMessages);

    if (error) {
      console.error('Error saving messages:', error);
    }
  }

  // 3. Generate and save evaluation if completed
  if (status === 'completed' && messages.length > 0) {
    try {
      // Map back to the expected format for evaluateInterview
      const transcript = messages.map((msg, idx) => ({ 
        id: `msg-${idx}`,
        sender: msg.speaker as 'user' | 'ai', 
        text: msg.content,
        timestamp: new Date()
      }));
      
      evaluation = await evaluateInterview(transcript, config);
      
      await supabase
        .from('interviews')
        .update({ 
          evaluation,
          overall_score: evaluation.score.overall
        })
        .eq('id', interviewId)
        .eq('user_id', user!.id);
        
    } catch (err) {
      console.error('Error generating evaluation:', err);
    }
  }

  revalidatePath('/student/interview');
  return { success: true, evaluation };
}

export async function getInterviewHistory() {
  // Return empty array gracefully when Supabase is not configured (demo/local mode).
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching history:', error);
    return [];
  }

  return data;
}
