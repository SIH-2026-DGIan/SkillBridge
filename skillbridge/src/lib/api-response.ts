import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  meta?: Record<string, any>;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export function apiSuccess<T>(data: T, meta?: Record<string, any>, status = 200): NextResponse<ApiSuccessResponse<T>> {
  const payload: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  if (meta) {
    payload.meta = meta;
  }
  return NextResponse.json(payload, { status });
}

export function apiError(
  code: string,
  message: string,
  status = 400,
  details?: any
): NextResponse<ApiErrorResponse> {
  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined && { details }),
    },
  };
  return NextResponse.json(payload, { status });
}

export function handleApiError(err: any): NextResponse<ApiErrorResponse> {
  console.error('[API Error]:', err);

  if (err instanceof ZodError) {
    return apiError(
      'VALIDATION_ERROR',
      'Invalid request payload or parameters',
      400,
      err.flatten().fieldErrors
    );
  }

  if (err.message === 'Unauthorized' || err.status === 401) {
    return apiError('UNAUTHORIZED', 'Authentication required to access this resource', 401);
  }

  if (err.message === 'Forbidden' || err.status === 403) {
    return apiError('FORBIDDEN', 'Insufficient permissions for this operation', 403);
  }

  if (err.code === 'PGRST116') {
    return apiError('NOT_FOUND', 'Requested resource was not found', 404);
  }

  return apiError(
    'INTERNAL_SERVER_ERROR',
    err.message || 'An unexpected server error occurred',
    500
  );
}
