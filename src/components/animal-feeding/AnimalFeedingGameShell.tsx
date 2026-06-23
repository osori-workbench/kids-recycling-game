"use client";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Link from "next/link";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

import { FeedbackToast } from "@/components/recycling/FeedbackToast";
import { AnimalFoodPair, animalFoodPairs, shufflePairs } from "@/lib/animal-feeding/data";

type ToastState = {
  message: string;
  tone: "success" | "error";
};

type FoodCardProps = {
  pair: AnimalFoodPair;
  disabled: boolean;
  matched: boolean;
};

type MeadowSpot = {
  left: string;
  top: string;
  width: string;
  duration: string;
  delay: string;
  roamX: string;
  roamY: string;
};

const toastDurationMs = 1100;

const meadowSpots: MeadowSpot[] = [
  { left: "4%", top: "8%", width: "17%", duration: "6.2s", delay: "0s", roamX: "14px", roamY: "-10px" },
  { left: "23%", top: "20%", width: "16%", duration: "7s", delay: "0.6s", roamX: "-12px", roamY: "10px" },
  { left: "43%", top: "10%", width: "17%", duration: "6.6s", delay: "1.1s", roamX: "16px", roamY: "8px" },
  { left: "63%", top: "22%", width: "16%", duration: "7.4s", delay: "0.4s", roamX: "-14px", roamY: "-8px" },
  { left: "81%", top: "11%", width: "15%", duration: "6.8s", delay: "1.4s", roamX: "10px", roamY: "12px" },
  { left: "9%", top: "50%", width: "18%", duration: "7.5s", delay: "0.8s", roamX: "12px", roamY: "-12px" },
  { left: "30%", top: "62%", width: "16%", duration: "6.9s", delay: "1.6s", roamX: "-15px", roamY: "10px" },
  { left: "47%", top: "47%", width: "17%", duration: "7.1s", delay: "0.2s", roamX: "18px", roamY: "-10px" },
  { left: "66%", top: "61%", width: "16%", duration: "6.4s", delay: "1.2s", roamX: "-10px", roamY: "12px" },
  { left: "82%", top: "49%", width: "15%", duration: "7.3s", delay: "0.9s", roamX: "12px", roamY: "-9px" },
];

function FoodCard({ pair, disabled, matched }: FoodCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: pair.id,
    disabled: disabled || matched,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`rounded-[1.5rem] border border-white/80 bg-white/95 p-4 text-center shadow-[0_12px_30px_rgba(52,84,104,0.12)] transition ${
        matched
          ? "opacity-40 grayscale"
          : disabled
            ? "opacity-70"
            : "cursor-grab active:cursor-grabbing hover:-translate-y-1"
      } ${isDragging ? "scale-105 shadow-2xl" : ""}`}
    >
      <div className="text-4xl sm:text-5xl">{pair.foodEmoji}</div>
      <p className="mt-3 text-lg font-black text-slate-900">{pair.foodName}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
        {matched ? "완료" : "끌어서 주세요"}
      </p>
    </div>
  );
}

type MeadowAnimalProps = {
  pair: AnimalFoodPair;
  matchedFoodId?: string;
  disabled: boolean;
  spot: MeadowSpot;
};

