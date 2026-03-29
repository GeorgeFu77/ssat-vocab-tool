"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import LeitnerBoxIndicator from "@/components/LeitnerBoxIndicator";
import type { WordData } from "@/types";

interface WordWithBox extends WordData {
  progress?: { box: number } | null;
}

export default function WordsPage() {
  const [words, setWords] = useState<WordWithBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (difficulty) params.set("difficulty", difficulty);
    params.set("page", String(page));
    params.set("limit", "30");

    fetch(`/api/words?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setWords(data.words);
        setTotalPages(data.totalPages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, difficulty, page]);

  const difficultyLabel = (d: number) =>
    d === 1 ? "Easy" : d === 2 ? "Medium" : "Hard";

  const difficultyColor = (d: number) =>
    d === 1
      ? "bg-green-100 text-green-700"
      : d === 2
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Word Bank</h1>
        <p className="text-gray-500 text-sm mt-1">
          Browse and search all vocabulary words.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search words..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
            setPage(1);
          }}
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
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Word</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">
                    Definition
                  </th>
                  <th className="px-4 py-3 font-medium w-20">Level</th>
                  <th className="px-4 py-3 font-medium w-20">Box</th>
                </tr>
              </thead>
              <tbody>
                {words.map((w) => (
                  <>
                    <tr
                      key={w.id}
                      className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition"
                      onClick={() =>
                        setExpandedId(expandedId === w.id ? null : w.id)
                      }
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {w.word}
                        <span className="text-gray-400 text-xs ml-2 italic">
                          {w.partOfSpeech}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden sm:table-cell truncate max-w-xs">
                        {w.definition}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${difficultyColor(w.difficulty)}`}
                        >
                          {difficultyLabel(w.difficulty)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {w.progress && (
                          <LeitnerBoxIndicator currentBox={w.progress.box} />
                        )}
                      </td>
                    </tr>
                    {expandedId === w.id && (
                      <tr key={`${w.id}-expanded`}>
                        <td
                          colSpan={4}
                          className="px-4 py-3 bg-blue-50/50 text-sm"
                        >
                          <p className="sm:hidden text-gray-700 mb-2">
                            <strong>Definition:</strong> {w.definition}
                          </p>
                          {w.exampleSentence && (
                            <p className="text-gray-600 italic mb-2">
                              &ldquo;{w.exampleSentence}&rdquo;
                            </p>
                          )}
                          {w.synonyms.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                              <span className="text-gray-500">Synonyms:</span>
                              {w.synonyms.map((s: string) => (
                                <span
                                  key={s}
                                  className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 bg-white"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 bg-white"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
