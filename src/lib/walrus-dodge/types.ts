export type FallingWalrus = {
  id: number;
  x: number; // percentage 0-100 from left
  y: number; // percentage 0-100 from top
  size: number; // px
  speed: number; // percent per tick
  emoji: string;
};

export type BestScore = {
  bestSeconds: number;
};
