import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = parseInt(searchParams.get("userId") || "1", 10);
  const wordId = searchParams.get("wordId");

  if (wordId) {
    const progress = await prisma.userWordProgress.findUnique({
      where: {
        userId_wordId: { userId, wordId: parseInt(wordId, 10) },
      },
      include: { word: true },
    });
    return NextResponse.json({ progress });
  }

  const progress = await prisma.userWordProgress.findMany({
    where: { userId },
    include: { word: true },
    orderBy: { word: { word: "asc" } },
  });

  return NextResponse.json({ progress });
}
