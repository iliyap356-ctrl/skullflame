"use client";

import { useState, type MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, Clock, Code, FileText, ShieldCheck, type LucideIcon } from "lucide-react";

export type OrbitalItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
};

type RadialOrbitalTimelineProps = {
  items?: OrbitalItem[];
  className?: string;
  // Вызывается после анимации выбора (например, чтобы закрыть меню); переход по href компонент делает сам
  onSelect?: (item: OrbitalItem) => void;
};

const DEFAULT_ITEMS: OrbitalItem[] = [
  { label: "Release", icon: Clock },
  { label: "Planning", icon: Calendar },
  { label: "Design", icon: FileText },
  { label: "Development", icon: Code },
  { label: "Testing", icon: ShieldCheck },
];

const BLUE = "#00d2ff";
const PURPLE = "#9d4edd";
const RADIUS = 40; // радиус орбиты в % от стороны контейнера
const SELECT_MS = 650; // длительность анимации выбора перед переходом
const EASE = [0.22, 1, 0.36, 1] as const;

// Узлы равномерно по кругу по часовой стрелке, первый — строго сверху
function polar(index: number, count: number) {
  const angle = ((-90 + (360 / count) * index) * Math.PI) / 180;
  return {
    x: 50 + RADIUS * Math.cos(angle),
    y: 50 + RADIUS * Math.sin(angle),
  };
}

function navigate(href: string) {
  if (href.startsWith("#")) window.location.hash = href;
  else window.location.assign(href);
}

