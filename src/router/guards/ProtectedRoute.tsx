import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { authApi } from "../../features/auth/api/AuthApi";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

export function ProtectedRoute() {
  const [status, setStatus] = useState<AuthStatus>("checking");
  const location = useLocation();

  useEffect(() => {
    let active = true;

    authApi
      .getCurrentUser()
      .then(() => {
        if (active) {
          setStatus("authenticated");
        }
      })
      .catch(() => {
        if (active) {
          setStatus("unauthenticated");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="flex items-center gap-3 text-sm">
          <span className="size-4 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200" />
          Verificando sessão...
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
