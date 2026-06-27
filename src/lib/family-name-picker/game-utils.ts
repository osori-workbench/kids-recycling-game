import { BestScores, FamilyNameQuestion } from "@/lib/family-name-picker/types";
import { distractorNames, familyNames } from "@/lib/family-name-picker/data";

const bestScoreKey = "kids-family-name-picker-best";
const maxChoices = 5;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(items: readonly T[]) {
  return items[randomInt(0, items.length - 1)];
}

function shuffle<T>(items: readonly T[]) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

export function nextQuestion(): FamilyNameQuestion {
  const answer = randomFrom(familyNames);
  const wrongChoices = shuffle(distractorNames).slice(0, maxChoices - 1);

  return {
    answer,
    choices: shuffle([answer, ...wrongChoices]),
  };
}

export function accuracy(score: number, attempts: number) {
  if (attempts === 0) return 0;
  return Math.round((score / attempts) * 100);
}

export function readBestScores(): BestScores {
  if (typeof window === "undefined") {
    return { practice: 0 };
  }

  const raw = window.localStorage.getItem(bestScoreKey);

  if (!raw) {
    return { practice: 0 };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<BestScores>;
    return {
      practice: typeof parsed.practice === "number" ? parsed.practice : 0,
    };
  } catch {
    return { practice: 0 };
  }
}

export function writeBestScores(scores: BestScores) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(bestScoreKey, JSON.stringify(scores));
}
