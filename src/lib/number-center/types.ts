export type NumberGameVersion = "nayul" | "narin";

export type VersionInfo = {
  label: string;
  shortLabel: string;
  difficultyLabel: string;
  emoji: string;
  accentClassName: string;
  accentButtonClassName: string;
  softPanelClassName: string;
  summary: string;
  example: string;
};

export type NumberPuzzle = {
  displayNumbers: number[];
  answer: number;
  choices: number[];
  explanation: string;
};

export type BestScores = {
  practice: number;
};
