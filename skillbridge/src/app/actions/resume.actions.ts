'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ParsedResume } from '@/lib/user-session';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function parseResumeWithGemini(
  text: string,
  fileName: string = 'Resume.pdf'
): Promise<ParsedResume> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  // Use the fast, latest 2.0 Flash model
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `
You are an expert technical recruiter and resume parser.
Extract the following information from the provided resume text into a strict JSON format.

JSON Schema Requirements:
{
  "candidateName": "First Last (or 'Candidate' if missing)",
  "headline": "A short, professional headline based on their profile, e.g., 'Full Stack Engineer'",
  "extractedSkills": { "skill_id": 85 }, // A dictionary of relevant tech skill IDs (lowercase, underscores) mapping to a proficiency score (0-100) based on how often they used it. Include ONLY genuine skills mentioned.
  "summary": "A 1-2 sentence summary of their background.",
  "experienceLevel": "Graduate / Entry Level | Mid Level | Senior Level",
  "targetRole": "The role they are best suited for (e.g. Software Engineer, Machine Learning Engineer)",
  "projects": [
    {
      "title": "Project Name",
      "description": "Short description of what they built and the tech used."
    }
  ],
  "experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "duration": "e.g., Jan 2020 - Present"
    }
  ]
}

Parse this resume text:
"""
${text}
"""
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = result.response.text();
    const parsedJson = JSON.parse(responseText);

    // Map the returned JSON to our ParsedResume structure
    const parsedResume: ParsedResume = {
      fileName,
      parsedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      candidateName: parsedJson.candidateName || 'Candidate',
      headline: parsedJson.headline || 'Software Engineer',
      extractedSkills: parsedJson.extractedSkills || {},
      summary: parsedJson.summary || 'Resume parsed successfully.',
      experienceLevel: parsedJson.experienceLevel || 'Entry Level',
      targetRole: parsedJson.targetRole || 'Software Engineer',
      projects: parsedJson.projects || [],
      experience: parsedJson.experience || [],
    };

    return parsedResume;
  } catch (error) {
    console.error('Gemini Resume Parsing Error:', error);
    throw new Error('Failed to parse resume using AI.');
  }
}
