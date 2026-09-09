import { WebSocketServer, WebSocket } from 'ws';
import * as http from 'http';
import * as dotenv from 'dotenv';
import { handleConnection } from './session';

dotenv.config();

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('SkillBridge WebSocket Proxy is running');
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
  console.log('New client connection request');
  handleConnection(ws, req);
});

server.listen(PORT, () => {
  console.log(`WebSocket Server listening on port ${PORT}`);
});
