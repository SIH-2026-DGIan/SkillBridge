import test from 'node:test';
import assert from 'node:assert/strict';
import {
  StudentProfileSchema,
  TpoProfileSchema,
  RecruiterProfileSchema,
  FacultyProfileSchema,
  ProfileUpdateSchema,
} from '../src/lib/validations/profile.schema';
import {
  OpportunityQuerySchema,
  CreateOpportunitySchema,
} from '../src/lib/validations/opportunity.schema';

test('Form Validation Schemas (Zod)', async (t) => {
  await t.test('StudentProfileSchema validates student payload correctly', () => {
    const validStudent = {
      name: 'John Doe',
      email: 'john@example.com',
      college: 'Delhi Technological University',
      degree: 'B.Tech',
      branch: 'Computer Science',
      graduation_year: 2026,
      cgpa: 8.8,
      target_roles: ['Software Engineer', 'Frontend Developer'],
    };

    const parsed = StudentProfileSchema.parse(validStudent);
    assert.equal(parsed.name, 'John Doe');
    assert.equal(parsed.graduation_year, 2026);
    assert.equal(parsed.cgpa, 8.8);

    // Reject short name
    assert.throws(() => {
      StudentProfileSchema.parse({ ...validStudent, name: 'A' });
    });

    // Reject invalid email
    assert.throws(() => {
      StudentProfileSchema.parse({ ...validStudent, email: 'not-an-email' });
    });

    // Reject out-of-range CGPA (> 10)
    assert.throws(() => {
      StudentProfileSchema.parse({ ...validStudent, cgpa: 11.5 });
    });

    // Reject out-of-range graduation year (< 2000)
    assert.throws(() => {
      StudentProfileSchema.parse({ ...validStudent, graduation_year: 1995 });
    });
  });

  await t.test('TpoProfileSchema validates institution payload correctly', () => {
    const validTpo = {
      name: 'Dr. Sharma',
      email: 'tpo@college.edu.in',
      phone: '+91 9876543210',
      institution: 'IIT Delhi',
      location: 'New Delhi',
      website: 'https://home.iitd.ac.in',
    };

    const parsed = TpoProfileSchema.parse(validTpo);
    assert.equal(parsed.institution, 'IIT Delhi');

    // Reject missing institution
    assert.throws(() => {
      TpoProfileSchema.parse({ ...validTpo, institution: '' });
    });
  });

  await t.test('RecruiterProfileSchema validates recruiter payload correctly', () => {
    const validRecruiter = {
      name: 'Sarah Connor',
      email: 'sarah@techcorp.com',
      company: 'TechCorp Solutions',
      website: 'https://techcorp.com',
    };

    const parsed = RecruiterProfileSchema.parse(validRecruiter);
    assert.equal(parsed.company, 'TechCorp Solutions');

    // Reject invalid corporate email
    assert.throws(() => {
      RecruiterProfileSchema.parse({ ...validRecruiter, email: 'invalid-email' });
    });
  });

  await t.test('FacultyProfileSchema validates academician payload correctly', () => {
    const validFaculty = {
      name: 'Prof. Alan Turing',
      email: 'alan@cambridge.ac.uk',
      institution: 'Cambridge University',
      target_roles: ['Computer Systems', 'AI Research'],
    };

    const parsed = FacultyProfileSchema.parse(validFaculty);
    assert.equal(parsed.name, 'Prof. Alan Turing');
  });

  await t.test('ProfileUpdateSchema discriminated union dispatches by role', () => {
    const studentUpdate = {
      role: 'student' as const,
      data: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        college: 'MIT',
        degree: 'B.S.',
        branch: 'EECS',
      },
    };

    const parsed = ProfileUpdateSchema.parse(studentUpdate);
    assert.equal(parsed.role, 'student');
  });

  await t.test('OpportunityQuerySchema validates and coerces defaults', () => {
    const emptyQuery = {};
    const parsed = OpportunityQuerySchema.parse(emptyQuery);
    assert.equal(parsed.page, 1);
    assert.equal(parsed.limit, 10);

    const stringQuery = { page: '3', limit: '25', work_mode: 'remote' };
    const parsedCoerced = OpportunityQuerySchema.parse(stringQuery);
    assert.equal(parsedCoerced.page, 3);
    assert.equal(parsedCoerced.limit, 25);
    assert.equal(parsedCoerced.work_mode, 'remote');
  });

  await t.test('CreateOpportunitySchema validates opportunity creation', () => {
    const validOpp = {
      title: 'Full Stack Engineer Intern',
      company: 'InnovateX',
      description: 'Exciting 6-month internship developing web applications.',
      work_mode: 'remote' as const,
      type: 'internship' as const,
      location: 'Remote',
      duration: '6 Months',
      stipend_min: 25000,
      stipend_max: 35000,
      currency: 'INR',
      deadline: new Date(Date.now() + 864000000).toISOString(),
      skills: [{ skill_id: 'typescript', required_level: 3 }],
    };

    const parsed = CreateOpportunitySchema.parse(validOpp);
    assert.equal(parsed.title, 'Full Stack Engineer Intern');
    assert.equal(parsed.work_mode, 'remote');

    // Reject missing title
    assert.throws(() => {
      CreateOpportunitySchema.parse({ ...validOpp, title: '' });
    });
  });
});
