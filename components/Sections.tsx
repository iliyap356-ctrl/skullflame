import type { ReactNode } from "react";
import { Mark } from "./Logo";

export function SectionHead({ title, lede }: { title: string; lede?: ReactNode }) {
  return (
    <div className="mb-10 max-w-[640px] sm:mb-12">
      <h2 className="font-display text-[clamp(1.7rem,3.6vw,2.8rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
        <span className="chrome-text">{title}</span>
      </h2>
      {lede && <p className="mt-4 max-w-[52ch] leading-relaxed text-muted">{lede}</p>}
    </div>
  );
}

const tools = ["Premiere Pro", "DaVinci Resolve", "After Effects", "CapCut", "Final Cut Pro"];

export function Tools() {
  return (
    <section className="border-y border-line px-4 py-8">
      <div className="relative isolate mx-auto flex max-w-[1120px] flex-col items-center gap-5 md:flex-row md:justify-between">
        <p className="text-sm text-muted">Программы на курсе</p>
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 font-display text-sm font-medium text-white/55 sm:text-base">
          {tools.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}


const faq = [
  {
    q: "Нужен ли опыт в монтаже?",
    a: "Нет. Курс начинается с установки программы и первой склейки, дальше сложность растёт постепенно.",
  },
  {
    q: "В каких программах будем работать?",
    a: "Основная — Premiere Pro или DaVinci Resolve на выбор. Для моушна — After Effects, для быстрого вертикального монтажа — CapCut.",
  },
  {
    q: "Чем отличаются тарифы?",
    a: "PRO — уроки и практика с общим чатом. MAX добавляет продвинутые модули и проверку заданий куратором. ULTRA — личные созвоны с наставником, сборку портфолио и помощь с первыми заказами.",
  },
  {
    q: "Подойдёт ли слабый компьютер?",
    a: "Для старта хватит ноутбука средней мощности. Часть уроков по вертикальному монтажу можно пройти в CapCut на телефоне.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="px-4 py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1120px] gap-4 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <SectionHead title="Частые вопросы" />
        <div className="divide-y divide-line border-y border-line">
          {faq.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted transition-transform duration-300 group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="max-w-[60ch] pb-6 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="px-4 pb-24 sm:pb-32">
      <div className="glass relative mx-auto flex max-w-[1120px] flex-col items-center overflow-hidden rounded-[32px] px-6 py-16 text-center sm:py-20">
        <div
          className="pointer-events-none absolute -bottom-40 left-1/2 h-[320px] w-[620px] -translate-x-1/2 rounded-full blur-[100px]"
          style={{ background: "var(--glow)" }}
        />
        <Mark id="cta" className="relative size-24" />
        <h2 className="relative mt-4 font-display text-[clamp(1.7rem,3.6vw,2.8rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
          <span className="chrome-text">Первая склейка — сегодня</span>
        </h2>
        <p className="relative mt-4 max-w-[46ch] leading-relaxed text-muted">
          Выберите тариф и получите доступ к первому модулю сразу после оплаты.
        </p>
        <a href="#pricing" className="btn-chrome relative mt-8">
          Выбрать тариф
        </a>
      </div>
    </section>
  );
}
