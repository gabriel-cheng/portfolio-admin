import { Outlet } from "react-router-dom";

import { RouteTitle } from "./RouteTitle";

export function RootLayout() {
  return (
    <>
      <RouteTitle />
      <Outlet />
    </>
  );
}
