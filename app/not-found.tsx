import { SearchX } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function NotFound() {
  return (
    <ComingSoon
      icon={SearchX}
      title="Страница не найдена"
      text="Похоже, этот кадр вырезали при монтаже. Вернитесь на главную — там всё на месте."
    />
  );
}
