import * as React from "react";
import { cn } from "@fw/lib/utils";

export type TabItem = {
  value: string;
  label: React.ReactNode;
};

export type SegmentedTabsProps = React.HTMLAttributes<HTMLDivElement> & {
  items: TabItem[];
  value: string;
  onValueChange?: (value: string) => void;
};

export function SegmentedTabs({ className, items, value, onValueChange, ...props }: SegmentedTabsProps) {
  return (
    <div className={cn("segmented", className)} role="tablist" {...props}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          className={item.value === value ? "active" : undefined}
          role="tab"
          aria-selected={item.value === value}
          onClick={() => onValueChange?.(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

