import { useMatches } from "react-router-dom";

interface RouteHandle {
  title?: string;
}

export function AdminHeader() {
  const matches = useMatches();

  const currentMatch = [...matches].reverse().find((match) => {
    const handle = match.handle as RouteHandle | undefined;
    return Boolean(handle?.title);
  });

  const handle = currentMatch?.handle as RouteHandle | undefined;
  const pageTitle = handle?.title?.split(" | ")[0] ?? "Dashboard";

  return (
    <header className="flex min-h-20 items-center justify-between gap-4 border-b border-zinc-800 px-5 sm:px-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
          Administration
        </p>

        <h1 className="mt-1 text-lg font-semibold tracking-tight text-zinc-100">
          {pageTitle}
        </h1>
      </div>

      <div className="hidden items-center gap-3 sm:flex">
        <span className="size-2 rounded-full bg-emerald-500" />
        <span className="text-sm text-zinc-400">Portfolio workspace</span>
      </div>
    </header>
  );
}
