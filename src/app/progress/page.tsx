"use client";

import { useEffect, useState } from "react";
import {
  Flame,
  Target,
  TrendingUp,
  BookOpen,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle,
} from "lucide-react";
import { BOX_COLORS, BOX_LABELS } from "@/lib/constants";

interface ProgressData {
  overview: {
    totalWords: number;
    wordsInStudy: number;
    totalReviews: number;
    totalCorrect: number;
    overallAccuracy: number;
    masteredCount: number;
    masteryPct: number;
    streak: number;
  };
  boxCounts: Record<number, number>;
  accuracyByDifficulty: {
    difficulty: number;
    label: string;
    accuracy: number;
    totalReviews: number;
  }[];
  partOfSpeechStats: {
    partOfSpeech: string;
    total: number;
    mastered: number;
    masteryPct: number;
  }[];
  dailyActivity: {
    date: string;
    reviewed: number;
    correct: number;
  }[];
  strugglingWords: {
    word: string;
    definition: string;
    box: number;
    totalReviews: number;
    accuracy: number;
  }[];
  recentSessions: {
    id: number;
    date: string;
    wordsReviewed: number;
    correctCount: number;
    accuracy: number;
    duration: number | null;
  }[];
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color = "text-blue-600",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
        {icon}
        {label}
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function ActivityChart({ data }: { data: ProgressData["dailyActivity"] }) {
  const max = Math.max(...data.map((d) => d.reviewed), 1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Daily Activity (Last 30 Days)
      </h2>
      <div className="flex items-end gap-[3px] h-32">
        {data.map((d, i) => {
          const height = max > 0 ? (d.reviewed / max) * 100 : 0;
          const accuracy = d.reviewed > 0 ? d.correct / d.reviewed : 0;
          const dayLabel = new Date(d.date + "T12:00:00").toLocaleDateString(
            "en-US",
            { weekday: "short" }
          );
          const dateLabel = new Date(d.date + "T12:00:00").toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric" }
          );
          return (
            <div
              key={d.date}
              className="flex-1 flex flex-col items-center group relative"
            >
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                {dateLabel}: {d.reviewed} reviewed
                {d.reviewed > 0 && ` (${Math.round(accuracy * 100)}% correct)`}
              </div>
              <div
                className={`w-full rounded-t transition-all ${
                  d.reviewed === 0
                    ? "bg-gray-100"
                    : accuracy >= 0.8
                      ? "bg-green-500"
                      : accuracy >= 0.5
                        ? "bg-yellow-500"
                        : "bg-red-400"
                }`}
                style={{
                  height: `${Math.max(height, d.reviewed > 0 ? 4 : 2)}%`,
                }}
              />
              {i % 7 === 0 && (
                <span className="text-[9px] text-gray-400 mt-1">
                  {dayLabel}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-green-500" /> {">="}80%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-yellow-500" /> 50-79%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-red-400" /> {"<"}50%
        </span>
      </div>
    </div>
  );
}

function MasteryRing({
  pct,
  size = 120,
}: {
  pct: number;
  size?: number;
}) {
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
          stroke="#e5e7eb"
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
        <span className="text-2xl font-bold text-gray-800">
          {Math.round(pct * 100)}%
        </span>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);

  useEffect(() => {
    fetch("/api/progress/stats?userId=1")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const { overview } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Progress Tracker</h1>
        <p className="text-gray-500 mt-1">
          Your detailed learning analytics and study insights.
        </p>
      </div>

      {/* Top stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Flame size={16} />}
          label="Study Streak"
          value={`${overview.streak} day${overview.streak !== 1 ? "s" : ""}`}
          color="text-orange-500"
        />
        <StatCard
          icon={<Target size={16} />}
          label="Accuracy"
          value={`${Math.round(overview.overallAccuracy * 100)}%`}
          sub={`${overview.totalCorrect} / ${overview.totalReviews} correct`}
          color="text-blue-600"
        />
        <StatCard
          icon={<TrendingUp size={16} />}
          label="Total Reviews"
          value={overview.totalReviews.toLocaleString()}
          color="text-purple-600"
        />
        <StatCard
          icon={<Award size={16} />}
          label="Mastered"
          value={`${overview.masteredCount}`}
          sub={`of ${overview.wordsInStudy} words`}
          color="text-green-600"
        />
      </div>

      {/* Mastery ring + Box distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 self-start">
            Overall Mastery
          </h2>
          <MasteryRing pct={overview.masteryPct} size={140} />
          <p className="text-sm text-gray-500 mt-3">
            {overview.masteredCount} of {overview.wordsInStudy} words in Box 4+
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Box Distribution
          </h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((box) => {
              const count = data.boxCounts[box] || 0;
              const pct =
                overview.wordsInStudy > 0
                  ? (count / overview.wordsInStudy) * 100
                  : 0;
              return (
                <div key={box} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-24 shrink-0">
                    {BOX_LABELS[box]}
                  </span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${BOX_COLORS[box]} rounded-full transition-all duration-500`}
                      style={{
                        width: `${Math.max(pct, count > 0 ? 2 : 0)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-16 text-right">
                    {count}{" "}
                    <span className="text-gray-400 text-xs">
                      ({Math.round(pct)}%)
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily activity chart */}
      <ActivityChart data={data.dailyActivity} />

      {/* Accuracy by difficulty + Part of speech */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Accuracy by Difficulty
          </h2>
          <div className="space-y-4">
            {data.accuracyByDifficulty.map((d) => {
              const pct = Math.round(d.accuracy * 100);
              const barColor =
                d.difficulty === 1
                  ? "bg-green-500"
                  : d.difficulty === 2
                    ? "bg-yellow-500"
                    : "bg-red-500";
              return (
                <div key={d.difficulty}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{d.label}</span>
                    <span className="text-gray-500">
                      {pct}%{" "}
                      <span className="text-xs text-gray-400">
                        ({d.totalReviews} reviews)
                      </span>
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Mastery by Part of Speech
          </h2>
          {data.partOfSpeechStats.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet.</p>
          ) : (
            <div className="space-y-4">
              {data.partOfSpeechStats
                .sort((a, b) => b.total - a.total)
                .map((pos) => {
                  const pct = Math.round(pos.masteryPct * 100);
                  return (
                    <div key={pos.partOfSpeech}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700 capitalize">
                          {pos.partOfSpeech}s
                        </span>
                        <span className="text-gray-500">
                          {pos.mastered}/{pos.total} mastered
                        </span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Struggling words */}
      {data.strugglingWords.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-800">
              Words That Need Extra Practice
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.strugglingWords.map((w) => (
              <div
                key={w.word}
                className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100"
              >
                <div>
                  <p className="font-medium text-gray-800">{w.word}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {w.definition}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-sm font-medium text-amber-600">
                    {Math.round(w.accuracy * 100)}%
                  </p>
                  <p className="text-xs text-gray-400">
                    {w.totalReviews} reviews
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent sessions */}
      {data.recentSessions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Sessions
            </h2>
          </div>
          <div className="space-y-2">
            {data.recentSessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle
                    size={16}
                    className={
                      s.accuracy >= 0.8 ? "text-green-500" : "text-yellow-500"
                    }
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {new Date(s.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {s.wordsReviewed} words reviewed
                      {s.duration
                        ? ` in ${Math.round(s.duration / 60)}m ${s.duration % 60}s`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-bold ${
                      s.accuracy >= 0.8 ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {Math.round(s.accuracy * 100)}%
                  </p>
                  <p className="text-xs text-gray-400">
                    {s.correctCount}/{s.wordsReviewed}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary footer */}
      <div className="bg-blue-50 rounded-xl border border-blue-100 p-5 flex items-start gap-3">
        <BookOpen size={20} className="text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">Keep it up!</p>
          <p className="text-blue-600 mt-1">
            You&apos;ve studied {overview.wordsInStudy.toLocaleString()} words
            with {Math.round(overview.overallAccuracy * 100)}% accuracy across{" "}
            {overview.totalReviews.toLocaleString()} total reviews. Focus on
            your struggling words to improve your mastery rate.
          </p>
        </div>
      </div>
    </div>
  );
}
