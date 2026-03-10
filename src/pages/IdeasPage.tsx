import { useState } from "react";
import { useAppState, Idea } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categoryColors: Record<string, string> = {
  app: "bg-primary/10 text-primary",
  feature: "bg-success/10 text-success",
  improvement: "bg-warning/10 text-warning",
  research: "bg-info/10 text-info",
};

export default function IdeasPage() {
  const { ideas, setIdeas } = useAppState();
  const [addOpen, setAddOpen] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: "", description: "", category: "app" as Idea["category"], tags: "" });

  const handleAdd = () => {
    if (!newIdea.title) return;
    setIdeas([...ideas, {
      id: Date.now().toString(),
      title: newIdea.title,
      description: newIdea.description,
      category: newIdea.category,
      tags: newIdea.tags.split(",").map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString().split("T")[0],
    }]);
    setNewIdea({ title: "", description: "", category: "app", tags: "" });
    setAddOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Idea Vault</h1>
          <p className="text-sm text-muted-foreground mt-1">Capture and organize your ideas</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Quick Add</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>New Idea</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Title</Label><Input value={newIdea.title} onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })} placeholder="What's the idea?" className="bg-secondary border-border" /></div>
              <div><Label>Description</Label><Textarea value={newIdea.description} onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })} placeholder="Describe it..." className="bg-secondary border-border" /></div>
              <div><Label>Category</Label>
                <Select value={newIdea.category} onValueChange={(v) => setNewIdea({ ...newIdea, category: v as Idea["category"] })}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="app">App</SelectItem><SelectItem value="feature">Feature</SelectItem><SelectItem value="improvement">Improvement</SelectItem><SelectItem value="research">Research</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Tags (comma separated)</Label><Input value={newIdea.tags} onChange={(e) => setNewIdea({ ...newIdea, tags: e.target.value })} placeholder="AI, productivity, ..." className="bg-secondary border-border" /></div>
              <Button onClick={handleAdd} className="w-full">Save Idea</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2">
        <AnimatePresence>
          {ideas.map((idea) => (
            <motion.div key={idea.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card className="glass">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-warning" />
                      <p className="font-medium text-sm">{idea.title}</p>
                    </div>
                    <Badge className={`text-[10px] capitalize ${categoryColors[idea.category]}`}>{idea.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{idea.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5 flex-wrap">
                      {idea.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{idea.createdAt}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
