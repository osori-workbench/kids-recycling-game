"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FeedbackToast } from "@/components/recycling/FeedbackToast";
import { ResultPanel } from "@/components/recycling/ResultPanel";
import { versionInfo } from "@/lib/family-name-picker/data";
import {
  accuracy,
  advanceSession,
  createInitialSession,
  readBestScores,
  writeBestScores,
} from "@/lib/family-name-picker/game-utils";
import {
  BestScores,
  FamilyNameGameSession,
  FamilyNameVersion,
} from "@/lib/family-name-picker/types";

const maxMistakes = 5;
const toastDurationMs = 1200;

type ToastState = {
  message: string;
  tone: "success" | "error";
};

type FamilyNamePickerGameProps = {
  version: FamilyNameVersion;
};

export function FamilyNamePickerGame({ version }: FamilyNamePickerGameProps) {
  const info = versionInfo[version];
  const [session, setSession] = useState<FamilyNameGameSession>(() => createInitialSession(version));
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [bestScores, setBestScores] = useState<BestScores>(() => readBestScores(version));
  const [roundStartedAt, setRoundStartedAt] = useState(() => Date.now());
  const [timeNow, setTimeNow] = useState(() => Date.now());
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

  const question = session.question;
  const accuracyValue = useMemo(() => accuracy(score, questionCount), [questionCount, score]);
  const bestScore = Math.max(bestScores.practice, score);
  const remainingChances = Math.max(0, maxMistakes - mistakes);
  const interactionLocked = isFinished || toast !== null;
  const deadlineAt = info.timeLimitSeconds ? roundStartedAt + info.timeLimitSeconds * 1000 : null;
  const secondsLeft =
    deadlineAt === null ? null : Math.max(0, Math.ceil((deadlineAt - timeNow) / 1000));

  const moveToNextQuestion = useCallback(() => {
    setRoundStartedAt(Date.now());
    setTimeNow(Date.now());
    setSession((prev) => advanceSession(version, prev));
  }, [version]);

  const showToastThen = useCallback((nextToast: ToastState, afterToast?: () => void) => {
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    setToast(nextToast);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
      afterToast?.();
    }, toastDurationMs);
  }, []);

  const handleTimeout = useCallback(() => {
    if (interactionLocked) return;

    const nextMistakes = mistakes + 1;
    setQuestionCount((prev) => prev + 1);
    setMistakes(nextMistakes);
    setStreak(0);

    if (nextMistakes >= maxMistakes) {
      setIsFinished(true);
      showToastThen({
        tone: "error",
        message: `시간 초과! 이번 정답은 ${question.answer}이에요. 다섯 번 틀려서 게임 종료예요.`,
      });
      return;
    }

    showToastThen(
      {
        tone: "error",
        message: `시간 초과! 이번 정답은 ${question.answer}이에요.`,
      },
      moveToNextQuestion
    );
  }, [interactionLocked, mistakes, moveToNextQuestion, question.answer, showToastThen]);

  useEffect(() => {
    if (!deadlineAt || interactionLocked) {
      return;
    }

    const tickId = window.setInterval(() => {
      setTimeNow(Date.now());
    }, 250);

    const timeoutMs = Math.max(0, deadlineAt - Date.now());
    const timeoutId = window.setTimeout(() => {
      handleTimeout();
    }, timeoutMs);

    return () => {
      window.clearInterval(tickId);
      window.clearTimeout(timeoutId);
    };
  }, [deadlineAt, handleTimeout, interactionLocked]);

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
        moveToNextQuestion
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
      moveToNextQuestion
    );
  };

  return (
    <section className="grid gap-5">
      <div className={`grid gap-4 ${info.timeLimitSeconds ? "sm:grid-cols-2 xl:grid-cols-5" : "sm:grid-cols-2 xl:grid-cols-4"}`}>
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
        {info.timeLimitSeconds ? (
          <div className="rounded-[1.75rem] bg-white/92 p-5 shadow-[0_18px_50px_rgba(52,84,104,0.12)] ring-1 ring-white/80">
            <p className="text-sm text-slate-500">남은 시간</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{secondsLeft ?? info.timeLimitSeconds}초</p>
          </div>
        ) : null}
      </div>

      <div className="relative rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-slate-100 sm:p-8 lg:p-10">
        <div className={`rounded-[2rem] bg-gradient-to-br ${info.softPanelClassName} p-5 ring-1 ring-white/80 sm:p-6`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">{info.label}</p>
              <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">우리 가족 이름 하나를 골라요</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">{info.summary}</p>
            </div>
            <div className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-white/80">
              {info.example}
            </div>
          </div>
        </div>

        <div className={`mt-8 grid gap-4 ${info.choiceCount === 5 ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2 xl:grid-cols-4"}`}>
          {question.choices.map((choice) => (
            <button
              key={`${session.round}-${choice}`}
              type="button"
              disabled={interactionLocked}
              onClick={() => handleChoice(choice)}
              className={`rounded-[1.75rem] px-5 py-7 text-center text-3xl font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:text-4xl ${info.accentButtonClassName}`}
            >
              {choice}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-[1.5rem] bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-600 ring-1 ring-slate-100">
          <strong className="font-black text-slate-900">순서 규칙:</strong> 가족 이름은 한 바퀴를 전부 돌 때까지 중복 없이 나오고, 다 나온 뒤에만 다음 랜덤 사이클로 넘어가요.
        </div>

        {toast ? <FeedbackToast message={toast.message} tone={toast.tone} /> : null}
      </div>

      {isFinished ? (
        <ResultPanel
          title={`${info.shortLabel} 가족 이름 찾기 종료!`}
          body={
            info.timeLimitSeconds
              ? "나린이 버전은 10초 안에 빠르게 찾는 도전 모드예요. 위쪽 다시 시작 버튼으로 바로 또 도전할 수 있어요."
              : "다섯 번 틀리면 끝나요. 위쪽 다시 시작 버튼으로 바로 또 도전할 수 있어요."
          }
          score={score}
          accuracy={accuracyValue}
        />
      ) : null}
    </section>
  );
}
