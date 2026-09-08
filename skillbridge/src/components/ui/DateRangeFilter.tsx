"use client";

import { useState } from "react";

export interface DateRange {
  from: string;
  to: string;
}

interface DateRangeFilterProps {
  onChange: (range: DateRange) => void;
  defaultRange?: DateRange;
}

export default function DateRangeFilter({ onChange, defaultRange }: DateRangeFilterProps) {
  const today = new Date().toISOString().split("T")[0];
  const [from, setFrom] = useState(defaultRange?.from ?? "");
  const [to, setTo] = useState(defaultRange?.to ?? today);

  const apply = () => onChange({ from, to });

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col">
        <label className="mb-1 text-xs font-medium text-gray-500">From</label>
        <input
          type="date"
          value={from}
          max={to || today}
          onChange={(e) => setFrom(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-xs font-medium text-gray-500">To</label>
        <input
          type="date"
          value={to}
          min={from}
          max={today}
          onChange={(e) => setTo(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <button
        onClick={apply}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Apply Filter
      </button>
    </div>
  );
}