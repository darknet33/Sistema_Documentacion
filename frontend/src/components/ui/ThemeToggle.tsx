import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      title="Cambiar tema"
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-5 w-5 text-yellow-400" />
          <span className="text-sm text-gray-200">Modo claro</span>
        </>
      ) : (
        <>
          <Moon className="h-5 w-5 text-gray-600" />
          <span className="text-sm text-gray-700">Modo oscuro</span>
        </>
      )}
    </button>
  );
}
