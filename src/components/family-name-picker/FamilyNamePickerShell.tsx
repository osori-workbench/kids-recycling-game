"use client";

import Link from "next/link";
import { useState } from "react";

import { FamilyNamePickerGame } from "@/components/family-name-picker/FamilyNamePickerGame";

export function FamilyNamePickerShell() {
  const [gameSessionKey, setGameSessionKey] = useState(0);

  const restartGame = () => {
    setGameSessionKey((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7d6,_#f4fbff_45%,_#eef7ef)] px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">김나스 가족 게임</p>
            <h1 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">우리 가족 이름 찾기</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              보기 5개 중에서 우리 가족 이름 하나를 찾아 눌러요. 가족 이름이 아닌 보기들도 섞여 있어요.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={restartGame}
              className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
            >
              다시 시작
            </button>
            <Link
              href="/"
              className="rounded-full bg-white/90 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-[0_12px_30px_rgba(52,84,104,0.12)] ring-1 ring-white/90 transition hover:-translate-y-0.5"
            >
              ← 게임 목록으로
            </Link>
          </div>
        </div>

        <FamilyNamePickerGame key={gameSessionKey} />
      </div>
    </main>
  );
}
