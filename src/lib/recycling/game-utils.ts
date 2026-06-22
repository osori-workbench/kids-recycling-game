import { challengeSeconds, items } from "@/lib/recycling/data";
import { BestScores, Category, GameMode, GameVersion, QuestionSet, RecyclingItem } from "@/lib/recycling/types";

export function pickRandomItem(previousName?: string) {
  const pool = items.length > 1 ? items.filter((item) => item.name !== previousName) : items;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function buildQuestionSet(previousName?: string): QuestionSet {
  const item = pickRandomItem(previousName);
  const distractors = shuffle(
    (Object.keys({ paper: 1, plastic: 1, glass: 1, metal: 1, food: 1 }) as Category[]).filter(
      (category) => category !== item.category
    )
  ).slice(0, 2);

  return {
    item,
    options: shuffle([item.category, ...distractors]),
  };
}

export function shuffle<T>(values: T[]) {
  const copy = [...values];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]];
  }

  return copy;
}

export function storageKey(version: GameVersion) {
  return `kids-recycling-game-best-scores-${version}`;
}

export function readBestScores(version: GameVersion): BestScores {
  if (typeof window === "undefined") {
    return { practice: 0, challenge: 0 };
  }

  const saved = window.localStorage.getItem(storageKey(version));
  if (!saved) {
    return { practice: 0, challenge: 0 };
  }

  try {
    const parsed = JSON.parse(saved) as Partial<Record<GameMode, number>>;
    return {
      practice: parsed.practice ?? 0,
      challenge: parsed.challenge ?? 0,
    };
  } catch {
    window.localStorage.removeItem(storageKey(version));
    return { practice: 0, challenge: 0 };
  }
}

export function writeBestScores(version: GameVersion, scores: BestScores) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(version), JSON.stringify(scores));
}

export function accuracy(score: number, questionCount: number) {
  if (questionCount === 0) return 0;
  return Math.round((score / questionCount) * 100);
}

export function challengeTime(mode: GameMode) {
  return mode === "challenge" ? challengeSeconds : Infinity;
}

export function modeSummary(mode: GameMode) {
  return mode === "practice"
    ? "시간제한 없이 천천히 생각하며 배워보세요!"
    : `${challengeSeconds}초 안에 최대한 많이 맞혀보세요!`;
}

export function allCategories(): Category[] {
  return ["paper", "plastic", "glass", "metal", "food"];
}

export function nextItem(previous?: RecyclingItem) {
  return pickRandomItem(previous?.name);
}
