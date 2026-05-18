import type { AuthUser } from "@/types/auth";

/**
 * Demo credentials. The login screen lists these so anyone can try
 * each role in one click. Replace with a real users table in Phase 3.
 */
export const MOCK_USERS: AuthUser[] = [
  {
    id: "usr_elena",
    name: "Elena Volkova",
    email: "elena@brewline.co",
    role: "admin",
    password: "brewline",
  },
  {
    id: "usr_maya",
    name: "Maya Chen",
    email: "maya@brewline.co",
    role: "manager",
    password: "brewline",
  },
  {
    id: "usr_aisha",
    name: "Aisha Patel",
    email: "aisha@brewline.co",
    role: "cashier",
    password: "brewline",
  },
  {
    id: "usr_lukas",
    name: "Lukas Brandt",
    email: "lukas@brewline.co",
    role: "kitchen",
    password: "brewline",
  },
];

export function findUserById(id: string | undefined | null): AuthUser | null {
  if (!id) return null;
  return MOCK_USERS.find((u) => u.id === id) ?? null;
}

export function findUserByCredentials(
  email: string,
  password: string,
): AuthUser | null {
  const e = email.trim().toLowerCase();
  return (
    MOCK_USERS.find((u) => u.email.toLowerCase() === e && u.password === password) ??
    null
  );
}
