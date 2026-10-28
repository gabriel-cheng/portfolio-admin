export type ItemStatus = "PUBLISHED" | "DRAFT";

export interface StatusBadgeProps {
  status: ItemStatus;
  className?: string;
}

const statusStyles: Record<ItemStatus, string> = {
  PUBLISHED: "border-emerald-900 bg-emerald-950/60 text-emerald-300",
  DRAFT: "border-zinc-700 bg-zinc-800/70 text-zinc-300",
};

const statusLabels: Record<ItemStatus, string> = {
  PUBLISHED: "Publicado",
  DRAFT: "Rascunho",
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium",
        statusStyles[status],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={[
          "size-1.5 rounded-full",
          status === "PUBLISHED" ? "bg-emerald-400" : "bg-zinc-400",
        ].join(" ")}
      />
      {statusLabels[status]}
    </span>
  );
}
