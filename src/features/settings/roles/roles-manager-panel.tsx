"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import {
  createRoleAction,
  deleteRoleAction,
  updateRoleAction,
} from "@/lib/actions/roles";
import type { Role } from "@/lib/queries/roles";
import type { Permission } from "@/types/auth";

const PERMISSION_GROUPS: {
  label: string;
  permissions: { id: Permission; label: string; hint?: string }[];
}[] = [
  {
    label: "POS & orders",
    permissions: [
      { id: "pos.access", label: "Use POS" },
      { id: "orders.view", label: "View orders" },
      { id: "orders.refund", label: "Refund orders" },
      { id: "orders.cancel", label: "Cancel held orders" },
    ],
  },
  {
    label: "Menu & inventory",
    permissions: [
      { id: "menu.view", label: "View menu" },
      { id: "menu.edit", label: "Edit menu" },
      { id: "inventory.view", label: "View inventory" },
      { id: "inventory.edit", label: "Edit inventory" },
    ],
  },
  {
    label: "Reports & operations",
    permissions: [
      { id: "reports.view", label: "View reports" },
      { id: "dashboard.view", label: "View dashboard" },
      { id: "kitchen.view", label: "Open kitchen display" },
    ],
  },
  {
    label: "Expenses",
    permissions: [
      {
        id: "expenses.view",
        label: "View expenses",
        hint: "See spending against payment methods",
      },
      {
        id: "expenses.edit",
        label: "Record / manage expenses",
        hint: "Add expense heads and record new expenses",
      },
    ],
  },
  {
    label: "Staff & settings",
    permissions: [
      { id: "staff.view", label: "View staff" },
      { id: "staff.edit", label: "Edit staff" },
      { id: "settings.view", label: "View settings" },
      { id: "settings.edit", label: "Edit settings" },
    ],
  },
];

const ROUTE_OPTIONS: { value: string; label: string }[] = [
  { value: "default", label: "Use /pos as default" },
  { value: "/pos", label: "Point of Sale" },
  { value: "/dashboard", label: "Dashboard" },
  { value: "/kitchen", label: "Kitchen display" },
  { value: "/orders", label: "Orders" },
  { value: "/menu", label: "Menu" },
  { value: "/inventory", label: "Inventory" },
  { value: "/reports", label: "Reports" },
  { value: "/expenses", label: "Expenses" },
  { value: "/staff", label: "Staff" },
  { value: "/settings", label: "Settings" },
];

export function RolesManagerPanel({ roles }: { roles: Role[] }) {
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Role | null>(null);
  const [deleting, setDeleting] = React.useState<Role | null>(null);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(role: Role) {
    setEditing(role);
    setOpen(true);
  }

  return (
    <div className="space-y-4">
      <SectionCard
        title="Roles & permissions"
        description="Built-in roles ship with sensible defaults. Add custom roles for cooks-with-inventory, owner-mode, or anything else your café needs."
        action={
          <Button
            type="button"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={openCreate}
          >
            <Plus className="size-3.5" />
            Add role
          </Button>
        }
        contentClassName="p-0"
      >
        <ul className="divide-y">
          {roles.map((r) => (
            <RoleRow
              key={r.id}
              role={r}
              onEdit={() => openEdit(r)}
              onDelete={() => setDeleting(r)}
            />
          ))}
        </ul>
      </SectionCard>

      <RoleFormDialog
        open={open}
        onOpenChange={setOpen}
        role={editing}
      />
      <DeleteRoleDialog
        role={deleting}
        onOpenChange={(o) => {
          if (!o) setDeleting(null);
        }}
      />
    </div>
  );
}

