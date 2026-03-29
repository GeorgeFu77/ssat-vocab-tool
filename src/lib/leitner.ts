import { addDays } from "date-fns";
import { BOX_INTERVALS, MAX_BOX, MIN_BOX } from "./constants";

export interface ReviewResult {
  currentBox: number;
  isCorrect: boolean;
}

export interface LeitnerUpdate {
  newBox: number;
  nextReviewDate: Date;
}

/**
 * Calculate the new box and next review date after a review.
 * Correct: move to next box (max 5), schedule based on new box interval.
 * Incorrect: back to box 1, schedule for tomorrow.
 */
export function calculateLeitnerUpdate(result: ReviewResult): LeitnerUpdate {
  const now = new Date();

  if (result.isCorrect) {
    const newBox = Math.min(result.currentBox + 1, MAX_BOX);
    return {
      newBox,
      nextReviewDate: addDays(now, BOX_INTERVALS[newBox]),
    };
  }

  return {
    newBox: MIN_BOX,
    nextReviewDate: addDays(now, BOX_INTERVALS[MIN_BOX]),
  };
}
