import { z } from 'zod';

export const OpportunitySkillSchema = z.object({
  skill_id: z.string().min(1, 'Skill ID is required'),
  required_level: z.number().int().min(1).max(100, 'Required level must be between 1 and 100'),
});

export const CreateOpportunitySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  type: z.enum(['internship', 'job', 'live_project']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
  work_mode: z.enum(['remote', 'hybrid', 'onsite']).default('hybrid'),
  duration: z.string().optional().nullable(),
  stipend: z.number().int().nonnegative().optional().nullable(),
  deadline: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  status: z.enum(['active', 'closed', 'draft']).default('active'),
  skills: z.array(OpportunitySkillSchema).optional().default([]),
});

export const UpdateOpportunitySchema = CreateOpportunitySchema.partial();

export const OpportunityQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  type: z.enum(['internship', 'job', 'live_project']).optional(),
  work_mode: z.enum(['remote', 'hybrid', 'onsite']).optional(),
  location: z.string().optional(),
  status: z.enum(['active', 'closed', 'draft']).default('active'),
});
