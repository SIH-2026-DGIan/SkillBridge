export interface AssessmentQuestion {
  id: string;
  skillId: string;
  category: 'technical' | 'soft';
  question: string;
  options: string[];
  correctAnswer: number; // index into options
  difficulty: 'easy' | 'medium' | 'hard';
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // Python (3 questions)
  {
    id: 'q1',
    skillId: 'python',
    category: 'technical',
    question: 'What is the output of: list(map(lambda x: x**2, [1,2,3]))?',
    options: ['[1, 4, 9]', '[2, 4, 6]', '[1, 2, 3]', 'Error'],
    correctAnswer: 0,
    difficulty: 'easy',
  },
  {
    id: 'q2',
    skillId: 'python',
    category: 'technical',
    question: 'Which Python library is most commonly used for numerical computing?',
    options: ['Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn'],
    correctAnswer: 1,
    difficulty: 'easy',
  },
  {
    id: 'q3',
    skillId: 'python',
    category: 'technical',
    question: 'What does a Python decorator do?',
    options: [
      'Adds color to terminal output',
      'Wraps a function to modify its behavior',
      'Compiles Python to bytecode',
      'Creates a new Python class',
    ],
    correctAnswer: 1,
    difficulty: 'medium',
  },

  // SQL (2 questions)
  {
    id: 'q4',
    skillId: 'sql',
    category: 'technical',
    question: 'Which SQL clause is used to filter groups in a GROUP BY query?',
    options: ['WHERE', 'FILTER', 'HAVING', 'LIMIT'],
    correctAnswer: 2,
    difficulty: 'medium',
  },
  {
    id: 'q5',
    skillId: 'sql',
    category: 'technical',
    question: 'What type of JOIN returns all rows from the left table and matching rows from the right?',
    options: ['INNER JOIN', 'RIGHT JOIN', 'LEFT JOIN', 'FULL JOIN'],
    correctAnswer: 2,
    difficulty: 'easy',
  },

  // Machine Learning (3 questions)
  {
    id: 'q6',
    skillId: 'machine_learning',
    category: 'technical',
    question: 'What is overfitting in a machine learning model?',
    options: [
      'Model performs poorly on training data',
      'Model memorizes training data but generalizes poorly',
      'Model has too few parameters',
      'Model trains too slowly',
    ],
    correctAnswer: 1,
    difficulty: 'easy',
  },
  {
    id: 'q7',
    skillId: 'machine_learning',
    category: 'technical',
    question: 'Which algorithm is used for dimensionality reduction?',
    options: ['K-Means', 'Random Forest', 'PCA', 'SVM'],
    correctAnswer: 2,
    difficulty: 'medium',
  },
  {
    id: 'q8',
    skillId: 'machine_learning',
    category: 'technical',
    question: 'What metric is most appropriate for evaluating a binary classification model with class imbalance?',
    options: ['Accuracy', 'F1-Score', 'Mean Squared Error', 'R²'],
    correctAnswer: 1,
    difficulty: 'hard',
  },

  // React (2 questions)
  {
    id: 'q9',
    skillId: 'react',
    category: 'technical',
    question: 'What React hook is used to perform side effects in functional components?',
    options: ['useState', 'useContext', 'useEffect', 'useReducer'],
    correctAnswer: 2,
    difficulty: 'easy',
  },
  {
    id: 'q10',
    skillId: 'react',
    category: 'technical',
    question: 'What is the Virtual DOM in React?',
    options: [
      'A real browser DOM element',
      'An in-memory representation of the real DOM',
      'A CSS styling framework',
      'A JavaScript bundler',
    ],
    correctAnswer: 1,
    difficulty: 'easy',
  },

  // Data Analysis (1 question)
  {
    id: 'q11',
    skillId: 'data_analysis',
    category: 'technical',
    question: 'In pandas, which method drops rows with missing values?',
    options: ['df.remove()', 'df.dropna()', 'df.clean()', 'df.fillna()'],
    correctAnswer: 1,
    difficulty: 'easy',
  },

  // Git (1 question)
  {
    id: 'q12',
    skillId: 'git',
    category: 'technical',
    question: 'What does "git rebase" do?',
    options: [
      'Creates a new branch',
      'Merges two branches with a merge commit',
      'Reapplies commits on top of another base commit',
      'Deletes the current branch',
    ],
    correctAnswer: 2,
    difficulty: 'hard',
  },

  // Soft Skills (3 questions)
  {
    id: 'q13',
    skillId: 'communication',
    category: 'soft',
    question:
      'You are presenting a complex technical concept to a non-technical audience. What is the best approach?',
    options: [
      'Use as much technical jargon as possible to appear credible',
      'Use analogies, visuals, and simple language to convey key ideas',
      'Skip the presentation and send a written report instead',
      'Present only to technical team members',
    ],
    correctAnswer: 1,
    difficulty: 'easy',
  },
  {
    id: 'q14',
    skillId: 'problem_solving',
    category: 'soft',
    question:
      'When faced with a problem you cannot solve immediately, what is the most effective first step?',
    options: [
      'Give up and ask someone else to solve it',
      'Try random solutions until something works',
      'Break the problem into smaller sub-problems and identify root causes',
      'Escalate immediately without attempting a solution',
    ],
    correctAnswer: 2,
    difficulty: 'medium',
  },
  {
    id: 'q15',
    skillId: 'teamwork',
    category: 'soft',
    question:
      'A team member disagrees strongly with your approach. What is the best response?',
    options: [
      'Ignore them and proceed with your plan',
      'Immediately adopt their approach to avoid conflict',
      'Listen to their concerns, discuss trade-offs, and find a mutually agreed solution',
      'Report them to the manager',
    ],
    correctAnswer: 2,
    difficulty: 'easy',
  },
];

// Skill → base score for demo mode (if no assessment taken)
export const SKILL_BASE_SCORES: Record<string, number> = {
  python: 82,
  sql: 76,
  react: 68,
  machine_learning: 54,
  data_analysis: 60,
  git: 75,
  javascript: 65,
  statistics: 58,
  communication: 74,
  problem_solving: 78,
  teamwork: 72,
};

/**
 * Calculate skill scores from assessment answers.
 * Returns a map of skillId -> score (0-100)
 */
export function calculateSkillScores(
  answers: Record<string, number>
): Record<string, number> {
  // Group questions by skill
  const skillQuestions: Record<string, AssessmentQuestion[]> = {};
  for (const q of ASSESSMENT_QUESTIONS) {
    if (!skillQuestions[q.skillId]) skillQuestions[q.skillId] = [];
    skillQuestions[q.skillId].push(q);
  }

  const scores: Record<string, number> = {};

  for (const [skillId, questions] of Object.entries(skillQuestions)) {
    let correct = 0;
    let total = 0;
    for (const q of questions) {
      if (answers[q.id] !== undefined) {
        total++;
        if (answers[q.id] === q.correctAnswer) correct++;
      }
    }

    if (total === 0) continue;

    // Base score: 40% + up to 55% from correct answers
    // This gives a 40-95 range, making even 0/3 non-zero
    const rawScore = correct / total;
    const difficultBonus = questions.reduce((sum, q) => {
      const bonuses = { easy: 0, medium: 5, hard: 10 };
      return sum + (answers[q.id] === q.correctAnswer ? bonuses[q.difficulty] : 0);
    }, 0);

    scores[skillId] = Math.min(
      95,
      Math.round(35 + rawScore * 55 + difficultBonus / questions.length)
    );
  }

  return scores;
}
