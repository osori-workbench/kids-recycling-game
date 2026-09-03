import type { Metadata } from "next";

import { WalrusDodgeGameShell } from "@/components/walrus-dodge/WalrusDodgeGameShell";

export const metadata: Metadata = {
  title: "바다코끼리 피하기 | 김나스 가족 게임",
  description: "하늘에서 떨어지는 바다코끼리를 피하는 어린이용 가족 게임",
};

export default function WalrusDodgeGamePage() {
  return <WalrusDodgeGameShell />;
}
