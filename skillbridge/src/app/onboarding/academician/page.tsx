'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, User, Building2, BookOpen, ArrowRight, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { setSession } from '@/lib/user-session';

export default function AcademicianOnboardingPage() {
  const router = useRouter();
  const [facultyName, setFacultyName] = useState('Prof. Amit Gupta');
  const [institutionName, setInstitutionName] = useState('IIT Delhi');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [researchDomain, setResearchDomain] = useState('Artificial Intelligence & Deep Learning');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSession({
      name: facultyName,
      institutionName,
      department,
      researchDomain,
      role: 'academician',
    });
    toast.success(`Welcome to SkillBridge Faculty Portal, ${facultyName}!`);
    router.push('/academician/dashboard');
  };

  return (
    <div className="min-h-screen bg-mesh-playful flex flex-col justify-between">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-black shadow-md">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-slate-900 text-base">SkillBridge</span>
              <span className="text-[10px] block font-extrabold text-amber-600 uppercase tracking-wider -mt-1">
                Faculty Onboarding
              </span>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-8 border border-white shadow-2xl space-y-5">
            <div>
              <span className="badge-pill badge-pill-amber mb-2">👨‍🏫 Faculty &amp; Researcher</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Academician Profile
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
                Connect with funded bilateral research grants, AICTE FDP programs, and corporate consultancies.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Faculty Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                    required
                    placeholder="e.g. Prof. Amit Gupta"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Institution / University *</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    required
                    placeholder="e.g. IIT Delhi"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Research Domain</label>
                  <input
                    type="text"
                    value={researchDomain}
                    onChange={(e) => setResearchDomain(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 bouncy-hover transition-all flex items-center justify-center gap-2"
              >
                Access Faculty Research &amp; FDP Hub <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="border-t border-slate-200/80 py-4 bg-white text-center text-xs text-slate-500 font-semibold">
        SkillBridge · AI Skill Intelligence Platform
      </footer>
    </div>
  );
}
