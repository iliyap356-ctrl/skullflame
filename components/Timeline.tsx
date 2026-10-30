"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const v1 = [14, 9, 18, 7, 22, 12, 16];
const v2 = [
  { left: 17, width: 13 },
  { left: 51, width: 21 },
];
const wave = Array.from({ length: 96 }, (_, i) =>
  Math.round(18 + Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)) * 78),
);

const FPS = 30;
const DURATION = 30; // длина ролика на таймлайне, сек

// Неон идёт по цветам тарифов слева направо: PRO → MAX → ULTRA
const NEON: [number, number, number][] = [
  [168, 85, 247],
  [34, 184, 240],
  [255, 138, 31],
];
export function neonAt(t: number) {
  const x = Math.min(1, Math.max(0, t)) * (NEON.length - 1);
  const i = Math.min(NEON.length - 2, Math.floor(x));
  const f = x - i;
  const [r, g, b] = NEON[i].map((c, k) => Math.round(c + (NEON[i + 1][k] - c) * f));
  return `rgb(${r} ${g} ${b})`;
}

const v1Clips = v1.reduce<{ width: number; center: number }[]>((acc, w) => {
  const start = acc.length ? acc[acc.length - 1].center + acc[acc.length - 1].width / 2 : 0;
  acc.push({ width: w, center: start + w / 2 });
  return acc;
}, []);

function timecode(p: number) {
  const frames = Math.round(p * DURATION * FPS);
  const s = Math.floor(frames / FPS);
  const ff = frames % FPS;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `00:00:${pad(s)}:${pad(ff)}`;
}

// Дорожки рисуются дважды: серые снизу и неоновые сверху, неоновые обрезаются по плейхеду
function Lanes({ neon }: { neon?: boolean }) {
  const glow = (c: string) => (neon ? { background: c, boxShadow: `0 0 14px ${c}`, borderColor: c } : {});
  return (
    <>
      <div className="relative h-7">
        {v2.map((c) => (
          <div
            key={c.left}
            className="absolute inset-y-0 rounded-md border border-white/10 bg-white/[0.06]"
            style={{
              left: `${c.left}%`,
              width: `${c.width}%`,
              ...glow(neonAt((c.left + c.width / 2) / 100)),
            }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex h-9 gap-[3px]">
        {v1Clips.map((c, i) => (
          <div
            key={i}
            className="rounded-md border border-white/10 bg-white/[0.08]"
            style={{ width: `${c.width}%`, ...glow(neonAt(c.center / 100)) }}
          />
        ))}
      </div>
      <div
        className={`mt-1.5 flex h-9 items-center gap-[2px] rounded-md border px-1 ${
          neon ? "border-transparent" : "border-white/10 bg-white/[0.03]"
        }`}
      >
        {wave.map((h, i) => {
          const c = neonAt(i / (wave.length - 1));
          return (
            <span
              key={i}
              className={`flex-1 rounded-full ${neon ? "" : "bg-white/35"}`}
              style={{ height: `${h}%`, ...(neon ? { background: c, boxShadow: `0 0 6px ${c}` } : {}) }}
            />
          );
        })}
      </div>
    </>
  );
}

export function Timeline() {
  const lanes = useRef<HTMLDivElement>(null);
  const tc = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = lanes.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let target = 0.43;
    let current = still ? target : 0.04;
    let raf = 0;

    // Плейхед плавно догоняет курсор; при загрузке он сам проезжает до середины
    const tick = () => {
      current += (target - current) * (still ? 1 : 0.12);
      el.style.setProperty("--p", `${(current * 100).toFixed(3)}%`);
      if (tc.current) tc.current.textContent = timecode(current);
      raf = Math.abs(target - current) > 0.0005 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      kick();
    };

    kick();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
  }, []);

  return (
    <div className="glass rounded-[22px] p-3 text-left sm:p-4" aria-hidden="true">
      <div className="mb-3 flex items-center justify-between px-1 text-xs text-muted">
        <span ref={tc} className="font-medium tabular-nums text-text">
          {timecode(0.43)}
        </span>
        <span>reels_final.prproj</span>
      </div>
      <div className="grid grid-cols-[30px_1fr] gap-x-2 gap-y-1.5 text-[10px] text-muted sm:grid-cols-[36px_1fr]">
        <div className="flex h-7 items-center">V2</div>
        <div ref={lanes} className="relative row-span-3" style={{ "--p": "43%" } as CSSProperties}>
          <Lanes />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ clipPath: "inset(-24px calc(100% - var(--p)) -24px -24px)" }}
          >
            <Lanes neon />
          </div>
          <div
            className="absolute -top-2 bottom-0 w-px -translate-x-1/2 bg-white"
            style={{ left: "var(--p)", boxShadow: "0 0 10px rgb(255 255 255 / 0.8)" }}
          >
            <span className="absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 rotate-45 rounded-[2px] bg-white" />
          </div>
        </div>
        <div className="flex h-9 items-center">V1</div>
        <div className="flex h-9 items-center">A1</div>
      </div>
    </div>
  );
}
