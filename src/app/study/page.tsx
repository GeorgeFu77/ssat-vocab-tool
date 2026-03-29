"use client";

import { useEffect, useState } from "react";
import FlashcardDeck from "@/components/FlashcardDeck";
import type { WordData } from "@/types";

export default function StudyPage() {
  const [words, setWords] = useState<(WordData & { box?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (difficulty) params.set("difficulty", difficulty);
    if (search) params.set("search", search);
    params.set("limit", "500");

    fetch(`/api/words?${params}`)
      .then((r) => r.json())
      .then((data) => {
        const mapped = data.words.map(
          (w: WordData & { progress?: { box: number } | null }) => ({
            ...w,
            box: w.progress?.box,
          })
        );
        setWords(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [difficulty, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Study Mode</h1>
        <p className="text-gray-500 text-sm mt-1">
          Browse flashcards freely. Use arrow keys or buttons to navigate,
          spacebar to flip.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search words..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Levels</option>
          <option value="1">Easy (Lower)</option>
          <option value="2">Medium (Middle)</option>
          <option value="3">Hard (Upper)</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <FlashcardDeck words={words} mode="study" />
      )}
    </div>
  );
}
