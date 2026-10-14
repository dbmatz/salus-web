import { Link } from "react-router";
import { buttonVariants } from "@/shared/components/ui/button";
import { PassionFlower } from "@/shared/components/brand/passion-flower";

export function LandingHero() {
  return (
    <section className="mx-auto grid w-full max-w-5xl items-center gap-10 px-4 pt-8 pb-16 md:grid-cols-2 md:gap-12 md:pt-16 md:pb-24">
      <div className="space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          Um espaço tranquilo para contar como foi o seu dia
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
          O Salus ajuda você a registrar suas emoções e seus hábitos com calma,
          e a perceber como eles mudam com o tempo.
        </p>
        <Link
          to="/register"
          className={buttonVariants({
            size: "lg",
            className: "h-11 px-5 text-base",
          })}
        >
          Criar minha conta
        </Link>
      </div>
      <div className="flex justify-center">
        <PassionFlower className="size-64 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-90 motion-safe:duration-1000 md:size-96" />
      </div>
    </section>
  );
}
