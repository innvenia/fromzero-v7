import * as React from "react";
import { cn } from "@fw/lib/utils";

export type BreadcrumbItem = {
  label: React.ReactNode;
  href?: string;
  current?: boolean;
};

export type BreadcrumbProps = React.HTMLAttributes<HTMLElement> & {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
};

export function Breadcrumb({ className, items, separator = ">", ...props }: BreadcrumbProps) {
  return (
    <nav className={cn("fz-breadcrumb", className)} aria-label="Breadcrumb" {...props}>
      {items.map((item, index) => {
        const isCurrent = item.current ?? index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 ? <span className="sep">{separator}</span> : null}
            {item.href && !isCurrent ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span className={isCurrent ? "curr" : undefined} aria-current={isCurrent ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
