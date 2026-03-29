"use client";

import { useState } from "react";

interface Word {
  id: number;
  word: string;
  definition: string;
  exampleSentence: string;
  synonyms: string[];
  partOfSpeech: string;
}

export default function Flashcard({ word }: { word: Word }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="flip-card w-full max-w-lg h-80 cursor-pointer select-none"
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`flip-card-inner relative w-full h-full ${flipped ? "flipped" : ""}`}>
        {/* Front */}
        <div className="flip-card-front absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gray-800 border border-gray-700 shadow-lg px-8">
          <span className="text-sm uppercase tracking-widest text-gray-400 mb-2">
            {word.partOfSpeech}
          </span>
          <h2 className="text-4xl font-bold">{word.word}</h2>
          <p className="text-gray-500 mt-6 text-sm">Tap to reveal</p>
        </div>

        {/* Back */}
        <div className="flip-card-back absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gray-800 border border-gray-700 shadow-lg px-8 text-center">
          <p className="text-xl font-semibold mb-3">{word.definition}</p>
          <p className="text-gray-400 italic text-sm mb-4">
            &ldquo;{word.exampleSentence}&rdquo;
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {word.synonyms.map((s) => (
              <span
                key={s}
                className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
