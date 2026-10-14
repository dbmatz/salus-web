import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-3 px-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        Não encontramos esta página
      </h1>
      <p className="text-muted-foreground">
        O endereço pode ter mudado. Você pode voltar para o início.
      </p>
      <Link
        to="/"
        className="inline-flex h-11 items-center text-primary underline"
      >
        Ir para o início
      </Link>
    </main>
  );
}
