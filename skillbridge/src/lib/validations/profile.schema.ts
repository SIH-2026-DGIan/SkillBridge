import { z } from 'zod';

export const StudentProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().nullable(),
  college: z.string().min(2, 'College name is required'),
  degree: z.string().min(1, 'Degree is required'),
  branch: z.string().min(1, 'Branch is required'),
  graduation_year: z.number().int().min(2000).max(2035).optional().nullable(),
  cgpa: z.number().min(0).max(10).optional().nullable(),
  target_roles: z.array(z.string()).optional().default([]),
  avatar_url: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
});

export const TpoProfileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().nullable(),
  institution: z.string().min(2, 'Institution name is required'),
  location: z.string().optional().nullable(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')).nullable(),
  avatar_url: z.string().optional().nullable(),
});

export const RecruiterProfileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid corporate email address'),
  phone: z.string().optional().nullable(),
  company: z.string().min(2, 'Company name is required'),
  location: z.string().optional().nullable(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')).nullable(),
  avatar_url: z.string().optional().nullable(),
});

export const FacultyProfileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid institutional email address'),
  phone: z.string().optional().nullable(),
  institution: z.string().min(2, 'University/college name is required'),
  bio: z.string().optional().nullable(),
  target_roles: z.array(z.string()).optional().default([]), // Research domains
  avatar_url: z.string().optional().nullable(),
});

export const ProfileUpdateSchema = z.discriminatedUnion('role', [
  z.object({ role: z.literal('student'), data: StudentProfileSchema }),
  z.object({ role: z.literal('institution'), data: TpoProfileSchema }),
  z.object({ role: z.literal('industry'), data: RecruiterProfileSchema }),
  z.object({ role: z.literal('academician'), data: FacultyProfileSchema }),
]);
