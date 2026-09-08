import Link from "next/link";
import Image from "next/image";
import HeroVideo from "@/frontend/components/ui/HeroVideo";
import LandingHeader from "@/frontend/components/ui/LandingHeader";

export default function HomePage() {
  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      <div className="bg-[#FAFAF7] text-[#111827] antialiased">
        {/* NAVBAR */}
        <LandingHeader />

        <main className="w-full pt-20">
          {/* HERO */}
          <section className="w-full bg-[#FAFAF7] border-b border-[#E5E7EB] min-h-[84vh] flex items-center py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center -mt-12 lg:-mt-16">
                <div className="lg:col-span-6 flex flex-col items-start pr-0 lg:pr-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#EEF4FF] rounded-full mb-6 border border-[#E5E7EB]">
                    <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
                    <span className="text-xs tracking-widest font-semibold uppercase text-[#2563EB]">SKILLS x OPPORTUNITIES x IMPACT</span>
                  </div>
                  <h1 className="font-serif text-[46px] sm:text-[58px] lg:text-[66px] font-bold text-[#111827] tracking-tight leading-[1.08] mb-6 pr-0 lg:pr-10 xl:pr-16">
                    Bridging the Gap Between Learning and the <span className="text-[#2563EB]">Real World</span>
                  </h1>
                  <p className="text-[17px] text-[#4B5563] leading-relaxed max-w-xl mb-8">
                    SkillBridge connects students, industry and academia through verified skill telemetry, objective hiring pathways, and institutional outcome governance.
                  </p>
                  <div className="mb-12">
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <Link href="/role" className="inline-flex items-center gap-2.5 text-white text-[15px] font-medium px-7 py-3.5 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] transition-all">
                        Get Started <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </Link>
                      <a href="#how-it-works" className="inline-flex items-center gap-2 bg-white text-[#111827] text-[15px] font-medium px-7 py-3.5 rounded-lg border border-[#111827] hover:bg-gray-50 transition-all shadow-sm">
                        See How It Works <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </a>
                    </div>
                    <p className="text-[13.5px] text-[#6B7280]">Built for every learner — mobile-first, low-bandwidth & multilingual.</p>
                  </div>

                </div>
                {/* RIGHT: SkillBridge Advertisement Video */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center w-full -mt-24 lg:-mt-48">
                  <HeroVideo />
                </div>
              </div>
            </div>
          </section>

          {/* KEY FEATURES */}
          <section className="w-full bg-white py-28 border-b border-[#E5E7EB]" id="features">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="text-center max-w-3xl mx-auto mb-20">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#2563EB] block mb-2">Comprehensive Platform</span>
                <h2 className="font-serif text-[42px] font-bold text-[#111827] tracking-tight mb-3">Key Features of SkillBridge</h2>
                <p className="text-[18px] text-[#4B5563]">A secure, scalable, and intelligent platform supporting the complete lifecycle of skill development, internships, and placements.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Skill Development */}
                <div className="bg-[#FAFAF7] p-8 rounded-2xl border border-[#E5E7EB] hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#EEF4FF] text-[#2563EB] rounded-xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[24px]">psychology</span>
                  </div>
                  <h3 className="text-[20px] font-bold text-[#111827] mb-4">Skill Development</h3>
                  <ul className="space-y-3 text-[14px] text-[#4B5563]">
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] text-[#10B981] shrink-0 mt-0.5">check_circle</span>Skill assessment through questionnaires and aptitude tests.</li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] text-[#10B981] shrink-0 mt-0.5">check_circle</span>Skill profiling and identification of technical/soft skill gaps.</li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] text-[#10B981] shrink-0 mt-0.5">check_circle</span>Personalized learning recommendations and industry training.</li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] text-[#10B981] shrink-0 mt-0.5">check_circle</span>Student digital portfolios showcasing verified skills & projects.</li>
                  </ul>
                </div>
                {/* Internships */}
                <div className="bg-[#FAFAF7] p-8 rounded-2xl border border-[#E5E7EB] hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#EEF4FF] text-[#2563EB] rounded-xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[24px]">work</span>
                  </div>
                  <h3 className="text-[20px] font-bold text-[#111827] mb-4">Internships</h3>
                  <ul className="space-y-3 text-[14px] text-[#4B5563]">
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] text-[#10B981] shrink-0 mt-0.5">check_circle</span>Centralized portal for industries to post opportunities.</li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] text-[#10B981] shrink-0 mt-0.5">check_circle</span>Matching of students based on skill profiles & interests.</li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] text-[#10B981] shrink-0 mt-0.5">check_circle</span>Internships & industrial training for academicians (FDPs).</li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] text-[#10B981] shrink-0 mt-0.5">check_circle</span>Progress tracking and mentor feedback records.</li>
                  </ul>
                </div>
                {/* Placement */}
                <div className="bg-[#FAFAF7] p-8 rounded-2xl border border-[#E5E7EB] hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#EEF4FF] text-[#2563EB] rounded-xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[24px]">cases</span>
                  </div>
                  <h3 className="text-[20px] font-bold text-[#111827] mb-4">Placement</h3>
                  <ul className="space-y-3 text-[14px] text-[#4B5563]">
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] text-[#10B981] shrink-0 mt-0.5">check_circle</span>Industry portal for job postings with required skill sets.</li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] text-[#10B981] shrink-0 mt-0.5">check_circle</span>Recommendation engine for candidate shortlisting.</li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] text-[#10B981] shrink-0 mt-0.5">check_circle</span>Application tracking and recruitment management.</li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] text-[#10B981] shrink-0 mt-0.5">check_circle</span>Analytics dashboards to monitor placement readiness.</li>
                  </ul>
                </div>
                {/* Overall Platform */}
                <div className="bg-[#FAFAF7] p-8 rounded-2xl border border-[#E5E7EB] hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#EEF4FF] text-[#2563EB] rounded-xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[24px]">hub</span>
                  </div>
                  <h3 className="text-[20px] font-bold text-[#111827] mb-4">Overall Platform Features</h3>
                  <ul className="space-y-3 text-[14px] text-[#4B5563]">
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] text-[#10B981] shrink-0 mt-0.5">check_circle</span>Role-based access for all 4 primary stakeholders.</li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] text-[#10B981] shrink-0 mt-0.5">check_circle</span>Secure document management for resumes & records.</li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] text-[#10B981] shrink-0 mt-0.5">check_circle</span>Collaboration tools for mentorship and live projects.</li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] text-[#10B981] shrink-0 mt-0.5">check_circle</span>Integration with institutional databases & certification.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="w-full bg-[#FAFAF7] py-28 border-b border-[#E5E7EB]" id="how-it-works">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="text-center max-w-3xl mx-auto mb-20">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#2563EB] block mb-2">Connected Methodology</span>
                <h2 className="font-serif text-[42px] font-bold text-[#111827] tracking-tight mb-3">The SkillBridge Lifecycle</h2>
                <p className="text-[18px] text-[#4B5563]">Supporting the complete lifecycle of skill development, internships, and placements.</p>
              </div>
              <div className="relative w-full">
                <div className="hidden lg:block absolute top-7 left-12 right-12 h-[2.5px] bg-gradient-to-r from-[#2563EB] via-[#2563EB] to-[#111827] z-0"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
                  {[
                    {n:"01",tag:"Baseline",title:"Assess",desc:"Students complete industry-shared questionnaires to evaluate technical and soft skills.",dark:false},
                    {n:"02",tag:"Diagnostics",title:"Map",desc:"System identifies strengths, pinpoints skill gaps, and maps to industry requirements.",dark:false},
                    {n:"03",tag:"Roadmap",title:"Develop",desc:"Students undertake personalized learning, industry training, and certification programs.",dark:false},
                    {n:"04",tag:"Pipeline",title:"Connect",desc:"Seamless matching of verified profiles to internships, apprenticeships, and jobs.",dark:false},
                    {n:"05",tag:"Outcomes",title:"Progress",desc:"Institutions and industries monitor outcomes through comprehensive analytics dashboards.",dark:true},
                  ].map((s) => (
                    <div key={s.n} className="flex flex-col items-center lg:items-start text-center lg:text-left group">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-serif text-[24px] font-bold mb-6 shadow-sm transition-colors ${s.dark ? "bg-[#111827] border-[2.5px] border-[#111827] text-white" : "bg-white border-[2.5px] border-[#2563EB] text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white"}`}>
                        {s.n}
                      </div>
                      <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${s.dark ? "bg-[#0F766E]/10 text-[#0F766E]" : "bg-[#EEF4FF] text-[#2563EB]"}`}>{s.tag}</div>
                      <h4 className="text-[18px] font-bold text-[#111827] mb-2">{s.title}</h4>
                      <p className="text-[13.5px] text-[#4B5563] leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* WHO IT'S FOR */}
          <section className="w-full bg-[#111827] text-white py-28 border-b border-[#1F2937]" id="who-its-for">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="text-center max-w-3xl mx-auto mb-20">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#0F766E] block mb-2">A Unified Ecosystem</span>
                <h2 className="font-serif text-[42px] font-bold text-white tracking-tight mb-3">One Platform, Four Stakeholders</h2>
                <p className="text-[18px] text-[#9CA3AF]">A centralized Academia-Industry Collaboration Portal serving the entire talent pipeline.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Students */}
                <div className="bg-[#1F2937] p-8 rounded-2xl border border-[#374151]" id="students">
                  <div className="text-[#60A5FA] mb-4"><span className="material-symbols-outlined text-[32px]">school</span></div>
                  <h3 className="text-[20px] font-bold text-white mb-3">Students & Graduates</h3>
                  <p className="text-[15px] text-[#9CA3AF] leading-relaxed">Search, apply, and track internship and placement opportunities through a single platform. Maintain a digital portfolio containing verified skills, certifications, projects, internships, and achievements to improve employability.</p>
                </div>
                {/* Industry */}
                <div className="bg-[#1F2937] p-8 rounded-2xl border border-[#374151]" id="industry">
                  <div className="text-[#60A5FA] mb-4"><span className="material-symbols-outlined text-[32px]">domain</span></div>
                  <h3 className="text-[20px] font-bold text-white mb-3">Industry & Recruiters</h3>
                  <p className="text-[15px] text-[#9CA3AF] leading-relaxed">Post internships, projects, apprenticeships, and entry-level job openings. Publish training programs, certification courses, and mentorship initiatives to help students acquire in-demand skills before applying.</p>
                </div>
                {/* Academicians */}
                <div className="bg-[#1F2937] p-8 rounded-2xl border border-[#374151]" id="academicians">
                  <div className="text-[#60A5FA] mb-4"><span className="material-symbols-outlined text-[32px]">local_library</span></div>
                  <h3 className="text-[20px] font-bold text-white mb-3">Academicians & Faculty</h3>
                  <p className="text-[15px] text-[#9CA3AF] leading-relaxed">A dedicated portal to explore faculty internships, industrial training, Faculty Development Programs (FDPs), consultancy opportunities, and collaborative research projects.</p>
                </div>
                {/* Institutions */}
                <div className="bg-[#1F2937] p-8 rounded-2xl border border-[#374151]" id="institutions">
                  <div className="text-[#60A5FA] mb-4"><span className="material-symbols-outlined text-[32px]">account_balance</span></div>
                  <h3 className="text-[20px] font-bold text-white mb-3">Institutions & TPOs</h3>
                  <p className="text-[15px] text-[#9CA3AF] leading-relaxed">Monitor student skill development, internship participation, and placement progress through comprehensive dashboards and analytics to support data-driven decisions.</p>
                </div>
              </div>
            </div>
          </section>

          {/* OPPORTUNITIES */}
          <section className="w-full bg-white py-28 border-b border-[#E5E7EB]" id="opportunities">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#2563EB] block mb-2">Collaboration</span>
                <h2 className="font-serif text-[42px] font-bold text-[#111827] tracking-tight mb-3">Endless Opportunities</h2>
                <p className="text-[18px] text-[#4B5563]">Facilitating robust industry-academia collaboration across multiple avenues.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                {["Internships & Apprenticeships", "Entry-Level Jobs", "Live Industry Projects", "Innovation Challenges", "Mentorship Programs", "Workshops & Guest Lectures", "Faculty Development Programs (FDPs)", "Industrial Training", "Collaborative Research", "Consultancy"].map(opp => (
                  <div key={opp} className="px-6 py-3 bg-[#FAFAF7] border border-[#E5E7EB] rounded-full text-[15px] font-medium text-[#111827] shadow-sm hover:border-[#2563EB] hover:text-[#2563EB] transition-colors cursor-default">
                    {opp}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* INDUSTRY DARK SECTION */}
          <section className="w-full bg-[#111827] text-white py-28" id="telemetry">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="max-w-3xl mb-14">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#0F766E] block mb-2">Corporate Recruiter Telemetry</span>
                <h2 className="font-serif text-[42px] text-white font-bold tracking-tight mb-3">Hire for What People Can Actually Do.</h2>
                <p className="text-[17px] text-[#9CA3AF] leading-relaxed">Move beyond static, unverified resumes with objective competency benchmarking, code-level telemetry, and peer evaluations.</p>
              </div>
              <div className="bg-[#1F2937] border border-[#374151] rounded-2xl p-7 lg:p-9 shadow-2xl dark-technical-grid">
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#374151] gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#60A5FA] text-xs font-mono font-semibold">Requisition #ENG-904</span>
                      <h3 className="font-serif text-[22px] font-bold text-white">Target Role: Senior Data Analyst</h3>
                    </div>
                    <span className="text-[13px] text-[#9CA3AF] mt-1 block">8 Candidates matched across National Registry rubric</span>
                  </div>
                </div>
                <div className="divide-y divide-[#374151] my-2">
                  {[
                    {init:"RK",college:"IIT Kharagpur",match:"91%",matchColor:"#60A5FA"},
                    {init:"AM",college:"IIT Delhi",match:"87%",matchColor:"#2563EB"},
                    {init:"SN",college:"BITS Pilani",match:"82%",matchColor:"#93C5FD"},
                  ].map((c) => (
                    <div key={c.init} className="py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-white/[0.02] transition-colors rounded-lg px-2">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#2563EB]/20 border border-[#2563EB]/50 flex items-center justify-center font-bold text-[#60A5FA] text-base shrink-0">{c.init}</div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-[16px] text-white">Candidate #SB-{c.init}21</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#064E3B] text-[#6EE7B7]">Audited</span>
                            <span className="text-xs text-[#9CA3AF]">{c.college}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">Role Match</span>
                          <span className="font-serif text-[24px] font-bold" style={{color:c.matchColor}}>{c.match}</span>
                        </div>
                        <button className="text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] transition-all">Source Candidate</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-[#374151] flex items-center justify-between text-xs text-[#9CA3AF]">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#10B981]">verified_user</span>
                    All telemetry benchmarked against AICTE Industry Competency Rubric
                  </span>
                  <span>Showing 3 of 8 qualified candidates</span>
                </div>
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="w-full bg-[#111827] py-28" id="get-started">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="bg-[#1F2937] border border-[#374151] rounded-3xl p-10 md:p-16 text-center max-w-4xl mx-auto shadow-2xl">
                <span className="text-xs font-semibold uppercase tracking-widest block mb-3 text-[#2563EB]">National Education & Career Consortium</span>
                <h2 className="font-serif text-[40px] md:text-[50px] font-bold text-white tracking-tight mb-4 leading-tight">Build Skills That Create Real Opportunities.</h2>
                <p className="text-[17px] text-[#9CA3AF] max-w-2xl mx-auto mb-10 leading-relaxed">Whether you are learning, hiring, teaching, or stewarding institutional governance, SkillBridge connects the national talent ecosystem with unyielding rigor.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/role" className="inline-flex items-center gap-2 text-white text-[15px] font-semibold px-8 py-3.5 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] transition-all">
                    Get Started Now <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                  <Link href="/demo" className="inline-flex items-center gap-2 bg-transparent text-white border border-[#4B5563] text-[15px] font-semibold hover:border-white transition-colors py-3.5 px-7 rounded-lg">
                    Try Demo Mode
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="w-full bg-[#111827] text-white border-t border-[#1F2937] pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[#9CA3AF] text-[14px] pb-8 border-b border-[#374151] mb-8">
              <Image src="/image.png" alt="SkillBridge" width={120} height={32} className="h-7 w-auto object-contain bg-white px-2 py-1 rounded-md"/>
              <p className="text-[14px] text-[#9CA3AF] max-w-sm text-center leading-relaxed">A federated national education and career ecosystem connecting higher institutions and workforce mobility.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[#9CA3AF] text-[14px]">
              <span>2026 SkillBridge National Educational Ecosystem. All rights reserved.</span>
              <div className="flex items-center gap-6 text-[13px] font-medium">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
