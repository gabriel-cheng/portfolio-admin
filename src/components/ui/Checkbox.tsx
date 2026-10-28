import type { InputHTMLAttributes } from "react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
  description?: string;
  error?: string;
}

export function Checkbox({
  id,
  label,
  description,
  error,
  className = "",
  ...props
}: CheckboxProps) {
  const checkboxId = id ?? props.name;

  return (
    <div>
      <label
        htmlFor={checkboxId}
        className="flex cursor-pointer items-start gap-3"
      >
        <input
          {...props}
          id={checkboxId}
          type="checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${checkboxId}-error` : undefined}
          className={[
            "mt-1 size-4 shrink-0 rounded border-zinc-700",
            "accent-white focus:ring-2 focus:ring-zinc-400/20",
            "disabled:cursor-not-allowed",
            className,
          ].join(" ")}
        />

        <span className="space-y-1">
          <span className="block text-sm font-medium text-zinc-200">
            {label}
          </span>

          {description && (
            <span className="block text-sm leading-5 text-zinc-500">
              {description}
            </span>
          )}
        </span>
      </label>

      {error && (
        <p id={`${checkboxId}-error`} className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
