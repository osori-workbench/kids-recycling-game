"use client";

import Link from "next/link";
import { useRef } from "react";

import { WalrusDodgeGame } from "@/components/walrus-dodge/WalrusDodgeGame";
import { walrusDodgeBgm } from "@/lib/walrus-dodge/media";

export function WalrusDodgeGameShell() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bgmArmedRef = useRef(false);

  const tryPlayBgm = async () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.loop = true;
      audioRef.current.muted = false;
      audioRef.current.volume = 1;
      await audioRef.current.play();
    } catch {
      // 자동재생 제한이 있을 수 있어 다음 제스처나 재생 버튼에서 다시 시도
    }
  };

  const ensureBgmStarted = () => {
    if (bgmArmedRef.current) return;
    bgmArmedRef.current = true;
    void tryPlayBgm();
  };

  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f7ff,_#f4fbff_45%,_#eef7ef)] px-4 pb-40 pt-6 text-slate-800 sm:px-6 lg:px-8"
      onPointerDownCapture={ensureBgmStarted}
      onKeyDownCapture={ensureBgmStarted}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">김나스 가족 게임</p>
            <h1 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">바다코끼리 피하기</h1>
          </div>
          <Link
            href="/"
            className="rounded-full bg-white/90 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-[0_12px_30px_rgba(52,84,104,0.12)] ring-1 ring-white/90 transition hover:-translate-y-0.5"
          >
            ← 게임 목록으로
          </Link>
        </div>

        <WalrusDodgeGame />
      </div>

      <section className="fixed inset-x-0 bottom-0 z-20 border-t border-white/70 bg-white/90 px-4 py-3 shadow-[0_-12px_40px_rgba(52,84,104,0.14)] backdrop-blur sm:px-6">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-500">BGM</p>
            <h2 className="mt-1 text-lg font-black text-slate-900">{walrusDodgeBgm.title}</h2>
            <p className="mt-1 text-sm text-slate-500">바다코끼리 게임 전용 노래예요.</p>
          </div>
          <div className="flex w-full flex-col gap-2 lg:w-auto lg:min-w-[420px] lg:flex-row lg:items-center lg:justify-end">
            <audio
              ref={audioRef}
              className="w-full lg:max-w-md"
              src={walrusDodgeBgm.src}
              controls
              loop
              preload="auto"
              playsInline
            />
            <button
              type="button"
              onClick={() => {
                bgmArmedRef.current = true;
                void tryPlayBgm();
              }}
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
