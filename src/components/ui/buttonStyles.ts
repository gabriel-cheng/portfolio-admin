export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: "bg-white text-zinc-950 hover:bg-zinc-200",
  secondary:
    "border border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white",
  danger:
    "border border-red-900/80 bg-red-950/40 text-red-300 hover:bg-red-950 hover:text-red-200",
  ghost: "bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white",
};

export const buttonSizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-4 py-3 text-sm",
};

export function getButtonClassName({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
}: ButtonStyleOptions = {}): string {
  return [
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition",
    "enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
    buttonVariantClasses[variant],
    buttonSizeClasses[size],
    fullWidth ? "w-full" : "w-auto",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
