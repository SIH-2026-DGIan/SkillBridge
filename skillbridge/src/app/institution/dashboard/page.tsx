'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Briefcase,
  Building2,
  Target,
  ArrowRight,
  ChevronRight,
  Calendar,
  ShieldCheck,
  Building,
  UserCheck,
  Award,
  ChevronDown,
  User,
  FileText,
  Zap,
  Inbox,
  AlertTriangle,
  BarChart2,
  Sparkles,
  CheckCircle2,
  Activity,
  Layers,
} from 'lucide-react';
import { getSession } from '@/lib/user-session';
import { exportToCSV } from '@/lib/export/csv';

interface DashboardTelemetry {
  metrics: {
    totalStudents: number | null;
    activeOpportunities: number | null;
    partnerCompanies: number | null;
    placementRate: number | null;
  };
  pipeline: {
    hasData: boolean;
    applied: number | null;
    shortlisted: number | null;
    interviewed: number | null;
    offers: number | null;
    placed: number | null;
  };
  readiness: {
    overall: number | null;
    technical: number | null;
    communication: number | null;
    problemSolving: number | null;
    domain: number | null;
  };
  departmentStats: Array<{
    name: string;
    code: string;
    studentCount: number | null;
    placedCount: number | null;
    percent: number | null;
  }>;
  recentOpportunities: Array<{
    id: string;
    company: string;
    role: string;
    type: string;
    deadline: string;
  }>;
  ecosystemStatus: {
    studentData: string;
    opportunities: string;
    assessments: string;
    placementDrives: string;
    analytics: string;
  };
  topHiringCompanies: string[];
}

const DEFAULT_BRANCHES = [
  { name: 'Computer Science & Engineering', code: 'CSE' },
  { name: 'Information Technology', code: 'IT' },
  { name: 'Electronics & Communication', code: 'ECE' },
  { name: 'Electrical Engineering', code: 'EE' },
  { name: 'Mechanical Engineering', code: 'ME' },
  { name: 'Civil Engineering', code: 'CE' },
];

