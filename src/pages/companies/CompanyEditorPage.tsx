import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Briefcase, ExternalLink } from "lucide-react";

import { companiesApi } from "../../features/companies/api/companiesApi";
import type { Company, CompanyRequest } from "../../features/companies/types/company.types";
import {
  PageHeader,
  Card,
  Alert,
  LoadingState,
  Input,
  Textarea,
  Button,
  getButtonClassName,
} from "../../components/ui";

const initialForm: CompanyRequest = {
  name: "",
  slug: "",
  description: "",
  website: "",
  logoUrl: "",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

    if (error.response.status === 404) {
      return "A empresa solicitada não foi encontrada.";
    }

    if (error.response.status === 409) {
      return "Já existe uma empresa com esse slug.";
    }

    if (error.response.status === 400 || error.response.status === 422) {
      return "Os dados informados são inválidos. Revise os campos e tente novamente.";
    }

    return "Não foi possível salvar a empresa. Tente novamente.";
  }

  return "Ocorreu um erro inesperado.";
}

export function CompanyEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState<CompanyRequest>(initialForm);
  const [existingCompany, setExistingCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSlugTouched, setIsSlugTouched] = useState(isEditing);

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    async function loadCompany(companyId: string) {
      try {
        setLoading(true);
        setError(null);

        const company = await companiesApi.getById(companyId);

        if (cancelled) {
          return;
        }

        setExistingCompany(company);
        setForm({
          name: company.name,
          slug: company.slug,
          description: company.description ?? "",
          website: company.website ?? "",
          logoUrl: company.logoUrl ?? "",
        });
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

    void loadCompany(id);

    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleNameChange(name: string) {
    setForm((current) => ({
      ...current,
      name,
      slug: isSlugTouched ? current.slug : slugify(name),
    }));
  }

  function updateField<K extends keyof CompanyRequest>(
    field: K,
    value: CompanyRequest[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit() {
    setError(null);

    const request: CompanyRequest = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description?.trim() || null,
      website: form.website?.trim() || null,
      logoUrl: form.logoUrl?.trim() || null,
    };

    if (!request.name) {
      setError("O nome da empresa é obrigatório.");
      return;
    }

    if (!request.slug) {
      setError("O slug da empresa é obrigatório.");
      return;
    }

    setSaving(true);

    try {
      if (id) {
        await companiesApi.update(id, request);
      } else {
        await companiesApi.create(request);
      }

      navigate("/companies", {
        state: {
          notice: id
            ? "Empresa atualizada com sucesso."
            : "Empresa criada com sucesso.",
        },
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState message="Carregando dados da empresa..." />;
  }

  const linkedExperiences = existingCompany?.experiences ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <PageHeader
        eyebrow="Portfolio content / Companies"
        title={isEditing ? "Editar empresa" : "Nova empresa"}
        description={
          isEditing
            ? "Atualize as informações da empresa e veja as experiências associadas."
            : "Cadastre uma nova empresa para relacionar às suas experiências profissionais."
        }
        actions={
          <Link
            to="/companies"
            className={getButtonClassName({
              variant: "secondary",
              size: "sm",
            })}
          >
            <ArrowLeft className="size-4" />
            <span>Voltar para Empresas</span>
          </Link>
        }
      />

      {error && <Alert variant="error">{error}</Alert>}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
        className="space-y-6"
      >
        <Card className="space-y-5 bg-zinc-900/40 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-300">
              <Building2 className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-100">
                Informações da empresa
              </h3>
              <p className="text-sm text-zinc-500">
                Dados cadastrais e identificadores da organização.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="name"
              label="Nome da empresa"
              required
              maxLength={180}
              value={form.name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="Ex.: Google, Nubank, Codes"
            />

            <Input
              id="slug"
              label="Slug"
              required
              maxLength={180}
              value={form.slug}
              onChange={(event) => {
                setIsSlugTouched(true);
                updateField("slug", event.target.value);
              }}
              placeholder="ex.: nome-da-empresa"
              hint="Identificador textual único usado pela API."
            />

            <Input
              id="website"
              label="Website oficial"
              maxLength={255}
              value={form.website ?? ""}
              onChange={(event) => updateField("website", event.target.value)}
              placeholder="https://exemplo.com"
            />

            <Input
              id="logoUrl"
              label="URL do logotipo"
              maxLength={500}
              value={form.logoUrl ?? ""}
              onChange={(event) => updateField("logoUrl", event.target.value)}
              placeholder="https://exemplo.com/logo.png"
            />

            {form.logoUrl && (
              <div className="sm:col-span-2 flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
                <span className="text-xs text-zinc-400">Pré-visualização do logo:</span>
                <img
                  src={form.logoUrl}
                  alt="Logo preview"
                  className="size-8 rounded border border-zinc-700 object-contain bg-zinc-900"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="sm:col-span-2">
              <Textarea
                id="description"
                label="Descrição da empresa"
                rows={4}
                value={form.description ?? ""}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Breve resumo sobre a empresa, setor de atuação, produtos ou serviços..."
                className="resize-y"
              />
            </div>
          </div>
        </Card>

        {isEditing && (
          <Card className="space-y-4 bg-zinc-900/40 p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300">
                  <Briefcase className="size-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100">
                    Experiências vinculadas ({linkedExperiences.length})
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Cargos e atuações associados a esta empresa no seu portfólio.
                  </p>
                </div>
              </div>

              <Link
                to="/experiences/new"
                className={getButtonClassName({
                  variant: "secondary",
                  size: "sm",
                })}
              >
                + Adicionar experiência
              </Link>
            </div>

            {linkedExperiences.length === 0 ? (
              <p className="text-sm text-zinc-500 italic py-2">
                Nenhuma experiência profissional vinculada a esta empresa ainda.
              </p>
            ) : (
              <div className="divide-y divide-zinc-800/80">
                {linkedExperiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <p className="font-medium text-sm text-zinc-200">
                        {exp.role}
                      </p>
                      <p className="text-xs text-zinc-500">
                        /{exp.slug} · {exp.startDate} – {exp.current ? "Atual" : exp.endDate || "—"}
                      </p>
                    </div>

                    <Link
                      to={`/experiences/${exp.id}/edit`}
                      className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white underline decoration-zinc-700 underline-offset-4"
                    >
                      <span>Editar experiência</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/companies"
            className={getButtonClassName({
              variant: "secondary",
              size: "md",
            })}
          >
            Cancelar
          </Link>

          <Button type="submit" variant="primary" size="md" loading={saving}>
            {saving
              ? "Salvando..."
              : isEditing
                ? "Salvar alterações"
                : "Criar empresa"}
          </Button>
        </div>
      </form>
    </div>
  );
}

