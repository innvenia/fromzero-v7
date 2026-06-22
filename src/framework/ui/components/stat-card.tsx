import { Card } from "./card";

type StatCardProps = Readonly<{
  label: string;
  value: string;
}>;

export function StatCard({ label, value }: StatCardProps) {
  return (
    <Card className="min-h-[112px] p-4">
      <p className="m-0 text-xs font-semibold uppercase text-[var(--text-muted)]">
        {label}
      </p>
      <p className="m-0 mt-3 text-2xl font-bold text-[var(--text-strong)]">
        {value}
      </p>
    </Card>
  );
}