export default function InstitutionDashboard() {
  const [session, setSession] = useState<ReturnType<typeof getSession> | null>(null);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [telemetry, setTelemetry] = useState<DashboardTelemetry | null>(null);

  useEffect(() => {
    setSession(getSession());
    const onUpdate = () => setSession(getSession());
    window.addEventListener('sb_session_updated', onUpdate);

    async function loadBackendTelemetry() {
      try {
        const res = await fetch('/api/institution/dashboard');
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setTelemetry(json);
          }
        }
      } catch (e) {
        console.error('Failed to load backend telemetry:', e);
      }
    }

    loadBackendTelemetry();

    return () => window.removeEventListener('sb_session_updated', onUpdate);
  }, []);

  const departmentData = telemetry?.departmentStats && telemetry.departmentStats.length > 0
    ? telemetry.departmentStats
    : DEFAULT_BRANCHES.map((b) => ({
        name: b.name,
        code: b.code,
        studentCount: null,
        placedCount: null,
        percent: null,
      }));

  const filteredBranches = filterDepartment.trim()
    ? departmentData.filter(
        (b) =>
          b.name.toLowerCase().includes(filterDepartment.toLowerCase()) ||
          b.code.toLowerCase().includes(filterDepartment.toLowerCase())
      )
    : departmentData;

  const handleExportDepartments = () => {
    exportToCSV(
      departmentData.map((b) => ({
        Department: b.name,
        Code: b.code,
        RegisteredStudents: b.studentCount ?? '—',
        PlacedStudents: b.placedCount ?? '—',
        PlacementRate: b.percent ? `${b.percent}%` : '—',
      })),
      'department-placement-statistics'
    );
  };

  const institutionDisplayName = session
    ? session.institutionName || session.college || 'Institution Placement Cell'
    : '—';

  const officerDisplayName = session ? session.name || 'Placement Officer' : '—';

  const studentCountDisplay = telemetry?.metrics?.totalStudents !== undefined && telemetry?.metrics?.totalStudents !== null
    ? telemetry.metrics.totalStudents.toLocaleString()
    : session?.totalBatchSize
    ? session.totalBatchSize.toLocaleString()
    : '—';

  const activeOppDisplay = telemetry?.metrics?.activeOpportunities !== undefined && telemetry?.metrics?.activeOpportunities !== null
    ? telemetry.metrics.activeOpportunities.toLocaleString()
    : '—';

  const partnerCompaniesDisplay = telemetry?.metrics?.partnerCompanies !== undefined && telemetry?.metrics?.partnerCompanies !== null
    ? telemetry.metrics.partnerCompanies.toLocaleString()
    : '—';

  const placementRateDisplay = telemetry?.metrics?.placementRate !== undefined && telemetry?.metrics?.placementRate !== null
    ? `${telemetry.metrics.placementRate}%`
    : '—';

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto w-full pb-10">
      {/* =========================================================================
          1. HERO BANNER & QUICK ACTIONS
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hero Banner (9 Cols) */}
        <div className="lg:col-span-9 rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-blue-100/60 border border-blue-100/90 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          {/* Top Tagline Row (Fixed Layout Alignment: Zero Overlap) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-indigo-600 font-extrabold">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>PLACEMENT CELL • DASHBOARD</span>
            </div>
            <span className="inline-flex items-center text-xs font-extrabold italic text-indigo-700 bg-white/90 px-3.5 py-1 rounded-full border border-indigo-100/90 shadow-2xs self-start sm:self-auto">
              More Opportunities. More Dream Placements.
            </span>
          </div>

          <div className="relative z-10 space-y-2 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Welcome back, {officerDisplayName}</span>
              <span className="text-2xl">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Here&apos;s what&apos;s happening with your campus placement ecosystem.
            </p>
          </div>

          {/* Info Pills Row */}
          <div className="relative z-10 flex flex-wrap items-center gap-3 mt-6">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-xs border border-blue-100/90 shadow-2xs text-xs font-bold text-slate-800">
              <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-slate-900">{institutionDisplayName}</div>
                <div className="text-[10px] text-slate-400 font-medium">Your Institution</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-xs border border-blue-100/90 shadow-2xs text-xs font-bold text-slate-800">
              <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-slate-900">2025 - 26</div>
                <div className="text-[10px] text-slate-400 font-medium">Academic Year</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-xs border border-blue-100/90 shadow-2xs text-xs font-bold text-slate-800">
              <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-slate-900">Placement Cell</div>
                <div className="text-[10px] text-slate-400 font-medium">Your Role</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions (3 Cols) */}
        <div className="lg:col-span-3 rounded-3xl p-5 bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">Quick Actions</h2>
          </div>

          <div className="space-y-2.5 flex-1 flex flex-col justify-center">
            {/* Action 1: Post New Opportunity */}
            <Link
              href="/institution/placements"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md shadow-indigo-500/20 transition-all duration-150 group"
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" />
                <span>Post New Opportunity</span>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Action 2: View All Students */}
            <Link
              href="/institution/students"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100/90 text-indigo-600 text-xs font-extrabold border border-slate-200/70 transition-all duration-150 group"
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-indigo-600" />
                <span>View All Students</span>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Action 3: Generate Reports */}
            <button
              onClick={handleExportDepartments}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100/90 text-indigo-600 text-xs font-extrabold border border-slate-200/70 transition-all duration-150 group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Generate Reports</span>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. KPI OVERVIEW ROW (4 CARDS)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Students</div>
            <div className="text-2xl font-black text-slate-900 tabular-nums leading-snug mt-0.5">{studentCountDisplay}</div>
            <div className="text-[11px] font-bold text-slate-400 mt-0.5">
              {studentCountDisplay !== '—' ? 'Registered cohort' : 'No cohort data available'}
            </div>
          </div>
        </div>

        {/* KPI 2: Active Opportunities */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Opportunities</div>
            <div className={`text-2xl font-black tabular-nums leading-snug mt-0.5 ${activeOppDisplay !== '—' ? 'text-slate-900' : 'text-slate-400'}`}>
              {activeOppDisplay}
            </div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
              {activeOppDisplay !== '—' ? 'Active hiring drives' : 'No active opportunities'}
            </div>
          </div>
        </div>

        {/* KPI 3: Partner Companies */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Partner Companies</div>
            <div className={`text-2xl font-black tabular-nums leading-snug mt-0.5 ${partnerCompaniesDisplay !== '—' ? 'text-slate-900' : 'text-slate-400'}`}>
              {partnerCompaniesDisplay}
            </div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
              {partnerCompaniesDisplay !== '—' ? 'Verified recruiters' : 'No partner data available'}
            </div>
          </div>
        </div>

        {/* KPI 4: Placement Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Placement Rate</div>
            <div className={`text-2xl font-black tabular-nums leading-snug mt-0.5 ${placementRateDisplay !== '—' ? 'text-slate-900' : 'text-slate-400'}`}>
              {placementRateDisplay}
            </div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
              {placementRateDisplay !== '—' ? 'Verified placements' : 'No placement data available'}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. PLACEMENT READINESS & PLACEMENT PIPELINE
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Placement Readiness (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Placement Readiness</h3>
                <p className="text-xs text-slate-500 font-medium">Track student competency, area-wise readiness and overall progress.</p>
              </div>
              <Link href="/institution/analytics" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                <span>View Skill Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-6">
              {/* Circular Gauge SVG (4 cols) */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#E2E8F0" strokeWidth="9" fill="transparent" />
                    {telemetry?.readiness?.overall && (
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#6366F1"
                        strokeWidth="9"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * telemetry.readiness.overall) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    )}
                  </svg>
                  <div className="absolute text-center flex flex-col items-center">
                    <span className={`text-3xl font-black leading-none ${telemetry?.readiness?.overall ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {telemetry?.readiness?.overall ? `${telemetry.readiness.overall}%` : '—'}
                    </span>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <div className="text-xs font-bold text-slate-800">Overall Readiness</div>
                  <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                    {telemetry?.readiness?.overall ? 'Evaluated from student assessments' : 'Pending cohort assessment'}
                  </div>
                </div>
              </div>

              {/* Progress Bars List (7 cols) */}
              <div className="md:col-span-7 space-y-3.5">
                {/* 1. Technical Skills */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>Technical Skills</span>
                    <span className={telemetry?.readiness?.technical ? 'text-indigo-600' : 'text-slate-400 font-medium'}>
                      {telemetry?.readiness?.technical ? `${telemetry.readiness.technical}%` : '—'}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    {telemetry?.readiness?.technical && (
                      <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: `${telemetry.readiness.technical}%` }} />
                    )}
                  </div>
                </div>

                {/* 2. Communication */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>Communication</span>
                    <span className={telemetry?.readiness?.communication ? 'text-indigo-600' : 'text-slate-400 font-medium'}>
                      {telemetry?.readiness?.communication ? `${telemetry.readiness.communication}%` : '—'}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    {telemetry?.readiness?.communication && (
                      <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: `${telemetry.readiness.communication}%` }} />
                    )}
                  </div>
                </div>

                {/* 3. Problem Solving */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>Problem Solving</span>
                    <span className={telemetry?.readiness?.problemSolving ? 'text-indigo-600' : 'text-slate-400 font-medium'}>
                      {telemetry?.readiness?.problemSolving ? `${telemetry.readiness.problemSolving}%` : '—'}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    {telemetry?.readiness?.problemSolving && (
                      <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: `${telemetry.readiness.problemSolving}%` }} />
                    )}
                  </div>
                </div>

                {/* 4. Domain Knowledge */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>Domain Knowledge</span>
                    <span className={telemetry?.readiness?.domain ? 'text-indigo-600' : 'text-slate-400 font-medium'}>
                      {telemetry?.readiness?.domain ? `${telemetry.readiness.domain}%` : '—'}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    {telemetry?.readiness?.domain && (
                      <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: `${telemetry.readiness.domain}%` }} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cohort Assessment Benchmark Insight Panel */}
          <div className="mt-6 p-3.5 bg-slate-50/90 border border-slate-200/80 rounded-2xl flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="flex flex-col text-xs">
              <span className="font-bold text-slate-900">Cohort Assessment Benchmark</span>
              <span className="text-slate-500 text-[11px] font-medium leading-relaxed">
                Batch competency scores and intervention thresholds will update once student skill assessments are completed.
              </span>
            </div>
          </div>
        </div>

        {/* Placement Pipeline (6 Cols) — Connected 5-Stage Journey: APPLIED -> SHORTLISTED -> INTERVIEWED -> OFFERS -> PLACED */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Placement Pipeline</h3>
                <p className="text-xs text-slate-500 font-medium">Track the journey from opportunity to offer.</p>
              </div>
              <Link href="/institution/placements" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 5 Connected Funnel Stage Blocks */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 mt-6">
              {/* Stage 1: APPLIED */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex-1 min-w-[70px] text-center">
                <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Applied</div>
                <div className={`text-base font-black tabular-nums mt-1 ${telemetry?.pipeline?.applied !== null && telemetry?.pipeline?.applied !== undefined ? 'text-slate-900' : 'text-slate-400'}`}>
                  {telemetry?.pipeline?.applied !== null && telemetry?.pipeline?.applied !== undefined ? telemetry.pipeline.applied : '—'}
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

              {/* Stage 2: SHORTLISTED */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex-1 min-w-[70px] text-center">
                <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Shortlisted</div>
                <div className={`text-base font-black tabular-nums mt-1 ${telemetry?.pipeline?.shortlisted !== null && telemetry?.pipeline?.shortlisted !== undefined ? 'text-slate-900' : 'text-slate-400'}`}>
                  {telemetry?.pipeline?.shortlisted !== null && telemetry?.pipeline?.shortlisted !== undefined ? telemetry.pipeline.shortlisted : '—'}
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

              {/* Stage 3: INTERVIEWED */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex-1 min-w-[70px] text-center">
                <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Interviewed</div>
                <div className={`text-base font-black tabular-nums mt-1 ${telemetry?.pipeline?.interviewed !== null && telemetry?.pipeline?.interviewed !== undefined ? 'text-slate-900' : 'text-slate-400'}`}>
                  {telemetry?.pipeline?.interviewed !== null && telemetry?.pipeline?.interviewed !== undefined ? telemetry.pipeline.interviewed : '—'}
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

              {/* Stage 4: OFFERS */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex-1 min-w-[70px] text-center">
                <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Offers</div>
                <div className={`text-base font-black tabular-nums mt-1 ${telemetry?.pipeline?.offers !== null && telemetry?.pipeline?.offers !== undefined ? 'text-slate-900' : 'text-slate-400'}`}>
                  {telemetry?.pipeline?.offers !== null && telemetry?.pipeline?.offers !== undefined ? telemetry.pipeline.offers : '—'}
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

              {/* Stage 5: PLACED */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex-1 min-w-[70px] text-center">
                <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Placed</div>
                <div className={`text-base font-black tabular-nums mt-1 ${telemetry?.pipeline?.placed !== null && telemetry?.pipeline?.placed !== undefined ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {telemetry?.pipeline?.placed !== null && telemetry?.pipeline?.placed !== undefined ? telemetry.pipeline.placed : '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Top Hiring Companies */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Top Hiring Companies</span>
              <span className="text-slate-400 font-medium">
                {telemetry?.topHiringCompanies && telemetry.topHiringCompanies.length > 0
                  ? telemetry.topHiringCompanies.join(', ')
                  : 'No company data available'}
              </span>
            </div>
            <Link href="/institution/placements" className="font-bold text-indigo-600 hover:underline flex items-center gap-1 shrink-0">
              <span>Configure Drive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. SKILLBRIDGE PLACEMENT INTELLIGENCE (NEW FEATURE CARD)
         ========================================================================= */}
      <div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white border border-indigo-500/20 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>✦ SKILLBRIDGE PLACEMENT INTELLIGENCE</span>
          </div>
          <h3 className="text-lg font-black text-white tracking-tight">Institutional Telemetry &amp; Skill Gap Analytics</h3>
          <p className="text-xs text-indigo-200/80 font-medium leading-relaxed">
            {telemetry?.readiness?.overall
              ? `Overall cohort readiness is sitting at ${telemetry.readiness.overall}%. Focus interventions on domain and problem-solving readiness for upcoming campus placement drives.`
              : 'Placement intelligence is waiting for assessment and placement data. Automated gap telemetry will surface critical skill deficits as student evaluations progress.'}
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <Link
            href="/institution/analytics"
            className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-extrabold text-xs rounded-xl shadow-xs transition-all duration-150"
          >
            <span>View Skill Analytics</span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-900" />
          </Link>
        </div>
      </div>

      {/* =========================================================================
          5. ACTION REQUIRED AREA (CONDITIONAL ON REAL SYSTEM STATE)
         ========================================================================= */}
      {(!session?.totalBatchSize && (!telemetry?.metrics?.totalStudents || telemetry.metrics.totalStudents === 0)) && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900">Student Cohort Not Synced</div>
              <div className="text-[11px] text-slate-600 font-medium">
                Register student cohort data to activate department readiness analytics and gap telemetry.
              </div>
            </div>
          </div>

          <Link
            href="/institution/students"
            className="text-xs font-extrabold px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 shadow-2xs transition-colors shrink-0 self-start sm:self-auto"
          >
            <span>Sync Cohort</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* =========================================================================
          6. RECENT OPPORTUNITIES & DEPARTMENT PLACEMENT INTELLIGENCE
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Opportunities (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Recent Opportunities</h3>
                  <p className="text-xs text-slate-500 font-medium">Latest placement drives and hiring opportunities.</p>
                </div>
              </div>
              <Link href="/institution/placements" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {telemetry?.recentOpportunities && telemetry.recentOpportunities.length > 0 ? (
              <div className="space-y-3">
                {telemetry.recentOpportunities.map((opp) => (
                  <div key={opp.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">{opp.role}</div>
                      <div className="text-[11px] font-medium text-slate-500">{opp.company} • {opp.type}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {opp.deadline}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State for Opportunities */
              <div className="p-8 text-center bg-slate-50/80 rounded-2xl border border-dashed border-slate-200/90 flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <Inbox className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-900 font-extrabold">No active opportunities yet</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-sm font-medium leading-relaxed">
                  Active placement drives and campus recruiting opportunities will appear here once configured.
                </p>
                <Link
                  href="/institution/placements"
                  className="mt-4 text-xs font-bold px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <span>Configure Drive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Department Placement Intelligence (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Department Placement Intelligence</h3>
                  <p className="text-xs text-slate-500 font-medium">Track placement performance and readiness across departments.</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl cursor-pointer">
                <span>All Departments</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Department Bars */}
            <div className="space-y-3.5">
              {filteredBranches.map((dept) => (
                <div key={dept.name}>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1">
                    <span className="truncate max-w-[220px]">{dept.name}</span>
                    <div className="flex items-center gap-3 tabular-nums">
                      <span className="text-slate-400 font-medium">
                        {dept.studentCount !== null && dept.studentCount !== undefined ? `${dept.studentCount} enrolled` : '— / —'}
                      </span>
                      <span className={`font-extrabold w-9 text-right ${dept.percent ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {dept.percent ? `${dept.percent}%` : '—'}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    {dept.percent ? (
                      <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: `${dept.percent}%` }} />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          7. ECOSYSTEM STATUS
         ========================================================================= */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">✦ SKILLBRIDGE ECOSYSTEM STATUS</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${telemetry?.ecosystemStatus?.studentData === 'Connected' || session?.totalBatchSize ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <span>Student Data: <strong className="text-slate-900">{telemetry?.ecosystemStatus?.studentData || (session?.totalBatchSize ? 'Connected' : 'Not Configured')}</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${telemetry?.ecosystemStatus?.opportunities === 'Synced' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <span>Opportunities: <strong className="text-slate-900">{telemetry?.ecosystemStatus?.opportunities || 'Not Configured'}</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${telemetry?.ecosystemStatus?.assessments === 'Active' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
            <span>Assessments: <strong className="text-slate-900">{telemetry?.ecosystemStatus?.assessments || 'Pending'}</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Analytics: <strong className="text-slate-900">{telemetry?.ecosystemStatus?.analytics || 'Ready'}</strong></span>
          </span>
        </div>
      </div>

      {/* =========================================================================
          8. FOOTER BAR
         ========================================================================= */}
      <footer className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-medium">
        <div>© 2025 SkillBridge. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
          <Link href="/help" className="hover:text-slate-600 transition-colors">Help</Link>
        </div>
      </footer>
    </div>
  );
}