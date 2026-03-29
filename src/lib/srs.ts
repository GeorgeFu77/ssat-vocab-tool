const STORAGE_KEY = "ssat-srs-progress";

const BOX_INTERVALS = [1, 3, 7, 14, 30]; // days per box (0-indexed)

export interface WordProgress {
  box: number; // 0–4
  lastReviewed: string; // ISO date string
  nextReview: string; // ISO date string
}

export type ProgressMap = Record<number, WordProgress>;

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function getProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function saveProgress(progress: ProgressMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/** Return IDs of words that are due today (or overdue), plus any unseen words. */
export function getDueWordIds(allWordIds: number[]): number[] {
  const progress = getProgress();
  const today = todayStr();

  return allWordIds.filter((id) => {
    const p = progress[id];
    if (!p) return true; // never seen → due
    return p.nextReview <= today;
  });
}

/** Record a study result and persist it. Returns the updated progress for the word. */
export function recordAnswer(wordId: number, correct: boolean): WordProgress {
  const progress = getProgress();
  const today = todayStr();
  const prev = progress[wordId];

  let newBox: number;
  if (!correct) {
    newBox = 0;
  } else {
    newBox = prev ? Math.min(prev.box + 1, BOX_INTERVALS.length - 1) : 1;
  }

  const entry: WordProgress = {
    box: newBox,
    lastReviewed: today,
    nextReview: addDays(today, BOX_INTERVALS[newBox]),
  };

  progress[wordId] = entry;
  saveProgress(progress);
  return entry;
}
