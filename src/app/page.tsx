"use client";

import { useMemo, useState } from "react";

import { ModeSelector } from "@/components/recycling/ModeSelector";
import { NarinGame } from "@/components/recycling/NarinGame";
import { NayulGame } from "@/components/recycling/NayulGame";
import { VersionSelector } from "@/components/recycling/VersionSelector";
import { modeInfo, versionInfo } from "@/lib/recycling/data";
import { GameMode, GameVersion } from "@/lib/recycling/types";

export default function Home() {
  const [selectedVersion, setSelectedVersion] = useState<GameVersion | null>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const isPlaying = Boolean(hasStarted && selectedVersion && selectedMode);

  const heroSummary = useMemo(() => {
    if (!selectedVersion) {
      return "아이의 성향에 맞는 버전을 고른 뒤, 시간제한 없는 모드나 60초 도전 모드로 시작해보세요.";
    }

    const version = versionInfo[selectedVersion];
    const modeLabel = selectedMode ? modeInfo[selectedMode].label : "모드를 아직 고르지 않았어요";
    return `${version.label}을 선택했어요. 현재 모드: ${modeLabel}.`;
  }, [selectedMode, selectedVersion]);

  const resetToHome = () => {
    setHasStarted(false);
    setSelectedVersion(null);
    setSelectedMode(null);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7d6,_#f4fbff_45%,_#eef7ef)] px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        {isPlaying && selectedVersion && selectedMode ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] bg-white/80 px-5 py-4 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-white/80 backdrop-blur">
              <div>
                <p className="text-sm font-semibold text-slate-500">현재 플레이</p>
                <p className="text-lg font-black text-slate-900">
                  {versionInfo[selectedVersion].label} · {modeInfo[selectedMode].label}
                </p>
              </div>
              <button
                type="button"
                onClick={resetToHome}
                className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 ring-1 ring-slate-200 transition hover:-translate-y-0.5"
              >
                버전 다시 고르기
              </button>
            </div>

            {selectedVersion === "nayul" ? (
              <NayulGame mode={selectedMode} onHome={resetToHome} />
            ) : (
              <NarinGame mode={selectedMode} onHome={resetToHome} />
            )}
          </>
        ) : (
          <>
            <VersionSelector selectedVersion={selectedVersion} onSelect={setSelectedVersion} />

            <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <ModeSelector selectedMode={selectedMode} onSelect={setSelectedMode} />

              <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-slate-100 sm:p-8">
                <h2 className="text-2xl font-black text-slate-900">선택 현황</h2>
                <p className="mt-3 text-base leading-7 text-slate-600">{heroSummary}</p>

                <div className="mt-6 grid gap-3">
                  <div className="rounded-[1.5rem] bg-slate-50 p-4 ring-1 ring-slate-100">
                    <p className="text-sm text-slate-500">선택한 버전</p>
                    <p className="mt-1 text-xl font-black text-slate-900">
                      {selectedVersion ? versionInfo[selectedVersion].label : "아직 선택 전"}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-50 p-4 ring-1 ring-slate-100">
                    <p className="text-sm text-slate-500">선택한 시간 모드</p>
                    <p className="mt-1 text-xl font-black text-slate-900">
                      {selectedMode ? modeInfo[selectedMode].label : "아직 선택 전"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.5rem] bg-emerald-50 p-5 ring-1 ring-emerald-100">
                  <p className="text-sm font-bold text-emerald-700">추천 흐름</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-emerald-950">
                    <li>• 처음엔 나율이 버전으로 익숙해지기</li>
                    <li>• 익숙해지면 나린이 버전으로 손맛 있게 도전하기</li>
                    <li>• 마지막엔 60초 도전으로 점수 경쟁하기</li>
                  </ul>
                </div>

                {selectedVersion && selectedMode ? (
                  <button
                    type="button"
                    onClick={() => setHasStarted(true)}
                    className="mt-6 w-full rounded-full bg-slate-900 px-5 py-4 text-base font-black text-white shadow-2xl transition hover:-translate-y-0.5"
                  >
                    게임 시작하기
                  </button>
                ) : (
                  <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-200 px-5 py-4 text-center text-sm font-semibold text-slate-500">
                    버전과 시간 모드를 모두 고르면 게임을 시작할 수 있어요.
                  </div>
                )}
              </section>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
