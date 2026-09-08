'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Briefcase,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Plus,
  Download,
  Search,
  Sparkles,
  Award,
  ShieldCheck,
  UserPlus,
  Lightbulb,
  FileSpreadsheet,
  Wrench,
  Scale,
  Inbox,
} from 'lucide-react';
import { getSession } from '@/lib/user-session';
import { exportToCSV } from '@/lib/export/csv';

// Standard institutional intelligence workflow stages
const INSTITUTION_JOURNEY = [
  { step: '1. Monitor Batch', done: true, active: false },
  { step: '2. Identify Gaps', done: false, active: true },
  { step: '3. Curriculum Intervention', done: false, active: false },
  { step: '4. Corporate Drives', done: false, active: false },
];

// Accredited engineering disciplines for the campus cohort
const ENGINEERING_BRANCHES = [
  { name: 'Computer Science & Engineering', code: 'CSE', dotColor: 'bg-primary' },
  { name: 'Information Technology', code: 'IT', dotColor: 'bg-primary' },
  { name: 'Electronics & Communication', code: 'ECE', dotColor: 'bg-secondary' },
  { name: 'Electrical Engineering', code: 'EE', dotColor: 'bg-tertiary' },
  { name: 'Mechanical Engineering', code: 'ME', dotColor: 'bg-outline' },
  { name: 'Civil Engineering', code: 'CE', dotColor: 'bg-outline' },
];

