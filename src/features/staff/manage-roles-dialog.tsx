"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/hooks/use-current-user";
import { updateUserRoleAction } from "@/lib/actions/users";
import { initials } from "@/lib/utils";
import type { SessionUser } from "@/types/auth";

type RoleOption = { id: string; name: string };

export function ManageRolesDialog({
  users,
  roles,
  trigger,
}: {
  users: SessionUser[];
  roles: RoleOption[];
  trigger?: React.ReactNode;
}) {
  const router = useRouter();
  const me = useCurrentUser();
  const [open, setOpen] = React.useState(false);
  const [drafts, setDrafts] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setDrafts(Object.fromEntries(users.map((u) => [u.id, u.role])));
  }, [open, users]);

  const changed = users.filter((u) => drafts[u.id] && drafts[u.id] !== u.role);

  async function handleSave() {
    if (changed.length === 0 || submitting) return;
    setSubmitting(true);

    let ok = 0;
    const errors: string[] = [];
    for (const u of changed) {
      const result = await updateUserRoleAction(u.id, drafts[u.id]);
      if (result.ok) ok++;
      else errors.push(`${u.name}: ${result.error}`);
    }

    setSubmitting(false);

    if (errors.length === 0) {
      toast.success(`Updated ${ok} role${ok === 1 ? "" : "s"}`);
      setOpen(false);
      router.refresh();
    } else {
      toast.error(
        ok > 0
          ? `Updated ${ok}, ${errors.length} failed`
          : "Couldn't update roles",
        { description: errors.slice(0, 2).join(" · ") },
      );
      router.refresh();
    }
  }

  const defaultTrigger = (
    <Button variant="ghost" size="xs" className="text-[11.5px]">
      Manage roles
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-[500px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Manage roles
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Update each member&apos;s default permissions. Demoting the
            last admin is blocked so the workspace stays manageable.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] px-5">
          <ul className="divide-y">
            {users.map((u) => {
              const draft = drafts[u.id] ?? u.role;
              const isMe = me?.id === u.id;
              const dirty = draft !== u.role;
              return (
                <li key={u.id} className="flex items-center gap-3 py-2.5">
                  <span className="flex size-9 items-center justify-center rounded-md bg-gradient-to-br from-primary/15 to-primary/10 text-[12px] font-semibold text-primary">
                    {initials(u.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">
                      {u.name}
                      {isMe ? (
                        <span className="ms-1 text-[10.5px] text-muted-foreground">
                          (you)
                        </span>
                      ) : null}
                    </p>
                    <p className="truncate text-[11.5px] text-muted-foreground">
                      {u.email}
                    </p>
                  </div>
                  <Select
                    value={draft}
                    onValueChange={(v) =>
                      setDrafts((d) => ({ ...d, [u.id]: v }))
                    }
                  >
                    <SelectTrigger
                      size="sm"
                      className="h-9 w-[160px] rounded-md text-[12.5px]"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {dirty ? (
                    <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                  ) : (
                    <span className="size-1.5" aria-hidden />
                  )}
                </li>
              );
            })}
          </ul>
        </ScrollArea>

        <DialogFooter className="flex flex-row items-center justify-between gap-2 border-t bg-surface-1 px-5 py-3">
          <p className="inline-flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
            <ShieldCheck className="size-3.5" />
            {changed.length === 0
              ? "No changes"
              : `${changed.length} role${changed.length === 1 ? "" : "s"} to update`}
          </p>
          <div className="flex items-center gap-2">
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
              disabled={changed.length === 0 || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                <>Save changes</>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
