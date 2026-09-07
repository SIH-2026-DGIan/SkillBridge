// Normalized skill taxonomy — single source of truth
// All opportunities, assessments, and user_skills reference these canonical names

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft';
  icon?: string;
}

export const SKILLS: Skill[] = [
  // Technical - Programming
  { id: 'python', name: 'Python', category: 'technical' },
  { id: 'javascript', name: 'JavaScript', category: 'technical' },
  { id: 'typescript', name: 'TypeScript', category: 'technical' },
  { id: 'java', name: 'Java', category: 'technical' },
  { id: 'cpp', name: 'C++', category: 'technical' },

  // Frontend
  { id: 'react', name: 'React', category: 'technical' },
  { id: 'nextjs', name: 'Next.js', category: 'technical' },
  { id: 'html_css', name: 'HTML/CSS', category: 'technical' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'technical' },

  // Backend
  { id: 'nodejs', name: 'Node.js', category: 'technical' },
  { id: 'fastapi', name: 'FastAPI', category: 'technical' },
  { id: 'django', name: 'Django', category: 'technical' },

  // Data & ML
  { id: 'sql', name: 'SQL', category: 'technical' },
  { id: 'mongodb', name: 'MongoDB', category: 'technical' },
  { id: 'machine_learning', name: 'Machine Learning', category: 'technical' },
  { id: 'deep_learning', name: 'Deep Learning', category: 'technical' },
  { id: 'tensorflow', name: 'TensorFlow', category: 'technical' },
  { id: 'pytorch', name: 'PyTorch', category: 'technical' },
  { id: 'data_analysis', name: 'Data Analysis', category: 'technical' },
  { id: 'statistics', name: 'Statistics', category: 'technical' },
  { id: 'nlp', name: 'NLP', category: 'technical' },
  { id: 'computer_vision', name: 'Computer Vision', category: 'technical' },

  // DevOps & Cloud
  { id: 'docker', name: 'Docker', category: 'technical' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'technical' },
  { id: 'aws', name: 'AWS', category: 'technical' },
  { id: 'azure', name: 'Azure', category: 'technical' },
  { id: 'gcp', name: 'GCP', category: 'technical' },
  { id: 'git', name: 'Git', category: 'technical' },
  { id: 'linux', name: 'Linux', category: 'technical' },

  // Soft Skills
  { id: 'communication', name: 'Communication', category: 'soft' },
  { id: 'problem_solving', name: 'Problem Solving', category: 'soft' },
  { id: 'teamwork', name: 'Teamwork', category: 'soft' },
  { id: 'leadership', name: 'Leadership', category: 'soft' },
  { id: 'critical_thinking', name: 'Critical Thinking', category: 'soft' },
  { id: 'time_management', name: 'Time Management', category: 'soft' },
];

export const SKILL_MAP: Record<string, Skill> = Object.fromEntries(
  SKILLS.map((s) => [s.id, s])
);

export const getSkillByName = (name: string): Skill | undefined =>
  SKILLS.find((s) => s.name.toLowerCase() === name.toLowerCase());

export const getSkillById = (id: string): Skill | undefined => SKILL_MAP[id];

// Role → required skills mapping for skill gap analysis
export const ROLE_REQUIRED_SKILLS: Record<
  string,
  { skillId: string; required: number }[]
> = {
  'Machine Learning Engineer': [
    { skillId: 'python', required: 80 },
    { skillId: 'machine_learning', required: 80 },
    { skillId: 'deep_learning', required: 70 },
    { skillId: 'tensorflow', required: 70 },
    { skillId: 'sql', required: 65 },
    { skillId: 'docker', required: 65 },
    { skillId: 'statistics', required: 75 },
    { skillId: 'git', required: 70 },
  ],
  'Software Developer': [
    { skillId: 'python', required: 75 },
    { skillId: 'javascript', required: 70 },
    { skillId: 'sql', required: 70 },
    { skillId: 'git', required: 80 },
    { skillId: 'nodejs', required: 65 },
    { skillId: 'docker', required: 60 },
    { skillId: 'problem_solving', required: 80 },
  ],
  'Data Analyst': [
    { skillId: 'python', required: 75 },
    { skillId: 'sql', required: 85 },
    { skillId: 'data_analysis', required: 80 },
    { skillId: 'statistics', required: 75 },
    { skillId: 'machine_learning', required: 55 },
    { skillId: 'communication', required: 70 },
  ],
  'Frontend Developer': [
    { skillId: 'javascript', required: 85 },
    { skillId: 'react', required: 80 },
    { skillId: 'html_css', required: 85 },
    { skillId: 'typescript', required: 70 },
    { skillId: 'nextjs', required: 65 },
    { skillId: 'tailwind', required: 60 },
    { skillId: 'git', required: 70 },
  ],
  'Backend Developer': [
    { skillId: 'python', required: 75 },
    { skillId: 'nodejs', required: 75 },
    { skillId: 'sql', required: 80 },
    { skillId: 'mongodb', required: 65 },
    { skillId: 'docker', required: 65 },
    { skillId: 'git', required: 75 },
    { skillId: 'fastapi', required: 60 },
  ],
  'Cloud Engineer': [
    { skillId: 'aws', required: 80 },
    { skillId: 'docker', required: 80 },
    { skillId: 'kubernetes', required: 70 },
    { skillId: 'linux', required: 75 },
    { skillId: 'python', required: 60 },
    { skillId: 'git', required: 70 },
  ],
};

export const TARGET_ROLES = Object.keys(ROLE_REQUIRED_SKILLS);
