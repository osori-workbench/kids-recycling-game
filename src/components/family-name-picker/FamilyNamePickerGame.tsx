"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { FeedbackToast } from "@/components/recycling/FeedbackToast";
import { ResultPanel } from "@/components/recycling/ResultPanel";
import { accuracy, nextQuestion, readBestScores, writeBestScores } from "@/lib/family-name-picker/game-utils";
import { BestScores, FamilyNameQuestion } from "@/lib/family-name-picker/types";

const maxMistakes = 5;
const toastDurationMs = 1200;

type ToastState = {
  message: string;
  tone: "success" | "error";
};

export function FamilyNamePickerGame() {
  const [question, setQuestion] = useState<FamilyNameQuestion>(() => nextQuestion());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [bestScores, setBestScores] = useState<BestScores>(() => readBestScores());
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    writeBestScores(bestScores);
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

  const handleChoice = (choice: string) => {
    if (interactionLocked) return;

    const correct = choice === question.answer;
    setQuestionCount((prev) => prev + 1);

    if (correct) {
      const nextScoreValue = score + 1;
      const nextStreak = streak + 1;

      setScore(nextScoreValue);
      setStreak(nextStreak);
      setBestScores((prev) =>
        nextScoreValue > prev.practice ? { ...prev, practice: nextScoreValue } : prev
      );

      showToastThen(
        {
          tone: "success",
          message: `${question.answer} 찾기 성공!${nextStreak >= 2 ? ` ${nextStreak}콤보!` : ""}`,
        },
        () => setQuestion(nextQuestion())
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
        message: `아쉬워요! 이번 정답은 ${question.answer}이에요. 다섯 번 틀려서 게임 종료예요.`,
      });
      return;
    }

    showToastThen(
      {
        tone: "error",
        message: `아쉬워요! 이번 정답은 ${question.answer}이에요.`,
      },
      () => setQuestion(nextQuestion())
    );
  };

  return (
    <section className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.75rem] bg-gradient-to-br from-rose-400 via-pink-400 to-orange-300 p-[2px] shadow-[0_18px_50px_rgba(52,84,104,0.14)]">
          <div className="h-full rounded-[calc(1.75rem-2px)] bg-white/96 p-5">
            <p className="text-sm text-slate-500">점수</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{score}점</p>
          </div>
        </div>
        <div className="rounded-[1.75rem] bg-white/92 p-5 shadow-[0_18px_50px_rgba(52,84,104,0.12)] ring-1 ring-white/80">
          <p className="text-sm text-slate-500">정확도</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{accuracyValue}%</p>
        </div>
        <div className="rounded-[1.75rem] bg-white/92 p-5 shadow-[0_18px_50px_rgba(52,84,104,0.12)] ring-1 ring-white/80">
          <p className="text-sm text-slate-500">최고 기록</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{bestScore}점</p>
        </div>
        <div className="rounded-[1.75rem] bg-white/92 p-5 shadow-[0_18px_50px_rgba(52,84,104,0.12)] ring-1 ring-white/80">
          <p className="text-sm text-slate-500">남은 기회</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{remainingChances}번</p>
        </div>
      </div>

      <div className="relative rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-slate-100 sm:p-8 lg:p-10">
        <div className="rounded-[2rem] bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-5 ring-1 ring-white/80 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-500">이름 고르기</p>
              <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">우리 가족 이름 하나를 골라요</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                아래 보기 5개 중에서 우리 가족 이름은 딱 하나예요. 큰 버튼을 눌러서 맞혀보세요.
              </p>
            </div>
            <div className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-white/80">
              보기 5개 중 정답 1개
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {question.choices.map((choice) => (
            <button
              key={choice}
              type="button"
              disabled={interactionLocked}
              onClick={() => handleChoice(choice)}
              className="rounded-[1.75rem] bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 px-5 py-7 text-center text-3xl font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:text-4xl"
            >
              {choice}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-[1.5rem] bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-600 ring-1 ring-slate-100">
          <strong className="font-black text-slate-900">힌트:</strong> 우리 가족 이름만 정답이에요. 낯선 이름은 속임수 보기일 수 있어요.
        </div>

        {toast ? <FeedbackToast message={toast.message} tone={toast.tone} /> : null}
      </div>

      {isFinished ? (
        <ResultPanel
          title="우리 가족 이름 찾기 종료!"
          body="다섯 번 틀리면 끝나요. 위쪽 다시 시작 버튼으로 바로 또 도전할 수 있어요."
          score={score}
          accuracy={accuracyValue}
        />
      ) : null}
    </section>
  );
}