export default function InstitutionDashboard() {
  const [session, setSession] = useState<ReturnType<typeof getSession> | null>(null);
  const [filterDepartment, setFilterDepartment] = useState('');


  // Load session only on the client after mount to avoid server/client hydration mismatch.
  // getSession() reads localStorage and document.cookie — both unavailable on the server —
  // so calling it at render time causes React to see different text on server vs client.
  useEffect(() => {
    setSession(getSession());
    // Re-sync if another part of the app updates the session (e.g. persona switch)
    const onUpdate = () => setSession(getSession());
    window.addEventListener('sb_session_updated', onUpdate);
    return () => window.removeEventListener('sb_session_updated', onUpdate);
  }, []);

  const filteredBranches = filterDepartment.trim()
    ? ENGINEERING_BRANCHES.filter(
        (b) =>
          b.name.toLowerCase().includes(filterDepartment.toLowerCase()) ||
          b.code.toLowerCase().includes(filterDepartment.toLowerCase())
      )
    : ENGINEERING_BRANCHES;

  const handleExportDepartments = () => {
    exportToCSV(
      ENGINEERING_BRANCHES.map((b) => ({
        Department: b.name,
        Code: b.code,
        Status: 'Pending Semester Audit Sync',
      })),
      'department-directory'
    );
  };

  // These display values are intentionally '—' before mount so that server HTML
  // and the initial client render are identical (both show '—'). After mount,
  // useEffect sets the real session and React updates the text in one paint.
  const institutionDisplayName = session
    ? session.institutionName || session.college || 'Institution Placement Cell'
    : '—';
  const officerDisplayName = session ? session.name || 'Placement Officer' : '—';
  const studentCountDisplay = session
    ? session.totalBatchSize
      ? session.totalBatchSize.toLocaleString()
      : '—'
    : '—';

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto w-full pb-10">
      {/* 0. Intelligence Stepper Banner */}
      <div className="glass-card rounded-2xl p-4 border border-white/80 shadow-sm bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
              National Placement Intelligence Workflow
            </h2>
          </div>
          <span className="text-xs font-extrabold text-primary bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 self-start sm:self-auto">
            Active: Batch Deficit Mapping &amp; Recruiter Synchronization
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {INSTITUTION_JOURNEY.map((j, idx) => (
            <div
              key={j.step}
              className={`p-2.5 rounded-xl text-center text-xs font-extrabold transition-all ${j.active
                ? 'bg-gradient-to-r from-primary via-indigo-600 to-accent text-white shadow-md shadow-indigo-500/20 ring-2 ring-primary/20'
                : j.done
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-50 text-slate-400 border border-slate-200/80'
                }`}
            >
              <div className="text-[10px] opacity-80">{j.done ? '✓' : `Stage ${idx + 1}`}</div>
              <div className="truncate mt-0.5">{j.step}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 1. Command & Context Header */}
      <header className="rounded-3xl p-6 sm:p-8 bg-surface-container-lowest border border-slate-200/80 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-secondary font-bold">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span>Placement Cell · Institution Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
              Placement Cell Dashboard
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant max-w-3xl font-medium">
              Track student readiness, placement progress, skill gaps, and industry opportunities in one place for{' '}
              <strong className="text-on-surface">{institutionDisplayName}</strong>.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-outline font-medium">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>
                Head of T&amp;P: <strong className="text-slate-700">{officerDisplayName}</strong> · Academic
                Year 2026–27
              </span>
            </div>
          </div>

          {/* Action Group */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-end shrink-0">
            <Link
              href="/institution/students"
              className="h-10 px-4 bg-surface-container-low text-on-surface hover:bg-surface-container-high text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-outline" />
              <span>Batch Directory</span>
            </Link>

            <button
              onClick={handleExportDepartments}
              type="button"
              className="h-10 px-4 bg-surface-container-low text-on-surface hover:bg-surface-container-high text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-outline" />
              <span>Export CSV</span>
            </button>

            <Link
              href="/institution/placements"
              className="h-10 px-4 bg-primary text-white hover:bg-primary/90 text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-md shadow-indigo-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Placement Drives</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Executive Summary KPI Row */}
      <section aria-label="Executive Placement Summary" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Tracked Students */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tracked Students</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-on-surface tabular-nums leading-none">{studentCountDisplay}</div>
            <p className="text-xs text-on-surface-variant mt-1.5 font-medium">
              {session?.totalBatchSize ? 'Registered cohort' : 'No cohort data available'}
            </p>
          </div>
          <div className="mt-4 pt-1 bg-surface-container-low px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">Cohort Status</span>
            <span className="font-semibold text-secondary tabular-nums">
              {session?.totalBatchSize ? 'Active' : 'Pending Sync'}
            </span>
          </div>
        </div>

        {/* KPI 2: Placement Ready */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Placement Ready</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-secondary flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-secondary tabular-nums leading-none">—</div>
            <p className="text-xs text-on-surface-variant mt-1.5 font-medium">No data available</p>
          </div>
          <div className="mt-4 pt-1 bg-secondary-container/40 px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs">
            <span className="text-on-secondary-container font-medium">Benchmark</span>
            <span className="font-bold text-on-secondary-container tabular-nums">Pending assessment</span>
          </div>
        </div>

        {/* KPI 3: Needs Upskilling */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Needs Upskilling</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-purple-700 tabular-nums leading-none">—</div>
            <p className="text-xs text-on-surface-variant mt-1.5 font-medium">No data available</p>
          </div>
          <div className="mt-4 pt-1 bg-purple-50 px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-semibold text-purple-800">
            <span>Intervention</span>
            <span>Pending assessment</span>
          </div>
        </div>

        {/* KPI 4: Active Drives */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Drives</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-on-surface tabular-nums leading-none">—</div>
            <p className="text-xs text-on-surface-variant mt-1.5 font-medium">No data available</p>
          </div>
          <div className="mt-4 pt-1 bg-surface-container-low px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">Status</span>
            <span className="font-bold text-primary tabular-nums">None scheduled</span>
          </div>
        </div>

        {/* KPI 5: Placement Rate */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">Placement Rate</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-on-surface tabular-nums leading-none">—</div>
            <p className="text-xs text-on-surface-variant mt-1.5 font-medium">No data available</p>
          </div>
          <div className="mt-4 pt-1 bg-teal-50 px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-semibold text-teal-800">
            <span>Session</span>
            <span>2026–27 Ongoing</span>
          </div>
        </div>
      </section>

      {/* 3. Placement Readiness Distribution & Placement Pipeline Funnel */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Placement Readiness Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold text-on-surface">Placement Readiness</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-semibold">
                NSR Standards
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium">
              Demonstrated competency across the registered student cohort
            </p>

            {/* Neutral Progress Bar */}
            <div className="mt-6">
              <div className="h-4 w-full bg-surface-container-high rounded-full overflow-hidden flex shadow-inner">
                <div className="bg-slate-200 h-full w-full" title="Awaiting assessment data" />
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-1">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
                    <span className="text-xs text-on-surface font-bold">Placement Ready</span>
                  </div>
                  <span className="text-base text-slate-400 mt-1 tabular-nums font-extrabold">—</span>
                  <span className="text-[11px] text-on-surface-variant font-medium">No data available</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
                    <span className="text-xs text-on-surface font-bold">Needs Upskilling</span>
                  </div>
                  <span className="text-base text-slate-400 mt-1 tabular-nums font-extrabold">—</span>
                  <span className="text-[11px] text-on-surface-variant font-medium">No data available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Intervention Alert Box */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Cohort Assessment Benchmark</span>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Batch competency scores and intervention thresholds will update once student skill assessments are completed.
                </p>
              </div>
            </div>
            <Link
              href="/institution/students"
              className="mt-1 self-start text-primary text-xs font-bold flex items-center gap-1 hover:underline"
            >
              <span>View Batch Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right: Placement Pipeline Funnel (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h2 className="text-lg font-bold text-on-surface">Placement Pipeline</h2>
                <p className="text-xs text-on-surface-variant font-medium">
                  Sequential recruitment workflow tracking for campus drives
                </p>
              </div>
              <Link
                href="/institution/placements"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Manage Drives</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pipeline Stage Blocks with neutral empty/placeholder indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 mt-5">
              {[
                { stage: '1. Drives', label: 'Active', count: '—' },
                { stage: '2. Applied', label: 'Submissions', count: '—' },
                { stage: '3. Shortlist', label: 'Screened', count: '—' },
                { stage: '4. Interviews', label: 'Ongoing', count: '—' },
                { stage: '5. Offers', label: 'Extended', count: '—' },
                { stage: '6. Placed', label: 'Accepted', count: '—' },
              ].map((s) => (
                <div key={s.stage} className="bg-surface-container-low p-3 rounded-xl flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-on-surface-variant">{s.stage}</span>
                  <div className="my-1.5 text-base font-black text-slate-400 tabular-nums">{s.count}</div>
                  <span className="text-[10px] text-outline font-medium">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Neutral Pipeline Status Note */}
            <div className="mt-4 p-3.5 bg-surface-container-low rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Recruiter Shortlist Pipeline</span>
                  <span className="text-[11px] text-on-surface-variant font-medium">
                    Live application velocity tracking initializes as company drives receive student applications.
                  </span>
                </div>
              </div>
              <Link
                href="/institution/placements"
                className="text-xs px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-bold self-start sm:self-auto hover:bg-indigo-200 transition-colors"
              >
                Configure Drive
              </Link>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs text-on-surface-variant font-medium">
            <span>Session: 2026–27 Placement Season</span>
            <span className="text-primary font-bold">TPO Sync Enabled</span>
          </div>
        </div>
      </section>

      {/* 4. Department Readiness Table (Preserves Stitch design, displays accredited branches with neutral status) */}
      <section className="bg-surface-container-lowest rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-on-surface">Department Directory &amp; Readiness</h2>
            <p className="text-xs text-on-surface-variant font-medium">
              Accredited engineering disciplines across the campus cohort
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="h-9 pl-9 pr-3 bg-surface-container-low text-on-surface placeholder:text-outline text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-48 sm:w-60 transition-all"
                placeholder="Filter departments..."
                type="text"
              />
            </div>
            <button
              onClick={handleExportDepartments}
              type="button"
              className="h-9 px-3 bg-surface-container-low hover:bg-surface-container-high text-on-surface text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low/70 text-on-surface-variant font-bold">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Audit Status</th>
                <th className="py-3 px-4 text-right">Student Directory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-on-surface font-medium">
              {filteredBranches.map((dept) => (
                <tr key={dept.code} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-on-surface">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dept.dotColor}`} />
                      <span>{dept.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-slate-600 font-semibold">{dept.code}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                      No data available
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href="/institution/students"
                      className="text-primary hover:underline font-bold text-xs inline-flex items-center gap-1"
                    >
                      <span>View Batch</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-surface-container-low/50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-on-surface-variant font-medium">
          <span>
            Showing {filteredBranches.length} accredited engineering branches · Department-level analytics aggregate from the Batch Directory.
          </span>
          <Link
            href="/institution/students"
            className="text-primary hover:underline font-bold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Open Batch Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 5. Skill Gap Core: Deficit & Industry Demand Matrix */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Critical Campus Deficits (6 cols) */}
        <div className="lg:col-span-6 bg-surface-container-lowest p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg font-bold text-on-surface">Critical Campus Deficits</h2>
                <p className="text-xs text-on-surface-variant font-medium">
                  Gap between batch competency scores and hiring thresholds
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-5 p-8 text-center bg-surface-container-low/40 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-slate-400 mb-2" />
              <p className="text-xs text-slate-600 font-semibold">No deficit data available</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                Skill gap analytics activate as students complete verified technical assessments.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/institution/analytics"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5"
            >
              <span>View Analytics Heatmap</span>
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right: Batch Skill Penetration (6 cols) */}
        <div className="lg:col-span-6 bg-surface-container-lowest p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg font-bold text-on-surface">Batch Skill Penetration</h2>
                <p className="text-xs text-on-surface-variant font-medium">
                  Percentage of students demonstrating ≥ 60% tested proficiency
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-5 p-8 text-center bg-surface-container-low/40 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
              <Scale className="w-7 h-7 text-slate-400 mb-2" />
              <p className="text-xs text-slate-600 font-semibold">No skill penetration data available</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                Tested proficiency benchmarks will appear once assessment cycles conclude.
              </p>
            </div>
          </div>

          <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2.5">
            <Lightbulb className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-xs text-slate-600 font-medium leading-relaxed">
              Batch skill penetration tracks directly against tested student assessment submissions.
            </span>
          </div>
        </div>
      </section>

      {/* 6. Active Industry Opportunities */}
      <section className="bg-surface-container-lowest p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-on-surface">Active Industry Opportunities</h2>
          <p className="text-xs text-on-surface-variant font-medium">
            Open partner recruiting drives and campus internship opportunities
          </p>
        </div>

        {/* Empty State */}
        <div className="p-8 text-center bg-surface-container-low/40 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
          <Inbox className="w-8 h-8 text-slate-400 mb-2" />
          <p className="text-xs text-slate-600 font-semibold">No opportunities available</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
            Active placement drives and campus opportunities will appear here once configured.
          </p>
          <Link
            href="/institution/placements"
            className="mt-3 text-primary text-xs font-bold flex items-center gap-1 hover:underline"
          >
            <span>Configure Drives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
