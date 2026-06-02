import { BottomNav } from "@/components/ui/BottomNav";
import { Sidebar } from "@/components/ui/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <main className="md:ml-60 pb-20 md:pb-0 min-h-screen">{children}</main>
      <BottomNav />
    </>
  );
}
