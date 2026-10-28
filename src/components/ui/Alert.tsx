import type { HTMLAttributes, ReactNode } from "react";

type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: AlertVariant;
  title?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  success: "border-emerald-900 bg-emerald-950/40 text-emerald-200",
  error: "border-red-900 bg-red-950/40 text-red-200",
  warning: "border-amber-900 bg-amber-950/40 text-amber-200",
  info: "border-blue-900 bg-blue-950/40 text-blue-200",
};

export function Alert({
  children,
  variant = "info",
  title,
  className = "",
  role,
  ...props
}: AlertProps) {
  return (
    <div
      {...props}
      role={role ?? (variant === "error" ? "alert" : "status")}
      className={[
        "rounded-xl border px-4 py-3 text-sm leading-6",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div>{children}</div>
    </div>
  );
}
