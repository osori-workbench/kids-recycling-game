import { NumberGameVersion } from "@/lib/number-center/types";

export const numberCenterBgm = {
  title: "유니콘 하트 우리 가족",
  src: "/assets/family-bgm.mp3",
} as const;

export const numberCenterVersionImages: Record<
  NumberGameVersion,
  { src: string; alt: string; className?: string }
> = {
  nayul: {
    src: "/assets/nayul.png",
    alt: "나율이 숫자 놀이 버전 소개 이미지",
    className: "object-[center_62%]",
  },
  narin: {
    src: "/assets/narin.png",
    alt: "나린이 숫자 놀이 버전 소개 이미지",
  },
};
