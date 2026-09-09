'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, setSession, setStudentResume, setStudentSkills, type UserSession } from '@/lib/user-session';
import { parseResumeText } from '@/lib/ai/resume-parser';
import { UploadCloud, CheckCircle2, User, Building2, Target, Briefcase, Zap, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { TARGET_ROLES } from '@/lib/skills-taxonomy';

export default function OnboardingPage() {
  const router = useRouter();
  const [session, setSessionState] = useState<UserSession | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    branch: '',
    graduationYear: new Date().getFullYear() + 1,
    cgpa: '',
    targetRole: '',
    experienceLevel: 'Graduate / Entry Level',
    profilePictureUrl: '',
  });

  const [isParsing, setIsParsing] = useState(false);
  const [resumeFileName, setResumeFileName] = useState('');
  const [extractedSkillsCount, setExtractedSkillsCount] = useState<number | null>(null);

  useEffect(() => {
    const s = getSession();
    setSessionState(s);
    setFormData(prev => ({
      ...prev,
      name: s.name || '',
      email: s.email || '',
      phone: s.phone || '',
      college: s.college || '',
      degree: s.degree || '',
      branch: s.branch || '',
      graduationYear: s.graduationYear || new Date().getFullYear() + 1,
      cgpa: s.cgpa?.toString() || '',
      targetRole: s.targetRole || '',
      experienceLevel: s.experienceLevel || 'Graduate / Entry Level',
      profilePictureUrl: s.profilePictureUrl || '',
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, profilePictureUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFileName(file.name);
    setIsParsing(true);

    const reader = new FileReader();

    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.onload = async (event) => {
        const text = (event.target?.result as string) || '';
        await processResumeText(text, file.name);
      };
      reader.readAsText(file);
    } else {
      reader.onload = async (event) => {
        const buffer = event.target?.result as ArrayBuffer;
        if (buffer) {
          const decoder = new TextDecoder('utf-8', { fatal: false });
          const rawString = decoder.decode(buffer);
          const printable = rawString.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
          
          if (printable.length > 50) {
            await processResumeText(printable, file.name);
          } else {
            setIsParsing(false);
            toast.error('Could not extract text. Please ensure the PDF is not scanned.');
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const processResumeText = async (text: string, fileName: string) => {
    try {
      await new Promise(r => setTimeout(r, 800)); // Simulate AI processing
      const parsed = await parseResumeText(text, fileName);
      
      setStudentResume(parsed);
      setStudentSkills(parsed.extractedSkills);
      
      setFormData(prev => ({
        ...prev,
        targetRole: parsed.targetRole,
        experienceLevel: parsed.experienceLevel,
        name: parsed.candidateName !== 'Candidate' && !prev.name ? parsed.candidateName : prev.name
      }));
      
      setExtractedSkillsCount(Object.keys(parsed.extractedSkills).length);
      toast.success('Resume parsed successfully! Skills and profile updated.');
    } catch (err) {
      toast.error('Failed to parse resume.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to session
    setSession({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      college: formData.college,
      degree: formData.degree,
      branch: formData.branch,
      graduationYear: Number(formData.graduationYear),
      cgpa: Number(formData.cgpa) || undefined,
      targetRole: formData.targetRole,
      experienceLevel: formData.experienceLevel,
      profilePictureUrl: formData.profilePictureUrl,
      isProfileComplete: true,
      onboardingStep: 2,
    });

    toast.success('Profile completed successfully!');
    router.push('/student/dashboard');
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6 font-sans text-slate-900">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative z-10">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-600 p-8 text-white">
          <h1 className="text-2xl font-black tracking-tight mb-2">Complete Your Profile</h1>
          <p className="text-blue-100 text-sm font-medium">Tell us about yourself and upload your resume to unlock AI-powered opportunities.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Section 1: Personal Info */}
          <section className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Details
            </h2>

            <div className="flex items-center gap-4 mb-4">
              <div className="relative group">
                {formData.profilePictureUrl ? (
                  <img src={formData.profilePictureUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-sm">
                    <User className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-sm ring-2 ring-white">
                  <input type="file" accept="image/*" className="hidden" onChange={handleProfilePictureUpload} />
                  <UploadCloud className="w-3.5 h-3.5" />
                </label>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">Profile Picture</span>
                <span className="text-xs text-slate-500">Upload a professional photo (Optional)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Priya Sharma" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 9876543210" />
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2: Academic Info */}
          <section className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Academic Background
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">College / Institution</label>
                <input type="text" name="college" required value={formData.college} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Indian Institute of Technology" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Degree</label>
                <input type="text" name="degree" required value={formData.degree} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. B.Tech" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Branch / Specialization</label>
                <input type="text" name="branch" required value={formData.branch} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Computer Science" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Graduation Year</label>
                <input type="number" name="graduationYear" required value={formData.graduationYear} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">CGPA</label>
                <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 8.5" />
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3: Resume & Auto-fill */}
          <section className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Resume & AI Auto-Fill
            </h2>
            
            <div className="bg-slate-50 border-2 border-dashed border-indigo-200 rounded-2xl p-6 text-center hover:bg-indigo-50/50 transition-colors relative">
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              
              {isParsing ? (
                <div className="flex flex-col items-center justify-center space-y-3 py-2">
                  <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                  <p className="text-sm font-bold text-indigo-700">Extracting Skills & Experience...</p>
                </div>
              ) : resumeFileName ? (
                <div className="flex flex-col items-center justify-center space-y-2 py-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  <p className="text-sm font-bold text-emerald-700">Parsed: {resumeFileName}</p>
                  {extractedSkillsCount !== null && (
                    <p className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                      Extracted {extractedSkillsCount} verified skills
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500 mt-2">Click or drag to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3 py-2">
                  <div className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center text-indigo-500">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Upload your Resume (PDF/TXT)</p>
                    <p className="text-xs text-slate-500 mt-1">We will automatically extract your skills, target role, and experience.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> Target Career Role
                </label>
                <select name="targetRole" required value={formData.targetRole} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="" disabled>Select your primary goal</option>
                  {TARGET_ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Experience Level
                </label>
                <select name="experienceLevel" required value={formData.experienceLevel} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Graduate / Entry Level">Graduate / Entry Level</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior Level">Senior Level</option>
                </select>
              </div>
            </div>
          </section>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button type="submit" disabled={isParsing} className="px-8 py-3.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-700/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              Complete Profile &amp; Continue &rarr;
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
