import { useState } from "react";

import { Alert, Button, Card, PageHeader } from "../../components/ui";

const API_BASE_URL = `${window.location.origin}/api/v1/public`;

interface Endpoint {
  method: "GET";
  path: string;
  description: string;
  examplePath: string;
  responseExample?: string;
  notes?: string[];
}

const endpoints: Endpoint[] = [
  {
    method: "GET",
    path: "/projects",
    description: "Lista os projetos publicados no portfólio.",
    examplePath: "/projects",
    notes: [
      "Retorna somente projetos disponíveis publicamente.",
      "A estrutura exata dos objetos depende do DTO de resposta implementado no backend.",
    ],
  },
  {
    method: "GET",
    path: "/projects/{slug}",
    description: "Busca um projeto publicado pelo seu slug.",
    examplePath: "/projects/meu-projeto",
    notes: [
      "Substitua {slug} pelo identificador textual do projeto.",
      "O projeto precisa estar publicado para ser retornado.",
    ],
  },
  {
    method: "GET",
    path: "/experiences",
    description: "Busca experiências individuais.",
    examplePath: "/experiences/desenvolvedor-fullstack",
  },
  {
    method: "GET",
    path: "/companies",
    description:
      "Lista as empresas publicadas e suas respectivas experiências profissionais.",
    examplePath: "/companies",
    responseExample: `[
  {
    "id": "uuid-da-empresa",
    "name": "Acme Corps",
    "slug": "acme-corp",
    "description": "Descrição da empresa",
    "website": "https://acme.com",
    "logoUrl": "https://cdn.example.com/logo.png",
    "experiences": [
      {
        "id": "uuid-da-experiencia",
        "slug": "desenvolvedor-full-stack",
        "companyId": "uuid-da-empresa",
        "role": "Desenvolvedor Full Stack",
        "employmentType": "FULL_TIME",
        "location": "São Paulo, SP",
        "description": "Atuação no desenvolvimento de sistemas.",
        "startDate": "2023-01-01",
        "endDate": null,
        "current": true,
        "displayOrder": 1,
        "technologies": [
          "Java",
          "Spring Boot",
          "React"
        ]
      }
    ]
  }
]`,
    notes: [
      "A empresa é a unidade de publicação. Não existe publicação individual de experiências.",
      "Empresas em rascunho não são retornadas pela API pública.",
      "As experiências são retornadas agrupadas dentro da empresa correspondente.",
      "Uma experiência adicionada a uma empresa publicada passa a integrar a resposta pública automaticamente.",
      "Empresas sem experiências não precisam ser exibidas no portfólio.",
    ],
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

function CodeExample({ value }: { value: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <pre className="text-sm leading-6 text-zinc-300">
        <code>{value}</code>
      </pre>
    </div>
  );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  return (
    <Card className="shadow-none">
      <div className="space-y-5">
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

        {endpoint.notes && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-200">Observações</h3>

            <ul className="list-inside list-disc space-y-2 text-sm leading-6 text-zinc-400">
              {endpoint.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {endpoint.responseExample && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-200">
              Exemplo de resposta
            </h3>

            <CodeExample value={endpoint.responseExample} />
          </div>
        )}
      </div>
    </Card>
  );
}

export function ApiDocsPage() {
  const fetchExample = `fetch("${API_BASE_URL}/companies")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Falha ao consultar empresas");
    }

    return response.json();
  })
  .then((companies) => console.log(companies))
  .catch((error) => console.error(error));`;

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
            <h2 className="text-lg font-semibold text-white">API pública</h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Utilize a URL base abaixo para consultar os recursos públicos
              disponibilizados pela aplicação.
            </p>
          </div>

          <CopyField label="Base URL" value={API_BASE_URL} />

          <Alert variant="info" title="Acesso público">
            Os endpoints desta seção utilizam HTTP GET e não exigem autenticação
            administrativa. A API retorna somente os dados disponibilizados
            publicamente pelo backend.
          </Alert>
        </div>
      </Card>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Endpoints disponíveis
          </h2>

          <p className="mt-1 text-sm leading-6 text-zinc-400">
            Consulte projetos e empresas com suas experiências profissionais.
          </p>
        </div>

        <div className="space-y-4">
          {endpoints.map((endpoint) => (
            <EndpointCard key={endpoint.path} endpoint={endpoint} />
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
              Exemplo de consumo do endpoint que lista as empresas e suas
              experiências.
            </p>
          </div>

          <CodeExample value={fetchExample} />

          <Button
            type="button"
            variant="secondary"
            onClick={() => void navigator.clipboard.writeText(fetchExample)}
          >
            Copiar exemplo
          </Button>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Publicação das experiências
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              A publicação é controlada pela empresa, e não por cada experiência
              individual.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="font-medium text-zinc-200">Empresa em rascunho</p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                A empresa e todas as suas experiências permanecem ocultas na API
                pública.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="font-medium text-zinc-200">Empresa publicada</p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                A empresa e suas experiências são disponibilizadas no endpoint
                público.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="font-medium text-zinc-200">
                Alterações nas experiências
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                Criar, editar ou excluir uma experiência altera os dados
                retornados pela API. Em empresas publicadas, as alterações
                passam a refletir no conteúdo público.
              </p>
            </div>
          </div>

          <Alert variant="info" title="Importante">
            Não procure um endpoint público independente para experiências. Elas
            são retornadas dentro do objeto da empresa em
            <code className="mx-1">GET /companies</code>.
          </Alert>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Autenticação e segurança
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              A API separa consultas públicas das operações administrativas.
            </p>
          </div>

          <ul className="list-inside list-disc space-y-3 text-sm leading-6 text-zinc-400">
            <li>Consultas públicas não exigem credenciais administrativas.</li>
            <li>
              Operações de criação, edição, publicação e exclusão devem utilizar
              os endpoints administrativos protegidos.
            </li>
            <li>
              A autenticação administrativa utiliza JWT armazenado em cookie
              HttpOnly.
            </li>
            <li>
              O frontend não deve tentar ler diretamente o JWT. O navegador
              gerencia o cookie nas requisições conforme as configurações de
              domínio e política do cookie.
            </li>
            <li>
              Nunca exponha senhas, tokens administrativos ou outros segredos no
              código público do frontend.
            </li>
          </ul>
        </div>
      </Card>

      <Card>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">
            Sobre os exemplos
          </h2>

          <p className="text-sm leading-6 text-zinc-400">
            Os exemplos de resposta ilustram a estrutura dos dados e podem
            conter valores fictícios. Para contratos completos, campos
            obrigatórios, códigos HTTP e detalhes dos endpoints administrativos,
            consulte os DTOs e controllers da versão atual do backend.
          </p>
        </div>
      </Card>
    </div>
  );
}
