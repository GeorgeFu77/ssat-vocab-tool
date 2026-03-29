export interface WordData {
  id: number;
  word: string;
  definition: string;
  exampleSentence: string | null;
  synonyms: string[];
  partOfSpeech: string;
  difficulty: number;
  tags: string[];
}

export interface WordProgress {
  id: number;
  userId: number;
  wordId: number;
  box: number;
  nextReviewDate: string;
  lastReviewDate: string | null;
  correctStreak: number;
  totalReviews: number;
  totalCorrect: number;
}

export interface WordWithProgress extends WordData {
  progress?: WordProgress;
}

export interface ReviewQueueItem {
  id: number;
  box: number;
  nextReviewDate: string;
  word: WordData;
}

export interface ReviewStats {
  boxCounts: Record<number, number>;
  totalWords: number;
  wordsReviewedToday: number;
  dueNow: number;
}

export interface SessionSummary {
  wordsReviewed: number;
  correctCount: number;
  accuracy: number;
}
