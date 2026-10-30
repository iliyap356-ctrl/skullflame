"use client";

import { Clock, Mail, MessageCircle } from "lucide-react";
import { withBase } from "./base";
import { LeadForm } from "./LeadForm";

const channels = [
  { icon: MessageCircle, title: "Telegram", value: "@skullflame_help" },
  { icon: Mail, title: "Почта", value: "help@skullflame.ru" },
  { icon: Clock, title: "Отвечаем", value: "Ежедневно, 10:00–22:00 мск" },
];

export function SupportView() {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <section className="glass rounded-[26px] p-6 sm:p-8 lg:col-span-3" aria-labelledby="support-form">
        <h2 id="support-form" className="font-display text-xl font-semibold tracking-tight">
          Написать в поддержку
        </h2>
        <p className="mb-6 mt-2 text-sm leading-relaxed text-muted">
          Вопросы по оплате, доступу к урокам или домашним заданиям — ответим в течение дня.
        </p>
        <LeadForm
          id="support"
          submitLabel="Отправить вопрос"
          messageLabel="Ваш вопрос"
          doneTitle="Вопрос отправлен"
          doneText="Ответим в Telegram или по телефону, который вы указали."
        />
      </section>

      <div className="flex flex-col gap-4 lg:col-span-2">
        {channels.map((c) => (
          <div key={c.title} className="glass flex items-center gap-4 rounded-[22px] p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/5 text-white">
              <c.icon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm text-muted">{c.title}</p>
              <p className="truncate font-medium">{c.value}</p>
            </div>
          </div>
        ))}
        <a
          href={withBase("/#faq")}
          className="glass group flex items-center justify-between gap-4 rounded-[22px] p-5 transition-colors hover:border-white/25"
        >
          <span>
            <span className="block text-sm text-muted">Быстрые ответы</span>
            <span className="font-medium">Частые вопросы о курсе</span>
          </span>
          <span className="text-muted transition-transform group-hover:translate-x-1" aria-hidden="true">
            ›
          </span>
        </a>
      </div>
    </div>
  );
}
