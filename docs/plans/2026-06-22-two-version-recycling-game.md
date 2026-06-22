# 두 버전 분리수거 게임 개편 Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** 기존 단일 분리수거 게임을 나율이 버전(쉬운 클릭형)과 나린이 버전(어려운 드래그형)으로 분리하고, 각 버전에서 시간제한 없음/있음 모드를 모두 제공한다.

**Architecture:** `app/page.tsx`는 버전 선택과 게임 진입만 담당하고, 실제 게임 로직은 `components/recycling/` 아래 버전별 컴포넌트로 분리한다. 공통 타입·데이터·유틸은 `lib/recycling/`로 옮겨 중복을 줄이고, 나린이 버전은 `@dnd-kit/core` 기반 드래그앤드롭으로 구현한다.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, @dnd-kit/core, localStorage.

---

## 구현 범위

1. **버전 선택 홈**
   - 나율이 버전 / 나린이 버전 소개 카드
   - 쉬운 버전 / 어려운 버전 설명
   - 시간제한 없음 / 60초 도전 선택
2. **나율이 버전**
   - 큰 그림 카드 중심
   - 3개 선택지 클릭형 플레이
   - 쉬운 피드백 문구
3. **나린이 버전**
   - 큰 카드 + 큰 쓰레기통 UI
   - 드래그앤드롭 판정
   - 점수/정확도/콤보/타이머 HUD
4. **공통**
   - 버전별 최고 기록 localStorage 저장
   - 다시 시작 / 홈으로 돌아가기
   - lint/build 통과

## 파일 계획

### 새로 만들 파일
- `src/lib/recycling/types.ts`
- `src/lib/recycling/data.ts`
- `src/lib/recycling/game-utils.ts`
- `src/components/recycling/VersionSelector.tsx`
- `src/components/recycling/ModeSelector.tsx`
- `src/components/recycling/ScoreBoard.tsx`
- `src/components/recycling/ResultPanel.tsx`
- `src/components/recycling/RecyclingBinButton.tsx`
- `src/components/recycling/NayulGame.tsx`
- `src/components/recycling/NarinGame.tsx`

### 수정 파일
- `src/app/page.tsx`
- `package.json`
- `package-lock.json`

## 실행 순서

### Task 1: 공통 타입/데이터 분리
**Objective:** 단일 `page.tsx`에 박혀 있는 카테고리/아이템/타입을 재사용 가능한 모듈로 이동한다.

**Steps**
1. `types.ts`에 `Category`, `GameVersion`, `GameMode`, `RecyclingItem`, `CategoryInfo`, `BestScores` 정의.
2. `data.ts`에 카테고리/아이템/버전 설명/모드 설명 데이터 정리.
3. `game-utils.ts`에 랜덤 아이템 선택, 3지선다 선택지 생성, localStorage key 생성 유틸 추가.

### Task 2: 공통 UI 컴포넌트 작성
**Objective:** 페이지와 버전별 게임에서 공유하는 선택/점수/결과 패널을 만든다.

**Steps**
1. `VersionSelector.tsx`에 두 버전 소개 카드 작성.
2. `ModeSelector.tsx`에 연습/도전 카드 작성.
3. `ScoreBoard.tsx`, `ResultPanel.tsx`, `RecyclingBinButton.tsx` 작성.

### Task 3: 나율이 버전 구현
**Objective:** 쉬운 클릭형 게임 경험을 완성한다.

**Steps**
1. 큰 그림 카드와 3개 선택지 클릭 로직 구현.
2. challenge 모드 타이머와 practice 모드 무제한 흐름 구현.
3. 쉬운 톤의 피드백, 정답 강조, 최고 기록 저장 구현.

### Task 4: 나린이 버전 구현
**Objective:** 어려운 드래그앤드롭 게임 경험을 완성한다.

**Steps**
1. `@dnd-kit/core` 설치 및 기본 DnD 컨텍스트 구성.
2. 큰 아이템 카드와 큰 쓰레기통 드롭 영역 구현.
3. 콤보/점수/정확도/타이머/결과화면 연결.

### Task 5: 홈 흐름 재구성
**Objective:** 첫 화면에서 버전과 시간 모드를 고른 뒤 해당 게임으로 진입하게 만든다.

**Steps**
1. `page.tsx`를 버전 선택 중심 레이아웃으로 교체.
2. 선택된 버전/모드에 따라 게임 컴포넌트 렌더링.
3. 홈으로 돌아가기/같은 모드 다시 하기 흐름 추가.

### Task 6: 검증 및 배포 준비
**Objective:** 구조 개편 후 품질을 검증하고 저장소에 반영한다.

**Steps**
1. `npm run lint`
2. `npm run build`
3. 필요 시 로컬 실행으로 UI 확인
4. git commit / git push

## 검증 명령어

```bash
npm run lint
npm run build
npm run dev
```

## 성공 기준

- 첫 화면에서 **나율이 버전 / 나린이 버전**을 구분해 선택할 수 있다.
- 두 버전 모두 **연습 모드 / 60초 도전 모드**를 제공한다.
- 나율이 버전은 **클릭형 3지선다**로 작동한다.
- 나린이 버전은 **드래그앤드롭**으로 작동한다.
- 버전별 최고 기록이 저장된다.
- Next.js 16 환경에서 lint/build가 통과한다.
