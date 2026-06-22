"use client";

import { useEffect, useMemo, useState } from "react";

import { RecyclingBinButton } from "@/components/recycling/RecyclingBinButton";
import { ResultPanel } from "@/components/recycling/ResultPanel";
import { ScoreBoard } from "@/components/recycling/ScoreBoard";
import { categories } from "@/lib/recycling/data";
import { accuracy, buildQuestionSet, readBestScores, writeBestScores } from "@/lib/recycling/game-utils";
import { BestScores, Category, QuestionSet } from "@/lib/recycling/types";

const maxMistakes = 5;

export function NayulGame() {
  const [question, setQuestion] = useState<QuestionSet>(() => buildQuestionSet());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState("천천히 보고, 맞는 통을 톡 눌러보세요. 5번 틀리면 게임이 끝나요!");
  const [isFinished, setIsFinished] = useState(false);
  const [bestScores, setBestScores] = useState<BestScores>(() => readBestScores("nayul"));

  useEffect(() => {
    writeBestScores("nayul", bestScores);
  }, [bestScores]);

  const accuracyValue = useMemo(() => accuracy(score, questionCount), [questionCount, score]);
  const bestScore = Math.max(bestScores.practice, score);
  const remainingChances = Math.max(0, maxMistakes - mistakes);

  const handleAnswer = (selectedCategory: Category) => {
    if (isFinished) return;

    const correct = selectedCategory === question.item.category;
    const answerInfo = categories[question.item.category];

    setQuestionCount((prev) => prev + 1);

    if (correct) {
      const nextScore = score + 1;
      setScore(nextScore);
      setStreak((prev) => prev + 1);
      setBestScores((prev) =>
        nextScore > prev.practice ? { ...prev, practice: nextScore } : prev
      );
      setFeedback(`정답! ${question.item.name}는 ${answerInfo.label} 통으로 가요. ${question.item.fact}`);
      setQuestion(buildQuestionSet(question.item.name));
      return;
    }

    const nextMistakes = mistakes + 1;
    setMistakes(nextMistakes);
    setStreak(0);

    if (nextMistakes >= maxMistakes) {
      setIsFinished(true);
      setFeedback(
        `다섯 번 틀려서 게임이 끝났어요. ${question.item.name}는 ${answerInfo.label} 통이에요. 다시 해보면 더 잘할 수 있어요!`
      );
      return;
    }

    setFeedback(
      `아쉬워요! ${question.item.name}는 ${answerInfo.label} 통이에요. ${question.item.tip} 이제 ${maxMistakes - nextMistakes}번 더 틀리면 끝나요.`
    );
    setQuestion(buildQuestionSet(question.item.name));
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

      <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-slate-100 sm:p-8 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-400">나율이 버전</p>
        <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl">이건 어디에 버릴까요?</h2>

        <div className="mt-6 rounded-[2.25rem] bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 p-8 text-center ring-1 ring-pink-100 sm:p-12 lg:p-16">
          <div className="text-8xl sm:text-9xl lg:text-[10rem]">{question.item.emoji}</div>
          <h3 className="mt-5 text-4xl font-black text-slate-900 sm:text-5xl lg:text-6xl">{question.item.name}</h3>
          <p className="mt-4 text-lg leading-8 text-slate-600 sm:text-xl">
            그림을 보고 맞는 분리수거 통을 골라봐요!
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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

        <div className="mt-8 rounded-[1.75rem] bg-pink-50 p-5 ring-1 ring-pink-100 sm:p-6">
          <p className="text-sm font-bold text-pink-700">학습 메시지</p>
          <p className="mt-2 text-base leading-7 text-pink-950 sm:text-lg">{feedback}</p>
        </div>
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
