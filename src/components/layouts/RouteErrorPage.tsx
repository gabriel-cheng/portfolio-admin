import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export function RouteErrorPage() {
  const error = useRouteError();

  let title = "Ocorreu um erro";
  let description = "Não foi possível carregar esta página.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Página não encontrada";
      description = "A página solicitada não existe.";
    } else if (error.status === 403) {
      title = "Acesso negado";
      description = "Você não tem permissão para acessar este recurso.";
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
      <section className="max-w-md text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          GH Carvalho
        </p>

        <h1 className="mt-4 text-2xl font-semibold">{title}</h1>

        <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>

        <a
          href="/dashboard"
          className="mt-6 inline-flex items-center justify-center rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-900"
        >
          Voltar ao dashboard
        </a>
      </section>
    </main>
  );
}
