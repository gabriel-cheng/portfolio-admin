import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}

export function FormField({
  label,
  htmlFor,
  description,
  error,
  children,
  required = false,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-zinc-300"
      >
        {label}
        {required && <span className="ml-1 text-red-300">*</span>}
      </label>

      {description && (
        <p className="text-sm leading-5 text-zinc-500">{description}</p>
      )}

      {children}

      {error && (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
