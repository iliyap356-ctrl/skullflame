import { ChromeStar } from "./ChromeStar";
import { Glow } from "./Glow";
import { Timeline } from "./Timeline";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-20 pt-32 sm:pt-36">
      <div
        className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-[110px]"
        style={{ background: "var(--glow)" }}
      />
      <div className="relative mx-auto flex max-w-[1120px] flex-col items-center text-center">
        <ChromeStar className="size-[260px] sm:size-[340px]" />
        <h1 className="mt-2 max-w-[18ch] font-display text-[clamp(2rem,5.6vw,4.4rem)] font-semibold leading-[1.04] tracking-[-0.03em]">
          <span className="chrome-text">Монтаж, от которого не листают дальше</span>
        </h1>
        <p className="rise mt-6 max-w-[56ch] text-base leading-relaxed text-muted sm:text-lg">
          Онлайн-школа SkullFlame. Учим собирать Reels, Shorts и YouTube-ролики в Premiere Pro,
          DaVinci Resolve и CapCut — от первой склейки до первых заказов.
        </p>
        <div className="rise mt-9 flex flex-wrap justify-center gap-3">
          <a href="#pricing" className="btn-chrome">
            Выбрать тариф
          </a>
          <a href="#program" className="btn-ghost">
            Посмотреть программу
          </a>
        </div>
        <div className="relative isolate mt-16 w-full max-w-[880px]">
          <Glow color="violet" strength={0.5} className="-left-1/4 -top-10 h-80 w-[80%]" />
          <Timeline />
        </div>
      </div>
    </section>
  );
}
