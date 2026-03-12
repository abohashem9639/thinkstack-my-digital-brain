import { useState } from "react";
import { useAppState, Snippet } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/EmptyState";
import { LuPlus as Plus, LuCopy as Copy, LuCheck as Check, LuCode as Code } from "react-icons/lu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

const langColors: Record<string, string> = {
  typescript: "bg-info/10 text-info", javascript: "bg-warning/10 text-warning",
  python: "bg-success/10 text-success", rust: "bg-destructive/10 text-destructive",
  go: "bg-info/10 text-info", css: "bg-primary/10 text-primary",
};

export default function SnippetsPage() {
  const { snippets, setSnippets } = useAppState();
  const { t } = useTranslation();
  const [addOpen, setAddOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [newSnippet, setNewSnippet] = useState({ title: "", code: "", language: "typescript", tags: "", description: "" });

  const handleAdd = () => {
    if (!newSnippet.title || !newSnippet.code) return;
    setSnippets([...snippets, { id: Date.now().toString(), ...newSnippet, tags: newSnippet.tags.split(",").map((t) => t.trim()).filter(Boolean), createdAt: new Date().toISOString().split("T")[0] }]);
    setNewSnippet({ title: "", code: "", language: "typescript", tags: "", description: "" });
    setAddOpen(false);
  };

  const handleCopy = (id: string, code: string) => { navigator.clipboard.writeText(code); setCopied(id); setTimeout(() => setCopied(null), 2000); };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("snippets.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("snippets.subtitle")}</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild><Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> {t("snippets.addSnippet")}</Button></DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader><DialogTitle>{t("snippets.newSnippet")}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>{t("common.title")}</Label><Input value={newSnippet.title} onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })} placeholder={t("snippets.snippetTitle")} className="bg-secondary border-border" /></div>
              <div><Label>{t("common.description")}</Label><Input value={newSnippet.description} onChange={(e) => setNewSnippet({ ...newSnippet, description: e.target.value })} placeholder={t("snippets.descriptionPlaceholder")} className="bg-secondary border-border" /></div>
              <div><Label>{t("snippets.language")}</Label>
                <Select value={newSnippet.language} onValueChange={(v) => setNewSnippet({ ...newSnippet, language: v })}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>{["typescript", "javascript", "python", "rust", "go", "css"].map((l) => (<SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div><Label>{t("snippets.code")}</Label><Textarea value={newSnippet.code} onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })} className="bg-secondary border-border font-mono text-xs min-h-[120px]" /></div>
              <div><Label>{t("snippets.tagsPlaceholder")}</Label><Input value={newSnippet.tags} onChange={(e) => setNewSnippet({ ...newSnippet, tags: e.target.value })} className="bg-secondary border-border" /></div>
              <Button onClick={handleAdd} className="w-full">{t("snippets.saveSnippet")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div layout className="space-y-4">
        <AnimatePresence>
          {snippets.length === 0 ? (
            <EmptyState icon={<Code className="h-10 w-10 text-muted-foreground/60" />} message={t("snippets.noSnippets")} />
          ) : (
            snippets.map((snippet) => (
              <motion.div key={snippet.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className="glass overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-4 pb-2">
                      <div><p className="font-medium text-sm">{snippet.title}</p><p className="text-xs text-muted-foreground mt-0.5">{snippet.description}</p></div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-[10px] capitalize ${langColors[snippet.language] || "bg-secondary text-secondary-foreground"}`}>{snippet.language}</Badge>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(snippet.id, snippet.code)}>
                          {copied === snippet.id ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </div>
                    <pre className="p-4 pt-2 text-xs font-mono overflow-x-auto bg-secondary/30 border-t border-border/30 scrollbar-thin"><code>{snippet.code}</code></pre>
                    <div className="flex gap-1.5 p-3 pt-2 flex-wrap">{snippet.tags.map((tag) => (<Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>))}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
