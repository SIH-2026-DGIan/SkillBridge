"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SkillPicker, {
  SelectedSkill,
} from "@/components/industry/SkillPicker";

import {
  fetchOpportunityById,
  updateOpportunity,
  OpportunityInput,
} from "@/backend/services/opportunities.service";

const emptyForm = {
  title: "",
  type: "internship" as "internship" | "job" | "live_project",
  description: "",
  location: "",
  work_mode: "remote" as "remote" | "hybrid" | "onsite",
  duration: "",
  stipend: "",
  deadline: "",
  category: "",
};

export default function EditOpportunityPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [form, setForm] = useState(emptyForm);
  const [skills, setSkills] = useState<SelectedSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOpportunity() {
      try {
        const opportunity = await fetchOpportunityById(id);

        setForm({
          title: opportunity.title ?? "",
          type: opportunity.type ?? "internship",
          description: opportunity.description ?? "",
          location: opportunity.location ?? "",
          work_mode: opportunity.work_mode ?? "remote",
          duration: opportunity.duration ?? "",
          stipend: opportunity.stipend?.toString() ?? "",
          deadline: opportunity.deadline
            ? opportunity.deadline.split("T")[0]
            : "",
          category: opportunity.category ?? "",
        });

        const existingSkills =
          opportunity.opportunity_skills?.map((item: any) => ({
            skill_id: item.skill_id,
            name: item.skills?.name ?? "Skill",
            required_level: item.required_level,
          })) ?? [];

        setSkills(existingSkills);
      } catch (err) {
        console.error(err);
        setError("Failed to load opportunity.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadOpportunity();
    }
  }, [id]);

  const updateForm = (
    field: keyof typeof emptyForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const data: OpportunityInput = {
        title: form.title,
        type: form.type,
        description: form.description,
        location: form.location,
        work_mode: form.work_mode,
        duration: form.duration,
        stipend: form.stipend ? Number(form.stipend) : null,
        deadline: form.deadline,
        category: form.category,
        status: "active",
        skills: skills.map((skill) => ({
          skill_id: skill.skill_id,
          required_level: skill.required_level,
        })),
      };

      await updateOpportunity(id, data);

      router.push("/industry/opportunities");
    } catch (err) {
      console.error(err);
      setError("Failed to update opportunity.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-center">
        Loading opportunity...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-4xl">

        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 text-sm font-medium text-[#006a63]"
        >
          ← Back
        </button>

        <h1 className="mb-6 text-3xl font-bold text-[#004ac6]">
          Edit Opportunity
        </h1>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="grid gap-5 md:grid-cols-2">

            {/* Title */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Opportunity Title
              </label>

              <input
                value={form.title}
                onChange={(e) =>
                  updateForm("title", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            {/* Type */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Type
              </label>

              <select
                value={form.type}
                onChange={(e) =>
                  updateForm("type", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              >
                <option value="internship">
                  Internship
                </option>

                <option value="job">
                  Job
                </option>

                <option value="live_project">
                  Live Project
                </option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Category
              </label>

              <input
                value={form.category}
                onChange={(e) =>
                  updateForm("category", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                rows={5}
                value={form.description}
                onChange={(e) =>
                  updateForm("description", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Location
              </label>

              <input
                value={form.location}
                onChange={(e) =>
                  updateForm("location", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            {/* Work Mode */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Work Mode
              </label>

              <select
                value={form.work_mode}
                onChange={(e) =>
                  updateForm("work_mode", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              >
                <option value="remote">
                  Remote
                </option>

                <option value="hybrid">
                  Hybrid
                </option>

                <option value="onsite">
                  Onsite
                </option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Duration
              </label>

              <input
                value={form.duration}
                onChange={(e) =>
                  updateForm("duration", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            {/* Stipend */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Stipend / Salary
              </label>

              <input
                type="number"
                value={form.stipend}
                onChange={(e) =>
                  updateForm("stipend", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Application Deadline
              </label>

              <input
                type="date"
                value={form.deadline}
                onChange={(e) =>
                  updateForm("deadline", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

          </div>

          {/* Skills */}
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">
              Required Skills
            </h2>

            <SkillPicker
              selected={skills}
              onChange={setSkills}
            />
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-3">

            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-gray-300 px-6 py-3"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-[#004ac6] px-6 py-3 text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}