"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, RotateCcw } from "lucide-react";
import { BOX_COLORS, BOX_LABELS } from "@/lib/constants";

interface Stats {
  boxCounts: Record<number, number>;
  totalWords: number;
  wordsReviewedToday: number;
  dueNow: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/review/stats?userId=1")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const maxCount = Math.max(...Object.values(stats.boxCounts), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-500 mt-1">
          You have {stats.totalWords} words in your vocabulary bank.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.dueNow}</p>
          <p className="text-sm text-gray-500 mt-1">Due for review</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
          <p className="text-3xl font-bold text-green-600">
            {stats.wordsReviewedToday}
          </p>
          <p className="text-sm text-gray-500 mt-1">Reviewed today</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
          <p className="text-3xl font-bold text-amber-600">
            {stats.boxCounts[5] || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Mastered</p>
        </div>
      </div>

      {/* Box distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Your Progress
        </h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((box) => {
            const count = stats.boxCounts[box] || 0;
            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
            return (
              <div key={box} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-24 shrink-0">
                  Box {box}: {BOX_LABELS[box]}
                </span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${BOX_COLORS[box]} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-10 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/study"
          className="flex items-center justify-center gap-2 bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:bg-gray-50 transition font-medium text-gray-700"
        >
          <BookOpen size={20} />
          Study All Words
        </Link>
        <Link
          href="/review"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-xl shadow-sm p-5 hover:bg-blue-700 transition font-medium"
        >
          <RotateCcw size={20} />
          Start Review ({stats.dueNow} due)
        </Link>
      </div>
    </div>
  );
}
