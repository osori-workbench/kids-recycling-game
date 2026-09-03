import { hangulWords, versionInfo } from "@/lib/hangul-picker/data";
import { BestScores, HangulGameSession, HangulPickerVersion, HangulQuestion, HangulWord } from "@/lib/hangul-picker/types";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffle<T>(items: readonly T[]): T[] {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function createWordQueue(): string[] {
  return shuffle(hangulWords).map((word) => word.id);
}

function findWord(wordId: string): HangulWord {
  return hangulWords.find((word) => word.id === wordId) ?? hangulWords[0];
}

function buildQuestion(version: HangulPickerVersion, wordId: string): HangulQuestion {
  const target = findWord(wordId);
  const choiceCount = versionInfo[version].choiceCount;
  const distractors = shuffle(hangulWords.filter((word) => word.id !== target.id)).slice(0, choiceCount - 1);

  return {
    target,
    choices: shuffle([target, ...distractors]),
  };
}

export function createInitialSession(version: HangulPickerVersion): HangulGameSession {
  const queue = createWordQueue();
  const [wordId, ...remainingWordIds] = queue;

  return {
    question: buildQuestion(version, wordId),
    remainingWordIds,
    round: 1,
  };
}

export function advanceSession(version: HangulPickerVersion, currentSession: HangulGameSession): HangulGameSession {
  const queue = currentSession.remainingWordIds.length > 0 ? currentSession.remainingWordIds : createWordQueue();
  const [wordId, ...remainingWordIds] = queue;

  return {
    question: buildQuestion(version, wordId),
    remainingWordIds,
    round: currentSession.round + 1,
  };
}

export function accuracy(score: number, questionCount: number) {
  if (questionCount === 0) return 0;
  return Math.round((score / questionCount) * 100);
}

function storageKey(version: HangulPickerVersion) {
  return `kids-recycling-game-hangul-picker-best-${version}`;
}

export function readBestScores(version: HangulPickerVersion): BestScores {
  if (typeof window === "undefined") {
    return { practice: 0 };
  }

  const saved = window.localStorage.getItem(storageKey(version));
  if (!saved) {
    return { practice: 0 };
  }

  try {
    const parsed = JSON.parse(saved) as Partial<BestScores>;
    return { practice: parsed.practice ?? 0 };
  } catch {
    window.localStorage.removeItem(storageKey(version));
    return { practice: 0 };
  }
}

export function writeBestScores(version: HangulPickerVersion, scores: BestScores) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(version), JSON.stringify(scores));
}
