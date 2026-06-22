"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { FeedbackToast } from "@/components/recycling/FeedbackToast";
import { RecyclingBinButton } from "@/components/recycling/RecyclingBinButton";
import { ResultPanel } from "@/components/recycling/ResultPanel";
import { ScoreBoard } from "@/components/recycling/ScoreBoard";
import { categories } from "@/lib/recycling/data";
import { accuracy, buildQuestionSet, readBestScores, writeBestScores } from "@/lib/recycling/game-utils";
import { BestScores, Category, QuestionSet } from "@/lib/recycling/types";

const maxMistakes = 5;
const toastDurationMs = 1200;

type ToastState = {
  message: string;
  tone: "success" | "error";
};

export function NayulGame() {
  const [question, setQuestion] = useState<QuestionSet>(() => buildQuestionSet());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [bestScores, setBestScores] = useState<BestScores>(() => readBestScores("nayul"));
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    writeBestScores("nayul", bestScores);
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

    const correct = selectedCategory === question.item.category;
    const answerInfo = categories[question.item.category];
    setQuestionCount((prev) => prev + 1);

    if (correct) {
      const nextScore = score + 1;
      const nextStreak = streak + 1;
      const nextQuestion = buildQuestionSet(question.item.name);

      setScore(nextScore);
      setStreak(nextStreak);
      setBestScores((prev) => (nextScore > prev.practice ? { ...prev, practice: nextScore } : prev));

      showToastThen(
        {
          tone: "success",
          message: `정답! ${question.item.name}는 ${answerInfo.label} 통으로 가요.${nextStreak >= 2 ? ` ${nextStreak}콤보!` : ""}`,
        },
        () => setQuestion(nextQuestion)
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
        message: `아쉬워요! ${question.item.name}는 ${answerInfo.label} 통이에요. 다섯 번 틀려서 게임 종료예요.`,
      });
      return;
    }

    const nextQuestion = buildQuestionSet(question.item.name);
    showToastThen(
      {
        tone: "error",
        message: `아쉬워요! ${question.item.name}는 ${answerInfo.label} 통이에요. 남은 기회 ${maxMistakes - nextMistakes}번!`,
      },
      () => setQuestion(nextQuestion)
    );
  };

  return (
    <section className="grid gap-5">
      <ScoreBoard
        title="나율이 버전"
        score={score}
        accuracy={accuracyValue}
        streak={streak}
        mistakes={mistakes}
        remainingChances={remainingChances}
        bestScore={bestScore}
        accentClassName="bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400"
      />

      <div className="relative rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-slate-100 sm:p-8 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-400">나율이 버전</p>

        <div className="mt-6 mx-auto w-full max-w-3xl rounded-[2rem] bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 p-5 ring-1 ring-pink-100 sm:p-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[1.5rem] bg-white shadow-sm sm:h-32 sm:w-32">
              <Image
                src={question.item.imageSrc}
                alt={question.item.name}
                fill
                className="object-contain p-3"
                sizes="(max-width: 640px) 112px, 128px"
                priority
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-3xl font-black text-slate-900 sm:text-4xl lg:text-[2.75rem]">{question.item.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                그림을 보고 맞는 분리수거 통을 골라봐요!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {question.options.map((option) => (
            <RecyclingBinButton
              key={option}
              info={categories[option]}
              label="톡 눌러서 선택"
              disabled={interactionLocked}
              onClick={() => handleAnswer(option)}
            />
          ))}
        </div>

        {toast ? <FeedbackToast message={toast.message} tone={toast.tone} /> : null}
      </div>

      {isFinished ? (
        <ResultPanel
          title="나율이 게임 종료!"
          body="다섯 번 틀리면 끝나는 규칙이에요. 위쪽 다시 시작 버튼으로 바로 또 도전할 수 있어요."
          score={score}
          accuracy={accuracyValue}
        />
      ) : null}
    </section>
  );
}
