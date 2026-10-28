import type { ReactNode } from "react";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  description,
  className = "",
}: StatCardProps) {
  return (
    <article
      className={[
        "rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition-colors",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-zinc-400">{label}</p>
        {icon && <div className="text-zinc-500">{icon}</div>}
      </div>

      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>

      {description && (
        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      )}
    </article>
  );
}
