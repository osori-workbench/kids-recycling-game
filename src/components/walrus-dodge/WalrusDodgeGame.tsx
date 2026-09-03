"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FeedbackToast } from "@/components/recycling/FeedbackToast";
import { clamp, formatSeconds, readBestScore, writeBestScore } from "@/lib/walrus-dodge/game-utils";
import { FallingWalrus } from "@/lib/walrus-dodge/types";

const playerWidthPercent = 10;
const walrusWidthPercent = 11;
const collisionYBand = 8;
const initialSpawnIntervalMs = 950;
const minSpawnIntervalMs = 380;
const initialFallSpeedPercentPerSec = 22;
const maxFallSpeedPercentPerSec = 55;
const difficultyRampSeconds = 30;
const maxLives = 3;
const hitInvulnerabilityMs = 900;

type ToastState = {
  message: string;
  tone: "success" | "error";
};

export function WalrusDodgeGame() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [bestSeconds, setBestSeconds] = useState(() => readBestScore().bestSeconds);
  const [playerX, setPlayerX] = useState(50);
  const [walruses, setWalruses] = useState<FallingWalrus[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [lives, setLives] = useState(maxLives);

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const tickRef = useRef<(timestamp: number) => void>(() => {});
  const lastFrameRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const nextIdRef = useRef(0);
  const elapsedRef = useRef(0);
  const playerXRef = useRef(50);
  const isGameOverRef = useRef(false);
  const livesRef = useRef(maxLives);
  const invulnerableUntilRef = useRef(0);
  const toastTimeoutRef = useRef<number | null>(null);

  const endGame = useCallback(() => {
    if (isGameOverRef.current) return;
    isGameOverRef.current = true;
    setIsGameOver(true);

    const finalSeconds = elapsedRef.current;
    const currentBest = readBestScore().bestSeconds;
    if (finalSeconds > currentBest) {
      writeBestScore({ bestSeconds: finalSeconds });
      setBestSeconds(finalSeconds);
      setToast({ message: `새 기록! ${formatSeconds(finalSeconds)} 버텼어요!`, tone: "success" });
    } else {
      setToast({ message: `바다코끼리에게 3번 부딪혔어요! ${formatSeconds(finalSeconds)} 버텼어요.`, tone: "error" });
    }

    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setToast(null), 1600);
  }, []);

  const tick = useCallback(
    (timestamp: number) => {
      if (isGameOverRef.current) return;

      if (!lastFrameRef.current) {
        lastFrameRef.current = timestamp;
        lastSpawnRef.current = timestamp;
      }

      const deltaMs = timestamp - lastFrameRef.current;
      lastFrameRef.current = timestamp;

      elapsedRef.current += deltaMs / 1000;
      setElapsedSeconds(elapsedRef.current);

      const difficultyProgress = clamp(elapsedRef.current / difficultyRampSeconds, 0, 1);
      const spawnInterval =
        initialSpawnIntervalMs - (initialSpawnIntervalMs - minSpawnIntervalMs) * difficultyProgress;
      const fallSpeed =
        initialFallSpeedPercentPerSec +
        (maxFallSpeedPercentPerSec - initialFallSpeedPercentPerSec) * difficultyProgress;

      if (timestamp - lastSpawnRef.current >= spawnInterval) {
        lastSpawnRef.current = timestamp;
        nextIdRef.current += 1;
        const margin = walrusWidthPercent / 2 + 2;
        setWalruses((prev) => [
          ...prev,
          {
            id: nextIdRef.current,
            x: margin + Math.random() * (100 - margin * 2),
            y: -8,
            size: 46 + Math.random() * 18,
            speed: fallSpeed * (0.85 + Math.random() * 0.3),
            emoji: "🦭",
          },
        ]);
      }

      let hitCount = 0;
      const canBeHit = timestamp >= invulnerableUntilRef.current;

      setWalruses((prev) => {
        const next: FallingWalrus[] = [];
        for (const walrus of prev) {
          const newY = walrus.y + walrus.speed * (deltaMs / 1000);
          if (newY > 108) {
            continue;
          }

          const isColliding =
            canBeHit &&
            newY >= 100 - collisionYBand &&
            newY <= 100 &&
            Math.abs(walrus.x - playerXRef.current) < (playerWidthPercent + walrusWidthPercent) / 2 - 2;

          if (isColliding && hitCount === 0) {
            // Only register one hit per tick, but still remove this walrus from play.
            hitCount += 1;
            continue;
          }

          next.push({ ...walrus, y: newY });
        }
        return next;
      });

      if (hitCount > 0) {
        invulnerableUntilRef.current = timestamp + hitInvulnerabilityMs;
        const remainingLives = Math.max(0, livesRef.current - 1);
        livesRef.current = remainingLives;
        setLives(remainingLives);

        if (remainingLives <= 0) {
          endGame();
          return;
        }

        setToast({ message: `부딪혔어요! 남은 목숨 ${remainingLives}개`, tone: "error" });
        if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = window.setTimeout(() => setToast(null), 1000);
      }

      rafRef.current = requestAnimationFrame(tickRef.current);
    },
    [endGame]
  );

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const startGame = useCallback(() => {
    setHasStarted(true);
    setIsGameOver(false);
    isGameOverRef.current = false;
    setElapsedSeconds(0);
    elapsedRef.current = 0;
    setWalruses([]);
    setPlayerX(50);
    playerXRef.current = 50;
    lastFrameRef.current = 0;
    lastSpawnRef.current = 0;
    nextIdRef.current = 0;
    invulnerableUntilRef.current = 0;
    livesRef.current = maxLives;
    setLives(maxLives);
    setToast(null);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tickRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const updatePlayerFromClientX = useCallback((clientX: number) => {
    const field = fieldRef.current;
    if (!field) return;
    const rect = field.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const nextX = clamp(ratio * 100, playerWidthPercent / 2, 100 - playerWidthPercent / 2);
    playerXRef.current = nextX;
    setPlayerX(nextX);
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!hasStarted || isGameOver) return;
    updatePlayerFromClientX(event.clientX);
  };

  useEffect(() => {
    if (!hasStarted || isGameOver) return;

    const step = 6;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        const nextX = clamp(playerXRef.current - step, playerWidthPercent / 2, 100 - playerWidthPercent / 2);
        playerXRef.current = nextX;
        setPlayerX(nextX);
      } else if (event.key === "ArrowRight") {
        const nextX = clamp(playerXRef.current + step, playerWidthPercent / 2, 100 - playerWidthPercent / 2);
        playerXRef.current = nextX;
        setPlayerX(nextX);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasStarted, isGameOver]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] bg-white/85 px-5 py-3 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-white/80 backdrop-blur">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">버틴 시간</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{formatSeconds(elapsedSeconds)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">최고 기록</p>
            <p className="mt-1 text-2xl font-black text-cyan-600">{formatSeconds(bestSeconds)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">남은 목숨</p>
            <p className="mt-1 text-2xl font-black text-rose-500">
              {"❤️".repeat(Math.max(0, lives))}
              {lives === 0 ? "💔" : null}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={startGame}
          className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
        >
          {hasStarted ? "다시 시작" : "시작하기"}
        </button>
      </div>

      <div
        ref={fieldRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerMove}
        className="relative h-[62vh] min-h-[420px] w-full touch-none overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,_#bfe9ff_0%,_#e9f8ff_55%,_#d7f0ff_100%)] shadow-[0_24px_80px_rgba(40,68,87,0.16)] ring-1 ring-white/70"
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,_rgba(56,142,178,0)_0%,_rgba(56,142,178,0.25)_100%)]" />

        {!hasStarted ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-5xl">🦭</p>
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">하늘에서 바다코끼리가 떨어져요!</h2>
            <p className="max-w-md text-base leading-7 text-slate-600">
              마우스나 손가락으로 준이를 좌우로 움직여서 바다코끼리를 피해보세요. 화살표 키로도 움직일 수 있어요.
              바다코끼리에 <strong>3번</strong> 부딪히면 게임이 끝나요!
            </p>
            <button
              type="button"
              onClick={startGame}
              className="mt-2 rounded-full bg-cyan-500 px-6 py-3 text-lg font-black text-white shadow-lg shadow-cyan-200 transition hover:-translate-y-0.5 hover:bg-cyan-600"
            >
              시작하기
            </button>
          </div>
        ) : null}

        {hasStarted
          ? walruses.map((walrus) => (
              <div
                key={walrus.id}
                className="pointer-events-none absolute -translate-x-1/2 select-none"
                style={{
                  left: `${walrus.x}%`,
                  top: `${walrus.y}%`,
                  fontSize: `${walrus.size}px`,
                  lineHeight: 1,
                }}
              >
                {walrus.emoji}
              </div>
            ))
          : null}

        {hasStarted ? (
          <div
            className="pointer-events-none absolute -translate-x-1/2 select-none text-6xl transition-[left] duration-75 ease-linear"
            style={{ left: `${playerX}%`, top: "88%", lineHeight: 1 }}
          >
            🧒
          </div>
        ) : null}

        {isGameOver ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900/45 px-6 text-center backdrop-blur-sm">
            <p className="text-5xl">😵</p>
            <h2 className="text-2xl font-black text-white sm:text-3xl">바다코끼리에게 3번 부딪혔어요!</h2>
            <p className="text-lg font-bold text-white/90">
              이번 기록 {formatSeconds(elapsedSeconds)} · 최고 기록 {formatSeconds(bestSeconds)}
            </p>
            <button
              type="button"
              onClick={startGame}
              className="mt-1 rounded-full bg-white px-6 py-3 text-lg font-black text-slate-900 shadow-lg transition hover:-translate-y-0.5"
            >
              다시 도전하기
            </button>
          </div>
        ) : null}
      </div>

      {toast ? <FeedbackToast message={toast.message} tone={toast.tone} /> : null}
    </div>
  );
}
