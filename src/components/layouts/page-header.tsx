import * as React from "react";

import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  meta,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-border/70 pb-5 lg:flex-row lg:items-end lg:justify-between lg:gap-6",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground md:text-[26px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-prose text-[14px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
        {meta ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
