"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  Check,
  CreditCard,
  Hash,
  KeyRound,
  Laptop,
  Mail,
  MessageSquare,
  Moon,
  Smartphone,
  Sun,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionCard } from "@/components/shared/section-card";
import { InviteMemberDialog } from "@/features/settings/invite-member-dialog";
import { PushToggle } from "@/features/notifications/push-toggle";
import {
  Manage2FADialog,
  RotateApiKeyDialog,
  SignOutSessionDialog,
  UpdatePaymentMethodDialog,
} from "@/features/settings/settings-demo-dialogs";
import { RoleBadge } from "@/features/staff/role-badge";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { PendingMember } from "@/lib/queries/users";
import type { SessionUser } from "@/types/auth";
import { cn, initials } from "@/lib/utils";

export function AppearancePanel() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const current = mounted ? theme ?? "system" : "system";

  return (
    <div className="space-y-4">
      <SectionCard
        title="Theme"
        description="Pick how Brewline looks for you. Customers see only the storefront theme."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ThemeOption
            label="Light"
            value="light"
            current={current}
            onSelect={setTheme}
            icon={Sun}
            preview="bg-white text-zinc-900"
          />
          <ThemeOption
            label="Dark"
            value="dark"
            current={current}
            onSelect={setTheme}
            icon={Moon}
            preview="bg-zinc-900 text-zinc-100"
          />
          <ThemeOption
            label="System"
            value="system"
            current={current}
            onSelect={setTheme}
            icon={Laptop}
            preview="bg-gradient-to-br from-white to-zinc-900 text-zinc-700"
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Density"
        description="Adjust how compact tables and lists feel"
      >
        <div className="flex items-center justify-between rounded-md border bg-card p-3">
          <div>
            <p className="text-[13px] font-medium">Compact layouts</p>
            <p className="text-[11.5px] text-muted-foreground">
              Show more data per screen by tightening padding.
            </p>
          </div>
          <Switch />
        </div>
      </SectionCard>

      <SectionCard
        title="Brand accent"
        description="Accent color used across charts and primary buttons"
      >
        <div className="flex flex-wrap gap-2">
          {["#6F4E37", "#1D4ED8", "#15803D", "#9333EA", "#DC2626", "#0F766E"].map((c) => (
            <button
              key={c}
              type="button"
              className="size-9 rounded-md border shadow-elevated transition hover:scale-105"
              style={{ background: c }}
              aria-label={`Choose accent ${c}`}
              onClick={() => toast.info(`Accent ${c} preview only`)}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function ThemeOption({
  label,
  value,
  current,
  onSelect,
  icon: Icon,
  preview,
}: {
  label: string;
  value: string;
  current: string;
  onSelect: (v: string) => void;
  icon: typeof Sun;
  preview: string;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        "group flex flex-col gap-2 rounded-lg border bg-card p-3 text-left transition-all",
        active ? "border-primary/50 ring-2 ring-primary/20" : "hover:border-primary/30",
      )}
    >
      <div
        className={cn(
          "flex h-20 items-center justify-center rounded-md border text-[11px] font-medium",
          preview,
        )}
      >
        Aa Bb 123
      </div>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium">
          <Icon className="size-3.5" />
          {label}
        </span>
        {active ? (
          <span className="inline-flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-2.5" />
          </span>
        ) : null}
      </div>
    </button>
  );
}

const ROLES = ["admin", "manager", "cashier", "kitchen", "barista"] as const;
const PERMISSIONS = [
  { id: "pos", label: "Point of sale" },
  { id: "orders", label: "Orders" },
  { id: "inventory", label: "Inventory" },
  { id: "reports", label: "Reports" },
  { id: "staff", label: "Staff" },
  { id: "settings", label: "Settings" },
] as const;

const MATRIX: Record<string, Record<string, boolean>> = {
  admin: { pos: true, orders: true, inventory: true, reports: true, staff: true, settings: true },
  manager: { pos: true, orders: true, inventory: true, reports: true, staff: true, settings: false },
  cashier: { pos: true, orders: true, inventory: false, reports: false, staff: false, settings: false },
  kitchen: { pos: false, orders: true, inventory: true, reports: false, staff: false, settings: false },
  barista: { pos: true, orders: true, inventory: false, reports: false, staff: false, settings: false },
};

export function TeamPanel({
  members,
  pending,
  roles,
}: {
  members: SessionUser[];
  pending: PendingMember[];
  roles: { id: string; name: string }[];
}) {
  const currentUser = useCurrentUser();
  return (
    <div className="space-y-4">
      <SectionCard
        title="Members"
        description={
          pending.length > 0
            ? `Manage workspace access · ${pending.length} awaiting invite`
            : "Manage who has access to this workspace"
        }
        action={
          <InviteMemberDialog
            pending={pending}
            roles={roles}
            trigger={
              <Button size="sm" className="h-9 rounded-md text-[12.5px]">
                Invite
                {pending.length > 0 ? (
                  <Badge className="ms-0.5 rounded-full border-0 bg-primary-foreground/15 px-1.5 py-0 text-[10px] font-medium text-primary-foreground">
                    {pending.length}
                  </Badge>
                ) : null}
              </Button>
            }
          />
        }
        contentClassName="p-0"
      >
        <ul className="divide-y">
          {members.map((u) => {
            const isMe = currentUser?.id === u.id;
            return (
              <li key={u.id} className="flex items-center gap-3 px-4 py-3 md:px-5">
                <span className="flex size-9 items-center justify-center rounded-md bg-gradient-to-br from-primary/15 to-primary/10 text-[12px] font-semibold text-primary">
                  {initials(u.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-[13px] font-medium">
                    {u.name}
                    {isMe ? (
                      <Badge className="rounded-md border-primary/30 bg-primary/12 px-1.5 py-0 text-[10.5px] text-primary">
                        You
                      </Badge>
                    ) : null}
                  </p>
                  <p className="truncate text-[11.5px] text-muted-foreground">
                    {u.email}
                  </p>
                </div>
                <RoleBadge role={u.role} label={u.roleName} />
              </li>
            );
          })}
          {pending.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 bg-muted/30 px-4 py-3 md:px-5"
            >
              <span className="flex size-9 items-center justify-center rounded-md border border-dashed border-border bg-muted text-[12px] font-semibold text-muted-foreground">
                {initials(p.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-foreground">
                  {p.name}
                </p>
                <p className="truncate text-[11.5px] text-muted-foreground">
                  {p.email}
                </p>
              </div>
              <Badge
                variant="outline"
                className="rounded-md border-dashed text-[10.5px] font-normal text-muted-foreground"
              >
                Awaiting invite
              </Badge>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        title="Permission matrix"
        description="Default access by role · admins can override per user"
        contentClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead className="bg-surface-1">
              <tr className="border-b">
                <th className="px-4 py-2.5 text-start font-medium text-muted-foreground">
                  Capability
                </th>
                {ROLES.map((r) => (
                  <th
                    key={r}
                    className="px-3 py-2.5 text-center font-medium capitalize text-muted-foreground"
                  >
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((p) => (
                <tr key={p.id} className="border-b last:border-b-0">
                  <td className="px-4 py-2.5 font-medium">{p.label}</td>
                  {ROLES.map((r) => (
                    <td key={r} className="px-3 py-2.5 text-center">
                      {MATRIX[r][p.id] ? (
                        <span className="inline-flex size-5 items-center justify-center rounded-full bg-success/15 text-success">
                          <Check className="size-3" />
                        </span>
                      ) : (
                        <span className="inline-block h-px w-3 bg-border" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

export function NotificationsPanel() {
  return (
    <div className="space-y-4">
      <SectionCard
        title="Web Push"
        description="Real-time alerts on your locked screen / closed tab. Subscription is per device — enable on every tablet that should ping."
      >
        <PushToggle />
      </SectionCard>

      <SectionCard
        title="Channels"
        description="Where you receive operational alerts"
      >
        <ul className="space-y-2">
          {[
            { icon: Mail, label: "Email", value: "elena@brewline.co", on: true },
            { icon: Smartphone, label: "Mobile push", value: "iPhone 15 Pro", on: true },
            { icon: MessageSquare, label: "SMS", value: "+1 415 555 0109", on: false },
            { icon: Hash, label: "Slack workspace", value: "#brewline-ops", on: true },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <li
                key={c.label}
                className="flex items-center justify-between rounded-md border bg-card px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                    <Icon className="size-3.5" />
                  </span>
                  <div>
                    <p className="text-[13px] font-medium">{c.label}</p>
                    <p className="text-[11.5px] text-muted-foreground">{c.value}</p>
                  </div>
                </div>
                <Switch defaultChecked={c.on} />
              </li>
            );
          })}
        </ul>
      </SectionCard>

      <SectionCard
        title="Alert preferences"
        description="Choose which events should trigger a notification"
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            "New online order",
            "Low stock threshold",
            "Daily settlement summary",
            "Failed payment",
            "Refund issued",
            "Shift no-show",
          ].map((label, i) => (
            <label
              key={label}
              className="flex items-center justify-between rounded-md border bg-card px-3 py-2.5 text-[13px]"
            >
              {label}
              <Switch defaultChecked={i % 2 === 0} />
            </label>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function ApiKeyRow() {
  const [revealed, setRevealed] = React.useState(false);
  return (
    <div className="flex items-center gap-3 rounded-md border bg-card px-3 py-2 font-mono text-[12px]">
      <KeyRound className="size-3.5 text-muted-foreground" />
      <span className="flex-1 truncate">
        {revealed ? "brl_live_aef27d31e9c44b0e9f2c" : "brl_live_•••••••••••••••••••• 9f2c"}
      </span>
      <Button
        variant="ghost"
        size="xs"
        className="text-[11.5px]"
        onClick={() => setRevealed((r) => !r)}
      >
        {revealed ? "Hide" : "Reveal"}
      </Button>
      <RotateApiKeyDialog
        trigger={
          <Button variant="ghost" size="xs" className="text-[11.5px]">
            Rotate
          </Button>
        }
      />
    </div>
  );
}

function PlanCard({
  name,
  price,
  description,
  current,
}: {
  name: string;
  price: string;
  description: string;
  current?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border bg-card p-4 transition-colors",
        current && "border-primary/50 ring-2 ring-primary/15",
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold">{name}</p>
        {current ? (
          <Badge className="rounded-md border-primary/30 bg-primary/12 text-primary">
            Current
          </Badge>
        ) : null}
      </div>
      <p className="text-[20px] font-semibold tabular-nums">
        {price}
        <span className="ms-1 text-[11px] font-normal text-muted-foreground">
          /month
        </span>
      </p>
      <p className="text-[12px] text-muted-foreground">{description}</p>
      <Button
        variant={current ? "outline" : "default"}
        size="sm"
        className="mt-2 h-8 rounded-md text-[12.5px]"
      >
        {current ? "Manage" : "Switch"}
      </Button>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
