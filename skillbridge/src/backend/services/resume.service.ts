/**
 * Resume Parsing Service
 * Extracts skills, education, and target roles from text or pre-parsed resumes.
 */

import { parseResumeText, SAMPLE_RESUMES } from '@/lib/ai/resume-parser';

export class ResumeService {
  /**
   * Parses raw plain text resume into structured data with extracted skills.
   */
  static parseText(text: string, fileName?: string) {
    return parseResumeText(text, fileName);
  }

  /**
   * Retrieves sample resumes for quick testing.
   */
  static getSampleResumes() {
    return SAMPLE_RESUMES;
  }
}
