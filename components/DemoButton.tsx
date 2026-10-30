"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type DemoButtonProps = {
  children: ReactNode;
  className?: string;
  note?: string;
};

// Кнопка для демо-страниц: вместо действия показывает короткую подсказку внизу экрана
export function DemoButton({ children, className = "btn-chrome", note = "Это демо: в полной версии здесь откроется урок." }: DemoButtonProps) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!shown) return;
    const t = window.setTimeout(() => setShown(false), 2600);
    return () => window.clearTimeout(t);
  }, [shown]);

  return (
    <>
      <button type="button" onClick={() => setShown(true)} className={className}>
        {children}
      </button>
      <AnimatePresence>
        {shown && (
          <motion.div
            role="status"
            className="glass fixed bottom-6 left-1/2 z-[80] w-max max-w-[calc(100%-32px)] rounded-full bg-black/70 px-5 py-3 text-sm text-text"
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            transition={{ duration: 0.3 }}
          >
            {note}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
