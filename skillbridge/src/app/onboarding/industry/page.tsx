'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, User, MapPin, Users, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { setSession } from '@/lib/user-session';

export default function IndustryOnboardingPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('TechNova Solutions');
  const [industryType, setIndustryType] = useState('Artificial Intelligence / SaaS');
  const [companySize, setCompanySize] = useState('50-250 Employees');
  const [location, setLocation] = useState('Bengaluru / Hybrid');
  const [recruiterName, setRecruiterName] = useState('Rohan Mehta');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSession({
      name: recruiterName,
      company: companyName,
      industryType,
      companySize,
      location,
      role: 'industry',
    });
    toast.success(`Welcome to SkillBridge Industry Portal, ${recruiterName}!`);
    router.push('/industry/dashboard');
  };

  return (
    <div className="min-h-screen bg-mesh-playful flex flex-col justify-between">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white font-black shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-slate-900 text-base">SkillBridge</span>
              <span className="text-[10px] block font-extrabold text-rose-600 uppercase tracking-wider -mt-1">
                Employer Onboarding
              </span>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-8 border border-white shadow-2xl space-y-5">
            <div>
              <span className="badge-pill badge-pill-purple mb-2">🏢 Employer Registration</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Company &amp; Recruiter Profile
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
                Set up your hiring profile to post opportunities and match verified student talent.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Recruiter Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={recruiterName}
                    onChange={(e) => setRecruiterName(e.target.value)}
                    required
                    placeholder="e.g. Rohan Mehta"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Company Name *</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="e.g. TechNova / Razorpay"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Industry Sector</label>
                  <input
                    type="text"
                    value={industryType}
                    onChange={(e) => setIndustryType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Company Size</label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  >
                    <option>1-50 Employees</option>
                    <option>50-250 Employees</option>
                    <option>250-1000 Employees</option>
                    <option>1000+ Enterprise</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Hiring Location / Mode</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru / Hybrid"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 bouncy-hover transition-all flex items-center justify-center gap-2"
              >
                Launch Recruiter Command Center <ArrowRight className="w-4 h-4" />
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
