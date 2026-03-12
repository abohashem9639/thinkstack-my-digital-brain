import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import { LuTarget } from "react-icons/lu";

export default function FocusPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("focus.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("focus.subtitle")}</p>
        </div>
      </div>
      
      <EmptyState 
        icon={<LuTarget className="h-10 w-10 text-muted-foreground/60" />} 
        message={t("focus.noSpecificTask")} 
      />
    </div>
  );
}