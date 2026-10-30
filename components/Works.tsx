import type { ReactNode } from "react";
import { Play } from "lucide-react";
import { SectionHead } from "./Sections";

// Нарисованные «кадры» вертикальных роликов: у каждого своя сцена и цвет
function Scene({ children, from, to }: { children: ReactNode; from: string; to: string }) {
  return (
    <svg viewBox="0 0 90 160" preserveAspectRatio="xMidYMid slice" className="work-scene absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <linearGradient id={`w-${from.slice(1)}-${to.slice(1)}`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="90" height="160" fill={`url(#w-${from.slice(1)}-${to.slice(1)})`} />
      {children}
    </svg>
  );
}

const works = [
  {
    title: "Промо кофейни",
    format: "Reels",
    duration: "0:24",
    scene: (
      <Scene from="#3a1a0a" to="#ff8a1f">
        <circle cx="45" cy="70" r="20" fill="#1b0d05" opacity="0.7" />
        <ellipse cx="45" cy="62" rx="15" ry="4" fill="#c87533" />
        <path d="M65 66 q8 0 8 8 t-8 8" fill="none" stroke="#1b0d05" strokeWidth="3" opacity="0.7" />
        {[36, 45, 54].map((x) => (
          <path key={x} className="work-steam" d={`M${x} 52 q-3 -6 0 -12 t0 -12`} fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
        ))}
      </Scene>
    ),
  },
  {
    title: "Обзор кроссовок",
    format: "Shorts",
    duration: "0:41",
    scene: (
      <Scene from="#1d0f3d" to="#169fd8">
        {[30, 50, 70, 90, 110].map((y, i) => (
          <line key={y} className="work-speed" x1="-10" y1={y} x2="40" y2={y - 14} stroke="#fff" strokeOpacity="0.25" strokeWidth="1.2" style={{ animationDelay: `${-i * 0.3}s` }} />
        ))}
        <path d="M18 92 q4 -16 22 -18 q10 0 16 8 q14 2 20 8 q4 4 0 8 h-58 z" fill="#f5f5f7" />
        <path d="M18 100 h60 q2 6 -4 8 h-52 q-6 -2 -4 -8 z" fill="#8b5cf6" />
      </Scene>
    ),
  },
  {
    title: "Влог из поездки",
    format: "YouTube",
    duration: "12:08",
    scene: (
      <Scene from="#ff7a59" to="#2a0e63">
        <circle className="work-sun" cx="45" cy="70" r="16" fill="#ffd9a8" />
        <path d="M0 110 h10 v-20 h8 v12 h6 v-26 h10 v20 h8 v-34 h12 v28 h8 v-16 h10 v22 h18 v54 h-90 z" fill="#140728" />
      </Scene>
    ),
  },
  {
    title: "Анимация логотипа",
    format: "Моушн",
    duration: "0:08",
    scene: (
      <Scene from="#06040d" to="#1b1530">
        <g className="work-orbit">
          <ellipse cx="45" cy="78" rx="30" ry="9" fill="none" stroke="#22b8f0" strokeWidth="1.5" />
        </g>
        <path d="M45 52 Q47 76 58 78 Q47 80 45 104 Q43 80 32 78 Q43 76 45 52 Z" fill="#e9e9ee" />
        <circle cx="45" cy="78" r="26" fill="#a855f7" opacity="0.15" />
      </Scene>
    ),
  },
];

export function Works() {
  return (
    <section id="works" className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-[1120px]">
        <SectionHead
          title="Работы учеников"
          lede="Такие ролики ученики собирают к концу курса: от коротких Reels до анимации логотипа."
        />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {works.map((w) => (
            <article
              key={w.title}
              className="work-card group relative aspect-[9/16] max-w-full overflow-hidden rounded-[20px] border border-white/10"
            >
              {w.scene}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" aria-hidden="true" />
              <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                {w.format}
              </span>
              <span className="absolute right-3 top-3 rounded-full bg-black/45 px-2 py-1 text-[11px] tabular-nums text-white/80 backdrop-blur">
                {w.duration}
              </span>
              <span
                className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition-transform duration-300 group-hover:scale-110"
                aria-hidden="true"
              >
                <Play className="ml-0.5 size-4 fill-current" />
              </span>
              <h3 className="absolute inset-x-3 bottom-3 font-display text-sm font-semibold leading-snug text-white sm:text-base">
                {w.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
