import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task } from "@/types/database";
import { generateId, now } from "@/lib/id";

interface TaskStore {
  tasks: Task[];
  addTask: (data: Omit<Task, "id" | "created_at">) => Task;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: Task["status"]) => void;
  getTaskById: (id: string) => Task | undefined;
  getTasksByStatus: (status: Task["status"]) => Task[];
  getTasksByCategory: (category: Task["category"]) => Task[];
  getPendingTasks: () => Task[];
}

const defaultTasks: Task[] = [
  { id: "t1", title: "Implement AVL rotations", description: "Complete left and right rotations for AVL tree assignment", status: "in-progress", priority: "high", category: "academic", due_date: "2026-03-20", course_id: "c1", created_at: "2026-02-20T00:00:00Z" },
  { id: "t2", title: "Review OS chapter 5", description: "Process synchronization concepts", status: "todo", priority: "medium", category: "academic", course_id: "c2", created_at: "2026-02-25T00:00:00Z" },
  { id: "t3", title: "Fix auth bug in ThinkStack", description: "Login redirect not working properly", status: "todo", priority: "high", category: "project", created_at: "2026-03-01T00:00:00Z" },
  { id: "t4", title: "Write blog post on React hooks", description: "Share learnings about custom hooks", status: "done", priority: "low", category: "personal", created_at: "2026-03-02T00:00:00Z" },
  { id: "t5", title: "Setup CI/CD pipeline", description: "Configure GitHub Actions for auto deployment", status: "todo", priority: "medium", category: "project", created_at: "2026-03-05T00:00:00Z" },
];

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: defaultTasks,

      addTask: (data) => {
        const task: Task = { ...data, id: generateId(), created_at: now() };
        set((s) => ({ tasks: [...s.tasks, task] }));
        return task;
      },

      updateTask: (id, data) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data, updated_at: now() } : t)),
        })),

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      moveTask: (id, status) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, status, updated_at: now() } : t)),
        })),

      getTaskById: (id) => get().tasks.find((t) => t.id === id),
      getTasksByStatus: (status) => get().tasks.filter((t) => t.status === status),
      getTasksByCategory: (category) => get().tasks.filter((t) => t.category === category),
      getPendingTasks: () => get().tasks.filter((t) => t.status !== "done"),
    }),
    { name: "ts-tasks-v2" }
  )
);
