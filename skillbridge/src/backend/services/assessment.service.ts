/**
 * Assessment Service
 * Computes skill proficiency scores and evaluates MCQ responses.
 */

import { calculateSkillScores, ASSESSMENT_QUESTIONS } from '@/lib/assessment-questions';

export class AssessmentService {
  /**
   * Retrieves all canonical assessment questions.
   */
  static getQuestions() {
    return ASSESSMENT_QUESTIONS;
  }

  /**
   * Evaluates user responses and computes normalized skill proficiencies (0-100).
   */
  static evaluateAnswers(answers: Record<string, number>) {
    return calculateSkillScores(answers);
  }
}
