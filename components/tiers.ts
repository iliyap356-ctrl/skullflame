// Фирменные цвета тарифов (общие для окна ниши и формы записи)
export const TIER_COLORS = {
  pro: { name: "PRO", light: "#e6dcff", base: "#8b5cf6" },
  max: { name: "MAX", light: "#cdf5ff", base: "#169fd8" },
  ultra: { name: "ULTRA", light: "#ffe2c4", base: "#f97316" },
};

export type TierId = keyof typeof TIER_COLORS;

// Хромированная кнопка, окрашенная в цвет тарифа
export function tierButtonStyle(id: TierId) {
  const t = TIER_COLORS[id];
  return {
    background: `linear-gradient(180deg, #ffffff 0%, ${t.light} 45%, ${t.base} 100%)`,
    boxShadow: `inset 0 1px 0 rgb(255 255 255 / 0.9), 0 10px 34px -8px ${t.base}99`,
  };
}
