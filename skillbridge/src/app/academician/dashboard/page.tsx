'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Download,
  ExternalLink,
  MessageSquare,
  Eye,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { getSession, UserSession } from '@/lib/user-session';
import Image from 'next/image';
import Link from 'next/link';

const PLACEHOLDER: UserSession = {
  id: '',
  name: 'Faculty',
  email: '',
  role: 'academician',
  department: 'Computer Science',
  institutionName: 'Sample Institution',
};

const MENTEES = [
  {
    name: 'Priya Sharma',
    course: 'B.Tech CSE · Final Year',
    project: 'Industry Project — Web Development',
    progress: 78,
    next: 'Review project milestone',
    avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=2563EB&color=fff',
  },
  {
    name: 'Rohan Gupta',
    course: 'M.Tech AI & Data Science',
    project: 'Research — LLM Optimization',
    progress: 45,
    next: 'Approve literature review',
    avatar: 'https://ui-avatars.com/api/?name=Rohan+Gupta&background=0F766E&color=fff',
  },
  {
    name: 'Ananya Desai',
    course: 'B.Tech IT · 3rd Year',
    project: 'Capstone — Smart IoT Systems',
    progress: 92,
    next: 'Final evaluation',
    avatar: 'https://ui-avatars.com/api/?name=Ananya+Desai&background=F59E0B&color=fff',
  }
];

const GRANTS = [
  {
    title: 'Autonomous Edge Diagnostics for Agricultural Robotics',
    type: 'Industry Research Collaboration',
    matchReason: 'Matches your interests in AI, robotics and applied machine learning.',
  },
  {
    title: 'Federated Learning for Privacy-Preserving Healthcare',
    type: 'Govt. Sponsored Research Grant',
    matchReason: 'Matches your research interests in machine learning and data privacy.',
  }
];

const FDP_UPCOMING = {
  title: 'Advanced Generative AI Applications in Academia',
  provider: 'AICTE / IIT Bombay',
  starts: '18 Sept',
  duration: '5 Days',
};

const FDP_OTHER = [
  {
    title: 'Pedagogy in the Digital Age',
    provider: 'UGC Sponsored',
    date: 'Oct 5–7',
  },
  {
    title: 'Industry 4.0 Integration for Faculty',
    provider: 'Tech Mahindra',
    date: 'Nov 12',
  }
];

const ANNOUNCEMENTS = [
  {
    title: 'New Industry Mentorship Program',
    desc: 'Applications open for faculty mentors for the upcoming Spring semester.',
  },
  {
    title: 'Research Collaboration Call',
    desc: 'AI & Smart Manufacturing consortium is looking for principal investigators.',
  }
];

