import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { authApi } from "../api/AuthApi";
import { Alert, Button, Input } from "../../../components/ui";

export function LoginForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: Parameters<NonNullable<React.ComponentProps<"form">["onSubmit"]>>[0],
  ) {
    event.preventDefault();

    if (isSubmitting) return;

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await authApi.login({
        username: username.trim(),
        password,
      });

      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setErrorMessage("Usuário ou senha inválidos.");
        } else if (!error.response) {
          setErrorMessage("Não foi possível conectar ao servidor.");
        } else {
          setErrorMessage(
            "Não foi possível realizar o login. Tente novamente.",
          );
        }
      } else {
        setErrorMessage("Ocorreu um erro inesperado.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        id="username"
        name="username"
        label="Usuário"
        type="text"
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        autoFocus
        required
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        disabled={isSubmitting}
        placeholder="Seu usuário"
      />

      <Input
        id="password"
        name="password"
        label="Senha"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={isSubmitting}
        placeholder="Sua senha"
      />

      {errorMessage && (
        <Alert variant="error">{errorMessage}</Alert>
      )}

      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={isSubmitting}
        disabled={!username.trim() || !password}
      >
        {isSubmitting ? "Entrando..." : "Entrar no painel"}
      </Button>
    </form>
  );
}
