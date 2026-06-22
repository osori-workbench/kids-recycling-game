type ResultPanelProps = {
  title: string;
  body: string;
  score: number;
  accuracy: number;
  onRetry: () => void;
  onHome: () => void;
};

export function ResultPanel({ title, body, score, accuracy, onRetry, onHome }: ResultPanelProps) {
  return (
    <section className="rounded-[2rem] bg-rose-50 p-6 ring-1 ring-rose-100 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-rose-500">게임 종료</p>
      <h3 className="mt-3 text-3xl font-black text-rose-950">{title}</h3>
      <p className="mt-3 text-base leading-7 text-rose-900">{body}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.5rem] bg-white p-4 ring-1 ring-rose-100">
          <p className="text-sm text-slate-500">최종 점수</p>
          <p className="mt-1 text-3xl font-black text-slate-900">{score}점</p>
        </div>
        <div className="rounded-[1.5rem] bg-white p-4 ring-1 ring-rose-100">
          <p className="text-sm text-slate-500">정확도</p>
          <p className="mt-1 text-3xl font-black text-slate-900">{accuracy}%</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-rose-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 hover:bg-rose-600"
        >
          다시 도전하기
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
  );
}
