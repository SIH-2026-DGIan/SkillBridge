'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createInterviewSession(targetRole: string, interviewType: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Create session token (In a real app this could be a signed JWT specific to the proxy)
  // For the MVP, the proxy will just validate the Supabase user token if passed, 
  // or we can generate a random session ID here for tracking.
  const sessionId = Math.random().toString(36).substring(2, 15);

  const { data, error } = await supabase
    .from('interviews')
    .insert({
      user_id: user.id,
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

  // Return the interview ID and the supabase access token so the client can pass it to the proxy
  const { data: sessionData } = await supabase.auth.getSession();
  
  return { 
    interviewId: data.id, 
    sessionId,
    token: sessionData.session?.access_token 
  };
}

export async function finalizeInterview(
  interviewId: string, 
  messages: { speaker: string, content: string }[],
  status: 'completed' | 'abandoned' | 'failed'
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
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
    .eq('user_id', user.id);

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

  revalidatePath('/student/interview');
  return { success: true };
}

export async function getInterviewHistory() {
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
