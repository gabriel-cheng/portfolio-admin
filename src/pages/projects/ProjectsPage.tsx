import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Plus, FolderKanban, Globe, FileEdit, RefreshCw } from "lucide-react";

import { projectsApi } from "../../features/projects/api/projectsApi";
import {
  PageHeader,
  StatCard,
  StatusBadge,
  Alert,
  EmptyState,
  LoadingState,
  Input,
  Select,
  Button,
  getButtonClassName,
} from "../../components/ui";
import type {
  Project,
  ProjectStatus,
} from "../../features/projects/types/project.types";

type StatusFilter = "ALL" | ProjectStatus;

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Não foi possível conectar à API. Verifique se o backend está em execução.";
    }

    if (error.response.status === 401) {
      return "Sua sessão expirou. Entre novamente para continuar.";
    }

    if (error.response.status === 403) {
      return "Você não tem permissão para realizar esta operação.";
    }

    return "Não foi possível concluir a operação. Tente novamente.";
  }

  return "Ocorreu um erro inesperado.";
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
  }).format(date);
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [loading, setLoading] = useState(true);
  const [busyProjectId, setBusyProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await projectsApi.list();
      setProjects(result);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data = await projectsApi.list();

        if (!cancelled) {
          setProjects(data);
        }
      } catch {
        if (!cancelled) {
          setError("Não foi possível carregar os projetos.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");

    return projects
      .filter((project) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          [project.title, project.slug, project.summary].some((value) =>
            value.toLocaleLowerCase("pt-BR").includes(normalizedSearch),
          );

        const matchesStatus =
          statusFilter === "ALL" || project.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [projects, search, statusFilter]);

  const publishedCount = projects.filter(
    (project) => project.status === "PUBLISHED",
  ).length;

  const draftCount = projects.filter(
    (project) => project.status === "DRAFT",
  ).length;

  async function handlePublicationToggle(project: Project) {
    setBusyProjectId(project.id);
    setError(null);
    setNotice(null);

    try {
      if (project.status === "PUBLISHED") {
        await projectsApi.unpublish(project.id);
        setNotice(`"${project.title}" foi despublicado.`);
      } else {
        await projectsApi.publish(project.id);
        setNotice(`"${project.title}" foi publicado.`);
      }

      await loadProjects();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusyProjectId(null);
    }
  }

  async function handleDelete(project: Project) {
    const confirmed = window.confirm(
      `Deseja realmente excluir o projeto "${project.title}"? Esta ação não pode ser desfeita.`,
    );

    if (!confirmed) {
      return;
    }

    setBusyProjectId(project.id);
    setError(null);
    setNotice(null);

    try {
      await projectsApi.delete(project.id);
      setProjects((current) =>
        current.filter((item) => item.id !== project.id),
      );
      setNotice(`"${project.title}" foi excluído.`);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusyProjectId(null);
    }
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Portfolio content / Projects"
        title="Projetos"
        description="Consulte, publique e mantenha os projetos do seu portfólio atualizados."
        actions={
          <Link
            to="/projects/new"
            className={getButtonClassName({ variant: "primary", size: "md" })}
          >
            <Plus className="size-4" />
            <span>Novo projeto</span>
          </Link>
        }
      />

      <section
        aria-label="Resumo dos projetos"
        className="grid gap-3 sm:grid-cols-3"
      >
        <StatCard
          label="Total de projetos"
          value={projects.length}
          icon={<FolderKanban className="size-5" />}
        />
        <StatCard
          label="Publicados"
          value={publishedCount}
          icon={<Globe className="size-5" />}
        />
        <StatCard
          label="Rascunhos"
          value={draftCount}
          icon={<FileEdit className="size-5" />}
        />
      </section>

      {error && (
        <Alert
          variant="error"
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{error}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void loadProjects()}
            className="self-start text-red-200 underline underline-offset-4 hover:text-white sm:self-auto"
          >
            <RefreshCw className="size-3.5" />
            <span>Tentar novamente</span>
          </Button>
        </Alert>
      )}

      {notice && <Alert variant="success">{notice}</Alert>}

      <section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
        <div className="flex flex-col gap-4 border-b border-zinc-800 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-semibold text-zinc-100">Todos os projetos</h3>
            <p className="mt-1 text-sm text-zinc-500">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "resultado" : "resultados"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="w-full sm:w-64">
              <Input
                id="project-search"
                label="Buscar projetos"
                hideLabel
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por título, slug..."
              />
            </div>

            <div className="w-full sm:w-48">
              <Select
                id="project-status"
                label="Filtrar por status"
                hideLabel
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
                options={[
                  { value: "ALL", label: "Todos os status" },
                  { value: "PUBLISHED", label: "Publicados" },
                  { value: "DRAFT", label: "Rascunhos" },
                ]}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingState message="Carregando projetos..." />
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            icon={<FolderKanban className="size-6" />}
            title={
              projects.length === 0
                ? "Nenhum projeto cadastrado"
                : "Nenhum projeto encontrado"
            }
            description={
              projects.length === 0
                ? "Quando você criar projetos, eles aparecerão aqui."
                : "Tente alterar a busca ou selecionar outro status."
            }
            action={
              projects.length === 0 ? (
                <Link
                  to="/projects/new"
                  className={getButtonClassName({
                    variant: "secondary",
                    size: "sm",
                  })}
                >
                  <Plus className="size-4" />
                  <span>Criar primeiro projeto</span>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-zinc-950/60 text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Projeto</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Destaque</th>
                  <th className="px-5 py-3 font-medium">Atualizado em</th>
                  <th className="px-5 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800/80">
                {filteredProjects.map((project) => {
                  const isBusy = busyProjectId === project.id;

                  return (
                    <tr
                      key={project.id}
                      className="transition-colors hover:bg-zinc-800/20"
                    >
                      <td className="max-w-sm px-5 py-4">
                        <p className="truncate font-medium text-zinc-100">
                          {project.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-zinc-500">
                          /{project.slug}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={project.status} />
                      </td>

                      <td className="px-5 py-4 text-zinc-400">
                        {project.featured ? "Sim" : "Não"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-zinc-400">
                        {formatDate(project.updatedAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/projects/${project.id}/edit`}
                            className="font-medium text-zinc-300 underline decoration-zinc-700 underline-offset-4 hover:text-white"
                          >
                            Editar
                          </Link>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              void handlePublicationToggle(project)
                            }
                            className="cursor-pointer font-medium text-zinc-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isBusy
                              ? "Aguarde..."
                              : project.status === "PUBLISHED"
                                ? "Despublicar"
                                : "Publicar"}
                          </button>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => void handleDelete(project)}
                            className="cursor-pointer font-medium text-red-400 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
