export type Category = "paper" | "plastic" | "glass" | "metal" | "food";
export type GameMode = "practice" | "challenge";
export type GameVersion = "nayul" | "narin";

export type RecyclingItem = {
  name: string;
  emoji: string;
  category: Category;
  fact: string;
  tip: string;
};

export type CategoryInfo = {
  label: string;
  emoji: string;
  color: string;
  softColor: string;
  description: string;
};

export type VersionInfo = {
  label: string;
  shortLabel: string;
  difficultyLabel: string;
  emoji: string;
  accent: string;
  cardClassName: string;
  summary: string;
  bullets: string[];
};

export type ModeInfo = {
  label: string;
  emoji: string;
  summary: string;
};

export type BestScores = Record<GameMode, number>;

export type QuestionSet = {
  item: RecyclingItem;
  options: Category[];
};
