import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Plus, Building2, Briefcase, Globe, RefreshCw, ExternalLink } from "lucide-react";

import { companiesApi } from "../../features/companies/api/companiesApi";
import type { Company } from "../../features/companies/types/company.types";
import {
  PageHeader,
  StatCard,
  Alert,
  EmptyState,
  LoadingState,
  Input,
  Button,
  getButtonClassName,
} from "../../components/ui";

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

export function CompaniesPage() {
  const location = useLocation();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyCompanyId, setBusyCompanyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(
    (location.state as { notice?: string } | null)?.notice ?? null,
  );

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await companiesApi.list();
      setCompanies(result);
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
        const data = await companiesApi.list();

        if (!cancelled) {
          setCompanies(data);
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

  const filteredCompanies = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");

    return companies
      .filter((company) => {
        if (normalizedSearch.length === 0) {
          return true;
        }

        return [
          company.name,
          company.slug,
          company.description ?? "",
          company.website ?? "",
        ].some((value) =>
          value.toLocaleLowerCase("pt-BR").includes(normalizedSearch),
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [companies, search]);

  const totalExperiences = useMemo(() => {
    return companies.reduce(
      (sum, company) => sum + (company.experiences?.length ?? 0),
      0,
    );
  }, [companies]);

  const withWebsiteCount = useMemo(() => {
    return companies.filter((c) => Boolean(c.website)).length;
  }, [companies]);

  async function handleDelete(company: Company) {
    const experienceCount = company.experiences?.length ?? 0;
    const warning =
      experienceCount > 0
        ? ` ATENÇÃO: Esta empresa possui ${experienceCount} experiência(s) vinculada(s) que também serão excluídas!`
        : "";

    const confirmed = window.confirm(
      `Deseja realmente excluir a empresa "${company.name}"?${warning} Esta ação não pode ser desfeita.`,
    );

    if (!confirmed) {
      return;
    }

    setBusyCompanyId(company.id);
    setError(null);
    setNotice(null);

    try {
      await companiesApi.delete(company.id);

      setCompanies((current) =>
        current.filter((item) => item.id !== company.id),
      );

      setNotice(`A empresa "${company.name}" foi excluída com sucesso.`);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusyCompanyId(null);
    }
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Portfolio content / Companies"
        title="Empresas"
        description="Gerencie as empresas e organizações associadas às suas experiências profissionais."
        actions={
          <Link
            to="/companies/new"
            className={getButtonClassName({ variant: "primary", size: "md" })}
          >
            <Plus className="size-4" />
            <span>Nova empresa</span>
          </Link>
        }
      />

      <section
        aria-label="Resumo das empresas"
        className="grid gap-3 sm:grid-cols-3"
      >
        <StatCard
          label="Total de empresas"
          value={companies.length}
          icon={<Building2 className="size-5" />}
        />
        <StatCard
          label="Experiências vinculadas"
          value={totalExperiences}
          icon={<Briefcase className="size-5" />}
        />
        <StatCard
          label="Com website informado"
          value={withWebsiteCount}
          icon={<Globe className="size-5" />}
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
            onClick={() => void loadCompanies()}
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
              Todas as empresas
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              {filteredCompanies.length}{" "}
              {filteredCompanies.length === 1 ? "resultado" : "resultados"}
            </p>
          </div>

          <div className="w-full sm:w-80">
            <Input
              id="company-search"
              label="Buscar empresas"
              hideLabel
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome, slug, site..."
            />
          </div>
        </div>

        {loading ? (
          <LoadingState message="Carregando empresas..." />
        ) : filteredCompanies.length === 0 ? (
          <EmptyState
            icon={<Building2 className="size-6" />}
            title={
              companies.length === 0
                ? "Nenhuma empresa cadastrada"
                : "Nenhuma empresa encontrada"
            }
            description={
              companies.length === 0
                ? "Cadastre sua primeira empresa para associar experiências profissionais."
                : "Tente alterar os termos da busca."
            }
            action={
              companies.length === 0 ? (
                <Link
                  to="/companies/new"
                  className={getButtonClassName({
                    variant: "secondary",
                    size: "sm",
                  })}
                >
                  <Plus className="size-4" />
                  <span>Cadastrar primeira empresa</span>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-zinc-950/60 text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Empresa</th>
                  <th className="px-5 py-3 font-medium">Descrição</th>
                  <th className="px-5 py-3 font-medium">Experiências</th>
                  <th className="px-5 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800/80">
                {filteredCompanies.map((company) => {
                  const isBusy = busyCompanyId === company.id;
                  const expList = company.experiences ?? [];

                  return (
                    <tr
                      key={company.id}
                      className="transition-colors hover:bg-zinc-800/20"
                    >
                      <td className="max-w-xs px-5 py-4">
                        <div className="flex items-center gap-3">
                          {company.logoUrl ? (
                            <img
                              src={company.logoUrl}
                              alt={company.name}
                              className="size-9 rounded-lg border border-zinc-700 object-cover bg-zinc-800"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex size-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-xs font-semibold text-zinc-300">
                              {company.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate font-medium text-zinc-100">
                              {company.name}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-zinc-500">
                              /{company.slug}
                            </p>

                            {company.website && (
                              <a
                                href={
                                  company.website.startsWith("http")
                                    ? company.website
                                    : `https://${company.website}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-flex items-center gap-1 text-xs text-blue-400 hover:underline"
                              >
                                <span className="truncate max-w-[160px]">
                                  {company.website.replace(/^https?:\/\//, "")}
                                </span>
                                <ExternalLink className="size-3 shrink-0" />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="max-w-xs px-5 py-4 text-zinc-400">
                        <p className="line-clamp-2 text-xs leading-relaxed">
                          {company.description || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={[
                              "inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                              expList.length > 0
                                ? "bg-zinc-800 text-zinc-200 border border-zinc-700"
                                : "bg-zinc-900 text-zinc-500 border border-zinc-800",
                            ].join(" ")}
                          >
                            {expList.length}{" "}
                            {expList.length === 1
                              ? "experiência"
                              : "experiências"}
                          </span>

                          {expList.length > 0 && (
                            <p className="line-clamp-1 text-xs text-zinc-500">
                              {expList.map((e) => e.role).join(", ")}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/companies/${company.id}/edit`}
                            className="font-medium text-zinc-300 underline decoration-zinc-700 underline-offset-4 hover:text-white"
                          >
                            Editar
                          </Link>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => void handleDelete(company)}
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