export function RadialOrbitalTimeline({
  items = DEFAULT_ITEMS,
  className = "",
  onSelect,
}: RadialOrbitalTimelineProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const still = useReducedMotion();
  const loop = (duration: number) =>
    still ? { duration: 0 } : { duration, repeat: Infinity, ease: "easeInOut" as const };

  // Выбор: узел втягивается в сферу, остальные гаснут, сфера вспыхивает — и только потом переход
  const choose = (e: MouseEvent, i: number) => {
    e.preventDefault();
    if (selected !== null) return;
    setSelected(i);
    const item = items[i];
    window.setTimeout(
      () => {
        onSelect?.(item);
        if (item.href) {
          const href = item.href;
          window.setTimeout(() => navigate(href), 30);
        }
      },
      still ? 0 : SELECT_MS,
    );
  };

  const active = selected ?? hovered;
  const picking = selected !== null;

  return (
    <div className={`relative aspect-square w-[min(88vw,520px)] select-none ${className}`}>
      {/* Орбита и лучи-связи к центру */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
        <defs>
          {/* Градиент луча в координатах самой орбиты: у вертикального луча нет ширины,
              и градиент «по рамке объекта» на нём не рисуется */}
          {items.map((_, i) => {
            const p = polar(i, items.length);
            return (
              <linearGradient key={i} id={`orbit-beam-${i}`} gradientUnits="userSpaceOnUse" x1="50" y1="50" x2={p.x} y2={p.y}>
                <stop offset="0" stopColor={BLUE} />
                <stop offset="1" stopColor={PURPLE} />
              </linearGradient>
            );
          })}
          <filter id="orbit-blur" filterUnits="userSpaceOnUse" x="-10" y="-10" width="120" height="120">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>
        {/* Орбита раскрывается из центра при открытии и сжимается при выборе */}
        <motion.g
          style={{ transformOrigin: "50px 50px" }}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: picking ? 0.4 : 1, opacity: picking ? 0 : 1 }}
          transition={{ duration: still ? 0 : 0.8, ease: EASE, delay: picking ? 0.1 : 0.15 }}
        >
          <motion.g
            style={{ transformOrigin: "50px 50px" }}
            animate={still ? undefined : { rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          >
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="rgb(255 255 255 / 0.22)"
              strokeWidth="0.35"
              strokeDasharray="0.1 1.4"
              strokeLinecap="round"
            />
          </motion.g>
        </motion.g>
        {items.map((_, i) => {
          const p = polar(i, items.length);
          const on = active === i;
          return (
            <g key={i}>
              <motion.line
                x1="50"
                y1="50"
                x2={p.x}
                y2={p.y}
                stroke={`url(#orbit-beam-${i})`}
                strokeWidth="2.4"
                strokeLinecap="round"
                filter="url(#orbit-blur)"
                initial={false}
                animate={{ opacity: on ? 0.9 : 0, pathLength: on ? 1 : 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
              <motion.line
                x1="50"
                y1="50"
                x2={p.x}
                y2={p.y}
                stroke={`url(#orbit-beam-${i})`}
                strokeWidth="0.35"
                strokeLinecap="round"
                initial={false}
                animate={{ opacity: on ? 1 : 0, pathLength: on ? 1 : 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            </g>
          );
        })}
      </svg>

      {/* Центральная сфера: появляется с пружинкой, переливается и «дышит», при выборе вспыхивает */}
      <motion.div
        className="absolute left-1/2 top-1/2 size-[28%] -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={picking ? { scale: [1, 1.3, 1.1], opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={
          picking
            ? { duration: SELECT_MS / 1000, ease: EASE, times: [0, 0.55, 1] }
            : { type: "spring", stiffness: 160, damping: 16, delay: still ? 0 : 0.05 }
        }
      >
        <motion.div
          className="absolute -inset-[35%] rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${BLUE}88, ${PURPLE}55 45%, transparent 70%)` }}
          animate={
            picking
              ? { scale: 1.8, opacity: 1 }
              : { scale: [1, 1.15, 1], opacity: hovered !== null ? 1 : [0.7, 0.95, 0.7] }
          }
          transition={picking ? { duration: SELECT_MS / 1000, ease: EASE } : loop(4)}
        />
        <motion.div
          className="relative size-full overflow-hidden rounded-full"
          style={{ boxShadow: `0 0 40px ${BLUE}66, inset 0 0 30px rgb(255 255 255 / 0.25)` }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={loop(4)}
        >
          <motion.div
            className="absolute -inset-1/4"
            style={{
              background: `conic-gradient(from 0deg, ${BLUE}, ${PURPLE}, #4361ee, ${BLUE}, ${PURPLE}, ${BLUE})`,
            }}
            animate={still ? undefined : { rotate: 360 }}
            transition={{ duration: picking ? 1.2 : 10, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute left-[10%] top-[15%] size-[60%] rounded-full blur-xl"
            style={{ background: BLUE }}
            animate={still ? undefined : { x: ["0%", "35%", "0%"], y: ["0%", "25%", "0%"] }}
            transition={loop(6)}
          />
          <motion.div
            className="absolute bottom-[5%] right-[5%] size-[55%] rounded-full blur-xl"
            style={{ background: PURPLE }}
            animate={still ? undefined : { x: ["0%", "-30%", "0%"], y: ["0%", "-20%", "0%"] }}
            transition={loop(7)}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 32% 28%, rgb(255 255 255 / 0.65), transparent 35%), radial-gradient(circle at 50% 120%, rgb(0 0 0 / 0.35), transparent 60%)",
            }}
          />
          {/* Белая вспышка в момент, когда выбранный узел входит в сферу */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white"
            initial={false}
            animate={{ opacity: picking ? [0, 0, 0.85, 0] : 0 }}
            transition={{ duration: SELECT_MS / 1000, times: [0, 0.4, 0.6, 1] }}
          />
        </motion.div>
      </motion.div>

      {/* Узлы: при открытии разлетаются из центра на орбиту, при выборе выбранный летит в центр */}
      {items.map((item, i) => {
        const p = polar(i, items.length);
        const Icon = item.icon;
        const on = active === i;
        const isPicked = selected === i;
        const Tag = item.href ? motion.a : motion.button;
        return (
          <motion.div
            key={item.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ zIndex: isPicked ? 2 : 1 }}
            initial={{ left: "50%", top: "50%", opacity: 0 }}
            animate={
              isPicked
                ? { left: "50%", top: "50%", opacity: [1, 1, 0] }
                : picking
                  ? { left: `${p.x}%`, top: `${p.y}%`, opacity: 0 }
                  : { left: `${p.x}%`, top: `${p.y}%`, opacity: 1 }
            }
            transition={
              picking
                ? { duration: still ? 0 : isPicked ? 0.5 : 0.3, ease: EASE, times: isPicked ? [0, 0.8, 1] : undefined }
                : { duration: still ? 0 : 0.7, ease: EASE, delay: still ? 0 : 0.25 + 0.07 * i }
            }
          >
            <Tag
              {...(item.href ? { href: item.href } : { type: "button" as const })}
              onClick={(e: MouseEvent) => choose(e, i)}
              onHoverStart={() => !picking && setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              animate={{ scale: isPicked ? 0.7 : on ? 1.14 : picking ? 0.6 : 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="relative grid size-14 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white outline-none backdrop-blur-md focus-visible:ring-2 focus-visible:ring-white/60 sm:size-16"
              style={{
                boxShadow: on
                  ? `0 0 24px ${BLUE}88, 0 0 48px ${PURPLE}55, inset 0 0 12px rgb(255 255 255 / 0.12)`
                  : "inset 0 0 12px rgb(255 255 255 / 0.06)",
              }}
            >
              <Icon className="size-5 sm:size-6" strokeWidth={1.6} aria-hidden="true" />
              <span
                className={`pointer-events-none absolute left-1/2 top-full mt-2.5 -translate-x-1/2 whitespace-nowrap text-xs tracking-wide transition-[color,opacity] duration-200 sm:text-sm ${
                  on ? "text-white" : "text-neutral-500"
                } ${picking ? "opacity-0" : ""}`}
              >
                {item.label}
              </span>
            </Tag>
          </motion.div>
        );
      })}
    </div>
  );
}

export default RadialOrbitalTimeline;
