interface BrandProps {
  description?: string;
}

export function Brand({ description }: BrandProps) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 text-lg font-semibold tracking-tight text-white">
        GH
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
        Portfolio Administration
      </p>

      {description && (
        <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
      )}
    </div>
  );
}
