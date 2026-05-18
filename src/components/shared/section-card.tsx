import * as React from "react";

import { cn } from "@/lib/utils";

type Props = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  contentClassName?: string;
  noPadding?: boolean;
  /** Applies a subtle tinted header wash for hero sections */
  washed?: boolean;
};

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
  noPadding,
  washed,
  ...props
}: Props) {
  return (
    <section
      {...props}
      className={cn(
        "ring-highlight rounded-xl border border-border/70 bg-card text-card-foreground",
        className,
      )}
    >
      {(title || action) && (
        <header
          className={cn(
            "flex flex-wrap items-start justify-between gap-3 border-b px-4 py-3.5 md:px-5 md:py-4",
            washed && "surface-wash rounded-t-xl",
          )}
        >
          <div className="min-w-0">
            {title ? (
              <h2 className="text-[15px] font-semibold leading-tight tracking-tight text-foreground">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {action ? (
            <div className="flex shrink-0 flex-wrap items-center gap-1.5">
              {action}
            </div>
          ) : null}
        </header>
      )}
      <div className={cn(!noPadding && "p-4 md:p-5", contentClassName)}>
        {children}
      </div>
    </section>
  );
}
