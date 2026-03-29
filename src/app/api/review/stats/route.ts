import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = parseInt(searchParams.get("userId") || "1", 10);

  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const [allProgress, dueNow, reviewedToday, recentSessions] =
    await Promise.all([
      prisma.userWordProgress.groupBy({
        by: ["box"],
        where: { userId },
        _count: { id: true },
      }),
      prisma.userWordProgress.count({
        where: {
          userId,
          nextReviewDate: { lte: now },
        },
      }),
      prisma.userWordProgress.count({
        where: {
          userId,
          lastReviewDate: { gte: todayStart, lte: todayEnd },
        },
      }),
      prisma.reviewSession.findMany({
        where: { userId },
        orderBy: { startedAt: "desc" },
        take: 5,
      }),
    ]);

  const boxCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalWords = 0;
  for (const group of allProgress) {
    boxCounts[group.box] = group._count.id;
    totalWords += group._count.id;
  }

  return NextResponse.json({
    boxCounts,
    totalWords,
    wordsReviewedToday: reviewedToday,
    dueNow,
    recentSessions,
  });
}
