import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/context/AppContext";
import { LuGlobe as Globe } from "react-icons/lu";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { setPreferences } = useAppState();

  const toggle = () => {
    const next = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(next);
    setPreferences(prev => ({ ...prev, language: next }));
  };

  const nextLabel = i18n.language === "en" ? "عربي" : "EN";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="gap-1.5 text-muted-foreground hover:text-foreground h-8 text-xs"
    >
      <Globe className="h-3.5 w-3.5" />
      {nextLabel}
    </Button>
  );
}
