"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Coffee, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BRAND } from "@/constants/nav";
import { ROLE_HOME, ROLE_LABEL } from "@/lib/permissions";
import { MOCK_USERS } from "@/mock/users";
import { useAuth } from "@/store/auth-store";
import { cn, initials } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");

  const signIn = useAuth((s) => s.signIn);
  const signInAs = useAuth((s) => s.signInAs);

  const [email, setEmail] = React.useState("elena@brewline.co");
  const [password, setPassword] = React.useState("brewline");
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  function navigateAfterSignIn(role: keyof typeof ROLE_HOME) {
    const destination =
      next && !next.startsWith("/login") && !next.startsWith("/onboarding")
        ? next
        : ROLE_HOME[role];
    router.replace(destination);
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 350));
      const user = signIn(email, password);
      if (!user) {
        toast.error("Invalid credentials", {
          description: "Try one of the demo accounts below.",
        });
        return;
      }
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      navigateAfterSignIn(user.role);
    } finally {
      setSubmitting(false);
    }
  }

  function handleDemoSignIn(userId: string) {
    const user = signInAs(userId);
    if (!user) return;
    toast.success(`Signed in as ${ROLE_LABEL[user.role]}`, {
      description: user.name,
    });
    navigateAfterSignIn(user.role);
  }

  return (
    <div className="w-full max-w-[440px]">
      <div className="ring-highlight rounded-2xl border border-border/70 bg-card shadow-elevated">
        <div className="border-b border-border/70 p-6 md:p-7">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-soft">
              <Coffee className="size-[18px]" strokeWidth={2} />
            </span>
            <span className="text-[14px] font-semibold tracking-tight">
              {BRAND.name}
            </span>
          </div>
          <h1 className="mt-5 text-[22px] font-semibold tracking-tight">
            Sign in to your café
          </h1>
          <p className="mt-1.5 text-[13.5px] text-muted-foreground">
            Welcome back. Enter your credentials below to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6 md:p-7">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px] font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@cafe.com"
              required
              className="h-10 text-[14px]"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[13px] font-medium">
                Password
              </Label>
              <Link
                href="#"
                className="text-[12px] text-muted-foreground transition-colors hover:text-foreground"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 pe-10 text-[14px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute end-0 top-0 flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="h-10 w-full rounded-md text-[13.5px] font-semibold"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>

          <div className="flex items-center gap-3 pt-2">
            <Separator className="flex-1" />
            <span className="text-[11.5px] uppercase tracking-[0.1em] text-muted-foreground">
              or try a demo role
            </span>
            <Separator className="flex-1" />
          </div>

          <ul className="grid grid-cols-1 gap-1.5">
            {MOCK_USERS.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => handleDemoSignIn(u.id)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-lg border border-border/70 bg-card p-2.5 text-left transition-all",
                    "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft",
                  )}
                >
                  <span className="flex size-9 items-center justify-center rounded-md bg-gradient-to-br from-primary/15 to-primary/8 text-[12px] font-semibold text-primary">
                    {initials(u.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium">{u.name}</p>
                    <p className="text-[11.5px] text-muted-foreground">
                      {ROLE_LABEL[u.role]} · {u.email}
                    </p>
                  </div>
                  <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </button>
              </li>
            ))}
          </ul>
        </form>

        <div className="border-t border-border/70 px-6 py-4 text-center text-[12px] text-muted-foreground md:px-7">
          New to Brewline?{" "}
          <Link
            href="/onboarding"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Set up your café
          </Link>
        </div>
      </div>
    </div>
  );
}
