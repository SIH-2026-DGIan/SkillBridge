/**
 * Demo data — used when Supabase is not configured or in demo mode.
 * This is the "seeded ecosystem" that makes the demo convincing and internally consistent.
 */

export type DemoRole = 'student' | 'industry' | 'institution' | 'academician';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
  avatar?: string;
  college?: string;
  degree?: string;
  branch?: string;
  graduationYear?: number;
  company?: string;
  institution?: string;
  bio?: string;
  location?: string;
  cgpa?: number;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo-student-1',
    name: 'Tanushri Sharma',
    email: 'tanushri@demo.skillbridge.in',
    role: 'student',
    college: 'IIT Bombay',
    degree: 'B.Tech',
    branch: 'Computer Science',
    graduationYear: 2026,
    cgpa: 8.4,
    bio: 'Passionate about Machine Learning, AI systems, and Data Science. Building production-grade ML models and tools in Python.',
    location: 'Mumbai, Maharashtra',
  },
  {
    id: 'demo-industry-1',
    name: 'Rohan Mehta',
    email: 'rohan@technova.demo',
    role: 'industry',
    company: 'TechNova',
    bio: 'Talent Acquisition Lead at TechNova. Scouting for India\'s top aspiring AI/ML and software engineering minds.',
    location: 'Bengaluru, Karnataka',
  },
  {
    id: 'demo-institution-1',
    name: 'Dr. Priya Nair',
    email: 'priya@nitkl.demo',
    role: 'institution',
    institution: 'NIT Kozhikode',
    bio: 'Head of Training & Placement Cell. Driving skill development and industry tie-ups for 1200+ engineering graduates.',
    location: 'Kozhikode, Kerala',
  },
  {
    id: 'demo-academician-1',
    name: 'Prof. Amit Gupta',
    email: 'amit@iitd.demo',
    role: 'academician',
    college: 'IIT Delhi',
    bio: 'Professor of Computer Science & AI. Focusing on translational research, industry consultancies, and student mentorship.',
    location: 'New Delhi',
  },
];

// Exact normalized baseline skill proficiency for Demo Student (Tanushri)
export const DEMO_STUDENT_SKILLS: Record<string, number> = {
  python: 82,
  sql: 76,
  react: 68,
  machine_learning: 54,
  git: 85,
  docker: 25,
  tensorflow: 30,
  communication: 74,
  javascript: 65,
  data_analysis: 60,
  statistics: 58,
  problem_solving: 78,
  teamwork: 72,
  deep_learning: 40,
  aws: 25,
};

export const DEMO_COMPANIES = [
  { id: 'c1', name: 'TechNova', location: 'Bengaluru', sector: 'AI / Machine Learning' },
  { id: 'c2', name: 'DataSphere', location: 'Hyderabad', sector: 'Big Data & Analytics' },
  { id: 'c3', name: 'CloudCore', location: 'Pune', sector: 'Cloud Infrastructure' },
  { id: 'c4', name: 'FinEdge', location: 'Mumbai', sector: 'Fintech & Quantitative Systems' },
  { id: 'c5', name: 'AI Labs India', location: 'Bengaluru', sector: 'Applied AI Research' },
  { id: 'c6', name: 'WebStack', location: 'Chennai', sector: 'Full Stack Engineering' },
  { id: 'c7', name: 'GreenTech', location: 'Delhi', sector: 'CleanTech & IoT' },
  { id: 'c8', name: 'Bharat Digital', location: 'Noida', sector: 'GovTech & Digital Public Infrastructure' },
];

