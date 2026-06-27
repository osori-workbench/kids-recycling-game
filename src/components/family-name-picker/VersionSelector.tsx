import { versionInfo } from "@/lib/family-name-picker/data";
import { FamilyNameVersion } from "@/lib/family-name-picker/types";

type VersionSelectorProps = {
  onSelect: (version: FamilyNameVersion) => void;
};

export function VersionSelector({ onSelect }: VersionSelectorProps) {
  return (
    <section className="rounded-[2rem] bg-white/90 p-6 shadow-[0_24px_80px_rgba(40,68,87,0.14)] ring-1 ring-white/70 backdrop-blur sm:p-8">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700">
          👨‍👩‍👧‍👦 가족 이름 고르기 게임
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
          우리 가족 이름 찾기
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          버전을 큰 카드로 눌러서 바로 시작해요. 가족 이름만 정답이고, 나머지는 속임수 이름이에요.
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {(Object.entries(versionInfo) as [FamilyNameVersion, (typeof versionInfo)[FamilyNameVersion]][]).map(
          ([version, info]) => (
            <button
              key={version}
              type="button"
              onClick={() => onSelect(version)}
              className={`group rounded-[2.25rem] bg-gradient-to-r ${info.accentClassName} p-[2px] text-left transition duration-200 hover:-translate-y-1 hover:shadow-2xl`}
            >
              <div className="h-full rounded-[calc(2.25rem-2px)] bg-white/95 p-6">
                <div className={`h-full rounded-[1.75rem] bg-gradient-to-br ${info.softPanelClassName} p-6 ring-1 ring-white/70`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-slate-500">{info.difficultyLabel}</p>
                      <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">{info.label}</h2>
                    </div>
                    <div className="rounded-full bg-white/85 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-white/80">
                      누르면 바로 시작
                    </div>
                  </div>

                  <p className="mt-5 text-base leading-7 text-slate-700">{info.summary}</p>

                  <div className="mt-5 rounded-[1.5rem] bg-white/85 px-5 py-6 text-center shadow-sm ring-1 ring-white/80">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">규칙</p>
                    <p className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">{info.example}</p>
                  </div>
                </div>
              </div>
            </button>
          )
        )}
      </div>
    </section>
  );
}
