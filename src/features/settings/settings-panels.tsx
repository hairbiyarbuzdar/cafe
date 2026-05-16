"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  Check,
  Code2,
  CreditCard,
  Globe,
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
import { RoleBadge } from "@/features/staff/role-badge";
import { STAFF } from "@/mock/staff";
import { cn, initials } from "@/lib/utils";

export function GeneralPanel() {
  return (
    <div className="space-y-4">
      <SectionCard
        title="Workspace details"
        description="How your café appears across receipts and reports"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Café name">
            <Input defaultValue="Brewline" className="h-9" />
          </Field>
          <Field label="Legal entity">
            <Input defaultValue="Brewline Coffee Co. LLC" className="h-9" />
          </Field>
          <Field label="Tax ID">
            <Input defaultValue="38-7724918" className="h-9" />
          </Field>
          <Field label="Currency">
            <Select defaultValue="usd">
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">US Dollar (USD)</SelectItem>
                <SelectItem value="eur">Euro (EUR)</SelectItem>
                <SelectItem value="gbp">British Pound (GBP)</SelectItem>
                <SelectItem value="cad">Canadian Dollar (CAD)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Time zone" className="md:col-span-2">
            <Select defaultValue="pst">
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pst">Pacific Time — PST</SelectItem>
                <SelectItem value="est">Eastern Time — EST</SelectItem>
                <SelectItem value="cet">Central European — CET</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Receipt footer" className="md:col-span-2">
            <Textarea
              rows={3}
              defaultValue="Thanks for visiting Brewline! Follow @brewline for daily specials."
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Operating hours"
        description="Default hours used for scheduling and reporting"
      >
        <ul className="space-y-2">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
            (day) => (
              <li
                key={day}
                className="grid grid-cols-[100px_1fr_1fr_auto] items-center gap-3 text-[12.5px]"
              >
                <span className="font-medium">{day}</span>
                <Input defaultValue="06:30" className="h-8 text-[12px]" />
                <Input defaultValue="20:30" className="h-8 text-[12px]" />
                <Switch defaultChecked />
              </li>
            ),
          )}
        </ul>
      </SectionCard>

      <FooterSave />
    </div>
  );
}

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

