// Сгенерированные анимированные иллюстрации к нишам монтажа (SVG вместо фото, пока нет реальных материалов).
// Анимации — CSS-классы art-* в globals.css
import { useId, type ReactNode } from "react";

export type Niche = "reels" | "youtube" | "color" | "sound" | "motion";

const VIOLET = "#a855f7";
const BLUE = "#22b8f0";
const ORANGE = "#ff8a1f";

// Иллюстрация может стоять на странице дважды (карточка и окно), поэтому id градиентов уникальные
function useArtId() {
  return useId().replace(/[^a-zA-Z0-9]/g, "");
}

function Frame({ id, children }: { id: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 400 250"
      preserveAspectRatio="xMidYMid meet"
      className="niche-art absolute inset-0 block size-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}-bg`} cx="0.5" cy="0.4" r="0.35">
          <stop offset="0" stopColor="#1b1530" />
          <stop offset="1" stopColor="#07070a" />
        </radialGradient>
        <linearGradient id={`${id}-neon`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={VIOLET} />
          <stop offset="0.5" stopColor={BLUE} />
          <stop offset="1" stopColor={ORANGE} />
        </linearGradient>
      </defs>
      {/* Фон шире кадра, чтобы заполнять карточки любой пропорции */}
      <rect x="-400" y="-200" width="1200" height="650" fill={`url(#${id}-bg)`} />
      {children}
    </svg>
  );
}

const HEART = "M0 4C-7-2-9-8-4.5-9.5C-2-10.3 0-8 0-6.5C0-8 2-10.3 4.5-9.5C9-8 7-2 0 4Z";
const COMMENT = "M-6-6h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-6l-4 3v-3h-2a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z";
const SHARE = "M-6 5V2C-6-3-2-5 3-5V-8L8-3 3 2V-1C-1-1-4 0-6 5Z";

// Лента Reels: ролики сменяются свайпом вверх, на каждом — двойной тап с большим сердцем,
// лайк в боковой панели краснеет, субтитры подсвечиваются по словам
function Reels() {
  const id = useArtId();
  const X = 148;
  const Y = 18;
  const W = 104;
  const H = 214;
  const scenes = [
    { from: VIOLET, to: BLUE },
    { from: BLUE, to: ORANGE },
    { from: ORANGE, to: VIOLET },
    { from: VIOLET, to: BLUE }, // копия первого — для бесшовного цикла
  ];
  return (
    <Frame id={id}>
      <defs>
        <clipPath id={`${id}-screen`}>
          <rect x={X} y={Y} width={W} height={H} rx="16" />
        </clipPath>
        {scenes.slice(0, 3).map((s, i) => (
          <linearGradient key={i} id={`${id}-s${i}`} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor={s.from} />
            <stop offset="1" stopColor={s.to} />
          </linearGradient>
        ))}
      </defs>

      <g opacity="0.45">
        <rect className="art-float art-d2" x="58" y="46" width="66" height="132" rx="14" fill="#ffffff0d" stroke="#ffffff1a" />
        <rect className="art-float art-d1" x="276" y="66" width="66" height="132" rx="14" fill="#ffffff0d" stroke="#ffffff1a" />
      </g>

      <g className="art-float">
        <rect x={X - 6} y={Y - 6} width={W + 12} height={H + 12} rx="22" fill="#0b0b0f" stroke="#ffffff26" />
        <g clipPath={`url(#${id}-screen)`}>
          <g className="art-feed">
            {scenes.map((_, i) => {
              const top = Y + i * H;
              const g = `url(#${id}-s${i % 3})`;
              return (
                <g key={i}>
                  <rect x={X} y={top} width={W} height={H} fill={g} />
                  {i % 3 === 0 && <circle cx={X + 70} cy={top + 60} r="16" fill="#fff" opacity="0.35" />}
                  {i % 3 === 1 && (
                    <path d={`M${X} ${top + 150} L${X + 35} ${top + 110} L${X + 60} ${top + 135} L${X + 104} ${top + 95} V${top + H} H${X} Z`} fill="#000" opacity="0.25" />
                  )}
                  {i % 3 === 2 && (
                    <g fill="#000" opacity="0.28">
                      <circle cx={X + 50} cy={top + 82} r="14" />
                      <rect x={X + 28} y={top + 100} width="44" height="70" rx="20" />
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Большое сердце от двойного тапа */}
          <g transform={`translate(${X + 50} ${Y + 98}) scale(2.6)`}>
            <path className="art-pop" d={HEART} fill="#ff3b6b" />
          </g>

          {/* Субтитры: слова подсвечиваются по очереди */}
          <rect x={X + 8} y={Y + 140} width="72" height="13" rx="4" fill="#000" opacity="0.45" />
          {[
            [X + 12, 18],
            [X + 34, 24],
            [X + 62, 14],
          ].map(([x, w], i) => (
            <rect key={i} className={`art-word art-word-${i}`} x={x} y={Y + 144} width={w} height="5" rx="2.5" fill="#fff" />
          ))}

          <circle cx={X + 12} cy={Y + 176} r="5" fill="#fff" opacity="0.9" />
          <rect x={X + 21} y={Y + 173} width="34" height="5" rx="2.5" fill="#fff" opacity="0.9" />
          <rect x={X + 8} y={Y + 186} width="64" height="4" rx="2" fill="#fff" opacity="0.55" />
          <rect x={X + 8} y={Y + 194} width="44" height="4" rx="2" fill="#fff" opacity="0.55" />

          <rect x={X} y={Y + H - 3} width={W} height="3" fill="#ffffff33" />
          <rect className="art-reel-progress" x={X} y={Y + H - 3} width={W} height="3" fill="#fff" />
        </g>
        <rect x={X + 37} y={Y + 6} width="30" height="8" rx="4" fill="#000" />

        {/* Боковая панель: лайк, комментарии, репост */}
        <g transform={`translate(${X + 90} ${Y + 112})`}>
          <path className="art-liked" d={HEART} fill="#fff" />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              className="art-like"
              d={HEART}
              fill={i === 1 ? ORANGE : "#ff3b6b"}
              style={{ animationDelay: `${-i * 0.8}s` }}
            />
          ))}
        </g>
        <text x={X + 90} y={Y + 124} fill="#fff" fontSize="6" textAnchor="middle" fontFamily="sans-serif">
          12K
        </text>
        <g transform={`translate(${X + 90} ${Y + 137})`}>
          <path d={COMMENT} fill="#fff" />
        </g>
        <text x={X + 90} y={Y + 151} fill="#fff" fontSize="6" textAnchor="middle" fontFamily="sans-serif">
          348
        </text>
        <g transform={`translate(${X + 90} ${Y + 163})`}>
          <path d={SHARE} fill="#fff" />
        </g>
      </g>
    </Frame>
  );
}

function YouTube() {
  const id = useArtId();
  return (
    <Frame id={id}>
      <defs>
        <clipPath id={`${id}-strip`}>
          <rect x="60" y="210" width="280" height="32" />
        </clipPath>
      </defs>
      <rect x="60" y="30" width="280" height="158" rx="12" fill={`url(#${id}-neon)`} opacity="0.75" />
      {/* Заголовок превью «печатается» */}
      <rect className="art-type" x="80" y="52" width="130" height="16" rx="5" fill="#000" opacity="0.55" />
      <rect className="art-type art-type-2" x="80" y="74" width="90" height="16" rx="5" fill="#000" opacity="0.55" />
      <rect className="art-pulse" x="176" y="92" width="48" height="34" rx="9" fill="#ffffffe6" />
      <path d="M194 101 L208 109 L194 117 Z" fill="#111" />
      <rect x="60" y="196" width="280" height="4" rx="2" fill="#ffffff22" />
      <rect className="art-progress" x="60" y="196" width="280" height="4" rx="2" fill={ORANGE} />
      {[96, 150, 236, 290].map((x) => (
        <rect key={x} x={x} y="194" width="2" height="8" fill="#fff" opacity="0.6" />
      ))}
      <g className="art-scrub">
        <circle cx="60" cy="198" r="6" fill="#fff" />
      </g>
      {/* График удержания аудитории рисуется поверх кадра */}
      <path
        className="art-draw-slow"
        d="M70 120 C 110 125, 130 140, 170 142 S 240 150, 270 152 S 320 165, 330 168"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.8"
        strokeWidth="2"
        pathLength={1}
      />
      <g clipPath={`url(#${id}-strip)`}>
        <g className="art-scroll">
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x={60 + i * 57} y="212" width="52" height="28" rx="5" fill="#ffffff14" stroke="#ffffff1c" />
          ))}
        </g>
      </g>
    </Frame>
  );
}

