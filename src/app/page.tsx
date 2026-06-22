"use client";

import { useRef, useState } from "react";

import { NarinGame } from "@/components/recycling/NarinGame";
import { NayulGame } from "@/components/recycling/NayulGame";
import { VersionSelector } from "@/components/recycling/VersionSelector";
import { versionInfo } from "@/lib/recycling/data";
import { GameVersion } from "@/lib/recycling/types";

export default function Home() {
  const [selectedVersion, setSelectedVersion] = useState<GameVersion | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [gameSessionKey, setGameSessionKey] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isPlaying = Boolean(hasStarted && selectedVersion);

  const handleStartVersion = (version: GameVersion) => {
    setSelectedVersion(version);
    setHasStarted(true);
    setGameSessionKey((prev) => prev + 1);
  };

  const resetToHome = () => {
    setHasStarted(false);
    setSelectedVersion(null);
  };

  const restartCurrentGame = () => {
    setGameSessionKey((prev) => prev + 1);
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7d6,_#f4fbff_45%,_#eef7ef)] px-4 pb-40 pt-6 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        {isPlaying && selectedVersion ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] bg-white/85 px-5 py-3 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-white/80 backdrop-blur">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">현재 플레이</p>
                <p className="mt-1 text-xl font-black text-slate-900">{versionInfo[selectedVersion].label}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={restartCurrentGame}
                  className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
                >
                  다시 시작
                </button>
                <button
                  type="button"
                  onClick={resetToHome}
                  className="rounded-full bg-white px-4 py-2.5 text-sm font-bold text-slate-900 ring-1 ring-slate-200 transition hover:-translate-y-0.5"
                >
                  버전 다시 고르기
                </button>
              </div>
            </div>

            {selectedVersion === "nayul" ? (
              <NayulGame key={`nayul-${gameSessionKey}`} />
            ) : (
              <NarinGame key={`narin-${gameSessionKey}`} />
            )}
          </>
        ) : (
          <VersionSelector selectedVersion={selectedVersion} onSelect={handleStartVersion} />
        )}
      </div>

      <section className="fixed inset-x-0 bottom-0 z-20 border-t border-white/70 bg-white/90 px-4 py-3 shadow-[0_-12px_40px_rgba(52,84,104,0.14)] backdrop-blur sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-500">BGM</p>
            <h2 className="mt-1 text-lg font-black text-slate-900">유니콘 하트 우리 가족</h2>
          </div>
          <div className="flex w-full flex-col gap-2 lg:w-auto lg:min-w-[420px] lg:flex-row lg:items-center lg:justify-end">
            <audio
              ref={audioRef}
              className="w-full lg:max-w-md"
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
              재생
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
