export type HangulPickerVersion = "nayul" | "narin";

export type VersionInfo = {
  label: string;
  shortLabel: string;
  difficultyLabel: string;
  accentClassName: string;
  accentButtonClassName: string;
  softPanelClassName: string;
  summary: string;
  example: string;
  choiceCount: number;
  timeLimitSeconds?: number;
};

export type HangulWord = {
  id: string;
  word: string;
  emoji: string;
};

export type HangulQuestion = {
  target: HangulWord;
  choices: HangulWord[];
};

export type HangulGameSession = {
  question: HangulQuestion;
  remainingWordIds: string[];
  round: number;
};

export type BestScores = {
  practice: number;
};
