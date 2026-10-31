import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Plus, Briefcase, Building2, Cpu, RefreshCw, Info } from "lucide-react";

import { experiencesApi } from "../../features/experiences/api/experiencesApi";
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
  EmploymentType,
  Experience,
} from "../../features/experiences/types/experience.types";

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

function formatDate(value: string | null): string {
  if (!value) {
    return "—";
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return "—";
  }

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatEmploymentType(type: EmploymentType): string {
  const labels: Record<EmploymentType, string> = {
    FULL_TIME: "Tempo integral",
    PART_TIME: "Meio período",
    CONTRACT: "Contrato",
    FREELANCE: "Freelancer",
    INTERNSHIP: "Estágio",
    TEMPORARY: "Temporário",
    OTHER: "Outro",
  };

  return labels[type] ?? type;
}

function formatPeriod(experience: Experience): string {
  const start = formatDate(experience.startDate);
  const end = experience.current ? "Atual" : formatDate(experience.endDate);

  return `${start} – ${end}`;
}

export function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [busyExperienceId, setBusyExperienceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadExperiences = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await experiencesApi.list();
      setExperiences(result);
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
        setError(null);

        const data = await experiencesApi.list();

        if (!cancelled) {
          setExperiences(data);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(getErrorMessage(requestError));
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

  const uniqueCompanies = useMemo(() => {
    const map = new Map<string, string>();
    for (const exp of experiences) {
      if (exp.company) {
        map.set(exp.company, exp.company);
      }
    }
    return Array.from(map.keys()).sort();
  }, [experiences]);

  const filteredExperiences = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");

    return experiences
      .filter((experience) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          [
            experience.company,
            experience.role,
            experience.slug,
            experience.location ?? "",
            ...experience.technologies,
          ].some((value) =>
            value.toLocaleLowerCase("pt-BR").includes(normalizedSearch),
          );

        const matchesCompany =
          selectedCompany === "ALL" || experience.company === selectedCompany;

        return matchesSearch && matchesCompany;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [experiences, search, selectedCompany]);

  const uniqueTechnologiesCount = useMemo(() => {
    const techSet = new Set<string>();
    for (const exp of experiences) {
      for (const tech of exp.technologies) {
        techSet.add(tech.toLowerCase());
      }
    }
    return techSet.size;
  }, [experiences]);

  async function handleDelete(experience: Experience) {
    const confirmed = window.confirm(
      `Deseja realmente excluir a experiência "${experience.role}" na empresa "${experience.company}"? Esta ação não pode ser desfeita.`,
    );

    if (!confirmed) {
      return;
    }

    setBusyExperienceId(experience.id);
    setError(null);
    setNotice(null);

    try {
      await experiencesApi.delete(experience.id);

      setExperiences((current) =>
        current.filter((item) => item.id !== experience.id),
      );

      setNotice(
        `A experiência "${experience.role}" em "${experience.company}" foi excluída.`,
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusyExperienceId(null);
    }
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Portfolio content / Experiences"
        title="Experiências profissionais"
        description="Gerencie os cargos e trajetórias de cada empresa. A publicação pública é controlada através do status da empresa."
        actions={
          <Link
            to="/experiences/new"
            className={getButtonClassName({ variant: "primary", size: "md" })}
          >
            <Plus className="size-4" />
            <span>Nova experiência</span>
          </Link>
        }
      />

      <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-xs leading-relaxed text-blue-200">
        <Info className="size-4 shrink-0 text-blue-400 mt-0.5" />
        <p>
          <strong>Publicação unificada:</strong> As experiências não possuem
          publicação individual. Todas as experiências de uma empresa publicada
          são exibidas no portfólio público, enquanto empresas em rascunho
          permanecem ocultas. Para alterar a visibilidade pública, gerencie o
          status na página de{" "}
          <Link
            to="/companies"
            className="font-medium underline underline-offset-2 hover:text-white"
          >
            Empresas
          </Link>
          .
        </p>
      </div>

      <section
        aria-label="Resumo das experiências"
        className="grid gap-3 sm:grid-cols-3"
      >
        <StatCard
          label="Total de experiências"
          value={experiences.length}
          icon={<Briefcase className="size-5" />}
        />
        <StatCard
          label="Empresas com experiências"
          value={uniqueCompanies.length}
          icon={<Building2 className="size-5" />}
        />
        <StatCard
          label="Tecnologias catalogadas"
          value={uniqueTechnologiesCount}
          icon={<Cpu className="size-5" />}
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
            onClick={() => void loadExperiences()}
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
            <h3 className="font-semibold text-zinc-100">
              Todas as experiências
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              {filteredExperiences.length}{" "}
              {filteredExperiences.length === 1 ? "resultado" : "resultados"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="w-full sm:w-72">
              <Input
                id="experience-search"
                label="Buscar experiências"
                hideLabel
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar cargo, empresa, tecnologia..."
              />
            </div>

            {uniqueCompanies.length > 0 && (
              <div className="w-full sm:w-56">
                <Select
                  id="experience-company-filter"
                  label="Filtrar por empresa"
                  hideLabel
                  value={selectedCompany}
                  onChange={(event) => setSelectedCompany(event.target.value)}
                  options={[
                    { value: "ALL", label: "Todas as empresas" },
                    ...uniqueCompanies.map((c) => ({ value: c, label: c })),
                  ]}
                />
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <LoadingState message="Carregando experiências..." />
        ) : filteredExperiences.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="size-6" />}
            title={
              experiences.length === 0
                ? "Nenhuma experiência cadastrada"
                : "Nenhuma experiência encontrada"
            }
            description={
              experiences.length === 0
                ? "Quando você cadastrar experiências, elas aparecerão aqui."
                : "Tente alterar a busca ou selecionar outra empresa."
            }
            action={
              experiences.length === 0 ? (
                <Link
                  to="/experiences/new"
                  className={getButtonClassName({
                    variant: "secondary",
                    size: "sm",
                  })}
                >
                  <Plus className="size-4" />
                  <span>Criar primeira experiência</span>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-zinc-950/60 text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Cargo / Experiência</th>
                  <th className="px-5 py-3 font-medium">Empresa</th>
                  <th className="px-5 py-3 font-medium">Status da Empresa</th>
                  <th className="px-5 py-3 font-medium">Vínculo</th>
                  <th className="px-5 py-3 font-medium">Período</th>
                  <th className="px-5 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800/80">
                {filteredExperiences.map((experience) => {
                  const isBusy = busyExperienceId === experience.id;
                  const companyStatus =
                    experience.companyDetails?.status ?? "DRAFT";

                  return (
                    <tr
                      key={experience.id}
                      className="transition-colors hover:bg-zinc-800/20"
                    >
                      <td className="max-w-xs px-5 py-4">
                        <p className="truncate font-medium text-zinc-100">
                          {experience.role}
                        </p>

                        <p className="mt-1 truncate text-xs text-zinc-500">
                          /{experience.slug}
                        </p>

                        {experience.technologies.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {experience.technologies.slice(0, 3).map((tech) => (
                              <span
                                key={tech}
                                className="inline-block rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400 border border-zinc-700/60"
                              >
                                {tech}
                              </span>
                            ))}
                            {experience.technologies.length > 3 && (
                              <span className="text-[10px] text-zinc-500 self-center">
                                +{experience.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-200">
                            {experience.company}
                          </span>
                          {experience.location && (
                            <span className="text-xs text-zinc-500">
                              {experience.location}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={companyStatus} />
                          <span className="text-[11px] text-zinc-500">
                            {companyStatus === "PUBLISHED"
                              ? "Visível"
                              : "Oculta"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-zinc-400">
                        {formatEmploymentType(experience.employmentType)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-zinc-400">
                        {formatPeriod(experience)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/experiences/${experience.id}/edit`}
                            className="font-medium text-zinc-300 underline decoration-zinc-700 underline-offset-4 hover:text-white"
                          >
                            Editar
                          </Link>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => void handleDelete(experience)}
                            className="cursor-pointer font-medium text-red-400 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isBusy ? "Excluindo..." : "Excluir"}
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
