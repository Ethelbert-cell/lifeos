import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { LevelUpModal } from "@/components/gamification/LevelUpModal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <>
      <Sidebar />
      <DashboardShell>
        {children}
      </DashboardShell>
      <LevelUpModal />
    </>
  );
}
