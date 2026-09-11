'use client';

import { useState } from 'react';
import {
  Users,
  Star,
  Calendar,
  Clock,
  CheckCircle2,
  Mic,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Sparkles,
  Video,
  MapPin,
  Send,
  GraduationCap,
} from 'lucide-react';

/* ─────────────────────────── MOCK DATA ─────────────────────────── */

interface Mentee {
  id: string;
  name: string;
  initials: string;
  degree: string;
  branch: string;
  year: string;
  college: string;
  targetRole: string;
  skills: string[];
  sessionCount: number;
  progress: number; // 0–100
  lastSession: string;
  status: 'active' | 'inactive' | 'completed';
  avatarColor: string;
}

const MENTEES: Mentee[] = [
  {
    id: 'm1',
    name: 'Arav Gupta',
    initials: 'AG',
    degree: 'B.Tech',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    college: 'Dronacharya Group of Institutions',
    targetRole: 'Machine Learning Engineer',
    skills: ['Python', 'TensorFlow', 'Data Structures'],
    sessionCount: 6,
    progress: 72,
    lastSession: 'Sep 4, 2026',
    status: 'active',
    avatarColor: 'from-[#4F46E5] to-[#7C3AED]',
  },
  {
    id: 'm2',
    name: 'Priya Sharma',
    initials: 'PS',
    degree: 'B.Tech',
    branch: 'Electronics & Communication',
    year: '4th Year',
    college: 'NIT Kurukshetra',
    targetRole: 'Embedded Systems Engineer',
    skills: ['VLSI Design', 'C++', 'MATLAB'],
    sessionCount: 4,
    progress: 55,
    lastSession: 'Aug 28, 2026',
    status: 'active',
    avatarColor: 'from-pink-500 to-rose-600',
  },
  {
    id: 'm3',
    name: 'Rohan Verma',
    initials: 'RV',
    degree: 'M.Tech',
    branch: 'Artificial Intelligence',
    year: '1st Year',
    college: 'IIT Delhi',
    targetRole: 'AI Research Scientist',
    skills: ['PyTorch', 'NLP', 'Research Methods'],
    sessionCount: 3,
    progress: 38,
    lastSession: 'Sep 1, 2026',
    status: 'active',
    avatarColor: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'm4',
    name: 'Sneha Patel',
    initials: 'SP',
    degree: 'B.Tech',
    branch: 'Information Technology',
    year: '4th Year',
    college: 'NSUT Delhi',
    targetRole: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'MongoDB'],
    sessionCount: 8,
    progress: 90,
    lastSession: 'Sep 6, 2026',
    status: 'completed',
    avatarColor: 'from-orange-500 to-amber-600',
  },
];

interface Workshop {
  id: string;
  title: string;
  type: 'workshop' | 'guest-lecture' | 'seminar';
  organizer: string;
  institution: string;
  date: string;
  duration: string;
  mode: 'online' | 'offline' | 'hybrid';
  location: string;
  audience: string;
  spots: number;
  filled: number;
  stipend?: string;
  topics: string[];
  registered: boolean;
}

