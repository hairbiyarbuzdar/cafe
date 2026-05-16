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
        "flex flex-col gap-3 border-b pb-5 md:flex-row md:items-end md:justify-between md:gap-6",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-[20px] font-semibold tracking-tight text-foreground md:text-[22px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
        {meta ? <div className="mt-3 flex flex-wrap gap-2">{meta}</div> : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
