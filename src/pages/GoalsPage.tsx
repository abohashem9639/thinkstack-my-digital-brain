import { useState } from "react";
import { useAppState, Goal, Milestone } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/EmptyState";
import { LuPlus as Plus, LuTarget as Target, LuCircleCheck as CheckCircle2, LuCircle as Circle, LuTrash2 as Trash2, LuPen as Edit2, LuTrophy as Trophy, LuFlag as Flag } from "react-icons/lu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

const categoryColors: Record<string, string> = {
  academic: "bg-primary/10 text-primary",
  career: "bg-success/10 text-success",
  personal: "bg-warning/10 text-warning",
  project: "bg-info/10 text-info",
};

export default function GoalsPage() {
  const { goals, setGoals } = useAppState();
  const { t } = useTranslation();
  const [addOpen, setAddOpen] = useState(false);
  const [milestoneInput, setMilestoneInput] = useState("");
  const [milestones, setMilestones] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: "", description: "", type: "short-term" as Goal["type"],
    category: "personal" as Goal["category"], targetDate: "",
  });
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "paused">("all");

  const filterLabels: Record<string, string> = {
    all: t("common.all"),
    active: t("common.active"),
    completed: t("common.completed"),
    paused: t("common.paused"),
  };

  const handleAddMilestone = () => {
    if (!milestoneInput.trim()) return;
    setMilestones([...milestones, milestoneInput.trim()]);
    setMilestoneInput("");
  };

  const handleAdd = () => {
    if (!newGoal.title) return;
    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      progress: 0,
      status: "active",
      milestones: milestones.map((m, i) => ({ id: `m-${Date.now()}-${i}`, title: m, completed: false })),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setGoals((prev) => [...prev, goal]);
    setNewGoal({ title: "", description: "", type: "short-term", category: "personal", targetDate: "" });
    setMilestones([]);
    setAddOpen(false);
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updated = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completed = updated.filter((m) => m.completed).length;
        const progress = updated.length > 0 ? Math.round((completed / updated.length) * 100) : 0;
        return { ...g, milestones: updated, progress };
      })
    );
  };

  const toggleGoalStatus = (goalId: string, status: Goal["status"]) => {
    setGoals((prev) => prev.map((g) => g.id === goalId ? { ...g, status } : g));
  };

  const deleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  const filtered = filter === "all" ? goals : goals.filter((g) => g.status === filter);
  const stats = {
    active: goals.filter((g) => g.status === "active").length,
    completed: goals.filter((g) => g.status === "completed").length,
    totalMilestones: goals.reduce((a, g) => a + g.milestones.length, 0),
    completedMilestones: goals.reduce((a, g) => a + g.milestones.filter((m) => m.completed).length, 0),
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("goals.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("goals.subtitle")}</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> {t("goals.newGoal")}</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader><DialogTitle>{t("goals.createGoal")}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>{t("common.title")}</Label><Input value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} placeholder={t("goals.goalTitle")} className="bg-secondary border-border" /></div>
              <div><Label>{t("common.description")}</Label><Textarea value={newGoal.description} onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })} placeholder={t("goals.goalDescription")} className="bg-secondary border-border" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>{t("goals.type")}</Label>
                  <Select value={newGoal.type} onValueChange={(v) => setNewGoal({ ...newGoal, type: v as Goal["type"] })}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short-term">{t("goals.shortTerm")}</SelectItem>
                      <SelectItem value="long-term">{t("goals.longTerm")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>{t("common.category")}</Label>
                  <Select value={newGoal.category} onValueChange={(v) => setNewGoal({ ...newGoal, category: v as Goal["category"] })}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">{t("tasks.academic")}</SelectItem>
                      <SelectItem value="career">{t("tasks.project")}</SelectItem>
                      <SelectItem value="personal">{t("tasks.personal")}</SelectItem>
                      <SelectItem value="project">{t("tasks.project")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>{t("goals.targetDate")}</Label><Input type="date" value={newGoal.targetDate} onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })} className="bg-secondary border-border" /></div>
              <div>
                <Label>{t("goals.milestones")}</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={milestoneInput} onChange={(e) => setMilestoneInput(e.target.value)} placeholder={t("goals.addMilestone")} className="bg-secondary border-border" onKeyDown={(e) => e.key === "Enter" && handleAddMilestone()} />
                  <Button variant="outline" size="sm" onClick={handleAddMilestone}>{t("common.add")}</Button>
                </div>
                {milestones.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {milestones.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Circle className="h-3 w-3" /> {m}
                        <button onClick={() => setMilestones(milestones.filter((_, j) => j !== i))} className="ml-auto text-destructive/50 hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={handleAdd} className="w-full">{t("goals.createGoal")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.active}</p>
            <p className="text-xs text-muted-foreground">{t("goals.activeGoals")}</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">{stats.completed}</p>
            <p className="text-xs text-muted-foreground">{t("goals.completedGoals")}</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning">{stats.completedMilestones}</p>
            <p className="text-xs text-muted-foreground">{t("goals.milestonesDone")}</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-info">{stats.totalMilestones}</p>
            <p className="text-xs text-muted-foreground">{t("goals.totalMilestones")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "active", "completed", "paused"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" className="text-xs" onClick={() => setFilter(f)}>{filterLabels[f]}</Button>
        ))}
      </div>

      {/* Goals List */}
      <motion.div layout className="space-y-4">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <EmptyState icon={<Target className="h-10 w-10 text-muted-foreground/60" />} message={goals.length === 0 ? t("goals.noGoals") : t("common.noData")} />
          ) : (
            filtered.map((goal) => (
              <motion.div key={goal.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className="glass">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {goal.status === "completed" ? <Trophy className="h-4 w-4 text-warning" /> : <Flag className="h-4 w-4 text-primary" />}
                          <h3 className="font-semibold text-sm">{goal.title}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">{goal.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-[10px] capitalize ${categoryColors[goal.category]}`}>{t(`tasks.${goal.category}`)}</Badge>
                        <Badge variant="outline" className="text-[10px]">{goal.type === "short-term" ? t("goals.shortTerm") : t("goals.longTerm")}</Badge>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteGoal(goal.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{t("common.progress")}</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>

                    {goal.milestones.length > 0 && (
                      <div className="space-y-1.5">
                        {goal.milestones.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => toggleMilestone(goal.id, m.id)}
                            className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                          >
                            {m.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            )}
                            <span className={`text-sm ${m.completed ? "line-through text-muted-foreground" : ""}`}>{m.title}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <div className="flex gap-2 text-[10px] text-muted-foreground">
                        {goal.targetDate && <span>{t("goals.targetDate")}: {goal.targetDate}</span>}
                        <span>{t("common.created")}: {goal.createdAt}</span>
                      </div>
                      <div className="flex gap-1">
                        {goal.status !== "completed" && (
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toggleGoalStatus(goal.id, "completed")}>
                            {t("goals.markComplete")}
                          </Button>
                        )}
                        {goal.status === "active" && (
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toggleGoalStatus(goal.id, "paused")}>
                            {t("common.paused")}
                          </Button>
                        )}
                        {goal.status === "paused" && (
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toggleGoalStatus(goal.id, "active")}>
                            {t("goals.resume")}
                          </Button>
                        )}
                      </div>
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
