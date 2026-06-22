"use client";

import { useMemo, useRef, useState } from "react";

import { NarinGame } from "@/components/recycling/NarinGame";
import { NayulGame } from "@/components/recycling/NayulGame";
import { VersionSelector } from "@/components/recycling/VersionSelector";
import { versionInfo } from "@/lib/recycling/data";
import { GameVersion } from "@/lib/recycling/types";

export default function Home() {
  const [selectedVersion, setSelectedVersion] = useState<GameVersion | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isPlaying = Boolean(hasStarted && selectedVersion);

  const heroSummary = useMemo(() => {
    if (!selectedVersion) {
      return "아이의 성향에 맞는 버전을 고른 뒤 바로 시작해보세요. 이제 시간 제한은 없고, 5번 틀리면 게임이 끝나요.";
    }

    const version = versionInfo[selectedVersion];
    return `${version.label}을 선택했어요. 시간 제한 없이 진행되고, 5번 틀리면 게임 종료예요.`;
  }, [selectedVersion]);

  const resetToHome = () => {
    setHasStarted(false);
    setSelectedVersion(null);
  };

  const tryPlayBgm = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
    } catch {
      // 브라우저 자동재생 제한이 있을 수 있으므로 조용히 무시하고 controls 사용
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7d6,_#f4fbff_45%,_#eef7ef)] px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-[1.5rem] bg-white/85 p-5 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-white/70 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-500">BGM</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">유니콘 하트 우리 가족</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                직접 만든 배경음악도 함께 넣었습니다. 자동재생이 막히면 아래 재생 버튼을 눌러주세요.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <audio
                ref={audioRef}
                className="w-full max-w-md"
                src="/assets/family-bgm.mp3"
                controls
                loop
                autoPlay
              />
              <button
                type="button"
                onClick={tryPlayBgm}
                className="rounded-full bg-violet-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-600"
              >
                BGM 재생하기
              </button>
            </div>
          </div>
        </section>

        {isPlaying && selectedVersion ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] bg-white/80 px-5 py-4 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-white/80 backdrop-blur">
              <div>
                <p className="text-sm font-semibold text-slate-500">현재 플레이</p>
                <p className="text-lg font-black text-slate-900">{versionInfo[selectedVersion].label}</p>
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
              <NayulGame onHome={resetToHome} />
            ) : (
              <NarinGame onHome={resetToHome} />
            )}
          </>
        ) : (
          <>
            <VersionSelector selectedVersion={selectedVersion} onSelect={setSelectedVersion} />

            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-slate-100 sm:p-8">
                <h2 className="text-2xl font-black text-slate-900">게임 규칙</h2>
                <p className="mt-3 text-base leading-7 text-slate-600">{heroSummary}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] bg-slate-50 p-4 ring-1 ring-slate-100">
                    <p className="text-sm text-slate-500">선택한 버전</p>
                    <p className="mt-1 text-xl font-black text-slate-900">
                      {selectedVersion ? versionInfo[selectedVersion].label : "아직 선택 전"}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-50 p-4 ring-1 ring-slate-100">
                    <p className="text-sm text-slate-500">종료 규칙</p>
                    <p className="mt-1 text-xl font-black text-slate-900">5번 틀리면 종료</p>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.5rem] bg-emerald-50 p-5 ring-1 ring-emerald-100">
                  <p className="text-sm font-bold text-emerald-700">추천 흐름</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-emerald-950">
                    <li>• 처음엔 나율이 버전으로 그림 위주 적응하기</li>
                    <li>• 익숙해지면 나린이 버전으로 드래그 플레이하기</li>
                    <li>• 오답 5번 안에 최대한 높은 점수 만들기</li>
                  </ul>
                </div>

                {selectedVersion ? (
                  <button
                    type="button"
                    onClick={() => setHasStarted(true)}
                    className="mt-6 w-full rounded-full bg-slate-900 px-5 py-4 text-base font-black text-white shadow-2xl transition hover:-translate-y-0.5"
                  >
                    게임 시작하기
                  </button>
                ) : (
                  <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-200 px-5 py-4 text-center text-sm font-semibold text-slate-500">
                    버전을 고르면 게임을 시작할 수 있어요.
                  </div>
                )}
              </section>

              <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-slate-100 sm:p-8">
                <h2 className="text-2xl font-black text-slate-900">이번 변경점</h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <li>• 시간제한 모드를 제거하고, 전체 게임을 무제한 시간으로 바꿨어요.</li>
                  <li>• 대신 5번 틀리면 끝나는 규칙으로 긴장감을 만들었어요.</li>
                  <li>• 모드 선택 카드에 나율이/나린이 사진을 함께 넣었어요.</li>
                  <li>• 직접 만든 가족 BGM을 홈 화면에서 바로 재생할 수 있어요.</li>
                </ul>
              </section>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
