import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { CoursesDashboard } from "@/components/CoursesDashboard";

export const metadata: Metadata = { title: "Мои курсы — SkullFlame" };

export default function CoursesPage() {
  return (
    <AppShell title="Мои курсы" lede="С возвращением, Алекс. Вы прошли почти половину курса — осталось три модуля.">
      <CoursesDashboard />
    </AppShell>
  );
}
