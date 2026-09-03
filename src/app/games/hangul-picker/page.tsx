import type { Metadata } from "next";

import { HangulPickerShell } from "@/components/hangul-picker/HangulPickerShell";

export const metadata: Metadata = {
  title: "한글 그림 맞추기 | 김나스 가족 게임",
  description: "나율이/나린이 버전으로 즐기는 그림 보고 한글 낱말 고르기 게임",
};

export default function HangulPickerPage() {
  return <HangulPickerShell />;
}
