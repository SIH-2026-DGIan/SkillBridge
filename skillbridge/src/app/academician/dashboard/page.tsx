'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  ExternalLink,
  MessageSquare,
  Eye,
  Calendar,
  ArrowRight,
  Search,
  Bell,
  User,
  CheckCircle2,
  Clock3,
  BookOpen,
  Award,
  Users,
  IndianRupee,
  X,
} from 'lucide-react';

import { getSession, UserSession } from '@/lib/user-session';

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
    id: 'STU-1024',
    name: 'Priya Sharma',
    course: 'B.Tech CSE · Final Year',
    project: 'Industry Project — Web Development',
    progress: 78,
    next: 'Review project milestone',
    status: 'On Track',
    avatar:
      'https://ui-avatars.com/api/?name=Priya+Sharma&background=2563EB&color=fff',
  },
  {
    id: 'STU-1088',
    name: 'Rohan Gupta',
    course: 'M.Tech AI & Data Science',
    project: 'Research — LLM Optimization',
    progress: 45,
    next: 'Approve literature review',
    status: 'Needs Attention',
    avatar:
      'https://ui-avatars.com/api/?name=Rohan+Gupta&background=0F766E&color=fff',
  },
  {
    id: 'STU-1142',
    name: 'Ananya Desai',
    course: 'B.Tech IT · 3rd Year',
    project: 'Capstone — Smart IoT Systems',
    progress: 92,
    next: 'Final evaluation',
    status: 'Excellent',
    avatar:
      'https://ui-avatars.com/api/?name=Ananya+Desai&background=F59E0B&color=fff',
  },
];

const GRANTS = [
  {
    title: 'Autonomous Edge Diagnostics for Agricultural Robotics',
    type: 'Industry Research Collaboration',
    matchReason:
      'Matches your interests in AI, robotics and applied machine learning.',
    amount: '₹18.5L',
  },
  {
    title: 'Federated Learning for Privacy-Preserving Healthcare',
    type: 'Govt. Sponsored Research Grant',
    matchReason:
      'Matches your research interests in machine learning and data privacy.',
    amount: '₹24L',
  },
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
  },
];

const ANNOUNCEMENTS = [
  {
    title: 'New Industry Mentorship Program',
    desc: 'Applications open for faculty mentors for the upcoming Spring semester.',
  },
  {
    title: 'Research Collaboration Call',
    desc: 'AI & Smart Manufacturing consortium is looking for principal investigators.',
  },
];

