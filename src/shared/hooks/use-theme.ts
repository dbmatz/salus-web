import { useCallback, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "salus-theme";

function currentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(currentTheme);

  const toggleTheme = useCallback(() => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Preferência não persistida; a escolha vale só para esta sessão.
    }
    setThemeState(next);
  }, []);

  return { theme, toggleTheme };
}