export const DEMO_OPPORTUNITIES = [
  {
    id: 'opp-1',
    companyId: 'c1',
    company: 'TechNova',
    type: 'internship' as const,
    title: 'Machine Learning Intern',
    description:
      'Work with our AI team to build and deploy ML models for real-world computer vision and predictive analytics. You will contribute across the full pipeline: data cleaning, feature engineering, model training, and API integration.',
    location: 'Bengaluru',
    workMode: 'hybrid' as const,
    duration: '6 months',
    stipend: 25000,
    deadline: '2026-09-30',
    requiredSkills: [
      { skillId: 'python', requiredLevel: 75 },
      { skillId: 'sql', requiredLevel: 65 },
      { skillId: 'machine_learning', requiredLevel: 70 },
      { skillId: 'git', requiredLevel: 70 },
      { skillId: 'tensorflow', requiredLevel: 65 },
    ],
    eligibility: { minCgpa: 7.5, maxGradYear: 2027, degrees: ['B.Tech', 'B.E', 'M.Tech', 'MCA'] },
    category: 'machine learning',
  },
  {
    id: 'opp-2',
    companyId: 'c2',
    company: 'DataSphere',
    type: 'internship' as const,
    title: 'Data Analyst Intern',
    description:
      'Join our enterprise analytics team to query petabyte-scale data lakes, write complex SQL aggregations, build executive dashboards, and extract business insights for global clients.',
    location: 'Hyderabad',
    workMode: 'remote' as const,
    duration: '3 months',
    stipend: 18000,
    deadline: '2026-09-15',
    requiredSkills: [
      { skillId: 'sql', requiredLevel: 80 },
      { skillId: 'data_analysis', requiredLevel: 75 },
      { skillId: 'python', requiredLevel: 70 },
      { skillId: 'statistics', requiredLevel: 65 },
    ],
    eligibility: { minCgpa: 7.0, maxGradYear: 2027 },
    category: 'data analytics',
  },
  {
    id: 'opp-3',
    companyId: 'c6',
    company: 'WebStack',
    type: 'internship' as const,
    title: 'Frontend Developer Intern',
    description:
      'Build performant, responsive web applications using React, TypeScript, and Tailwind CSS. Collaborate with product designers and backend engineers to craft intuitive customer experiences.',
    location: 'Chennai',
    workMode: 'onsite' as const,
    duration: '4 months',
    stipend: 20000,
    deadline: '2026-10-01',
    requiredSkills: [
      { skillId: 'react', requiredLevel: 75 },
      { skillId: 'javascript', requiredLevel: 80 },
      { skillId: 'typescript', requiredLevel: 70 },
      { skillId: 'git', requiredLevel: 65 },
    ],
    eligibility: { maxGradYear: 2027 },
    category: 'frontend',
  },
  {
    id: 'opp-4',
    companyId: 'c5',
    company: 'AI Labs India',
    type: 'internship' as const,
    title: 'AI Research Intern',
    description:
      'Contribute to cutting-edge research in Large Language Models and Multimodal AI. Work alongside PhD researchers to reproduce landmark papers and build foundational experiments.',
    location: 'Bengaluru',
    workMode: 'hybrid' as const,
    duration: '6 months',
    stipend: 30000,
    deadline: '2026-09-20',
    requiredSkills: [
      { skillId: 'python', requiredLevel: 85 },
      { skillId: 'machine_learning', requiredLevel: 80 },
      { skillId: 'deep_learning', requiredLevel: 75 },
      { skillId: 'tensorflow', requiredLevel: 70 },
      { skillId: 'statistics', requiredLevel: 75 },
    ],
    eligibility: { minCgpa: 8.0, maxGradYear: 2027 },
    category: 'ai research',
  },
  {
    id: 'opp-5',
    companyId: 'c3',
    company: 'CloudCore',
    type: 'internship' as const,
    title: 'Cloud Engineering Intern',
    description:
      'Gain hands-on experience provisioning AWS/Azure cloud infrastructure, containerizing microservices with Docker, and setting up automated CI/CD deployment pipelines.',
    location: 'Pune',
    workMode: 'hybrid' as const,
    duration: '6 months',
    stipend: 22000,
    deadline: '2026-10-15',
    requiredSkills: [
      { skillId: 'aws', requiredLevel: 65 },
      { skillId: 'docker', requiredLevel: 70 },
      { skillId: 'linux', requiredLevel: 65 },
      { skillId: 'python', requiredLevel: 60 },
      { skillId: 'git', requiredLevel: 70 },
    ],
    eligibility: { maxGradYear: 2027 },
    category: 'cloud',
  },
  {
    id: 'opp-6',
    companyId: 'c4',
    company: 'FinEdge',
    type: 'job' as const,
    title: 'Python Backend Developer',
    description:
      'Build low-latency APIs and resilient financial transaction processing pipelines using Python, FastAPI, SQL, and Docker.',
    location: 'Mumbai',
    workMode: 'hybrid' as const,
    duration: 'Full-time',
    stipend: 65000,
    deadline: '2026-11-01',
    requiredSkills: [
      { skillId: 'python', requiredLevel: 80 },
      { skillId: 'sql', requiredLevel: 75 },
      { skillId: 'fastapi', requiredLevel: 65 },
      { skillId: 'git', requiredLevel: 75 },
      { skillId: 'docker', requiredLevel: 60 },
    ],
    eligibility: { maxGradYear: 2026 },
    category: 'backend',
  },
  {
    id: 'opp-7',
    companyId: 'c8',
    company: 'Bharat Digital',
    type: 'live_project' as const,
    title: 'GovTech Full Stack Live Project',
    description:
      'Develop scalable citizen-facing portal modules for state-level digital public services using React, Node.js, and PostgreSQL.',
    location: 'Noida',
    workMode: 'onsite' as const,
    duration: '3 months',
    stipend: 15000,
    deadline: '2026-09-25',
    requiredSkills: [
      { skillId: 'react', requiredLevel: 70 },
      { skillId: 'nodejs', requiredLevel: 65 },
      { skillId: 'sql', requiredLevel: 70 },
      { skillId: 'git', requiredLevel: 65 },
    ],
    eligibility: { maxGradYear: 2027 },
    category: 'fullstack',
  },
  {
    id: 'opp-8',
    companyId: 'c7',
    company: 'GreenTech',
    type: 'internship' as const,
    title: 'Environmental Data Science Intern',
    description:
      'Analyze IoT sensor feeds and satellite data to develop predictive models for industrial emissions and clean energy optimization.',
    location: 'Delhi',
    workMode: 'remote' as const,
    duration: '4 months',
    stipend: 20000,
    deadline: '2026-10-10',
    requiredSkills: [
      { skillId: 'python', requiredLevel: 75 },
      { skillId: 'machine_learning', requiredLevel: 65 },
      { skillId: 'data_analysis', requiredLevel: 70 },
      { skillId: 'statistics', requiredLevel: 65 },
    ],
    eligibility: { maxGradYear: 2027 },
    category: 'data science',
  },
];

