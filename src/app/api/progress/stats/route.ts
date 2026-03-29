import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, format } from "date-fns";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = parseInt(searchParams.get("userId") || "1", 10);

  const now = new Date();
  const today = startOfDay(now);

  const [
    allProgress,
    totalWords,
    sessions,
    difficultyBreakdown,
    partOfSpeechBreakdown,
  ] = await Promise.all([
    // All word progress records
    prisma.userWordProgress.findMany({
      where: { userId },
      include: { word: true },
    }),
    // Total word count
    prisma.word.count(),
    // All review sessions, ordered by date
    prisma.reviewSession.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
    }),
    // Words grouped by difficulty
    prisma.userWordProgress.findMany({
      where: { userId },
      include: { word: { select: { difficulty: true } } },
    }),
    // Words grouped by part of speech
    prisma.userWordProgress.findMany({
      where: { userId },
      include: { word: { select: { partOfSpeech: true } } },
    }),
  ]);

  // --- Overall accuracy ---
  let totalReviews = 0;
  let totalCorrect = 0;
  for (const p of allProgress) {
    totalReviews += p.totalReviews;
    totalCorrect += p.totalCorrect;
  }
  const overallAccuracy = totalReviews > 0 ? totalCorrect / totalReviews : 0;

  // --- Box distribution ---
  const boxCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const p of allProgress) {
    boxCounts[p.box] = (boxCounts[p.box] || 0) + 1;
  }

  // --- Mastery percentage ---
  const wordsInStudy = allProgress.length;
  const masteredCount = boxCounts[4] + boxCounts[5]; // box 4+ = nearly/fully mastered
  const masteryPct = wordsInStudy > 0 ? masteredCount / wordsInStudy : 0;

  // --- Accuracy by difficulty ---
  const diffStats: Record<number, { reviews: number; correct: number }> = {
    1: { reviews: 0, correct: 0 },
    2: { reviews: 0, correct: 0 },
    3: { reviews: 0, correct: 0 },
  };
  for (const p of difficultyBreakdown) {
    const d = p.word.difficulty;
    if (diffStats[d]) {
      diffStats[d].reviews += p.totalReviews;
      diffStats[d].correct += p.totalCorrect;
    }
  }
  const accuracyByDifficulty = Object.entries(diffStats).map(([d, s]) => ({
    difficulty: parseInt(d),
    label: d === "1" ? "Easy" : d === "2" ? "Medium" : "Hard",
    accuracy: s.reviews > 0 ? s.correct / s.reviews : 0,
    totalReviews: s.reviews,
  }));

  // --- Part of speech breakdown ---
  const posCounts: Record<string, { total: number; mastered: number }> = {};
  for (const p of partOfSpeechBreakdown) {
    const pos = p.word.partOfSpeech;
    if (!posCounts[pos]) posCounts[pos] = { total: 0, mastered: 0 };
    posCounts[pos].total++;
    if (p.box >= 4) posCounts[pos].mastered++;
  }
  const partOfSpeechStats = Object.entries(posCounts).map(([pos, c]) => ({
    partOfSpeech: pos,
    total: c.total,
    mastered: c.mastered,
    masteryPct: c.total > 0 ? c.mastered / c.total : 0,
  }));

  // --- Daily activity (last 30 days) ---
  const dailyActivity: { date: string; reviewed: number; correct: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const day = startOfDay(subDays(now, i));
    const dateStr = format(day, "yyyy-MM-dd");
    const daySessions = sessions.filter((s) => {
      const sDay = format(new Date(s.startedAt), "yyyy-MM-dd");
      return sDay === dateStr;
    });
    const reviewed = daySessions.reduce((sum, s) => sum + s.wordsReviewed, 0);
    const correct = daySessions.reduce((sum, s) => sum + s.correctCount, 0);
    dailyActivity.push({ date: dateStr, reviewed, correct });
  }

  // --- Study streak (consecutive days with at least 1 review) ---
  let streak = 0;
  // Check if studied today first
  const todayActivity = dailyActivity[dailyActivity.length - 1];
  const startIdx = todayActivity.reviewed > 0 ? dailyActivity.length - 1 : dailyActivity.length - 2;
  for (let i = startIdx; i >= 0; i--) {
    if (dailyActivity[i].reviewed > 0) {
      streak++;
    } else {
      break;
    }
  }

  // --- Top struggling words (most reviews but still in box 1-2) ---
  const strugglingWords = allProgress
    .filter((p) => p.box <= 2 && p.totalReviews >= 2)
    .sort((a, b) => b.totalReviews - a.totalReviews)
    .slice(0, 10)
    .map((p) => ({
      word: p.word.word,
      definition: p.word.definition,
      box: p.box,
      totalReviews: p.totalReviews,
      accuracy: p.totalReviews > 0 ? p.totalCorrect / p.totalReviews : 0,
    }));

  // --- Recent sessions (last 10) ---
  const recentSessions = sessions.slice(0, 10).map((s) => ({
    id: s.id,
    date: s.startedAt,
    wordsReviewed: s.wordsReviewed,
    correctCount: s.correctCount,
    accuracy: s.wordsReviewed > 0 ? s.correctCount / s.wordsReviewed : 0,
    duration: s.duration,
  }));

  return NextResponse.json({
    overview: {
      totalWords,
      wordsInStudy,
      totalReviews,
      totalCorrect,
      overallAccuracy,
      masteredCount,
      masteryPct,
      streak,
    },
    boxCounts,
    accuracyByDifficulty,
    partOfSpeechStats,
    dailyActivity,
    strugglingWords,
    recentSessions,
  });
}
