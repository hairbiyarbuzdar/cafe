import { Suspense } from "react";

import { LoginForm } from "@/features/auth/login-form";
import { listPublicUsers } from "@/lib/queries/users";

export const metadata = { title: "Sign in" };

// Demo roster lives in the DB now; rendering the login page touches
// Postgres, so opt into Node runtime and disable static caching.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const demoUsers = await listPublicUsers();

  return (
    <Suspense fallback={null}>
      <LoginForm demoUsers={demoUsers} />
    </Suspense>
  );
}
