import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";

type ComingSoonProps = {
  icon: LucideIcon;
  title: string;
  text: string;
};

// Заглушка для разделов из орбитального меню, которые ещё не сделаны
export function ComingSoon({ icon: Icon, title, text }: ComingSoonProps) {
  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden px-4 py-24">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[620px] max-w-[150vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ background: "rgb(91 33 182 / 0.35)" }}
        aria-hidden="true"
      />
      <div className="relative flex max-w-[460px] flex-col items-center text-center">
        <span className="glass grid size-16 place-items-center rounded-full text-white">
          <Icon className="size-7" strokeWidth={1.6} aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-[clamp(1.8rem,5vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
          <span className="chrome-text">{title}</span>
        </h1>
        <p className="mt-4 leading-relaxed text-muted">{text}</p>
        <a href="/" className="btn-ghost mt-8 gap-2">
          <ArrowLeft className="size-4" aria-hidden="true" />
          На главную
        </a>
      </div>
    </main>
  );
}
