import { Link } from "react-router-dom";

const sections = [
  {
    title: "Projects",
    description: "Gerencie os projetos do seu portfólio.",
    path: "/projects",
    action: "Gerenciar projetos",
  },
  {
    title: "Experiences",
    description: "Gerencie suas experiências profissionais.",
    path: "/experiences",
    action: "Gerenciar experiências",
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm text-zinc-400">Visão geral</p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Gerencie seu portfólio
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Acesse cada seção para acompanhar e atualizar o conteúdo publicado no
          seu portfólio.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <article
            key={section.path}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-700"
          >
            <h3 className="text-lg font-semibold text-zinc-100">
              {section.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {section.description}
            </p>

            <Link
              to={section.path}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-100 underline decoration-zinc-600 underline-offset-4 transition-colors hover:decoration-white"
            >
              {section.action}
              <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
