"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Coffee,
  Loader2,
  ShieldCheck,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { BRAND } from "@/constants/nav";
import { demoSignInAction } from "@/lib/actions/auth";
import { useAuth } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "cafe", label: "Café", icon: Building2 },
  { id: "owner", label: "Owner", icon: User },
  { id: "secure", label: "Secure", icon: ShieldCheck },
] as const;
type StepId = (typeof STEPS)[number]["id"];

export function OnboardingForm() {
  const router = useRouter();
  const setUser = useAuth((s) => s.setUser);

  const [step, setStep] = React.useState<StepId>("cafe");
  const [cafeName, setCafeName] = React.useState("");
  const [city, setCity] = React.useState("");
  const [ownerName, setOwnerName] = React.useState("");
  const [ownerEmail, setOwnerEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  function next() {
    if (step === "cafe") setStep("owner");
    else if (step === "owner") setStep("secure");
  }
  function back() {
    if (step === "owner") setStep("cafe");
    else if (step === "secure") setStep("owner");
  }

  async function complete(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Onboarding writes to the DB in a future iteration; for the
      // demo we drop the operator into the seeded admin account.
      const result = await demoSignInAction("usr_elena");
      if (!result.ok) {
        toast.error("Could not provision workspace", { description: result.error });
        return;
      }
      setUser(result.user);
      toast.success("Workspace ready", {
        description: `${cafeName || "Brewline"} · admin access granted`,
      });
      router.replace("/dashboard");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  const canAdvanceCafe = cafeName.trim().length > 1 && city.trim().length > 1;
  const canAdvanceOwner =
    ownerName.trim().length > 1 && /^\S+@\S+\.\S+$/.test(ownerEmail.trim());
  const canComplete = password.length >= 6;

  return (
    <div className="w-full max-w-[480px]">
      <div className="ring-highlight rounded-2xl border border-border/70 bg-card shadow-elevated">
        <div className="border-b border-border/70 p-6 md:p-7">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-soft">
              <Coffee className="size-[18px]" strokeWidth={2} />
            </span>
            <span className="text-[14px] font-semibold tracking-tight">
              {BRAND.name}
            </span>
          </div>
          <h1 className="mt-5 text-[22px] font-semibold tracking-tight">
            Set up your workspace
          </h1>
          <p className="mt-1.5 text-[13.5px] text-muted-foreground">
            Tell us about your café and create the first administrator account.
          </p>

          <div className="mt-5 space-y-3">
            <Progress
              value={progress}
              className="h-1.5 bg-muted [&>div]:bg-primary"
            />
            <ol className="flex items-center justify-between gap-2">
              {STEPS.map((s, idx) => {
                const Icon = s.icon;
                const done = idx < stepIndex;
                const current = idx === stepIndex;
                return (
                  <li key={s.id} className="flex flex-1 items-center gap-2">
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full border text-[10px]",
                        done && "border-primary bg-primary text-primary-foreground",
                        current && "border-primary text-primary",
                        !done && !current && "border-border text-muted-foreground",
                      )}
                    >
                      {done ? <CheckCircle2 className="size-3.5" /> : <Icon className="size-3" />}
                    </span>
                    <span
                      className={cn(
                        "text-[11.5px] font-medium",
                        current ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <form onSubmit={complete} className="space-y-4 p-6 md:p-7">
          {step === "cafe" ? (
            <>
              <Field
                id="cafe-name"
                label="Café name"
                value={cafeName}
                onChange={setCafeName}
                placeholder="Brewline Coffee"
              />
              <Field
                id="city"
                label="City"
                value={city}
                onChange={setCity}
                placeholder="San Francisco, USA"
              />
            </>
          ) : null}
          {step === "owner" ? (
            <>
              <Field
                id="owner-name"
                label="Your full name"
                value={ownerName}
                onChange={setOwnerName}
                placeholder="Elena Volkova"
              />
              <Field
                id="owner-email"
                label="Email"
                type="email"
                value={ownerEmail}
                onChange={setOwnerEmail}
                placeholder="elena@brewline.co"
              />
            </>
          ) : null}
          {step === "secure" ? (
            <>
              <Field
                id="password"
                label="Create a password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="At least 6 characters"
              />
              <p className="text-[12px] text-muted-foreground">
                You&apos;ll be the first administrator. Invite your team from
                Settings → Team & permissions once you&apos;re in.
              </p>
            </>
          ) : null}

          <div className="flex items-center justify-between gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={back}
              disabled={stepIndex === 0}
              className="h-10 rounded-md text-[13px]"
            >
              Back
            </Button>
            {step !== "secure" ? (
              <Button
                type="button"
                size="sm"
                onClick={next}
                disabled={
                  (step === "cafe" && !canAdvanceCafe) ||
                  (step === "owner" && !canAdvanceOwner)
                }
                className="h-10 rounded-md text-[13px]"
              >
                Continue
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="sm"
                disabled={!canComplete || submitting}
                className="h-10 rounded-md text-[13px]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Provisioning…
                  </>
                ) : (
                  <>Finish setup</>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[13px] font-medium">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 text-[14px]"
        autoComplete="off"
      />
    </div>
  );
}
