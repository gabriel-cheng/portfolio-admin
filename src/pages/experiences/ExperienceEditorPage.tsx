import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";

import { experiencesApi } from "../../features/experiences/api/experiencesApi";
import { companiesApi } from "../../features/companies/api/companiesApi";
import type { Company } from "../../features/companies/types/company.types";
import {
  PageHeader,
  Card,
  Alert,
  LoadingState,
  Input,
  Select,
  Textarea,
  Checkbox,
  Button,
  getButtonClassName,
} from "../../components/ui";
import type {
  EmploymentType,
  ExperienceRequest,
} from "../../features/experiences/types/experience.types";

const initialForm: ExperienceRequest = {
  slug: "",
  companyId: undefined,
  company: "",
  role: "",
  employmentType: "FULL_TIME",
  location: "",
  description: "",
  startDate: "",
  endDate: null,
  current: false,
  displayOrder: 0,
  technologies: [],
};

const employmentTypeOptions: { value: EmploymentType; label: string }[] = [
  { value: "FULL_TIME", label: "Tempo integral" },
  { value: "PART_TIME", label: "Meio período" },
  { value: "CONTRACT", label: "Contrato" },
  { value: "FREELANCE", label: "Freelancer" },
  { value: "INTERNSHIP", label: "Estágio" },
  { value: "TEMPORARY", label: "Temporário" },
  { value: "OTHER", label: "Outro" },
];

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
      return "A experiência solicitada não foi encontrada.";
    }

    if (error.response.status === 400 || error.response.status === 422) {
      return "Os dados informados são inválidos. Revise os campos e tente novamente.";
    }

    return "Não foi possível salvar a experiência. Tente novamente.";
  }

  return "Ocorreu um erro inesperado.";
}

