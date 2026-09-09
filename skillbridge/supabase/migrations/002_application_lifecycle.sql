-- Application Lifecycle Integration (#26)
-- Updates applications table and adds audit trail for status changes

-- ─────────────────────────────────────────────
-- UPDATE APPLICATIONS TABLE
-- ─────────────────────────────────────────────

-- Add column to track who made the last status update
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS status_updated_by UUID REFERENCES auth.users(id);

-- Add rejection reason field (optional notes for rejection)
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Update the CHECK constraint for status to match the required pipeline
-- APPLIED → UNDER_REVIEW → SHORTLISTED → INTERVIEW → ACCEPTED / REJECTED
ALTER TABLE applications
DROP CONSTRAINT IF EXISTS applications_status_check;

ALTER TABLE applications
ADD CONSTRAINT applications_status_check 
CHECK (status IN ('applied', 'under_review', 'shortlisted', 'interview', 'accepted', 'rejected'));

-- ─────────────────────────────────────────────
-- APPLICATION STATUS HISTORY TABLE
-- ─────────────────────────────────────────────
-- Audit trail for all status changes

CREATE TABLE IF NOT EXISTS application_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_application_status_history_app_id 
  ON application_status_history(application_id);

CREATE INDEX IF NOT EXISTS idx_application_status_history_changed_at 
  ON application_status_history(changed_at DESC);

-- Enable RLS
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;

-- Status history: students can view their own application history,
-- industry can view history for their posted opportunities
CREATE POLICY "status_history_select" ON application_status_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_status_history.application_id
      AND (
        a.student_id = auth.uid()
        OR a.opportunity_id IN (
          SELECT id FROM opportunities WHERE posted_by = auth.uid()
        )
      )
    )
  );

-- ─────────────────────────────────────────────
-- UPDATE APPLICATIONS RLS POLICIES
-- ─────────────────────────────────────────────

-- Drop existing student-only policies
DROP POLICY IF EXISTS "applications_student_update" ON applications;

-- Students can only see and apply for applications, but not modify status
CREATE POLICY "applications_student_select" ON applications FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "applications_student_insert" ON applications FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Industry can view applications for their opportunities and update status
CREATE POLICY "applications_industry_select" ON applications FOR SELECT
  USING (
    opportunity_id IN (
      SELECT id FROM opportunities WHERE posted_by = auth.uid()
    )
  );

CREATE POLICY "applications_industry_update" ON applications FOR UPDATE
  USING (
    opportunity_id IN (
      SELECT id FROM opportunities WHERE posted_by = auth.uid()
    )
  );

-- ─────────────────────────────────────────────
-- TRIGGER FOR AUTOMATIC STATUS HISTORY
-- ─────────────────────────────────────────────
-- Automatically log status changes to the history table

CREATE OR REPLACE FUNCTION log_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO application_status_history (
      application_id,
      old_status,
      new_status,
      changed_by,
      changed_at
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      NEW.status_updated_by,
      NEW.updated_at
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER applications_status_history 
AFTER UPDATE ON applications
FOR EACH ROW 
EXECUTE FUNCTION log_application_status_change();
