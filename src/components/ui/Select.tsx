import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hideLabel?: boolean;
  hint?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export function Select({
  id,
  label,
  hideLabel = false,
  hint,
  options,
  error,
  placeholder,
  className = "",
  required,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <div className={label ? "space-y-1.5" : "w-full"}>
      {label && (
        <label
          htmlFor={selectId}
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

      <select
        {...props}
        id={selectId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error
            ? `${selectId}-error`
            : hint
              ? `${selectId}-hint`
              : undefined
        }
        className={[
          "w-full rounded-lg border bg-zinc-900/70 px-3.5 py-2.5 text-sm text-white",
          "outline-none transition focus:ring-2 focus:ring-zinc-400/10",
          "disabled:cursor-not-allowed disabled:opacity-60",
          error
            ? "border-red-800 focus:border-red-700"
            : "border-zinc-700 focus:border-zinc-400",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {hint && !error && (
        <p id={`${selectId}-hint`} className="text-xs text-zinc-500">
          {hint}
        </p>
      )}

      {error && (
        <p id={`${selectId}-error`} className="text-sm text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
