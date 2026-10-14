import { createBrowserRouter } from "react-router";
import { LandingPage } from "@/features/landing/components/landing-page";
import { NotFoundPage } from "@/features/not-found/not-found-page";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