function RoleRow({
  role,
  onEdit,
  onDelete,
}: {
  role: Role;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const grantedCount = role.permissions.length;
  return (
    <li className="flex items-start gap-3 px-4 py-3 md:px-5">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <ShieldCheck className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="truncate text-[13.5px] font-semibold text-foreground">
            {role.name}
          </p>
          {role.isSystem ? (
            <Badge
              variant="outline"
              className="rounded-md border-primary/30 text-[10.5px] font-normal text-primary"
            >
              Built-in
            </Badge>
          ) : null}
          <Badge
            variant="outline"
            className="rounded-md font-mono text-[10.5px] font-normal text-muted-foreground"
          >
            {role.id}
          </Badge>
        </div>
        {role.description ? (
          <p className="mt-0.5 line-clamp-2 text-[12px] text-muted-foreground">
            {role.description}
          </p>
        ) : null}
        <p className="mt-1 text-[11.5px] text-muted-foreground">
          {grantedCount} permission{grantedCount === 1 ? "" : "s"} ·{" "}
          {role.userCount} member{role.userCount === 1 ? "" : "s"}
          {role.defaultRoute ? ` · lands on ${role.defaultRoute}` : ""}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={onEdit}
          aria-label={`Edit ${role.name}`}
          className="size-8 rounded-md"
        >
          <Pencil className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={onDelete}
          disabled={role.isSystem}
          aria-label={`Delete ${role.name}`}
          title={
            role.isSystem
              ? "Built-in roles can't be deleted"
              : `Delete ${role.name}`
          }
          className="size-8 rounded-md text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </li>
  );
}

function RoleFormDialog({
  open,
  onOpenChange,
  role,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
}) {
  const router = useRouter();
  const isEdit = !!role;
  const isAdmin = role?.id === "admin";

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [defaultRoute, setDefaultRoute] = React.useState("default");
  const [permissions, setPermissions] = React.useState<Set<Permission>>(
    new Set(),
  );
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setName(role?.name ?? "");
    setDescription(role?.description ?? "");
    setDefaultRoute(role?.defaultRoute ?? "default");
    setPermissions(new Set(role?.permissions ?? []));
  }, [open, role]);

  function togglePermission(p: Permission, on: boolean) {
    setPermissions((prev) => {
      const next = new Set(prev);
      if (on) next.add(p);
      else next.delete(p);
      return next;
    });
  }

  const canSave =
    name.trim().length >= 2 && permissions.size > 0 && !submitting;

  async function save() {
    if (!canSave) return;
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        permissions: Array.from(permissions),
        defaultRoute: defaultRoute === "default" ? null : defaultRoute,
      };
      const result = isEdit
        ? await updateRoleAction({ id: role!.id, ...payload })
        : await createRoleAction(payload);
      if (!result.ok) {
        toast.error("Couldn't save role", { description: result.error });
        return;
      }
      toast.success(isEdit ? `${name.trim()} updated` : `${name.trim()} added`);
      onOpenChange(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] w-[min(640px,calc(100vw-1.5rem))] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-[640px]">
        <DialogHeader className="border-b px-5 pb-4 pt-5">
          <DialogTitle className="flex items-center gap-2 text-[16px] font-semibold tracking-tight">
            <ShieldCheck className="size-4 text-primary" />
            {isEdit ? `Edit ${role!.name}` : "Add role"}
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Pick the permissions this role grants. Members assigned to
            this role pick those permissions up on next sign-in.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 overflow-y-auto px-5 py-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="rl-name" className="text-[12px] font-medium">
              Name
            </Label>
            <Input
              id="rl-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Head chef, Owner"
              maxLength={40}
              className="h-10"
              disabled={role?.isSystem && isAdmin}
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="rl-default-route"
              className="text-[12px] font-medium"
            >
              Default landing route
            </Label>
            <Select value={defaultRoute} onValueChange={setDefaultRoute}>
              <SelectTrigger id="rl-default-route" className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROUTE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label
              htmlFor="rl-description"
              className="text-[12px] font-medium"
            >
              Description (optional)
            </Label>
            <Textarea
              id="rl-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="When does this role apply?"
              className="text-[13px]"
            />
          </div>

          <div className="space-y-3 sm:col-span-2">
            <div className="flex items-center justify-between">
              <Label className="text-[12px] font-medium">Permissions</Label>
              <span className="text-[11.5px] text-muted-foreground">
                {permissions.size} selected
              </span>
            </div>
            {isAdmin ? (
              <p className="rounded-md border border-primary/20 bg-primary/8 px-3 py-2 text-[11.5px] text-primary">
                The Administrator role always has every permission. The
                checkboxes are read-only.
              </p>
            ) : null}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PERMISSION_GROUPS.map((g) => (
                <fieldset
                  key={g.label}
                  className="space-y-1.5 rounded-md border bg-card/40 px-3 py-2"
                >
                  <legend className="px-1 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                    {g.label}
                  </legend>
                  {g.permissions.map((p) => {
                    const checked = isAdmin ? true : permissions.has(p.id);
                    return (
                      <label
                        key={p.id}
                        className="flex cursor-pointer items-center gap-2 py-1 text-[12.5px] text-foreground"
                      >
                        <Checkbox
                          checked={checked}
                          disabled={isAdmin}
                          onCheckedChange={(v) =>
                            togglePermission(p.id, v === true)
                          }
                        />
                        <span>{p.label}</span>
                      </label>
                    );
                  })}
                </fieldset>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-2 border-t bg-surface-1 px-5 py-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={save}
            disabled={!canSave}
          >
            {submitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Saving…
              </>
            ) : isEdit ? (
              "Save changes"
            ) : (
              "Add role"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteRoleDialog({
  role,
  onOpenChange,
}: {
  role: Role | null;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  async function remove() {
    if (!role || submitting) return;
    setSubmitting(true);
    try {
      const result = await deleteRoleAction(role.id);
      if (!result.ok) {
        toast.error("Couldn't delete role", { description: result.error });
        return;
      }
      toast.success(`${role.name} removed`);
      onOpenChange(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={!!role} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Delete {role?.name}?
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            This removes the role permanently. Members who hold it must
            be reassigned first or the delete will be refused.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-2 gap-2 border-t bg-surface-1 px-5 py-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={remove}
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
                Delete role
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
