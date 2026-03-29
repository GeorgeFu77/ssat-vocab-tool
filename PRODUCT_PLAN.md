# SSAT Vocabulary Memory Tool - Product Plan

## Problem
SSAT test-takers need to memorize a large number of vocabulary words. Traditional flashcard methods are inefficient — students waste time on words they already know and forget words they previously learned.

## Goal
Build a smart vocabulary memory tool that helps SSAT students learn and retain vocabulary words efficiently using spaced repetition and active recall techniques.

## Target Users
- Students preparing for the SSAT (typically grades 5-11)
- Parents/tutors helping students prepare

## Core Features (MVP)

### 1. Word Bank
- Curated SSAT vocabulary list (organized by difficulty: Lower/Middle/Upper level)
- Each word includes: definition, example sentence, synonyms, part of speech
- Ability to add custom words

### 2. Spaced Repetition System (SRS)
- Algorithm tracks how well the user knows each word (e.g., SM-2 or Leitner system)
- Automatically schedules review sessions — words you struggle with appear more often
- Daily review queue based on due dates

### 3. Quiz Modes
- **Flashcard mode**: Show word, reveal definition (or reverse)
- **Multiple choice**: Mimics actual SSAT synonym/analogy question format
- **Fill-in-the-blank**: Sentence completion with context clues
- **Match mode**: Match words to definitions (timed)

### 4. Progress Tracking
- Dashboard showing: words learned, words due for review, streak count
- Mastery levels per word (New → Learning → Reviewing → Mastered)
- Weekly/monthly progress charts

## Nice-to-Have Features (Post-MVP)
- Analogy practice (key SSAT question type)
- Word root/prefix/suffix breakdown to aid memorization
- Audio pronunciation
- Multi-user support (student + parent/tutor view)
- Leaderboard / gamification (badges, XP)
- Import/export word lists
- Offline mode

## Tech Stack Options

| Option | Frontend | Backend | Database | Pros |
|--------|----------|---------|----------|------|
| A. Web App | React / Next.js | Node.js / API routes | SQLite / PostgreSQL | Easy to share, no install |
| B. Mobile App | React Native | Firebase | Firestore | Best UX for daily practice |
| C. CLI + Local | Terminal UI | Python / Node | JSON / SQLite | Fastest to build, simple |

**Recommendation**: Start with **Option A (Web App)** — easy for both of you to develop and test, no app store friction, works on any device.

## Data Model (Core)

```
Word {
  id, word, definition, exampleSentence,
  synonyms[], partOfSpeech, difficulty, tags[]
}

UserWordProgress {
  userId, wordId, easeFactor, interval,
  nextReviewDate, repetitions, lastReviewDate
}

ReviewSession {
  id, userId, date, wordsReviewed,
  correctCount, duration
}

User {
  id, name, level (Lower/Middle/Upper), createdAt
}
```

## Development Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Set up project repo and dev environment
- [ ] Build word bank data (compile SSAT word list, 300-500 words to start)
- [ ] Implement basic flashcard UI (show/hide definition)
- [ ] Basic SRS algorithm (Leitner box system — simpler to start)

### Phase 2: Core Learning (Week 3-4)
- [ ] Multiple choice quiz mode
- [ ] Progress tracking (per-word mastery level)
- [ ] Daily review queue (words due today)
- [ ] Simple dashboard with stats

### Phase 3: Polish (Week 5-6)
- [ ] Match mode (timed game)
- [ ] Fill-in-the-blank mode
- [ ] Progress charts and streak tracking
- [ ] Mobile-responsive design

### Phase 4: Enhance (Week 7+)
- [ ] Word roots/prefixes feature
- [ ] Analogy practice
- [ ] User accounts (if needed)
- [ ] Nice-to-have features based on feedback

## Division of Work (Suggestion)

| Area | Owner | Notes |
|------|-------|-------|
| Word data curation | Both | Research and compile SSAT word lists |
| Frontend UI | TBD | Components, pages, styling |
| SRS algorithm | TBD | Core review scheduling logic |
| Quiz logic | TBD | Question generation, scoring |
| Design / UX | TBD | Layout, colors, mobile responsiveness |

## Success Metrics
- User can learn 20+ new words per day
- 80%+ retention rate on words marked "mastered"
- Daily study session takes 10-15 minutes
- Covers 1000+ SSAT-relevant vocabulary words

## Open Questions
1. Web app or mobile app? (Recommendation: web first)
2. Which SRS algorithm? Leitner (simpler) vs SM-2 (more precise)?
3. Do we need user accounts from day 1, or is single-user fine for MVP?
4. Where to source the SSAT word list? (Barron's, Kaplan, public lists?)
5. Any specific SSAT level focus? (Lower / Middle / Upper)
