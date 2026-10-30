import { Mark } from "./Logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line px-4 pt-14">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-[32ch]">
          <Mark id="ftr" className="size-12" />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Онлайн-школа видеомонтажа. Учим монтировать ролики, которые досматривают.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-14 gap-y-3 text-sm">
          <a href="#program" className="text-muted hover:text-text">Программа</a>
          <a href="#" className="text-muted hover:text-text">Telegram</a>
          <a href="#pricing" className="text-muted hover:text-text">Тарифы</a>
          <a href="#" className="text-muted hover:text-text">YouTube</a>
          <a href="#faq" className="text-muted hover:text-text">Вопросы</a>
          <a href="#" className="text-muted hover:text-text">Оферта</a>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1120px] justify-between text-xs text-muted">
        <span>© 2026 SkullFlame</span>
        <a href="#" className="hover:text-text">Политика конфиденциальности</a>
      </div>
      <div
        className="chrome-text pointer-events-none mt-6 select-none text-center font-display text-[11.5vw] font-bold lowercase leading-[0.78] tracking-[-0.05em]"
        aria-hidden="true"
      >
        skullflame
      </div>
    </footer>
  );
}
