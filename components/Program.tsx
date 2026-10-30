"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Glow } from "./Glow";
import { NicheArt, type Niche } from "./NicheArt";
import { SectionHead } from "./Sections";
import { TIER_COLORS, tierButtonStyle, type TierId } from "./tiers";

// Ставки — ориентир для фрилансера на зарубежных и русскоязычных площадках, от новичка до опытного.
// tier — с какого тарифа доступна ниша (цвет, звук и моушн — продвинутые модули MAX)
export const modules: {
  niche: Niche;
  tier: TierId;
  title: string;
  text: string;
  className: string;
  media: string;
  about: string;
  tasks: string[];
  clients: string;
  perProject: string;
  unit: string;
  perMonth: string;
}[] = [
  {
    niche: "reels",
    tier: "pro",
    title: "Reels и Shorts",
    text: "Вертикальный монтаж под алгоритмы: цепляющий хук в первые секунды, ритм под музыку, субтитры и переходы.",
    className: "lg:col-span-3 lg:row-span-2",
    media: "min-h-[220px] lg:min-h-[360px]",
    about:
      "Самая массовая ниша: короткие ролики нужны каждому блогеру, бренду и эксперту, и выходят они пачками по 10–30 штук в месяц. Порог входа низкий, заказов много.",
    tasks: ["Нарезка из длинного видео", "Хук и динамичный ритм", "Субтитры и эффекты", "Ведение потока роликов"],
    clients: "Блогеры, эксперты, онлайн-школы, локальный бизнес",
    perProject: "$10–40",
    unit: "За ролик",
    perMonth: "$400–1 500",
  },
  {
    niche: "youtube",
    tier: "pro",
    title: "YouTube-ролики",
    text: "Длинный формат: структура, удержание, перебивки и B-roll.",
    className: "lg:col-span-3",
    media: "min-h-[140px]",
    about:
      "Монтажёр YouTube отвечает за удержание: убирает паузы, держит темп и делает так, чтобы зритель досмотрел. Каналы ищут постоянного монтажёра надолго.",
    tasks: ["Черновая и чистовая сборка", "Перебивки, B-roll, графика", "Работа с удержанием", "Превью и главы"],
    clients: "YouTube-каналы, подкасты, обзорщики, бренды",
    perProject: "$40–200",
    unit: "За видео",
    perMonth: "$600–2 500",
  },
  {
    niche: "color",
    tier: "max",
    title: "Цветокоррекция",
    text: "Баланс, кривые и LUT — картинка в одном стиле от кадра к кадру.",
    className: "lg:col-span-3",
    media: "min-h-[140px]",
    about:
      "Колорист делает картинку дорогой: выравнивает кадры между собой и задаёт настроение. Узкая ниша, где платят за насмотренность и аккуратность.",
    tasks: ["Баланс и выравнивание кадров", "Стилизация и LUT", "Работа с кожей", "Подготовка к публикации"],
    clients: "Клипмейкеры, продакшены, рекламные ролики, свадьбы",
    perProject: "$50–300",
    unit: "За проект",
    perMonth: "$500–2 000",
  },
  {
    niche: "sound",
    tier: "max",
    title: "Звук",
    text: "Чистим голос, сводим музыку и подбираем эффекты, которые слышно, но не замечают.",
    className: "lg:col-span-3",
    media: "min-h-[160px]",
    about:
      "Плохой звук зритель не прощает, поэтому монтажёр, который умеет его чистить и сводить, стоит дороже. Часто это допродажа к монтажу.",
    tasks: ["Чистка голоса от шумов", "Сведение голоса и музыки", "Саунд-дизайн", "Громкость под площадки"],
    clients: "Подкастеры, YouTube-каналы, онлайн-курсы",
    perProject: "$20–100",
    unit: "За видео",
    perMonth: "$300–1 200",
  },
  {
    niche: "motion",
    tier: "max",
    title: "Моушн-графика",
    text: "Титры, плашки и анимация в After Effects без сложной математики.",
    className: "lg:col-span-3",
    media: "min-h-[160px]",
    about:
      "Моушн — самая дорогая часть монтажа: анимированные титры, инфографика и логотипы. Заказчики платят за то, что ролик выглядит как у больших брендов.",
    tasks: ["Анимированные титры и плашки", "Инфографика", "Анимация логотипов", "Шаблоны для каналов"],
    clients: "Бренды, стартапы, рекламные агентства, YouTube-каналы",
    perProject: "$60–400",
    unit: "За проект",
    perMonth: "$700–3 000",
  },
];

