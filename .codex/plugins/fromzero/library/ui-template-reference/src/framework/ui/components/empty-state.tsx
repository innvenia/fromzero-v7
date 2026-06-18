import * as React from "react";
import { cn } from "@fw/lib/utils";

export type EmptyStateProps = React.HTMLAttributes<HTMLDivElement> & {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
};

export function EmptyState({ className, icon, title, description, actions, ...props }: EmptyStateProps) {
  return (
    <div className={cn("empty", className)} {...props}>
      {icon ? <div className="empty-icon">{icon}</div> : null}
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {actions ? <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>{actions}</div> : null}
    </div>
  );
}

