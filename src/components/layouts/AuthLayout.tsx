import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-5 py-12 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.045),transparent_55%)]"
      />

      <div className="relative w-full max-w-md">
        <Outlet />

        <footer className="mt-8 text-center">
          <p className="text-xs text-zinc-600">
            GH Carvalho · Painel administrativo
          </p>
        </footer>
      </div>
    </main>
  );
}
