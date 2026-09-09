"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SkillPicker, {
  SelectedSkill,
} from "@/components/industry/SkillPicker";
import {
  createOpportunity,
  OpportunityInput,
} from "@/backend/services/opportunities.service";

const initialForm = {
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

export default function NewOpportunityPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [skills, setSkills] = useState<SelectedSkill[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateForm = (
    field: keyof typeof initialForm,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStepOne = () => {
    if (
      !form.title ||
      !form.description ||
      !form.location ||
      !form.duration ||
      !form.deadline ||
      !form.category
    ) {
      setError("Please fill all required fields.");
      return false;
    }

    setError("");
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStepOne()) return;

    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (
    status: "active" | "draft"
  ) => {
    setLoading(true);
    setError("");

    try {
      const opportunityData: OpportunityInput = {
        title: form.title,
        type: form.type,
        description: form.description,
        location: form.location,
        work_mode: form.work_mode,
        duration: form.duration,
        stipend: form.stipend
          ? Number(form.stipend)
          : null,
        deadline: form.deadline,
        category: form.category,
        status,
        skills: skills.map((skill) => ({
          skill_id: skill.skill_id,
          required_level: skill.required_level,
        })),
      };

      await createOpportunity(opportunityData);

      router.push("/industry/opportunities");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}

        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 text-sm font-medium text-[#006a63] hover:underline"
          >
            ← Back to Opportunities
          </button>

          <h1 className="text-3xl font-bold text-[#004ac6]">
            Post an Opportunity
          </h1>

          <p className="mt-2 text-gray-600">
            Create an internship, job, or live project opportunity
            for students.
          </p>
        </div>

        {/* Progress */}

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              "Basic Information",
              "Required Skills",
              "Review & Publish",
            ].map((label, index) => {
              const stepNumber = index + 1;

              return (
                <div
                  key={label}
                  className="flex flex-1 flex-col items-center"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                      step >= stepNumber
                        ? "bg-[#004ac6] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {stepNumber}
                  </div>

                  <span className="mt-2 text-center text-xs font-medium text-gray-600">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* STEP 1 */}

        {step === 1 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Basic Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Title */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Opportunity Title *
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    updateForm("title", e.target.value)
                  }
                  placeholder="e.g. Software Development Intern"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#004ac6]"
                />
              </div>

              {/* Type */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Opportunity Type *
                </label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    updateForm("type", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#004ac6]"
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
                  Category *
                </label>

                <input
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    updateForm("category", e.target.value)
                  }
                  placeholder="e.g. Software Development"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#004ac6]"
                />
              </div>

              {/* Description */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Description *
                </label>

                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    updateForm("description", e.target.value)
                  }
                  placeholder="Describe responsibilities, requirements, and what students will learn..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#004ac6]"
                />
              </div>

              {/* Location */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Location *
                </label>

                <input
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    updateForm("location", e.target.value)
                  }
                  placeholder="e.g. Delhi, India"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#004ac6]"
                />
              </div>

              {/* Work Mode */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Work Mode *
                </label>

                <select
                  value={form.work_mode}
                  onChange={(e) =>
                    updateForm(
                      "work_mode",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#004ac6]"
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
                  Duration *
                </label>

                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) =>
                    updateForm("duration", e.target.value)
                  }
                  placeholder="e.g. 3 Months"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#004ac6]"
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
                  placeholder="e.g. 15000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#004ac6]"
                />
              </div>

              {/* Deadline */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Application Deadline *
                </label>

                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) =>
                    updateForm("deadline", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#004ac6]"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNext}
                className="rounded-lg bg-[#004ac6] px-6 py-3 font-medium text-white transition hover:opacity-90"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Required Skills
            </h2>

            <p className="mb-6 mt-2 text-sm text-gray-600">
              Select the skills required for this opportunity
              and set the expected proficiency level.
            </p>

            <SkillPicker
              selected={skills}
              onChange={setSkills}
            />

            <div className="mt-8 flex justify-between">
              <button
                onClick={handleBack}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700"
              >
                ← Back
              </button>

              <button
                onClick={handleNext}
                className="rounded-lg bg-[#004ac6] px-6 py-3 font-medium text-white"
              >
                Review →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}

        {step === 3 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Review Opportunity
            </h2>

            <p className="mb-6 mt-2 text-sm text-gray-600">
              Review the information before publishing.
            </p>

            <div className="space-y-6">
              <section>
                <h3 className="mb-3 font-semibold text-[#004ac6]">
                  Opportunity Details
                </h3>

                <div className="grid gap-4 rounded-xl bg-slate-50 p-5 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-500">
                      Title
                    </p>

                    <p className="font-medium">
                      {form.title}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Type
                    </p>

                    <p className="font-medium capitalize">
                      {form.type.replace("_", " ")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Location
                    </p>

                    <p className="font-medium">
                      {form.location}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Work Mode
                    </p>

                    <p className="font-medium capitalize">
                      {form.work_mode}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Duration
                    </p>

                    <p className="font-medium">
                      {form.duration}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Deadline
                    </p>

                    <p className="font-medium">
                      {form.deadline}
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-3 font-semibold text-[#004ac6]">
                  Description
                </h3>

                <div className="rounded-xl bg-slate-50 p-5 text-gray-700">
                  {form.description}
                </div>
              </section>

              <section>
                <h3 className="mb-3 font-semibold text-[#004ac6]">
                  Required Skills
                </h3>

                <div className="flex flex-wrap gap-3">
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <div
                        key={skill.skill_id}
                        className="rounded-lg border border-[#006a63]/20 bg-[#006a63]/5 px-4 py-2 text-sm"
                      >
                        <span className="font-medium">
                          {skill.name}
                        </span>

                        <span className="ml-2 text-[#006a63]">
                          {skill.required_level}%
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No skills selected.
                    </p>
                  )}
                </div>
              </section>
            </div>

            <div className="mt-8 flex flex-wrap justify-between gap-3">
              <button
                onClick={handleBack}
                disabled={loading}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700"
              >
                ← Back
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    handleSubmit("draft")
                  }
                  disabled={loading}
                  className="rounded-lg border border-[#006a63] px-6 py-3 font-medium text-[#006a63]"
                >
                  {loading
                    ? "Saving..."
                    : "Save Draft"}
                </button>

                <button
                  onClick={() =>
                    handleSubmit("active")
                  }
                  disabled={loading}
                  className="rounded-lg bg-[#004ac6] px-6 py-3 font-medium text-white"
                >
                  {loading
                    ? "Publishing..."
                    : "Publish Opportunity"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}