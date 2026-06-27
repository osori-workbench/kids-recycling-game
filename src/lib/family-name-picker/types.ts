export type FamilyNameVersion = "nayul" | "narin";

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

export type FamilyNameQuestion = {
  answer: string;
  choices: string[];
};

export type FamilyNameGameSession = {
  question: FamilyNameQuestion;
  remainingAnswers: string[];
  round: number;
};

export type BestScores = {
  practice: number;
};
