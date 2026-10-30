import type { ReactNode } from "react";
import { Glow } from "./Glow";
import { Header } from "./Header";

// Оболочка внутренних страниц (кабинет, профиль, поддержка): та же шапка и мягкая подсветка фона
export function AppShell({ title, lede, children }: { title: string; lede?: string; children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="overflow-x-clip px-4 pb-24 pt-32 sm:pt-36">
        <div className="relative isolate mx-auto max-w-[1120px]">
          <Glow color="violet" strength={0.4} className="-left-1/3 -top-40 h-[420px] w-[70%]" />
          <Glow color="indigo" strength={0.25} className="-right-1/3 top-1/2 h-[420px] w-[60%]" />
          <h1 className="font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-semibold leading-[1.06] tracking-[-0.03em]">
            <span className="chrome-text">{title}</span>
          </h1>
          {lede && <p className="mt-3 max-w-[56ch] leading-relaxed text-muted">{lede}</p>}
          <div className="mt-10">{children}</div>
        </div>
      </main>
    </>
  );
}
