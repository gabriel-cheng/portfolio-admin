import { useState } from "react";

import { Alert, Button, Card, PageHeader } from "../../components/ui";

const API_BASE_URL = `${window.location.origin}/api/v1/public`;

interface Endpoint {
  method: "GET";
  path: string;
  description: string;
  examplePath: string;
}

const endpoints: Endpoint[] = [
  {
    method: "GET",
    path: "/projects",
    description: "Lista os projetos publicados no portfólio.",
    examplePath: "/projects",
  },
  {
    method: "GET",
    path: "/projects/{slug}",
    description: "Busca um projeto publicado pelo seu slug.",
    examplePath: "/projects/meu-projeto",
  },
  {
    method: "GET",
    path: "/experiences",
    description: "Lista as experiências profissionais publicadas.",
    examplePath: "/experiences",
  },
  {
    method: "GET",
    path: "/experiences/{slug}",
    description: "Busca uma experiência publicada pelo seu slug.",
    examplePath: "/experiences/desenvolvedor-full-stack",
  },
];

function CopyField({ label, value }: { label: string; value: string }) {
  const [feedback, setFeedback] = useState<"idle" | "success" | "error">(
    "idle",
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setFeedback("success");
    } catch {
      setFeedback("error");
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-zinc-300">{label}</p>

      <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-3 sm:flex-row sm:items-center">
        <code className="min-w-0 flex-1 break-all text-sm leading-6 text-zinc-200">
          {value}
        </code>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => void handleCopy()}
          className="shrink-0"
        >
          {feedback === "success" ? "Copiado" : "Copiar"}
        </Button>
      </div>

      {feedback === "success" && (
        <Alert variant="success">
          Conteúdo copiado para a área de transferência.
        </Alert>
      )}

      {feedback === "error" && (
        <Alert variant="error">
          Não foi possível copiar automaticamente. Selecione e copie o texto
          manualmente.
        </Alert>
      )}
    </div>
  );
}

function MethodBadge({ method }: { method: Endpoint["method"] }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-md border border-emerald-900 bg-emerald-950/40 px-2 py-1 text-xs font-semibold text-emerald-300">
      {method}
    </span>
  );
}

export function ApiDocsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Desenvolvedores"
        title="Documentação da API"
        description="Referência dos endpoints públicos disponíveis para integração com os dados do portfólio."
      />

      <Card>
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Endpoint base público
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Utilize esta URL como base para consultar os recursos públicos da
              aplicação.
            </p>
          </div>

          <CopyField label="Base URL" value={API_BASE_URL} />

          <Alert variant="info" title="Método de acesso">
            Os endpoints documentados nesta página utilizam o método HTTP GET
            para consulta de dados. As operações administrativas devem utilizar
            os endpoints protegidos da API.
          </Alert>
        </div>
      </Card>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Endpoints disponíveis
          </h2>

          <p className="mt-1 text-sm leading-6 text-zinc-400">
            Recursos de projetos e experiências profissionais.
          </p>
        </div>

        <div className="space-y-4">
          {endpoints.map((endpoint) => (
            <Card key={endpoint.path} className="shadow-none">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <MethodBadge method={endpoint.method} />

                  <code className="break-all text-sm text-zinc-100">
                    {endpoint.path}
                  </code>
                </div>

                <p className="text-sm leading-6 text-zinc-400">
                  {endpoint.description}
                </p>

                <CopyField
                  label="URL completa"
                  value={`${API_BASE_URL}${endpoint.examplePath}`}
                />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Card>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Exemplo de utilização
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Exemplo de consumo do endpoint que lista os projetos públicos.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <pre className="text-sm leading-6 text-zinc-300">
              <code>{`fetch("${API_BASE_URL}/projects")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Falha ao consultar projetos");
    }

    return response.json();
  })
  .then((projects) => console.log(projects))
  .catch((error) => console.error(error));`}</code>
            </pre>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              void navigator.clipboard.writeText(
                `fetch("${API_BASE_URL}/projects")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Falha ao consultar projetos");
    }
    return response.json();
  })
  .then((projects) => console.log(projects))
  .catch((error) => console.error(error));`,
              )
            }
          >
            Copiar exemplo
          </Button>

          <p className="text-xs leading-5 text-zinc-500">
            O formato exato da resposta depende do contrato implementado pelo
            backend.
          </p>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Autenticação e segurança
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Diferencie as consultas públicas das operações administrativas.
            </p>
          </div>

          <ul className="list-inside list-disc space-y-3 text-sm leading-6 text-zinc-400">
            <li>
              As consultas públicas devem estar disponíveis sem credenciais
              administrativas, conforme as regras do backend.
            </li>
            <li>
              Criação, edição, publicação e exclusão devem utilizar as rotas
              administrativas protegidas.
            </li>
            <li>
              Nunca exponha senhas, tokens administrativos ou outros segredos no
              código público do frontend.
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
