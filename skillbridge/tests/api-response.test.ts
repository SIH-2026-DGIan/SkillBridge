import test from 'node:test';
import assert from 'node:assert/strict';
import { z, ZodError } from 'zod';
import { apiSuccess, apiError, handleApiError } from '../src/lib/api-response';

test('API Response Standardization Contract', async (t) => {
  await t.test('apiSuccess formats successful response with data and status', async () => {
    const data = { id: 'opp-100', title: 'AI Research Intern' };
    const meta = { page: 1, limit: 10, total: 1 };

    const res = apiSuccess(data, meta, 200);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.deepEqual(json.data, data);
    assert.deepEqual(json.meta, meta);
  });

  await t.test('apiError formats standardized error contract', async () => {
    const res = apiError('RESOURCE_NOT_FOUND', 'The opportunity could not be found', 404, { id: 'opp-999' });
    assert.equal(res.status, 404);

    const json = await res.json();
    assert.equal(json.success, false);
    assert.equal(json.error.code, 'RESOURCE_NOT_FOUND');
    assert.equal(json.error.message, 'The opportunity could not be found');
    assert.deepEqual(json.error.details, { id: 'opp-999' });
  });

  await t.test('handleApiError catches ZodError and converts to 400 VALIDATION_ERROR', async () => {
    const TestSchema = z.object({
      email: z.string().email(),
      age: z.number().min(18),
    });

    let zodErr: ZodError | null = null;
    try {
      TestSchema.parse({ email: 'bad-email', age: 10 });
    } catch (e: any) {
      zodErr = e;
    }

    assert.ok(zodErr);
    const res = handleApiError(zodErr);
    assert.equal(res.status, 400);

    const json = await res.json();
    assert.equal(json.success, false);
    assert.equal(json.error.code, 'VALIDATION_ERROR');
    assert.ok(json.error.details.email);
    assert.ok(json.error.details.age);
  });

  await t.test('handleApiError handles Supabase PGRST116 (not found) code', async () => {
    const pgrstErr = { code: 'PGRST116', message: 'Row not found' };
    const res = handleApiError(pgrstErr);
    assert.equal(res.status, 404);

    const json = await res.json();
    assert.equal(json.error.code, 'NOT_FOUND');
  });

  await t.test('handleApiError handles Unauthorized error', async () => {
    const authErr = new Error('Unauthorized');
    const res = handleApiError(authErr);
    assert.equal(res.status, 401);

    const json = await res.json();
    assert.equal(json.error.code, 'UNAUTHORIZED');
  });
});
