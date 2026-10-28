import { createBrowserRouter, Navigate } from "react-router-dom";

import { AdminLayout } from "../components/layouts/AdminLayout";
import { AuthLayout } from "../components/layouts/AuthLayout";
import { RootLayout } from "../components/layouts/RootLayout";

import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { ExperiencesPage } from "../pages/experiences/ExperiencesPage";
import { LoginPage } from "../pages/login/LoginPage";
import { ProjectsPage } from "../pages/projects/ProjectsPage";

import { RouteErrorPage } from "../components/layouts/RouteErrorPage";
import { ProtectedRoute } from "./guards/ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
            handle: {
              title: "Login | GH Carvalho",
            },
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                path: "/dashboard",
                element: <DashboardPage />,
                handle: {
                  title: "Dashboard | GH Carvalho",
                },
              },
              {
                path: "/projects",
                element: <ProjectsPage />,
                handle: {
                  title: "Projects | GH Carvalho",
                },
              },
              {
                path: "/experiences",
                element: <ExperiencesPage />,
                handle: {
                  title: "Experiences | GH Carvalho",
                },
              },
            ],
          },
        ],
      },
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "*",
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);
