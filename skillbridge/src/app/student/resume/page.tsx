'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Zap,
  RefreshCw,
  Layers,
  ShieldCheck,
  AlertCircle,
  FileCode,
  Check,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { SAMPLE_RESUMES, parseResumeText } from '@/lib/ai/resume-parser';
import {
  getStudentResume,
  setStudentResume,
  setStudentSkills,
  setSession,
  getSession,
  type ParsedResume,
} from '@/lib/user-session';
import { SKILL_MAP } from '@/lib/skills-taxonomy';
import { scoreBarColor, scoreColor } from '@/lib/utils';
import Link from 'next/link';

export default function ResumeUploadPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'samples'>('upload');
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('My_Resume.pdf');
  const [isParsing, setIsParsing] = useState(false);
  const [currentParsed, setCurrentParsed] = useState<ParsedResume | null>(null);

  useEffect(() => {
    const existing = getStudentResume();
    if (existing) {
      setCurrentParsed(existing);
      setFileName(existing.fileName);
    }
  }, []);

  // Handle client-side file reading
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        setResumeText(text);
        toast.success(`Loaded ${file.name}! Click 'Analyze & Sync' to extract your exact skills.`);
      };
      reader.readAsText(file);
    } else {
      // For PDF / Binary files: read binary buffer and extract printable text stream
      reader.onload = (event) => {
        const buffer = event.target?.result as ArrayBuffer;
        if (buffer) {
          const decoder = new TextDecoder('utf-8', { fatal: false });
          const rawString = decoder.decode(buffer);
          
          // Filter printable text tokens and common resume text patterns
          const printable = rawString
            .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

          if (printable.length > 50) {
            setResumeText(printable);
            toast.success(`Parsed text from ${file.name}! Click 'Analyze & Sync' to extract skills.`);
          } else {
            // Fallback prompt to paste if binary stream is encoded/compressed
            setResumeText(`RESUME FILE: ${file.name}\n\n[Note: If this PDF is scanned or password protected, you can also paste your resume text in the 'Paste Text' tab for 100% accuracy.]`);
            toast.info(`Uploaded ${file.name}. Review text or paste your resume text below.`);
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSelectSample = (sample: (typeof SAMPLE_RESUMES)[0]) => {
    setResumeText(sample.text);
    setFileName(`${sample.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    toast.info(`Loaded ${sample.title}`);
  };

  const handleAnalyzeAndSync = async () => {
    if (!resumeText.trim()) {
      toast.error('Please upload a resume file or paste your resume text first!');
      return;
    }

    setIsParsing(true);

    try {
      // Simulate real-time neural parsing
      await new Promise((r) => setTimeout(r, 500));

      const parsed = await parseResumeText(resumeText, fileName);
      setCurrentParsed(parsed);

      // 1. Save resume metadata
      setStudentResume(parsed);

      // 2. Save ONLY the genuine extracted skills
      setStudentSkills(parsed.extractedSkills);

      // 3. Update session if name or role detected
      const currentSession = getSession();
      setSession({
        name: parsed.candidateName !== 'Candidate' ? parsed.candidateName : currentSession.name,
        targetRole: parsed.targetRole || currentSession.targetRole,
      });

      const count = Object.keys(parsed.extractedSkills).length;
      if (count > 0) {
        toast.success(`🎉 Successfully extracted ${count} verified skills from your resume!`);
      } else {
        toast.warning('No matching skills found in text. Please paste your technical skills directly.');
      }
    } catch (err) {
      toast.error('Failed to parse resume text. Please check the content and try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const extractedSkillEntries = currentParsed ? Object.entries(currentParsed.extractedSkills) : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-cyan-300 text-xs font-black mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" /> AI Resume Vectorizer
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Upload Resume / CV &amp; Extract Skills
          </h1>
          <p className="text-indigo-200 text-sm mt-1 max-w-xl font-medium leading-relaxed">
            Upload your resume or paste your CV. Our AI extracts <strong>only your genuine skills</strong>, recalculates your Skill Readiness Index, and matches tailored opportunities in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            href="/student/dashboard"
            className="flex items-center gap-2 px-5 py-3 bg-white/15 hover:bg-white/25 text-white text-xs font-black rounded-2xl border border-white/20 transition-all bouncy-hover"
          >
            ← View Updated Dashboard
          </Link>
        </div>
      </div>

      {/* Main Grid: Upload & Preview */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Side: Upload / Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5">
            {/* Mode Switcher Tabs */}
            <div className="flex p-1.5 bg-slate-100 rounded-2xl gap-1">
              {[
                { id: 'upload', label: '📁 Upload File (PDF / DOC / TXT)' },
                { id: 'paste', label: '📝 Paste Resume Text' },
                { id: 'samples', label: '⭐ Pre-loaded Sample CVs' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all text-center ${
                    activeTab === t.id
                      ? 'bg-white text-[#4F46E5] shadow-sm scale-100'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB 1: File Upload */}
            {activeTab === 'upload' && (
              <div className="space-y-4">
                <label className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50/70 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-black text-slate-900">
                    Click to browse or drag &amp; drop your resume
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">
                    Supports PDF, DOCX, TXT, RTF (Max 10MB)
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,.rtf,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {fileName && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span className="font-extrabold text-slate-900">{fileName}</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Loaded
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Direct Paste Text */}
            {activeTab === 'paste' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Paste Your Resume Text / Technical Skills
                  </label>
                  {resumeText && (
                    <button
                      onClick={() => setResumeText('')}
                      className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-bold"
                    >
                      <Trash2 className="w-3 h-3" /> Clear Text
                    </button>
                  )}
                </div>
                <textarea
                  rows={8}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder={`Paste your resume text here. Example:\n\nTECHNICAL SKILLS: Python, SQL, React, Node.js, Docker, Git, Machine Learning\n\nPROJECTS:\n- Real-Time Object Detector with Python & PyTorch\n- Cloud API with Node.js & Docker`}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-y"
                />
              </div>
            )}

            {/* TAB 3: Pre-loaded Samples */}
            {activeTab === 'samples' && (
              <div className="space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Select a Sample Profile to Test Skill Extraction:
                </div>
                <div className="grid gap-2.5">
                  {SAMPLE_RESUMES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className="w-full text-left p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-extrabold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {sample.title}
                        </div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                          {sample.targetRole}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-1 line-clamp-2">
                        {sample.summary}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Editable Content Preview / Action Trigger */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              {resumeText && (
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Resume Content to Analyze:</span>
                    <span className="text-[11px] text-slate-400 font-semibold">{resumeText.length} characters</span>
                  </div>
                  <textarea
                    rows={4}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-y"
                  />
                </div>
              )}

              <button
                onClick={handleAnalyzeAndSync}
                disabled={isParsing || !resumeText.trim()}
                className="w-full py-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 bouncy-hover transition-all flex items-center justify-center gap-2"
              >
                {isParsing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Neural Vectorizer Parsing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Extract Skills &amp; Sync Dashboard
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Extracted Skills & Real-time Live Vector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-sm">Extracted Verified Skills</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {currentParsed ? `Found in ${currentParsed.fileName}` : 'No resume parsed yet'}
                </p>
              </div>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                {extractedSkillEntries.length} Skills
              </span>
            </div>

            {currentParsed && extractedSkillEntries.length > 0 ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs space-y-1">
                  <div className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> {currentParsed.headline}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    {currentParsed.summary}
                  </div>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {extractedSkillEntries.map(([skillId, score]) => (
                    <div
                      key={skillId}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs hover:border-indigo-200 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="font-extrabold text-slate-800">
                          {SKILL_MAP[skillId]?.name ?? skillId}
                        </span>
                      </div>
                      <span className={`font-black text-xs ${scoreColor(score)}`}>
                        {score}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Render Extracted Experience */}
                {currentParsed.experience && currentParsed.experience.length > 0 && (
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-2">Work Experience</h4>
                    <div className="space-y-2">
                      {currentParsed.experience.map((exp, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                          <div className="font-extrabold text-slate-900">{exp.role}</div>
                          <div className="text-slate-500 font-medium flex items-center justify-between mt-1">
                            <span>{exp.company}</span>
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">{exp.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Render Extracted Projects */}
                {currentParsed.projects && currentParsed.projects.length > 0 && (
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-2">Projects</h4>
                    <div className="space-y-2">
                      {currentParsed.projects.map((proj, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                          <div className="font-extrabold text-indigo-700 mb-1">{proj.title}</div>
                          <div className="text-slate-600 font-medium leading-relaxed">{proj.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href="/student/skill-gaps"
                    className="w-full py-3 bg-slate-900 hover:bg-[#4F46E5] text-white font-extrabold text-xs rounded-xl text-center transition-colors shadow-sm"
                  >
                    View Skill Gaps for {currentParsed.targetRole} →
                  </Link>
                  <Link
                    href="/student/opportunities"
                    className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs rounded-xl text-center border border-indigo-200 transition-colors"
                  >
                    View AI Job Matches →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-xs font-black text-slate-700">No Skills Extracted Yet</div>
                <p className="text-xs text-slate-400 font-medium">
                  Upload your resume or select a sample CV on the left and click <strong>Extract Skills &amp; Sync</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
