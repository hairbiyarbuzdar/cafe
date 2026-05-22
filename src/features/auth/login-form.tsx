"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Coffee, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAND } from "@/constants/nav";
import { demoSignInAction, signInAction } from "@/lib/actions/auth";
import { ROLE_LABEL, homeFor } from "@/lib/permissions";
import { useAuth } from "@/store/auth-store";
import type { SessionUser } from "@/types/auth";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");

  const setUser = useAuth((s) => s.setUser);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  function navigateAfterSignIn(user: SessionUser) {
    const destination =
      next && !next.startsWith("/login") && !next.startsWith("/onboarding")
        ? next
        : homeFor(user);
    router.replace(destination);
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await signInAction(email, password);
      if (!result.ok) {
        toast.error("Invalid credentials", {
          description: result.error,
        });
        return;
      }
      setUser(result.user);
      toast.success(`Welcome back, ${result.user.name.split(" ")[0]}`);
      navigateAfterSignIn(result.user);
    } finally {
      setSubmitting(false);
    }
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
        </form>

        <div className="border-t border-border/70 px-6 py-4 text-center text-[12px] text-muted-foreground md:px-7">
          New to Cafe Management System?{" "}
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
