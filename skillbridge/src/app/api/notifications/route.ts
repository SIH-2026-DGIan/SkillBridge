import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

/**
 * GET /api/notifications
 * Retrieves notifications for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return apiError('UNAUTHORIZED', 'Authentication required', 401);
    }

    const { data: notifs, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      return handleApiError(error);
    }

    const unreadCount = (notifs || []).filter((n) => !n.read).length;

    return apiSuccess(notifs || [], { unreadCount });
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * PATCH /api/notifications
 * Marks notifications as read
 */
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return apiError('UNAUTHORIZED', 'Authentication required', 401);
    }

    const body = await req.json().catch(() => ({}));
    const { id } = body;

    let query = supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id);

    if (id) {
      query = query.eq('id', id);
    }

    const { error } = await query;
    if (error) {
      return handleApiError(error);
    }

    return apiSuccess({ message: 'Notifications updated successfully' });
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * POST /api/notifications
 * Create a new notification
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return apiError('UNAUTHORIZED', 'Authentication required', 401);
    }

    const body = await req.json();
    const { userId, title, message } = body;

    if (!title) {
      return apiError('VALIDATION_ERROR', 'title is required', 400);
    }

    const targetUserId = userId || user.id;

    const { data: notif, error } = await supabase
      .from('notifications')
      .insert({
        user_id: targetUserId,
        title,
        message: message || '',
        read: false,
      })
      .select()
      .single();

    if (error) {
      return handleApiError(error);
    }

    return apiSuccess(notif, undefined, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
