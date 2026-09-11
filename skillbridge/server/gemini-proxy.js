const { WebSocketServer, WebSocket } = require('ws');
const dotenv = require('dotenv');
const path = require('path');
const url = require('url');

// Load environment variables from .env.local and .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const PORT = process.env.PROXY_PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in environment variables. Proxy cannot start.");
  process.exit(1);
}

wss.on('connection', (clientWs, req) => {
  console.log(`[Proxy] Client connected from ${req.socket.remoteAddress}`);

  // Extract query params (token, interviewId)
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  const token = reqUrl.searchParams.get('token');
  const interviewId = reqUrl.searchParams.get('interviewId');

  console.log(`[Proxy] Session request: interviewId=${interviewId}`);

  // Note: For full production readiness, you would validate the 'token' using Supabase Admin Auth
  // to ensure the user is allowed to access this interview session.

  // Establish connection to Gemini Live API
  const GEMINI_WS_URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${GEMINI_API_KEY}`;
  
  const geminiWs = new WebSocket(GEMINI_WS_URL);

  geminiWs.on('open', () => {
    console.log('[Proxy] Connected to Gemini Live API');
  });

  // Forward Client -> Gemini
  clientWs.on('message', (data) => {
    if (geminiWs.readyState === WebSocket.OPEN) {
      geminiWs.send(data);
    }
  });

  // Forward Gemini -> Client
  geminiWs.on('message', (data) => {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(data);
    }
  });

  // Handle Gemini disconnects
  geminiWs.on('close', (code, reason) => {
    console.log(`[Proxy] Gemini connection closed (${code}): ${reason}`);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.close(code, reason);
    }
  });

  geminiWs.on('error', (error) => {
    console.error('[Proxy] Gemini connection error:', error.message);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.close(1011, 'Internal Server Error');
    }
  });

  // Handle Client disconnects
  clientWs.on('close', (code, reason) => {
    console.log(`[Proxy] Client disconnected (${code})`);
    if (geminiWs.readyState === WebSocket.OPEN) {
      geminiWs.close(1000, 'Client disconnected');
    }
  });

  clientWs.on('error', (error) => {
    console.error('[Proxy] Client connection error:', error.message);
    if (geminiWs.readyState === WebSocket.OPEN) {
      geminiWs.close(1000, 'Client error');
    }
  });
});

console.log(`[Proxy] WebSocket server listening on ws://localhost:${PORT}`);
