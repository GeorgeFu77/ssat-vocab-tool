import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateLeitnerUpdate } from "@/lib/leitner";
import { REVIEW_BATCH_SIZE } from "@/lib/constants";

// GET: Fetch review queue (words due for review)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = parseInt(searchParams.get("userId") || "1", 10);
  const limit = parseInt(
    searchParams.get("limit") || String(REVIEW_BATCH_SIZE),
    10
  );

  const queue = await prisma.userWordProgress.findMany({
    where: {
      userId,
      nextReviewDate: { lte: new Date() },
    },
    orderBy: [{ box: "asc" }, { nextReviewDate: "asc" }],
    take: limit,
    include: { word: true },
  });

  const totalDue = await prisma.userWordProgress.count({
    where: {
      userId,
      nextReviewDate: { lte: new Date() },
    },
  });

  const parsed = queue.map((item) => ({
    ...item,
    word: {
      ...item.word,
      synonyms: JSON.parse(item.word.synonyms || "[]"),
      tags: JSON.parse(item.word.tags || "[]"),
    },
  }));

  return NextResponse.json({ queue: parsed, totalDue });
}

// POST: Record a review result
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId = 1, wordId, isCorrect } = body;

  if (!wordId || typeof isCorrect !== "boolean") {
    return NextResponse.json(
      { error: "wordId and isCorrect are required" },
      { status: 400 }
    );
  }

  const current = await prisma.userWordProgress.findUnique({
    where: { userId_wordId: { userId, wordId } },
  });

  if (!current) {
    return NextResponse.json(
      { error: "Progress record not found" },
      { status: 404 }
    );
  }

  const update = calculateLeitnerUpdate({
    currentBox: current.box,
    isCorrect,
  });

  const progress = await prisma.userWordProgress.update({
    where: { id: current.id },
    data: {
      box: update.newBox,
      nextReviewDate: update.nextReviewDate,
      lastReviewDate: new Date(),
      correctStreak: isCorrect ? current.correctStreak + 1 : 0,
      totalReviews: current.totalReviews + 1,
      totalCorrect: isCorrect ? current.totalCorrect + 1 : current.totalCorrect,
    },
    include: { word: true },
  });

  return NextResponse.json({
    progress,
    previousBox: current.box,
    newBox: update.newBox,
    nextReviewDate: update.nextReviewDate,
  });
}
