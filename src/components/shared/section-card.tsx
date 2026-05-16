import * as React from "react";

import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLElement> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  contentClassName?: string;
  noPadding?: boolean;
};

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
  noPadding,
  ...props
}: Props) {
  return (
    <section
      {...props}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-elevated",
        className,
      )}
    >
      {(title || action) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b px-4 py-3 md:px-5 md:py-3.5">
          <div className="min-w-0">
            {title ? (
              <h2 className="text-[14px] font-semibold leading-none text-foreground">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-1.5 text-[12px] leading-snug text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {action ? (
            <div className="flex shrink-0 items-center gap-1.5">{action}</div>
          ) : null}
        </header>
      )}
      <div className={cn(!noPadding && "p-4 md:p-5", contentClassName)}>
        {children}
      </div>
    </section>
  );
}
