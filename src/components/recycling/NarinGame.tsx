"use client";

import { DndContext, DragEndEvent, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";

import { RecyclingBinButton } from "@/components/recycling/RecyclingBinButton";
import { ResultPanel } from "@/components/recycling/ResultPanel";
import { ScoreBoard } from "@/components/recycling/ScoreBoard";
import { categories, challengeSeconds } from "@/lib/recycling/data";
import { accuracy, allCategories, modeSummary, nextItem, readBestScores, writeBestScores } from "@/lib/recycling/game-utils";
import { BestScores, Category, GameMode, RecyclingItem } from "@/lib/recycling/types";

type NarinGameProps = {
  mode: GameMode;
  onHome: () => void;
};

type DraggableCardProps = {
  item: RecyclingItem;
  disabled: boolean;
};

type DroppableBinProps = {
  category: Category;
  disabled: boolean;
  helperText: string;
};

function DraggableCard({ item, disabled }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: "recycling-item",
    disabled,
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
      className={`rounded-[2rem] border border-sky-100 bg-gradient-to-br from-cyan-50 via-sky-50 to-indigo-50 p-8 text-center shadow-[0_18px_60px_rgba(52,84,104,0.12)] transition ${
        disabled ? "opacity-60" : "cursor-grab active:cursor-grabbing"
      } ${isDragging ? "scale-105 shadow-2xl" : ""}`}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-500">드래그 카드</p>
      <div className="mt-5 text-8xl sm:text-9xl">{item.emoji}</div>
      <h3 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">{item.name}</h3>
      <p className="mt-4 text-base leading-7 text-slate-600">카드를 꾹 누르거나 잡고 아래 쓰레기통으로 끌어다 놓아보세요.</p>
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

export function NarinGame({ mode, onHome }: NarinGameProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const [currentItem, setCurrentItem] = useState<RecyclingItem>(() => nextItem());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(challengeSeconds);
  const [feedback, setFeedback] = useState(modeSummary(mode));
  const [isFinished, setIsFinished] = useState(false);
  const [bestScores, setBestScores] = useState<BestScores>(() => readBestScores("narin"));

  useEffect(() => {
    writeBestScores("narin", bestScores);
  }, [bestScores]);

  useEffect(() => {
    if (mode !== "challenge" || isFinished) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setIsFinished(true);
          setFeedback("게임 종료! 다시 도전해서 콤보 기록을 더 늘려보세요.");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isFinished, mode]);

  const accuracyValue = useMemo(() => accuracy(score, questionCount), [questionCount, score]);
  const bestScore = Math.max(bestScores[mode], score);

  const restart = () => {
    setCurrentItem(nextItem());
    setScore(0);
    setStreak(0);
    setQuestionCount(0);
    setSecondsLeft(challengeSeconds);
    setFeedback(modeSummary(mode));
    setIsFinished(false);
  };

  const handleAnswer = (selectedCategory: Category) => {
    if (isFinished) return;

    const correct = selectedCategory === currentItem.category;
    const answerInfo = categories[currentItem.category];
    setQuestionCount((prev) => prev + 1);

    if (correct) {
      const nextScoreValue = score + 1;
      const nextStreak = streak + 1;
      setScore(nextScoreValue);
      setStreak(nextStreak);
      setBestScores((prev) =>
        nextScoreValue > prev[mode] ? { ...prev, [mode]: nextScoreValue } : prev
      );
      setFeedback(
        `정답! ${currentItem.name}는 ${answerInfo.label} 통입니다. ${currentItem.fact} ${
          nextStreak >= 2 ? `현재 ${nextStreak}콤보예요!` : ""
        }`
      );
    } else {
      setStreak(0);
      setFeedback(`아쉬워요! ${currentItem.name}는 ${answerInfo.label} 통이에요. ${currentItem.tip}`);
    }

    setCurrentItem(nextItem(currentItem));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const target = event.over?.id;
    if (!target) return;
    handleAnswer(target as Category);
  };

  return (
    <section className="grid gap-6">
      <ScoreBoard
        title="나린이 버전"
        score={score}
        accuracy={accuracyValue}
        streak={streak}
        timeLabel={mode === "challenge" ? `${secondsLeft}s` : "∞"}
        bestScore={bestScore}
        accentClassName="bg-gradient-to-br from-cyan-600 via-sky-600 to-indigo-700"
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-slate-100 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-500">나린이 버전</p>
          <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">카드를 끌어다 쓰레기통에 넣어보세요!</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            진짜 게임처럼 화면을 크게 쓰고, 점수와 콤보를 모으는 방식이에요.
          </p>

          <div className="mt-6">
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <DraggableCard item={currentItem} disabled={isFinished} />

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {allCategories().map((category) => (
                  <DroppableBin
                    key={category}
                    category={category}
                    disabled={isFinished}
                    helperText="끌어다 놓기"
                  />
                ))}
              </div>
            </DndContext>
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-sky-50 p-5 ring-1 ring-sky-100">
            <p className="text-sm font-bold text-sky-700">게임 메시지</p>
            <p className="mt-2 text-base leading-7 text-sky-950">{feedback}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-slate-100">
            <h3 className="text-xl font-black text-slate-900">게임 포인트</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>• 큰 카드와 큰 쓰레기통으로 진짜 게임처럼 플레이해요.</li>
              <li>• 연속 정답이 이어지면 콤보가 쌓여 성취감이 커져요.</li>
              <li>• 60초 도전 모드에서는 집중력과 반응 속도까지 함께 길러요.</li>
            </ul>
          </section>

          {isFinished ? (
            <ResultPanel
              title="나린이 도전 완료!"
              body="좋은 플레이였어요. 다시 시작해서 더 높은 점수와 콤보를 만들어봐요."
              score={score}
              accuracy={accuracyValue}
              onRetry={restart}
              onHome={onHome}
            />
          ) : (
            <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-slate-100">
              <h3 className="text-xl font-black text-slate-900">다음 행동</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={restart}
                  className="rounded-full bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-600"
                >
                  다시 시작
                </button>
                <button
                  type="button"
                  onClick={onHome}
                  className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 ring-1 ring-slate-200 transition hover:-translate-y-0.5"
                >
                  홈으로 돌아가기
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
