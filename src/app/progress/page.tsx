"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Flame,
  Target,
  TrendingUp,
  Award,
  BookOpen,
} from "lucide-react";
import { getProgress, type ProgressMap } from "@/lib/srs";
import words from "@/data/words.json";

const BOX_LABELS = ["New", "Learning", "Familiar", "Getting it", "Almost there", "Mastered"];
const BOX_COLORS = ["bg-gray-500", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-400", "bg-green-600"];

interface Stats {
  totalWords: number;
  wordsStudied: number;
  dueToday: number;
  masteredCount: number;
  boxCounts: number[];
}

function computeStats(progress: ProgressMap): Stats {
  const today = new Date().toISOString().slice(0, 10);
  const totalWords = words.length;
  const boxCounts = [0, 0, 0, 0, 0, 0]; // box 0–5

  let wordsStudied = 0;
  let dueToday = 0;
  let masteredCount = 0;

  for (const w of words) {
    const p = progress[w.id];
    if (!p) {
      boxCounts[0]++;
      dueToday++;
    } else {
      wordsStudied++;
      boxCounts[p.box]++;
      if (p.nextReview <= today) dueToday++;
      if (p.box >= 4) masteredCount++;
    }
  }

  return { totalWords, wordsStudied, dueToday, masteredCount, boxCounts };
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color = "text-blue-400",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
      <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
        {icon}
        {label}
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

function MasteryRing({ pct, size = 120 }: { pct: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - pct * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#374151"
          strokeWidth={10}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#22c55e"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">{Math.round(pct * 100)}%</span>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [progress, setProgressData] = useState<ProgressMap>({});

  useEffect(() => {
    const p = getProgress();
    setProgressData(p);
    setStats(computeStats(p));
  }, []);

  if (!stats) return null;

  const masteryPct = stats.totalWords > 0 ? stats.masteredCount / stats.totalWords : 0;

  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Progress Tracker</h1>
      <p className="text-gray-400 text-sm mb-8">Your learning stats at a glance.</p>

      {/* Stats row */}
      <div className="w-full max-w-2xl grid grid-cols-2 gap-4 mb-8">
        <StatCard
          icon={<BookOpen size={16} />}
          label="Words Studied"
          value={`${stats.wordsStudied}`}
          sub={`of ${stats.totalWords} total`}
          color="text-purple-400"
        />
        <StatCard
          icon={<Target size={16} />}
          label="Due Today"
          value={`${stats.dueToday}`}
          color="text-blue-400"
        />
        <StatCard
          icon={<Award size={16} />}
          label="Mastered"
          value={`${stats.masteredCount}`}
          sub="Box 4+ words"
          color="text-green-400"
        />
        <StatCard
          icon={<Flame size={16} />}
          label="Progress"
          value={`${Math.round(masteryPct * 100)}%`}
          sub="mastery rate"
          color="text-orange-400"
        />
      </div>

      {/* Mastery ring + Box distribution */}
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4 self-start">Overall Mastery</h2>
          <MasteryRing pct={masteryPct} size={140} />
          <p className="text-sm text-gray-400 mt-3">
            {stats.masteredCount} of {stats.totalWords} words mastered
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Box Distribution</h2>
          <div className="space-y-3">
            {stats.boxCounts.map((count, box) => {
              const pct = stats.totalWords > 0 ? (count / stats.totalWords) * 100 : 0;
              return (
                <div key={box} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 w-24 shrink-0">
                    {BOX_LABELS[box]}
                  </span>
                  <div className="flex-1 h-5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${BOX_COLORS[box]} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Word list by box */}
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-gray-400" />
          <h2 className="text-lg font-semibold">All Words</h2>
        </div>
        <div className="space-y-2">
          {words.map((w) => {
            const p = progress[w.id];
            const box = p ? p.box : 0;
            return (
              <div key={w.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <div>
                  <span className="font-medium">{w.word}</span>
                  <span className="text-gray-500 text-sm ml-2">{w.definition}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${BOX_COLORS[box]} text-white`}>
                  {BOX_LABELS[box]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Link
        href="/"
        className="text-gray-500 hover:text-gray-300 text-sm transition"
      >
        ← Back to Browse
      </Link>
    </main>
  );
}
