"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Flashcard from "@/components/Flashcard";
import words from "@/data/words.json";
import { getDueWordIds, recordAnswer } from "@/lib/srs";

export default function StudyPage() {
  const [dueWords, setDueWords] = useState<typeof words>([]);
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState<{ correct: number; wrong: number }>({
    correct: 0,
    wrong: 0,
  });
  const [finished, setFinished] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const dueIds = getDueWordIds(words.map((w) => w.id));
    setDueWords(words.filter((w) => dueIds.includes(w.id)));
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (dueWords.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Nothing to study!</h1>
        <p className="text-gray-400 mb-8">All words are reviewed. Come back later.</p>
        <Link
          href="/"
          className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-5 py-2 rounded-lg transition"
        >
          Back to Browse
        </Link>
      </main>
    );
  }

  if (finished) {
    const total = results.correct + results.wrong;
    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Session Complete!</h1>
        <p className="text-lg text-gray-300 mb-2">
          {results.correct} / {total} correct
        </p>
        {results.wrong > 0 && (
          <p className="text-gray-400 mb-6">
            {results.wrong} word{results.wrong > 1 ? "s" : ""} moved back to Box 1
          </p>
        )}
        <Link
          href="/"
          className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-5 py-2 rounded-lg transition"
        >
          Back to Browse
        </Link>
      </main>
    );
  }

  const word = dueWords[current];

  const handleResult = (correct: boolean) => {
    recordAnswer(word.id, correct);
    setResults((r) => ({
      correct: r.correct + (correct ? 1 : 0),
      wrong: r.wrong + (correct ? 0 : 1),
    }));
    if (current + 1 >= dueWords.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Study Mode</h1>
      <p className="text-gray-400 text-sm mb-8">
        Card {current + 1} of {dueWords.length}
      </p>

      <Flashcard
        key={word.id}
        word={word}
        onResult={handleResult}
      />

      <Link
        href="/"
        className="text-gray-500 hover:text-gray-300 text-sm mt-8 transition"
      >
        ← Back to Browse
      </Link>
    </main>
  );
}
