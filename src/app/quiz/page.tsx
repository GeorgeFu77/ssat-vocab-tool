"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import words from "@/data/words.json";
import { getDueWordIds, recordAnswer } from "@/lib/srs";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateChoices(correctWord: typeof words[0], allWords: typeof words) {
  const others = shuffle(allWords.filter((w) => w.id !== correctWord.id)).slice(0, 3);
  return shuffle([correctWord, ...others]);
}

export default function QuizPage() {
  const [dueWords, setDueWords] = useState<typeof words>([]);
  const [current, setCurrent] = useState(0);
  const [choices, setChoices] = useState<typeof words>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<{ correct: number; wrong: number }>({
    correct: 0,
    wrong: 0,
  });
  const [finished, setFinished] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const setupChoices = useCallback(
    (index: number, due: typeof words) => {
      setChoices(generateChoices(due[index], words));
      setSelected(null);
    },
    []
  );

  useEffect(() => {
    const dueIds = getDueWordIds(words.map((w) => w.id));
    const due = shuffle(words.filter((w) => dueIds.includes(w.id)));
    setDueWords(due);
    if (due.length > 0) setupChoices(0, due);
    setLoaded(true);
  }, [setupChoices]);

  if (!loaded) return null;

  if (dueWords.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Nothing to quiz!</h1>
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
        <h1 className="text-2xl font-bold mb-4">Quiz Complete!</h1>
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

  const handleSelect = (choiceId: number) => {
    if (selected !== null) return; // already answered
    setSelected(choiceId);
    const correct = choiceId === word.id;
    recordAnswer(word.id, correct);
    setResults((r) => ({
      correct: r.correct + (correct ? 1 : 0),
      wrong: r.wrong + (correct ? 0 : 1),
    }));

    setTimeout(() => {
      if (current + 1 >= dueWords.length) {
        setFinished(true);
      } else {
        const next = current + 1;
        setCurrent(next);
        setupChoices(next, dueWords);
      }
    }, 1000);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Quiz Mode</h1>
      <p className="text-gray-400 text-sm mb-8">
        Question {current + 1} of {dueWords.length}
      </p>

      <div className="w-full max-w-lg bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-8 mb-8">
        <p className="text-sm uppercase tracking-widest text-gray-400 mb-3">
          {word.partOfSpeech}
        </p>
        <p className="text-xl font-semibold">{word.definition}</p>
      </div>

      <div className="w-full max-w-lg grid grid-cols-2 gap-3">
        {choices.map((c) => {
          let style = "bg-gray-800 hover:bg-gray-700 border-gray-700";
          if (selected !== null) {
            if (c.id === word.id) {
              style = "bg-green-900 border-green-700";
            } else if (c.id === selected) {
              style = "bg-red-900 border-red-700";
            } else {
              style = "bg-gray-800 border-gray-700 opacity-50";
            }
          }
          return (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className={`border rounded-xl px-4 py-4 text-lg font-medium transition ${style}`}
            >
              {c.word}
            </button>
          );
        })}
      </div>

      <Link
        href="/"
        className="text-gray-500 hover:text-gray-300 text-sm mt-8 transition"
      >
        ← Back to Browse
      </Link>
    </main>
  );
}
