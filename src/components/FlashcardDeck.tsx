"use client";

import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import Flashcard from "./Flashcard";
import ProgressBar from "./ProgressBar";
import type { WordData } from "@/types";

interface DeckWord extends WordData {
  progressId?: number;
  box?: number;
}

interface FlashcardDeckProps {
  words: DeckWord[];
  mode: "study" | "review";
  onReviewResult?: (
    wordId: number,
    isCorrect: boolean
  ) => Promise<{ previousBox: number; newBox: number } | undefined>;
  onSessionComplete?: () => void;
}

export default function FlashcardDeck({
  words,
  mode,
  onReviewResult,
  onSessionComplete,
}: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [transition, setTransition] = useState<{
    word: string;
    from: number;
    to: number;
  } | null>(null);
  const [done, setDone] = useState(false);

  const currentWord = words[currentIndex];

  const flip = useCallback(() => setIsFlipped((f) => !f), []);

  const goNext = useCallback(() => {
    if (currentIndex < words.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, words.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const handleReview = useCallback(
    async (isCorrect: boolean) => {
      if (!currentWord || !onReviewResult) return;

      const result = await onReviewResult(currentWord.id, isCorrect);
      setReviewed((r) => r + 1);
      if (isCorrect) setCorrect((c) => c + 1);

      if (result) {
        setTransition({
          word: currentWord.word,
          from: result.previousBox,
          to: result.newBox,
        });
        setTimeout(() => setTransition(null), 2000);
      }

      if (currentIndex < words.length - 1) {
        setTimeout(() => {
          setIsFlipped(false);
          setCurrentIndex((i) => i + 1);
        }, 300);
      } else {
        setDone(true);
        onSessionComplete?.();
      }
    },
    [currentWord, currentIndex, words.length, onReviewResult, onSessionComplete]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        flip();
      } else if (e.key === "ArrowRight") {
        if (mode === "study") goNext();
      } else if (e.key === "ArrowLeft") {
        if (mode === "study") goPrev();
      } else if (mode === "review" && isFlipped) {
        if (e.key === "1" || e.key === "ArrowRight") {
          handleReview(true);
        } else if (e.key === "2" || e.key === "ArrowLeft") {
          handleReview(false);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flip, goNext, goPrev, handleReview, isFlipped, mode]);

  if (words.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-2xl font-semibold text-gray-700 mb-2">
          {mode === "review" ? "All caught up!" : "No words found"}
        </p>
        <p className="text-gray-500">
          {mode === "review"
            ? "You have no words due for review right now. Come back later!"
            : "Try adjusting your filters."}
        </p>
      </div>
    );
  }

  if (done) {
    const accuracy =
      reviewed > 0 ? Math.round((correct / reviewed) * 100) : 0;
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <p className="text-3xl font-bold text-gray-800 mb-2">Session Complete!</p>
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-6 space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">{reviewed}</p>
              <p className="text-sm text-gray-500">Reviewed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{correct}</p>
              <p className="text-sm text-gray-500">Correct</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-600">{accuracy}%</p>
              <p className="text-sm text-gray-500">Accuracy</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <ProgressBar
        current={mode === "review" ? reviewed : currentIndex + 1}
        total={words.length}
      />

      <div className="mt-6 relative">
        <Flashcard
          word={currentWord.word}
          definition={currentWord.definition}
          exampleSentence={currentWord.exampleSentence}
          synonyms={currentWord.synonyms}
          partOfSpeech={currentWord.partOfSpeech}
          box={currentWord.box}
          isFlipped={isFlipped}
          onFlip={flip}
        />

        {/* Box transition toast */}
        {transition && (
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-4 py-2 rounded-lg shadow-lg animate-pulse">
            <span className="font-medium">{transition.word}</span>: Box{" "}
            {transition.from} → Box {transition.to}
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        {mode === "study" ? (
          <>
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="p-3 rounded-full bg-white shadow border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="text-sm text-gray-500 min-w-[80px] text-center">
              {currentIndex + 1} / {words.length}
            </span>
            <button
              onClick={goNext}
              disabled={currentIndex === words.length - 1}
              className="p-3 rounded-full bg-white shadow border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={24} />
            </button>
          </>
        ) : (
          isFlipped && (
            <>
              <button
                onClick={() => handleReview(false)}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-700 rounded-xl font-medium hover:bg-red-100 transition border border-red-200"
              >
                <X size={20} />
                Still learning
              </button>
              <button
                onClick={() => handleReview(true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100 transition border border-green-200"
              >
                <Check size={20} />
                Got it!
              </button>
            </>
          )
        )}
      </div>

      {mode === "review" && !isFlipped && (
        <p className="text-center text-sm text-gray-400 mt-4">
          Tap the card or press Space to reveal the answer
        </p>
      )}
    </div>
  );
}
