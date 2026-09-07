'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  GraduationCap,
  Building2,
  Target,
  FileText,
  UploadCloud,
  ClipboardCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Zap,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { setSession, setStudentSkills, setStudentResume, getSession } from '@/lib/user-session';
import { SAMPLE_RESUMES, parseResumeText } from '@/lib/ai/resume-parser';

const CAREER_GOALS = [
  { id: 'Machine Learning Engineer', label: 'AI / ML Engineer', desc: 'PyTorch, TensorFlow, Deep Learning & Vision', icon: '🤖' },
  { id: 'Full Stack Engineer', label: 'Software / Full Stack Developer', desc: 'React, Next.js, Node.js & Databases', icon: '💻' },
  { id: 'Data Analyst', label: 'Data Analyst / BI Engineer', desc: 'SQL, Python, Analytics & Storytelling', icon: '📊' },
  { id: 'Frontend Developer', label: 'Frontend Developer', desc: 'TypeScript, Modern UI/UX & Web Apps', icon: '🎨' },
  { id: 'Backend Developer', label: 'Backend Developer', desc: 'FastAPI, Node.js, Microservices & APIs', icon: '⚙️' },
  { id: 'Cloud Engineer', label: 'Cloud & DevOps Engineer', desc: 'Docker, Kubernetes, AWS & CI/CD', icon: '☁️' },
  { id: 'Cybersecurity Engineer', label: 'Cybersecurity Analyst', desc: 'Network Security, Cryptography & Audit', icon: '🛡️' },
  { id: 'Product Specialist', label: 'Tech Product / Other', desc: 'System Architecture & Solutions', icon: '🚀' },
];

