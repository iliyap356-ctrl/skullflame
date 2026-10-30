import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { ProfileView } from "@/components/ProfileView";

export const metadata: Metadata = { title: "Профиль — SkullFlame" };

export default function ProfilePage() {
  return (
    <AppShell title="Профиль">
      <ProfileView />
    </AppShell>
  );
}
