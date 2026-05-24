import { Suspense } from "react";
import { redirect } from "next/navigation";

import { LoginForm } from "@/features/auth/login-form";
import { listPublicUsers } from "@/lib/queries/users";

export const metadata = { title: "Sign in" };

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const users = await listPublicUsers();
  if (users.length === 0) redirect("/onboarding");

  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
