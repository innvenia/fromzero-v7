import * as React from "react";
import { cn } from "@fw/lib/utils";

export function TableShell({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("tbl-wrap", className)} {...props} />;
}

export function TableToolbar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("tbl-toolbar", className)} {...props} />;
}

export function TableScroll({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("tbl-scroll", className)} {...props} />;
}

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn("tbl", className)} {...props} />;
}

export function TableHead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={className} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={className} {...props} />;
}

export type TableHeaderProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
  sortable?: boolean;
};

export function TableHeader({ className, sortable, ...props }: TableHeaderProps) {
  return <th className={cn(sortable && "sortable", className)} {...props} />;
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={className} {...props} />;
}

export function TableFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("tbl-foot", className)} {...props} />;
}
