'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SKILLS } from '@/lib/skills-taxonomy';
import { toast } from 'sonner';
import { PlusCircle, X, Building2 } from 'lucide-react';

const OPP_TYPES = ['internship', 'job', 'live_project'] as const;
const WORK_MODES = ['remote', 'hybrid', 'onsite'] as const;

export default function PostOpportunityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['python', 'machine_learning', 'sql', 'tensorflow']);
  const [skillSearch, setSkillSearch] = useState('');

  const [form, setForm] = useState({
    type: 'internship' as typeof OPP_TYPES[number],
    title: 'Machine Learning Intern',
    description: 'Work with our AI team to build and deploy ML models for real-world applications. You will be involved in the full ML pipeline from data preprocessing to model deployment.',
    location: 'Bengaluru',
    workMode: 'hybrid' as typeof WORK_MODES[number],
    duration: '6 months',
    stipend: '25000',
    deadline: '2026-09-30',
  });

  const filteredSkills = SKILLS.filter(
    (s) =>
      !selectedSkills.includes(s.id) &&
      s.name.toLowerCase().includes(skillSearch.toLowerCase())
  ).slice(0, 10);

  const addSkill = (skillId: string) => {
    setSelectedSkills((prev) => [...prev, skillId]);
    setSkillSearch('');
  };

  const removeSkill = (skillId: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skillId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkills.length === 0) {
      toast.error('Please add at least one required skill');
      return;
    }
    setLoading(true);

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: opp, error } = await supabase.from('opportunities').insert({
          company: 'TechNova',
          type: form.type,
          title: form.title,
          description: form.description,
          location: form.location,
          work_mode: form.workMode,
          duration: form.duration,
          stipend: parseInt(form.stipend) || 0,
          deadline: form.deadline,
          status: 'active',
          posted_by: user.id,
        }).select().single();

        if (error) throw error;

        // Add skills
        for (const skillId of selectedSkills) {
          await supabase.from('opportunity_skills').insert({
            opportunity_id: opp.id,
            skill_id: skillId,
            required_level: 70,
          });
        }

        toast.success('Opportunity published! Students can now apply.');
        router.push('/industry/dashboard');
      } else {
        // Demo mode
        await new Promise((r) => setTimeout(r, 800));
        toast.success('Opportunity posted! (Demo mode)');
        router.push('/industry/dashboard');
      }
    } catch (err) {
      toast.error('Failed to post opportunity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const SKILL_MAP_LOCAL = Object.fromEntries(SKILLS.map((s) => [s.id, s]));

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Post an Opportunity</h1>
        <p className="text-gray-500 text-sm mt-0.5">AI will automatically match and rank candidates based on skills</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-800">Opportunity Type</h2>
          <div className="flex gap-3 flex-wrap">
            {OPP_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, type: t })}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  form.type === t ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-200 text-gray-600 hover:border-purple-300'
                }`}
              >
                {t === 'live_project' ? 'Live Project' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-800">Basic Information</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Job Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="e.g. Machine Learning Intern"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={4}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Bengaluru"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Work Mode</label>
              <select
                value={form.workMode}
                onChange={(e) => setForm({ ...form, workMode: e.target.value as typeof WORK_MODES[number] })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              >
                {WORK_MODES.map((m) => (
                  <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Duration</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="e.g. 6 months"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stipend (₹/month)</label>
              <input
                type="number"
                value={form.stipend}
                onChange={(e) => setForm({ ...form, stipend: e.target.value })}
                placeholder="e.g. 25000"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Application Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>
          </div>
        </div>

        {/* Required Skills */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-800">Required Skills</h2>
          <p className="text-xs text-gray-500">These skills will be used by the AI matching engine to rank candidates</p>

          {/* Selected skills */}
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skillId) => {
                const skill = SKILL_MAP_LOCAL[skillId];
                return (
                  <span
                    key={skillId}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-full border border-purple-200"
                  >
                    {skill?.name ?? skillId}
                    <button type="button" onClick={() => removeSkill(skillId)} className="hover:text-purple-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Skill search */}
          <div className="relative">
            <input
              type="text"
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              placeholder="Search and add skills..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
            />
            {skillSearch && filteredSkills.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                {filteredSkills.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => addSkill(skill.id)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-purple-50 flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <span className="text-xs text-gray-400 capitalize">{skill.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-purple-600 text-white font-bold text-base rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/25 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><PlusCircle className="w-5 h-5" /> Publish Opportunity</>
          )}
        </button>
      </form>
    </div>
  );
}