export default function AcademicianDashboard() {
  const [user, setUser] = useState<UserSession>(PLACEHOLDER);

  useEffect(() => {
    setUser(getSession());
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* 1. Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Faculty & Academician Workspace</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage student mentorship, industry collaboration, research opportunities and professional development.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-[#2563EB] hover:underline transition-colors px-1">
              Export / View Profile
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Propose Research/Industry Project
            </button>
          </div>
        </div>

        {/* 2. KPI Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <div className="text-sm font-medium text-slate-500 mb-1">Active Mentees</div>
            <div className="text-2xl font-bold text-[#111827]">18</div>
            <div className="text-xs text-slate-500 mt-1">Students currently under mentorship</div>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <div className="text-sm font-medium text-slate-500 mb-1">Avg. Mentorship Progress</div>
            <div className="text-2xl font-bold text-[#111827]">78.4%</div>
            <div className="text-xs text-slate-500 mt-1">Across active mentorships</div>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <div className="text-sm font-medium text-slate-500 mb-1">Active Grants</div>
            <div className="text-2xl font-bold text-[#111827]">₹42.5L</div>
            <div className="text-xs text-slate-500 mt-1">Sponsored research / industry grants</div>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <div className="text-sm font-medium text-slate-500 mb-1">FDP Programs</div>
            <div className="text-2xl font-bold text-[#111827]">5</div>
            <div className="text-xs text-slate-500 mt-1">Available/upcoming programs</div>
          </div>
        </div>

        {/* Desktop 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Student Mentorships */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-[#111827]">Student Mentorships & Programs</h2>
                  <p className="text-sm text-slate-500 mt-1">Track your mentees, project progress and upcoming milestones.</p>
                </div>
                <button className="text-sm font-medium text-[#2563EB] hover:underline">View All</button>
              </div>

              <div className="space-y-6">
                {MENTEES.map((mentee) => (
                  <div key={mentee.name} className="flex flex-col sm:flex-row gap-5 pb-6 border-b border-[#E2E8F0] last:border-0 last:pb-0">
                    <img src={mentee.avatar} alt={mentee.name} className="w-12 h-12 rounded-full flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="w-full">
                          <h3 className="text-base font-semibold text-[#111827]">{mentee.name}</h3>
                          <div className="text-sm text-slate-500 mt-0.5">{mentee.course}</div>
                          <div className="text-sm font-medium text-[#111827] mt-1">{mentee.project}</div>
                          
                          <div className="mt-4 max-w-sm">
                            <div className="flex justify-between text-xs font-medium mb-1.5">
                              <span className="text-slate-600">Progress</span>
                              <span className="text-[#0F766E] font-bold">{mentee.progress}%</span>
                            </div>
                            <div className="w-full bg-[#E2E8F0] rounded-full h-2">
                              <div className="bg-[#0F766E] h-2 rounded-full" style={{ width: `${mentee.progress}%` }}></div>
                            </div>
                          </div>

                          <div className="mt-3 text-sm">
                            <span className="text-slate-500">Next milestone: </span>
                            <span className="font-medium text-[#111827]">{mentee.next}</span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                          <button className="inline-flex justify-center items-center gap-2 px-4 py-2 border border-[#E2E8F0] text-[#111827] text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
                            <Eye className="w-4 h-4" /> View Details
                          </button>
                          <button className="inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#EEF4FF] text-[#2563EB] text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors">
                            <MessageSquare className="w-4 h-4" /> Give Feedback
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-2">
                <button className="text-sm font-semibold text-[#2563EB] hover:underline flex items-center gap-1 transition-colors">
                  View all 18 mentees <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sponsored Research & Industry Grants */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
              <h2 className="text-lg font-bold text-[#111827]">Sponsored Research & Industry Grants</h2>
              <p className="text-sm text-slate-500 mt-1 mb-6">Research and collaboration opportunities relevant to your expertise.</p>

              <div className="space-y-4">
                {GRANTS.map((grant) => (
                  <div key={grant.title} className="p-5 border border-[#E2E8F0] rounded-xl hover:border-blue-200 transition-colors bg-[#F8FAFC]">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{grant.type}</div>
                    <h3 className="text-base font-bold text-[#111827] leading-tight mb-4">{grant.title}</h3>
                    
                    <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] mb-4">
                      <div className="text-xs font-semibold text-slate-500 mb-1">Why it matches you</div>
                      <div className="text-sm text-[#111827]">{grant.matchReason}</div>
                    </div>

                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#111827] text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        Submit Proposal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* Academic Focus */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
              <h2 className="text-lg font-bold text-[#111827] mb-5">Your Academic Focus</h2>

              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Expertise</h3>
                  <ul className="space-y-1">
                    <li className="text-sm text-[#111827]">Computer Science & Engineering</li>
                    <li className="text-sm text-[#111827]">Artificial Intelligence</li>
                    <li className="text-sm text-[#111827]">Data Science</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Research Interests</h3>
                  <ul className="space-y-1">
                    <li className="text-sm text-[#111827]">Machine Learning</li>
                    <li className="text-sm text-[#111827]">Generative AI</li>
                    <li className="text-sm text-[#111827]">Data Analytics</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Industry Interests</h3>
                  <ul className="space-y-1">
                    <li className="text-sm text-[#111827]">AI Applications</li>
                    <li className="text-sm text-[#111827]">Industry 4.0</li>
                    <li className="text-sm text-[#111827]">Digital Transformation</li>
                  </ul>
                </div>
              </div>

              <button className="mt-6 w-full py-2.5 bg-white border border-[#E2E8F0] text-[#111827] text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
                Edit Focus
              </button>
            </div>

            {/* Faculty Development */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-[#111827]">Faculty Development</h2>
                <button className="text-sm font-medium text-[#2563EB] hover:underline">View All</button>
              </div>

              {/* Upcoming Featured */}
              <div className="bg-[#EEF4FF] border border-blue-100 rounded-xl p-5 mb-4">
                <div className="inline-block px-2 py-1 bg-blue-100 text-[#2563EB] text-xs font-bold rounded mb-3">UPCOMING</div>
                <h3 className="text-base font-bold text-[#111827] leading-snug mb-3">
                  {FDP_UPCOMING.title}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> {FDP_UPCOMING.starts}</div>
                  <div className="flex items-center gap-1.5"><span className="w-4 h-4 flex items-center justify-center">⏱</span> {FDP_UPCOMING.duration}</div>
                </div>
                <button className="w-full py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Register
                </button>
              </div>

              {/* Other FDPs */}
              <div className="space-y-3">
                {FDP_OTHER.map((fdp, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-[#E2E8F0] last:border-0 last:pb-0">
                    <div>
                      <div className="text-sm font-semibold text-[#111827]">{fdp.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{fdp.provider} · {fdp.date}</div>
                    </div>
                    <button className="text-[#2563EB] hover:bg-[#EEF4FF] p-1.5 rounded-md transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 3. Announcements (Full width bottom) */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
          <h2 className="text-lg font-bold text-[#111827] mb-4">Industry / Academia Announcements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ANNOUNCEMENTS.map((ann, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 border border-[#E2E8F0] rounded-lg hover:bg-slate-50 transition-colors">
                <div>
                  <h3 className="text-sm font-semibold text-[#111827]">{ann.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{ann.desc}</p>
                </div>
                <button className="flex items-center gap-1 text-[#2563EB] text-sm font-medium hover:underline ml-4 shrink-0">
                  View <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
