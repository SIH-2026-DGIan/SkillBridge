import { createClient } from '@/lib/supabase/server';

export class SkillService {
  /**
   * Get all available skills
   */
  static async getAvailableSkills() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  /**
   * Get skills for a user
   */
  static async getUserSkills(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('user_skills')
      .select('*, skills(name, category)')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  /**
   * Add a skill to a user
   */
  static async addUserSkill(userId: string, skillId: string, proficiency: number, source: string = 'self') {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('user_skills')
      .insert({
        user_id: userId,
        skill_id: skillId,
        proficiency,
        source
      })
      .select('*, skills(name, category)')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update a user's skill proficiency
   */
  static async updateUserSkill(userId: string, userSkillId: string, proficiency: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('user_skills')
      .update({ proficiency })
      .eq('id', userSkillId)
      .eq('user_id', userId)
      .select('*, skills(name, category)')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Remove a skill from a user
   */
  static async removeUserSkill(userId: string, userSkillId: string) {
    const supabase = await createClient();
    const { error } = await supabase
      .from('user_skills')
      .delete()
      .eq('id', userSkillId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }
}
