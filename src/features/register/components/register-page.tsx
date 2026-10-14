import { useState } from "react";
import { Link } from "react-router";
import { PassionFlower } from "@/shared/components/brand/passion-flower";
import { ThemeToggle } from "@/shared/components/layout/theme-toggle";
import { RegisterForm } from "./register-form";

export function RegisterPage() {
  const [created, setCreated] = useState(false);

  return (
    <div className="grid min-h-svh md:grid-cols-2">
      <aside className="hidden flex-col items-center justify-center gap-8 bg-secondary p-12 text-secondary-foreground md:flex">
        <PassionFlower className="size-72" />
        <p className="max-w-xs text-center text-xl font-medium text-balance">
          Um espaço tranquilo para contar como foi o seu dia
        </p>
      </aside>

      <div className="flex flex-col">
        <header className="flex h-16 items-center justify-between px-4">
          <Link to="/" className="text-lg font-semibold tracking-tight text-primary">
            Salus
          </Link>
          <ThemeToggle />
        </header>
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-8">
          {created ? (
            <section className="space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                Sua conta foi criada
              </h1>
              <p className="text-muted-foreground">
                Que bom ter você aqui. A entrada na sua conta ainda está sendo
                preparada, e logo você poderá começar a registrar seus dias.
              </p>
              <Link
                to="/"
                className="inline-flex h-11 items-center text-primary underline"
              >
                Voltar ao início
              </Link>
            </section>
          ) : (
            <section className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Criar sua conta
                </h1>
                <p className="text-muted-foreground">
                  Leva só um instante. Depois é só contar como foi o seu dia.
                </p>
              </div>
              <RegisterForm onSuccess={() => setCreated(true)} />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
