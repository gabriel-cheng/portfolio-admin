import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({
  id,
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-zinc-300"
      >
        {label}
      </label>

      <input
        {...props}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`w-full rounded-lg border bg-zinc-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:ring-2 focus:ring-zinc-400/10 disabled:cursor-not-allowed disabled:opacity-60 ${
          error
            ? "border-red-800 focus:border-red-700"
            : "border-zinc-700 focus:border-zinc-400"
        } ${className}`}
      />

      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
