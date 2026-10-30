"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Check, LoaderCircle } from "lucide-react";

type LeadFormProps = {
  // Префикс id полей, чтобы на странице могло быть несколько форм
  id: string;
  submitLabel: string;
  doneTitle: string;
  doneText: string;
  messageLabel?: string;
  buttonStyle?: CSSProperties;
};

const field =
  "w-full rounded-[14px] border border-white/12 bg-white/[0.04] px-4 py-3 text-text placeholder:text-white/30 outline-none transition-colors focus:border-white/40 focus:bg-white/[0.06]";

// Демо-форма заявки: проверяет поля, показывает загрузку и успех, но никуда ничего не отправляет
export function LeadForm({ id, submitLabel, doneTitle, doneText, messageLabel, buttonStyle }: LeadFormProps) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("sending");
    window.setTimeout(() => setState("done"), 900);
  };

  if (state === "done") {
    return (
      <motion.div
        className="flex flex-col items-center py-6 text-center"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        role="status"
      >
        <motion.span
          className="grid size-16 place-items-center rounded-full text-black"
          style={buttonStyle ?? { background: "linear-gradient(180deg, #fff, var(--a1) 45%, var(--a2))" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
        >
          <Check className="size-7" strokeWidth={2.5} aria-hidden="true" />
        </motion.span>
        <p className="mt-5 font-display text-xl font-semibold">{doneTitle}</p>
        <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-muted">{doneText}</p>
        <p className="mt-4 text-xs text-white/35">Демо-версия: данные никуда не отправляются.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-name`} className="text-sm text-muted">
          Имя
        </label>
        <input id={`${id}-name`} name="name" required autoComplete="given-name" placeholder="Как к вам обращаться" className={field} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-contact`} className="text-sm text-muted">
          Telegram или телефон
        </label>
        <input id={`${id}-contact`} name="contact" required placeholder="@username или +7…" className={field} />
      </div>
      {messageLabel && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-message`} className="text-sm text-muted">
            {messageLabel}
          </label>
          <textarea id={`${id}-message`} name="message" required rows={4} className={`${field} resize-none`} />
        </div>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="btn-chrome mt-2 w-full disabled:opacity-80"
        style={buttonStyle}
      >
        {state === "sending" ? <LoaderCircle className="size-5 animate-spin" aria-label="Отправляем" /> : submitLabel}
      </button>
    </form>
  );
}
