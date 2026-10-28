import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
}

export function Textarea({
  id,
  label,
  hideLabel = false,
  hint,
  error,
  className = "",
  required,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <div className={label ? "space-y-1.5" : "w-full"}>
      {label && (
        <label
          htmlFor={textareaId}
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

      <textarea
        {...props}
        id={textareaId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error
            ? `${textareaId}-error`
            : hint
              ? `${textareaId}-hint`
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
        <p id={`${textareaId}-hint`} className="text-xs text-zinc-500">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${textareaId}-error`}
          className="text-sm text-red-300"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
