import type { Metadata } from "next";

import { RecyclingGameShell } from "@/components/recycling/RecyclingGameShell";

export const metadata: Metadata = {
  title: "분리수거 탐험대 | 김나스 가족 게임",
  description: "아이들을 위한 분리수거 학습 웹 게임",
};

export default function RecyclingGamePage() {
  return <RecyclingGameShell />;
}
