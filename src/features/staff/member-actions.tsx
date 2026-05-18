"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { removeMemberAction, updateMemberAction } from "@/lib/actions/users";

export type MemberRef = {
  id: string;
  type: "user" | "pending";
  name: string;
  email: string;
};

/**
 * Per-card menu — opens an edit or remove dialog targeting either a
 * live user or a pending draft. Same shape for both since the action
 * layer routes by `type`.
 */
export function MemberActionsMenu({ member }: { member: MemberRef }) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [removeOpen, setRemoveOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-8 rounded-md text-muted-foreground hover:text-foreground"
            aria-label={`Actions for ${member.name}`}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil className="size-3.5" />
            Edit details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setRemoveOpen(true)}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <Trash2 className="size-3.5" />
            Remove member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditMemberDialog
        member={member}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <RemoveMemberDialog
        member={member}
        open={removeOpen}
        onOpenChange={setRemoveOpen}
      />
    </>
  );
}

function EditMemberDialog({
  member,
  open,
  onOpenChange,
}: {
  member: MemberRef;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [name, setName] = React.useState(member.name);
  const [email, setEmail] = React.useState(member.email);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName(member.name);
      setEmail(member.email);
    }
  }, [open, member]);

  const canSave =
    name.trim().length > 1 &&
    /^\S+@\S+\.\S+$/.test(email.trim()) &&
    (name.trim() !== member.name || email.trim() !== member.email);

  async function handleSave() {
    if (!canSave || submitting) return;
    setSubmitting(true);
    try {
      const result = await updateMemberAction({
        id: member.id,
        type: member.type,
        name: name.trim(),
        email: email.trim(),
      });
      if (!result.ok) {
        toast.error("Couldn't save", { description: result.error });
        return;
      }
      toast.success(`${name.trim()} updated`);
      onOpenChange(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Edit member
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Update the member&apos;s name or email. Role changes happen
            via Manage roles.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 px-5 pb-1">
          <div className="space-y-1.5">
            <Label htmlFor="em-name" className="text-[12px] font-medium">
              Full name
            </Label>
            <Input
              id="em-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="em-email" className="text-[12px] font-medium">
              Email
            </Label>
            <Input
              id="em-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10"
            />
          </div>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-2 border-t bg-surface-1 px-5 py-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={() => onOpenChange(false)}
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
                Saving…
              </>
            ) : (
              <>Save</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RemoveMemberDialog({
  member,
  open,
  onOpenChange,
}: {
  member: MemberRef;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  async function handleRemove() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await removeMemberAction(member.id, member.type);
      if (!result.ok) {
        toast.error("Couldn't remove", { description: result.error });
        return;
      }
      toast.success(
        member.type === "pending"
          ? `Removed pending invite for ${member.name}`
          : `${member.name} removed from team`,
      );
      onOpenChange(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Remove {member.name}?
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            {member.type === "user"
              ? "They'll lose access immediately. Past orders they worked on stay intact — the staff name on those records is just blanked out."
              : "This pending invite will be deleted. You can add them again from the Staff page anytime."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-2 gap-2 border-t bg-surface-1 px-5 py-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={handleRemove}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Removing…
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                Remove
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
