"use client";

import { useEffect, useMemo, useState } from "react";

type Category = "paper" | "plastic" | "glass" | "metal" | "food";
type GameMode = "practice" | "challenge";

type RecyclingItem = {
  name: string;
  emoji: string;
  category: Category;
  fact: string;
  tip: string;
};

type CategoryInfo = {
  label: string;
  emoji: string;
  color: string;
  softColor: string;
  description: string;
};

const categories: Record<Category, CategoryInfo> = {
  paper: {
    label: "종이",
    emoji: "📄",
    color: "from-sky-400 to-blue-500",
    softColor: "bg-sky-50 text-sky-700 ring-sky-100",
    description: "신문, 상자, 우유팩처럼 종이류를 넣어요.",
  },
  plastic: {
    label: "플라스틱",
    emoji: "🧴",
    color: "from-amber-400 to-orange-500",
    softColor: "bg-amber-50 text-amber-700 ring-amber-100",
    description: "깨끗이 헹군 병, 통, 용기 등을 넣어요.",
  },
  glass: {
    label: "유리",
    emoji: "🍾",
    color: "from-emerald-400 to-teal-500",
    softColor: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    description: "유리병처럼 단단한 유리류를 넣어요.",
  },
  metal: {
    label: "캔·금속",
    emoji: "🥫",
    color: "from-slate-400 to-slate-600",
    softColor: "bg-slate-100 text-slate-700 ring-slate-200",
    description: "음료수 캔, 통조림 캔, 금속 뚜껑을 넣어요.",
  },
  food: {
    label: "음식물",
    emoji: "🍌",
    color: "from-lime-400 to-green-500",
    softColor: "bg-lime-50 text-lime-700 ring-lime-100",
    description: "먹고 남은 음식물 쓰레기를 넣어요.",
  },
};

const items: RecyclingItem[] = [
  {
    name: "신문지",
    emoji: "📰",
    category: "paper",
    fact: "신문지는 종이류예요. 차곡차곡 모아 버리면 재활용이 쉬워져요.",
    tip: "젖지 않게 묶어서 버리면 더 좋아요.",
  },
  {
    name: "택배 상자",
    emoji: "📦",
    category: "paper",
    fact: "상자는 테이프를 떼고 접어서 버리면 좋아요.",
    tip: "상자를 납작하게 접어 부피를 줄여보세요.",
  },
  {
    name: "우유팩",
    emoji: "🥛",
    category: "paper",
    fact: "우유팩은 깨끗이 씻고 말리면 종이류로 분리할 수 있어요.",
    tip: "안쪽까지 헹군 뒤 펼쳐 말리면 더 좋아요.",
  },
  {
    name: "플라스틱 물병",
    emoji: "💧",
    category: "plastic",
    fact: "물병은 대표적인 플라스틱 재활용 품목이에요.",
    tip: "라벨을 떼고 찌그러뜨리면 좋아요.",
  },
  {
    name: "샴푸통",
    emoji: "🧴",
    category: "plastic",
    fact: "샴푸통은 내용물을 비우고 헹구면 플라스틱으로 분리할 수 있어요.",
    tip: "펌프는 다른 재질이면 따로 분리해보세요.",
  },
  {
    name: "요거트 통",
    emoji: "🥣",
    category: "plastic",
    fact: "요거트 통은 음식물이 남지 않게 씻는 게 중요해요.",
    tip: "끈적한 내용물을 잘 헹군 뒤 버리세요.",
  },
  {
    name: "유리병",
    emoji: "🍾",
    category: "glass",
    fact: "유리병은 유리류로 다시 태어날 수 있어요.",
    tip: "뚜껑은 분리해서 다른 재질끼리 나눠 버리세요.",
  },
  {
    name: "잼 병",
    emoji: "🫙",
    category: "glass",
    fact: "잼 병도 안쪽을 씻고 유리함에 넣어요.",
    tip: "음식물이 남지 않게 닦아주세요.",
  },
  {
    name: "유리 음료수병",
    emoji: "🍹",
    category: "glass",
    fact: "유리병은 깨지지 않게 조심히 버려야 해요.",
    tip: "깨진 유리는 다치지 않게 안전하게 따로 처리하세요.",
  },
  {
    name: "음료수 캔",
    emoji: "🥫",
    category: "metal",
    fact: "알루미늄 캔은 금속 재활용의 대표 선수예요.",
    tip: "헹군 뒤 살짝 눌러 버리면 공간을 아낄 수 있어요.",
  },
  {
    name: "통조림 캔",
    emoji: "🥫",
    category: "metal",
    fact: "통조림 캔도 금속류예요.",
    tip: "날카로운 부분에 손이 베이지 않게 조심하세요.",
  },
  {
    name: "금속 뚜껑",
    emoji: "⚙️",
    category: "metal",
    fact: "병뚜껑처럼 금속 재질은 금속류로 분리해요.",
    tip: "플라스틱 몸통과 분리하면 더 정확해져요.",
  },
  {
    name: "바나나 껍질",
    emoji: "🍌",
    category: "food",
    fact: "바나나 껍질은 음식물 쓰레기통으로 가요.",
    tip: "물기를 줄이면 처리하기가 쉬워져요.",
  },
  {
    name: "사과 껍질",
    emoji: "🍎",
    category: "food",
    fact: "사과 껍질도 음식물류예요.",
    tip: "포장 비닐은 꼭 따로 분리하세요.",
  },
  {
    name: "남은 밥",
    emoji: "🍚",
    category: "food",
    fact: "먹고 남은 밥은 음식물류로 분리해요.",
    tip: "숟가락이나 젓가락이 섞이지 않게 빼주세요.",
  },
];

