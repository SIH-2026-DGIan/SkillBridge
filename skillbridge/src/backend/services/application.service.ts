/**
 * Application Management Service
 * Handles application creation, status updates, and lifecycle management.
 */

import { createClient as createServerClient } from '@/lib/supabase/server';
import type { Application, ApplicationStatusHistory } from '@/database/types';

export class ApplicationService {
  /**
   * Create a new application (student applies to opportunity)
   */
  static async createApplication(
    opportunityId: string,
    studentId: string,
    matchScore?: number
  ): Promise<Application> {
    const supabase = await createServerClient();

    // Check if already applied
    const { data: existing } = await supabase
      .from('applications')
      .select('*')
      .eq('opportunity_id', opportunityId)
      .eq('student_id', studentId)
      .single();

    if (existing) {
      throw new Error('You have already applied to this opportunity');
    }

    const { data, error } = await supabase
      .from('applications')
      .insert({
        opportunity_id: opportunityId,
        student_id: studentId,
        status: 'applied',
        match_score: matchScore || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get applications for current student
   */
  static async getStudentApplications(
    studentId: string
  ): Promise<
    (Application & {
      opportunity?: any;
      company?: string;
      title?: string;
    })[]
  > {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('applications')
      .select(
        `
        *,
        opportunities:opportunity_id (
          id,
          title,
          company,
          location,
          type,
          deadline
        )
      `
      )
      .eq('student_id', studentId)
      .order('applied_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((app: any) => ({
      ...app,
      opportunity: app.opportunities,
      company: app.opportunities?.company,
      title: app.opportunities?.title,
    }));
  }

  /**
   * Get applications for industry (for their posted opportunities)
   */
  static async getIndustryApplications(
    industryUserId: string
  ): Promise<
    (Application & {
      student?: any;
      opportunity?: any;
      studentName?: string;
      studentEmail?: string;
    })[]
  > {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('applications')
      .select(
        `
        *,
        opportunities:opportunity_id (
          id,
          title,
          company,
          posted_by
        ),
        profiles:student_id (
          id,
          name,
          email,
          college,
          branch,
          cgpa,
          avatar_url
        )
      `
      )
      .in(
        'opportunity_id',
        // First get all opportunity IDs posted by this user
        (
          await supabase
            .from('opportunities')
            .select('id')
            .eq('posted_by', industryUserId)
        ).data?.map((o: any) => o.id) || []
      )
      .order('applied_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((app: any) => ({
      ...app,
      student: app.profiles,
      opportunity: app.opportunities,
      studentName: app.profiles?.name,
      studentEmail: app.profiles?.email,
    }));
  }

  /**
   * Get single application
   */
  static async getApplication(
    applicationId: string
  ): Promise<
    Application & {
      student?: any;
      opportunity?: any;
    }
  > {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('applications')
      .select(
        `
        *,
        opportunities:opportunity_id (
          id,
          title,
          company,
          description,
          location,
          type,
          deadline
        ),
        profiles:student_id (
          id,
          name,
          email,
          college,
          branch,
          cgpa,
          avatar_url,
          bio
        )
      `
      )
      .eq('id', applicationId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update application status (industry only)
   */
  static async updateApplicationStatus(
    applicationId: string,
    newStatus: string,
    industryUserId: string,
    rejectionReason?: string
  ): Promise<Application> {
    const supabase = await createServerClient();

    // Verify that this application belongs to an opportunity posted by this user
    const { data: app, error: appError } = await supabase
      .from('applications')
      .select(
        `
        *,
        opportunities:opportunity_id (
          posted_by
        )
      `
      )
      .eq('id', applicationId)
      .single();

    if (appError || !app) throw new Error('Application not found');

    if (app.opportunities.posted_by !== industryUserId) {
      throw new Error(
        'You do not have permission to update this application'
      );
    }

    // Validate status transition
    const validStatuses = ['applied', 'under_review', 'shortlisted', 'interview', 'accepted', 'rejected'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    const { data, error } = await supabase
      .from('applications')
      .update({
        status: newStatus,
        status_updated_by: industryUserId,
        rejection_reason: rejectionReason || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get application status history
   */
  static async getApplicationHistory(
    applicationId: string
  ): Promise<ApplicationStatusHistory[]> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('application_status_history')
      .select(
        `
        *,
        profiles:changed_by (
          name,
          email
        )
      `
      )
      .eq('application_id', applicationId)
      .order('changed_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}