export function TeamPanel() {
  return (
    <div className="space-y-4">
      <SectionCard
        title="Members"
        description="Manage who has access to this workspace"
        action={<Button size="sm" className="h-8 rounded-md text-[12.5px]">Invite</Button>}
        contentClassName="p-0"
      >
        <ul className="divide-y">
          {STAFF.slice(0, 5).map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-3 px-4 py-3 md:px-5"
            >
              <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-[11px] font-semibold text-primary">
                {initials(s.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{s.name}</p>
                <p className="truncate text-[11.5px] text-muted-foreground">{s.email}</p>
              </div>
              <RoleBadge role={s.role} />
              <Badge variant="outline" className="rounded-md text-[10.5px] font-normal">
                {s.status === "active" ? "Active" : s.status === "on-leave" ? "On leave" : "Off-duty"}
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

export function BillingPanel() {
  return (
    <div className="space-y-4">
      <SectionCard title="Plan" description="Current subscription and seat allocation">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <PlanCard
            name="Starter"
            price="$0"
            description="Up to 2 staff, single location"
          />
          <PlanCard
            name="Growth"
            price="$79"
            description="Up to 15 staff, advanced reports"
            current
          />
          <PlanCard
            name="Pro"
            price="$199"
            description="Multi-location, SLA, API"
          />
        </div>
      </SectionCard>

      <SectionCard title="Payment method" description="Auto-renews on the 1st of each month">
        <div className="flex items-center justify-between rounded-md border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              <CreditCard className="size-4" />
            </span>
            <div>
              <p className="text-[13px] font-medium">Visa ending in 4242</p>
              <p className="text-[11.5px] text-muted-foreground">Expires 08/2027</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8 rounded-md text-[12.5px]">
            Update
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}

export function IntegrationsPanel() {
  const integrations = [
    { name: "Stripe", description: "Card payments and payouts", connected: true, icon: CreditCard },
    { name: "QuickBooks", description: "Sync sales and expenses", connected: true, icon: Globe },
    { name: "Slack", description: "Operational alerts in #brewline-ops", connected: true, icon: Hash },
    { name: "Mailchimp", description: "Customer marketing campaigns", connected: false, icon: Mail },
    { name: "GitHub", description: "Connect your menu repo", connected: false, icon: Code2 },
  ];

  return (
    <SectionCard
      title="Integrations"
      description="Connect Brewline with the tools you already use"
      contentClassName="p-0"
    >
      <ul className="divide-y">
        {integrations.map((i) => {
          const Icon = i.icon;
          return (
            <li
              key={i.name}
              className="flex items-center gap-3 px-4 py-3 md:px-5"
            >
              <span className="flex size-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{i.name}</p>
                <p className="truncate text-[11.5px] text-muted-foreground">
                  {i.description}
                </p>
              </div>
              {i.connected ? (
                <Badge className="rounded-md border-success/20 bg-success/12 text-success">
                  Connected
                </Badge>
              ) : (
                <Button variant="outline" size="sm" className="h-7 rounded-md text-[11.5px]">
                  Connect
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}

export function SecurityPanel() {
  return (
    <div className="space-y-4">
      <SectionCard
        title="Two-factor authentication"
        description="Add an extra layer of security to sign-ins"
      >
        <div className="flex items-center justify-between rounded-md border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md bg-success/15 text-success">
              <ShieldIcon />
            </span>
            <div>
              <p className="text-[13px] font-medium">Authenticator app</p>
              <p className="text-[11.5px] text-muted-foreground">
                Connected · last used 2 hours ago
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8 rounded-md text-[12.5px]">
            Manage
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Sessions" description="Active devices signed in to this workspace">
        <ul className="divide-y">
          {[
            { name: "MacBook Pro · Safari", location: "San Francisco, US", current: true },
            { name: "iPhone 15 Pro · iOS app", location: "San Francisco, US", current: false },
            { name: "iPad Mini · POS", location: "Mission St", current: false },
          ].map((s) => (
            <li
              key={s.name}
              className="flex items-center justify-between gap-3 py-2.5 text-[12.5px]"
            >
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-[11.5px] text-muted-foreground">{s.location}</p>
              </div>
              {s.current ? (
                <Badge className="rounded-md border-success/20 bg-success/12 text-success">
                  This device
                </Badge>
              ) : (
                <Button variant="ghost" size="xs" className="text-[11.5px] text-destructive">
                  Sign out
                </Button>
              )}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        title="API keys"
        description="Programmatic access for integrations and exports"
      >
        <div className="flex items-center gap-3 rounded-md border bg-card px-3 py-2 font-mono text-[12px]">
          <KeyRound className="size-3.5 text-muted-foreground" />
          <span className="flex-1 truncate">brl_live_•••••••••••••••••••• 9f2c</span>
          <Button variant="ghost" size="xs" className="text-[11.5px]">
            Reveal
          </Button>
          <Button variant="ghost" size="xs" className="text-[11.5px]">
            Rotate
          </Button>
        </div>
      </SectionCard>
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

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-[12px] font-medium text-foreground">{label}</Label>
      {children}
    </div>
  );
}

function FooterSave() {
  return (
    <div className="sticky bottom-3 z-10 flex items-center justify-between gap-3 rounded-lg border bg-card/95 px-4 py-2.5 shadow-elevated backdrop-blur">
      <p className="text-[12.5px] text-muted-foreground">
        Unsaved changes will sync to all team members.
      </p>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 rounded-md text-[12.5px]">
          Discard
        </Button>
        <Button
          size="sm"
          className="h-8 rounded-md text-[12.5px]"
          onClick={() => toast.success("Settings saved")}
        >
          <Check className="size-3.5" /> Save changes
        </Button>
      </div>
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
