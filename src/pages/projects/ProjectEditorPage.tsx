import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

import {
  projectsApi,
  type ProjectRequest,
} from "../../features/projects/api/projectsApi";
import {
  PageHeader,
  Card,
  Alert,
  LoadingState,
  Input,
  Textarea,
  Checkbox,
  Button,
  getButtonClassName,
} from "../../components/ui";

const initialForm: ProjectRequest = {
  title: "",
  slug: "",
  summary: "",
  content: {},
  featured: false,
  displayOrder: 0,
};

export function ProjectEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState<ProjectRequest>(initialForm);
  const [contentJson, setContentJson] = useState("{}");
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    async function loadProject() {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          return;
        }

        const project = await projectsApi.getById(id);

        if (cancelled) {
          return;
        }

        setForm({
          title: project.title,
          slug: project.slug,
          summary: project.summary,
          content: project.content,
          featured: project.featured,
          displayOrder: project.displayOrder,
        });

        setContentJson(JSON.stringify(project.content ?? {}, null, 2));
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setError("Sua sessão expirou. Entre novamente.");
          } else if (error.response?.status === 403) {
            setError("Você não tem permissão para consultar este projeto.");
          } else if (error.response?.status === 404) {
            setError("Projeto não encontrado.");
          } else {
            setError("Não foi possível carregar o projeto.");
          }
        } else {
          setError("Ocorreu um erro inesperado ao carregar o projeto.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProject();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function updateField<K extends keyof ProjectRequest>(
    field: K,
    value: ProjectRequest[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit() {
    setError(null);

    let parsedContent: unknown;

    try {
      parsedContent = JSON.parse(contentJson);
    } catch {
      setError("O conteúdo precisa ser um JSON válido.");
      return;
    }

    const request: ProjectRequest = {
      ...form,
      content: parsedContent,
    };

    setSaving(true);

    try {
      if (id) {
        await projectsApi.update(id, request);
      } else {
        await projectsApi.create(request);
      }

      navigate("/projects", {
        replace: true,
      });
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        if (requestError.response?.status === 401) {
          setError("Sua sessão expirou. Entre novamente.");
        } else if (requestError.response?.status === 403) {
          setError("Você não tem permissão para salvar projetos.");
        } else if (requestError.response?.status === 400) {
          setError(
            "A API rejeitou os dados. Confira os campos e o formato do conteúdo.",
          );
        } else {
          setError("Não foi possível salvar o projeto. Tente novamente.");
        }
      } else {
        setError("Ocorreu um erro inesperado ao salvar o projeto.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState message="Carregando projeto..." />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <PageHeader
        eyebrow="Portfolio content / Projects"
        title={isEditing ? "Editar projeto" : "Novo projeto"}
        description="Preencha os dados do projeto. O conteúdo deve respeitar a estrutura JSON esperada pelo backend."
        actions={
          <Link
            to="/projects"
            className={getButtonClassName({
              variant: "secondary",
              size: "sm",
            })}
          >
            <ArrowLeft className="size-4" />
            <span>Voltar para Projetos</span>
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
        <Card className="space-y-6 bg-zinc-900/40 p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="title"
              label="Título"
              required
              maxLength={160}
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Nome do projeto"
            />

            <Input
              id="slug"
              label="Slug"
              required
              maxLength={180}
              value={form.slug}
              onChange={(event) => updateField("slug", event.target.value)}
              placeholder="meu-projeto"
            />
          </div>

          <Textarea
            id="summary"
            label="Resumo"
            required
            rows={3}
            maxLength={1000}
            value={form.summary}
            onChange={(event) => updateField("summary", event.target.value)}
            placeholder="Uma breve descrição do projeto"
          />

          <Textarea
            id="content"
            label="Conteúdo (JSON)"
            required
            rows={12}
            spellCheck={false}
            value={contentJson}
            onChange={(event) => setContentJson(event.target.value)}
            className="font-mono text-xs leading-6"
            placeholder={'{\n  "description": "..."\n}'}
            hint="O JSON será enviado como objeto, não como texto. Os campos internos dependem do contrato de conteúdo definido no backend."
          />

          <div className="grid gap-5 sm:grid-cols-2 sm:items-start">
            <Input
              id="displayOrder"
              type="number"
              label="Ordem de exibição"
              min={0}
              required
              value={form.displayOrder}
              onChange={(event) =>
                updateField("displayOrder", Number(event.target.value))
              }
              hint="Valores menores aparecem primeiro."
            />

            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
              <Checkbox
                id="featured"
                label="Projeto em destaque"
                description="Marcar como conteúdo destacado."
                checked={form.featured}
                onChange={(event) =>
                  updateField("featured", event.target.checked)
                }
              />
            </div>
          </div>

          <div className="flex flex-col-reverse justify-end gap-3 border-t border-zinc-800 pt-5 sm:flex-row">
            <Link
              to="/projects"
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
                  : "Criar projeto"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
