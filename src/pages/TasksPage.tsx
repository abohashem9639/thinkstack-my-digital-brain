import { useState } from "react";
import { useAppState, Task } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const columns: { key: Task["status"]; label: string; color: string }[] = [
  { key: "todo", label: "To Do", color: "text-muted-foreground" },
  { key: "in-progress", label: "In Progress", color: "text-primary" },
  { key: "done", label: "Done", color: "text-success" },
];

export default function TasksPage() {
  const { tasks, setTasks } = useAppState();
  const [addOpen, setAddOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium" as Task["priority"], category: "personal" as Task["category"] });

  const handleAdd = () => {
    if (!newTask.title) return;
    setTasks([...tasks, { id: Date.now().toString(), ...newTask, status: "todo" }]);
    setNewTask({ title: "", description: "", priority: "medium", category: "personal" });
    setAddOpen(false);
  };

  const moveTask = (id: string, status: Task["status"]) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Task Board</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your tasks Kanban-style</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Task</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>Add New Task</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Title</Label><Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="bg-secondary border-border" /></div>
              <div><Label>Description</Label><Textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="bg-secondary border-border" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Priority</Label>
                  <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v as Task["priority"] })}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={newTask.category} onValueChange={(v) => setNewTask({ ...newTask, category: v as Task["category"] })}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="academic">Academic</SelectItem><SelectItem value="project">Project</SelectItem><SelectItem value="personal">Personal</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAdd} className="w-full">Add Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className={`text-sm font-semibold ${col.color}`}>{col.label}</h3>
                <Badge variant="outline" className="text-[10px]">{colTasks.length}</Badge>
              </div>
              <div className="space-y-2 min-h-[200px] p-2 rounded-lg bg-secondary/30 border border-border/30">
                <AnimatePresence>
                  {colTasks.map((task) => (
                    <motion.div key={task.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <Card className="glass cursor-default">
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium">{task.title}</p>
                            <div className={`h-2 w-2 rounded-full mt-1.5 ${task.priority === "high" ? "bg-destructive" : task.priority === "medium" ? "bg-warning" : "bg-success"}`} />
                          </div>
                          {task.description && <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>}
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-[10px] capitalize">{task.category}</Badge>
                            <div className="flex gap-1">
                              {col.key !== "todo" && (
                                <button onClick={() => moveTask(task.id, col.key === "done" ? "in-progress" : "todo")} className="text-[10px] text-muted-foreground hover:text-foreground">←</button>
                              )}
                              {col.key !== "done" && (
                                <button onClick={() => moveTask(task.id, col.key === "todo" ? "in-progress" : "done")} className="text-[10px] text-muted-foreground hover:text-foreground">→</button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
