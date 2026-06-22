import Link from "next/link";

const games = [
  {
    href: "/games/recycling",
    emoji: "♻️",
    title: "분리수거 탐험대",
    description: "나율이 버전과 나린이 버전으로 배우는 가족용 분리수거 게임",
    badge: "플레이 가능",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7d6,_#f4fbff_45%,_#eef7ef)] px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
        <section className="w-full rounded-[2.5rem] bg-white/90 p-6 shadow-[0_24px_80px_rgba(40,68,87,0.14)] ring-1 ring-white/70 backdrop-blur sm:p-8 lg:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              🎮 가족이 함께 즐기는 어린이 게임 모음
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              김나스 가족 게임
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              가운데 메뉴에서 원하는 게임을 골라 바로 들어가요. 앞으로 여기에 가족용 어린이 게임을 계속
              추가할 수 있게 구성해두었습니다.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl gap-5">
            {games.map((game) => (
              <Link
                key={game.href}
                href={game.href}
                className="group rounded-[2rem] bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400 p-[2px] text-left shadow-[0_20px_60px_rgba(76,104,146,0.18)] transition hover:-translate-y-1"
              >
                <div className="rounded-[calc(2rem-2px)] bg-white/95 p-6 sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-emerald-100 text-4xl shadow-inner">
                        {game.emoji}
                      </div>
                      <div className="min-w-0">
                        <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                          {game.badge}
                        </div>
                        <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">{game.title}</h2>
                        <p className="mt-3 text-base leading-7 text-slate-600">{game.description}</p>
                      </div>
                    </div>
                    <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition group-hover:bg-emerald-500">
                      들어가기
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
