"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Skill {
  id: string;
  name: string;
  category: "technical" | "soft";
}

export interface SelectedSkill {
  skill_id: string;
  name: string;
  required_level: number;
}

interface SkillPickerProps {
  selected: SelectedSkill[];
  onChange: (skills: SelectedSkill[]) => void;
}

export default function SkillPicker({ selected, onChange }: SkillPickerProps) {
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("skills")
      .select("id, name, category")
      .order("name")
      .then(({ data }) => setAllSkills(data ?? []));
  }, []);

  const filtered = allSkills.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.some((sel) => sel.skill_id === s.id)
  );

  const addSkill = (skill: Skill) => {
    onChange([...selected, { skill_id: skill.id, name: skill.name, required_level: 50 }]);
    setSearch("");
  };

  const removeSkill = (skillId: string) => {
    onChange(selected.filter((s) => s.skill_id !== skillId));
  };

  const updateLevel = (skillId: string, level: number) => {
    onChange(selected.map((s) => (s.skill_id === skillId ? { ...s, required_level: level } : s)));
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search skills (e.g. Python, React)..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
        {search && filtered.length > 0 && (
          <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            {filtered.slice(0, 8).map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => addSkill(skill)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-indigo-50"
              >
                <span>{skill.name}</span>
                <span className="text-xs text-gray-400">{skill.category}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {selected.map((s) => (
          <div
            key={s.skill_id}
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
          >
            <span className="min-w-[100px] text-sm font-medium text-gray-800">{s.name}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={s.required_level}
              onChange={(e) => updateLevel(s.skill_id, Number(e.target.value))}
              className="flex-1 accent-indigo-600"
            />
            <span className="w-10 text-right text-xs text-gray-500">{s.required_level}%</span>
            <button
              type="button"
              onClick={() => removeSkill(s.skill_id)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}
        {selected.length === 0 && (
          <p className="text-xs text-gray-400">No skills added yet — search above to add required skills.</p>
        )}
      </div>
    </div>
  );
}