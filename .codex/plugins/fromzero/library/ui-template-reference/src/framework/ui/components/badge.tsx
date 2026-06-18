import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@fw/lib/utils";

const badgeVariants = cva("badge", {
  variants: {
    variant: {
      neutral: "",
      success: "success",
      warning: "warning",
      danger: "danger",
      info: "info",
      pro: "pro",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} data-tone={variant ?? "neutral"} {...props} />;
}

export { badgeVariants };
