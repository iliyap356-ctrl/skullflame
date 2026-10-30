"use client";

import { useEffect, useRef, useState } from "react";
import { GlowCard } from "@/components/ui/spotlight-card";
import { openSignup } from "./SignupDialog";

const tiers = [
  {
    id: "pro",
    name: "PRO",
    glow: { color: "purple", hue: 268 },
    price: "1 400",
    tagline: "Чтобы начать монтировать",
    features: [
      "Базовый курс монтажа",
      "Исходники для практики",
      "Общий чат учеников",
      "Уроки с телефона и компьютера",
    ],
  },
  {
    id: "max",
    name: "MAX",
    glow: { color: "blue", hue: 198 },
    price: "2 600",
    tagline: "Чтобы монтировать на уровне",
    features: [
      "Всё из PRO",
      "Модули по цвету, звуку и моушну",
      "Проверка заданий куратором",
      "Пресеты и шаблоны проектов",
    ],
  },
  {
    id: "ultra",
    name: "ULTRA",
    glow: { color: "orange", hue: 26 },
    price: "6 500",
    tagline: "Чтобы выйти на заказы",
    features: [
      "Всё из MAX",
      "Личные созвоны с наставником",
      "Разбор и сборка портфолио",
      "Помощь с первыми заказами",
    ],
  },
] as const;

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export function Pricing() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);

  // Цвет тарифа уходит в акцент всего сайта, пока блок с тарифами на экране
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "-35% 0px -35% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (inView) root.dataset.tier = tiers[active].id;
    else delete root.dataset.tier;
  }, [inView, active]);

  useEffect(() => () => void delete document.documentElement.dataset.tier, []);

  // На телефоне карточки листаются свайпом; тариф по центру становится активным
  const onTrackScroll = () => {
    const el = track.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    const dist = [...el.children].map((c) => {
      const card = c as HTMLElement;
      return Math.abs(card.offsetLeft + card.offsetWidth / 2 - mid);
    });
    setActive(dist.indexOf(Math.min(...dist)));
  };

  const select = (i: number) => {
    setActive(i);
    const el = track.current;
    if (el && el.scrollWidth > el.clientWidth) {
      const card = el.children[i] as HTMLElement;
      el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
    }
  };

  // Кнопка тарифа в окне ниши («PRO», «MAX») открывает блок сразу на этом тарифе
  const selectRef = useRef(select);
  selectRef.current = select;
  useEffect(() => {
    const onSelect = (e: Event) => {
      const i = tiers.findIndex((t) => t.id === (e as CustomEvent<string>).detail);
      if (i >= 0) selectRef.current(i);
    };
    window.addEventListener("select-tier", onSelect);
    return () => window.removeEventListener("select-tier", onSelect);
  }, []);

  return (
    <section
      id="pricing"
      ref={section}
      className="relative overflow-hidden px-4 py-24 sm:py-32"
      aria-label="Тарифы"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[900px] max-w-[160vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
        style={{ background: "var(--glow)" }}
      />
      {/* Огромное название тарифа на фоне: старое растворяется, новое проявляется */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[-0.14em] grid select-none font-display text-[24vw] font-bold leading-none tracking-[-0.05em] lg:text-[19vw]"
        aria-hidden="true"
      >
        {tiers.map((t, i) => (
          <span
            key={t.id}
            className={`chrome-text col-start-1 row-start-1 text-center transition-all duration-1000 ${EASE} ${
              i === active ? "opacity-[0.13] blur-0" : "translate-y-6 scale-95 opacity-0 blur-md"
            }`}
          >
            {t.name}
          </span>
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-[1120px]">
        <div className="mb-8 flex flex-col gap-5 sm:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-[clamp(1.7rem,3.6vw,2.8rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
              <span className="chrome-text">Выберите тариф</span>
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              Нажмите на тариф, чтобы посмотреть, что в него входит.
            </p>
          </div>
          <div
            className="glass relative grid grid-cols-3 self-start rounded-full p-1 md:self-auto"
            role="tablist"
            aria-label="Тариф"
          >
            <span
              className={`absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-white/12 transition-transform duration-500 ${EASE}`}
              style={{ transform: `translateX(${active * 100}%)` }}
              aria-hidden="true"
            />
            {tiers.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => select(i)}
                className={`relative rounded-full px-5 py-2 font-display text-xs font-semibold transition-colors duration-300 ${
                  i === active ? "text-text" : "text-muted hover:text-text"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          {/* Пятно света переезжает за выбранную карточку */}
          <div
            className={`pointer-events-none absolute -inset-y-10 hidden w-[calc((100%-40px)/3)] rounded-[40px] blur-[60px] transition-[left] duration-700 lg:block ${EASE}`}
            style={{ left: `calc(${active} * (100% + 20px) / 3)`, background: "var(--glow)" }}
            aria-hidden="true"
          />
          <div
            ref={track}
            onScroll={onTrackScroll}
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 pt-3 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {tiers.map((t, i) => {
              const on = i === active;
              return (
                <div
                  key={t.id}
                  onClick={on ? undefined : () => select(i)}
                  className={`min-w-[85%] snap-center rounded-[28px] transition-all duration-700 sm:min-w-[60%] lg:min-w-0 ${EASE} ${
                    on ? "lg:-translate-y-3" : "cursor-pointer opacity-55 hover:opacity-80"
                  }`}
                  style={{ boxShadow: on ? "0 30px 80px -30px var(--glow)" : undefined }}
                >
                  {/* Рамка карточки подсвечивается у курсора цветом своего тарифа */}
                  <GlowCard
                    customSize
                    glowColor={t.glow.color}
                    className="h-full block! p-0! gap-0! rounded-[28px]! shadow-none! backdrop-blur-none!"
                    style={{
                      "--base": t.glow.hue,
                      "--spread": 0,
                      "--radius": 28,
                      "--border": 1,
                      "--size": 260,
                      "--border-light-opacity": 0.5,
                      "--backup-border": on
                        ? "color-mix(in oklab, var(--a2) 70%, transparent)"
                        : "rgb(255 255 255 / 0.09)",
                      touchAction: "auto",
                    }}
                  >
                    <article className="relative flex h-full flex-col overflow-hidden rounded-[27px] bg-panel p-6 sm:p-7">
                      <div
                        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${on ? "opacity-100" : "opacity-0"}`}
                        style={{
                          background:
                            "linear-gradient(180deg, color-mix(in oklab, var(--a3) 55%, transparent), transparent 70%)",
                        }}
                        aria-hidden="true"
                      />
                      <div className="relative flex items-baseline justify-between gap-4">
                        <h3 className="font-display text-2xl font-bold tracking-tight">
                          <span className={on ? "chrome-text" : "text-white/70"}>{t.name}</span>
                        </h3>
                        <span className="text-right text-sm text-muted">{t.tagline}</span>
                      </div>
                      <p
                        key={on ? "on" : "off"}
                        className={`relative mt-6 font-display text-[2.4rem] font-semibold leading-none tracking-[-0.03em] sm:text-[2.8rem] ${on ? "tier-in" : ""}`}
                      >
                        {t.price}
                        <span className="ml-1 text-xl text-muted">₽</span>
                      </p>
                      <ul key={on ? "on-list" : "off-list"} className="relative mt-7 flex-1 space-y-3 text-sm">
                        {t.features.map((f, k) => (
                          <li
                            key={f}
                            className={`flex gap-3 ${on ? "tier-in" : ""}`}
                            style={on ? { animationDelay: `${120 + k * 70}ms` } : undefined}
                          >
                            <svg
                              viewBox="0 0 16 16"
                              className="mt-0.5 size-4 shrink-0 transition-colors duration-700"
                              style={{ color: on ? "var(--a1)" : "var(--muted)" }}
                              aria-hidden="true"
                            >
                              <path
                                d="M3 8.5l3 3 7-7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() => openSignup(t.id)}
                        className={`relative mt-8 ${on ? "btn-chrome" : "btn-ghost"}`}
                      >
                        Выбрать {t.name}
                      </button>
                    </article>
                  </GlowCard>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex justify-center gap-1.5 lg:hidden" aria-hidden="true">
            {tiers.map((t, i) => (
              <span
                key={t.id}
                className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-8" : "w-4"}`}
                style={{ background: i === active ? "var(--a1)" : "rgb(255 255 255 / 0.15)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
