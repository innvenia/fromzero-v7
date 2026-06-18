import * as React from "react";
import { cn } from "@fw/lib/utils";

export type StatCardProps = React.HTMLAttributes<HTMLDivElement> & {
  label: React.ReactNode;
  value: React.ReactNode;
  delta?: React.ReactNode;
  deltaDir?: "up" | "down";
  meta?: React.ReactNode;
  icon?: React.ReactNode;
};

export function StatCard({ className, label, value, delta, deltaDir = "up", meta, icon, ...props }: StatCardProps) {
  return (
    <div className={cn("kpi", className)} {...props}>
      <div className="kpi-head">
        <span className="kpi-label">{label}</span>
        {icon ? <span className="kpi-icon">{icon}</span> : null}
      </div>
      <div className="kpi-value">{value}</div>
      {(delta || meta) ? (
        <div className="kpi-foot">
          {delta ? <span className="kpi-delta" data-dir={deltaDir}>{delta}</span> : null}
          {meta ? <span>{meta}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
