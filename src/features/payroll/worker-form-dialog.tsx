"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Briefcase,
  CalendarDays,
  Clock,
  Loader2,
  Lock,
  Mail,
  Phone,
  UserPlus,
  Wallet,
} from "lucide-react";
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
import { NumericInput, PhoneInput } from "@/components/ui/numeric-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerWorkerAction, updateWorkerAction } from "@/lib/actions/payroll";
import type { PayrollRow } from "@/lib/queries/payroll";

type RoleOption = { id: string; name: string };

type Form = {
  name: string;
  email: string;
  role: string;
  phone: string;
  salary: string;
  overtimeRate: string;
  workingDays: string;
  active: boolean;
  password: string;
};

function initial(worker: PayrollRow | null, roles: RoleOption[]): Form {
  return {
    name: worker?.name ?? "",
    email: worker?.email ?? "",
    role: worker?.role ?? roles[0]?.id ?? "",
    phone: worker?.phone ?? "",
    salary: worker ? String(worker.salary) : "",
    overtimeRate: worker?.overtimeRate ? String(worker.overtimeRate) : "",
    workingDays: worker ? String(worker.standardWorkingDays) : "26",
    active: worker ? worker.active : true,
    password: "",
  };
}

export function WorkerFormDialog({
  open,
  onOpenChange,
  worker,
  roles,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Edit when set, register when null. */
  worker: PayrollRow | null;
  roles: RoleOption[];
}) {
  const router = useRouter();
  const isEdit = Boolean(worker);
  const [form, setForm] = React.useState<Form>(() => initial(worker, roles));
  const [submitting, setSubmitting] = React.useState(false);

  const phoneTrimmed = form.phone.trim();
  const phoneOk =
    phoneTrimmed === "" || /^[0-9+\-\s()]{7,20}$/.test(phoneTrimmed);
  const canSave =
    form.name.trim().length > 1 &&
    /^\S+@\S+\.\S+$/.test(form.email.trim()) &&
    Boolean(form.role) &&
    Number(form.salary) >= 0 &&
    form.salary.trim() !== "" &&
    phoneOk;

  function patch<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!canSave || submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        role: form.role,
        monthlySalary: Number(form.salary) || 0,
        overtimeRate: form.overtimeRate.trim()
          ? Number(form.overtimeRate)
          : null,
        standardWorkingDays: Number(form.workingDays) || 26,
        active: form.active,
        password: form.password.trim() || null,
      };
      const result =
        isEdit && worker
          ? await updateWorkerAction(worker.id, payload)
          : await registerWorkerAction(payload);
      if (!result.ok) {
        toast.error(isEdit ? "Couldn't update worker" : "Couldn't register", {
          description: result.error,
        });
        return;
      }
      toast.success(isEdit ? `${form.name.trim()} updated` : `${form.name.trim()} registered`);
      onOpenChange(false);
      requestAnimationFrame(() => router.refresh());
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] gap-4 rounded-lg p-0">
        <DialogHeader className="flex-row items-start gap-3 px-5 pt-5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
            <UserPlus className="size-4.5" />
          </span>
          <div>
            <DialogTitle className="text-[15px] font-semibold tracking-tight">
              {isEdit ? "Edit Worker Details" : "Register New Worker"}
            </DialogTitle>
            <DialogDescription className="text-[12.5px]">
              Set up employee profile and default pay configurations.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-3.5 px-5 pb-1">
          <FieldLabel>Full name *</FieldLabel>
          <IconInput
            icon={UserPlus}
            value={form.name}
            onChange={(v) => patch("name", v)}
            placeholder="e.g. Zulfiqar"
          />

          <FieldLabel>Email *</FieldLabel>
          <IconInput
            icon={Mail}
            type="email"
            value={form.email}
            onChange={(v) => patch("email", v)}
            placeholder="name@cafe.co"
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <FieldLabel>Role / Position</FieldLabel>
              <Select value={form.role} onValueChange={(v) => patch("role", v)}>
                <SelectTrigger className="h-10 w-full text-[13px]">
                  <span className="flex items-center gap-2">
                    <Briefcase className="size-4 text-muted-foreground" />
                    <SelectValue placeholder="Role" />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Phone number</FieldLabel>
              <IconInput
                icon={Phone}
                field="phone"
                value={form.phone}
                onChange={(v) => patch("phone", v)}
                placeholder="03xx-xxxxxxx"
                invalid={!phoneOk}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <FieldLabel>Monthly salary (Rs) *</FieldLabel>
              <IconInput
                icon={Wallet}
                field="number"
                value={form.salary}
                onChange={(v) => patch("salary", v)}
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Overtime rate (Rs/hr)</FieldLabel>
              <IconInput
                icon={Clock}
                field="number"
                value={form.overtimeRate}
                onChange={(v) => patch("overtimeRate", v)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <FieldLabel>Standard working days</FieldLabel>
              <IconInput
                icon={CalendarDays}
                field="integer"
                value={form.workingDays}
                onChange={(v) => patch("workingDays", v)}
                placeholder="26"
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Employment status</FieldLabel>
              <Select
                value={form.active ? "active" : "inactive"}
                onValueChange={(v) => patch("active", v === "active")}
              >
                <SelectTrigger className="h-10 w-full text-[13px]">
                  <span className="flex items-center gap-2">
                    <Activity className="size-4 text-muted-foreground" />
                    <SelectValue />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <FieldLabel>
            {isEdit ? "New login password (optional)" : "Login password (optional)"}
          </FieldLabel>
          <IconInput
            icon={Lock}
            type="password"
            value={form.password}
            onChange={(v) => patch("password", v)}
            placeholder={isEdit ? "Leave blank to keep current" : "Leave blank — no app login"}
          />
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
            ) : isEdit ? (
              "Update Worker"
            ) : (
              "Register Worker"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
      {children}
    </Label>
  );
}

function IconInput({
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
  field,
  invalid,
}: {
  icon: typeof Wallet;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  /** Numeric / phone behaviour. Omit for a plain text input. */
  field?: "phone" | "number" | "integer";
  invalid?: boolean;
}) {
  const className = "h-10 ps-9 text-[13px]";
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      {field === "phone" ? (
        <PhoneInput
          value={value}
          onValueChange={onChange}
          placeholder={placeholder}
          aria-invalid={invalid}
          className={className}
        />
      ) : field === "number" || field === "integer" ? (
        <NumericInput
          value={value}
          onValueChange={onChange}
          decimal={field === "number"}
          placeholder={placeholder}
          aria-invalid={invalid}
          className={className}
        />
      ) : (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          aria-invalid={invalid}
          className={className}
        />
      )}
    </div>
  );
}
