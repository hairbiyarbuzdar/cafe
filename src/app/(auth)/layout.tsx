import { AmbientBackground } from "@/components/shared/ambient-background";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <AmbientBackground />
      <main className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        {children}
      </main>
    </div>
  );
}