// Карточка чуть наклоняется за курсором, а под курсором загорается мягкий блик
function tilt(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--mx", `${x * 100}%`);
  el.style.setProperty("--my", `${y * 100}%`);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  el.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 9}deg) translateZ(8px)`;
}
function untilt(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.transform = "";
}

export function Program() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const m = open === null ? null : modules[open];

  const show = (i: number) => {
    setOpen(i);
    dialog.current?.showModal();
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      show(i);
    }
  };

  return (
    <section id="program" className="px-4 py-24 sm:py-32">
      <div className="relative isolate mx-auto max-w-[1120px]">
        <Glow color="indigo" strength={0.38} className="-right-1/3 top-1/3 h-[480px] w-[70%]" />
        <SectionHead
          title="Чему вы научитесь"
          lede="Пять ниш монтажа — от коротких роликов до моушна. Нажмите на любую, чтобы узнать, чем в ней занимаются и сколько можно зарабатывать."
        />
        <div className="grid gap-4 lg:grid-cols-6">
          {modules.map((mod, i) => (
            <article
              key={mod.title}
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              onClick={() => show(i)}
              onKeyDown={(e) => onKey(e, i)}
              onPointerMove={tilt}
              onPointerLeave={untilt}
              className={`niche-card glass group relative flex cursor-pointer flex-col gap-5 rounded-[26px] p-4 sm:p-5 ${mod.className}`}
            >
              <div className={`relative flex-1 overflow-hidden rounded-[16px] border border-white/10 ${mod.media}`}>
                <NicheArt niche={mod.niche} />
              </div>
              <div className="flex items-end justify-between gap-4 px-1 pb-1">
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">{mod.title}</h3>
                  <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-muted">{mod.text}</p>
                </div>
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15 text-muted transition-colors group-hover:border-white/40 group-hover:text-text"
                  aria-hidden="true"
                >
                  +
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        className="niche-dialog m-auto w-[min(640px,calc(100%-32px))] max-h-[calc(100dvh-32px)] overflow-y-auto rounded-[28px] border border-white/12 bg-[#0c0c0f] p-0 text-text"
        aria-labelledby="niche-title"
      >
        {m && (
          <div>
            <div className="relative aspect-[8/5] max-w-full overflow-hidden">
              <NicheArt niche={m.niche} />
              <button
                type="button"
                onClick={() => dialog.current?.close()}
                className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-black/50 text-xl text-white backdrop-blur hover:bg-black/70"
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <h3 id="niche-title" className="font-display text-2xl font-semibold tracking-tight">
                <span className="chrome-text">{m.title}</span>
              </h3>
              <p className="mt-3 leading-relaxed text-muted">{m.about}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[18px] border border-line bg-white/[0.03] p-4">
                  <p className="text-sm text-muted">{m.unit}</p>
                  <p className="mt-1 font-display text-xl font-semibold">{m.perProject}</p>
                </div>
                <div className="rounded-[18px] border border-line bg-white/[0.03] p-4">
                  <p className="text-sm text-muted">В месяц</p>
                  <p className="mt-1 font-display text-xl font-semibold">{m.perMonth}</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted">
                Примерный доход фрилансера: зависит от опыта, портфолио и заказчика.
              </p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted">Чем занимаетесь</p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {m.tasks.map((t) => (
                      <li key={t} className="flex gap-2">
                        <span className="text-muted">—</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-muted">Кто заказывает</p>
                  <p className="mt-2 text-sm leading-relaxed">{m.clients}</p>
                </div>
              </div>

              <a
                href="#pricing"
                onClick={() => {
                  dialog.current?.close();
                  window.dispatchEvent(new CustomEvent("select-tier", { detail: m.tier }));
                }}
                className="btn-chrome mt-8 w-full font-display tracking-wide"
                style={tierButtonStyle(m.tier)}
              >
                {TIER_COLORS[m.tier].name}
              </a>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
