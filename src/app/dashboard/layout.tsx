import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { LevelUpModal } from "@/components/gamification/LevelUpModal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen relative bg-background w-full">
      <Sidebar />
      <TopBar />
      <main className="md:ml-64 p-6 overflow-x-hidden min-h-[calc(100vh-4rem)] relative">
        {/* Ambient background glow inside dashboard */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto h-full relative z-10 w-full">
            {children}
        </div>
      </main>
      <LevelUpModal />
    </div>
  );
}
