"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Glow } from "./Glow";
import { SectionHead } from "./Sections";
import { neonAt } from "./Timeline";

const steps = [
  {
    tc: "00:00",
    title: "Смотрите уроки",
    text: "Короткие видеоуроки в своём темпе — с компьютера или телефона.",
  },
  {
    tc: "00:15",
    title: "Монтируете задание",
    text: "После каждого модуля собираете ролик из наших исходников.",
  },
  {
    tc: "00:30",
    title: "Получаете разбор",
    text: "Обратная связь от учеников в чате или от куратора — зависит от тарифа.",
  },
  {
    tc: "00:45",
    title: "Собираете портфолио",
    text: "Лучшие работы складываются в шоурил, с которым можно идти к заказчикам.",
  },
];

const RULER_GRADIENT = `linear-gradient(90deg, ${neonAt(0)}, ${neonAt(0.5)}, ${neonAt(1)})`;

// Прокрутка «проигрывает» блок как таймлайн: плейхед едет по линейке от момента, когда блок
// появляется снизу, до подхода к тарифам; шаг загорается, пока плейхед проходит его колонку
export function How() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const tc = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = section.current;
    const box = track.current;
    if (!el || !box) return;
    const cards = [...box.querySelectorAll<HTMLElement>("[data-step]")];
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const pricing = document.getElementById("pricing");
      // Старт — когда верх блока поднялся на четверть экрана, финиш — когда тарифы заняли нижние 40%
      const start = el.getBoundingClientRect().top + window.scrollY - vh * 0.75;
      const end = pricing
        ? pricing.getBoundingClientRect().top + window.scrollY - vh * 0.6
        : start + el.offsetHeight + vh;
      const p = Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));
      box.style.setProperty("--p", p.toFixed(4));
      cards.forEach((c, i) => {
        const k = Math.min(1, Math.max(0, (p - i / steps.length) * steps.length));
        c.style.setProperty("--k", k.toFixed(3));
      });
      if (tc.current) {
        const s = Math.round(p * 60);
        tc.current.textContent = `00:${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="how" ref={section} className="px-4 py-24 sm:py-32">
      <div className="relative isolate mx-auto max-w-[1120px]">
        <Glow color="violet" strength={0.2} className="-left-1/3 -bottom-32 h-[420px] w-[70%]" />
        <SectionHead
          title="Как проходит обучение"
          lede="Каждый модуль — как дорожка на таймлайне: от урока до готового ролика."
        />
        <div ref={track} className="relative" style={{ "--p": 0 } as CSSProperties}>
          {/* Линейка с заполнением по прогрессу и плейхедом (на широких экранах) */}
          <div className="relative mb-4 hidden h-3 lg:block" aria-hidden="true">
            <div
              className="absolute inset-0 border-t border-white/20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgb(255 255 255 / 0.18) 0 1px, transparent 1px 28px)",
                backgroundSize: "100% 8px",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div
              className="absolute inset-x-0 -top-px h-[2px]"
              style={{
                background: RULER_GRADIENT,
                clipPath: "inset(0 calc((1 - var(--p)) * 100%) 0 0)",
                boxShadow: `0 0 12px ${neonAt(0.5)}`,
              }}
            />
          </div>
          <div
            className="pointer-events-none absolute -top-9 bottom-0 z-10 hidden w-px -translate-x-1/2 bg-white lg:block"
            style={{ left: "calc(var(--p) * 100%)", boxShadow: "0 0 10px rgb(255 255 255 / 0.7)" }}
            aria-hidden="true"
          >
            <span
              ref={tc}
              className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-white px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-black"
            >
              00:00:00
            </span>
            <span className="absolute top-8 left-1/2 size-2.5 -translate-x-1/2 rotate-45 rounded-[2px] bg-white" />
          </div>

          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => {
              const color = neonAt(i / (steps.length - 1));
              return (
                <li
                  key={s.tc}
                  data-step
                  className="flex flex-col"
                  style={
                    {
                      "--k": 0,
                      opacity: "calc(0.35 + 0.65 * var(--k))",
                      transform: "translateY(calc((1 - var(--k)) * 14px))",
                    } as CSSProperties
                  }
                >
                  <span className="mb-2 text-xs font-medium tabular-nums text-muted">{s.tc}</span>
                  <div
                    className="flex-1 overflow-hidden rounded-[18px] border bg-panel"
                    style={{
                      borderColor: `color-mix(in oklab, ${color} calc(var(--k) * 60%), rgb(255 255 255 / 0.09))`,
                      boxShadow: `0 24px 60px -30px color-mix(in oklab, ${color} calc(var(--k) * 100%), transparent)`,
                    }}
                  >
                    <div className="h-1.5 bg-white/[0.06]">
                      <div
                        className="h-full origin-left"
                        style={{
                          background: color,
                          boxShadow: `0 0 12px ${color}`,
                          transform: "scaleX(var(--k))",
                        }}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-base font-semibold tracking-tight">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
