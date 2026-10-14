import { createBrowserRouter } from "react-router";
import { LandingPage } from "@/features/landing/components/landing-page";
import { NotFoundPage } from "@/features/not-found/not-found-page";
import { RegisterPage } from "@/features/register/components/register-page";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
