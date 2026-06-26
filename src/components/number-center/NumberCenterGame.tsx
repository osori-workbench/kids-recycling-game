"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { FeedbackToast } from "@/components/recycling/FeedbackToast";
import { ResultPanel } from "@/components/recycling/ResultPanel";
import { versionInfo } from "@/lib/number-center/data";
import { accuracy, nextPuzzle, readBestScores, writeBestScores } from "@/lib/number-center/game-utils";
import { BestScores, NumberGameVersion, NumberPuzzle } from "@/lib/number-center/types";

const maxMistakes = 5;
const toastDurationMs = 1200;

type ToastState = {
  message: string;
  tone: "success" | "error";
};

type NumberCenterGameProps = {
  version: NumberGameVersion;
};

function NumberChip({ value, hidden = false }: { value: number; hidden?: boolean }) {
  return (
    <div
      className={`flex min-h-24 items-center justify-center rounded-[1.75rem] px-4 py-5 text-center text-3xl font-black shadow-sm ring-1 sm:min-h-28 sm:text-4xl ${
        hidden
          ? "bg-slate-900 text-white ring-slate-900"
          : "bg-white text-slate-900 ring-slate-100"
      }`}
    >
      {hidden ? "ㅇ" : value}
    </div>
  );
}

export function NumberCenterGame({ version }: NumberCenterGameProps) {
  const info = versionInfo[version];
  const [puzzle, setPuzzle] = useState<NumberPuzzle>(() => nextPuzzle(version));
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [bestScores, setBestScores] = useState<BestScores>(() => readBestScores(version));
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    writeBestScores(version, bestScores);
  }, [bestScores, version]);

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

  const handleAnswer = (choice: number) => {
    if (interactionLocked) return;

    const correct = choice === puzzle.answer;
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
          message: `${puzzle.explanation}${nextStreak >= 2 ? ` ${nextStreak}콤보!` : ""}`,
        },
        () => setPuzzle(nextPuzzle(version))
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
        message: `아쉬워요! 가운데 숫자는 ${puzzle.answer}예요. 다섯 번 틀려서 게임 종료예요.`,
      });
      return;
    }

    showToastThen(
      {
        tone: "error",
        message: `아쉬워요! 가운데 숫자는 ${puzzle.answer}예요. ${puzzle.explanation.replace("정답! ", "")}`,
      },
      () => setPuzzle(nextPuzzle(version))
    );
  };

  return (
    <section className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={`rounded-[1.75rem] bg-gradient-to-br ${info.accentClassName} p-[2px] shadow-[0_18px_50px_rgba(52,84,104,0.14)]`}>
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
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">{info.label}</p>

        <div className={`mt-6 mx-auto w-full max-w-5xl rounded-[2rem] bg-gradient-to-br ${info.softPanelClassName} p-5 ring-1 ring-white/80 sm:p-6`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">가운데에 들어갈 숫자를 골라요</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                숫자 규칙을 보고 빈칸 가운데에 들어갈 숫자를 눌러보세요.
              </p>
            </div>
            <div className="rounded-full bg-white/85 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-white/80">
              {info.example} 같은 문제
            </div>
          </div>

          <div className={`mt-8 grid gap-3 ${version === "nayul" ? "grid-cols-3" : "grid-cols-5"}`}>
            {puzzle.displayNumbers.map((value, index) => {
              const hiddenIndex = Math.floor(puzzle.displayNumbers.length / 2);
              return <NumberChip key={`${value}-${index}`} value={value} hidden={index === hiddenIndex} />;
            })}
          </div>
        </div>

        <div className={`mt-8 grid gap-4 ${version === "nayul" ? "sm:grid-cols-3" : "sm:grid-cols-2 xl:grid-cols-4"}`}>
          {puzzle.choices.map((choice) => (
            <button
              key={choice}
              type="button"
              disabled={interactionLocked}
              onClick={() => handleAnswer(choice)}
              className={`rounded-[1.75rem] px-4 py-6 text-center text-3xl font-black text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${info.accentButtonClassName}`}
            >
              {choice}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-[1.5rem] bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-600 ring-1 ring-slate-100">
          <strong className="font-black text-slate-900">힌트:</strong> 숫자가 조금씩 커지는지, 작아지는지, 몇 칸씩 건너뛰는지 보면 쉬워요.
        </div>

        {toast ? <FeedbackToast message={toast.message} tone={toast.tone} /> : null}
      </div>

      {isFinished ? (
        <ResultPanel
          title={`${info.shortLabel} 숫자 놀이 종료!`}
          body="다섯 번 틀리면 끝나는 규칙이에요. 위쪽 다시 시작 버튼으로 바로 또 도전할 수 있어요."
          score={score}
          accuracy={accuracyValue}
        />
      ) : null}
    </section>
  );
}