function MeadowAnimal({ pair, matchedFoodId, disabled, spot }: MeadowAnimalProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: pair.id,
    disabled: disabled || Boolean(matchedFoodId),
  });

  const matched = Boolean(matchedFoodId);
  const style = {
    left: spot.left,
    top: spot.top,
    width: spot.width,
    animationDuration: spot.duration,
    animationDelay: spot.delay,
    ["--roam-x" as string]: spot.roamX,
    ["--roam-y" as string]: spot.roamY,
  } as CSSProperties;

  return (
    <div className="absolute min-w-[124px] max-w-[180px] sm:min-w-[132px]" style={style}>
      <div
        ref={setNodeRef}
        className={`animal-roam rounded-[1.75rem] p-[2px] shadow-[0_14px_40px_rgba(52,84,104,0.14)] ${
          matched
            ? "bg-gradient-to-br from-emerald-300 via-lime-300 to-green-400"
            : isOver
              ? "bg-gradient-to-br from-sky-300 via-cyan-300 to-blue-400"
              : "bg-gradient-to-br from-white via-yellow-50 to-lime-50"
        }`}
      >
        <div
          className={`rounded-[calc(1.75rem-2px)] px-4 py-4 text-center backdrop-blur ${
            matched ? "bg-emerald-50/95" : "bg-white/94"
          }`}
        >
          <div className="text-5xl sm:text-6xl">{pair.animalEmoji}</div>
          <h2 className="mt-2 text-lg font-black text-slate-900 sm:text-xl">{pair.animalName}</h2>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            {matched ? "냠냠 완료" : "풀밭에서 놀고 있어요"}
          </p>
          <div
            className={`mt-3 rounded-[1rem] border border-dashed px-3 py-2.5 text-xs font-bold leading-5 ${
              matched
                ? "border-emerald-300 bg-white text-emerald-700"
                : isOver
                  ? "border-sky-400 bg-sky-50 text-sky-700"
                  : "border-slate-200 bg-slate-50 text-slate-500"
            }`}
          >
            {matched ? `${pair.foodEmoji} ${pair.foodName} 잘 먹었어요!` : `${pair.hint}`}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnimalFeedingGameShell() {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const bgmArmedRef = useRef(false);

  const [foodOrder, setFoodOrder] = useState<AnimalFoodPair[]>(() => shufflePairs(animalFoodPairs));
  const [matchedByAnimal, setMatchedByAnimal] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current !== null) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const tryPlayBgm = async ({ fromStart = false }: { fromStart?: boolean } = {}) => {
    if (!audioRef.current) return;

    try {
      audioRef.current.loop = true;
      audioRef.current.muted = false;
      audioRef.current.volume = 1;

      if (fromStart) {
        audioRef.current.currentTime = 0;
      }

      await audioRef.current.play();
    } catch {
      // 사용자 제스처에서 다시 시도할 수 있도록 조용히 무시
    }
  };

  const ensureBgmStarted = () => {
    if (bgmArmedRef.current) return;
    bgmArmedRef.current = true;
    void tryPlayBgm();
  };

  const showToast = (nextToast: ToastState) => {
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    setToast(nextToast);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, toastDurationMs);
  };

  const matchedFoodIds = useMemo(() => new Set(Object.values(matchedByAnimal)), [matchedByAnimal]);
  const allFed = score === animalFoodPairs.length;
  const interactionLocked = allFed || toast !== null;

  const restartGame = () => {
    setFoodOrder(shufflePairs(animalFoodPairs));
    setMatchedByAnimal({});
    setScore(0);
    setAttempts(0);
    setToast(null);
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    bgmArmedRef.current = true;
    void tryPlayBgm({ fromStart: true });
  };

  const handleDragStart = () => {
    ensureBgmStarted();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (interactionLocked) return;

    const targetAnimalId = event.over?.id?.toString();
    const draggedFoodId = event.active.id.toString();

    if (!targetAnimalId) return;
    if (matchedByAnimal[targetAnimalId] || matchedFoodIds.has(draggedFoodId)) return;

    const animal = animalFoodPairs.find((pair) => pair.id === targetAnimalId);
    const food = animalFoodPairs.find((pair) => pair.id === draggedFoodId);

    if (!animal || !food) return;

    setAttempts((prev) => prev + 1);

    if (animal.id === food.id) {
      setMatchedByAnimal((prev) => ({ ...prev, [animal.id]: food.id }));
      setScore((prev) => prev + 1);
      showToast({
        tone: "success",
        message: `${animal.animalName}가 ${food.foodName}를 맛있게 먹었어요!`,
      });
      return;
    }

    showToast({
      tone: "error",
      message: `${animal.animalName}는 ${food.foodName} 말고 ${animal.foodName}를 좋아해요!`,
    });
  };

  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff9db,_#eef8ff_48%,_#eef7ef)] px-4 pb-40 pt-6 text-slate-800 sm:px-6 lg:px-8"
      onPointerDownCapture={ensureBgmStarted}
      onKeyDownCapture={ensureBgmStarted}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">김나스 가족 게임</p>
            <h1 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">동물 먹이주기</h1>
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

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] bg-gradient-to-br from-amber-400 via-orange-400 to-pink-400 p-[2px] shadow-[0_20px_60px_rgba(239,132,86,0.24)]">
            <div className="flex h-full flex-col gap-4 rounded-[calc(2rem-2px)] bg-white/95 p-6 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">놀이 방법</p>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">풀밭에서 돌아다니는 동물에게 먹이를 주세요</h2>
                </div>
                <div className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">
                  총 {animalFoodPairs.length}마리
                </div>
              </div>
              <p className="text-base leading-7 text-slate-600">
                아래 먹이 바구니에서 카드를 끌어와 풀밭 속 동물 친구에게 주세요. 첫 터치나 드래그를 하면 BGM도
                함께 시작되도록 바꿨어요.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="rounded-[1.75rem] bg-white/90 p-5 text-center shadow-[0_16px_40px_rgba(52,84,104,0.12)] ring-1 ring-white/80">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">점수</p>
              <p className="mt-2 text-4xl font-black text-slate-900">{score}</p>
            </div>
            <div className="rounded-[1.75rem] bg-white/90 p-5 text-center shadow-[0_16px_40px_rgba(52,84,104,0.12)] ring-1 ring-white/80">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">시도</p>
              <p className="mt-2 text-4xl font-black text-slate-900">{attempts}</p>
            </div>
            <div className="rounded-[1.75rem] bg-white/90 p-5 text-center shadow-[0_16px_40px_rgba(52,84,104,0.12)] ring-1 ring-white/80">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">남은 동물</p>
              <p className="mt-2 text-4xl font-black text-slate-900">{animalFoodPairs.length - score}</p>
            </div>
          </div>
        </section>

        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <section className="rounded-[2.5rem] bg-gradient-to-b from-sky-200 via-emerald-100 to-lime-200 p-[2px] shadow-[0_24px_80px_rgba(88,140,136,0.18)]">
            <div className="animal-meadow relative overflow-hidden rounded-[calc(2.5rem-2px)] bg-[linear-gradient(180deg,rgba(219,243,255,0.95)_0%,rgba(214,244,214,0.94)_30%,rgba(173,225,157,0.98)_100%)] px-3 py-6 sm:px-5 lg:px-6">
              <div className="pointer-events-none absolute left-[6%] top-[10%] h-12 w-24 rounded-full bg-white/60 blur-md" />
              <div className="pointer-events-none absolute left-[30%] top-[14%] h-10 w-20 rounded-full bg-white/55 blur-md" />
              <div className="pointer-events-none absolute right-[10%] top-[16%] h-12 w-24 rounded-full bg-white/60 blur-md" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(circle_at_center,rgba(134,208,121,0.25),rgba(134,208,121,0)_68%)]" />

              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 px-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">풀밭 놀이터</p>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">동물들이 돌아다니는 들판</h2>
                </div>
                <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm ring-1 ring-white/90">
                  움직이는 동물에게 먹이 주기
                </div>
              </div>

              <div className="relative min-h-[820px] sm:min-h-[880px] lg:min-h-[760px] xl:min-h-[820px]">
                {animalFoodPairs.map((pair, index) => (
                  <MeadowAnimal
                    key={pair.id}
                    pair={pair}
                    matchedFoodId={matchedByAnimal[pair.id]}
                    disabled={interactionLocked}
                    spot={meadowSpots[index]}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white/88 p-5 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-white/80 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500">먹이 바구니</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">먹이를 끌어와 풀밭 속 동물에게 주세요</h2>
              </div>
              <div className="rounded-full bg-sky-100 px-4 py-2 text-sm font-bold text-sky-700">드래그 놀이</div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {foodOrder.map((pair) => (
                <FoodCard key={pair.id} pair={pair} disabled={interactionLocked} matched={matchedFoodIds.has(pair.id)} />
              ))}
            </div>
          </section>
        </DndContext>

        {allFed ? (
          <section className="rounded-[2rem] bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 p-[2px] shadow-[0_18px_50px_rgba(76,175,158,0.22)]">
            <div className="rounded-[calc(2rem-2px)] bg-white/95 p-6 text-center sm:p-8">
              <p className="text-5xl">🎉</p>
              <h2 className="mt-3 text-3xl font-black text-slate-900">동물 친구 모두 배불러요!</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                총 {attempts}번 시도해서 {animalFoodPairs.length}마리 모두에게 먹이를 줬어요.
              </p>
            </div>
          </section>
        ) : null}

        {toast ? <FeedbackToast message={toast.message} tone={toast.tone} /> : null}
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