export default function AcademicianDashboard() {
  const [user, setUser] = useState<UserSession>(PLACEHOLDER);
  const [search, setSearch] = useState('');
  const [selectedMentee, setSelectedMentee] = useState<
    (typeof MENTEES)[number] | null
  >(null);
  const [feedbackMentee, setFeedbackMentee] = useState<
    (typeof MENTEES)[number] | null
  >(null);
  const [feedback, setFeedback] = useState('');
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const session = getSession();

      if (session) {
        setUser(session);
      }
    } catch (error) {
      console.error('Unable to load user session:', error);
    }
  }, []);

  const filteredMentees = MENTEES.filter((mentee) => {
    const query = search.toLowerCase();

    return (
      mentee.name.toLowerCase().includes(query) ||
      mentee.course.toLowerCase().includes(query) ||
      mentee.project.toLowerCase().includes(query)
    );
  });

  const showMessage = (text: string) => {
    setMessage(text);

    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const submitFeedback = () => {
    if (!feedback.trim()) {
      showMessage('Please enter feedback before submitting.');
      return;
    }

    showMessage(`Feedback sent to ${feedbackMentee?.name}.`);
    setFeedback('');
    setFeedbackMentee(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Toast */}
      {message && (
        <div className="fixed right-5 top-5 z-[100] flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-xl">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          {message}
        </div>
      )}

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <BookOpen className="h-5 w-5" />
            </div>

            <div>
              <div className="font-bold text-slate-900">AcademicHub</div>
              <div className="text-xs text-slate-500">
                Faculty Workspace
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <button
              onClick={() => showMessage('Dashboard is already active.')}
              className="text-sm font-semibold text-blue-600"
            >
              Dashboard
            </button>

            <button
              onClick={() => showMessage('Mentorship section selected.')}
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Mentorship
            </button>

            <button
              onClick={() => showMessage('Research section selected.')}
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Research
            </button>

            <button
              onClick={() => showMessage('Programs section selected.')}
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Programs
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showMessage('No new notifications.')}
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" />
            </button>

            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 hover:bg-slate-50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <User className="h-4 w-4" />
              </div>

              <div className="hidden text-left sm:block">
                <div className="text-xs font-semibold text-slate-900">
                  {user.name || 'Faculty'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {user.role || 'Academician'}
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] space-y-6 px-5 py-6 lg:px-8">
        {/* Hero */}
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 p-6 text-white shadow-lg lg:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-100">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Faculty workspace active
              </div>

              <h1 className="text-2xl font-bold lg:text-3xl">
                Welcome back, {user.name || 'Faculty'}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                Manage student mentorship, research collaborations and
                professional development from one workspace.
              </p>

              {user.institutionName && (
                <p className="mt-3 text-xs font-medium text-blue-200">
                  {user.institutionName} · {user.department}
                </p>
              )}
            </div>

            <button
              onClick={() => setShowResearchModal(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-md transition hover:bg-blue-50"
            >
              <Plus className="h-4 w-4" />
              Propose Research Project
            </button>
          </div>
        </section>

        {/* Search */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Faculty & Academician Workspace
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your academic activities, mentorship and opportunities.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mentees..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-emerald-600">
                +3 this month
              </span>
            </div>

            <div className="text-sm font-medium text-slate-500">
              Active Mentees
            </div>
            <div className="mt-1 text-3xl font-bold text-slate-900">18</div>
            <div className="mt-1 text-xs text-slate-500">
              Students currently under mentorship
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-emerald-600">
                Healthy
              </span>
            </div>

            <div className="text-sm font-medium text-slate-500">
              Avg. Mentorship Progress
            </div>
            <div className="mt-1 text-3xl font-bold text-slate-900">
              78.4%
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Across active mentorships
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                <IndianRupee className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                2 active
              </span>
            </div>

            <div className="text-sm font-medium text-slate-500">
              Active Grants
            </div>
            <div className="mt-1 text-3xl font-bold text-slate-900">
              ₹42.5L
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Sponsored research / industry grants
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <Award className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-indigo-600">
                2 upcoming
              </span>
            </div>

            <div className="text-sm font-medium text-slate-500">
              FDP Programs
            </div>
            <div className="mt-1 text-3xl font-bold text-slate-900">5</div>
            <div className="mt-1 text-xs text-slate-500">
              Available/upcoming programs
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">
            {/* Mentorship */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Student Mentorships & Programs
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Track your mentees, project progress and milestones.
                  </p>
                </div>

                <button
                  onClick={() => showMessage('Showing all 18 mentees.')}
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-6">
                {filteredMentees.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 py-10 text-center">
                    <Search className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      No mentees found.
                    </p>
                  </div>
                ) : (
                  filteredMentees.map((mentee) => (
                    <div
                      key={mentee.id}
                      className="border-b border-slate-200 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <img
                          src={mentee.avatar}
                          alt={mentee.name}
                          className="h-12 w-12 rounded-full"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col justify-between gap-3 sm:flex-row">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-slate-900">
                                  {mentee.name}
                                </h3>

                                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                                  {mentee.id}
                                </span>
                              </div>

                              <div className="mt-1 text-sm text-slate-500">
                                {mentee.course}
                              </div>

                              <div className="mt-1 text-sm font-medium text-slate-900">
                                {mentee.project}
                              </div>
                            </div>

                            <span
                              className={`h-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                                mentee.status === 'Excellent'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : mentee.status === 'Needs Attention'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-blue-50 text-blue-700'
                              }`}
                            >
                              {mentee.status}
                            </span>
                          </div>

                          <div className="mt-4">
                            <div className="mb-1.5 flex justify-between text-xs font-semibold">
                              <span className="text-slate-500">
                                Project Progress
                              </span>
                              <span className="text-emerald-600">
                                {mentee.progress}%
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-emerald-500 transition-all"
                                style={{ width: `${mentee.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-2 text-sm">
                            <Clock3 className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-500">
                              Next milestone:
                            </span>
                            <span className="font-medium text-slate-900">
                              {mentee.next}
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              onClick={() => setSelectedMentee(mentee)}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </button>

                            <button
                              onClick={() => setFeedbackMentee(mentee)}
                              className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                            >
                              <MessageSquare className="h-4 w-4" />
                              Give Feedback
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => showMessage('Loading all 18 mentees...')}
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
              >
                View all 18 mentees
                <ArrowRight className="h-4 w-4" />
              </button>
            </section>

            {/* Grants */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Sponsored Research & Industry Grants
              </h2>

              <p className="mt-1 mb-6 text-sm text-slate-500">
                Research opportunities relevant to your expertise.
              </p>

              <div className="space-y-4">
                {GRANTS.map((grant) => (
                  <div
                    key={grant.title}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:shadow-sm"
                  >
                    <div className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-600">
                      {grant.type}
                    </div>

                    <div className="flex flex-col justify-between gap-3 sm:flex-row">
                      <h3 className="max-w-2xl text-base font-bold leading-snug text-slate-900">
                        {grant.title}
                      </h3>

                      <span className="whitespace-nowrap text-sm font-bold text-emerald-600">
                        {grant.amount}
                      </span>
                    </div>

                    <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
                      <div className="mb-1 text-xs font-bold uppercase text-slate-500">
                        Why it matches you
                      </div>

                      <div className="text-sm text-slate-700">
                        {grant.matchReason}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() =>
                          showMessage(`Opening ${grant.title} details.`)
                        }
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        View Details
                      </button>

                      <button
                        onClick={() =>
                          showMessage('Proposal application started.')
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Submit Proposal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* Academic Focus */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Your Academic Focus
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Your current expertise profile
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Expertise
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {[
                      'Computer Science',
                      'Artificial Intelligence',
                      'Data Science',
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Research Interests
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {['Machine Learning', 'Generative AI', 'Data Analytics'].map(
                      (item) => (
                        <span
                          key={item}
                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                        >
                          {item}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Industry Interests
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {[
                      'AI Applications',
                      'Industry 4.0',
                      'Digital Transformation',
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => showMessage('Academic focus editor opened.')}
                className="mt-6 w-full rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Edit Focus
              </button>
            </section>

            {/* FDP */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Faculty Development
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Learn, certify and grow
                  </p>
                </div>

                <Award className="h-5 w-5 text-indigo-500" />
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                <div className="mb-3 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                  UPCOMING
                </div>

                <h3 className="text-base font-bold leading-snug text-slate-900">
                  {FDP_UPCOMING.title}
                </h3>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {FDP_UPCOMING.starts}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    {FDP_UPCOMING.duration}
                  </div>

                  <div className="text-xs font-medium text-slate-500">
                    {FDP_UPCOMING.provider}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setRegistered(true);
                    showMessage('Successfully registered for the FDP.');
                  }}
                  disabled={registered}
                  className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-emerald-600"
                >
                  {registered ? 'Registered ✓' : 'Register'}
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {FDP_OTHER.map((fdp) => (
                  <div
                    key={fdp.title}
                    className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {fdp.title}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {fdp.provider} · {fdp.date}
                      </div>
                    </div>

                    <button
                      onClick={() => showMessage(`Opening ${fdp.title}.`)}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Announcements */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Industry / Academia Announcements
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Stay updated with relevant opportunities.
              </p>
            </div>

            <Bell className="hidden h-5 w-5 text-slate-400 sm:block" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {ANNOUNCEMENTS.map((announcement) => (
              <div
                key={announcement.title}
                className="flex items-start justify-between rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-slate-50"
              >
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {announcement.title}
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {announcement.desc}
                  </p>
                </div>

                <button
                  onClick={() =>
                    showMessage(`Opening ${announcement.title}.`)
                  }
                  className="ml-4 shrink-0 text-blue-600"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Mentee Details Modal */}
      {selectedMentee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMentee.avatar}
                  alt={selectedMentee.name}
                  className="h-12 w-12 rounded-full"
                />

                <div>
                  <h3 className="font-bold text-slate-900">
                    {selectedMentee.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedMentee.id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMentee(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="text-xs font-bold uppercase text-slate-400">
                  Course
                </div>
                <div className="mt-1 text-sm font-medium text-slate-800">
                  {selectedMentee.course}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase text-slate-400">
                  Project
                </div>
                <div className="mt-1 text-sm font-medium text-slate-800">
                  {selectedMentee.project}
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-xs font-semibold">
                  <span>Progress</span>
                  <span className="text-emerald-600">
                    {selectedMentee.progress}%
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: `${selectedMentee.progress}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs font-bold uppercase text-slate-400">
                  Next Milestone
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-800">
                  {selectedMentee.next}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedMentee(null)}
              className="mt-6 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackMentee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Give Feedback
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Feedback for {feedbackMentee.name}
                </p>
              </div>

              <button
                onClick={() => setFeedbackMentee(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              placeholder="Write your feedback here..."
              className="mt-5 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setFeedbackMentee(null)}
                className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={submitFeedback}
                className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Research Modal */}
      {showResearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Propose Research / Industry Project
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Start a new collaboration proposal.
                </p>
              </div>

              <button
                onClick={() => setShowResearchModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <input
                placeholder="Project title"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />

              <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500">
                <option>Industry Collaboration</option>
                <option>Sponsored Research</option>
                <option>Student Capstone</option>
                <option>Government Research</option>
              </select>

              <textarea
                rows={4}
                placeholder="Describe your project idea..."
                className="w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowResearchModal(false)}
                className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowResearchModal(false);
                  showMessage('Research proposal saved as draft.');
                }}
                className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Save Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Faculty Profile
              </h3>

              <button
                onClick={() => setShowProfile(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <User className="h-9 w-9" />
              </div>

              <h4 className="mt-4 text-lg font-bold text-slate-900">
                {user.name || 'Faculty'}
              </h4>

              <p className="text-sm text-slate-500">
                {user.email || 'faculty@example.com'}
              </p>

              <div className="mt-5 w-full space-y-3 text-left">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs font-bold uppercase text-slate-400">
                    Department
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-800">
                    {user.department || 'Computer Science'}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs font-bold uppercase text-slate-400">
                    Institution
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-800">
                    {user.institutionName || 'Sample Institution'}
                  </div>
                </div>

                <div className="rounded-xl bg-blue-50 p-4">
                  <div className="text-xs font-bold uppercase text-blue-500">
                    User ID
                  </div>
                  <div className="mt-1 text-sm font-bold text-blue-700">
                    {user.id || 'FACULTY-001'}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowProfile(false)}
              className="mt-6 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
