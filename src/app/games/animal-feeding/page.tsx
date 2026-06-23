import type { Metadata } from "next";

import { AnimalFeedingGameShell } from "@/components/animal-feeding/AnimalFeedingGameShell";

export const metadata: Metadata = {
  title: "동물 먹이주기 | 김나스 가족 게임",
  description: "동물에게 맞는 먹이를 드래그해서 주는 어린이용 가족 게임",
};

export default function AnimalFeedingGamePage() {
  return <AnimalFeedingGameShell />;
}
