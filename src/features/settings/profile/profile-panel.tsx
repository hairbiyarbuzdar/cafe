"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionCard } from "@/components/shared/section-card";
import { updateProfileAction } from "@/lib/actions/profile";
import { ROLE_HOME, hasPermission } from "@/lib/permissions";
import { useAuth } from "@/store/auth-store";
import type { SessionUser } from "@/types/auth";

const ROUTE_OPTIONS: { value: string; label: string; permission: string }[] = [
  { value: "/pos", label: "Point of Sale", permission: "pos.access" },
  { value: "/dashboard", label: "Dashboard", permission: "dashboard.view" },
  { value: "/kitchen", label: "Kitchen display", permission: "kitchen.view" },
  { value: "/orders", label: "Orders", permission: "orders.view" },
  { value: "/menu", label: "Menu", permission: "menu.view" },
  { value: "/inventory", label: "Inventory", permission: "inventory.view" },
  { value: "/reports", label: "Reports", permission: "reports.view" },
  { value: "/staff", label: "Staff", permission: "staff.view" },
];

export function ProfilePanel({ user }: { user: SessionUser }) {
  const router = useRouter();
  const setUser = useAuth((s) => s.setUser);

  const [name, setName] = React.useState(user.name);
  const [phone, setPhone] = React.useState(user.phone ?? "");
  const [defaultRoute, setDefaultRoute] = React.useState(
    user.defaultRoute ?? "default",
  );
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setName(user.name);
    setPhone(user.phone ?? "");
    setDefaultRoute(user.defaultRoute ?? "default");
  }, [user.name, user.phone, user.defaultRoute]);

  const available = ROUTE_OPTIONS.filter((o) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hasPermission(user, o.permission as any),
  );

  const dirty =
    name.trim() !== user.name ||
    (phone.trim() || null) !== (user.phone ?? null) ||
    (defaultRoute === "default" ? null : defaultRoute) !==
      (user.defaultRoute ?? null);

  async function save() {
    if (submitting || !dirty) return;
    setSubmitting(true);
    try {
      const result = await updateProfileAction({
        name: name.trim(),
        phone: phone.trim() || null,
        defaultRoute: defaultRoute === "default" ? null : defaultRoute,
      });
      if (!result.ok) {
        toast.error("Couldn't save profile", { description: result.error });
        return;
      }
      setUser(result.user);
      toast.success("Profile saved");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <SectionCard
        title="Profile"
        description="Your personal display name, phone, and landing route."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="prof-name" className="text-[12.5px] font-medium">
              Display name
            </Label>
            <Input
              id="prof-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 text-[14px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prof-phone" className="text-[12.5px] font-medium">
              Phone
            </Label>
            <Input
              id="prof-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03xx-xxxxxxx"
              className="h-10 text-[14px]"
              inputMode="tel"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="prof-route" className="text-[12.5px] font-medium">
              Landing route after sign-in
            </Label>
            <Select value={defaultRoute} onValueChange={setDefaultRoute}>
              <SelectTrigger id="prof-route" className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">
                  Role default ({ROLE_HOME[user.role]})
                </SelectItem>
                {available.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11.5px] text-muted-foreground">
              Lands here when you sign in or hit the workspace root. Only
              routes you have access to are listed.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={() => {
              setName(user.name);
              setPhone(user.phone ?? "");
              setDefaultRoute(user.defaultRoute ?? "default");
            }}
            disabled={!dirty || submitting}
          >
            Reset
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-9 rounded-md text-[12.5px]"
            onClick={save}
            disabled={!dirty || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
