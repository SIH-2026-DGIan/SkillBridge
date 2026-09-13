-- ─────────────────────────────────────────────────────────────
-- 003_comprehensive_rls.sql
-- Comprehensive Row-Level Security (RLS) Policies (Issue #3)
-- ─────────────────────────────────────────────────────────────

-- 1. Ensure RLS is enabled on all tables
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.opportunity_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.interview_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────
-- 2. Helper functions for role inspection
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─────────────────────────────────────────────────────────────
-- 3. PROFILES POLICIES
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;

-- Authenticated users can view profiles (for opportunities, applicants, networking)
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT TO authenticated
  USING (true);

-- Users can only insert their own profile
CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- 4. OPPORTUNITIES POLICIES
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "opportunities_select" ON public.opportunities;
DROP POLICY IF EXISTS "opportunities_insert" ON public.opportunities;
DROP POLICY IF EXISTS "opportunities_update" ON public.opportunities;
DROP POLICY IF EXISTS "opportunities_delete" ON public.opportunities;

-- Anyone authenticated can view active listings; posters can view all their listings
CREATE POLICY "opportunities_select" ON public.opportunities
  FOR SELECT TO authenticated
  USING (
    status = 'active' 
    OR posted_by = auth.uid() 
    OR public.get_auth_role() IN ('industry', 'institution')
  );

-- Only industry recruiters and institutions can post opportunities
CREATE POLICY "opportunities_insert" ON public.opportunities
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = posted_by
    AND public.get_auth_role() IN ('industry', 'institution')
  );

-- Only opportunity author can update/delete
CREATE POLICY "opportunities_update" ON public.opportunities
  FOR UPDATE TO authenticated
  USING (auth.uid() = posted_by)
  WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "opportunities_delete" ON public.opportunities
  FOR DELETE TO authenticated
  USING (auth.uid() = posted_by);

-- ─────────────────────────────────────────────────────────────
-- 5. APPLICATIONS POLICIES
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "applications_student_select" ON public.applications;
DROP POLICY IF EXISTS "applications_student_insert" ON public.applications;
DROP POLICY IF EXISTS "applications_industry_select" ON public.applications;
DROP POLICY IF EXISTS "applications_industry_update" ON public.applications;

-- Students see their own; recruiters see applicants for their jobs; TPOs see college batch
CREATE POLICY "applications_select_policy" ON public.applications
  FOR SELECT TO authenticated
  USING (
    student_id = auth.uid()
    OR opportunity_id IN (SELECT id FROM public.opportunities WHERE posted_by = auth.uid())
    OR public.get_auth_role() = 'institution'
  );

-- Only students can submit applications for themselves
CREATE POLICY "applications_insert_policy" ON public.applications
  FOR INSERT TO authenticated
  WITH CHECK (
    student_id = auth.uid()
    AND public.get_auth_role() = 'student'
  );

-- Only opportunity poster can update applicant status
CREATE POLICY "applications_update_policy" ON public.applications
  FOR UPDATE TO authenticated
  USING (
    opportunity_id IN (SELECT id FROM public.opportunities WHERE posted_by = auth.uid())
  )
  WITH CHECK (
    opportunity_id IN (SELECT id FROM public.opportunities WHERE posted_by = auth.uid())
  );

-- ─────────────────────────────────────────────────────────────
-- 6. INTERVIEWS & MESSAGES POLICIES
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "interviews_user_access" ON public.interviews;
CREATE POLICY "interviews_user_access" ON public.interviews
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "interview_messages_user_access" ON public.interview_messages;
CREATE POLICY "interview_messages_user_access" ON public.interview_messages
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.interviews i
      WHERE i.id = interview_messages.interview_id AND i.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.interviews i
      WHERE i.id = interview_messages.interview_id AND i.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────
-- 7. NOTIFICATIONS & USER SKILLS POLICIES
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "notifications_owner_access" ON public.notifications;
CREATE POLICY "notifications_owner_access" ON public.notifications
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "user_skills_owner_access" ON public.user_skills;
CREATE POLICY "user_skills_owner_access" ON public.user_skills
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
