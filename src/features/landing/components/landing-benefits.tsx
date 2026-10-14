import { CalendarDays, Clock, Heart, type LucideIcon } from "lucide-react";

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: Clock,
    title: "Leva menos de um minuto",
    description:
      "Para registrar o dia, basta escolher a emoção. Todo o resto é opcional.",
  },
  {
    icon: Heart,
    title: "No seu ritmo",
    description:
      "Escreva sobre o dia, anote medicamentos e avalie o que importa para você, quando tiver vontade.",
  },
  {
    icon: CalendarDays,
    title: "Veja o tempo passando",
    description:
      "Seu histórico e seu calendário mostram como as emoções variam ao longo dos dias, sem cobrança.",
  },
];

export function LandingBenefits() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto w-full max-w-5xl px-4 py-14 md:py-20">
        <h2 className="max-w-md text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          Pensado para o fim de um dia comum, ou de um dia difícil
        </h2>
        <ul className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-4 md:flex-col">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="space-y-1.5">
                <h3 className="text-lg font-medium">{title}</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
