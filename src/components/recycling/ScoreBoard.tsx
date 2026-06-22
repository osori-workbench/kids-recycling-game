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
    <section className={`grid gap-4 rounded-[2rem] p-6 text-white shadow-2xl ${accentClassName}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60">게임 현황</p>
          <h2 className="mt-2 text-2xl font-black">{title}</h2>
        </div>
        <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold">최고 기록 {bestScore}점</div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-[1.5rem] bg-white/10 p-4">
          <p className="text-sm text-white/70">점수</p>
          <p className="mt-1 text-3xl font-black">{score}</p>
        </div>
        <div className="rounded-[1.5rem] bg-white/10 p-4">
          <p className="text-sm text-white/70">정확도</p>
          <p className="mt-1 text-3xl font-black">{accuracy}%</p>
        </div>
        <div className="rounded-[1.5rem] bg-white/10 p-4">
          <p className="text-sm text-white/70">콤보</p>
          <p className="mt-1 text-3xl font-black">{streak}</p>
        </div>
        <div className="rounded-[1.5rem] bg-white/10 p-4">
          <p className="text-sm text-white/70">틀린 횟수</p>
          <p className="mt-1 text-3xl font-black">{mistakes}</p>
        </div>
        <div className="rounded-[1.5rem] bg-white/10 p-4">
          <p className="text-sm text-white/70">남은 기회</p>
          <p className="mt-1 text-3xl font-black">{remainingChances}</p>
        </div>
      </div>
    </section>
  );
}
