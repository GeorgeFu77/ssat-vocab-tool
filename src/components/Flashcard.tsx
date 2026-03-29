"use client";

import { clsx } from "clsx";
import LeitnerBoxIndicator from "./LeitnerBoxIndicator";

interface FlashcardProps {
  word: string;
  definition: string;
  exampleSentence?: string | null;
  synonyms?: string[];
  partOfSpeech?: string;
  box?: number;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function Flashcard({
  word,
  definition,
  exampleSentence,
  synonyms = [],
  partOfSpeech,
  box,
  isFlipped,
  onFlip,
}: FlashcardProps) {
  return (
    <div
      className="flip-card w-full max-w-lg mx-auto cursor-pointer select-none"
      style={{ minHeight: "320px" }}
      onClick={onFlip}
    >
      <div className={clsx("flip-card-inner w-full", isFlipped && "flipped")} style={{ minHeight: "320px" }}>
        {/* Front */}
        <div className="flip-card-front w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center justify-center" style={{ minHeight: "320px" }}>
          {box && (
            <div className="absolute top-4 right-4">
              <LeitnerBoxIndicator currentBox={box} />
            </div>
          )}
          <p className="text-4xl font-bold text-gray-900 mb-3">{word}</p>
          {partOfSpeech && (
            <p className="text-sm text-gray-400 italic">{partOfSpeech}</p>
          )}
          <p className="text-xs text-gray-300 mt-6">Tap to reveal</p>
        </div>

        {/* Back */}
        <div className="flip-card-back w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col justify-center" style={{ minHeight: "320px" }}>
          {box && (
            <div className="absolute top-4 right-4">
              <LeitnerBoxIndicator currentBox={box} />
            </div>
          )}
          <p className="text-lg font-semibold text-gray-800 mb-1">{word}</p>
          <p className="text-base text-gray-700 mb-4">{definition}</p>
          {exampleSentence && (
            <p className="text-sm text-gray-500 italic mb-4">
              &ldquo;{exampleSentence}&rdquo;
            </p>
          )}
          {synonyms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {synonyms.map((s) => (
                <span
                  key={s}
                  className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