const challengeSeconds = 60;
const storageKey = "kids-recycling-game-best-scores";

function pickRandomItem(previousName?: string) {
  const pool =
    items.length > 1
      ? items.filter((item) => item.name !== previousName)
      : items;

  return pool[Math.floor(Math.random() * pool.length)];
}

function modeLabel(mode: GameMode) {
  return mode === "practice" ? "연습 모드" : "60초 도전 모드";
}

export default function Home() {
  const [mode, setMode] = useState<GameMode>("practice");
  const [currentItem, setCurrentItem] = useState<RecyclingItem>(items[0]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [feedback, setFeedback] = useState("아래 모드를 고르면 게임이 시작돼요!");
  const [isStarted, setIsStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(challengeSeconds);
  const [isFinished, setIsFinished] = useState(false);
  const [bestScores, setBestScores] = useState<Record<GameMode, number>>(() => {
    if (typeof window === "undefined") {
      return {
        practice: 0,
        challenge: 0,
      };
    }

    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      return {
        practice: 0,
        challenge: 0,
      };
    }

    try {
      const parsed = JSON.parse(saved) as Partial<Record<GameMode, number>>;
      return {
        practice: parsed.practice ?? 0,
        challenge: parsed.challenge ?? 0,
      };
    } catch {
      window.localStorage.removeItem(storageKey);
      return {
        practice: 0,
        challenge: 0,
      };
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(bestScores));
  }, [bestScores]);

  useEffect(() => {
    if (mode !== "challenge" || !isStarted || isFinished) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setIsFinished(true);
          setFeedback("⏰ 시간이 끝났어요! 다시 도전해서 최고 점수를 깨보세요.");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isFinished, isStarted, mode]);

  const accuracy = useMemo(() => {
    if (questionCount === 0) return 0;
    return Math.round((score / questionCount) * 100);
  }, [questionCount, score]);

  const displayBestScores = {
    practice: mode === "practice" ? Math.max(bestScores.practice, score) : bestScores.practice,
    challenge:
      mode === "challenge" ? Math.max(bestScores.challenge, score) : bestScores.challenge,
  };

  const startGame = (nextMode: GameMode) => {
    setMode(nextMode);
    setCurrentItem(pickRandomItem());
    setScore(0);
    setStreak(0);
    setQuestionCount(0);
    setSecondsLeft(challengeSeconds);
    setIsFinished(false);
    setIsStarted(true);
    setFeedback(
      nextMode === "practice"
        ? "천천히 생각하면서 맞는 분리수거함을 눌러보세요!"
        : "60초 안에 최대한 많이 맞혀보세요!"
    );
  };

  const handleAnswer = (selectedCategory: Category) => {
    if (!isStarted || isFinished) return;

    const correct = selectedCategory === currentItem.category;
    const answerInfo = categories[currentItem.category];

    setQuestionCount((prev) => prev + 1);

    if (correct) {
      const nextScore = score + 1;
      setScore(nextScore);
      setStreak((prev) => prev + 1);
      setBestScores((prev) =>
        nextScore > prev[mode] ? { ...prev, [mode]: nextScore } : prev
      );
      setFeedback(
        `정답! ${currentItem.emoji} ${currentItem.name}는 ${answerInfo.label} 통으로 가요. ${currentItem.fact}`
      );
    } else {
      setStreak(0);
      setFeedback(
        `아쉬워요! ${currentItem.emoji} ${currentItem.name}는 ${answerInfo.label} 통이에요. ${currentItem.tip}`
      );
    }

    setCurrentItem(pickRandomItem(currentItem.name));
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7d6,_#f4fbff_45%,_#eef7ef)] px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] bg-white/85 p-6 shadow-[0_24px_80px_rgba(40,68,87,0.14)] ring-1 ring-white/70 backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                ♻️ 아동용 분리수거 학습 게임
              </span>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                분리수거 탐험대
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                아이들이 게임처럼 놀면서 <strong>어떤 쓰레기가 어느 통으로 가는지</strong>{" "}
                자연스럽게 익히도록 만든 웹 게임이에요. 시간 제한이 없는 연습 모드와,
                60초 동안 점수를 겨루는 도전 모드를 모두 즐길 수 있어요.
              </p>
            </div>

            <div className="grid gap-3 rounded-[1.5rem] bg-slate-900 p-5 text-white shadow-2xl sm:min-w-[290px]">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>현재 모드</span>
                <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-white">
                  {modeLabel(mode)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-slate-300">점수</p>
                  <p className="mt-1 text-3xl font-black">{score}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-slate-300">정확도</p>
                  <p className="mt-1 text-3xl font-black">{accuracy}%</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-slate-300">연속 정답</p>
                  <p className="mt-1 text-3xl font-black">{streak}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-slate-300">남은 시간</p>
                  <p className="mt-1 text-3xl font-black">
                    {mode === "challenge" && isStarted ? `${secondsLeft}s` : "∞"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-slate-100 sm:p-8">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => startGame("practice")}
                className="rounded-full bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-600"
              >
                🎈 연습 모드 시작
              </button>
              <button
                type="button"
                onClick={() => startGame("challenge")}
                className="rounded-full bg-amber-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-amber-200 transition hover:-translate-y-0.5 hover:bg-amber-600"
              >
                ⏱️ 60초 도전 시작
              </button>
            </div>

            <div className="mt-6 rounded-[2rem] border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                지금 버릴 물건
              </p>
              <div className="mt-5 text-7xl sm:text-8xl">{currentItem.emoji}</div>
              <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
                {currentItem.name}
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-500 sm:text-lg">
                어떤 분리수거함으로 보내야 할까요?
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {(Object.entries(categories) as [Category, CategoryInfo][]).map(
                ([key, info]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleAnswer(key)}
                    disabled={!isStarted || isFinished}
                    className={`group rounded-[1.5rem] bg-gradient-to-br ${info.color} p-[1px] text-left transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <div className="h-full rounded-[1.45rem] bg-white p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                          {info.emoji}
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-900">{info.label}</p>
                          <p className="text-sm text-slate-500">눌러서 선택하기</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-600">
                        {info.description}
                      </p>
                    </div>
                  </button>
                )
              )}
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-emerald-50 p-5 ring-1 ring-emerald-100">
              <p className="text-sm font-bold text-emerald-700">학습 메시지</p>
              <p className="mt-2 text-base leading-7 text-emerald-900">{feedback}</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-slate-100">
              <h3 className="text-xl font-black text-slate-900">모드 안내</h3>
              <div className="mt-4 grid gap-4">
                <div className="rounded-[1.5rem] bg-sky-50 p-5 ring-1 ring-sky-100">
                  <p className="text-lg font-black text-sky-900">🎈 연습 모드</p>
                  <p className="mt-2 text-sm leading-6 text-sky-800">
                    시간 제한 없이 천천히 생각하며 맞혀보는 모드예요. 부모님이나 선생님과
                    함께 이야기하며 학습하기 좋아요.
                  </p>
                </div>
                <div className="rounded-[1.5rem] bg-amber-50 p-5 ring-1 ring-amber-100">
                  <p className="text-lg font-black text-amber-900">⏱️ 60초 도전 모드</p>
                  <p className="mt-2 text-sm leading-6 text-amber-800">
                    60초 안에 얼마나 많이 맞히는지 겨뤄보는 모드예요. 집중력과 반응 속도를
                    함께 키울 수 있어요.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">최고 기록</h3>
                {isFinished ? (
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                    도전 종료
                  </span>
                ) : null}
              </div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-[1.25rem] bg-slate-50 p-4 ring-1 ring-slate-100">
                  <p className="text-sm text-slate-500">연습 모드 최고 점수</p>
                  <p className="mt-1 text-2xl font-black text-slate-900">
                    {displayBestScores.practice}점
                  </p>
                </div>
                <div className="rounded-[1.25rem] bg-slate-50 p-4 ring-1 ring-slate-100">
                  <p className="text-sm text-slate-500">도전 모드 최고 점수</p>
                  <p className="mt-1 text-2xl font-black text-slate-900">
                    {displayBestScores.challenge}점
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-slate-100">
              <h3 className="text-xl font-black text-slate-900">분리수거 힌트</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {(Object.entries(categories) as [Category, CategoryInfo][]).map(
                  ([key, info]) => (
                    <div
                      key={key}
                      className={`rounded-full px-4 py-2 text-sm font-bold ring-1 ${info.softColor}`}
                    >
                      {info.emoji} {info.label}
                    </div>
                  )
                )}
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>• 내용물이 남아 있으면 먼저 비우고, 가능하면 물로 헹궈주세요.</li>
                <li>• 다른 재질이 섞여 있으면 분리해서 버리면 더 정확해져요.</li>
                <li>• 깨진 유리나 날카로운 금속은 안전하게 따로 처리해야 해요.</li>
              </ul>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
