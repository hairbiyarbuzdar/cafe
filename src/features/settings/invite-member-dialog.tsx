"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { invitePendingMemberAction } from "@/lib/actions/users";
import { ROLE_LABEL } from "@/lib/permissions";
import type { PendingMember } from "@/lib/queries/users";
import type { Role } from "@/types/auth";

const ROLES: Role[] = ["admin", "manager", "cashier", "kitchen"];

type Form = {
  pendingId: string;
  role: Role;
  password: string;
};

function emptyForm(pending: PendingMember[]): Form {
  return {
    pendingId: pending[0]?.id ?? "",
    role: "cashier",
    password: "",
  };
}

/**
 * Grant access to someone added on the Staff page. The "Full name"
 * dropdown is populated from the live `PendingMember` table; picking
 * one binds the role + password the operator chooses and turns the
 * draft into a real `User`.
 */
export function InviteMemberDialog({
  pending,
  trigger,
}: {
  pending: PendingMember[];
  trigger?: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<Form>(() => emptyForm(pending));
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setForm(emptyForm(pending));
    setShowPassword(false);
  }, [open, pending]);

  const selected = pending.find((p) => p.id === form.pendingId);
  const hasPending = pending.length > 0;
  const canSave =
    Boolean(form.pendingId) && form.password.length >= 6 && ROLES.includes(form.role);

  function patch<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!canSave || !selected || submitting) return;
    setSubmitting(true);
    try {
      const result = await invitePendingMemberAction({
        pendingId: form.pendingId,
        role: form.role,
        password: form.password,
      });
      if (!result.ok) {
        toast.error("Couldn't invite", { description: result.error });
        return;
      }
      toast.success(`${result.user.name} can now sign in`, {
        description: `${ROLE_LABEL[result.user.role]} · ${result.user.email}`,
      });
      setOpen(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  const defaultTrigger = (
    <Button size="sm" className="h-9 rounded-md text-[12.5px]">
      Invite
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-[440px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Invite team member
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Pick someone added from the Staff page and grant them
            sign-in access. They&apos;ll show up in the members list
            immediately once invited.
          </DialogDescription>
        </DialogHeader>

        {hasPending ? (
          <div className="space-y-3.5 px-5 pb-1">
            <Field label="Full name" htmlFor="iv-pending">
              <Select
                value={form.pendingId}
                onValueChange={(v) => patch("pendingId", v)}
              >
                <SelectTrigger id="iv-pending" className="h-10">
                  <SelectValue placeholder="Pick a pending member" />
                </SelectTrigger>
                <SelectContent>
                  {pending.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}{" "}
                      <span className="text-muted-foreground">· {p.email}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Role">
              <Select
                value={form.role}
                onValueChange={(v) => patch("role", v as Role)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {ROLE_LABEL[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Temporary password" htmlFor="iv-pw">
              <div className="relative">
                <Input
                  id="iv-pw"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => patch("password", e.target.value)}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  className="h-10 pe-10"
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
            </Field>

            {selected ? (
              <p className="rounded-md border bg-muted/30 px-3 py-2 text-[11.5px] text-muted-foreground">
                Share credentials with{" "}
                <span className="text-foreground">{selected.email}</span>{" "}
                privately. They can change the password after first sign-in.
              </p>
            ) : null}
          </div>
        ) : (
          <div className="mx-5 mb-1 flex items-start gap-2.5 rounded-md border border-dashed bg-muted/30 p-4 text-[12.5px] text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p>
              No one is waiting to be invited. Add a member from{" "}
              <span className="font-medium text-foreground">Staff → Add member</span>{" "}
              first; they&apos;ll appear here.
            </p>
          </div>
        )}

        <DialogFooter className="grid grid-cols-2 gap-2 border-t bg-surface-1 px-5 py-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={handleSave}
            disabled={!canSave || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Inviting…
              </>
            ) : (
              <>Send invite</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-[12px] font-medium">
        {label}
      </Label>
      {children}
    </div>
  );
}
