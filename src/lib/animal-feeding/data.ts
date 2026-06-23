export type AnimalFoodPair = {
  id: string;
  animalName: string;
  animalEmoji: string;
  foodName: string;
  foodEmoji: string;
  hint: string;
};

export const animalFoodPairs: AnimalFoodPair[] = [
  { id: "rabbit", animalName: "토끼", animalEmoji: "🐰", foodName: "당근", foodEmoji: "🥕", hint: "아삭아삭 당근을 제일 좋아해요." },
  { id: "cat", animalName: "고양이", animalEmoji: "🐱", foodName: "생선", foodEmoji: "🐟", hint: "생선을 냠냠 잘 먹어요." },
  { id: "monkey", animalName: "원숭이", animalEmoji: "🐵", foodName: "바나나", foodEmoji: "🍌", hint: "노란 바나나를 찾고 있어요." },
  { id: "dog", animalName: "강아지", animalEmoji: "🐶", foodName: "뼈다귀", foodEmoji: "🦴", hint: "꼬리를 흔들며 뼈다귀를 기다려요." },
  { id: "panda", animalName: "판다", animalEmoji: "🐼", foodName: "대나무", foodEmoji: "🎋", hint: "초록 대나무를 아주 좋아해요." },
  { id: "cow", animalName: "소", animalEmoji: "🐮", foodName: "풀", foodEmoji: "🌿", hint: "싱싱한 풀을 천천히 먹어요." },
  { id: "squirrel", animalName: "다람쥐", animalEmoji: "🐿️", foodName: "도토리", foodEmoji: "🌰", hint: "작은 도토리를 모으는 걸 좋아해요." },
  { id: "koala", animalName: "코알라", animalEmoji: "🐨", foodName: "잎사귀", foodEmoji: "🍃", hint: "향긋한 잎사귀를 냠냠 먹어요." },
  { id: "horse", animalName: "말", animalEmoji: "🐴", foodName: "사과", foodEmoji: "🍎", hint: "달콤한 사과를 좋아해요." },
  { id: "penguin", animalName: "펭귄", animalEmoji: "🐧", foodName: "새우", foodEmoji: "🍤", hint: "바다 냄새 나는 새우를 찾고 있어요." },
];

export function shufflePairs<T>(items: T[]): T[] {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}
