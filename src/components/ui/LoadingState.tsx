export interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const spinnerSizes = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
};

export function LoadingState({
  message = "Carregando...",
  className = "",
  size = "md",
}: LoadingStateProps) {
  return (
    <div
      className={[
        "flex min-h-40 flex-col items-center justify-center gap-3",
        "text-sm text-zinc-400",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className={[
          "animate-spin rounded-full border-2 border-zinc-700",
          "border-t-zinc-200",
          spinnerSizes[size],
        ].join(" ")}
      />
      <span>{message}</span>
    </div>
  );
}
