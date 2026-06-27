import { distractorNames, familyNames, versionInfo } from "@/lib/family-name-picker/data";
import {
  BestScores,
  FamilyNameGameSession,
  FamilyNameQuestion,
  FamilyNameVersion,
} from "@/lib/family-name-picker/types";

const bestScoreKeyPrefix = "kids-family-name-picker-best";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: readonly T[]) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function createAnswerQueue() {
  return shuffle(familyNames);
}

function buildChoices(answer: string, choiceCount: number) {
  const wrongChoices = shuffle(distractorNames).slice(0, choiceCount - 1);
  return shuffle([answer, ...wrongChoices]);
}

function buildQuestion(version: FamilyNameVersion, answer: string): FamilyNameQuestion {
  return {
    answer,
    choices: buildChoices(answer, versionInfo[version].choiceCount),
  };
}

export function createInitialSession(version: FamilyNameVersion): FamilyNameGameSession {
  const queue = createAnswerQueue();
  const [answer, ...remainingAnswers] = queue;

  return {
    question: buildQuestion(version, answer),
    remainingAnswers,
    round: 1,
  };
}

export function advanceSession(
  version: FamilyNameVersion,
  currentSession: FamilyNameGameSession
): FamilyNameGameSession {
  const queue = currentSession.remainingAnswers.length > 0 ? currentSession.remainingAnswers : createAnswerQueue();
  const [answer, ...remainingAnswers] = queue;

  return {
    question: buildQuestion(version, answer),
    remainingAnswers,
    round: currentSession.round + 1,
  };
}

export function accuracy(score: number, attempts: number) {
  if (attempts === 0) return 0;
  return Math.round((score / attempts) * 100);
}

export function readBestScores(version: FamilyNameVersion): BestScores {
  if (typeof window === "undefined") {
    return { practice: 0 };
  }

  const raw = window.localStorage.getItem(`${bestScoreKeyPrefix}:${version}`);

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

export function writeBestScores(version: FamilyNameVersion, scores: BestScores) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`${bestScoreKeyPrefix}:${version}`, JSON.stringify(scores));
}
