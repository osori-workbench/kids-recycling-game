"use client";

import { useEffect, useMemo, useState } from "react";

import { categories, challengeSeconds } from "@/lib/recycling/data";
import { accuracy, buildQuestionSet, modeSummary, readBestScores, writeBestScores } from "@/lib/recycling/game-utils";
import { Category, BestScores, GameMode, QuestionSet } from "@/lib/recycling/types";
import { RecyclingBinButton } from "@/components/recycling/RecyclingBinButton";
import { ResultPanel } from "@/components/recycling/ResultPanel";
import { ScoreBoard } from "@/components/recycling/ScoreBoard";

type NayulGameProps = {
  mode: GameMode;
  onHome: () => void;
};

export function NayulGame({ mode, onHome }: NayulGameProps) {
  const [question, setQuestion] = useState<QuestionSet>(() => buildQuestionSet());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [feedback, setFeedback] = useState(modeSummary(mode));
  const [secondsLeft, setSecondsLeft] = useState(challengeSeconds);
  const [isFinished, setIsFinished] = useState(false);
  const [bestScores, setBestScores] = useState<BestScores>(() => readBestScores("nayul"));

  useEffect(() => {
    writeBestScores("nayul", bestScores);
  }, [bestScores]);

  useEffect(() => {
    if (mode !== "challenge" || isFinished) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setIsFinished(true);
          setFeedback("시간이 끝났어요! 다시 해보면 더 많은 물건을 맞힐 수 있어요.");
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
    setQuestion(buildQuestionSet());
    setScore(0);
    setStreak(0);
    setQuestionCount(0);
    setFeedback(modeSummary(mode));
    setSecondsLeft(challengeSeconds);
    setIsFinished(false);
  };

  const handleAnswer = (selectedCategory: Category) => {
    if (isFinished) return;

    const correct = selectedCategory === question.item.category;
    const answerInfo = categories[question.item.category];

    setQuestionCount((prev) => prev + 1);

    if (correct) {
      const nextScore = score + 1;
      setScore(nextScore);
      setStreak((prev) => prev + 1);
      setBestScores((prev) => (nextScore > prev[mode] ? { ...prev, [mode]: nextScore } : prev));
      setFeedback(`정답! ${question.item.name}는 ${answerInfo.label} 통으로 가요. ${question.item.fact}`);
    } else {
      setStreak(0);
      setFeedback(`아쉬워요! ${question.item.name}는 ${answerInfo.label} 통이에요. ${question.item.tip}`);
    }

    setQuestion(buildQuestionSet(question.item.name));
  };

  return (
    <section className="grid gap-6">
      <ScoreBoard
        title="나율이 버전"
        score={score}
        accuracy={accuracyValue}
        streak={streak}
        timeLabel={mode === "challenge" ? `${secondsLeft}s` : "∞"}
        bestScore={bestScore}
        accentClassName="bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400"
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-slate-100 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-400">나율이 버전</p>
          <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">이건 어디에 버릴까요?</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">그림을 보고 아래 큰 버튼 중 하나를 눌러보세요.</p>

          <div className="mt-6 rounded-[2rem] bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 p-6 text-center ring-1 ring-pink-100 sm:p-10">
            <div className="text-8xl sm:text-9xl">{question.item.emoji}</div>
            <h3 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">{question.item.name}</h3>
            <p className="mt-4 text-lg leading-8 text-slate-600">그림을 보고 맞는 분리수거 통을 골라봐요!</p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {question.options.map((option) => (
              <RecyclingBinButton
                key={option}
                info={categories[option]}
                label="톡 눌러서 선택"
                disabled={isFinished}
                onClick={() => handleAnswer(option)}
              />
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-pink-50 p-5 ring-1 ring-pink-100">
            <p className="text-sm font-bold text-pink-700">학습 메시지</p>
            <p className="mt-2 text-base leading-7 text-pink-950">{feedback}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-slate-100">
            <h3 className="text-xl font-black text-slate-900">플레이 안내</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>• 읽기보다 보기에 집중할 수 있도록 큰 그림 카드로 보여줘요.</li>
              <li>• 선택지는 3개만 보여줘서 더 쉽게 고를 수 있어요.</li>
              <li>• 틀려도 바로 정답을 알려줘서 학습 흐름이 끊기지 않아요.</li>
            </ul>
          </section>

          {isFinished ? (
            <ResultPanel
              title="나율이 도전 완료!"
              body="너무 잘했어요. 다시 한 번 도전해서 더 높은 점수를 노려볼까요?"
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
                  className="rounded-full bg-pink-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-600"
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
