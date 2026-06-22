import { versionInfo } from "@/lib/recycling/data";
import { GameVersion } from "@/lib/recycling/types";

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
          아이 성향에 맞게 <strong>나율이 버전</strong>과 <strong>나린이 버전</strong>으로 나누어
          플레이할 수 있도록 구성했어요.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {(Object.entries(versionInfo) as [GameVersion, (typeof versionInfo)[GameVersion]][]).map(
          ([version, info]) => {
            const selected = selectedVersion === version;

            return (
              <button
                key={version}
                type="button"
                onClick={() => onSelect(version)}
                className={`rounded-[2rem] p-[1px] text-left transition hover:-translate-y-1 ${
                  selected ? `bg-gradient-to-br ${info.accent}` : "bg-slate-200"
                }`}
              >
                <div
                  className={`h-full rounded-[calc(2rem-1px)] p-6 ring-1 ${info.cardClassName} ${
                    selected ? "ring-transparent" : "ring-slate-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-slate-500">{info.difficultyLabel}</p>
                      <h2 className="mt-2 text-3xl font-black text-slate-900">{info.label}</h2>
                    </div>
                    <div className="text-5xl">{info.emoji}</div>
                  </div>

                  <p className="mt-4 text-base leading-7 text-slate-700">{info.summary}</p>

                  <ul className="mt-5 space-y-2 text-sm font-medium text-slate-600">
                    {info.bullets.map((bullet) => (
                      <li key={bullet}>• {bullet}</li>
                    ))}
                  </ul>

                  <div className="mt-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-sm">
                    {selected ? "선택됨" : "이 버전으로 시작하기"}
                  </div>
                </div>
              </button>
            );
          }
        )}
      </div>
    </section>
  );
}
