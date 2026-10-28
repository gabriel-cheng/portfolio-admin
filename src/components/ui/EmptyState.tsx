import type { ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center rounded-xl",
        "border border-dashed border-zinc-800 px-6 py-14 text-center",
        className,
      ].join(" ")}
    >
      {icon && (
        <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-400">
          {icon}
        </div>
      )}

      <h3 className="text-base font-medium text-zinc-200">{title}</h3>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
