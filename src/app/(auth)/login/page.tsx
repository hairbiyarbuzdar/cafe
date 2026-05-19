import { Suspense } from "react";
import { redirect } from "next/navigation";

import { LoginForm } from "@/features/auth/login-form";
import { listPublicUsers } from "@/lib/queries/users";

export const metadata = { title: "Sign in" };

// Demo roster lives in the DB now; rendering the login page touches
// Postgres, so opt into Node runtime and disable static caching.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const demoUsers = await listPublicUsers();
  if (demoUsers.length === 0) redirect("/onboarding");

  return (
    <Suspense fallback={null}>
      <LoginForm demoUsers={demoUsers} />
    </Suspense>
  );
}
