"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArchiveRestore,
  Archive,
  Check,
  Loader2,
  Pencil,
  Plus,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  createExpenseHeadAction,
  deleteExpenseHeadAction,
  renameExpenseHeadAction,
  setExpenseHeadArchivedAction,
} from "@/lib/actions/expenses";
import type { ExpenseHead } from "@/lib/queries/expenses";
import { cn } from "@/lib/utils";

/**
 * "Add Expense Head" trigger + popover.
 *
 * Two states per row:
 *   • Idle  — name + pencil/archive/delete actions
 *   • Edit  — inline name input, check / X to commit / abort
 *
 * Archiving (not deleting) is the soft default — archive preserves
 * historical expenses pointing at the head, where delete is only
 * available when no expense has ever referenced the row.
 */
export function ExpenseHeadManager({ heads }: { heads: ExpenseHead[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editDraft, setEditDraft] = React.useState("");
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);

  const active = heads.filter((h) => !h.archived);
  const archived = heads.filter((h) => h.archived);

  async function create() {
    const value = newName.trim();
    if (!value || creating) return;
    setCreating(true);
    try {
      const result = await createExpenseHeadAction(value);
      if (!result.ok) {
        toast.error("Couldn't add head", { description: result.error });
        return;
      }
      toast.success(`${result.name} added`);
      setNewName("");
      router.refresh();
    } finally {
      setCreating(false);
    }
  }

  function startEdit(head: ExpenseHead) {
    setEditingId(head.id);
    setEditDraft(head.name);
  }

  async function commitEdit() {
    if (!editingId) return;
    const value = editDraft.trim();
    if (!value) {
      setEditingId(null);
      return;
    }
    setBusyId(editingId);
    try {
      const result = await renameExpenseHeadAction(editingId, value);
      if (!result.ok) {
        toast.error("Couldn't rename head", { description: result.error });
        return;
      }
      toast.success("Renamed");
      setEditingId(null);
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function toggleArchive(head: ExpenseHead) {
    setBusyId(head.id);
    try {
      const result = await setExpenseHeadArchivedAction(head.id, !head.archived);
      if (!result.ok) {
        toast.error("Couldn't update head", { description: result.error });
        return;
      }
      toast.success(head.archived ? "Restored" : "Archived");
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(head: ExpenseHead) {
    if (head.expenseCount > 0) {
      toast.error("Used by existing expenses — archive instead.");
      return;
    }
    setBusyId(head.id);
    try {
      const result = await deleteExpenseHeadAction(head.id);
      if (!result.ok) {
        toast.error("Couldn't delete head", { description: result.error });
        return;
      }
      toast.success("Deleted");
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-md text-[12.5px]"
        >
          <Plus className="size-3.5" />
          Add Expense Head
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[320px] gap-0 p-0"
        sideOffset={8}
      >
        <div className="border-b px-3 py-2">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Expense head manager
          </p>
        </div>

        <div className="border-b p-2">
          <div className="flex items-center gap-1.5">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void create();
                }
              }}
              placeholder="New head (e.g. Rent)"
              className="h-9 text-[12.5px]"
              maxLength={60}
            />
            <Button
              type="button"
              size="sm"
              className="h-9 rounded-md px-3 text-[12px]"
              disabled={!newName.trim() || creating}
              onClick={create}
            >
              {creating ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Plus className="size-3.5" />
              )}
              Add
            </Button>
          </div>
        </div>

        <HeadList
          title="Active"
          heads={active}
          editingId={editingId}
          editDraft={editDraft}
          busyId={busyId}
          onStartEdit={startEdit}
          onEditDraft={setEditDraft}
          onCommitEdit={commitEdit}
          onCancelEdit={() => setEditingId(null)}
          onArchive={toggleArchive}
          onDelete={remove}
        />

        {archived.length > 0 ? (
          <HeadList
            title="Archived"
            heads={archived}
            editingId={editingId}
            editDraft={editDraft}
            busyId={busyId}
            onStartEdit={startEdit}
            onEditDraft={setEditDraft}
            onCommitEdit={commitEdit}
            onCancelEdit={() => setEditingId(null)}
            onArchive={toggleArchive}
            onDelete={remove}
            dim
          />
        ) : null}
      </PopoverContent>
    </Popover>
  );
}

function HeadList({
  title,
  heads,
  editingId,
  editDraft,
  busyId,
  onStartEdit,
  onEditDraft,
  onCommitEdit,
  onCancelEdit,
  onArchive,
  onDelete,
  dim,
}: {
  title: string;
  heads: ExpenseHead[];
  editingId: string | null;
  editDraft: string;
  busyId: string | null;
  onStartEdit: (h: ExpenseHead) => void;
  onEditDraft: (v: string) => void;
  onCommitEdit: () => void;
  onCancelEdit: () => void;
  onArchive: (h: ExpenseHead) => void;
  onDelete: (h: ExpenseHead) => void;
  dim?: boolean;
}) {
  if (heads.length === 0) return null;
  return (
    <div className={cn("p-2", dim && "opacity-75")}>
      <div className="mb-1 flex items-center justify-between px-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {title}
        </p>
        <span className="text-[10px] tabular-nums text-muted-foreground">
          {heads.length}
        </span>
      </div>
      <ul className="space-y-0.5">
        {heads.map((h) => {
          const isEditing = editingId === h.id;
          const isBusy = busyId === h.id;
          return (
            <li
              key={h.id}
              className="group flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-muted/60"
            >
              <Tag className="size-3.5 text-primary" />
              {isEditing ? (
                <>
                  <Input
                    autoFocus
                    value={editDraft}
                    onChange={(e) => onEditDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        onCommitEdit();
                      }
                      if (e.key === "Escape") {
                        e.preventDefault();
                        onCancelEdit();
                      }
                    }}
                    maxLength={60}
                    className="h-7 flex-1 text-[12.5px]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-7 rounded-md text-success hover:bg-success/10"
                    onClick={onCommitEdit}
                    disabled={isBusy}
                    aria-label="Save"
                  >
                    {isBusy ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Check className="size-3.5" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-7 rounded-md text-muted-foreground"
                    onClick={onCancelEdit}
                    disabled={isBusy}
                    aria-label="Cancel"
                  >
                    <X className="size-3.5" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 truncate text-[12.5px] font-medium">
                    {h.name}
                  </span>
                  {h.expenseCount > 0 ? (
                    <span className="text-[10px] tabular-nums text-muted-foreground">
                      {h.expenseCount}
                    </span>
                  ) : null}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-7 rounded-md text-muted-foreground hover:text-foreground"
                    onClick={() => onStartEdit(h)}
                    disabled={isBusy}
                    aria-label="Rename"
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-7 rounded-md text-muted-foreground hover:text-foreground"
                    onClick={() => onArchive(h)}
                    disabled={isBusy}
                    aria-label={h.archived ? "Restore" : "Archive"}
                  >
                    {h.archived ? (
                      <ArchiveRestore className="size-3.5" />
                    ) : (
                      <Archive className="size-3.5" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className={cn(
                      "size-7 rounded-md",
                      h.expenseCount > 0
                        ? "text-muted-foreground/40"
                        : "text-muted-foreground hover:text-destructive",
                    )}
                    onClick={() => onDelete(h)}
                    disabled={isBusy || h.expenseCount > 0}
                    title={
                      h.expenseCount > 0
                        ? `Used by ${h.expenseCount} expense${h.expenseCount === 1 ? "" : "s"} — archive instead`
                        : undefined
                    }
                    aria-label="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
