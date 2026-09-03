import { BestScore } from "@/lib/walrus-dodge/types";

const storageKey = "kids-recycling-game-walrus-dodge-best";

export function readBestScore(): BestScore {
  if (typeof window === "undefined") {
    return { bestSeconds: 0 };
  }

  const saved = window.localStorage.getItem(storageKey);
  if (!saved) {
    return { bestSeconds: 0 };
  }

  try {
    const parsed = JSON.parse(saved) as Partial<BestScore>;
    return { bestSeconds: parsed.bestSeconds ?? 0 };
  } catch {
    window.localStorage.removeItem(storageKey);
    return { bestSeconds: 0 };
  }
}

export function writeBestScore(score: BestScore) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(score));
}

export function formatSeconds(seconds: number) {
  return `${seconds.toFixed(1)}초`;
}

export function randomWalrusEmoji() {
  return "🦭";
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
