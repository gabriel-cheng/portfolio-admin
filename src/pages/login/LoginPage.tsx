import { Brand } from "../../components/ui/Brand";
import { Card } from "../../components/ui/Card";
import { LoginForm } from "../../components/layouts/LoginForm";

export function LoginPage() {
  return (
    <div className="space-y-8">
      <header>
        <Brand description="Entre com suas credenciais para acessar o painel administrativo." />

        <h1 className="mt-6 text-center text-3xl font-semibold tracking-tight text-white">
          Bem-vindo de volta
        </h1>
      </header>

      <Card>
        <div className="mb-6">
          <h2 className="text-base font-semibold text-zinc-100">
            Acessar conta
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Informe seu usuário e sua senha.
          </p>
        </div>

        <LoginForm />
      </Card>
    </div>
  );
}