function Color() {
  const id = useArtId();
  const mountains = "M0 175 L60 110 L105 150 L165 80 L230 160 L280 120 L340 165 L400 130 L400 250 L0 250 Z";
  return (
    <Frame id={id}>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f7d8c" />
          <stop offset="1" stopColor="#ffb36b" />
        </linearGradient>
        {/* Граница «до/после» ездит влево-вправо: правая половина обрезается сдвигаемым прямоугольником */}
        <clipPath id={`${id}-r`}>
          <rect className="art-split" x="200" width="400" height="180" />
        </clipPath>
      </defs>
      <rect width="400" height="180" fill="#5d5d63" />
      <path d={mountains} fill="#3a3a3f" />
      <g clipPath={`url(#${id}-r)`} className="art-hue">
        <rect width="400" height="180" fill={`url(#${id}-sky)`} />
        <circle cx="300" cy="70" r="22" fill="#ffe2b8" />
        <path d={mountains} fill="#0b3b45" />
      </g>
      <g className="art-split">
        <rect x="199" y="0" width="2" height="180" fill="#fff" />
        <circle cx="200" cy="90" r="9" fill="#fff" />
      </g>
      <rect y="180" width="400" height="70" fill="#07070a" opacity="0.6" />
      {[110, 200, 290].map((cx, i) => (
        <g key={cx}>
          <circle cx={cx} cy="215" r="24" fill="none" stroke={[VIOLET, BLUE, ORANGE][i]} strokeOpacity="0.6" strokeWidth="2" />
          <circle cx={cx} cy="215" r="2" fill="#fff" />
          <g className="art-orbit" style={{ transformOrigin: `${cx}px 215px`, animationDelay: `${-i * 1.3}s` }}>
            <circle cx={cx + 9} cy="215" r="4" fill="#fff" />
          </g>
        </g>
      ))}
    </Frame>
  );
}

