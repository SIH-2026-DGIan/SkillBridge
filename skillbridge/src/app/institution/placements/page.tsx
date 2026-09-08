"use client";

import { useState, useEffect, useCallback } from "react";
   import { createClient } from "@/lib/supabase/client";
import { exportToCSV } from "@/lib/export/csv";
import { generatePlacementPDF } from "@/lib/export/pdf";
import DateRangeFilter, { DateRange } from "@/components/ui/DateRangeFilter";

interface ApplicationRow {
  student_id: string;
  branch: string;
  status: "applied" | "shortlisted" | "interview" | "selected" | "rejected";
  company: string;
  opportunity_type: string;
  applied_at: string;
}

interface BranchSummary {
  branch: string;
  applied: number;
  shortlisted: number;
  placed: number;
}

export default function PlacementsPage() {
     const supabase = createClient();
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [range, setRange] = useState<DateRange>({ from: "", to: "" });
  const [loading, setLoading] = useState(false);

  const fetchApplications = useCallback(async (r: DateRange) => {
    setLoading(true);

    // 1. Fetch applications (no join)
    let appQuery = supabase
      .from("applications")
      .select("student_id, status, applied_at, opportunity_id");

    if (r.from) appQuery = appQuery.gte("applied_at", r.from);
    if (r.to) appQuery = appQuery.lte("applied_at", r.to + "T23:59:59");

    const { data: apps, error: appErr } = await appQuery;
    if (appErr) {
      console.error(appErr);
      setLoading(false);
      return;
    }

    const studentIds = [...new Set((apps ?? []).map((a) => a.student_id))];
    const oppIds = [...new Set((apps ?? []).map((a) => a.opportunity_id))];

    // 2. Fetch only the profiles we need
    const { data: profilesData, error: profErr } = await supabase
      .from("profiles")
      .select("user_id, branch")
      .in("user_id", studentIds.length > 0 ? studentIds : [""]);

    if (profErr) {
      console.error(profErr);
      setLoading(false);
      return;
    }

    // 3. Fetch only the opportunities we need
    const { data: oppsData, error: oppErr } = await supabase
      .from("opportunities")
      .select("id, company, type")
      .in("id", oppIds.length > 0 ? oppIds : [""]);

    if (oppErr) {
      console.error(oppErr);
      setLoading(false);
      return;
    }

    // 4. Merge everything in JS
    const profileMap = new Map((profilesData ?? []).map((p) => [p.user_id, p]));
    const oppMap = new Map((oppsData ?? []).map((o) => [o.id, o]));

    const merged: ApplicationRow[] = (apps ?? []).map((a) => ({
      student_id: a.student_id,
      branch: profileMap.get(a.student_id)?.branch ?? "Unknown",
      status: a.status,
      company: oppMap.get(a.opportunity_id)?.company ?? "Unknown",
      opportunity_type: oppMap.get(a.opportunity_id)?.type ?? "Unknown",
      applied_at: a.applied_at,
    }));

    setApplications(merged);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchApplications(range);
  }, []);

  const handleRangeChange = (r: DateRange) => {
    setRange(r);
    fetchApplications(r);
  };

  const buildBranchSummary = (): BranchSummary[] => {
    const map = new Map<string, BranchSummary>();
    for (const a of applications) {
      if (!map.has(a.branch)) {
        map.set(a.branch, { branch: a.branch, applied: 0, shortlisted: 0, placed: 0 });
      }
      const entry = map.get(a.branch)!;
      entry.applied += 1;
      if (a.status === "shortlisted" || a.status === "interview" || a.status === "selected") {
        entry.shortlisted += 1;
      }
      if (a.status === "selected") {
        entry.placed += 1;
      }
    }
    return Array.from(map.values()).sort((a, b) => a.branch.localeCompare(b.branch));
  };

  const handleExportSummaryCSV = () => {
    const summary = buildBranchSummary();
    exportToCSV(summary, `placement-summary-${range.from || "all"}_to_${range.to || "today"}`, [
      { key: "branch", label: "Branch" },
      { key: "applied", label: "Applied" },
      { key: "shortlisted", label: "Shortlisted" },
      { key: "placed", label: "Placed" },
    ]);
  };

  const handleExportPDF = () => {
    const summary = buildBranchSummary();
    const totalApplied = summary.reduce((s, r) => s + r.applied, 0);
    const totalShortlisted = summary.reduce((s, r) => s + r.shortlisted, 0);
    const totalPlaced = summary.reduce((s, r) => s + r.placed, 0);

    generatePlacementPDF({
      title: "Placement Summary Report",
      subtitle: "SkillBridge — Institution Placement Cell",
      dateRangeLabel: `Period: ${range.from || "Inception"} to ${range.to || "Today"}`,
      columns: [
        { header: "Branch", dataKey: "branch" },
        { header: "Applied", dataKey: "applied" },
        { header: "Shortlisted", dataKey: "shortlisted" },
        { header: "Placed", dataKey: "placed" },
      ],
      rows: summary,
      summaryLines: [
        `Total Applied: ${totalApplied}`,
        `Total Shortlisted: ${totalShortlisted}`,
        `Total Placed: ${totalPlaced}`,
        `Overall Placement Rate: ${totalApplied > 0 ? ((totalPlaced / totalApplied) * 100).toFixed(1) : "0"}%`,
      ],
      filename: `NAAC-placement-report-${range.from || "all"}_to_${range.to || "today"}`,
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Placements</h1>
        <div className="flex gap-3">
          <button
            onClick={handleExportSummaryCSV}
            disabled={loading || applications.length === 0}
            className="rounded-lg border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
          >
            Export Summary (CSV)
          </button>
          <button
            onClick={handleExportPDF}
            disabled={loading || applications.length === 0}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Generate NAAC Report (PDF)
          </button>
        </div>
      </div>

      <DateRangeFilter onChange={handleRangeChange} />

      {/* ... your existing placement table/board renders `applications` here ... */}
    </div>
  );
}