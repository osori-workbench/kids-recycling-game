# 분리수거 탐험대

아이들이 게임처럼 놀면서 분리수거를 배울 수 있도록 만든 Next.js 웹 게임입니다.

## 기능

- **연습 모드**: 시간 제한 없이 천천히 분리수거 분류를 익히는 모드
- **60초 도전 모드**: 제한 시간 안에 최대한 많이 맞히는 스코어 모드
- **즉시 피드백**: 정답/오답마다 학습 메시지 제공
- **최고 기록 저장**: 브라우저 `localStorage`에 모드별 최고 점수 저장
- **Vercel 배포 친화적**: 별도 서버 없이 바로 배포 가능한 정적 Next.js 앱

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 을 열면 됩니다.

## 검증

```bash
npm run lint
npm run build
```

## 배포

Vercel에 import 해서 바로 배포할 수 있습니다.

1. GitHub 저장소를 Vercel에 연결
2. Framework Preset은 `Next.js` 유지
3. Build Command / Output 설정은 기본값 사용
4. Deploy

## 기술 스택

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
