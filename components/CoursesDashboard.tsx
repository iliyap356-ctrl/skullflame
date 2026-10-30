"use client";

import { Flame, ListChecks, Pencil, PlayCircle } from "lucide-react";
import { DemoButton } from "./DemoButton";
import { NicheArt } from "./NicheArt";
import { modules } from "./Program";
import { TIER_COLORS } from "./tiers";

// Демо-данные кабинета: прогресс по модулям и следующий урок
const progress: Record<string, { done: number; next: string }> = {
  reels: { done: 100, next: "Модуль пройден" },
  youtube: { done: 60, next: "Урок 7. Перебивки и B-roll" },
  color: { done: 25, next: "Урок 3. Кривые и баланс белого" },
  sound: { done: 0, next: "Урок 1. Чистим голос" },
  motion: { done: 0, next: "Урок 1. Первый титр в After Effects" },
};

function Bar({ value }: { value: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full"
        style={{ width: `${value}%`, background: "linear-gradient(90deg, #a855f7, #22b8f0)" }}
      />
    </div>
  );
}

export function CoursesDashboard() {
  const current = modules.find((m) => m.niche === "youtube")!;
  const tier = TIER_COLORS.max;

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Текущий урок */}
        <article className="glass flex flex-col gap-5 overflow-hidden rounded-[26px] p-4 sm:p-5 lg:col-span-2">
          <div className="relative aspect-[16/9] max-w-full overflow-hidden rounded-[16px] border border-white/10">
            <NicheArt niche={current.niche} />
          </div>
          <div className="flex flex-col gap-4 px-1 pb-1 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm text-muted">Продолжить: {current.title}</p>
              <h2 className="mt-1 font-display text-xl font-semibold tracking-tight">
                {progress[current.niche].next}
              </h2>
              <div className="mt-3 w-full max-w-[320px]">
                <Bar value={progress[current.niche].done} />
              </div>
            </div>
            <DemoButton className="btn-chrome shrink-0 gap-2">
              <PlayCircle className="size-5" aria-hidden="true" />
              Продолжить урок
            </DemoButton>
          </div>
        </article>

        {/* Сводка */}
        <aside className="glass flex flex-col gap-5 rounded-[26px] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Ваш тариф</p>
            <span
              className="rounded-full px-3 py-1 font-display text-xs font-bold"
              style={{ background: `${tier.base}33`, color: tier.light, boxShadow: `inset 0 0 0 1px ${tier.base}88` }}
            >
              {tier.name}
            </span>
          </div>
          <dl className="grid gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-white/5 text-white">
                <ListChecks className="size-5" aria-hidden="true" />
              </span>
              <div>
                <dt className="text-sm text-muted">Уроков пройдено</dt>
                <dd className="font-display text-lg font-semibold tabular-nums">18 из 42</dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-white/5 text-white">
                <Pencil className="size-5" aria-hidden="true" />
              </span>
              <div>
                <dt className="text-sm text-muted">Домашних заданий сдано</dt>
                <dd className="font-display text-lg font-semibold tabular-nums">6</dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-white/5 text-[#ff8a1f]">
                <Flame className="size-5" aria-hidden="true" />
              </span>
              <div>
                <dt className="text-sm text-muted">Учитесь без перерыва</dt>
                <dd className="font-display text-lg font-semibold tabular-nums">5 дней</dd>
              </div>
            </div>
          </dl>
          <div className="mt-auto">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted">Весь курс</span>
              <span className="tabular-nums">43%</span>
            </div>
            <Bar value={43} />
          </div>
        </aside>
      </div>

      <section aria-labelledby="modules-title">
        <h2 id="modules-title" className="font-display text-xl font-semibold tracking-tight">
          Модули курса
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => {
            const p = progress[m.niche];
            const status = p.done === 100 ? "Пройден" : p.done > 0 ? "В процессе" : "Не начат";
            return (
              <article key={m.niche} className="glass flex flex-col gap-4 rounded-[22px] p-4">
                <div className="relative aspect-[8/5] max-w-full overflow-hidden rounded-[14px] border border-white/10">
                  <NicheArt niche={m.niche} />
                </div>
                <div className="flex items-baseline justify-between gap-3 px-1">
                  <h3 className="font-display text-base font-semibold tracking-tight">{m.title}</h3>
                  <span className={`text-xs ${p.done === 100 ? "text-[#22b8f0]" : "text-muted"}`}>{status}</span>
                </div>
                <div className="px-1">
                  <Bar value={p.done} />
                  <p className="mt-2 text-sm text-muted">{p.next}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
