import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const difficulty = searchParams.get("difficulty");
  const partOfSpeech = searchParams.get("partOfSpeech");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const skip = (page - 1) * limit;

  const where: Prisma.WordWhereInput = {};

  if (search) {
    where.word = { contains: search };
  }
  if (difficulty) {
    where.difficulty = parseInt(difficulty, 10);
  }
  if (partOfSpeech) {
    where.partOfSpeech = partOfSpeech;
  }

  const [words, total] = await Promise.all([
    prisma.word.findMany({
      where,
      skip,
      take: limit,
      orderBy: { word: "asc" },
      include: {
        progress: {
          where: { userId: 1 },
          take: 1,
        },
      },
    }),
    prisma.word.count({ where }),
  ]);

  const parsed = words.map((w) => ({
    ...w,
    synonyms: JSON.parse(w.synonyms || "[]"),
    tags: JSON.parse(w.tags || "[]"),
    progress: w.progress[0] || null,
  }));

  return NextResponse.json({
    words: parsed,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
