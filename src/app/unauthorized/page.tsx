import Link from "next/link";
import { Lock, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AmbientBackground } from "@/components/shared/ambient-background";
import { getCurrentUser } from "@/lib/auth";
import { ROLE_HOME, ROLE_LABEL } from "@/lib/permissions";

export const metadata = { title: "Access denied" };

type PageProps = {
  searchParams: Promise<{ from?: string }>;
};

export default async function UnauthorizedPage({ searchParams }: PageProps) {
  const { from } = await searchParams;
  const user = await getCurrentUser();
  const home = user ? ROLE_HOME[user.role] : "/login";

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-background px-4">
      <AmbientBackground />
      <div className="ring-highlight relative w-full max-w-[440px] rounded-2xl border border-border/70 bg-card p-7 shadow-elevated">
        <span className="flex size-11 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10 text-destructive">
          <Lock className="size-5" />
        </span>
        <h1 className="mt-5 text-[20px] font-semibold tracking-tight">
          You don&apos;t have access to that page
        </h1>
        <p className="mt-1.5 text-[13.5px] text-muted-foreground">
          {user ? (
            <>
              You&apos;re signed in as <strong className="text-foreground">{user.name}</strong>{" "}
              ({ROLE_LABEL[user.role]}). This area requires elevated permissions.
              {from ? (
                <>
                  {" "}Requested route: <code className="rounded bg-muted px-1.5 py-0.5 text-[11.5px]">{from}</code>
                </>
              ) : null}
            </>
          ) : (
            "Please sign in to continue."
          )}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Button asChild className="h-10 rounded-md text-[13px]">
            <Link href={home}>Go to {user ? "my workspace" : "sign in"}</Link>
          </Button>
          {user ? (
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-md text-[13px]"
            >
              <Link href="/login">
                <LogOut className="size-4" />
                Switch account
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
