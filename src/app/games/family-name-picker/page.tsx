import type { Metadata } from "next";

import { FamilyNamePickerShell } from "@/components/family-name-picker/FamilyNamePickerShell";

export const metadata: Metadata = {
  title: "우리 가족 이름 찾기 | 김나스 가족 게임",
  description: "보기 5개 중에서 우리 가족 이름을 골라 맞히는 어린이용 가족 게임",
};

export default function FamilyNamePickerPage() {
  return <FamilyNamePickerShell />;
}
