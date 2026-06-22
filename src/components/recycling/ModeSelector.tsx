import { modeInfo } from "@/lib/recycling/data";
import { GameMode } from "@/lib/recycling/types";

type ModeSelectorProps = {
  selectedMode: GameMode | null;
  onSelect: (mode: GameMode) => void;
};

export function ModeSelector({ selectedMode, onSelect }: ModeSelectorProps) {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-slate-100 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">시간 모드 선택</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            버전을 고른 다음, 천천히 배울지 60초 도전을 할지 선택해보세요.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {(Object.entries(modeInfo) as [GameMode, (typeof modeInfo)[GameMode]][]).map(([mode, info]) => {
          const selected = selectedMode === mode;

          return (
            <button
              key={mode}
              type="button"
              onClick={() => onSelect(mode)}
              className={`rounded-[1.75rem] border p-5 text-left transition hover:-translate-y-1 ${
                selected
                  ? "border-slate-900 bg-slate-900 text-white shadow-2xl"
                  : "border-slate-200 bg-slate-50 text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3 text-2xl font-black">
                <span>{info.emoji}</span>
                <span>{info.label}</span>
              </div>
              <p className={`mt-3 text-sm leading-6 ${selected ? "text-slate-200" : "text-slate-600"}`}>
                {info.summary}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
