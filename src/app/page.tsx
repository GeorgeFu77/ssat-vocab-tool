"use client";

import { useState } from "react";
import Link from "next/link";
import Flashcard from "@/components/Flashcard";
import words from "@/data/words.json";

export default function Home() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i > 0 ? i - 1 : words.length - 1));
  const next = () => setIndex((i) => (i < words.length - 1 ? i + 1 : 0));

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">SSAT Vocab Flashcards</h1>

      <Flashcard key={words[index].id} word={words[index]} />

      <div className="flex items-center gap-6 mt-8">
        <button
          onClick={prev}
          className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-5 py-2 rounded-lg transition"
        >
          Previous
        </button>
        <span className="text-gray-400 text-sm">
          {index + 1} / {words.length}
        </span>
        <button
          onClick={next}
          className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-5 py-2 rounded-lg transition"
        >
          Next
        </button>
      </div>

      <p className="text-gray-600 text-xs mt-6">
        Press the card to flip it
      </p>

      <div className="flex gap-4 mt-8">
        <Link
          href="/study"
          className="bg-indigo-700 hover:bg-indigo-600 px-6 py-3 rounded-lg transition font-semibold"
        >
          Study
        </Link>
        <Link
          href="/quiz"
          className="bg-emerald-700 hover:bg-emerald-600 px-6 py-3 rounded-lg transition font-semibold"
        >
          Quiz
        </Link>
      </div>
    </main>
  );
}
