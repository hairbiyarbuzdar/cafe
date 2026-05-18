"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";
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
import { createPendingMemberAction } from "@/lib/actions/users";

type Form = { name: string; email: string };

/**
 * Adds a teammate without granting them access. The Settings → Team
 * panel picks up the draft and turns it into a real user (with role
 * + password) via the invite flow.
 */
export function AddMemberDialog({ trigger }: { trigger?: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<Form>({ name: "", email: "" });
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) setForm({ name: "", email: "" });
  }, [open]);

  const canSave =
    form.name.trim().length > 1 &&
    /^\S+@\S+\.\S+$/.test(form.email.trim());

  function patch<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!canSave || submitting) return;
    setSubmitting(true);
    try {
      const result = await createPendingMemberAction({
        name: form.name.trim(),
        email: form.email.trim(),
      });
      if (!result.ok) {
        toast.error("Couldn't add member", { description: result.error });
        return;
      }
      toast.success(`${form.name.trim()} added`, {
        description:
          "Assign a role and password from Settings → Team & permissions to grant access.",
      });
      setOpen(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  const defaultTrigger = (
    <Button size="sm" className="h-8 rounded-md text-[12.5px]">
      <UserPlus className="size-3.5" />
      Add member
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-[420px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Add team member
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Capture who&apos;s joining. They&apos;ll appear in the invite
            list under Settings → Team & permissions, where an admin
            assigns the role and sets a password.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 px-5 pb-1">
          <Field label="Full name" htmlFor="m-name">
            <Input
              id="m-name"
              value={form.name}
              onChange={(e) => patch("name", e.target.value)}
              placeholder="e.g. Hana Sato"
              autoComplete="off"
              className="h-10"
            />
          </Field>
          <Field label="Email" htmlFor="m-email">
            <Input
              id="m-email"
              type="email"
              value={form.email}
              onChange={(e) => patch("email", e.target.value)}
              placeholder="hana@brewline.co"
              autoComplete="off"
              className="h-10"
            />
          </Field>
        </div>

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
                Adding…
              </>
            ) : (
              <>
                <UserPlus className="size-3.5" />
                Add member
              </>
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
