"use client";

import { useEffect, useState, useCallback } from "react";
import FlashcardDeck from "@/components/FlashcardDeck";
import type { WordData } from "@/types";

interface ReviewWord extends WordData {
  box: number;
  progressId: number;
}

export default function ReviewPage() {
  const [words, setWords] = useState<ReviewWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalDue, setTotalDue] = useState(0);

  const fetchQueue = useCallback(() => {
    setLoading(true);
    fetch("/api/review?userId=1&limit=20")
      .then((r) => r.json())
      .then((data) => {
        const mapped: ReviewWord[] = data.queue.map(
          (item: { id: number; box: number; word: WordData }) => ({
            ...item.word,
            box: item.box,
            progressId: item.id,
          })
        );
        setWords(mapped);
        setTotalDue(data.totalDue);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const handleReviewResult = async (wordId: number, isCorrect: boolean) => {
    const res = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 1, wordId, isCorrect }),
    });
    if (res.ok) {
      return res.json();
    }
    return undefined;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Review</h1>
        <p className="text-gray-500 text-sm mt-1">
          {totalDue > 0
            ? `${totalDue} words due for review. Flip the card, then mark "Got it" or "Still learning".`
            : "No words due right now!"}
        </p>
      </div>

      <FlashcardDeck
        words={words}
        mode="review"
        onReviewResult={handleReviewResult}
        onSessionComplete={() => {}}
      />

      {words.length === 0 && !loading && (
        <div className="text-center text-sm text-gray-400 mt-4">
          Tip: Words move through 5 boxes. As you get them right, they appear
          less often. Get one wrong, and it goes back to Box 1 for more
          practice.
        </div>
      )}
    </div>
  );
}
