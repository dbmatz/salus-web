import { ThemeToggle } from "@/shared/components/layout/theme-toggle";

export function LandingHeader() {
  return (
    <header className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
      <span className="text-lg font-semibold tracking-tight text-primary">
        Salus
      </span>
      <ThemeToggle />
    </header>
  );
}