export const DEMO_APPLICATIONS = [
  {
    id: 'app-1',
    opportunityId: 'opp-1',
    company: 'TechNova',
    title: 'Machine Learning Intern',
    status: 'shortlisted' as const,
    appliedAt: '2026-08-01',
    updatedAt: '2026-08-10',
  },
  {
    id: 'app-2',
    opportunityId: 'opp-2',
    company: 'DataSphere',
    title: 'Data Analyst Intern',
    status: 'applied' as const,
    appliedAt: '2026-08-05',
    updatedAt: '2026-08-05',
  },
  {
    id: 'app-3',
    opportunityId: 'opp-4',
    company: 'AI Labs India',
    title: 'AI Research Intern',
    status: 'interview' as const,
    appliedAt: '2026-07-20',
    updatedAt: '2026-08-12',
  },
];

export const DEMO_PROJECTS = [
  {
    id: 'proj-1',
    title: 'Crop Disease Detection using CNN',
    description:
      'Developed a deep learning convolutional neural network to classify 14 types of crop leaf diseases from images with 94.2% test accuracy using TensorFlow and OpenCV.',
    technologies: ['python', 'tensorflow', 'machine_learning', 'deep_learning'],
    githubUrl: 'https://github.com/demo/crop-disease-cnn',
  },
  {
    id: 'proj-2',
    title: 'Customer Churn Predictor & Analytics',
    description:
      'Built an end-to-end ML classification pipeline predicting telecom customer churn with XGBoost and SQL feature stores, achieving an 0.89 ROC-AUC score.',
    technologies: ['python', 'machine_learning', 'sql', 'data_analysis', 'statistics'],
    githubUrl: 'https://github.com/demo/churn-predictor',
  },
  {
    id: 'proj-3',
    title: 'Skill Intelligence Web App',
    description:
      'Engineered a responsive dashboard and skill gap analyzer in React and Node.js for academic cohort analytics.',
    technologies: ['react', 'javascript', 'nodejs', 'sql', 'git'],
    githubUrl: 'https://github.com/demo/skill-intel-app',
  },
];

