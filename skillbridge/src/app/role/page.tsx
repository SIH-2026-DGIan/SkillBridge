'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Building2, BookOpen, Landmark, ShieldCheck, Target, Lock, Users } from 'lucide-react';

/* =============================================================================
   Role Data
============================================================================= */
const ROLES = [
  {
    id: 'student',
    title: 'Student Portal',
    desc: 'Find opportunities, track applications, get personalized recommendations and grow your career.',
    icon: GraduationCap,
    gradient: 'from-blue-600 to-blue-400',
    hoverGradient: 'hover:from-blue-500 hover:to-blue-300',
    shadow: 'shadow-blue-500/30',
  },
  {
    id: 'industry',
    title: 'Industry & Recruiter',
    desc: 'Discover top talent, manage drives, post opportunities and build stronger hiring pipelines.',
    icon: Building2,
    gradient: 'from-violet-600 to-purple-500',
    hoverGradient: 'hover:from-violet-500 hover:to-purple-400',
    shadow: 'shadow-purple-500/30',
  },
  {
    id: 'institution',
    title: 'Institution & TPO',
    desc: 'Manage campus drives, track placement stats, and connect with recruiters and students.',
    icon: Landmark,
    gradient: 'from-teal-600 to-emerald-500',
    hoverGradient: 'hover:from-teal-500 hover:to-emerald-400',
    shadow: 'shadow-teal-500/30',
  },
  {
    id: 'academician',
    title: 'Academician & Faculty',
    desc: 'Access research opportunities, faculty programs, and collaborate with industry experts.',
    icon: BookOpen,
    gradient: 'from-orange-500 to-amber-500',
    hoverGradient: 'hover:from-orange-400 hover:to-amber-400',
    shadow: 'shadow-orange-500/30',
  },
];

function RoleSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const actionType = searchParams.get('type') || 'signup';

  const handleSelect = (id: string) => {
    setSelectedRole(id);
    // Add a small delay for the animation
    setTimeout(() => {
      router.push(`/${actionType}?role=${id}`);
    }, 300);
  };

  return (<div className="min-h-screen pt-20 bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-200">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-100/40 blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 z-50 w-full h-20 flex items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/image.png" alt="SkillBridge" width={160} height={40} priority className="object-contain mix-blend-multiply" />
        </Link>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-8 lg:py-10 flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Left Column: Static Text */}
        <div className="w-full lg:w-[380px] shrink-0 sticky top-32">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-bold tracking-wide uppercase mb-5">
            Multiple Roles <span className="text-blue-300">•</span> One Platform
          </div>
          
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-5">
            Choose a Role <br/>
            <span className="text-blue-600">to Explore</span>
          </h1>
          
          <p className="text-slate-500 text-base leading-relaxed mb-10 max-w-sm">
            Pick any role to enter a fully populated dashboard with live matching, analytics, and simulated data.
          </p>

          <div className="relative mb-12">
            <div className="font-['Caveat',cursive] text-3xl text-blue-600 transform -rotate-6">
              Your growth.<br/>Our mission.
            </div>
            {/* Arrow SVG */}
            <svg className="absolute left-32 top-8 w-14 h-14 text-blue-400 transform rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-start gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 leading-tight pt-0.5">Trusted by<br/>Top Institutions</span>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-start gap-2.5">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 leading-tight pt-0.5">Verified Opportunities<br/>& Recruiters</span>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-start gap-2.5">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-lg shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 leading-tight pt-0.5">Personalized<br/>Recommendations</span>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-start gap-2.5">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 leading-tight pt-0.5">Secure & Reliable<br/>Platform</span>
            </div>
          </div>
        </div>

        {/* Right Column: Bento Grid */}
        <div className="flex-1 w-full grid grid-cols-12 gap-4">
          
          {/* Top Row: Student (Full Width) */}
          <div 
            onClick={() => handleSelect('student')}
            className={`col-span-12 relative overflow-hidden rounded-3xl cursor-pointer group transition-all duration-300
              bg-gradient-to-br from-blue-600 to-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1
              ${selectedRole === 'student' ? 'ring-4 ring-white ring-offset-4 ring-offset-blue-500 scale-[0.98]' : ''}`}
          >
            {/* Background Blob */}
            <div className="absolute right-0 top-0 w-2/3 h-full bg-white/10 blur-3xl rounded-full transform translate-x-1/3 -translate-y-1/4"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-stretch">
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white mb-4 backdrop-blur-sm">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Student Portal</h2>
                <p className="text-blue-100 text-sm max-w-sm mb-4 leading-relaxed">For Students</p>
                <p className="text-white text-sm max-w-md mb-6 leading-relaxed">Find opportunities, track applications, get personalized recommendations and grow your career.</p>
                <div className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-lg font-semibold transition-colors self-start w-auto text-sm">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <div className="hidden md:block w-1/3 relative min-h-[220px]">
                <Image 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
                  alt="Student" 
                  fill
                  className="object-cover object-center rounded-l-3xl shadow-[-20px_0_40px_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Bottom Grid: Left (Industry + Image) */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-4">
            
            {/* Industry */}
            <div 
              onClick={() => handleSelect('industry')}
              className={`flex-1 relative overflow-hidden rounded-3xl p-6 cursor-pointer group transition-all duration-300 min-h-[260px] flex flex-col
                bg-gradient-to-br from-violet-600 to-purple-600 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1
                ${selectedRole === 'industry' ? 'ring-4 ring-white ring-offset-4 ring-offset-purple-500 scale-[0.98]' : ''}`}
            >
               {/* Background image overlay */}
               <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                 <Image src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" alt="Corporate" fill className="object-cover" />
               </div>
               <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-purple-900/80 to-transparent"></div>

               <div className="relative z-10 flex-1 flex flex-col">
                 <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-white mb-4 backdrop-blur-sm">
                   <Building2 className="w-4 h-4" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-1">Industry & Recruiter</h3>
                 <p className="text-purple-200 text-[13px] mb-3">For HR & Companies</p>
                 <p className="text-purple-50 text-[13px] leading-relaxed mb-6 flex-1">Discover top talent, manage drives, post opportunities and build stronger hiring pipelines.</p>
                 <div className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-1.5 rounded-lg font-semibold transition-colors self-start w-auto text-xs">
                    Explore <ArrowRight className="w-3 h-3" />
                 </div>
               </div>
            </div>

            {/* Decorative Image */}
            <div className="h-[140px] rounded-3xl overflow-hidden relative shadow-sm hidden md:block group">
              <Image 
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800" 
                alt="Campus" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors"></div>
            </div>

          </div>

          {/* Bottom Grid: Right (Institution + Academician) */}
          <div className="col-span-12 md:col-span-7 flex flex-col gap-4">
            
            {/* Institution */}
            <div 
              onClick={() => handleSelect('institution')}
              className={`h-[200px] relative overflow-hidden rounded-3xl p-6 cursor-pointer group transition-all duration-300 flex flex-col
                bg-gradient-to-br from-teal-600 to-emerald-500 hover:shadow-2xl hover:shadow-teal-500/20 hover:-translate-y-1
                ${selectedRole === 'institution' ? 'ring-4 ring-white ring-offset-4 ring-offset-teal-500 scale-[0.98]' : ''}`}
            >
              <div className="absolute right-0 bottom-0 w-64 h-64 opacity-20 mix-blend-overlay translate-x-12 translate-y-12">
                 <Image src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800" alt="University" fill className="object-cover rounded-full" />
              </div>
              <div className="relative z-10 flex-1 flex flex-col">
                 <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-white mb-3 backdrop-blur-sm">
                   <Landmark className="w-4 h-4" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-1">Institution & TPO</h3>
                 <p className="text-teal-100 text-[13px] mb-2">For Institutions & Placement Officers</p>
                 <p className="text-white/90 text-[13px] leading-relaxed mb-4 max-w-sm">Manage campus drives, track placement stats, and connect with recruiters and students.</p>
                 <div className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-1.5 rounded-lg font-semibold transition-colors self-start w-auto text-xs mt-auto">
                    Explore <ArrowRight className="w-3 h-3" />
                 </div>
              </div>
            </div>

            {/* Academician */}
            <div 
              onClick={() => handleSelect('academician')}
              className={`flex-1 relative overflow-hidden rounded-3xl p-6 cursor-pointer group transition-all duration-300 flex flex-col
                bg-gradient-to-br from-orange-500 to-amber-500 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-1
                ${selectedRole === 'academician' ? 'ring-4 ring-white ring-offset-4 ring-offset-orange-500 scale-[0.98]' : ''}`}
            >
              <div className="absolute right-0 top-0 w-1/2 h-full opacity-30 mix-blend-overlay">
                 <Image src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800" alt="Faculty" fill className="object-cover" />
              </div>
              <div className="absolute right-0 top-0 w-full h-full bg-gradient-to-r from-orange-500/90 via-orange-500/50 to-transparent"></div>

              <div className="relative z-10 flex-1 flex flex-col">
                 <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-white mb-3 backdrop-blur-sm">
                   <Users className="w-4 h-4" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-1">Academician & Faculty</h3>
                 <p className="text-orange-100 text-[13px] mb-2">For Faculty Members</p>
                 <p className="text-white/90 text-[13px] leading-relaxed mb-4 max-w-sm">Access research opportunities, faculty programs, and collaborate with industry experts.</p>
                 <div className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-1.5 rounded-lg font-semibold transition-colors self-start w-auto text-xs mt-auto">
                    Explore <ArrowRight className="w-3 h-3" />
                 </div>
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}

export default function RoleSelectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">Loading...</div>}>
      <RoleSelectionContent />
    </Suspense>
  );
}
