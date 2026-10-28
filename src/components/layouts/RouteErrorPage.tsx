import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";
import { Card, getButtonClassName } from "../ui";

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
      <Card className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          GH Carvalho
        </p>

        <h1 className="mt-4 text-2xl font-semibold text-white">{title}</h1>

        <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>

        <div className="mt-6">
          <Link
            to="/dashboard"
            className={getButtonClassName({
              variant: "secondary",
              size: "md",
            })}
          >
            Voltar ao dashboard
          </Link>
        </div>
      </Card>
    </main>
  );
}
