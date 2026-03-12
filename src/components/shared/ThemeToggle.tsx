import { useAppState } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { LuSun as Sun, LuMoon as Moon } from "react-icons/lu";

export function ThemeToggle() {
  const { preferences, setPreferences } = useAppState();

  const toggle = () => {
    const nextTheme = preferences.theme === "dark" ? "light" : "dark";
    setPreferences((prev) => ({ ...prev, theme: nextTheme }));
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="h-8 w-8 px-0 text-muted-foreground hover:text-foreground"
    >
      {preferences.theme === "dark" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
