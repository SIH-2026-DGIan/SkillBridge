import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      <div className="bg-[#FAFAF7] text-[#111827] antialiased">
        {/* NAVBAR */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E5E7EB]">
          <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="SkillBridge" width={148} height={40} className="h-8 lg:h-9 w-auto object-contain" priority />
            </Link>
            <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-[#111827]">
              <a href="#how-it-works" className="py-2 hover:text-[#2563EB] transition-colors">How It Works</a>
              <a href="#stakeholders" className="py-2 hover:text-[#2563EB] transition-colors">For Students</a>
              <a href="#industry" className="py-2 hover:text-[#2563EB] transition-colors">For Industry</a>
              <a href="#institutions" className="py-2 hover:text-[#2563EB] transition-colors">For Institutions</a>
              <a href="#academicians" className="py-2 hover:text-[#2563EB] transition-colors">For Academicians</a>
            </nav>
            <div className="flex items-center gap-6">
              <Link href="/login" className="hidden sm:inline-block text-[15px] font-medium hover:text-[#2563EB] transition-colors">Sign In</Link>
              <Link href="/signup" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-white px-6 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] transition-all">
                Get Started <span className="material-symbols-outlined text-base leading-none">arrow_forward</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="w-full pt-20">
          {/* HERO */}
          <section className="w-full bg-[#FAFAF7] border-b border-[#E5E7EB] min-h-[84vh] flex items-center py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
                <div className="lg:col-span-6 flex flex-col items-start pr-0 lg:pr-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#EEF4FF] rounded-full mb-6 border border-[#E5E7EB]">
                    <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
                    <span className="text-xs tracking-widest font-semibold uppercase text-[#2563EB]">SKILLS x OPPORTUNITIES x IMPACT</span>
                  </div>
                  <h1 className="font-serif text-[46px] sm:text-[58px] lg:text-[66px] font-bold text-[#111827] tracking-tight leading-[1.08] mb-6">
                    Bridging the Gap Between Learning and the <span className="text-[#2563EB]">Real World</span>
                  </h1>
                  <p className="text-[17px] text-[#4B5563] leading-relaxed max-w-xl mb-8">
                    SkillBridge connects students, industry and academia through verified skill telemetry, objective hiring pathways, and institutional outcome governance.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mb-12">
                    <Link href="/signup" className="inline-flex items-center gap-2.5 text-white text-[15px] font-medium px-7 py-3.5 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] transition-all">
                      Get Started <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </Link>
                    <a href="#how-it-works" className="inline-flex items-center gap-2 bg-white text-[#111827] text-[15px] font-medium px-7 py-3.5 rounded-lg border border-[#111827] hover:bg-gray-50 transition-all shadow-sm">
                      Explore Architecture
                    </a>
                  </div>
                  <div className="w-full pt-8 grid grid-cols-3 divide-x divide-[#E5E7EB] border-t border-[#E5E7EB]">
                    <div className="pr-5">
                      <div className="font-serif text-[40px] font-bold text-[#111827] leading-none">10K<span className="text-[#2563EB]">+</span></div>
                      <div className="text-[13px] text-[#6B7280] font-medium mt-2">Verified Profiles</div>
                    </div>
                    <div className="px-5">
                      <div className="font-serif text-[40px] font-bold text-[#111827] leading-none">500<span className="text-[#2563EB]">+</span></div>
                      <div className="text-[13px] text-[#6B7280] font-medium mt-2">Industry Partners</div>
                    </div>
                    <div className="pl-5">
                      <div className="font-serif text-[40px] font-bold text-[#111827] leading-none">100<span className="text-[#2563EB]">+</span></div>
                      <div className="text-[13px] text-[#6B7280] font-medium mt-2">Academic Deans</div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-6 flex flex-col items-center">
                  <div className="relative w-full rounded-2xl border border-[#E2E8F0] shadow-xl bg-white p-6 technical-grid overflow-hidden">
                    <div className="bg-white/95 border border-[#E5E7EB] rounded-xl p-3 mb-5 shadow-sm">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-2 px-1">
                        <span>National Ecosystem Flow</span>
                        <span className="text-[#2563EB] font-mono">LIVE TELEMETRY</span>
                      </div>
                      <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 text-[12px] font-semibold">
                        <div className="flex items-center gap-1 shrink-0 px-2.5 py-1.5 rounded-md bg-[#EEF4FF] border border-[#2563EB]/20 text-[#2563EB]"><span className="material-symbols-outlined text-[15px]">school</span> Student</div>
                        <span className="material-symbols-outlined text-[#94A3B8] text-[14px]">arrow_forward</span>
                        <div className="flex items-center gap-1 shrink-0 px-2.5 py-1.5 rounded-md bg-[#EEF4FF] border border-[#2563EB]/20 text-[#2563EB]"><span className="material-symbols-outlined text-[15px]">code_blocks</span> Skills</div>
                        <span className="material-symbols-outlined text-[#94A3B8] text-[14px]">arrow_forward</span>
                        <div className="flex items-center gap-1 shrink-0 px-2.5 py-1.5 rounded-md bg-[#111827] text-white"><span className="material-symbols-outlined text-[15px] text-[#F97360]">work</span> Career Role</div>
                        <span className="material-symbols-outlined text-[#94A3B8] text-[14px]">arrow_forward</span>
                        <div className="flex items-center gap-1 shrink-0 px-2.5 py-1.5 rounded-md bg-[#EEF4FF] border border-[#2563EB]/20 text-[#2563EB]"><span className="material-symbols-outlined text-[15px]">domain</span> Industry</div>
                        <span className="material-symbols-outlined text-[#94A3B8] text-[14px]">arrow_forward</span>
                        <div className="flex items-center gap-1 shrink-0 px-2.5 py-1.5 rounded-md bg-[#0F766E]/10 border border-[#0F766E]/20 text-[#0F766E]"><span className="material-symbols-outlined text-[15px]">check_circle</span> Opportunity</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
                      <div className="flex items-start justify-between pb-4 border-b border-[#E5E7EB]">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs">SB</div>
                          <div>
                            <h3 className="text-[16px] font-bold text-[#111827]">Candidate Telemetry</h3>
                            <p className="text-[12px] text-[#6B7280]">Target: <span className="font-semibold text-[#111827]">Data Analyst</span></p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Skill Readiness</span>
                          <div className="font-serif text-[28px] font-bold text-[#2563EB] leading-none">87%</div>
                        </div>
                      </div>
                      <div className="py-3.5 border-b border-[#E5E7EB]">
                        <div className="flex items-center gap-1 mb-2 text-[11px] font-bold uppercase tracking-wider text-[#0F766E]">
                          <span className="material-symbols-outlined text-[14px]">verified</span> Verified Competencies (4 Passed)
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {["Python & Pandas","SQL Query Optimization","Statistics & Hypothesis","Power BI Dashboards"].map((s) => (
                            <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0F766E]/10 border border-[#0F766E]/30 text-[#0F766E] text-xs font-semibold">
                              <span className="material-symbols-outlined text-[13px]">check_circle</span> {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="py-3.5 border-b border-[#E5E7EB]">
                        <div className="flex items-center gap-1 mb-2 text-[11px] font-bold uppercase tracking-wider text-[#F97360]">
                          <span className="material-symbols-outlined text-[14px]">warning</span> Identified Skill Gaps
                        </div>
                        <div className="space-y-2">
                          {[{l:"Advanced SQL & CTE Analytics",d:62,b:38},{l:"Distributed Data Pipelines",d:45,b:55}].map((g) => (
                            <div key={g.l}>
                              <div className="flex justify-between text-[12px] font-medium mb-1">
                                <span className="text-[#111827]">{g.l}</span>
                                <span className="font-bold text-[#F97360]">{g.d}% Deficit</span>
                              </div>
                              <div className="w-full bg-[#F3F4F6] rounded-full h-1.5 overflow-hidden">
                                <div className="bg-[#F97360] h-1.5 rounded-full" style={{width:`${g.b}%`}}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3.5 p-3 rounded-lg bg-[#FAFAF7] border border-[#E5E7EB] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[15px]">flag</span>
                          </span>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] block">Prescribed Next Action</span>
                            <span className="text-[12px] font-semibold text-[#111827]">Complete SQL Analytics Module & Apache Spark Pipeline</span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[#2563EB] text-[18px]">arrow_circle_right</span>
                      </div>
                    </div>
                    <div className="mt-3 text-right pr-2">
                      <span className="font-script text-[20px] text-[#6B7280]">Precision telemetry. No subjective friction.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="w-full bg-[#FAFAF7] py-28 border-b border-[#E5E7EB]" id="how-it-works">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="text-center max-w-3xl mx-auto mb-20">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#2563EB] block mb-2">Connected Methodology</span>
                <h2 className="font-serif text-[42px] font-bold text-[#111827] tracking-tight mb-3">From Skill Gap to Career Opportunity</h2>
                <p className="text-[18px] text-[#4B5563]">Moving systematically from diagnostic baseline to verified industry deployment.</p>
              </div>
              <div className="relative w-full">
                <div className="hidden lg:block absolute top-7 left-12 right-12 h-[2.5px] bg-gradient-to-r from-[#2563EB] via-[#2563EB] to-[#111827] z-0"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
                  {[
                    {n:"01",tag:"Baseline",title:"Assess",desc:"Diagnostic skill evaluation benchmarking individual candidates against live job frameworks.",dark:false},
                    {n:"02",tag:"Diagnostics",title:"Identify",desc:"Algorithmic pinpointing of operational curriculum deficits, missing prerequisites, and skill mismatches.",dark:false},
                    {n:"03",tag:"Roadmap",title:"Develop",desc:"Modular learning pathways with industry-vetted capstone projects and guided institutional faculty mentorship.",dark:false},
                    {n:"04",tag:"Pipeline",title:"Connect",desc:"Direct match of verified candidate telemetry to active enterprise job openings and verified requisition queues.",dark:false},
                    {n:"05",tag:"Outcomes",title:"Progress",desc:"Longitudinal career trajectory tracking and accredited institutional placement compliance records.",dark:true},
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

          {/* INDUSTRY DARK SECTION */}
          <section className="w-full bg-[#111827] text-white py-28" id="industry">
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
                  <Link href="/signup" className="inline-flex items-center gap-2 text-white text-[15px] font-semibold px-8 py-3.5 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] transition-all">
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
              <Image src="/logo.png" alt="SkillBridge" width={120} height={32} className="h-7 w-auto object-contain bg-white px-2 py-1 rounded-md"/>
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
