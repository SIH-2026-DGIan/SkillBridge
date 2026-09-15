import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { DEMO_OPPORTUNITIES } from "@/lib/demo-data";

export interface OpportunitySkillInput {
  skill_id: string;
  required_level: number;
}

export interface OpportunityInput {
  title: string;
  type: "internship" | "job" | "live_project";
  description: string;
  location: string;
  work_mode: "remote" | "hybrid" | "onsite";
  duration: string;
  stipend: number | null;
  deadline: string; // ISO date
  category: string;
  status: "active" | "closed" | "draft";
  skills: OpportunitySkillInput[];
}

export async function createOpportunity(input: OpportunityInput) {
  const supabase = createClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) {
    throw new Error("Not authenticated");
  }

  const { data: opp, error: oppErr } = await supabase
    .from("opportunities")
    .insert({
      title: input.title,
      type: input.type,
      description: input.description,
      location: input.location,
      work_mode: input.work_mode,
      duration: input.duration,
      stipend: input.stipend,
      deadline: input.deadline,
      category: input.category,
      status: input.status,
      company: userData.user.user_metadata?.company ?? "Unknown Company",
      posted_by: userData.user.id,
    })
    .select()
    .single();

  if (oppErr) throw oppErr;

  if (input.skills.length > 0) {
    const rows = input.skills.map((s) => ({
      opportunity_id: opp.id,
      skill_id: s.skill_id,
      required_level: s.required_level,
    }));
    const { error: skillErr } = await supabase.from("opportunity_skills").insert(rows);
    if (skillErr) throw skillErr;
  }

  return opp;
}

export async function updateOpportunityStatus(
  opportunityId: string,
  status: "active" | "closed" | "draft"
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("opportunities")
    .update({ status })
    .eq("id", opportunityId);
  if (error) throw error;
}

export async function fetchMyOpportunities() {
  const supabase = createClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("opportunities")
    .select("id, title, type, status, location, work_mode, deadline, created_at")
    .eq("posted_by", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
export async function fetchOpportunityById(opportunityId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("opportunities")
    .select(`
      *,
      opportunity_skills (
        skill_id,
        required_level,
        skills (
          id,
          name
        )
      )
    `)
    .eq("id", opportunityId)
    .single();

  if (error) throw error;

  return data;
}

export async function updateOpportunity(
  opportunityId: string,
  input: OpportunityInput
) {
  const supabase = createClient();

  const { data: userData, error: userErr } =
    await supabase.auth.getUser();

  if (userErr || !userData?.user) {
    throw new Error("Not authenticated");
  }

  // Update opportunity basic information
  const { error: updateError } = await supabase
    .from("opportunities")
    .update({
      title: input.title,
      type: input.type,
      description: input.description,
      location: input.location,
      work_mode: input.work_mode,
      duration: input.duration,
      stipend: input.stipend,
      deadline: input.deadline,
      category: input.category,
      status: input.status,
    })
    .eq("id", opportunityId)
    .eq("posted_by", userData.user.id);

  if (updateError) throw updateError;

  // Remove previous skills
  const { error: deleteSkillsError } = await supabase
    .from("opportunity_skills")
    .delete()
    .eq("opportunity_id", opportunityId);

  if (deleteSkillsError) throw deleteSkillsError;

  // Insert updated skills
  if (input.skills.length > 0) {
    const skillRows = input.skills.map((skill) => ({
      opportunity_id: opportunityId,
      skill_id: skill.skill_id,
      required_level: skill.required_level,
    }));

    const { error: insertSkillsError } = await supabase
      .from("opportunity_skills")
      .insert(skillRows);

    if (insertSkillsError) throw insertSkillsError;
  }

  return {
    success: true,
  };
}

export async function fetchActiveOpportunities() {
  if (!isSupabaseConfigured()) {
    return DEMO_OPPORTUNITIES.map((opp: any) => ({
      ...opp,
      requiredSkills: opp.requiredSkills || [],
    }));
  }

  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("opportunities")
      .select(`
        id, title, company, type, category, status, location, work_mode, duration, stipend, deadline,
        opportunity_skills (
          skill_id,
          required_level,
          skills (
            id,
            name
          )
        )
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return DEMO_OPPORTUNITIES.map((opp: any) => ({
        ...opp,
        requiredSkills: opp.requiredSkills || [],
      }));
    }

    // Transform the response to match the expected OpportunityProfile structure
    return data.map((opp: any) => ({
      ...opp,
      requiredSkills: opp.opportunity_skills?.map((os: any) => ({
        skillId: os.skill_id,
        requiredLevel: os.required_level,
      })) || [],
    }));
  } catch (err) {
    console.warn("fetchActiveOpportunities failed, falling back to demo opportunities:", err);
    return DEMO_OPPORTUNITIES.map((opp: any) => ({
      ...opp,
      requiredSkills: opp.requiredSkills || [],
    }));
  }
}