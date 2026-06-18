import * as React from "react";
import { cn } from "@fw/lib/utils";
import { Breadcrumb, type BreadcrumbItem } from "./breadcrumb";

export type PageHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  title: React.ReactNode;
  crumbs?: React.ReactNode[] | BreadcrumbItem[];
  actions?: React.ReactNode;
};

export function PageHeader({ className, title, crumbs = [], actions, ...props }: PageHeaderProps) {
  return (
    <div className={cn("fz-page-head", className)} {...props}>
      <div>
        <h1 className="fz-page-title">{title}</h1>
        {crumbs.length ? <Breadcrumb items={crumbs.map((crumb) => typeof crumb === "object" && crumb && "label" in crumb ? crumb : { label: crumb })} /> : null}
      </div>
      {actions ? <div className="fz-page-actions">{actions}</div> : null}
    </div>
  );
}