export default function StudentOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: About you
  const [fullName, setFullName] = useState('Arav Gupta');
  const [college, setCollege] = useState('Dronacharya Group of Institutions');
  const [degree, setDegree] = useState('B.Tech');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3rd Year');
  const [gradYear, setGradYear] = useState('2026');

  // Step 2: Career goal
  const [targetRole, setTargetRole] = useState('Machine Learning Engineer');

  // Step 3: Resume
  const [resumeText, setResumeText] = useState(SAMPLE_RESUMES[0].text);
  const [fileName, setFileName] = useState('My_Resume.pdf');
  const [isParsing, setIsParsing] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setResumeText((event.target?.result as string) || `Resume content for ${file.name}`);
      setResumeUploaded(true);
      toast.success(`Uploaded ${file.name}!`);
    };
    reader.readAsText(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_RESUMES[0]) => {
    setResumeText(sample.text);
    setFileName(`${sample.targetRole.replace(/\s+/g, '_')}_CV.pdf`);
    setResumeUploaded(true);
    toast.info(`Selected sample CV: ${sample.title}`);
  };

  const handleFinishOnboarding = async (goToAssessment: boolean) => {
    setIsParsing(true);

    try {
      // Parse resume if provided
      if (resumeUploaded && resumeText) {
        const parsed = await parseResumeText(resumeText, fileName);
        setStudentResume(parsed);
        if (parsed.extractedSkills && Object.keys(parsed.extractedSkills).length > 0) {
          setStudentSkills(parsed.extractedSkills);
        }
      }

      // Update session
      setSession({
        name: fullName.trim() || 'Aarav Gupta',
        college,
        degree,
        branch,
        year,
        graduationYear: parseInt(gradYear) || 2026,
        targetRole,
        role: 'student',
        onboardingStep: 5,
      });

      toast.success(`🎉 Profile initialized for ${fullName}!`);

      if (goToAssessment) {
        router.push('/student/assessment');
      } else {
        router.push('/student/dashboard');
      }
    } catch {
      router.push('/student/dashboard');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh-playful flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow-md">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-slate-900 text-base">SkillBridge</span>
              <span className="text-[10px] block font-extrabold text-indigo-600 uppercase tracking-wider -mt-1">
                Student Onboarding
              </span>
            </div>
          </Link>

          {/* 4 Steps Indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              { s: 1, label: 'Profile' },
              { s: 2, label: 'Goal' },
              { s: 3, label: 'Resume' },
              { s: 4, label: 'Verify' },
            ].map((st) => (
              <div key={st.s} className="flex items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                    step === st.s
                      ? 'bg-indigo-600 text-white shadow-md'
                      : step > st.s
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step > st.s ? '✓' : st.s}
                </div>
                <span className="text-[11px] font-extrabold text-slate-600 hidden sm:inline">{st.label}</span>
                {st.s < 4 && <span className="text-slate-300 mx-0.5">›</span>}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Wizard Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Step 1: Tell us about yourself */}
          {step === 1 && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white shadow-2xl space-y-6">
              <div>
                <span className="badge-pill badge-pill-purple mb-2">Step 1 of 4</span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Tell us about yourself
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
                  We use this to personalize your skill benchmarks and placement eligibility.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="e.g. Arav Gupta"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    College / University *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      required
                      placeholder="e.g. Dronacharya Group of Institutions"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Degree *
                  </label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.Tech / B.E / MCA"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Branch / Major *
                  </label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Current Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>Final Year</option>
                    <option>Recent Graduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!fullName.trim() || !college.trim()) {
                      toast.error('Please fill in your name and college');
                      return;
                    }
                    setStep(2);
                  }}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 bouncy-hover"
                >
                  Continue to Career Goal <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: What's your career goal? */}
          {step === 2 && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white shadow-2xl space-y-6">
              <div>
                <span className="badge-pill badge-pill-purple mb-2">Step 2 of 4</span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  What is your target career goal?
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
                  Select your dream role to calibrate your skill gap analysis.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {CAREER_GOALS.map((goal) => {
                  const isSelected = targetRole === goal.id;
                  return (
                    <div
                      key={goal.id}
                      onClick={() => setTargetRole(goal.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-sm'
                          : 'border-slate-200 bg-white/70 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-2xl flex-shrink-0">{goal.icon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-extrabold text-slate-900 text-xs flex items-center justify-between">
                          <span>{goal.label}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{goal.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 text-slate-600 font-bold text-xs hover:text-slate-900 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 bouncy-hover"
                >
                  Continue to Resume Profile <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Build your initial profile (Resume Upload) */}
          {step === 3 && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white shadow-2xl space-y-6">
              <div>
                <span className="badge-pill badge-pill-purple mb-2">Step 3 of 4</span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Build your initial skill profile
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
                  Upload your resume to automatically extract your technical competencies, or pick a sample.
                </p>
              </div>

              {/* Upload Dropzone */}
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-200 hover:border-indigo-500 rounded-3xl bg-indigo-50/40 hover:bg-indigo-50/70 transition-all cursor-pointer text-center group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black mb-2 group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {resumeUploaded ? `✓ ${fileName}` : 'Drop your resume (PDF/DOCX/TXT) or Browse'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  AI extracts skills, education, and project vectors
                </div>
                <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={handleFileUpload} className="hidden" />
              </label>

              {/* Sample Resumes */}
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
                  Or pick a sample resume to populate instant skills:
                </label>
                <div className="grid sm:grid-cols-3 gap-2">
                  {SAMPLE_RESUMES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelectSample(s)}
                      className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                        fileName.includes(s.targetRole.replace(/\s+/g, '_'))
                          ? 'border-indigo-600 bg-indigo-50 font-bold'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-black text-slate-900 truncate">{s.title.split(' ')[0]} {s.title.split(' ')[1]}</div>
                      <div className="text-[10px] text-slate-500 truncate">{s.targetRole}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-3 text-slate-600 font-bold text-xs hover:text-slate-900 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="px-4 py-2.5 text-slate-500 font-bold text-xs hover:text-slate-800"
                  >
                    Skip for now
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 bouncy-hover"
                  >
                    Continue to Assessment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Verify your skills (Skill Assessment CTA) */}
          {step === 4 && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white shadow-2xl space-y-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white font-black shadow-lg shadow-amber-500/30 mx-auto">
                <ClipboardCheck className="w-8 h-8" />
              </div>

              <div>
                <span className="badge-pill badge-pill-amber mb-2">Final Step</span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Verify your current proficiency
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm font-medium mt-2 max-w-md mx-auto leading-relaxed">
                  Take our diagnostic 15-question Skill Assessment for <strong>{targetRole}</strong> to benchmark your baseline readiness score.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-left text-xs space-y-2">
                <div className="font-extrabold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Assessment Highlights:
                </div>
                <div className="text-slate-600 pl-6 space-y-1">
                  <div>• 15 adaptive diagnostic questions (10 minutes)</div>
                  <div>• Identifies exact skill gaps for {targetRole}</div>
                  <div>• Unlocks tailored AI Opportunity matching</div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={isParsing}
                  onClick={() => handleFinishOnboarding(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 bouncy-hover transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Start Skill Assessment →
                </button>
                <button
                  type="button"
                  disabled={isParsing}
                  onClick={() => handleFinishOnboarding(false)}
                  className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-2xl border border-slate-200 transition-all"
                >
                  Go to Dashboard directly
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200/80 py-4 bg-white text-center text-xs text-slate-500 font-semibold">
        SkillBridge · AI Skill Intelligence Platform
      </footer>
    </div>
  );
}
