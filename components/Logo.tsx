// Общая геометрия знака SkullFlame: четырёхлучевая звезда внутри наклонного кольца.
// Углы в градусах (0 — вправо, против часовой), длины лучей в долях от радиуса кольца.
export const STAR_RAYS = [
  { angle: -90, length: 1.0 },
  { angle: 0, length: 0.78 },
  { angle: 90, length: 1.0 },
  { angle: 180, length: 0.78 },
];
export const STAR_PINCH = 0.15;
export const RING_TILT = 0.3; // наклон кольца к зрителю, рад
export const RING_ROLL = 14; // поворот кольца в плоскости экрана, град

const C = 100;
const R = 78;
const rad = (d: number) => (d * Math.PI) / 180;
const at = (angle: number, len: number): [number, number] => [
  C + len * Math.cos(rad(angle)),
  C - len * Math.sin(rad(angle)),
];
const f = (p: [number, number]) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;

// Контур звезды: лучи соединены вогнутыми кривыми
const starPath =
  STAR_RAYS.map((ray, k) => {
    const next = STAR_RAYS[(k + 1) % STAR_RAYS.length];
    const nextAngle = next.angle > ray.angle ? next.angle : next.angle + 360;
    const Q = at((ray.angle + nextAngle) / 2, STAR_PINCH * R);
    const B = at(nextAngle, next.length * R);
    return `${k === 0 ? `M${f(at(ray.angle, ray.length * R))} ` : ""}Q${f(Q)} ${f(B)}`;
  }).join(" ") + " Z";

const ringRy = R * Math.sin(RING_TILT);

type MarkProps = {
  id: string;
  className?: string;
};

// Плоская версия знака для шапки, футера и как запасной вариант для 3D.
// Цвета берутся из --a1/--a2/--a3, поэтому знак перекрашивается вместе с тарифами.
export function Mark({ id, className }: MarkProps) {
  const chrome = `url(#${id}-chrome)`;
  const ring = (half: "back" | "front") => (
    <g transform={`rotate(${-RING_ROLL} ${C} ${C})`}>
      <ellipse
        cx={C}
        cy={C}
        rx={R}
        ry={ringRy}
        fill="none"
        stroke={chrome}
        strokeWidth={half === "front" ? 6 : 4.5}
        clipPath={`url(#${id}-${half})`}
      />
    </g>
  );

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        {/* Матовый серый: мягкий переход от светлого верха к тёмному низу без хромовых бликов.
            На тарифах серый слегка подкрашивается акцентом */}
        <linearGradient id={`${id}-chrome`} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0" style={{ stopColor: "color-mix(in oklab, #d4d4d9 82%, var(--a1))" }} />
          <stop offset="0.55" style={{ stopColor: "color-mix(in oklab, #8e8e94 82%, var(--a2))" }} />
          <stop offset="1" style={{ stopColor: "color-mix(in oklab, #4a4a50 82%, var(--a3))" }} />
        </linearGradient>
        <radialGradient id={`${id}-shine`} cx="0.45" cy="0.38" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-back`}>
          <rect x="0" y="0" width="200" height={C} />
        </clipPath>
        <clipPath id={`${id}-front`}>
          <rect x="0" y={C} width="200" height={C} />
        </clipPath>
      </defs>
      {ring("back")}
      <path d={starPath} fill={chrome} />
      <path d={starPath} fill={`url(#${id}-shine)`} />
      {ring("front")}
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`font-display font-semibold lowercase tracking-tight ${className ?? ""}`}>
      skullflame
    </span>
  );
}
