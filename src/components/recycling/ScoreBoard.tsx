type ScoreBoardProps = {
  score: number;
  accuracy: number;
  streak: number;
  mistakes: number;
  remainingChances: number;
  bestScore: number;
  title: string;
  accentClassName?: string;
};

export function ScoreBoard({
  score,
  accuracy,
  streak,
  mistakes,
  remainingChances,
  bestScore,
  title,
  accentClassName = "bg-slate-900",
}: ScoreBoardProps) {
  return (
    <section className={`grid gap-3 rounded-[1.75rem] px-5 py-4 text-white shadow-2xl ${accentClassName}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">게임 현황</p>
          <h2 className="mt-1 text-xl font-black sm:text-2xl">{title}</h2>
        </div>
        <div className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold">최고 기록 {bestScore}점</div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        <div className="rounded-[1.25rem] bg-white/10 px-3 py-3">
          <p className="text-xs text-white/70">점수</p>
          <p className="mt-1 text-2xl font-black sm:text-3xl">{score}</p>
        </div>
        <div className="rounded-[1.25rem] bg-white/10 px-3 py-3">
          <p className="text-xs text-white/70">정확도</p>
          <p className="mt-1 text-2xl font-black sm:text-3xl">{accuracy}%</p>
        </div>
        <div className="rounded-[1.25rem] bg-white/10 px-3 py-3">
          <p className="text-xs text-white/70">콤보</p>
          <p className="mt-1 text-2xl font-black sm:text-3xl">{streak}</p>
        </div>
        <div className="rounded-[1.25rem] bg-white/10 px-3 py-3">
          <p className="text-xs text-white/70">오답</p>
          <p className="mt-1 text-2xl font-black sm:text-3xl">{mistakes}</p>
        </div>
        <div className="rounded-[1.25rem] bg-white/10 px-3 py-3">
          <p className="text-xs text-white/70">남은 기회</p>
          <p className="mt-1 text-2xl font-black sm:text-3xl">{remainingChances}</p>
        </div>
      </div>
    </section>
  );
}
