import { BestScores, NumberGameVersion, NumberPuzzle } from "@/lib/number-center/types";

const bestScoreKeyPrefix = "kids-number-center-best";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(items: T[]) {
  return items[randomInt(0, items.length - 1)];
}

function shuffle<T>(items: T[]) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function uniqueChoices(answer: number, deltas: number[], min = 0) {
  const set = new Set<number>([answer]);

  for (const delta of deltas) {
    const candidate = answer + delta;
    if (candidate >= min) {
      set.add(candidate);
    }
  }

  return shuffle([...set]);
}

function buildArithmeticExplanation(step: number, ascending: boolean) {
  if (step === 1) {
    return ascending ? "정답! 숫자가 하나씩 커져요." : "정답! 숫자가 하나씩 작아져요.";
  }

  return ascending
    ? `정답! 숫자가 ${step}씩 커져요.`
    : `정답! 숫자가 ${step}씩 작아져요.`;
}

function buildNayulPuzzle(): NumberPuzzle {
  const family = randomFrom([
    { step: 1, minStart: 1, maxStart: 97 },
    { step: 2, minStart: 2, maxStart: 94 },
    { step: 5, minStart: 5, maxStart: 85 },
    { step: 10, minStart: 10, maxStart: 70 },
  ]);
  const ascending = Math.random() > 0.25;
  const start = randomInt(family.minStart, family.maxStart);
  const numbers = ascending
    ? [start, start + family.step, start + family.step * 2]
    : [start + family.step * 2, start + family.step, start];
  const answer = numbers[1];
  const choices = uniqueChoices(
    answer,
    [-family.step * 2, -family.step, family.step, family.step * 2, family.step * 3],
    0
  ).slice(0, 3);

  if (!choices.includes(answer)) {
    choices[0] = answer;
  }

  return {
    displayNumbers: numbers,
    answer,
    choices: shuffle(choices),
    explanation: buildArithmeticExplanation(family.step, ascending),
  };
}

function buildNarinPuzzle(): NumberPuzzle {
  const pattern = randomFrom([
    { step: 1, minStart: 1, maxStart: 40 },
    { step: 2, minStart: 2, maxStart: 38 },
    { step: 3, minStart: 1, maxStart: 35 },
    { step: 4, minStart: 4, maxStart: 30 },
    { step: 5, minStart: 5, maxStart: 25 },
    { step: 10, minStart: 10, maxStart: 15 },
  ]);
  const ascending = Math.random() > 0.35;
  const start = randomInt(pattern.minStart, pattern.maxStart);
  const numbers = ascending
    ? [
        start,
        start + pattern.step,
        start + pattern.step * 2,
        start + pattern.step * 3,
        start + pattern.step * 4,
      ]
    : [
        start + pattern.step * 4,
        start + pattern.step * 3,
        start + pattern.step * 2,
        start + pattern.step,
        start,
      ];
  const answer = numbers[2];
  const choices = uniqueChoices(
    answer,
    [
      -pattern.step * 3,
      -pattern.step * 2,
      -pattern.step,
      pattern.step,
      pattern.step * 2,
      pattern.step * 3,
    ],
    0
  ).slice(0, 4);

  if (!choices.includes(answer)) {
    choices[0] = answer;
  }

  return {
    displayNumbers: numbers,
    answer,
    choices: shuffle(choices),
    explanation: buildArithmeticExplanation(pattern.step, ascending),
  };
}

export function nextPuzzle(version: NumberGameVersion) {
  return version === "nayul" ? buildNayulPuzzle() : buildNarinPuzzle();
}

export function accuracy(score: number, attempts: number) {
  if (attempts === 0) return 0;
  return Math.round((score / attempts) * 100);
}

export function readBestScores(version: NumberGameVersion): BestScores {
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

export function writeBestScores(version: NumberGameVersion, scores: BestScores) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`${bestScoreKeyPrefix}:${version}`, JSON.stringify(scores));
}
