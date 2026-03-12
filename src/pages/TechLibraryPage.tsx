import { useState } from "react";
import { useAppState, TechEntry } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/EmptyState";
import { LuPlus as Plus, LuCode as Code2, LuSearch as Search, LuStar as Star, LuExternalLink as ExternalLink, LuTrash2 as Trash2, LuMonitor as Monitor, LuWrench as Wrench, LuDatabase as Database, LuBookOpen as BookOpen, LuBoxes as Boxes } from "react-icons/lu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

const categoryIcons: Record<string, any> = { language: Code2, framework: Boxes, tool: Wrench, concept: BookOpen, database: Database };
const proficiencyLevels = {
  beginner: { color: "bg-muted-foreground/20 text-muted-foreground", stars: 1 },
  intermediate: { color: "bg-info/10 text-info", stars: 2 },
  advanced: { color: "bg-warning/10 text-warning", stars: 3 },
  expert: { color: "bg-success/10 text-success", stars: 4 },
};

export default function TechLibraryPage() {
  const { techLibrary, setTechLibrary } = useAppState();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newTech, setNewTech] = useState({ name: "", category: "language" as TechEntry["category"], proficiency: "beginner" as TechEntry["proficiency"], notes: "", resources: "", tags: "" });

  const handleAdd = () => {
    if (!newTech.name) return;
    const entry: TechEntry = { id: Date.now().toString(), name: newTech.name, category: newTech.category, proficiency: newTech.proficiency, notes: newTech.notes, resources: newTech.resources.split(",").map((r) => r.trim()).filter(Boolean), tags: newTech.tags.split(",").map((t) => t.trim()).filter(Boolean), createdAt: new Date().toISOString().split("T")[0] };
    setTechLibrary((prev) => [...prev, entry]);
    setNewTech({ name: "", category: "language", proficiency: "beginner", notes: "", resources: "", tags: "" });
    setAddOpen(false);
  };

  const deleteTech = (id: string) => { setTechLibrary((prev) => prev.filter((t) => t.id !== id)); };

  const categories = ["language", "framework", "tool", "concept", "database"] as const;
  const categoryLabels: Record<string, string> = { language: t("techLibrary.language"), framework: t("techLibrary.framework"), tool: t("techLibrary.tool"), concept: t("knowledge.title"), database: t("techLibrary.database") };
  const proficiencyLabels: Record<string, string> = { beginner: t("techLibrary.beginner"), intermediate: t("techLibrary.intermediate"), advanced: t("techLibrary.advanced"), expert: t("techLibrary.expert") };

  const filtered = techLibrary.filter((t) => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchCat = !filterCat || t.category === filterCat;
    return matchSearch && matchCat;
  });

  const stats = { total: techLibrary.length, languages: techLibrary.filter((t) => t.category === "language").length, frameworks: techLibrary.filter((t) => t.category === "framework").length, tools: techLibrary.filter((t) => t.category === "tool").length };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("techLibrary.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("techLibrary.subtitle")}</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild><Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> {t("techLibrary.addTech")}</Button></DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader><DialogTitle>{t("techLibrary.addTech")}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>{t("common.name")}</Label><Input value={newTech.name} onChange={(e) => setNewTech({ ...newTech, name: e.target.value })} placeholder={t("techLibrary.techName")} className="bg-secondary border-border" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>{t("common.category")}</Label>
                  <Select value={newTech.category} onValueChange={(v) => setNewTech({ ...newTech, category: v as TechEntry["category"] })}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>{categories.map((c) => (<SelectItem key={c} value={c}>{categoryLabels[c]}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div><Label>{t("techLibrary.proficiency")}</Label>
                  <Select value={newTech.proficiency} onValueChange={(v) => setNewTech({ ...newTech, proficiency: v as TechEntry["proficiency"] })}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">{t("techLibrary.beginner")}</SelectItem>
                      <SelectItem value="intermediate">{t("techLibrary.intermediate")}</SelectItem>
                      <SelectItem value="advanced">{t("techLibrary.advanced")}</SelectItem>
                      <SelectItem value="expert">{t("techLibrary.expert")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>{t("techLibrary.notes")}</Label><Textarea value={newTech.notes} onChange={(e) => setNewTech({ ...newTech, notes: e.target.value })} className="bg-secondary border-border" /></div>
              <div><Label>{t("techLibrary.resources")}</Label><Input value={newTech.resources} onChange={(e) => setNewTech({ ...newTech, resources: e.target.value })} className="bg-secondary border-border" /></div>
              <div><Label>{t("common.tags")}</Label><Input value={newTech.tags} onChange={(e) => setNewTech({ ...newTech, tags: e.target.value })} className="bg-secondary border-border" /></div>
              <Button onClick={handleAdd} className="w-full">{t("techLibrary.saveTech")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="glass"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">{stats.total}</p><p className="text-xs text-muted-foreground">{t("techLibrary.total")}</p></CardContent></Card>
        <Card className="glass"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-info">{stats.languages}</p><p className="text-xs text-muted-foreground">{t("techLibrary.languages")}</p></CardContent></Card>
        <Card className="glass"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-warning">{stats.frameworks}</p><p className="text-xs text-muted-foreground">{t("techLibrary.frameworks")}</p></CardContent></Card>
        <Card className="glass"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-success">{stats.tools}</p><p className="text-xs text-muted-foreground">{t("techLibrary.tools")}</p></CardContent></Card>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("common.search") + "..."} className="bg-secondary border-border pl-9" />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button variant={!filterCat ? "default" : "outline"} size="sm" className="text-xs" onClick={() => setFilterCat(null)}>{t("common.all")}</Button>
        {categories.map((c) => (<Button key={c} variant={filterCat === c ? "default" : "outline"} size="sm" className="text-xs" onClick={() => setFilterCat(c)}>{categoryLabels[c]}</Button>))}
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <EmptyState icon={<Code2 className="h-10 w-10 text-muted-foreground/60" />} message={techLibrary.length === 0 ? t("techLibrary.noTech") : t("common.noData")} />
          ) : (
            filtered.map((tech) => {
              const Icon = categoryIcons[tech.category] || Code2;
              const prof = proficiencyLevels[tech.proficiency];
              return (
                <motion.div key={tech.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <Card className="glass hover:border-primary/30 transition-all">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><Icon className="h-4 w-4 text-primary" /></div>
                          <div><h3 className="font-semibold text-sm">{tech.name}</h3><p className="text-[10px] text-muted-foreground">{categoryLabels[tech.category]}</p></div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteTech(tech.id)}><Trash2 className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 4 }).map((_, i) => (<Star key={i} className={`h-3.5 w-3.5 ${i < prof.stars ? "text-warning fill-warning" : "text-muted-foreground/30"}`} />))}
                        <Badge className={`text-[10px] ml-2 ${prof.color}`}>{proficiencyLabels[tech.proficiency]}</Badge>
                      </div>
                      {tech.notes && <p className="text-xs text-muted-foreground line-clamp-2">{tech.notes}</p>}
                      {tech.resources.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap">
                          {tech.resources.map((r, i) => (<a key={i} href={r} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline"><ExternalLink className="h-3 w-3" /> {new URL(r).hostname.replace("www.", "")}</a>))}
                        </div>
                      )}
                      <div className="flex gap-1.5 flex-wrap">{tech.tags.map((tag) => (<Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>))}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
