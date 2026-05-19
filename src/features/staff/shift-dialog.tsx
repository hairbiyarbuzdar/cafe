"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Calendar, Loader2, Trash2 } from "lucide-react";
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
  createShiftAction,
  deleteShiftAction,
  updateShiftAction,
  type ShiftStatus,
} from "@/lib/actions/shifts";
import type { ScheduleShift } from "@/lib/queries/schedule";
import type { SessionUser } from "@/types/auth";

const STATUSES: { value: ShiftStatus; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "missed", label: "Missed" },
];

export type ShiftDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: SessionUser[];
  /** Existing shift to edit; null = create-new. */
  shift?: ScheduleShift | null;
  /** Defaults when creating. */
  defaultUserId?: string;
  defaultDate?: string;
};

export function ShiftDialog({
  open,
  onOpenChange,
  members,
  shift,
  defaultUserId,
  defaultDate,
}: ShiftDialogProps) {
  const router = useRouter();
  const isEdit = !!shift;

  const [userId, setUserId] = React.useState(
    shift?.userId ?? defaultUserId ?? members[0]?.id ?? "",
  );
  const [date, setDate] = React.useState(
    shift?.date ?? defaultDate ?? today(),
  );
  const [start, setStart] = React.useState(shift?.start ?? "09:00");
  const [end, setEnd] = React.useState(shift?.end ?? "17:00");
  const [status, setStatus] = React.useState<ShiftStatus>(
    shift?.status ?? "scheduled",
  );
  const [notes, setNotes] = React.useState(shift?.notes ?? "");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setUserId(shift?.userId ?? defaultUserId ?? members[0]?.id ?? "");
    setDate(shift?.date ?? defaultDate ?? today());
    setStart(shift?.start ?? "09:00");
    setEnd(shift?.end ?? "17:00");
    setStatus(shift?.status ?? "scheduled");
    setNotes(shift?.notes ?? "");
  }, [open, shift, defaultUserId, defaultDate, members]);

  const canSave =
    !!userId &&
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    /^([01]?\d|2[0-3]):([0-5]\d)$/.test(start) &&
    /^([01]?\d|2[0-3]):([0-5]\d)$/.test(end);

  async function save() {
    if (!canSave || submitting) return;
    setSubmitting(true);
    try {
      const result = isEdit
        ? await updateShiftAction({
            id: shift!.id,
            date,
            start,
            end,
            status,
            notes: notes.trim() || null,
          })
        : await createShiftAction({
            userId,
            date,
            start,
            end,
            status,
            notes: notes.trim() || null,
          });
      if (!result.ok) {
        toast.error("Couldn't save shift", { description: result.error });
        return;
      }
      toast.success(isEdit ? "Shift updated" : "Shift added");
      onOpenChange(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function remove() {
    if (!shift || submitting) return;
    setSubmitting(true);
    try {
      const result = await deleteShiftAction(shift.id);
      if (!result.ok) {
        toast.error("Couldn't delete shift", { description: result.error });
        return;
      }
      toast.success("Shift removed");
      onOpenChange(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <Calendar className="size-4 text-primary" />
            {isEdit ? "Edit shift" : "Add shift"}
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            {isEdit
              ? "Update timing, status, or notes. Deleting removes it from the schedule."
              : "Pick the team member and the start/end times. The schedule grid updates on save."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3.5 px-5 pb-1 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="sh-user" className="text-[12px] font-medium">
              Team member
            </Label>
            <Select
              value={userId}
              onValueChange={setUserId}
              disabled={isEdit}
            >
              <SelectTrigger id="sh-user" className="h-10">
                <SelectValue placeholder="Pick a member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isEdit ? (
              <p className="text-[11px] text-muted-foreground">
                Move shifts by deleting + re-creating on the new member.
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sh-date" className="text-[12px] font-medium">
              Date
            </Label>
            <Input
              id="sh-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 tabular-nums"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sh-status" className="text-[12px] font-medium">
              Status
            </Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as ShiftStatus)}
            >
              <SelectTrigger id="sh-status" className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sh-start" className="text-[12px] font-medium">
              Start
            </Label>
            <Input
              id="sh-start"
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="h-10 tabular-nums"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sh-end" className="text-[12px] font-medium">
              End
            </Label>
            <Input
              id="sh-end"
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="h-10 tabular-nums"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="sh-notes" className="text-[12px] font-medium">
              Notes (optional)
            </Label>
            <Textarea
              id="sh-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Coverage, training, …"
              className="text-[13px]"
            />
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between gap-2 border-t bg-surface-1 px-5 py-3 sm:flex-row">
          {isEdit ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 rounded-md text-[12.5px] text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={remove}
              disabled={submitting}
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
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
              onClick={save}
              disabled={!canSave || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving…
                </>
              ) : isEdit ? (
                "Save changes"
              ) : (
                "Add shift"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function today(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}
