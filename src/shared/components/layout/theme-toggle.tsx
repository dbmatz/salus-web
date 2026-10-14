import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useTheme } from "@/shared/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-11"
      onClick={toggleTheme}
      aria-label={isDark ? "Usar tema claro" : "Usar tema escuro"}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
