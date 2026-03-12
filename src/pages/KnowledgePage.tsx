import { useState } from "react";
import { useAppState, KnowledgeEntry } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/EmptyState";
import { LuPlus as Plus, LuBookOpen as BookOpen, LuSearch as Search, LuTag as Tag, LuLink2 as Link2, LuClock as Clock, LuPen as Edit2, LuTrash2 as Trash2, LuChevronRight as ChevronRight, LuX as X } from "react-icons/lu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

export default function KnowledgePage() {
  const { knowledge, setKnowledge } = useAppState();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: "", content: "", category: "", tags: "" });

  const categories = [...new Set(knowledge.map((k) => k.category))];

  const filtered = knowledge.filter((k) => {
    const matchSearch = !search || k.title.toLowerCase().includes(search.toLowerCase()) || k.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = !selectedCategory || k.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleAdd = () => {
    if (!newEntry.title || !newEntry.content) return;
    const entry: KnowledgeEntry = {
      id: Date.now().toString(), title: newEntry.title, content: newEntry.content,
      category: newEntry.category || "General", tags: newEntry.tags.split(",").map((t) => t.trim()).filter(Boolean),
      linkedTopics: [], createdAt: new Date().toISOString().split("T")[0], updatedAt: new Date().toISOString().split("T")[0],
    };
    setKnowledge((prev) => [...prev, entry]);
    setNewEntry({ title: "", content: "", category: "", tags: "" });
    setAddOpen(false);
  };

  const deleteEntry = (id: string) => { setKnowledge((prev) => prev.filter((k) => k.id !== id)); if (selectedEntry?.id === id) setSelectedEntry(null); };

  if (selectedEntry) {
    const entry = knowledge.find((k) => k.id === selectedEntry.id) || selectedEntry;
    const linked = knowledge.filter((k) => entry.linkedTopics.includes(k.id));
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button onClick={() => setSelectedEntry(null)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          ← {t("knowledge.title")}
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">{entry.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge className="text-[10px]">{entry.category}</Badge>
              {entry.tags.map((tag) => (<Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteEntry(entry.id)}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
          </div>
        </div>
        <Card className="glass">
          <CardContent className="p-6">
            <div className="prose prose-invert prose-sm max-w-none">
              {entry.content.split("\n").map((line, i) => {
                if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-semibold mt-4 mb-2 text-foreground">{line.slice(3)}</h2>;
                if (line.startsWith("- **")) { const bold = line.match(/\*\*(.*?)\*\*/)?.[1] || ""; const rest = line.replace(/- \*\*.*?\*\*/, "").replace(/^-?\s*/, ""); return <p key={i} className="text-sm text-muted-foreground ml-4">• <strong className="text-foreground">{bold}</strong>{rest}</p>; }
                if (line.startsWith("- ")) return <p key={i} className="text-sm text-muted-foreground ml-4">• {line.slice(2)}</p>;
                if (line.trim() === "") return <div key={i} className="h-2" />;
                return <p key={i} className="text-sm text-muted-foreground">{line}</p>;
              })}
            </div>
          </CardContent>
        </Card>
        {linked.length > 0 && (
          <Card className="glass">
            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-2"><Link2 className="h-4 w-4 text-primary" /> {t("knowledge.linkedTopics")}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {linked.map((l) => (
                <button key={l.id} onClick={() => setSelectedEntry(l)} className="flex items-center gap-2 w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors text-left">
                  <BookOpen className="h-4 w-4 text-primary" /><span className="text-sm font-medium">{l.title}</span><ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                </button>
              ))}
            </CardContent>
          </Card>
        )}
        <p className="text-[10px] text-muted-foreground">{t("common.created")}: {entry.createdAt} · {t("common.updated")}: {entry.updatedAt}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("knowledge.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("knowledge.subtitle")}</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild><Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> {t("knowledge.newEntry")}</Button></DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader><DialogTitle>{t("knowledge.newEntry")}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>{t("common.title")}</Label><Input value={newEntry.title} onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })} placeholder={t("knowledge.topicTitle")} className="bg-secondary border-border" /></div>
              <div><Label>{t("knowledge.category")}</Label><Input value={newEntry.category} onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })} placeholder="e.g., Frontend, Backend, DevOps..." className="bg-secondary border-border" /></div>
              <div><Label>{t("knowledge.content")}</Label><Textarea value={newEntry.content} onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })} placeholder="## Heading\n- List item\n- **Bold** text" className="bg-secondary border-border min-h-[200px] font-mono text-xs" /></div>
              <div><Label>{t("common.tags")}</Label><Input value={newEntry.tags} onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })} className="bg-secondary border-border" /></div>
              <Button onClick={handleAdd} className="w-full">{t("knowledge.saveEntry")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("knowledge.searchPlaceholder")} className="bg-secondary border-border pl-9" />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button variant={!selectedCategory ? "default" : "outline"} size="sm" className="text-xs" onClick={() => setSelectedCategory(null)}>{t("common.all")}</Button>
        {categories.map((cat) => (<Button key={cat} variant={selectedCategory === cat ? "default" : "outline"} size="sm" className="text-xs" onClick={() => setSelectedCategory(cat)}>{cat}</Button>))}
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <EmptyState icon={<BookOpen className="h-10 w-10 text-muted-foreground/60" />} message={knowledge.length === 0 ? t("knowledge.noEntries") : t("common.noData")} />
          ) : (
            filtered.map((entry) => (
              <motion.div key={entry.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className="glass cursor-pointer hover:border-primary/30 transition-all group" onClick={() => setSelectedEntry(entry)}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /><h3 className="font-medium text-sm">{entry.title}</h3></div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{entry.content.slice(0, 120)}...</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5 flex-wrap">
                        <Badge className="text-[10px]">{entry.category}</Badge>
                        {entry.tags.slice(0, 2).map((tag) => (<Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>))}
                      </div>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{entry.updatedAt}</span>
                    </div>
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
