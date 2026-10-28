import { Link } from "react-router-dom";
import { FolderKanban, Briefcase, ArrowRight } from "lucide-react";
import { PageHeader, Card } from "../../components/ui";

const sections = [
  {
    title: "Projetos",
    description: "Gerencie os projetos do seu portfólio, slugs, destaques e conteúdos.",
    path: "/projects",
    action: "Gerenciar projetos",
    icon: FolderKanban,
  },
  {
    title: "Experiências",
    description: "Gerencie suas experiências profissionais, períodos, empresas e tecnologias.",
    path: "/experiences",
    action: "Gerenciar experiências",
    icon: Briefcase,
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Visão geral"
        title="Gerencie seu portfólio"
        description="Acesse cada seção para acompanhar e atualizar o conteúdo publicado no seu portfólio."
      />

      <section className="grid gap-5 sm:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <Card
              key={section.path}
              className="group flex flex-col justify-between border-zinc-800/80 bg-zinc-900/40 p-6 transition-colors hover:border-zinc-700 sm:p-6"
            >
              <div>
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors group-hover:border-zinc-700 group-hover:text-white">
                  <Icon className="size-5" />
                </div>

                <h3 className="text-lg font-semibold text-zinc-100">
                  {section.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {section.description}
                </p>
              </div>

              <div className="mt-6">
                <Link
                  to={section.path}
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200 decoration-zinc-600 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  <span>{section.action}</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
