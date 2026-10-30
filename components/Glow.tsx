import type { CSSProperties } from "react";

// Глубокие приглушённые тона: фон подсвечен, но не пёстрый.
// Оранжевый сюда не входит — он только у ауры курсора
const COLORS = {
  violet: "rgb(91 33 182)",
  indigo: "rgb(55 48 163)",
  blue: "rgb(30 64 175)",
};

type GlowProps = {
  color: keyof typeof COLORS;
  // Яркость свечения: сверху страницы ярче, к блоку тарифов всё темнее
  strength: number;
  className: string;
  style?: CSSProperties;
};

// Большое мягкое пятно, наполовину уходящее за край. Родитель должен быть relative и isolate
export function Glow({ color, strength, className, style }: GlowProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 rounded-full blur-[150px] ${className}`}
      style={{ background: COLORS[color], opacity: strength, ...style }}
    />
  );
}