export const DEMO_CERTIFICATIONS = [
  {
    id: 'cert-1',
    name: 'Machine Learning Specialization',
    issuer: 'DeepLearning.AI & Stanford Online',
    issueDate: 'December 2025',
    credentialId: 'DL-109348',
    skills: ['machine_learning', 'python', 'tensorflow', 'deep_learning'],
    credentialUrl: '#',
  },
  {
    id: 'cert-2',
    name: 'Python for Data Science & AI',
    issuer: 'IBM (Coursera)',
    issueDate: 'August 2025',
    credentialId: 'IBM-98234',
    skills: ['python', 'data_analysis', 'statistics'],
    credentialUrl: '#',
  },
];

export const DEMO_LEARNING_RESOURCES = [
  {
    id: 'lr-1',
    title: 'TensorFlow for Deep Learning Bootcamp',
    description: 'Build production-grade deep neural networks, CNNs, and sequence models using TensorFlow 2.x and Keras.',
    skillId: 'tensorflow',
    level: 'intermediate' as const,
    duration: '32 hours',
    url: 'https://www.coursera.org/specializations/deep-learning',
    provider: 'Coursera (DeepLearning.AI)',
  },
  {
    id: 'lr-2',
    title: 'Docker & Containerization for ML Systems',
    description: 'Learn container fundamentals, multi-stage builds, and containerizing ML inference APIs with Docker.',
    skillId: 'docker',
    level: 'beginner' as const,
    duration: '14 hours',
    url: 'https://docker-curriculum.com/',
    provider: 'Docker Curriculum',
  },
  {
    id: 'lr-3',
    title: 'Deep Learning Specialization by Andrew Ng',
    description: 'Master convolutional networks, RNNs, transformers, optimization algorithms, and hyperparameter tuning.',
    skillId: 'deep_learning',
    level: 'intermediate' as const,
    duration: '60 hours',
    url: 'https://www.coursera.org/specializations/deep-learning',
    provider: 'Coursera',
  },
  {
    id: 'lr-4',
    title: 'AWS Cloud Practitioner Essentials',
    description: 'Official AWS foundational course on core cloud concepts, compute, storage, security, and architecture.',
    skillId: 'aws',
    level: 'beginner' as const,
    duration: '18 hours',
    url: 'https://aws.amazon.com/training/learn-about/cloud-practitioner/',
    provider: 'AWS Training',
  },
  {
    id: 'lr-5',
    title: 'Applied Statistics & Probability for ML',
    description: 'Comprehensive walkthrough of hypothesis testing, Bayesian inference, distributions, and variance analysis.',
    skillId: 'statistics',
    level: 'beginner' as const,
    duration: '22 hours',
    url: 'https://www.khanacademy.org/math/statistics-probability',
    provider: 'Khan Academy',
  },
  {
    id: 'lr-6',
    title: 'Advanced SQL for Data Analysis & Engineering',
    description: 'Master window functions, CTEs, query optimization, indexing, and complex joins.',
    skillId: 'sql',
    level: 'intermediate' as const,
    duration: '16 hours',
    url: 'https://mode.com/sql-tutorial/',
    provider: 'Mode Analytics',
  },
  {
    id: 'lr-7',
    title: 'React & Next.js Full Stack Architecture',
    description: 'Modern frontend engineering with server components, client hooks, state management, and SSR.',
    skillId: 'react',
    level: 'intermediate' as const,
    duration: '40 hours',
    url: 'https://nextjs.org/learn',
    provider: 'Vercel Learn',
  },
  {
    id: 'lr-8',
    title: 'Production ML Model Deployment',
    description: 'Deploy FastAPI model endpoints, monitor drift, and package inference pipelines in production.',
    skillId: 'machine_learning',
    level: 'intermediate' as const,
    duration: '24 hours',
    url: 'https://madewithml.com/',
    provider: 'Made With ML',
  },
];

