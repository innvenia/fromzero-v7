import * as React from "react";
import { cn } from "@fw/lib/utils";
import { Card, CardBody, CardHeader, CardTitle } from "./card";

export function DashboardGrid({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("row-4", className)} {...props} />;
}

export type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
};

export function ChartContainer({ className, title, subtitle, actions, children, ...props }: ChartContainerProps) {
  return (
    <Card className={className} {...props}>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          {subtitle ? <p className="card-subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="fz-page-actions">{actions}</div> : null}
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
}