const WORKSHOPS_INIT: Workshop[] = [
  {
    id: 'w1',
    title: 'AI Ethics & Responsible ML — Guest Lecture Series',
    type: 'guest-lecture',
    organizer: 'AICTE Innovation Cell',
    institution: 'IIT Bombay',
    date: 'Oct 12, 2026',
    duration: '3 Hours',
    mode: 'hybrid',
    location: 'Mumbai + Zoom',
    audience: 'B.Tech / M.Tech Final Year Students',
    spots: 200,
    filled: 143,
    stipend: '₹8,000 Honorarium',
    topics: ['Bias in AI', 'Fairness Metrics', 'Ethical Deployment'],
    registered: false,
  },
  {
    id: 'w2',
    title: 'Advanced Deep Learning Workshop — 2-Day Bootcamp',
    type: 'workshop',
    organizer: 'DST-SERB & IIT Madras',
    institution: 'IIT Madras',
    date: 'Oct 20–21, 2026',
    duration: '2 Days (12 hrs)',
    mode: 'offline',
    location: 'Chennai',
    audience: 'Final Year B.Tech + M.Tech Students',
    spots: 80,
    filled: 61,
    stipend: '₹15,000 + TA/DA',
    topics: ['Transformers', 'Computer Vision', 'Model Deployment'],
    registered: true,
  },
  {
    id: 'w3',
    title: 'Entrepreneurship & Startup Ecosystem — Industry Seminar',
    type: 'seminar',
    organizer: 'Startup India & NIT Warangal',
    institution: 'NIT Warangal',
    date: 'Nov 3, 2026',
    duration: '4 Hours',
    mode: 'online',
    location: 'Google Meet',
    audience: 'All Engineering Students',
    spots: 500,
    filled: 312,
    topics: ['Ideation', 'Funding Landscape', 'MVP Building'],
    registered: false,
  },
  {
    id: 'w4',
    title: 'Quantum Computing Fundamentals — Guest Lecture',
    type: 'guest-lecture',
    organizer: 'IEEE Delhi Chapter',
    institution: 'Delhi Technological University',
    date: 'Nov 15, 2026',
    duration: '2 Hours',
    mode: 'hybrid',
    location: 'DTU Delhi + Online',
    audience: 'B.Tech ECE / CS Students',
    spots: 300,
    filled: 89,
    stipend: '₹5,000 Honorarium',
    topics: ['Qubits', 'Quantum Gates', 'Quantum Algorithms'],
    registered: false,
  },
];

interface SessionHistory {
  id: string;
  menteeName: string;
  date: string;
  duration: string;
  topics: string[];
  outcome: string;
  rating: number;
}

const SESSION_HISTORY: SessionHistory[] = [
  {
    id: 's1',
    menteeName: 'Arav Gupta',
    date: 'Sep 4, 2026',
    duration: '45 min',
    topics: ['Deep Learning Project Review', 'Research Paper Discussion'],
    outcome: 'Guided on CNN architecture optimisation for final year project',
    rating: 5,
  },
  {
    id: 's2',
    menteeName: 'Sneha Patel',
    date: 'Sep 6, 2026',
    duration: '60 min',
    topics: ['Career Planning', 'Full Stack Portfolio Review'],
    outcome: 'Reviewed 3 portfolio projects, suggested improvements for job applications',
    rating: 5,
  },
  {
    id: 's3',
    menteeName: 'Priya Sharma',
    date: 'Aug 28, 2026',
    duration: '30 min',
    topics: ['VLSI Project Guidance', 'Industry Exposure'],
    outcome: 'Discussed embedded systems career path; shared industry contacts',
    rating: 4,
  },
  {
    id: 's4',
    menteeName: 'Rohan Verma',
    date: 'Sep 1, 2026',
    duration: '50 min',
    topics: ['Research Methodology', 'NLP Paper Writing'],
    outcome: 'Provided feedback on research draft; suggested 2 relevant IEEE papers',
    rating: 5,
  },
  {
    id: 's5',
    menteeName: 'Arav Gupta',
    date: 'Aug 20, 2026',
    duration: '40 min',
    topics: ['TensorFlow Tutorial', 'Dataset Preparation'],
    outcome: 'Walkthrough of dataset cleaning pipeline for capstone project',
    rating: 4,
  },
];

/* ─────────────────────────── SUBCOMPONENTS ─────────────────────── */

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-50 text-slate-500 border-slate-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
};

