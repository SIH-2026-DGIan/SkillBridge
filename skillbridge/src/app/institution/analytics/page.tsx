'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { DEMO_INSTITUTION_STATS } from '@/lib/demo-data';

const COLORS = ['#3b82f6', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#22c55e', '#ec4899', '#6366f1'];

export default function InstitutionAnalyticsPage() {
  const stats = DEMO_INSTITUTION_STATS;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Institution Skill Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Cohort-level competencies &amp; curriculum alignment</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-1">Student Skill Mastery (Proficiency ≥ 60%)</h2>
          <p className="text-xs text-gray-500 mb-4">Percentage of student cohort evaluated as proficient</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.skillDistribution} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="skill" width={110} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`${v}%`, 'Proficiency Rate']} contentStyle={{ borderRadius: 8 }} />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                {stats.skillDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-1">Industry Skill Deficit Index</h2>
          <p className="text-xs text-gray-500 mb-4">Average point gap between requirements and student readiness</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.topSkillGaps} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
              <XAxis type="number" domain={[0, 80]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="skill" width={120} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`${v}%`, 'Average Gap']} contentStyle={{ borderRadius: 8 }} />
              <Bar dataKey="avgGap" fill="#ef4444" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
