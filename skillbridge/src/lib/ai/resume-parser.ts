/**
 * AI Resume Parser & Skill Extractor Engine
 * Extracts ONLY genuine competencies, candidate metadata, and experience from resumes without fake fallbacks.
 */

import { ParsedResume } from '../user-session';
import { SKILLS, SKILL_MAP, Skill } from '../skills-taxonomy';

export const SAMPLE_RESUMES = [
  {
    id: 'sample-aiml',
    title: '🤖 Sample AI & Machine Learning CV',
    targetRole: 'Machine Learning Engineer',
    headline: 'Machine Learning & Computer Vision Researcher',
    summary:
      'Engineered PyTorch and TensorFlow models for automated image segmentation. Strong background in Python, mathematical statistics, SQL pipelines, and deploying containerized models with Docker on AWS.',
    text: `Arav Gupta
B.Tech in Computer Science and Engineering, Dronacharya Group of Institutions
Email: arav.gupta@student.edu | GitHub: github.com/arav-gupta | Location: Greater Noida, India

SUMMARY:
Passionate Machine Learning Engineer with experience building computer vision pipelines, deep neural networks, and data analytics models in Python.

TECHNICAL SKILLS:
- Languages & Frameworks: Python, PyTorch, TensorFlow, Scikit-learn, SQL, OpenCV
- Data & Cloud Tools: Deep Learning, Machine Learning, Statistics, Data Analysis, Git, Docker, AWS, Linux
- Soft Skills: Problem Solving, Critical Thinking, Teamwork

PROJECTS:
1. Real-Time Autonomous Object Detector (PyTorch, Computer Vision, Docker)
- Designed an end-to-end YOLO object detection pipeline on GPU clusters.
- Containerized microservice with Docker and deployed on AWS.

2. Multimodal Clinical Diagnostics Classifier (TensorFlow, Deep Learning, Python)
- Trained ResNet-50 models on 50,000+ medical scans with high precision.

3. Distributed ETL Data Pipeline (SQL, Python, Data Analysis)
- Engineered data ingestion pipeline processing transactional records with SQL & Pandas.`,
  },
  {
    id: 'sample-fullstack',
    title: '💻 Sample Full-Stack Web & Cloud Developer CV',
    targetRole: 'Full Stack Engineer',
    headline: 'Modern React, Next.js, Node.js & Cloud Developer',
    summary:
      'Proficient in building full-stack web applications with React, Next.js, TypeScript, and Node.js. Experienced with PostgreSQL databases, Docker containerization, REST APIs, and AWS deployments.',
    text: `Priya Verma
B.Tech Information Technology
Email: priya.v@example.com | GitHub: github.com/priya-dev | Location: Pune, India

SUMMARY:
Full-Stack Software Engineer experienced in building responsive, scalable SaaS applications with Next.js, React, Node.js, and TypeScript.

TECHNICAL SKILLS:
- Frontend: React, Next.js, TypeScript, JavaScript, Tailwind CSS, HTML/CSS
- Backend & Databases: Node.js, Express, FastAPI, PostgreSQL, SQL, MongoDB
- DevOps & Cloud: Git, Docker, Kubernetes, AWS, Linux
- Soft Skills: Problem Solving, Teamwork, Communication

PROJECTS:
1. Enterprise Cloud Portal (Next.js, TypeScript, Tailwind, Node.js)
- Developed high-performance web dashboard with server-side rendering and responsive design.

2. Microservices Backend API (Node.js, Docker, PostgreSQL, AWS)
- Architected RESTful microservices with Docker containerization and AWS hosting.`,
  },
  {
    id: 'sample-data',
    title: '📊 Sample Data Analytics & BI Engineer CV',
    targetRole: 'Data Analyst',
    headline: 'SQL, Python & Statistical Modeling Specialist',
    summary:
      'Specialist in transforming complex datasets into actionable business intelligence using Python, advanced SQL, statistical hypothesis testing, and interactive reporting dashboards.',
    text: `Rohan Sen
B.Tech Computer Science
Email: rohan.sen@example.com | Location: Hyderabad, India

SUMMARY:
Data Analyst with strong background in statistical computing, automated data pipelines, and business metrics reporting.

TECHNICAL SKILLS:
- Data & Analytics: SQL, Python, Data Analysis, Statistics, MongoDB
- Tools & Scripting: Git, Linux, Fast-API
- Professional Skills: Problem Solving, Critical Thinking, Time Management, Communication

PROJECTS:
1. Customer Churn Prediction System (Python, SQL, Statistics)
- Developed predictive regression models analyzing user churn trends.
- Automated weekly data reporting pipelines from SQL databases.`,
  },
];

