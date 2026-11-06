import { createBrowserRouter } from "react-router";
import { LandingPage } from "@/features/landing/components/landing-page";
import { NotFoundPage } from "@/features/not-found/not-found-page";
import { RegisterPage } from "@/features/register/components/register-page";
import { LoginPage } from "@/features/login/components/login-page";
import { DashboardPage } from "@/features/dashboard/components/dashboard-page";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
