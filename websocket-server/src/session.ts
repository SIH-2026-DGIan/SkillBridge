import { WebSocket } from 'ws';
import * as http from 'http';
import { validateSupabaseToken } from './auth';
import { connectToGemini } from './gemini';

interface BufferedMessage {
  speaker: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export function handleConnection(clientWs: WebSocket, req: http.IncomingMessage) {
  try {
    const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
    const token =
      url.searchParams.get('token') ||
      req.headers['authorization']?.replace('Bearer ', '') ||
      (typeof req.headers['sec-websocket-protocol'] === 'string' ? req.headers['sec-websocket-protocol'] : null);
    const interviewId = url.searchParams.get('interviewId');

    // Issue #1: Reject unauthenticated connections with code 4401 (Unauthorized)
    if (!token || !interviewId) {
      console.warn('Rejecting unauthenticated connection: missing token or interviewId');
      clientWs.close(4401, 'Unauthorized: Missing credentials');
      return;
    }

    const userId = validateSupabaseToken(token);
    if (!userId) {
      console.warn('Rejecting unauthenticated connection: invalid token');
      clientWs.close(4401, 'Unauthorized: Invalid token');
      return;
    }

    console.log(`Authenticated user ${userId} connected for interview ${interviewId}`);

    const startTime = Date.now();
    const messageBuffer: BufferedMessage[] = [];

    // Connect to Gemini Live
    let geminiWs: WebSocket;
    try {
      geminiWs = connectToGemini();
    } catch (gErr: any) {
      console.error('Failed to initialize Gemini Live connection:', gErr.message);
      clientWs.close(1011, 'AI Service Unavailable');
      return;
    }

    geminiWs.on('open', () => {
      console.log(`Connected to Gemini Live for interview: ${interviewId}`);
    });

    // Proxy Gemini -> Client & buffer transcripts
    geminiWs.on('message', (data: any) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(data);
      }

      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.serverContent?.modelTurn?.parts) {
          for (const part of parsed.serverContent.modelTurn.parts) {
            if (part.text) {
              messageBuffer.push({
                speaker: 'ai',
                content: part.text,
                timestamp: new Date().toISOString(),
              });
            }
          }
        }
      } catch {
        // Raw audio buffer or binary stream, continue
      }
    });

    // Proxy Client -> Gemini & buffer transcripts
    clientWs.on('message', (data: any) => {
      if (geminiWs.readyState === WebSocket.OPEN) {
        geminiWs.send(data);
      }

      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.clientContent?.turns) {
          for (const turn of parsed.clientContent.turns) {
            if (turn.parts) {
              for (const part of turn.parts) {
                if (part.text) {
                  messageBuffer.push({
                    speaker: 'user',
                    content: part.text,
                    timestamp: new Date().toISOString(),
                  });
                }
              }
            }
          }
        }
      } catch {
        // Raw audio buffer or binary stream, continue
      }
    });

    // Persist session to Supabase upon disconnect (Issue #20)
    const persistSession = async () => {
      const durationSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.log(`Session ended for interview ${interviewId} (Duration: ${durationSeconds}s, Messages: ${messageBuffer.length})`);
        return;
      }

      try {
        // 1. Update interview session
        await fetch(`${supabaseUrl}/rest/v1/interviews?id=eq.${interviewId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({
            status: messageBuffer.length > 0 ? 'completed' : 'abandoned',
            duration_seconds: durationSeconds,
            ended_at: new Date().toISOString(),
          }),
        });

        // 2. Insert interview messages if any
        if (messageBuffer.length > 0) {
          const rows = messageBuffer.map((msg) => ({
            interview_id: interviewId,
            speaker: msg.speaker,
            content: msg.content,
            timestamp: msg.timestamp,
          }));

          await fetch(`${supabaseUrl}/rest/v1/interview_messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              Prefer: 'return=minimal',
            },
            body: JSON.stringify(rows),
          });
        }
        console.log(`Persisted interview session ${interviewId} to database`);
      } catch (dbErr) {
        console.error('Failed to persist interview session to database:', dbErr);
      }
    };

    // Handle closures
    clientWs.on('close', () => {
      console.log(`Client disconnected for interview: ${interviewId}`);
      if (geminiWs.readyState === WebSocket.OPEN) {
        geminiWs.close();
      }
      persistSession();
    });

    geminiWs.on('close', () => {
      console.log(`Gemini disconnected for interview: ${interviewId}`);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.close();
      }
      persistSession();
    });

    // Error handling
    clientWs.on('error', (err) => {
      console.error('Client WebSocket error:', err);
    });

    geminiWs.on('error', (err) => {
      console.error('Gemini WebSocket error:', err);
    });
  } catch (err) {
    console.error('Session setup failed:', err);
    clientWs.close(1011, 'Internal server error');
  }
}
