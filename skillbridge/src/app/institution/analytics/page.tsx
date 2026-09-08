"use client";

import { useState, useEffect, useCallback } from "react";
   import { createClient } from "@/lib/supabase/client"; //adjust to your actual client path
import { exportToCSV } from "@/lib/export/csv";
import DateRangeFilter, { DateRange } from "@/components/ui/DateRangeFilter";

interface SkillScoreRow {
  student_id: string;
  student_name: string;
  branch: string;
  college: string;
  overall_score: number;
  skill_scores: Record<string, number>;
  completed_at: string;
}

export default function AnalyticsPage() {
     const supabase = createClient();
  const [scores, setScores] = useState<SkillScoreRow[]>([]);
  const [range, setRange] = useState<DateRange>({ from: "", to: "" });
  const [loading, setLoading] = useState(false);

  const fetchScores = useCallback(async (r: DateRange) => {
    setLoading(true);

    // 1. Fetch assessments (no join)
    let query = supabase
      .from("assessments")
      .select("user_id, score, skill_scores, completed_at")
      .order("completed_at", { ascending: false });

    if (r.from) query = query.gte("completed_at", r.from);
    if (r.to) query = query.lte("completed_at", r.to + "T23:59:59");

    const { data: assessments, error: assessErr } = await query;
    if (assessErr) {
      console.error(assessErr);
      setLoading(false);
      return;
    }

    // 2. Fetch only the profiles we need
    const userIds = [...new Set((assessments ?? []).map((a) => a.user_id))];
    const { data: profiles, error: profErr } = await supabase
      .from("profiles")
      .select("user_id, name, branch, college")
      .in("user_id", userIds.length > 0 ? userIds : [""]); // avoid empty .in() error

    if (profErr) {
      console.error(profErr);
      setLoading(false);
      return;
    }

    // 3. Merge in JS using a lookup map
    const profileMap = new Map((profiles ?? []).map((p) => [p.user_id, p]));

    const merged: SkillScoreRow[] = (assessments ?? []).map((a) => {
      const p = profileMap.get(a.user_id);
      return {
        student_id: a.user_id,
        student_name: p?.name ?? "Unknown",
        branch: p?.branch ?? "Unknown",
        college: p?.college ?? "",
        overall_score: a.score,
        skill_scores: a.skill_scores ?? {},
        completed_at: a.completed_at,
      };
    });

    setScores(merged);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchScores(range);
  }, []);

  const handleRangeChange = (r: DateRange) => {
    setRange(r);
    fetchScores(r);
  };

  const handleExportCSV = () => {
    const csvReady = scores.map((s) => ({
      ...s,
      skill_scores: Object.entries(s.skill_scores)
        .map(([k, v]) => `${k}:${v}`)
        .join(" | "),
    }));

    exportToCSV(csvReady, `skill-scores-${range.from || "all"}_to_${range.to || "today"}`, [
      { key: "student_id", label: "Student ID" },
      { key: "student_name", label: "Name" },
      { key: "branch", label: "Branch" },
      { key: "college", label: "College" },
      { key: "overall_score", label: "Overall Score" },
      { key: "skill_scores", label: "Skill Breakdown" },
      { key: "completed_at", label: "Assessed On" },
    ]);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Skill Analytics</h1>
        <button
          onClick={handleExportCSV}
          disabled={loading || scores.length === 0}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Export Skill Scores (CSV)
        </button>
      </div>

      <DateRangeFilter onChange={handleRangeChange} />

      {/* ... your existing charts/tables render `scores` here ... */}
    </div>
  );
}