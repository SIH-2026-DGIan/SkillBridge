-- SkillBridge Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'industry', 'institution', 'academician')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  college TEXT,
  degree TEXT,
  branch TEXT,
  graduation_year INTEGER,
  cgpa DECIMAL(3,1),
  bio TEXT,
  location TEXT,
  company TEXT,
  institution TEXT,
  avatar_url TEXT,
  target_roles TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- SKILLS (canonical taxonomy)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY, -- canonical id e.g. 'python', 'machine_learning'
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('technical', 'soft'))
);

-- ─────────────────────────────────────────────
-- USER SKILLS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  skill_id TEXT REFERENCES skills(id) NOT NULL,
  proficiency INTEGER NOT NULL CHECK (proficiency BETWEEN 0 AND 100),
  source TEXT DEFAULT 'assessment' CHECK (source IN ('assessment', 'self', 'verified')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- ─────────────────────────────────────────────
-- ASSESSMENTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score INTEGER,
  skill_scores JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- OPPORTUNITIES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id TEXT, -- can reference companies table or just a name
  company TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('internship', 'job', 'live_project')),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  work_mode TEXT DEFAULT 'hybrid' CHECK (work_mode IN ('remote', 'hybrid', 'onsite')),
  duration TEXT,
  stipend INTEGER,
  deadline DATE,
  eligibility JSONB DEFAULT '{}',
  category TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  posted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- OPPORTUNITY SKILLS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS opportunity_skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE NOT NULL,
  skill_id TEXT REFERENCES skills(id) NOT NULL,
  required_level INTEGER NOT NULL CHECK (required_level BETWEEN 0 AND 100),
  UNIQUE(opportunity_id, skill_id)
);

-- ─────────────────────────────────────────────
-- APPLICATIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'interview', 'selected', 'rejected')),
  match_score INTEGER,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(opportunity_id, student_id)
);

-- ─────────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- CERTIFICATIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT,
  credential_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- LEARNING RESOURCES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS learning_resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  skill_id TEXT REFERENCES skills(id),
  level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration TEXT,
  url TEXT,
  provider TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, only update their own
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Skills: publicly readable
CREATE POLICY "skills_select" ON skills FOR SELECT USING (true);

-- User skills: users manage their own
CREATE POLICY "user_skills_select" ON user_skills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_skills_insert" ON user_skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_skills_update" ON user_skills FOR UPDATE USING (auth.uid() = user_id);

-- Assessments: users manage their own
CREATE POLICY "assessments_select" ON assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "assessments_insert" ON assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Opportunities: everyone can read active ones
CREATE POLICY "opportunities_select" ON opportunities FOR SELECT USING (status = 'active');
CREATE POLICY "opportunities_insert" ON opportunities FOR INSERT WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "opportunities_update" ON opportunities FOR UPDATE USING (auth.uid() = posted_by);

-- Opportunity skills: publicly readable
CREATE POLICY "opp_skills_select" ON opportunity_skills FOR SELECT USING (true);
CREATE POLICY "opp_skills_insert" ON opportunity_skills FOR INSERT WITH CHECK (true);

-- Applications: students manage their own; industry can see for their opps
CREATE POLICY "applications_student_select" ON applications FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "applications_student_insert" ON applications FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "applications_student_update" ON applications FOR UPDATE USING (auth.uid() = student_id);

-- Projects: users manage their own, publicly readable
CREATE POLICY "projects_select" ON projects FOR SELECT USING (true);
CREATE POLICY "projects_insert" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "projects_update" ON projects FOR UPDATE USING (auth.uid() = user_id);

-- Certifications: users manage their own
CREATE POLICY "certs_select" ON certifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "certs_insert" ON certifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Learning resources: publicly readable
CREATE POLICY "lr_select" ON learning_resources FOR SELECT USING (true);

-- Notifications: users manage their own
CREATE POLICY "notif_select" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notif_update" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- TRIGGERS
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_skills_updated_at BEFORE UPDATE ON user_skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────
-- SEED SKILLS (normalized taxonomy)
-- ─────────────────────────────────────────────
INSERT INTO skills (id, name, category) VALUES
  ('python', 'Python', 'technical'),
  ('javascript', 'JavaScript', 'technical'),
  ('typescript', 'TypeScript', 'technical'),
  ('java', 'Java', 'technical'),
  ('cpp', 'C++', 'technical'),
  ('react', 'React', 'technical'),
  ('nextjs', 'Next.js', 'technical'),
  ('html_css', 'HTML/CSS', 'technical'),
  ('tailwind', 'Tailwind CSS', 'technical'),
  ('nodejs', 'Node.js', 'technical'),
  ('fastapi', 'FastAPI', 'technical'),
  ('django', 'Django', 'technical'),
  ('sql', 'SQL', 'technical'),
  ('mongodb', 'MongoDB', 'technical'),
  ('machine_learning', 'Machine Learning', 'technical'),
  ('deep_learning', 'Deep Learning', 'technical'),
  ('tensorflow', 'TensorFlow', 'technical'),
  ('pytorch', 'PyTorch', 'technical'),
  ('data_analysis', 'Data Analysis', 'technical'),
  ('statistics', 'Statistics', 'technical'),
  ('nlp', 'NLP', 'technical'),
  ('computer_vision', 'Computer Vision', 'technical'),
  ('docker', 'Docker', 'technical'),
  ('kubernetes', 'Kubernetes', 'technical'),
  ('aws', 'AWS', 'technical'),
  ('azure', 'Azure', 'technical'),
  ('gcp', 'GCP', 'technical'),
  ('git', 'Git', 'technical'),
  ('linux', 'Linux', 'technical'),
  ('communication', 'Communication', 'soft'),
  ('problem_solving', 'Problem Solving', 'soft'),
  ('teamwork', 'Teamwork', 'soft'),
  ('leadership', 'Leadership', 'soft'),
  ('critical_thinking', 'Critical Thinking', 'soft'),
  ('time_management', 'Time Management', 'soft')
ON CONFLICT (id) DO NOTHING;