function MenteeCard({
  mentee,
  onFeedback,
}: {
  mentee: Mentee;
  onFeedback: (m: Mentee) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${mentee.avatarColor} flex items-center justify-center text-white font-black text-sm shadow-md flex-shrink-0 ring-2 ring-white`}
          >
            {mentee.initials}
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm leading-tight">{mentee.name}</h4>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
              {mentee.year} · {mentee.degree}
            </p>
            <p className="text-[11px] font-medium text-slate-400">{mentee.college}</p>
          </div>
        </div>
        <span
          className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${statusStyles[mentee.status]} capitalize`}
        >
          {mentee.status}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-extrabold text-slate-600">Progress</span>
          <span className="text-[11px] font-black text-[#4F46E5]">{mentee.progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full transition-all duration-700"
            style={{ width: `${mentee.progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {mentee.skills.map((s) => (
          <span
            key={s}
            className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-lg"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {mentee.sessionCount} sessions · Last: {mentee.lastSession}
        </div>
        <button
          onClick={() => onFeedback(mentee)}
          className="text-[11px] font-extrabold px-3 py-1.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all"
        >
          Give Feedback
        </button>
      </div>
    </div>
  );
}

type FeedbackForm = {
  rating: number;
  strengths: string;
  improvements: string;
  nextSteps: string;
  recommend: boolean;
};

function FeedbackModal({
  mentee,
  onClose,
}: {
  mentee: Mentee;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FeedbackForm>({
    rating: 5,
    strengths: '',
    improvements: '',
    nextSteps: '',
    recommend: true,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Feedback Submitted!</h3>
          <p className="text-sm text-slate-500 mb-6">
            Your feedback for <strong>{mentee.name}</strong> has been recorded and shared.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-black rounded-2xl hover:shadow-lg transition-all"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl my-4">
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${mentee.avatarColor} flex items-center justify-center text-white font-black text-xs flex-shrink-0`}
          >
            {mentee.initials}
          </div>
          <div>
            <h3 className="font-black text-slate-900">Mentorship Feedback</h3>
            <p className="text-xs text-slate-500">{mentee.name} · {mentee.branch}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-slate-400 hover:text-slate-600 font-bold text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="text-xs font-extrabold text-slate-700 mb-2 block">
              Overall Progress Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm({ ...form, rating: n })}
                  className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${form.rating >= n
                    ? 'bg-amber-400 text-white shadow-md'
                    : 'bg-slate-100 text-slate-400 hover:bg-amber-50'
                    }`}
                >
                  <Star className={`w-4 h-4 mx-auto ${form.rating >= n ? 'fill-white' : ''}`} />
                </button>
              ))}
              <span className="ml-2 text-sm font-extrabold text-amber-600 self-center">
                {form.rating}/5
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-extrabold text-slate-700 mb-1.5 block">
              Key Strengths Observed
            </label>
            <textarea
              required
              rows={2}
              value={form.strengths}
              onChange={(e) => setForm({ ...form, strengths: e.target.value })}
              className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-none transition-all placeholder:text-slate-300"
              placeholder="e.g. Strong grasp of ML fundamentals, proactive in seeking help..."
            />
          </div>

          <div>
            <label className="text-xs font-extrabold text-slate-700 mb-1.5 block">
              Areas for Improvement
            </label>
            <textarea
              required
              rows={2}
              value={form.improvements}
              onChange={(e) => setForm({ ...form, improvements: e.target.value })}
              className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-none transition-all placeholder:text-slate-300"
              placeholder="e.g. Needs to practise LeetCode regularly, improve written communication..."
            />
          </div>

          <div>
            <label className="text-xs font-extrabold text-slate-700 mb-1.5 block">
              Recommended Next Steps
            </label>
            <textarea
              required
              rows={2}
              value={form.nextSteps}
              onChange={(e) => setForm({ ...form, nextSteps: e.target.value })}
              className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-none transition-all placeholder:text-slate-300"
              placeholder="e.g. Complete Kaggle project, apply to internship at Infosys..."
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <input
              type="checkbox"
              id="recommend"
              checked={form.recommend}
              onChange={(e) => setForm({ ...form, recommend: e.target.checked })}
              className="w-4 h-4 rounded accent-emerald-600"
            />
            <label htmlFor="recommend" className="text-xs font-extrabold text-emerald-800">
              I recommend this student for internship / placement opportunities
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold text-sm rounded-2xl hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-black text-sm rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const workshopTypeStyles: Record<string, string> = {
  'guest-lecture': 'bg-violet-50 text-violet-700 border-violet-200',
  workshop: 'bg-blue-50 text-blue-700 border-blue-200',
  seminar: 'bg-orange-50 text-orange-700 border-orange-200',
};

const workshopTypeLabel: Record<string, string> = {
  'guest-lecture': 'Guest Lecture',
  workshop: 'Workshop',
  seminar: 'Seminar',
};

const modeStyles: Record<string, string> = {
  online: 'text-emerald-600',
  offline: 'text-blue-600',
  hybrid: 'text-violet-600',
};

function WorkshopCard({
  ws,
  onRegister,
}: {
  ws: Workshop;
  onRegister: (id: string) => void;
}) {
  const fillPct = Math.round((ws.filled / ws.spots) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${workshopTypeStyles[ws.type]}`}
            >
              {workshopTypeLabel[ws.type]}
            </span>
            <span className={`text-[10px] font-extrabold ${modeStyles[ws.mode]} flex items-center gap-1`}>
              {ws.mode === 'online' ? (
                <Video className="w-3 h-3" />
              ) : (
                <MapPin className="w-3 h-3" />
              )}
              {ws.mode.charAt(0).toUpperCase() + ws.mode.slice(1)}
            </span>
          </div>
          <h4 className="font-black text-slate-900 text-sm leading-snug">{ws.title}</h4>
          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{ws.organizer}</p>
        </div>
        {ws.stipend && (
          <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-xl flex-shrink-0">
            {ws.stipend}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-[11px] text-slate-500 font-semibold">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-slate-400 flex-shrink-0" /> {ws.date}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" /> {ws.duration}
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" /> {ws.location}
        </div>
        <div className="flex items-center gap-1">
          <GraduationCap className="w-3 h-3 text-slate-400 flex-shrink-0" /> {ws.audience}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {ws.topics.map((t) => (
          <span
            key={t}
            className="text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-lg"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Seat fill bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] font-extrabold text-slate-500 mb-1">
          <span>{ws.filled} registered</span>
          <span>{ws.spots - ws.filled} seats left</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${fillPct > 80 ? 'bg-rose-500' : 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]'}`}
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => onRegister(ws.id)}
        className={`w-full py-2.5 font-black text-xs rounded-xl transition-all ${ws.registered
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
          : 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-md hover:shadow-lg hover:scale-[1.02]'
          }`}
      >
        {ws.registered ? '✓ Registered to Conduct — Click to Withdraw' : 'Register to Conduct'}
      </button>
    </div>
  );
}

/* ─────────────────────────── MAIN PAGE ─────────────────────────── */

type Tab = 'mentees' | 'workshops' | 'history';

export default function MentorshipPage() {
  const [activeTab, setActiveTab] = useState<string>('mentees');
  const [feedbackMentee, setFeedbackMentee] = useState<Mentee | null>(null);
  const [workshops, setWorkshops] = useState<Workshop[]>(WORKSHOPS_INIT);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  const handleRegister = (id: string) => {
    setWorkshops((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, registered: !w.registered, filled: w.registered ? w.filled - 1 : w.filled + 1 }
          : w
      )
    );
  };

  const activeMentees = MENTEES.filter((m) => m.status === 'active');
  const completedMentees = MENTEES.filter((m) => m.status === 'completed');
  const avgProgress = Math.round(MENTEES.reduce((a, m) => a + m.progress, 0) / MENTEES.length);
  const registeredCount = workshops.filter((w) => w.registered).length;

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'mentees', label: 'Student Mentees', icon: Users },
    { key: 'workshops', label: 'Workshops & Lectures', icon: Mic },
    { key: 'history', label: 'Session History', icon: Clock },
  ];

  return (
    <>
      {feedbackMentee && (
        <FeedbackModal mentee={feedbackMentee} onClose={() => setFeedbackMentee(null)} />
      )}

      <div className="space-y-6 max-w-6xl mx-auto">
        {/* ── Hero Header ── */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white shadow-xl bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#0F172A] text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-black tracking-wider text-cyan-300 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Mentorship &amp; Outreach Hub
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                Mentorship Programs
              </h1>
              <p className="text-indigo-200 text-xs sm:text-sm font-medium mt-1">
                Guide students, facilitate workshops &amp; contribute to the academic community
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-black text-xs rounded-2xl border border-white/20 transition-all">
                <PlusCircle className="w-4 h-4" /> Add Mentee
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-black text-xs rounded-2xl shadow-lg transition-all">
                <Mic className="w-4 h-4" /> Propose Lecture
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Users,
              label: 'Active Mentees',
              value: activeMentees.length,
              sub: `${completedMentees.length} completed`,
              color: 'from-[#4F46E5] to-[#7C3AED]',
            },
            {
              icon: TrendingUp,
              label: 'Avg. Progress',
              value: `${avgProgress}%`,
              sub: 'Across all mentees',
              color: 'from-emerald-500 to-teal-600',
            },
            {
              icon: Clock,
              label: 'Total Sessions',
              value: SESSION_HISTORY.length,
              sub: 'This semester',
              color: 'from-blue-500 to-indigo-600',
            },
            {
              icon: Mic,
              label: 'Events Registered',
              value: registeredCount,
              sub: `${workshops.length - registeredCount} available`,
              color: 'from-orange-500 to-amber-600',
            },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-3xl p-5 border border-white shadow-md bg-white">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-md mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
              <div className="text-xs font-extrabold text-slate-700 mt-0.5">{stat.label}</div>
              <div className="text-[11px] font-semibold text-slate-400 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-100">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(String(tab.key))}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-extrabold transition-all ${activeTab === tab.key
                  ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-inner'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {/* ── MENTEES TAB ── */}
            {activeTab === 'mentees' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-slate-700">
                    {MENTEES.length} Assigned Mentees
                  </p>
                  <span className="text-[11px] font-bold text-slate-400">
                    Click &quot;Give Feedback&quot; to submit mentor report
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {MENTEES.map((m) => (
                    <MenteeCard key={m.id} mentee={m} onFeedback={setFeedbackMentee} />
                  ))}
                </div>
              </div>
            )}

            {/* ── WORKSHOPS TAB ── */}
            {activeTab === 'workshops' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-slate-700">
                    Upcoming Workshops, Guest Lectures &amp; Seminars
                  </p>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    {workshops.filter((w) => w.registered).length} Registered
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {workshops.map((ws) => (
                    <WorkshopCard key={ws.id} ws={ws} onRegister={handleRegister} />
                  ))}
                </div>
              </div>
            )}

            {/* ── HISTORY TAB ── */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                <p className="text-sm font-extrabold text-slate-700">
                  Mentorship Session History ({SESSION_HISTORY.length} sessions)
                </p>
                {SESSION_HISTORY.map((sess) => {
                  const isExpanded = expandedSession === sess.id;
                  return (
                    <div
                      key={sess.id}
                      className="border border-slate-200/80 rounded-2xl overflow-hidden hover:border-indigo-200 transition-colors"
                    >
                      <button
                        className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors text-left"
                        onClick={() => setExpandedSession(isExpanded ? null : sess.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white flex-shrink-0">
                            <Video className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-slate-900 text-sm">
                                {sess.menteeName}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                                {sess.duration}
                              </span>
                            </div>
                            <div className="text-[11px] font-semibold text-slate-400 mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {sess.date}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="hidden sm:flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Star
                                key={n}
                                className={`w-3.5 h-3.5 ${n <= sess.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                              />
                            ))}
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 bg-slate-50/60 border-t border-slate-100 space-y-3">
                          <div>
                            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide">
                              Topics Covered
                            </span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {sess.topics.map((t) => (
                                <span
                                  key={t}
                                  className="text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 rounded-lg"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide">
                              Session Outcome
                            </span>
                            <p className="text-sm text-slate-700 font-medium mt-1 leading-relaxed">
                              {sess.outcome}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            Feedback Rating: {sess.rating}/5
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
