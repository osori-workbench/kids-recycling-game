import { NumberGameVersion, VersionInfo } from "@/lib/number-center/types";

export const versionInfo: Record<NumberGameVersion, VersionInfo> = {
  nayul: {
    label: "나율이 버전",
    shortLabel: "나율이",
    difficultyLabel: "쉬운 버전",
    emoji: "🌼",
    accentClassName: "from-rose-400 via-pink-400 to-orange-300",
    accentButtonClassName: "bg-rose-500 hover:bg-rose-600",
    softPanelClassName: "from-rose-50 via-pink-50 to-orange-50",
    summary: "세 숫자 줄에서 가운데에 들어갈 수를 고르는 쉬운 숫자 놀이예요.",
    example: "21 ㅇ 23",
  },
  narin: {
    label: "나린이 버전",
    shortLabel: "나린이",
    difficultyLabel: "도전 버전",
    emoji: "🚀",
    accentClassName: "from-sky-400 via-cyan-400 to-indigo-400",
    accentButtonClassName: "bg-sky-500 hover:bg-sky-600",
    softPanelClassName: "from-sky-50 via-cyan-50 to-indigo-50",
    summary: "다섯 숫자 줄에서 가운데 수를 찾는 규칙 놀이예요. 더 다양한 건너뛰기 규칙이 나와요.",
    example: "1 4 ㅇ 10 13",
  },
};
