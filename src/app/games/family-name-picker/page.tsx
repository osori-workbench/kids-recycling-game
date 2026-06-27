import type { Metadata } from "next";

import { FamilyNamePickerShell } from "@/components/family-name-picker/FamilyNamePickerShell";

export const metadata: Metadata = {
  title: "우리 가족 이름 찾기 | 김나스 가족 게임",
  description: "나율이/나린이 버전으로 즐기는 가족 이름 고르기 어린이 게임",
};

export default function FamilyNamePickerPage() {
  return <FamilyNamePickerShell />;
}
