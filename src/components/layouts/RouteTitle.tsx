import { useEffect } from "react";
import { useMatches } from "react-router-dom";

interface RouteHandle {
  title?: string;
}

export function RouteTitle() {
  const matches = useMatches();

  useEffect(() => {
    const currentMatch = [...matches].reverse().find((match) => {
      const handle = match.handle as RouteHandle | undefined;
      return Boolean(handle?.title);
    });

    const handle = currentMatch?.handle as RouteHandle | undefined;

    document.title = handle?.title ?? "Administração | GH Carvalho";
  }, [matches]);

  return null;
}
