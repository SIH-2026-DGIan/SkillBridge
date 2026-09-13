import test from 'node:test';
import assert from 'node:assert/strict';
import * as jwt from 'jsonwebtoken';
import * as http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { validateSupabaseToken } from '../src/auth';
import { handleConnection } from '../src/session';

test('validateSupabaseToken handles token validation correctly', async (t) => {
  await t.test('rejects empty, null, or whitespace-only tokens', () => {
    assert.equal(validateSupabaseToken(''), null);
    assert.equal(validateSupabaseToken('   '), null);
    // @ts-ignore
    assert.equal(validateSupabaseToken(null), null);
    // @ts-ignore
    assert.equal(validateSupabaseToken(undefined), null);
  });

  await t.test('rejects malformed non-JWT strings', () => {
    assert.equal(validateSupabaseToken('not-a-jwt'), null);
    assert.equal(validateSupabaseToken('bearer invalid-token-string'), null);
  });

  await t.test('accepts valid JWT token and extracts user ID (sub)', () => {
    const testSecret = 'super-secret-jwt-key-1234567890!';
    process.env.SUPABASE_JWT_SECRET = testSecret;

    const payload = {
      sub: 'user-uuid-1234-abcd',
      email: 'student@example.com',
      role: 'authenticated',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour valid
    };

    const token = jwt.sign(payload, testSecret, { algorithm: 'HS256' });
    const extractedSub = validateSupabaseToken(token);
    assert.equal(extractedSub, 'user-uuid-1234-abcd');

    // Also supports "Bearer <token>"
    const bearerSub = validateSupabaseToken(`Bearer ${token}`);
    assert.equal(bearerSub, 'user-uuid-1234-abcd');
  });

  await t.test('rejects expired JWT token', () => {
    const testSecret = 'super-secret-jwt-key-1234567890!';
    process.env.SUPABASE_JWT_SECRET = testSecret;

    const expiredPayload = {
      sub: 'user-uuid-1234-abcd',
      email: 'student@example.com',
      exp: Math.floor(Date.now() / 1000) - 300, // Expired 5 mins ago
    };

    const expiredToken = jwt.sign(expiredPayload, testSecret, { algorithm: 'HS256' });
    assert.equal(validateSupabaseToken(expiredToken), null);
  });

  await t.test('rejects JWT signed with wrong secret', () => {
    process.env.SUPABASE_JWT_SECRET = 'correct-secret';

    const tokenWithWrongSecret = jwt.sign(
      { sub: 'hacker-sub', exp: Math.floor(Date.now() / 1000) + 3600 },
      'wrong-secret',
      { algorithm: 'HS256' }
    );

    assert.equal(validateSupabaseToken(tokenWithWrongSecret), null);
  });
});

test('WebSocket handshake rejects unauthenticated connections with code 4401', async (t) => {
  const server = http.createServer();
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
      handleConnection(ws, req);
    });
  });

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;

  await t.test('rejects connection missing token with code 4401', async () => {
    const ws = new WebSocket(`ws://localhost:${port}/?interviewId=test-123`);

    const closeCode = await new Promise<number>((resolve) => {
      ws.on('close', (code) => {
        resolve(code);
      });
      ws.on('error', () => {});
    });

    assert.equal(closeCode, 4401);
  });

  await t.test('rejects connection missing interviewId with code 4401', async () => {
    const ws = new WebSocket(`ws://localhost:${port}/?token=some-token`);

    const closeCode = await new Promise<number>((resolve) => {
      ws.on('close', (code) => {
        resolve(code);
      });
      ws.on('error', () => {});
    });

    assert.equal(closeCode, 4401);
  });

  await t.test('rejects connection with invalid token with code 4401', async () => {
    process.env.SUPABASE_JWT_SECRET = 'valid-secret-key';
    const ws = new WebSocket(`ws://localhost:${port}/?token=invalid.jwt.token&interviewId=test-123`);

    const closeCode = await new Promise<number>((resolve) => {
      ws.on('close', (code) => {
        resolve(code);
      });
      ws.on('error', () => {});
    });

    assert.equal(closeCode, 4401);
  });

  await new Promise<void>((resolve) => {
    wss.close();
    server.close(() => resolve());
  });
});
