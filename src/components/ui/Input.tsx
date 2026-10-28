import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
}

export function Input({
  id,
  label,
  hideLabel = false,
  hint,
  error,
  className = "",
  required,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className={label ? "space-y-1.5" : "w-full"}>
      {label && (
        <label
          htmlFor={inputId}
          className={
            hideLabel
              ? "sr-only"
              : "block text-sm font-medium text-zinc-300"
          }
        >
          {label}
          {required && !hideLabel && (
            <span className="ml-1 text-red-400">*</span>
          )}
        </label>
      )}

      <input
        {...props}
        id={inputId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error
            ? `${inputId}-error`
            : hint
              ? `${inputId}-hint`
              : undefined
        }
        className={[
          "w-full rounded-lg border bg-zinc-900/70 px-3.5 py-2.5 text-sm text-white",
          "outline-none transition placeholder:text-zinc-600 focus:ring-2 focus:ring-zinc-400/10",
          "disabled:cursor-not-allowed disabled:opacity-60",
          error
            ? "border-red-800 focus:border-red-700"
            : "border-zinc-700 focus:border-zinc-400",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />

      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-zinc-500">
          {hint}
        </p>
      )}

      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