// Institution analytics demo data
export const DEMO_INSTITUTION_STATS = {
  totalStudents: 1240,
  placementReady: 487,
  needsUpskilling: 523,
  internshipParticipation: 612,
  avgSkillScore: 68,
  placementRate: 74,
  topCompanies: ['TechNova', 'DataSphere', 'FinEdge', 'CloudCore', 'AI Labs India', 'Infosys', 'TCS'],
  skillDistribution: [
    { skill: 'Python', students: 820, percentage: 66 },
    { skill: 'Git', students: 910, percentage: 73 },
    { skill: 'SQL', students: 740, percentage: 60 },
    { skill: 'React', students: 520, percentage: 42 },
    { skill: 'Machine Learning', students: 380, percentage: 31 },
    { skill: 'Docker', students: 210, percentage: 17 },
    { skill: 'AWS', students: 190, percentage: 15 },
    { skill: 'TensorFlow', students: 160, percentage: 13 },
  ],
  placementReadiness: [
    { range: '0-40%', count: 180, label: 'Needs Intensive Support' },
    { range: '40-60%', count: 343, label: 'Needs Upskilling' },
    { range: '60-75%', count: 398, label: 'Approaching Ready' },
    { range: '75-90%', count: 253, label: 'Placement Ready' },
    { range: '90-100%', count: 66, label: 'Highly Competitive' },
  ],
  topSkillGaps: [
    { skill: 'TensorFlow', avgGap: 61 },
    { skill: 'Docker', avgGap: 52 },
    { skill: 'AWS', avgGap: 55 },
    { skill: 'Machine Learning', avgGap: 38 },
    { skill: 'Deep Learning', avgGap: 46 },
  ],
  monthlyApplications: [
    { month: 'Mar', count: 45 },
    { month: 'Apr', count: 78 },
    { month: 'May', count: 120 },
    { month: 'Jun', count: 195 },
    { month: 'Jul', count: 240 },
    { month: 'Aug', count: 312 },
  ],
};

// Other demo student profiles (for industry candidate ranking)
export const DEMO_OTHER_STUDENTS = [
  {
    id: 'student-2',
    name: 'Arjun Patel',
    college: 'BITS Pilani',
    branch: 'Computer Science',
    graduationYear: 2026,
    cgpa: 8.1,
    skills: {
      python: 78, machine_learning: 72, sql: 68, tensorflow: 55,
      docker: 45, git: 80, data_analysis: 65, statistics: 62,
    },
    projects: [{ technologies: ['python', 'machine_learning', 'tensorflow'] }],
    targetRoles: ['Machine Learning Engineer'],
  },
  {
    id: 'student-3',
    name: 'Priya Krishnan',
    college: 'NIT Trichy',
    branch: 'Information Technology',
    graduationYear: 2026,
    cgpa: 7.9,
    skills: {
      python: 70, machine_learning: 65, sql: 80, data_analysis: 75,
      statistics: 70, git: 72, communication: 80,
    },
    projects: [{ technologies: ['python', 'sql', 'data_analysis'] }],
    targetRoles: ['Data Analyst'],
  },
  {
    id: 'student-4',
    name: 'Rahul Singh',
    college: 'VIT Vellore',
    branch: 'ECE',
    graduationYear: 2026,
    cgpa: 7.5,
    skills: {
      python: 65, machine_learning: 60, sql: 55, tensorflow: 40,
      git: 70, data_analysis: 58,
    },
    projects: [{ technologies: ['python', 'machine_learning'] }],
    targetRoles: ['Machine Learning Engineer'],
  },
  {
    id: 'student-5',
    name: 'Sneha Reddy',
    college: 'IIIT Hyderabad',
    branch: 'Computer Science',
    graduationYear: 2025,
    cgpa: 9.0,
    skills: {
      python: 88, machine_learning: 85, deep_learning: 78, tensorflow: 72,
      sql: 82, docker: 60, statistics: 80, git: 85,
    },
    projects: [{ technologies: ['python', 'tensorflow', 'deep_learning', 'docker'] }],
    targetRoles: ['Machine Learning Engineer'],
  },
];

export const DEMO_CANDIDATES = DEMO_OTHER_STUDENTS;
