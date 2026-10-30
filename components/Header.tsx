"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, Headset, House, UserRound, X } from "lucide-react";
import { RadialOrbitalTimeline, type OrbitalItem } from "@/components/ui/radial-orbital-timeline";
import { Mark, Wordmark } from "./Logo";

const links = [
  { href: "/#program", label: "Программа" },
  { href: "/#how", label: "Как учимся" },
  { href: "/#pricing", label: "Тарифы" },
  { href: "/#faq", label: "Вопросы" },
];

// Пункты орбитального меню, которое открывает кнопка с домиком.
// Разделы главной сюда не дублируются — они уже есть в шапке
const orbit: OrbitalItem[] = [
  { label: "Главная", icon: House, href: "/#top" },
  { label: "Мои курсы", icon: GraduationCap, href: "/courses" },
  { label: "Поддержка", icon: Headset, href: "/support" },
  { label: "Профиль", icon: UserRound, href: "/profile" },
];

export function Header() {
  const [menu, setMenu] = useState(false);
  // Точка, из которой круг меню раскрывается: центр кнопки с домиком
  const [origin, setOrigin] = useState({ x: 0, y: 0, r: 0 });

  const open = (e: MouseEvent<HTMLButtonElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    const x = b.left + b.width / 2;
    const y = b.top + b.height / 2;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    setOrigin({ x, y, r });
    setMenu(true);
  };
  const circle = (r: number) => `circle(${r}px at ${origin.x}px ${origin.y}px)`;

  // Пока меню открыто: страница не прокручивается, Esc закрывает
  useEffect(() => {
    if (!menu) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  return (
    <>
      <header className="fixed inset-x-0 top-3 z-50 px-4">
        <div className="glass mx-auto flex h-14 bg-black/70 max-w-[1120px] items-center justify-between rounded-full pl-4 pr-2 sm:pl-5">
          <a href="/#top" className="flex items-center gap-2" aria-label="SkullFlame — на главную">
            <Mark id="hdr" className="size-8" />
            <Wordmark className="text-[15px]" />
          </a>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Разделы">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-text"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={open}
            className="btn-chrome size-10 p-0"
            aria-label="Открыть меню"
            aria-haspopup="dialog"
            aria-expanded={menu}
          >
            <House className="size-[18px]" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            className="fixed inset-0 z-[70] grid place-items-center bg-black"
            initial={{ clipPath: circle(0) }}
            animate={{ clipPath: circle(origin.r) }}
            exit={{ clipPath: circle(0) }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            onClick={(e) => e.target === e.currentTarget && setMenu(false)}
          >
            <button
              type="button"
              onClick={() => setMenu(false)}
              className="absolute right-4 top-5 grid size-11 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white sm:right-8 sm:top-6"
              aria-label="Закрыть меню"
              autoFocus
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            {/* Сфера, орбита и узлы появляются по очереди — анимация внутри компонента */}
            <RadialOrbitalTimeline items={orbit} onSelect={() => setMenu(false)} />
            {/* На телефоне в шапке нет ссылок на разделы, поэтому они живут здесь */}
            <motion.nav
              aria-label="Разделы"
              className="absolute inset-x-4 bottom-8 flex flex-wrap justify-center gap-2 md:hidden"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
            >
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenu(false)}
                  className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm text-white/75 transition-colors hover:text-white"
                >
                  {l.label}
                </a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