function Sound() {
  const id = useArtId();
  // Округляем, чтобы сервер и браузер выдали одинаковые числа (иначе ошибка гидрации)
  const bars = Array.from({ length: 64 }, (_, i) =>
    Math.round((10 + Math.abs(Math.sin(i * 0.45) * Math.cos(i * 0.13)) * 70) * 10) / 10,
  );
  return (
    <Frame id={id}>
      {bars.map((h, i) => (
        <rect
          key={i}
          className="art-eq"
          x={24 + i * 5.6}
          y={95 - h / 2}
          width="3.4"
          height={h}
          rx="1.7"
          fill={`url(#${id}-neon)`}
          style={{ animationDelay: `${-((i * 0.13) % 1.2)}s` }}
        />
      ))}
      {/* Плейхед проходит по волне и подсвечивает её */}
      <g className="art-sweep">
        <rect x="16" y="40" width="40" height="110" fill="#fff" opacity="0.08" />
        <rect x="54" y="36" width="2" height="118" fill="#fff" />
      </g>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const knob = 170 + [30, 10, 45, 20, 35, 5][i];
        return (
          <g key={i}>
            <rect x={70 + i * 50} y="165" width="4" height="70" rx="2" fill="#ffffff22" />
            <rect
              className="art-fader"
              x={60 + i * 50}
              y={knob}
              width="24"
              height="10"
              rx="3"
              fill="#e9e9ee"
              style={{ animationDelay: `${-i * 0.7}s` }}
            />
          </g>
        );
      })}
    </Frame>
  );
}

function Motion() {
  const id = useArtId();
  const curve = "M40 200 C 150 200, 160 50, 360 50";
  return (
    <Frame id={id}>
      {[60, 110, 160, 210].map((y) => (
        <line key={y} x1="30" y1={y} x2="370" y2={y} stroke="#ffffff10" />
      ))}
      <path d={curve} fill="none" stroke={`url(#${id}-neon)`} strokeWidth="3" />
      <path className="art-draw" d={curve} fill="none" stroke="#fff" strokeWidth="3" pathLength={1} />
      <line x1="40" y1="200" x2="130" y2="200" stroke="#ffffff55" strokeDasharray="3 3" />
      <line x1="360" y1="50" x2="250" y2="50" stroke="#ffffff55" strokeDasharray="3 3" />
      {[
        [40, 200],
        [130, 200],
        [250, 50],
        [360, 50],
      ].map(([x, y], i) => (
        <g key={i} className={i === 0 || i === 3 ? "art-pulse" : undefined}>
          <rect
            x={x - 6}
            y={y - 6}
            width="12"
            height="12"
            transform={`rotate(45 ${x} ${y})`}
            fill={i === 0 || i === 3 ? "#fff" : "#ffffff66"}
          />
        </g>
      ))}
      {/* Объект, который «анимирует» кривая: вращается и растёт в такт шарику */}
      <g className="art-spin">
        <rect x="300" y="150" width="44" height="44" rx="8" fill={`url(#${id}-neon)`} />
      </g>
      <text x="300" y="214" fill="#ffffff66" fontSize="10" fontFamily="sans-serif">
        rotation
      </text>
      <circle r="14" fill={ORANGE} opacity="0.9">
        <animateMotion dur="3s" repeatCount="indefinite" path={curve} keyPoints="0;1;1" keyTimes="0;0.8;1" calcMode="spline" keySplines="0.45 0 0.55 1; 0 0 1 1" />
      </circle>
      <text x="40" y="236" fill="#ffffff88" fontSize="12" fontFamily="sans-serif">
        ease in out
      </text>
    </Frame>
  );
}

export function NicheArt({ niche }: { niche: Niche }) {
  switch (niche) {
    case "reels":
      return <Reels />;
    case "youtube":
      return <YouTube />;
    case "color":
      return <Color />;
    case "sound":
      return <Sound />;
    case "motion":
      return <Motion />;
  }
}
