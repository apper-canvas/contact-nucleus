import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { getRouteConfig } from "@/router/route.utils";
import MainLayout from "@/layouts/MainLayout";
import Root from "@/layouts/Root";

// Lazy load page components
const Login = lazy(() => import("@/components/pages/Login"));
const Signup = lazy(() => import("@/components/pages/Signup"));
const Callback = lazy(() => import("@/components/pages/Callback"));
const ErrorPage = lazy(() => import("@/components/pages/ErrorPage"));
const ResetPassword = lazy(() => import("@/components/pages/ResetPassword"));
const PromptPassword = lazy(() => import("@/components/pages/PromptPassword"));
const ContactsPage = lazy(() => import("@/components/pages/ContactsPage"));
const CompaniesPage = lazy(() => import("@/components/pages/CompaniesPage"));
const DealsPage = lazy(() => import("@/components/pages/DealsPage"));
const TasksPage = lazy(() => import("@/components/pages/TasksPage"));
const ActivitiesPage = lazy(() => import("@/components/pages/ActivitiesPage"));
const QuotesPage = lazy(() => import("@/components/pages/QuotesPage"));
const InvoicesPage = lazy(() => import("@/components/pages/InvoicesPage"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-green-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

// Helper to create route configuration with access control
const createRoute = ({
  path,
  index,
  element,
  access,
  children,
  ...meta
}) => {
  // Get config for this route
  let configPath;
  if (index) {
    configPath = "/";
  } else {
    configPath = path.startsWith('/') ? path : `/${path}`;
  }

  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;

  const route = {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<LoadingFallback />}>{element}</Suspense> : element,
    handle: {
      access: finalAccess,
      ...meta,
    },
  };

  if (children && children.length > 0) {
    route.children = children;
  }

  return route;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      // Auth routes (public)
      createRoute({ path: "login", element: <Login /> }),
      createRoute({ path: "signup", element: <Signup /> }),
      createRoute({ path: "callback", element: <Callback /> }),
      createRoute({ path: "error", element: <ErrorPage /> }),
      createRoute({ path: "reset-password/:appId/:fields", element: <ResetPassword /> }),
      createRoute({ path: "prompt-password/:appId/:emailAddress/:provider", element: <PromptPassword /> }),
      
      // Main app routes (authenticated)
{
        element: <MainLayout />,
        children: [
          createRoute({ index: true, element: <ContactsPage /> }),
          createRoute({ path: "contacts", element: <ContactsPage /> }),
          createRoute({ path: "companies", element: <CompaniesPage /> }),
          createRoute({ path: "deals", element: <DealsPage /> }),
          createRoute({ path: "tasks", element: <TasksPage /> }),
          createRoute({ path: "activities", element: <ActivitiesPage /> }),
          createRoute({ path: "quotes", element: <QuotesPage /> }),
          createRoute({ path: "invoices", element: <InvoicesPage /> }),
          createRoute({
            path: "*",
            element: <NotFound />,
          }),
        ],
      },
    ],
  },
]);