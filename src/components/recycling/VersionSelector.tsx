import Image from "next/image";

import { versionInfo } from "@/lib/recycling/data";
import { GameVersion } from "@/lib/recycling/types";

const versionImages: Record<GameVersion, { src: string; alt: string; className?: string }> = {
  nayul: {
    src: "/assets/nayul.png",
    alt: "나율이 버전 소개 이미지",
    className: "object-[center_62%]",
  },
  narin: {
    src: "/assets/narin.png",
    alt: "나린이 버전 소개 이미지",
  },
};

type VersionSelectorProps = {
  selectedVersion: GameVersion | null;
  onSelect: (version: GameVersion) => void;
};

export function VersionSelector({ selectedVersion, onSelect }: VersionSelectorProps) {
  return (
    <section className="rounded-[2rem] bg-white/90 p-6 shadow-[0_24px_80px_rgba(40,68,87,0.14)] ring-1 ring-white/70 backdrop-blur sm:p-8">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
          ♻️ 아동용 분리수거 학습 게임
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
          분리수거 탐험대
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          원하는 버전을 큰 영역으로 바로 눌러서 시작할 수 있게 만들었어요.
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {(Object.entries(versionInfo) as [GameVersion, (typeof versionInfo)[GameVersion]][]).map(
          ([version, info]) => {
            const selected = selectedVersion === version;
            const image = versionImages[version];

            return (
              <button
                key={version}
                type="button"
                onClick={() => onSelect(version)}
                className={`group rounded-[2.25rem] p-[2px] text-left transition duration-200 hover:-translate-y-1 hover:shadow-2xl ${
                  info.accent
                }`}
              >
                <div
                  className={`h-full rounded-[calc(2.25rem-2px)] p-6 ring-1 ${info.cardClassName} ${
                    selected ? "ring-white/80" : "ring-white/60"
                  }`}
                >
                  <div className="relative overflow-hidden rounded-[1.75rem] bg-white/70">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={1200}
                      height={900}
                      className={`h-72 w-full object-cover transition duration-300 group-hover:scale-[1.02] sm:h-80 ${image.className ?? ""}`}
                      priority={version === "nayul"}
                    />
                    <div className="absolute inset-x-4 bottom-4 inline-flex w-fit rounded-full bg-black/55 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                      누르면 바로 시작
                    </div>
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-slate-500">{info.difficultyLabel}</p>
                      <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">{info.label}</h2>
                    </div>
                    <div className="text-5xl sm:text-6xl">{info.emoji}</div>
                  </div>

                  <p className="mt-4 text-base leading-7 text-slate-700">{info.summary}</p>
                </div>
              </button>
            );
          }
        )}
      </div>
    </section>
  );
}
