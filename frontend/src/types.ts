export interface Question {
  id: string;
  question: string;
  answer: string;
  category: string;
  lastRecall?: Date;
  recallRate?: 'Low' | 'Medium' | 'High';
}

export interface Kit {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  mastery: number;
  lastSession?: Date;
  cardCount: number;
  icon: string;
  color: string;
}

export interface SessionResult {
  id: string;
  kitId: string;
  date: Date;
  accuracy: number;
  correctCount: number;
  incorrectCount: number;
  duration: string;
  weakQuestions: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
  }[];
}

export interface ProgressData {
  totals: {
    sources: number;
    questions: number;
    sessions: number;
    attempts: number;
  };
  outcomes: {
    exact: number;
    accent_near: number;
    typo_near: number;
    correct_after_retry: number;
    incorrect: number;
  };
  weakQuestions: Array<{
    questionId: string;
    prompt: string;
    recentErrorCount: number;
    nearMissCount: number;
  }>;
}
