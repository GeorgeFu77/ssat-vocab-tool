import { PrismaClient } from "../src/generated/prisma/client";
import * as fs from "fs";
import * as path from "path";

const words = JSON.parse(
  fs.readFileSync(path.join(__dirname, "words.json"), "utf-8")
);

const prisma = new PrismaClient();

async function main() {
  // Create default user for MVP (single-user)
  const user = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Student",
      level: "Middle",
    },
  });

  console.log(`Default user: ${user.name} (id: ${user.id})`);

  // Seed words
  let count = 0;
  for (const w of words as Array<{
    word: string;
    definition: string;
    exampleSentence?: string;
    synonyms?: string[];
    partOfSpeech: string;
    difficulty?: number;
    tags?: string[];
  }>) {
    await prisma.word.upsert({
      where: { word: w.word },
      update: {
        definition: w.definition,
        exampleSentence: w.exampleSentence ?? null,
        synonyms: JSON.stringify(w.synonyms ?? []),
        partOfSpeech: w.partOfSpeech,
        difficulty: w.difficulty ?? 1,
        tags: JSON.stringify(w.tags ?? []),
      },
      create: {
        word: w.word,
        definition: w.definition,
        exampleSentence: w.exampleSentence ?? null,
        synonyms: JSON.stringify(w.synonyms ?? []),
        partOfSpeech: w.partOfSpeech,
        difficulty: w.difficulty ?? 1,
        tags: JSON.stringify(w.tags ?? []),
      },
    });
    count++;
  }

  console.log(`Seeded ${count} words`);

  // Initialize UserWordProgress for all words (all start in Box 1)
  const allWords = await prisma.word.findMany();
  let progressCount = 0;
  for (const word of allWords) {
    await prisma.userWordProgress.upsert({
      where: {
        userId_wordId: { userId: user.id, wordId: word.id },
      },
      update: {},
      create: {
        userId: user.id,
        wordId: word.id,
        box: 1,
        nextReviewDate: new Date(),
      },
    });
    progressCount++;
  }

  console.log(`Initialized progress for ${progressCount} words`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
