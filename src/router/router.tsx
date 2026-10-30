import { createBrowserRouter, Navigate } from "react-router-dom";

import { AdminLayout } from "../components/layouts/AdminLayout";
import { AuthLayout } from "../components/layouts/AuthLayout";
import { RootLayout } from "../components/layouts/RootLayout";

import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { CompaniesPage } from "../pages/companies/CompaniesPage";
import { CompanyEditorPage } from "../pages/companies/CompanyEditorPage";
import { ExperiencesPage } from "../pages/experiences/ExperiencesPage";
import { LoginPage } from "../pages/login/LoginPage";
import { ProjectsPage } from "../pages/projects/ProjectsPage";

import { RouteErrorPage } from "../components/layouts/RouteErrorPage";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import { ProjectEditorPage } from "../pages/projects/ProjectEditorPage";
import { ExperienceEditorPage } from "../pages/experiences/ExperienceEditorPage";
import { ApiDocsPage } from "../pages/docs/ApiDocsPage";

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
                path: "/projects/new",
                element: <ProjectEditorPage />,
                handle: {
                  title: "Novo projeto | GH Carvalho",
                },
              },
              {
                path: "/projects/:id/edit",
                element: <ProjectEditorPage />,
                handle: {
                  title: "Editar projeto | GH Carvalho",
                },
              },
              {
                path: "/companies",
                element: <CompaniesPage />,
                handle: {
                  title: "Empresas | GH Carvalho",
                },
              },
              {
                path: "/companies/new",
                element: <CompanyEditorPage />,
                handle: {
                  title: "Nova empresa | GH Carvalho",
                },
              },
              {
                path: "/companies/:id/edit",
                element: <CompanyEditorPage />,
                handle: {
                  title: "Editar empresa | GH Carvalho",
                },
              },
              {
                path: "/experiences",
                element: <ExperiencesPage />,
                handle: {
                  title: "Experiences | GH Carvalho",
                },
              },
              {
                path: "/experiences/new",
                element: <ExperienceEditorPage />,
                handle: {
                  title: "Nova experiência | GH Carvalho",
                },
              },
              {
                path: "/experiences/:id/edit",
                element: <ExperienceEditorPage />,
                handle: {
                  title: "Editar experiência | GH Carvalho",
                },
              },
              {
                path: "/docs/api",
                element: <ApiDocsPage />,
                handle: {
                  title: "Docs | GH Carvalho",
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
