import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { SupportView } from "@/components/SupportView";

export const metadata: Metadata = { title: "Поддержка — SkullFlame" };

export default function SupportPage() {
  return (
    <AppShell title="Поддержка" lede="Поможем с оплатой, доступом и уроками.">
      <SupportView />
    </AppShell>
  );
}
