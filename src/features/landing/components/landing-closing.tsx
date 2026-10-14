import { Link } from "react-router";
import { buttonVariants } from "@/shared/components/ui/button";

export function LandingClosing() {
  return (
    <section className="mx-auto w-full max-w-5xl space-y-6 px-4 py-16 md:py-24">
      <h2 className="max-w-md text-2xl font-semibold tracking-tight text-balance md:text-3xl">
        Quando quiser, comece pelo dia de hoje
      </h2>
      <Link
        to="/register"
        className={buttonVariants({
          size: "lg",
          className: "h-11 px-5 text-base",
        })}
      >
        Criar minha conta
      </Link>
    </section>
  );
}
