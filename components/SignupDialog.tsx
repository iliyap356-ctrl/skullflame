"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { LeadForm } from "./LeadForm";
import { TIER_COLORS, tierButtonStyle, type TierId } from "./tiers";

// Открыть окно записи на тариф из любого места страницы
export function openSignup(tier: TierId) {
  window.dispatchEvent(new CustomEvent("signup", { detail: tier }));
}

export function SignupDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [tier, setTier] = useState<TierId | null>(null);
  // Новый ключ на каждое открытие, чтобы форма начиналась с чистого листа
  const [session, setSession] = useState(0);

  useEffect(() => {
    const onOpen = (e: Event) => {
      setTier((e as CustomEvent<TierId>).detail);
      setSession((s) => s + 1);
      dialog.current?.showModal();
    };
    window.addEventListener("signup", onOpen);
    return () => window.removeEventListener("signup", onOpen);
  }, []);

  const t = tier ? TIER_COLORS[tier] : null;

  return (
    <dialog
      ref={dialog}
      onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
      className="niche-dialog m-auto w-[min(460px,calc(100%-32px))] max-h-[calc(100dvh-32px)] overflow-y-auto rounded-[28px] border border-white/12 bg-[#0c0c0f] p-0 text-text"
      aria-labelledby="signup-title"
    >
      {tier && t && (
        <div className="relative overflow-hidden p-6 sm:p-8">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[120%] -translate-x-1/2 rounded-full blur-[60px]"
            style={{ background: `${t.base}55` }}
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Закрыть"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          <p className="relative text-sm text-muted">Запись на тариф</p>
          <h3
            id="signup-title"
            className="relative mt-1 font-display text-3xl font-bold tracking-tight"
            style={{ color: t.light, textShadow: `0 0 30px ${t.base}` }}
          >
            {t.name}
          </h3>
          <p className="relative mb-6 mt-3 text-sm leading-relaxed text-muted">
            Оставьте контакт — пришлём ссылку на оплату и ответим на вопросы о курсе.
          </p>
          <div className="relative">
            <LeadForm
              key={session}
              id="signup"
              submitLabel={`Записаться на ${t.name}`}
              doneTitle="Заявка принята"
              doneText={`Скоро напишем вам и пришлём ссылку на оплату тарифа ${t.name}.`}
              buttonStyle={tierButtonStyle(tier)}
            />
          </div>
        </div>
      )}
    </dialog>
  );
}
