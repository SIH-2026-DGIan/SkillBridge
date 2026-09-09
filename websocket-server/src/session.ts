import { WebSocket } from 'ws';
import * as http from 'http';
import { validateSupabaseToken } from './auth';
import { connectToGemini } from './gemini';

export function handleConnection(clientWs: WebSocket, req: http.IncomingMessage) {
  try {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');
    const interviewId = url.searchParams.get('interviewId');

    if (!token || !interviewId) {
      console.warn('Missing token or interviewId');
      clientWs.close(1008, 'Missing credentials');
      return;
    }

    const userId = validateSupabaseToken(token);
    if (!userId) {
      console.warn('Invalid token');
      clientWs.close(1008, 'Invalid token');
      return;
    }

    console.log(`Starting proxy session for interview: ${interviewId}`);
    
    // Connect to Gemini
    const geminiWs = connectToGemini();

    geminiWs.on('open', () => {
      console.log(`Connected to Gemini for interview: ${interviewId}`);
    });

    // Proxy Gemini -> Client
    geminiWs.on('message', (data: any) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(data);
      }
    });

    // Proxy Client -> Gemini
    clientWs.on('message', (data: any) => {
      if (geminiWs.readyState === WebSocket.OPEN) {
        geminiWs.send(data);
      }
    });

    // Handle closures
    clientWs.on('close', () => {
      console.log(`Client disconnected for interview: ${interviewId}`);
      if (geminiWs.readyState === WebSocket.OPEN) {
        geminiWs.close();
      }
    });

    geminiWs.on('close', () => {
      console.log(`Gemini disconnected for interview: ${interviewId}`);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.close();
      }
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
