"use client";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Link from "next/link";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

import { FeedbackToast } from "@/components/recycling/FeedbackToast";
import { AnimalFoodPair, animalFoodPairs, shufflePairs } from "@/lib/animal-feeding/data";

type ToastState = {
  message: string;
  tone: "success" | "error";
};

type FoodCardProps = {
  pair: AnimalFoodPair;
  disabled: boolean;
  matched: boolean;
  compact?: boolean;
};

type MeadowSpot = {
  left: string;
  top: string;
  width: string;
  duration: string;
  delay: string;
  roamX: string;
  roamY: string;
  feedX: string;
};

const toastDurationMs = 1100;
const feedingAnimationMs = 900;

function formatElapsedTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}초`;
  }

  return `${minutes}분 ${seconds.toString().padStart(2, "0")}초`;
}

const meadowSpots: MeadowSpot[] = [
  { left: "4%", top: "8%", width: "17%", duration: "6.2s", delay: "0s", roamX: "64px", roamY: "-18px", feedX: "86px" },
  { left: "22%", top: "19%", width: "16%", duration: "7s", delay: "0.6s", roamX: "-58px", roamY: "20px", feedX: "-82px" },
  { left: "42%", top: "9%", width: "17%", duration: "6.6s", delay: "1.1s", roamX: "70px", roamY: "18px", feedX: "92px" },
  { left: "61%", top: "22%", width: "16%", duration: "7.4s", delay: "0.4s", roamX: "-66px", roamY: "-16px", feedX: "-88px" },
  { left: "80%", top: "11%", width: "15%", duration: "6.8s", delay: "1.4s", roamX: "46px", roamY: "22px", feedX: "70px" },
  { left: "8%", top: "50%", width: "18%", duration: "7.5s", delay: "0.8s", roamX: "62px", roamY: "-22px", feedX: "86px" },
  { left: "29%", top: "62%", width: "16%", duration: "6.9s", delay: "1.6s", roamX: "-68px", roamY: "20px", feedX: "-90px" },
  { left: "47%", top: "47%", width: "17%", duration: "7.1s", delay: "0.2s", roamX: "76px", roamY: "-18px", feedX: "96px" },
  { left: "65%", top: "61%", width: "16%", duration: "6.4s", delay: "1.2s", roamX: "-54px", roamY: "24px", feedX: "-78px" },
  { left: "80%", top: "49%", width: "15%", duration: "7.3s", delay: "0.9s", roamX: "50px", roamY: "-18px", feedX: "72px" },
];

type AnimalIllustrationProps = {
  id: string;
  fed: boolean;
};

function Eye({ x, happy }: { x: number; happy: boolean }) {
  if (happy) {
    return (
      <path
        d={`M ${x - 7} 76 Q ${x} 84 ${x + 7} 76`}
        fill="none"
        stroke="#1f2937"
        strokeLinecap="round"
        strokeWidth="5"
      />
    );
  }

  return <circle cx={x} cy="76" r="4.5" fill="#1f2937" />;
}

function AnimalIllustration({ id, fed }: AnimalIllustrationProps) {
  if (id === "rabbit") {
    return (
      <svg viewBox="0 0 160 150" role="img" aria-hidden="true" className="h-24 w-full sm:h-28">
        <ellipse cx="80" cy="134" rx="42" ry="8" fill="rgba(45, 65, 45, 0.13)" />
        <path d="M51 68 C29 18 37 -4 67 50" fill="#f7f4ee" stroke="#475569" strokeLinejoin="round" strokeWidth="3" />
        <path d="M109 68 C131 18 123 -4 93 50" fill="#f7f4ee" stroke="#475569" strokeLinejoin="round" strokeWidth="3" />
        <path d="M57 61 C45 26 49 16 65 51" fill="#f6b8ca" />
        <path d="M103 61 C115 26 111 16 95 51" fill="#f6b8ca" />
        <ellipse cx="80" cy="87" rx="43" ry="39" fill="#f7f4ee" stroke="#475569" strokeWidth="3" />
        <ellipse cx="80" cy="108" rx="24" ry="17" fill="#ffffff" />
        <Eye x={63} happy={fed} />
        <Eye x={97} happy={fed} />
        <ellipse cx="80" cy="94" rx="8" ry="5" fill="#f6b8ca" />
        <path d={fed ? "M66 105 Q80 118 94 105" : "M69 106 Q80 112 91 106"} fill="none" stroke="#1f2937" strokeLinecap="round" strokeWidth="4" />
        <path d="M48 94 H28 M49 103 H31 M112 94 H132 M111 103 H129" stroke="#94a3b8" strokeLinecap="round" strokeWidth="3" />
        {fed ? (
          <path d="M121 35 C121 28 131 28 131 35 C131 28 141 28 141 35 C141 45 131 50 131 50 C131 50 121 45 121 35 Z" fill="#fb7185" />
        ) : null}
      </svg>
    );
  }

  if (id === "monkey") {
    return (
      <svg viewBox="0 0 160 150" role="img" aria-hidden="true" className="h-24 w-full sm:h-28">
        <ellipse cx="80" cy="134" rx="45" ry="8" fill="rgba(45, 65, 45, 0.13)" />
        <path d="M46 91 C18 99 25 132 56 122" fill="none" stroke="#9a633e" strokeLinecap="round" strokeWidth="9" />
        <circle cx="45" cy="72" r="19" fill="#f3c48d" stroke="#475569" strokeWidth="3" />
        <circle cx="115" cy="72" r="19" fill="#f3c48d" stroke="#475569" strokeWidth="3" />
        <ellipse cx="80" cy="78" rx="43" ry="40" fill="#9a633e" stroke="#475569" strokeWidth="3" />
        <path d="M50 82 C54 50 106 50 110 82 C112 118 95 135 80 135 C65 135 48 118 50 82 Z" fill="#f7d6a8" stroke="#475569" strokeWidth="3" />
        <Eye x={64} happy={fed} />
        <Eye x={96} happy={fed} />
        <ellipse cx="80" cy="100" rx="13" ry="9" fill="#e7b778" />
        <path d="M68 107 Q80 116 92 107" fill="none" stroke="#1f2937" strokeLinecap="round" strokeWidth="4" />
        <path d="M72 88 Q80 93 88 88" fill="none" stroke="#9a633e" strokeLinecap="round" strokeWidth="3" />
        {fed ? (
          <path d="M123 36 C123 29 133 29 133 36 C133 29 143 29 143 36 C143 46 133 51 133 51 C133 51 123 46 123 36 Z" fill="#fb7185" />
        ) : null}
      </svg>
    );
  }

  if (id === "dog") {
    return (
      <svg viewBox="0 0 160 150" role="img" aria-hidden="true" className="h-24 w-full sm:h-28">
        <ellipse cx="80" cy="134" rx="44" ry="8" fill="rgba(45, 65, 45, 0.13)" />
        <path d="M49 51 C23 56 24 107 49 113 C62 93 63 66 49 51 Z" fill="#6f4328" stroke="#475569" strokeWidth="3" />
        <path d="M111 51 C137 56 136 107 111 113 C98 93 97 66 111 51 Z" fill="#6f4328" stroke="#475569" strokeWidth="3" />
        <ellipse cx="80" cy="80" rx="45" ry="40" fill="#c48a53" stroke="#475569" strokeWidth="3" />
        <ellipse cx="80" cy="101" rx="29" ry="20" fill="#fff0d6" />
        <circle cx="102" cy="57" r="10" fill="#8a5732" opacity="0.85" />
        <Eye x={63} happy={fed} />
        <Eye x={97} happy={fed} />
        <ellipse cx="80" cy="91" rx="10" ry="7" fill="#3d2a21" />
        <path d={fed ? "M66 103 Q80 116 94 103" : "M69 104 Q80 110 91 104"} fill="none" stroke="#1f2937" strokeLinecap="round" strokeWidth="4" />
        <path d="M116 105 C140 106 142 84 126 80" fill="none" stroke="#6f4328" strokeLinecap="round" strokeWidth="8" />
        {fed ? (
          <path d="M122 33 C122 26 132 26 132 33 C132 26 142 26 142 33 C142 43 132 48 132 48 C132 48 122 43 122 33 Z" fill="#fb7185" />
        ) : null}
      </svg>
    );
  }

  if (id === "cow") {
    return (
      <svg viewBox="0 0 160 150" role="img" aria-hidden="true" className="h-24 w-full sm:h-28">
        <ellipse cx="80" cy="134" rx="48" ry="8" fill="rgba(45, 65, 45, 0.13)" />
        <path d="M54 48 C45 27 56 19 70 43" fill="none" stroke="#f59e0b" strokeLinecap="round" strokeWidth="8" />
        <path d="M106 48 C115 27 104 19 90 43" fill="none" stroke="#f59e0b" strokeLinecap="round" strokeWidth="8" />
        <path d="M44 62 C21 61 20 90 47 91" fill="#f8f7f2" stroke="#475569" strokeWidth="3" />
        <path d="M116 62 C139 61 140 90 113 91" fill="#f8f7f2" stroke="#475569" strokeWidth="3" />
        <ellipse cx="80" cy="78" rx="48" ry="41" fill="#f8f7f2" stroke="#475569" strokeWidth="3" />
        <path d="M52 51 C61 36 80 43 76 62 C67 68 55 65 52 51 Z" fill="#2d2d2d" />
        <path d="M97 48 C116 48 121 67 104 72 C94 67 91 56 97 48 Z" fill="#2d2d2d" />
        <ellipse cx="80" cy="102" rx="34" ry="21" fill="#f6b8ca" stroke="#475569" strokeWidth="3" />
        <Eye x={62} happy={fed} />
        <Eye x={98} happy={fed} />
        <ellipse cx="69" cy="101" rx="4" ry="3" fill="#7f1d1d" />
        <ellipse cx="91" cy="101" rx="4" ry="3" fill="#7f1d1d" />
        <path d={fed ? "M65 112 Q80 121 95 112" : "M68 113 Q80 117 92 113"} fill="none" stroke="#1f2937" strokeLinecap="round" strokeWidth="4" />
        {fed ? (
          <path d="M124 35 C124 28 134 28 134 35 C134 28 144 28 144 35 C144 45 134 50 134 50 C134 50 124 45 124 35 Z" fill="#fb7185" />
        ) : null}
      </svg>
    );
  }

  if (id === "horse") {
    return (
      <svg viewBox="0 0 160 150" role="img" aria-hidden="true" className="h-24 w-full sm:h-28">
        <ellipse cx="80" cy="134" rx="43" ry="8" fill="rgba(45, 65, 45, 0.13)" />
        <path d="M61 124 C55 98 60 76 77 58 L99 61 C91 82 93 106 106 126 Z" fill="#a9683f" stroke="#475569" strokeLinejoin="round" strokeWidth="3" />
        <path d="M78 60 C76 43 88 31 107 32 C128 33 143 47 142 64 C141 81 127 95 107 95 C89 95 78 80 78 60 Z" fill="#a9683f" stroke="#475569" strokeLinejoin="round" strokeWidth="3" />
        <path d="M114 56 C131 55 145 60 146 70 C147 81 134 89 115 89 C103 89 95 82 95 72 C95 63 102 57 114 56 Z" fill="#e4b17b" stroke="#475569" strokeLinejoin="round" strokeWidth="3" />
        <path d="M84 60 C90 36 105 29 124 38 C111 39 100 48 96 64 C91 83 96 104 108 126 L83 124 C73 98 71 76 84 60 Z" fill="#3d2a21" />
        <path d="M96 37 L101 14 L113 40 Z" fill="#a9683f" stroke="#475569" strokeLinejoin="round" strokeWidth="3" />
        <path d="M119 39 L132 20 L132 49 Z" fill="#a9683f" stroke="#475569" strokeLinejoin="round" strokeWidth="3" />
        {fed ? (
          <path d="M102 58 Q109 64 116 58" fill="none" stroke="#1f2937" strokeLinecap="round" strokeWidth="4" />
        ) : (
          <circle cx="109" cy="58" r="4.5" fill="#1f2937" />
        )}
        <ellipse cx="136" cy="72" rx="3.5" ry="2.5" fill="#1f2937" />
        <path d={fed ? "M113 82 Q125 91 138 82" : "M116 82 Q126 86 136 82"} fill="none" stroke="#1f2937" strokeLinecap="round" strokeWidth="4" />
        {fed ? (
          <path d="M126 28 C126 21 136 21 136 28 C136 21 146 21 146 28 C146 38 136 43 136 43 C136 43 126 38 126 28 Z" fill="#fb7185" />
        ) : null}
      </svg>
    );
  }

  const animal = {
    rabbit: { body: "#f7f4ee", accent: "#f6b8ca", belly: "#ffffff", ear: "rabbit" },
    cat: { body: "#f6b46c", accent: "#c66b35", belly: "#fff3df", ear: "cat" },
    monkey: { body: "#9a633e", accent: "#f3c48d", belly: "#f7d6a8", ear: "round" },
    dog: { body: "#c48a53", accent: "#6f4328", belly: "#fff0d6", ear: "flop" },
    panda: { body: "#f7f7f2", accent: "#202632", belly: "#ffffff", ear: "round" },
    cow: { body: "#f8f7f2", accent: "#2d2d2d", belly: "#ffffff", ear: "cow" },
    squirrel: { body: "#c9793d", accent: "#8f4e24", belly: "#ffe0ad", ear: "cat" },
    koala: { body: "#a8adb3", accent: "#71777f", belly: "#eef0f2", ear: "round" },
    horse: { body: "#a9683f", accent: "#3d2a21", belly: "#e4b17b", ear: "horse" },
    penguin: { body: "#243244", accent: "#f59e0b", belly: "#f8fbff", ear: "none" },
  }[id] ?? { body: "#f3c48d", accent: "#8f4e24", belly: "#fff7ed", ear: "round" };

  const smilePath = fed ? "M67 101 Q80 113 93 101" : "M69 101 Q80 108 91 101";

  return (
    <svg viewBox="0 0 160 150" role="img" aria-hidden="true" className="h-24 w-full sm:h-28">
      <ellipse cx="80" cy="133" rx="48" ry="9" fill="rgba(45, 65, 45, 0.13)" />

      {animal.ear === "rabbit" ? (
        <>
          <path d="M51 48 C42 16 50 5 63 36" fill={animal.body} stroke="#475569" strokeWidth="3" />
          <path d="M109 48 C118 16 110 5 97 36" fill={animal.body} stroke="#475569" strokeWidth="3" />
          <path d="M56 43 C52 25 55 18 62 38" fill={animal.accent} />
          <path d="M104 43 C108 25 105 18 98 38" fill={animal.accent} />
        </>
      ) : null}

      {animal.ear === "cat" || animal.ear === "horse" ? (
        <>
          <path d="M47 57 L58 28 L73 58 Z" fill={animal.body} stroke="#475569" strokeWidth="3" />
          <path d="M87 58 L103 28 L114 57 Z" fill={animal.body} stroke="#475569" strokeWidth="3" />
          <path d="M55 52 L60 39 L67 53 Z" fill={animal.accent} opacity="0.8" />
          <path d="M94 53 L101 39 L106 52 Z" fill={animal.accent} opacity="0.8" />
        </>
      ) : null}

      {animal.ear === "round" ? (
        <>
          <circle cx="48" cy="55" r="18" fill={animal.accent} stroke="#475569" strokeWidth="3" />
          <circle cx="112" cy="55" r="18" fill={animal.accent} stroke="#475569" strokeWidth="3" />
        </>
      ) : null}

      {animal.ear === "flop" ? (
        <>
          <path d="M48 52 C28 58 27 94 47 95 C57 82 58 63 48 52 Z" fill={animal.accent} stroke="#475569" strokeWidth="3" />
          <path d="M112 52 C132 58 133 94 113 95 C103 82 102 63 112 52 Z" fill={animal.accent} stroke="#475569" strokeWidth="3" />
        </>
      ) : null}

      {animal.ear === "cow" ? (
        <>
          <path d="M48 54 L35 35 L58 45 Z" fill="#fbbf24" stroke="#475569" strokeWidth="3" />
          <path d="M112 54 L125 35 L102 45 Z" fill="#fbbf24" stroke="#475569" strokeWidth="3" />
          <path d="M45 56 C28 58 27 82 47 83" fill="#f8f7f2" stroke="#475569" strokeWidth="3" />
          <path d="M115 56 C132 58 133 82 113 83" fill="#f8f7f2" stroke="#475569" strokeWidth="3" />
        </>
      ) : null}

      <circle cx="80" cy="78" r="48" fill={animal.body} stroke="#475569" strokeWidth="3" />

      {id === "cat" ? (
        <>
          <path d="M47 70 H24 M48 83 H26 M113 70 H136 M112 83 H134" stroke="#6b3f25" strokeLinecap="round" strokeWidth="3" />
          <path d="M55 51 L67 57 M105 51 L93 57" stroke="#c66b35" strokeLinecap="round" strokeWidth="4" />
          <path d="M118 103 C143 103 143 75 124 72" fill="none" stroke="#c66b35" strokeLinecap="round" strokeWidth="8" />
        </>
      ) : null}

      {id === "monkey" ? (
        <>
          <ellipse cx="80" cy="82" rx="32" ry="30" fill={animal.belly} />
          <path d="M54 116 C24 133 27 83 50 96" fill="none" stroke={animal.accent} strokeLinecap="round" strokeWidth="8" />
        </>
      ) : null}

      {id === "dog" ? (
        <>
          <ellipse cx="80" cy="94" rx="27" ry="21" fill={animal.belly} />
          <circle cx="105" cy="57" r="10" fill="#8a5732" opacity="0.75" />
          <path d="M118 106 C140 107 142 87 126 84" fill="none" stroke={animal.accent} strokeLinecap="round" strokeWidth="8" />
        </>
      ) : null}

      {id === "panda" ? (
        <>
          <ellipse cx="61" cy="73" rx="15" ry="18" fill={animal.accent} />
          <ellipse cx="99" cy="73" rx="15" ry="18" fill={animal.accent} />
        </>
      ) : null}

      {id === "cow" ? (
        <>
          <path d="M59 46 C56 35 65 28 73 42 M101 46 C104 35 95 28 87 42" fill="none" stroke="#f59e0b" strokeLinecap="round" strokeWidth="7" />
          <path d="M56 48 C62 38 79 42 76 58 C68 63 58 61 56 48 Z" fill={animal.accent} />
          <path d="M92 102 C106 98 116 110 105 120 C95 121 88 114 92 102 Z" fill={animal.accent} />
        </>
      ) : null}

      {id === "koala" ? (
        <>
          <ellipse cx="80" cy="88" rx="20" ry="14" fill="#f2f4f5" opacity="0.9" />
          <ellipse cx="80" cy="83" rx="12" ry="15" fill="#39414a" />
        </>
      ) : null}

      {id === "penguin" ? (
        <ellipse cx="80" cy="91" rx="28" ry="34" fill={animal.belly} />
      ) : (
        id === "monkey" || id === "dog" ? null : <ellipse cx="80" cy="100" rx="25" ry="19" fill={animal.belly} opacity="0.9" />
      )}

      {id === "penguin" ? (
        <>
          <path d="M43 86 C24 94 28 116 54 108" fill="#172033" />
          <path d="M117 86 C136 94 132 116 106 108" fill="#172033" />
          <ellipse cx="64" cy="129" rx="11" ry="5" fill={animal.accent} />
          <ellipse cx="96" cy="129" rx="11" ry="5" fill={animal.accent} />
        </>
      ) : null}

      {id === "squirrel" ? (
        <>
          <path d="M118 105 C151 91 137 42 107 50 C132 65 133 88 115 94" fill={animal.accent} stroke="#475569" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d="M118 55 C134 65 136 80 126 94 M111 61 C124 72 125 85 116 95 M96 49 C106 63 108 80 99 94" fill="none" stroke="#f7b267" strokeLinecap="round" strokeWidth="4" />
          <path d="M56 53 C64 58 74 60 83 58 M51 68 C62 73 76 75 89 72" fill="none" stroke="#f7b267" strokeLinecap="round" strokeWidth="4" />
        </>
      ) : null}

      {id === "horse" ? (
        <>
          <path d="M77 31 C99 35 111 49 110 78 C101 68 88 55 77 50 Z" fill={animal.accent} />
          <path d="M48 63 C31 70 31 93 50 99" fill="none" stroke={animal.accent} strokeLinecap="round" strokeWidth="8" />
        </>
      ) : null}

      {id === "panda" ? (
        fed ? (
          <>
            <path d="M55 75 Q62 83 69 75" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" />
            <path d="M91 75 Q98 83 105 75" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" />
          </>
        ) : (
          <>
            <circle cx="62" cy="76" r="6.5" fill="#ffffff" />
            <circle cx="98" cy="76" r="6.5" fill="#ffffff" />
            <circle cx="62" cy="76" r="3.2" fill="#1f2937" />
            <circle cx="98" cy="76" r="3.2" fill="#1f2937" />
          </>
        )
      ) : (
        <>
          <Eye x={62} happy={fed} />
          <Eye x={98} happy={fed} />
        </>
      )}

      {id === "penguin" ? (
        <path d="M73 86 L87 86 L80 96 Z" fill={animal.accent} />
      ) : (
        <>
          <ellipse cx="80" cy="89" rx="9" ry="6" fill={id === "cow" ? "#f6b8ca" : animal.accent} />
          <path
            d={id === "koala" ? (fed ? "M66 105 Q80 116 94 105" : "M68 104 Q80 110 92 104") : smilePath}
            fill="none"
            stroke="#1f2937"
            strokeLinecap="round"
            strokeWidth="4"
          />
        </>
      )}

      {fed ? (
        <>
          <path d="M121 34 C121 27 131 27 131 34 C131 27 141 27 141 34 C141 44 131 49 131 49 C131 49 121 44 121 34 Z" fill="#fb7185" />
          <path d="M25 45 C25 39 34 39 34 45 C34 39 43 39 43 45 C43 54 34 59 34 59 C34 59 25 54 25 45 Z" fill="#f472b6" />
          <circle cx="119" cy="56" r="4" fill="#fde68a" />
        </>
      ) : null}
    </svg>
  );
}

function FoodCard({ pair, disabled, matched, compact = false }: FoodCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: pair.id,
    disabled: disabled || matched,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 60 : undefined,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`relative rounded-[1.5rem] border border-white/80 bg-white/95 text-center shadow-[0_12px_30px_rgba(52,84,104,0.12)] transition ${
        matched
          ? "opacity-40 grayscale"
          : disabled
            ? "opacity-70"
            : "cursor-grab active:cursor-grabbing hover:-translate-y-1"
      } ${compact ? "p-3" : "p-4"} ${isDragging ? "z-50 scale-105 shadow-2xl" : "z-0"}`}
    >
      <div className={compact ? "text-3xl" : "text-4xl sm:text-5xl"}>{pair.foodEmoji}</div>
      <p className={`${compact ? "mt-2 text-base" : "mt-3 text-lg"} font-black text-slate-900`}>{pair.foodName}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
        {matched ? "완료" : "끌어서 주세요"}
      </p>
    </div>
  );
}

function StaticFoodCard({ pair, matched, compact = false }: Omit<FoodCardProps, "disabled">) {
  return (
    <div
      className={`rounded-[1.5rem] border border-white/80 bg-white/95 text-center shadow-[0_12px_30px_rgba(52,84,104,0.12)] ${
        compact ? "p-3" : "p-4"
      } ${matched ? "opacity-40 grayscale" : ""}`}
    >
      <div className={compact ? "text-3xl" : "text-4xl sm:text-5xl"}>{pair.foodEmoji}</div>
      <p className={`${compact ? "mt-2 text-base" : "mt-3 text-lg"} font-black text-slate-900`}>{pair.foodName}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
        {matched ? "완료" : "준비"}
      </p>
    </div>
  );
}

type FoodRailProps = {
  title: string;
  pairs: AnimalFoodPair[];
  matchedFoodIds: Set<string>;
  interactionLocked: boolean;
};

function FoodRail({ title, pairs, matchedFoodIds, interactionLocked }: FoodRailProps) {
  return (
    <aside className="rounded-[2rem] bg-white/88 p-3 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-white/80">
      <p className="px-2 pb-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-sky-500">{title}</p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
        {pairs.map((pair) => (
          <FoodCard
            key={pair.id}
            pair={pair}
            disabled={interactionLocked}
            matched={matchedFoodIds.has(pair.id)}
            compact
          />
        ))}
      </div>
    </aside>
  );
}

function StaticFoodRail({ title, pairs, matchedFoodIds }: Omit<FoodRailProps, "interactionLocked">) {
  return (
    <aside className="rounded-[2rem] bg-white/88 p-3 shadow-[0_18px_60px_rgba(52,84,104,0.12)] ring-1 ring-white/80">
      <p className="px-2 pb-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-sky-500">{title}</p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
        {pairs.map((pair) => (
          <StaticFoodCard key={pair.id} pair={pair} matched={matchedFoodIds.has(pair.id)} compact />
        ))}
      </div>
    </aside>
  );
}

type MeadowAnimalProps = {
  pair: AnimalFoodPair;
  matchedFoodId?: string;
  disabled: boolean;
  isFeeding: boolean;
  spot: MeadowSpot;
};

function MeadowAnimal({ pair, matchedFoodId, disabled, isFeeding, spot }: MeadowAnimalProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: pair.id,
    disabled: disabled || Boolean(matchedFoodId),
  });

  const matched = Boolean(matchedFoodId);
  const style = {
    left: spot.left,
    top: spot.top,
    width: spot.width,
    animationDuration: spot.duration,
    animationDelay: spot.delay,
    ["--roam-x" as string]: spot.roamX,
    ["--roam-y" as string]: spot.roamY,
    ["--feed-x" as string]: spot.feedX,
  } as CSSProperties;

  return (
    <div className="absolute min-w-[132px] max-w-[178px] sm:min-w-[142px]" style={style}>
      <div
        ref={setNodeRef}
        className={`animal-roam rounded-[1.75rem] p-[2px] shadow-[0_14px_40px_rgba(52,84,104,0.14)] ${
          matched
            ? "bg-gradient-to-br from-emerald-300 via-lime-300 to-green-400"
            : isOver
              ? "bg-gradient-to-br from-sky-300 via-cyan-300 to-blue-400"
              : "bg-gradient-to-br from-white via-yellow-50 to-lime-50"
          }`}
      >
        <div
          className={`relative overflow-hidden rounded-[calc(1.75rem-2px)] px-3 py-3 text-center backdrop-blur ${
            matched ? "bg-emerald-50/95" : "bg-white/94"
          } ${isFeeding ? "animal-feed-rush" : matched ? "animal-fed-happy" : ""}`}
        >
          {matched ? (
            <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-rose-100 px-2.5 py-1 text-lg shadow-sm">
              ♥
            </div>
          ) : null}
          {isFeeding ? (
            <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-lg shadow-sm">
              {pair.foodEmoji}
            </div>
          ) : null}
          <AnimalIllustration id={pair.id} fed={matched} />
          <h2 className="mt-1.5 text-base font-black text-slate-900 sm:text-lg">{pair.animalName}</h2>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            {matched ? "배불러요" : isOver ? "먹이 발견!" : "풀밭에서 놀고 있어요"}
          </p>
          <div
            className={`mt-2 rounded-[1rem] border border-dashed px-2.5 py-2 text-[11px] font-bold leading-4 ${
              matched
                ? "border-emerald-300 bg-white text-emerald-700"
                : isOver
                  ? "border-sky-400 bg-sky-50 text-sky-700"
                  : "border-slate-200 bg-slate-50 text-slate-500"
            }`}
          >
            {matched ? `${pair.foodEmoji} ${pair.foodName} 잘 먹고 행복해요!` : `${pair.hint}`}
          </div>
        </div>
      </div>
    </div>
  );
}

function StaticMeadowAnimal({ pair, matchedFoodId, spot }: Pick<MeadowAnimalProps, "pair" | "matchedFoodId" | "spot">) {
  const matched = Boolean(matchedFoodId);
  const style = {
    left: spot.left,
    top: spot.top,
    width: spot.width,
    animationDuration: spot.duration,
    animationDelay: spot.delay,
    ["--roam-x" as string]: spot.roamX,
    ["--roam-y" as string]: spot.roamY,
    ["--feed-x" as string]: spot.feedX,
  } as CSSProperties;

  return (
    <div className="absolute min-w-[132px] max-w-[178px] sm:min-w-[142px]" style={style}>
      <div
        className={`animal-roam rounded-[1.75rem] p-[2px] shadow-[0_14px_40px_rgba(52,84,104,0.14)] ${
          matched
            ? "bg-gradient-to-br from-emerald-300 via-lime-300 to-green-400"
            : "bg-gradient-to-br from-white via-yellow-50 to-lime-50"
        }`}
      >
        <div
          className={`relative overflow-hidden rounded-[calc(1.75rem-2px)] px-3 py-3 text-center backdrop-blur ${
            matched ? "animal-fed-happy bg-emerald-50/95" : "bg-white/94"
          }`}
        >
          {matched ? (
            <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-rose-100 px-2.5 py-1 text-lg shadow-sm">
              ♥
            </div>
          ) : null}
          <AnimalIllustration id={pair.id} fed={matched} />
          <h2 className="mt-1.5 text-base font-black text-slate-900 sm:text-lg">{pair.animalName}</h2>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            {matched ? "배불러요" : "풀밭에서 놀고 있어요"}
          </p>
          <div
            className={`mt-2 rounded-[1rem] border border-dashed px-2.5 py-2 text-[11px] font-bold leading-4 ${
              matched ? "border-emerald-300 bg-white text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-500"
            }`}
          >
            {matched ? `${pair.foodEmoji} ${pair.foodName} 잘 먹고 행복해요!` : `${pair.hint}`}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnimalFeedingGameShell() {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const feedingTimeoutRef = useRef<number | null>(null);
  const mountTimeoutRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const bgmArmedRef = useRef(false);

  const [isMounted, setIsMounted] = useState(false);
  const [foodOrder, setFoodOrder] = useState<AnimalFoodPair[]>(animalFoodPairs);
  const [matchedByAnimal, setMatchedByAnimal] = useState<Record<string, string>>({});
  const [feedingAnimalId, setFeedingAnimalId] = useState<string | null>(null);
  const [draggingFoodId, setDraggingFoodId] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finishedMs, setFinishedMs] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    mountTimeoutRef.current = window.setTimeout(() => {
      setIsMounted(true);
      setFoodOrder(shufflePairs(animalFoodPairs));
      mountTimeoutRef.current = null;
    }, 0);

    return () => {
      if (mountTimeoutRef.current !== null) {
        window.clearTimeout(mountTimeoutRef.current);
      }
      if (toastTimeoutRef.current !== null) {
        window.clearTimeout(toastTimeoutRef.current);
      }
      if (feedingTimeoutRef.current !== null) {
        window.clearTimeout(feedingTimeoutRef.current);
      }
      if (timerIntervalRef.current !== null) {
        window.clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (startedAt === null || finishedMs !== null) {
      if (timerIntervalRef.current !== null) {
        window.clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    timerIntervalRef.current = window.setInterval(() => {
      setElapsedMs(Date.now() - startedAt);
    }, 250);

    return () => {
      if (timerIntervalRef.current !== null) {
        window.clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [finishedMs, startedAt]);

  const tryPlayBgm = async ({ fromStart = false }: { fromStart?: boolean } = {}) => {
    if (!audioRef.current) return;

    try {
      audioRef.current.loop = true;
      audioRef.current.muted = false;
      audioRef.current.volume = 1;

      if (fromStart) {
        audioRef.current.currentTime = 0;
      }

      await audioRef.current.play();
    } catch {
      // 사용자 제스처에서 다시 시도할 수 있도록 조용히 무시
    }
  };

  const ensureBgmStarted = () => {
    if (bgmArmedRef.current) return;
    bgmArmedRef.current = true;
    void tryPlayBgm();
  };

  const ensureTimerStarted = () => {
    if (startedAt !== null || finishedMs !== null) return startedAt;

    const now = Date.now();
    setStartedAt(now);
    setElapsedMs(0);
    return now;
  };

  const showToast = (nextToast: ToastState) => {
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    setToast(nextToast);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, toastDurationMs);
  };

  const matchedFoodIds = useMemo(() => new Set(Object.values(matchedByAnimal)), [matchedByAnimal]);
  const leftFood = foodOrder.slice(0, 5);
  const rightFood = foodOrder.slice(5, 10);
  const allFed = score === animalFoodPairs.length;
  const interactionLocked = allFed || toast !== null;
  const displayedElapsedMs = finishedMs ?? elapsedMs;

  const restartGame = () => {
    setFoodOrder(shufflePairs(animalFoodPairs));
    setMatchedByAnimal({});
    setFeedingAnimalId(null);
    setDraggingFoodId(null);
    setStartedAt(null);
    setElapsedMs(0);
    setFinishedMs(null);
    setScore(0);
    setAttempts(0);
    setToast(null);
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    if (feedingTimeoutRef.current !== null) {
      window.clearTimeout(feedingTimeoutRef.current);
      feedingTimeoutRef.current = null;
    }
    if (timerIntervalRef.current !== null) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    bgmArmedRef.current = true;
    void tryPlayBgm({ fromStart: true });
  };

  const handleDragStart = (event: { active: { id: string | number } }) => {
    ensureBgmStarted();
    ensureTimerStarted();
    setDraggingFoodId(event.active.id.toString());
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggingFoodId(null);
    if (interactionLocked) return;

    const targetAnimalId = event.over?.id?.toString();
    const draggedFoodId = event.active.id.toString();

    if (!targetAnimalId) return;
    if (matchedByAnimal[targetAnimalId] || matchedFoodIds.has(draggedFoodId)) return;

    const animal = animalFoodPairs.find((pair) => pair.id === targetAnimalId);
    const food = animalFoodPairs.find((pair) => pair.id === draggedFoodId);

    if (!animal || !food) return;

    setAttempts((prev) => prev + 1);
    const activeStartedAt = ensureTimerStarted();

    if (animal.id === food.id) {
      const nextScore = score + 1;
      setFeedingAnimalId(animal.id);
      if (feedingTimeoutRef.current !== null) {
        window.clearTimeout(feedingTimeoutRef.current);
      }
      feedingTimeoutRef.current = window.setTimeout(() => {
        setFeedingAnimalId((current) => (current === animal.id ? null : current));
        feedingTimeoutRef.current = null;
      }, feedingAnimationMs);
      setMatchedByAnimal((prev) => ({ ...prev, [animal.id]: food.id }));
      setScore(nextScore);

      if (nextScore === animalFoodPairs.length) {
        const finalElapsedMs = Date.now() - (activeStartedAt ?? Date.now());
        setElapsedMs(finalElapsedMs);
        setFinishedMs(finalElapsedMs);
        showToast({
          tone: "success",
          message: `끝! ${formatElapsedTime(finalElapsedMs)} 만에 모두 먹였어요.`,
        });
        return;
      }

      showToast({
        tone: "success",
        message: `${animal.animalName}가 ${food.foodName}를 맛있게 먹었어요!`,
      });
      return;
    }

    showToast({
      tone: "error",
      message: `${animal.animalName}는 ${food.foodName} 말고 ${animal.foodName}를 좋아해요!`,
    });
  };

  const handleDragCancel = () => {
    setDraggingFoodId(null);
  };

  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff9db,_#eef8ff_48%,_#eef7ef)] px-4 pb-40 pt-6 text-slate-800 sm:px-6 lg:px-8"
      onPointerDownCapture={ensureBgmStarted}
      onKeyDownCapture={ensureBgmStarted}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">김나스 가족 게임</p>
            <h1 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">동물 먹이주기</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={restartGame}
              className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
            >
              다시 시작
            </button>
            <Link
              href="/"
              className="rounded-full bg-white/90 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-[0_12px_30px_rgba(52,84,104,0.12)] ring-1 ring-white/90 transition hover:-translate-y-0.5"
            >
              ← 게임 목록으로
            </Link>
          </div>
        </div>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] bg-gradient-to-br from-amber-400 via-orange-400 to-pink-400 p-[2px] shadow-[0_20px_60px_rgba(239,132,86,0.24)]">
            <div className="flex h-full flex-col gap-4 rounded-[calc(2rem-2px)] bg-white/95 p-6 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">놀이 방법</p>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">풀밭에서 돌아다니는 동물에게 먹이를 주세요</h2>
                </div>
                <div className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">
                  총 {animalFoodPairs.length}마리
                </div>
              </div>
              <p className="text-base leading-7 text-slate-600">
                들판 양쪽 먹이 바구니에서 카드를 가까운 동물 친구에게 끌어다 주세요. 첫 터치나 드래그를 하면
                BGM도 함께 시작돼요.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.75rem] bg-white/90 p-5 text-center shadow-[0_16px_40px_rgba(52,84,104,0.12)] ring-1 ring-white/80">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">점수</p>
              <p className="mt-2 text-4xl font-black text-slate-900">{score}</p>
            </div>
            <div className="rounded-[1.75rem] bg-white/90 p-5 text-center shadow-[0_16px_40px_rgba(52,84,104,0.12)] ring-1 ring-white/80">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">시도</p>
              <p className="mt-2 text-4xl font-black text-slate-900">{attempts}</p>
            </div>
            <div className="rounded-[1.75rem] bg-white/90 p-5 text-center shadow-[0_16px_40px_rgba(52,84,104,0.12)] ring-1 ring-white/80">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">남은 동물</p>
              <p className="mt-2 text-4xl font-black text-slate-900">{animalFoodPairs.length - score}</p>
            </div>
            <div className="rounded-[1.75rem] bg-white/90 p-5 text-center shadow-[0_16px_40px_rgba(52,84,104,0.12)] ring-1 ring-white/80">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">시간</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{formatElapsedTime(displayedElapsedMs)}</p>
            </div>
          </div>
        </section>

        {isMounted ? (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <section
              className={`grid gap-4 lg:grid-cols-[150px_minmax(0,1fr)_150px] xl:grid-cols-[170px_minmax(0,1fr)_170px] ${
                draggingFoodId ? "relative z-30" : ""
              }`}
            >
              <FoodRail title="왼쪽 먹이" pairs={leftFood} matchedFoodIds={matchedFoodIds} interactionLocked={interactionLocked} />

              <section className="rounded-[2.5rem] bg-gradient-to-b from-sky-200 via-emerald-100 to-lime-200 p-[2px] shadow-[0_24px_80px_rgba(88,140,136,0.18)]">
                <div className="animal-meadow relative overflow-hidden rounded-[calc(2.5rem-2px)] bg-[linear-gradient(180deg,rgba(219,243,255,0.95)_0%,rgba(214,244,214,0.94)_30%,rgba(173,225,157,0.98)_100%)] px-3 py-6 sm:px-5 lg:px-6">
                  <div className="pointer-events-none absolute left-[6%] top-[10%] h-12 w-24 rounded-full bg-white/60 blur-md" />
                  <div className="pointer-events-none absolute left-[30%] top-[14%] h-10 w-20 rounded-full bg-white/55 blur-md" />
                  <div className="pointer-events-none absolute right-[10%] top-[16%] h-12 w-24 rounded-full bg-white/60 blur-md" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(circle_at_center,rgba(134,208,121,0.25),rgba(134,208,121,0)_68%)]" />

                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 px-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">풀밭 놀이터</p>
                      <h2 className="mt-2 text-2xl font-black text-slate-900">동물들이 돌아다니는 들판</h2>
                    </div>
                    <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm ring-1 ring-white/90">
                      양쪽 먹이 바구니에서 바로 드래그
                    </div>
                  </div>

                  <div className="relative min-h-[760px] sm:min-h-[820px] lg:min-h-[760px] xl:min-h-[820px]">
                    {animalFoodPairs.map((pair, index) => (
                      <MeadowAnimal
                        key={pair.id}
                        pair={pair}
                        matchedFoodId={matchedByAnimal[pair.id]}
                        disabled={interactionLocked}
                        isFeeding={feedingAnimalId === pair.id}
                        spot={meadowSpots[index]}
                      />
                    ))}
                  </div>
                </div>
              </section>

              <FoodRail title="오른쪽 먹이" pairs={rightFood} matchedFoodIds={matchedFoodIds} interactionLocked={interactionLocked} />
            </section>
          </DndContext>
        ) : (
          <section className="grid gap-4 lg:grid-cols-[150px_minmax(0,1fr)_150px] xl:grid-cols-[170px_minmax(0,1fr)_170px]">
            <StaticFoodRail title="왼쪽 먹이" pairs={leftFood} matchedFoodIds={matchedFoodIds} />
            <section className="rounded-[2.5rem] bg-gradient-to-b from-sky-200 via-emerald-100 to-lime-200 p-[2px] shadow-[0_24px_80px_rgba(88,140,136,0.18)]">
              <div className="animal-meadow relative overflow-hidden rounded-[calc(2.5rem-2px)] bg-[linear-gradient(180deg,rgba(219,243,255,0.95)_0%,rgba(214,244,214,0.94)_30%,rgba(173,225,157,0.98)_100%)] px-3 py-6 sm:px-5 lg:px-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 px-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">풀밭 놀이터</p>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">동물들이 돌아다니는 들판</h2>
                  </div>
                  <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm ring-1 ring-white/90">
                    먹이 준비 중
                  </div>
                </div>
                <div className="relative min-h-[760px] sm:min-h-[820px] lg:min-h-[760px] xl:min-h-[820px]">
                  {animalFoodPairs.map((pair, index) => (
                    <StaticMeadowAnimal
                      key={pair.id}
                      pair={pair}
                      matchedFoodId={matchedByAnimal[pair.id]}
                      spot={meadowSpots[index]}
                    />
                  ))}
                </div>
              </div>
            </section>
            <StaticFoodRail title="오른쪽 먹이" pairs={rightFood} matchedFoodIds={matchedFoodIds} />
          </section>
        )}

        {allFed ? (
          <section className="rounded-[2rem] bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 p-[2px] shadow-[0_18px_50px_rgba(76,175,158,0.22)]">
            <div className="rounded-[calc(2rem-2px)] bg-white/95 p-6 text-center sm:p-8">
              <p className="text-5xl">🎉</p>
              <h2 className="mt-3 text-3xl font-black text-slate-900">동물 친구 모두 배불러요!</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                총 {attempts}번 시도해서 {animalFoodPairs.length}마리 모두에게 먹이를 줬어요. 걸린 시간은{" "}
                {formatElapsedTime(displayedElapsedMs)}예요.
              </p>
            </div>
          </section>
        ) : null}

        {toast ? <FeedbackToast message={toast.message} tone={toast.tone} /> : null}
      </div>

      <section className="fixed inset-x-0 bottom-0 z-20 border-t border-white/70 bg-white/90 px-4 py-3 shadow-[0_-12px_40px_rgba(52,84,104,0.14)] backdrop-blur sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-500">BGM</p>
            <h2 className="mt-1 text-lg font-black text-slate-900">유니콘 하트 우리 가족</h2>
          </div>
          <div className="flex w-full flex-col gap-2 lg:w-auto lg:min-w-[420px] lg:flex-row lg:items-center lg:justify-end">
            <audio
              ref={audioRef}
              className="w-full lg:max-w-md"
              src="/assets/family-bgm.mp3"
              controls
              loop
              preload="auto"
              playsInline
            />
            <button
              type="button"
              onClick={() => {
                bgmArmedRef.current = true;
                void tryPlayBgm();
              }}
              className="rounded-full bg-violet-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-600"
            >
              재생
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
