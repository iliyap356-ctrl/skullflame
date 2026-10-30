"use client";

import { useState } from "react";
import { CalendarDays, LogOut, Mail, Pencil } from "lucide-react";
import { withBase } from "./base";
import { DemoButton } from "./DemoButton";
import { TIER_COLORS } from "./tiers";

// Демо-профиль: данные ученика, тариф и настройки уведомлений
const settings = [
  { id: "tg", label: "Напоминания об уроках в Telegram", on: true },
  { id: "mail", label: "Письма о новых модулях", on: false },
  { id: "gallery", label: "Показывать мои работы в галерее учеников", on: true },
];

function Switch({ id, label, initial }: { id: string; label: string; initial: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-4 py-4">
      <span className="text-sm sm:text-base">{label}</span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn(!on)}
        className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-300 ${
          on ? "border-transparent" : "border-white/15 bg-white/[0.06]"
        }`}
        style={on ? { background: "linear-gradient(90deg, #a855f7, #22b8f0)" } : undefined}
      >
        <span
          className={`absolute top-1/2 size-5 -translate-y-1/2 rounded-full bg-white shadow transition-[left] duration-300 ${
            on ? "left-[calc(100%-1.4rem)]" : "left-1"
          }`}
        />
      </button>
    </label>
  );
}

export function ProfileView() {
  const tier = TIER_COLORS.max;
  const ultra = TIER_COLORS.ultra;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <section className="glass flex flex-col items-center gap-4 rounded-[26px] p-6 text-center">
        <span
          className="grid size-24 place-items-center rounded-full font-display text-2xl font-bold text-black"
          style={{ background: "linear-gradient(135deg, #e6dcff, #8b5cf6 55%, #169fd8)" }}
          aria-hidden="true"
        >
          АМ
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight">Алекс Морозов</h2>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted">
            <Mail className="size-4" aria-hidden="true" />
            alex@example.com
          </p>
        </div>
        <DemoButton className="btn-ghost w-full gap-2" note="Это демо: редактирование появится в полной версии.">
          <Pencil className="size-4" aria-hidden="true" />
          Изменить данные
        </DemoButton>
      </section>

      <section
        className="relative flex flex-col gap-5 overflow-hidden rounded-[26px] border p-6 lg:col-span-2"
        style={{
          borderColor: `${tier.base}88`,
          background: `linear-gradient(160deg, ${tier.base}2e, #0b0b0d 60%)`,
          boxShadow: `0 30px 80px -40px ${tier.base}`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted">Текущий тариф</p>
            <p className="mt-1 font-display text-4xl font-bold tracking-tight" style={{ color: tier.light, textShadow: `0 0 30px ${tier.base}` }}>
              {tier.name}
            </p>
          </div>
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <CalendarDays className="size-4" aria-hidden="true" />
            Доступ до 30 ноября 2026
          </p>
        </div>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {["Все модули курса", "Проверка заданий куратором", "Пресеты и шаблоны", "Общий чат учеников"].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full" style={{ background: tier.base }} />
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col gap-3 rounded-[18px] border border-white/10 bg-black/30 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-muted">
            На <span style={{ color: ultra.light }}>ULTRA</span> — личные созвоны с наставником и помощь с первыми заказами.
          </p>
          <a
            href={withBase("/#pricing")}
            className="btn-chrome shrink-0 px-5 py-2.5 text-sm"
            style={{ background: `linear-gradient(180deg, #fff, ${ultra.light} 45%, ${ultra.base})` }}
          >
            Перейти на ULTRA
          </a>
        </div>
      </section>

      <section className="glass rounded-[26px] px-6 py-2 lg:col-span-2" aria-labelledby="settings-title">
        <h2 id="settings-title" className="pt-4 font-display text-lg font-semibold tracking-tight">
          Уведомления
        </h2>
        <div className="divide-y divide-line">
          {settings.map((s) => (
            <Switch key={s.id} id={`set-${s.id}`} label={s.label} initial={s.on} />
          ))}
        </div>
      </section>

      <section className="glass flex flex-col justify-between gap-4 rounded-[26px] p-6">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">Аккаунт</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">Учитесь с 12 сентября 2026.</p>
        </div>
        <DemoButton className="btn-ghost w-full gap-2" note="Это демо: выход появится в полной версии.">
          <LogOut className="size-4" aria-hidden="true" />
          Выйти
        </DemoButton>
      </section>
    </div>
  );
}
