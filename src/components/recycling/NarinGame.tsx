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
import { useEffect, useMemo, useRef, useState } from "react";

import { RecyclingBinButton } from "@/components/recycling/RecyclingBinButton";
import { ResultPanel } from "@/components/recycling/ResultPanel";
import { ScoreBoard } from "@/components/recycling/ScoreBoard";
import { categories } from "@/lib/recycling/data";
import { accuracy, allCategories, nextItem, readBestScores, writeBestScores } from "@/lib/recycling/game-utils";
import { BestScores, Category, RecyclingItem } from "@/lib/recycling/types";

const maxMistakes = 5;
const toastDurationMs = 1400;

type DraggableCardProps = {
  item: RecyclingItem;
  disabled: boolean;
};

type DroppableBinProps = {
  category: Category;
  disabled: boolean;
  helperText: string;
};

type ToastState = {
  message: string;
  tone: "success" | "error";
};

function DraggableCard({ item, disabled }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: "recycling-item",
    disabled,
  });
  const [renderedOffset, setRenderedOffset] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    targetRef.current = {
      x: transform?.x ?? 0,
      y: transform?.y ?? 0,
    };

    if (rafRef.current !== null) {
      return;
    }

    const animate = () => {
      let shouldContinue = false;

      setRenderedOffset((prev) => {
        const dx = targetRef.current.x - prev.x;
        const dy = targetRef.current.y - prev.y;

        const next = {
          x: Math.abs(dx) < 0.5 ? targetRef.current.x : prev.x + dx * 0.18,
          y: Math.abs(dy) < 0.5 ? targetRef.current.y : prev.y + dy * 0.18,
        };

        shouldContinue =
          Math.abs(targetRef.current.x - next.x) > 0.5 ||
          Math.abs(targetRef.current.y - next.y) > 0.5 ||
          isDragging;

        return next;
      });

      if (shouldContinue) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [isDragging, transform]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const style = {
    transform: `translate3d(${renderedOffset.x}px, ${renderedOffset.y}px, 0)`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`mx-auto w-full max-w-3xl touch-none select-none rounded-[2rem] border border-sky-100 bg-gradient-to-r from-cyan-50 via-sky-50 to-indigo-50 p-5 shadow-[0_18px_60px_rgba(52,84,104,0.12)] transition sm:p-6 ${
        disabled ? "opacity-60" : "cursor-grab active:cursor-grabbing"
      } ${isDragging ? "scale-[1.02] shadow-2xl" : ""}`}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-500">드래그 카드</p>

      <div className="mt-4 flex items-center gap-4 sm:gap-6">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.5rem] bg-white/75 text-6xl shadow-sm sm:h-28 sm:w-28 sm:text-7xl">
          {item.emoji}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-3xl font-black text-slate-900 sm:text-4xl lg:text-[2.75rem]">{item.name}</h3>
        </div>
      </div>
    </div>
  );
}

function DroppableBin({ category, disabled, helperText }: DroppableBinProps) {
  const info = categories[category];
  const { isOver, setNodeRef } = useDroppable({
    id: category,
    disabled,
  });

  return (
    <div ref={setNodeRef} className={`${isOver ? "scale-[1.02]" : ""} transition`}>
      <RecyclingBinButton
        info={info}
        label={helperText}
        disabled={disabled}
        className={isOver ? "shadow-2xl ring-4 ring-sky-200" : ""}
      >
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center text-sm font-bold text-slate-600">
          여기에 놓기
        </div>
      </RecyclingBinButton>
    </div>
  );
}

export function NarinGame() {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const [currentItem, setCurrentItem] = useState<RecyclingItem>(() => nextItem());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [bestScores, setBestScores] = useState<BestScores>(() => readBestScores("narin"));
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    writeBestScores("narin", bestScores);
  }, [bestScores]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current !== null) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const accuracyValue = useMemo(() => accuracy(score, questionCount), [questionCount, score]);
  const bestScore = Math.max(bestScores.practice, score);
  const remainingChances = Math.max(0, maxMistakes - mistakes);
  const interactionLocked = isFinished || toast !== null;

  const showToastThen = (nextToast: ToastState, afterToast?: () => void) => {
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    setToast(nextToast);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
      afterToast?.();
    }, toastDurationMs);
  };

  const handleAnswer = (selectedCategory: Category) => {
    if (interactionLocked) return;

    const correct = selectedCategory === currentItem.category;
    const answerInfo = categories[currentItem.category];
    setQuestionCount((prev) => prev + 1);

    if (correct) {
      const nextScoreValue = score + 1;
      const nextStreak = streak + 1;
      const nextQuestion = nextItem(currentItem);

      setScore(nextScoreValue);
      setStreak(nextStreak);
      setBestScores((prev) =>
        nextScoreValue > prev.practice ? { ...prev, practice: nextScoreValue } : prev
      );

      showToastThen(
        {
          tone: "success",
          message: `정답! ${currentItem.name}는 ${answerInfo.label} 통이에요.${nextStreak >= 2 ? ` ${nextStreak}콤보!` : ""}`,
        },
        () => setCurrentItem(nextQuestion)
      );
      return;
    }

    const nextMistakes = mistakes + 1;
    setMistakes(nextMistakes);
    setStreak(0);

    if (nextMistakes >= maxMistakes) {
      setIsFinished(true);
      showToastThen({
        tone: "error",
        message: `아쉬워요! ${currentItem.name}는 ${answerInfo.label} 통이에요. 다섯 번 틀려서 게임 종료예요.`,
      });
      return;
    }

    const nextQuestion = nextItem(currentItem);
    showToastThen(
      {
        tone: "error",
        message: `아쉬워요! ${currentItem.name}는 ${answerInfo.label} 통이에요. 남은 기회 ${maxMistakes - nextMistakes}번!`,
      },
      () => setCurrentItem(nextQuestion)
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const target = event.over?.id;
    if (!target) return;
    handleAnswer(target as Category);
  };

  return (
    <section className="grid gap-5">
      <ScoreBoard
        title="나린이 버전"
        score={score}
        accuracy={accuracyValue}
        streak={streak}
        mistakes={mistakes}
        remainingChances={remainingChances}
        bestScore={bestScore}
        accentClassName="bg-gradient-to-br from-cyan-600 via-sky-600 to-indigo-700"
      />

      <div className="relative rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-slate-100 sm:p-8 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-500">나린이 버전</p>

        <div className="mt-6">
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <DraggableCard key={currentItem.name} item={currentItem} disabled={interactionLocked} />

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {allCategories().map((category) => (
                <DroppableBin
                  key={category}
                  category={category}
                  disabled={interactionLocked}
                  helperText="끌어다 놓기"
                />
              ))}
            </div>
          </DndContext>
        </div>

        {toast ? (
          <div className="pointer-events-none fixed inset-x-0 top-24 z-30 flex justify-center px-4">
            <div
              className={`max-w-2xl rounded-[1.5rem] px-6 py-4 text-center text-base font-black text-white shadow-2xl backdrop-blur sm:text-lg ${
                toast.tone === "success"
                  ? "bg-emerald-500/95 shadow-emerald-200"
                  : "bg-rose-500/95 shadow-rose-200"
              }`}
            >
              {toast.message}
            </div>
          </div>
        ) : null}
      </div>

      {isFinished ? (
        <ResultPanel
          title="나린이 게임 종료!"
          body="다섯 번 틀리면 끝나는 규칙이에요. 위쪽 다시 시작 버튼으로 바로 또 도전할 수 있어요."
          score={score}
          accuracy={accuracyValue}
        />
      ) : null}
    </section>
  );
}
