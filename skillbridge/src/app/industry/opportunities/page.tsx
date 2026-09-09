"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchMyOpportunities,
  updateOpportunityStatus,
} from "@/backend/services/opportunities.service";

type Opportunity = {
  id: string;
  title: string;
  type: string;
  status: "active" | "closed" | "draft";
  location: string;
  work_mode: string;
  deadline: string;
  created_at: string;
};

type Filter = "all" | "active" | "draft" | "closed";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchMyOpportunities();
      setOpportunities(data ?? []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load opportunities."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  const handleStatusChange = async (
    id: string,
    status: "active" | "closed"
  ) => {
    try {
      setUpdatingId(id);

      await updateOpportunityStatus(id, status);

      setOpportunities((previous) =>
        previous.map((opportunity) =>
          opportunity.id === id
            ? { ...opportunity, status }
            : opportunity
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update opportunity."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOpportunities =
    filter === "all"
      ? opportunities
      : opportunities.filter(
          (opportunity) => opportunity.status === filter
        );

  const statusStyle = (
    status: Opportunity["status"]
  ) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200";

      case "draft":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "closed":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#004ac6]">
              My Opportunities
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your internships, jobs, and live projects.
            </p>
          </div>

          <Link
            href="/industry/opportunities/new"
            className="rounded-lg bg-[#004ac6] px-5 py-3 font-medium text-white transition hover:opacity-90"
          >
            + Post Opportunity
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {(["all", "active", "draft", "closed"] as Filter[]).map(
            (item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  filter === item
                    ? "bg-[#004ac6] text-white"
                    : "border border-gray-300 bg-white text-gray-600 hover:border-[#004ac6]"
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            )
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
            Loading opportunities...
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredOpportunities.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              No opportunities found
            </h2>

            <p className="mt-2 text-gray-500">
              Start by posting your first opportunity.
            </p>

            <Link
              href="/industry/opportunities/new"
              className="mt-6 inline-block rounded-lg bg-[#004ac6] px-5 py-3 font-medium text-white"
            >
              Post Opportunity
            </Link>
          </div>
        )}

        {/* Opportunity Cards */}
        {!loading && filteredOpportunities.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {opportunity.title}
                    </h2>

                    <p className="mt-1 text-sm capitalize text-gray-500">
                      {opportunity.type.replace("_", " ")}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyle(
                      opportunity.status
                    )}`}
                  >
                    {opportunity.status}
                  </span>
                </div>

                <div className="mt-5 space-y-2 text-sm text-gray-600">
                  <p>📍 {opportunity.location}</p>

                  <p className="capitalize">
                    💼 {opportunity.work_mode}
                  </p>

                  <p>
                    📅 Deadline:{" "}
                    {new Date(
                      opportunity.deadline
                    ).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-5">

                  {/* EDIT BUTTON */}
                  <Link
                    href={`/industry/opportunities/${opportunity.id}/edit`}
                    className="rounded-lg border border-[#004ac6] px-4 py-2 text-sm font-medium text-[#004ac6] transition hover:bg-blue-50"
                  >
                    Edit
                  </Link>

                  {/* Draft */}
                  {opportunity.status === "draft" && (
                    <button
                      onClick={() =>
                        handleStatusChange(
                          opportunity.id,
                          "active"
                        )
                      }
                      disabled={updatingId === opportunity.id}
                      className="rounded-lg bg-[#006a63] px-4 py-2 text-sm font-medium text-white"
                    >
                      {updatingId === opportunity.id
                        ? "Updating..."
                        : "Publish"}
                    </button>
                  )}

                  {/* Active */}
                  {opportunity.status === "active" && (
                    <button
                      onClick={() =>
                        handleStatusChange(
                          opportunity.id,
                          "closed"
                        )
                      }
                      disabled={updatingId === opportunity.id}
                      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600"
                    >
                      {updatingId === opportunity.id
                        ? "Updating..."
                        : "Close Opportunity"}
                    </button>
                  )}

                  {/* Closed */}
                  {opportunity.status === "closed" && (
                    <button
                      onClick={() =>
                        handleStatusChange(
                          opportunity.id,
                          "active"
                        )
                      }
                      disabled={updatingId === opportunity.id}
                      className="rounded-lg bg-[#006a63] px-4 py-2 text-sm font-medium text-white"
                    >
                      {updatingId === opportunity.id
                        ? "Updating..."
                        : "Reopen Opportunity"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}