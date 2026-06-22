import {
  Category,
  CategoryInfo,
  GameMode,
  GameVersion,
  ModeInfo,
  RecyclingItem,
  VersionInfo,
} from "@/lib/recycling/types";

export const categories: Record<Category, CategoryInfo> = {
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

export const items: RecyclingItem[] = [
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

export const versionInfo: Record<GameVersion, VersionInfo> = {
  nayul: {
    label: "나율이 버전",
    shortLabel: "나율이",
    difficultyLabel: "쉬운 버전",
    emoji: "🐣",
    accent: "from-pink-400 via-rose-400 to-orange-300",
    cardClassName: "bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 ring-pink-100",
    summary: "그림을 보고 커다란 버튼을 톡 눌러서 분리수거를 배워요.",
    bullets: ["큰 그림 카드", "클릭형 3지선다", "읽기보다 보기 중심"],
  },
  narin: {
    label: "나린이 버전",
    shortLabel: "나린이",
    difficultyLabel: "어려운 버전",
    emoji: "🚀",
    accent: "from-cyan-400 via-sky-500 to-indigo-500",
    cardClassName: "bg-gradient-to-br from-cyan-50 via-sky-50 to-indigo-50 ring-cyan-100",
    summary: "카드를 끌어다 쓰레기통에 넣으며 진짜 게임처럼 플레이해요.",
    bullets: ["확대된 게임 화면", "드래그앤드롭", "콤보와 점수 경쟁"],
  },
};

export const modeInfo: Record<GameMode, ModeInfo> = {
  practice: {
    label: "시간제한 없음",
    emoji: "🎈",
    summary: "천천히 생각하며 배우는 연습 모드예요.",
  },
  challenge: {
    label: "60초 도전",
    emoji: "⏱️",
    summary: "60초 안에 최대한 많이 맞히는 게임 모드예요.",
  },
};

export const challengeSeconds = 60;