export function ExperienceEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState<ExperienceRequest>(initialForm);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isCustomCompany, setIsCustomCompany] = useState(false);
  const [technologiesInput, setTechnologiesInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const loadedCompanies = await companiesApi.list();

        if (cancelled) {
          return;
        }

        setCompanies(loadedCompanies);

        if (id) {
          const experience = await experiencesApi.getById(id);

          if (cancelled) {
            return;
          }

          const hasMatchedCompany = loadedCompanies.some(
            (c) => c.id === experience.companyId || c.name === experience.company,
          );

          setForm({
            slug: experience.slug,
            companyId: experience.companyId,
            company: experience.company,
            role: experience.role,
            employmentType: experience.employmentType,
            location: experience.location ?? "",
            description: experience.description,
            startDate: experience.startDate,
            endDate: experience.endDate,
            current: experience.current,
            displayOrder: experience.displayOrder,
            technologies: experience.technologies,
          });

          setIsCustomCompany(!hasMatchedCompany && !experience.companyId);
          setTechnologiesInput(experience.technologies.join(", "));
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

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function updateField<K extends keyof ExperienceRequest>(
    field: K,
    value: ExperienceRequest[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleCompanySelect(selectedValue: string) {
    if (selectedValue === "NEW_COMPANY") {
      setIsCustomCompany(true);
      setForm((current) => ({
        ...current,
        companyId: undefined,
        company: "",
      }));
    } else {
      setIsCustomCompany(false);
      const chosen = companies.find((c) => c.id === selectedValue);
      setForm((current) => ({
        ...current,
        companyId: chosen ? chosen.id : undefined,
        company: chosen ? chosen.name : "",
      }));
    }
  }

  async function handleSubmit() {
    setError(null);

    const technologies = technologiesInput
      .split(",")
      .map((technology) => technology.trim())
      .filter(Boolean);

    const request: ExperienceRequest = {
      ...form,
      slug: form.slug.trim(),
      companyId: form.companyId,
      company: form.company?.trim(),
      role: form.role.trim(),
      location: form.location?.trim() || null,
      description: form.description.trim(),
      endDate: form.current ? null : form.endDate || null,
      technologies,
    };

    if (
      !request.slug ||
      (!request.company && !request.companyId) ||
      !request.role ||
      !request.description ||
      !request.startDate
    ) {
      setError("Preencha todos os campos obrigatórios (incluindo a empresa).");
      return;
    }

    if (
      !request.current &&
      request.endDate &&
      request.endDate < request.startDate
    ) {
      setError("A data de término não pode ser anterior à data de início.");
      return;
    }

    setSaving(true);

    try {
      if (id) {
        await experiencesApi.update(id, request);
      } else {
        await experiencesApi.create(request);
      }

      navigate("/experiences", {
        state: {
          notice: id
            ? "Experiência atualizada com sucesso."
            : "Experiência criada com sucesso.",
        },
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState message="Carregando experiência..." />;
  }

  const companySelectOptions = [
    { value: "", label: "-- Selecionar empresa existente --" },
    ...companies.map((c) => ({ value: c.id, label: c.name })),
    { value: "NEW_COMPANY", label: "+ Cadastrar novo nome de empresa" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <PageHeader
        eyebrow="Portfolio content / Experiences"
        title={isEditing ? "Editar experiência" : "Nova experiência"}
        description={
          isEditing
            ? "Atualize as informações da sua experiência profissional."
            : "Cadastre uma experiência profissional para o seu portfólio."
        }
        actions={
          <Link
            to="/experiences"
            className={getButtonClassName({
              variant: "secondary",
              size: "sm",
            })}
          >
            <ArrowLeft className="size-4" />
            <span>Voltar para Experiências</span>
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
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h3 className="font-semibold text-zinc-100">
                Informações profissionais
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Identificação da empresa e da função exercida.
              </p>
            </div>

            <Link
              to="/companies"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white underline decoration-zinc-700 underline-offset-4"
            >
              <Building2 className="size-3.5" />
              <span>Gerenciar Empresas</span>
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-3">
              {companies.length > 0 && !isCustomCompany ? (
                <div>
                  <Select
                    id="companySelect"
                    label="Empresa"
                    required
                    value={form.companyId ?? ""}
                    onChange={(event) => handleCompanySelect(event.target.value)}
                    options={companySelectOptions}
                    hint="Selecione uma empresa já cadastrada ou clique em cadastrar novo nome."
                  />

                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsCustomCompany(true)}
                      className="text-xs text-blue-400 hover:underline cursor-pointer"
                    >
                      Prefiro digitar um novo nome de empresa
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <Input
                    id="company"
                    label="Nome da empresa"
                    required
                    maxLength={180}
                    value={form.company ?? ""}
                    onChange={(event) => updateField("company", event.target.value)}
                    placeholder="Ex.: Google, Nubank, Codes"
                    hint="A empresa será criada ou vinculada automaticamente pelo nome."
                  />

                  {companies.length > 0 && (
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsCustomCompany(false)}
                        className="text-xs text-blue-400 hover:underline cursor-pointer"
                      >
                        Selecionar da lista de empresas cadastradas ({companies.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Input
              id="role"
              label="Cargo"
              required
              maxLength={180}
              value={form.role}
              onChange={(event) => updateField("role", event.target.value)}
              placeholder="Ex.: Desenvolvedor Full-Stack"
            />

            <Input
              id="slug"
              label="Slug"
              required
              maxLength={180}
              value={form.slug}
              onChange={(event) => updateField("slug", event.target.value)}
              placeholder="empresa-cargo"
              hint="Identificador textual usado pela API e pelo portfólio."
            />

            <Select
              id="employmentType"
              label="Tipo de vínculo"
              required
              value={form.employmentType}
              onChange={(event) =>
                updateField(
                  "employmentType",
                  event.target.value as EmploymentType,
                )
              }
              options={employmentTypeOptions}
            />

            <Input
              id="location"
              label="Localização"
              maxLength={180}
              value={form.location ?? ""}
              onChange={(event) =>
                updateField("location", event.target.value)
              }
              placeholder="Ex.: Remoto · Brasil"
            />
          </div>
        </Card>

        <Card className="space-y-5 bg-zinc-900/40 p-5 sm:p-6">
          <div>
            <h3 className="font-semibold text-zinc-100">
              Período da experiência
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Informe as datas e se você ainda trabalha nessa empresa.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="startDate"
              type="date"
              label="Data de início"
              required
              value={form.startDate}
              onChange={(event) =>
                updateField("startDate", event.target.value)
              }
            />

            <Input
              id="endDate"
              type="date"
              label="Data de término"
              disabled={form.current}
              min={form.startDate || undefined}
              value={form.current ? "" : (form.endDate ?? "")}
              onChange={(event) =>
                updateField("endDate", event.target.value || null)
              }
            />

            <div className="sm:col-span-2">
              <Checkbox
                id="current"
                label="Trabalho atualmente nesta empresa"
                checked={form.current}
                onChange={(event) => {
                  const current = event.target.checked;

                  setForm((previous) => ({
                    ...previous,
                    current,
                    endDate: current ? null : previous.endDate,
                  }));
                }}
              />
            </div>
          </div>
        </Card>

        <Card className="space-y-5 bg-zinc-900/40 p-5 sm:p-6">
          <div>
            <h3 className="font-semibold text-zinc-100">
              Descrição e tecnologias
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Descreva as atividades realizadas e as tecnologias utilizadas.
            </p>
          </div>

          <Textarea
            id="description"
            label="Descrição"
            required
            rows={7}
            value={form.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            placeholder="Descreva suas responsabilidades, contribuições e resultados..."
            className="resize-y"
          />

          <Input
            id="technologies"
            label="Tecnologias"
            value={technologiesInput}
            onChange={(event) => setTechnologiesInput(event.target.value)}
            placeholder="Java, Spring Boot, PostgreSQL"
            hint="Separe as tecnologias por vírgulas."
          />

          <Input
            id="displayOrder"
            type="number"
            label="Ordem de exibição"
            min={0}
            step={1}
            required
            value={form.displayOrder}
            onChange={(event) =>
              updateField("displayOrder", Number(event.target.value))
            }
            hint="Valores menores aparecem primeiro."
          />
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/experiences"
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
                : "Criar experiência"}
          </Button>
        </div>
      </form>
    </div>
  );
}
