import type { Metadata } from "next";

import { NumberCenterGameShell } from "@/components/number-center/NumberCenterGameShell";

export const metadata: Metadata = {
  title: "가운데 숫자 맞추기 | 김나스 가족 게임",
  description: "나율이/나린이 버전으로 즐기는 어린이 숫자 규칙 맞추기 게임",
};

export default function NumberCenterGamePage() {
  return <NumberCenterGameShell />;
}