// Comprehensive Skill Alias Dictionary for strict, accurate keyword matching
const SKILL_ALIASES: Record<string, string[]> = {
  python: ['python', 'py', 'python3', 'python2', 'pandas', 'numpy', 'scipy', 'scikit-learn', 'sklearn'],
  javascript: ['javascript', 'js', 'es6', 'ecmascript'],
  typescript: ['typescript', 'ts'],
  java: ['java', 'spring', 'springboot', 'spring boot', 'j2ee'],
  cpp: ['c++', 'cpp', 'c plus plus'],
  react: ['react', 'react.js', 'reactjs', 'react native'],
  nextjs: ['next.js', 'nextjs', 'next js', 'next 14', 'next 15'],
  html_css: ['html', 'css', 'html5', 'css3', 'html/css', 'sass', 'scss'],
  tailwind: ['tailwind', 'tailwindcss', 'tailwind css'],
  nodejs: ['node.js', 'nodejs', 'node js', 'node', 'express', 'express.js', 'expressjs'],
  fastapi: ['fastapi', 'fast-api', 'fast api'],
  django: ['django', 'django rest framework', 'drf'],
  sql: ['sql', 'postgresql', 'postgres', 'mysql', 'sqlite', 'oracle sql', 'relational database', 'pl/sql', 'rdbms'],
  mongodb: ['mongodb', 'mongo', 'nosql', 'mongoose'],
  machine_learning: ['machine learning', 'ml', 'scikit-learn', 'supervised learning', 'unsupervised learning', 'xgboost', 'random forest'],
  deep_learning: ['deep learning', 'neural network', 'neural networks', 'cnn', 'rnn', 'lstm', 'transformer', 'transformers'],
  tensorflow: ['tensorflow', 'tf', 'keras'],
  pytorch: ['pytorch', 'torch'],
  data_analysis: ['data analysis', 'data analytics', 'data wrangling', 'data visualization', 'eda', 'tableau', 'power bi', 'excel'],
  statistics: ['statistics', 'statistical modeling', 'probability', 'hypothesis testing', 'regression analysis'],
  nlp: ['nlp', 'natural language processing', 'spacy', 'nltk', 'llm', 'llms', 'langchain', 'bert', 'embeddings'],
  computer_vision: ['computer vision', 'cv', 'opencv', 'yolo', 'image processing', 'object detection', 'image segmentation'],
  docker: ['docker', 'dockerfile', 'docker-compose', 'containerization', 'containers'],
  kubernetes: ['kubernetes', 'k8s', 'helm'],
  aws: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'cloudformation', 'dynamodb'],
  azure: ['azure', 'microsoft azure', 'azure devops'],
  gcp: ['gcp', 'google cloud', 'google cloud platform', 'bigquery'],
  git: ['git', 'github', 'gitlab', 'version control'],
  linux: ['linux', 'ubuntu', 'bash', 'shell script', 'shell scripting', 'unix'],
  communication: ['communication', 'written communication', 'verbal communication', 'presentation skills'],
  problem_solving: ['problem solving', 'analytical skills', 'algorithmic thinking', 'data structures', 'dsa'],
  teamwork: ['teamwork', 'collaboration', 'cross-functional', 'team player', 'peer programming'],
  leadership: ['leadership', 'team lead', 'mentoring', 'lead developer', 'project manager'],
  critical_thinking: ['critical thinking', 'decision making', 'troubleshooting'],
  time_management: ['time management', 'agile', 'scrum', 'sprint planning', 'deadline-driven'],
};

import { parseResumeWithGemini } from '@/app/actions/resume.actions';

/**
 * Parses raw resume text and extracts genuine skills, projects, and experience using Gemini 2.0.
 */
export async function parseResumeText(text: string, fileName: string = 'Resume.pdf'): Promise<ParsedResume> {
  // Call the secure Next.js Server Action which runs Gemini AI on the backend
  return await parseResumeWithGemini(text, fileName);
}
