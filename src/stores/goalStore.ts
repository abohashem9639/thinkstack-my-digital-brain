import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Goal, Milestone } from "@/types/database";
import { generateId, now } from "@/lib/id";

interface GoalStore {
  goals: Goal[];
  milestones: Milestone[];

  addGoal: (data: Omit<Goal, "id" | "created_at">, milestones?: string[]) => Goal;
  updateGoal: (id: string, data: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  setGoalStatus: (id: string, status: Goal["status"]) => void;

  addMilestone: (data: Omit<Milestone, "id">) => Milestone;
  toggleMilestone: (id: string) => void;
  deleteMilestone: (id: string) => void;
  getMilestonesByGoal: (goalId: string) => Milestone[];
  recalcProgress: (goalId: string) => void;
}

const defaultGoals: Goal[] = [
  { id: "g1", title: "Master Data Structures", description: "Complete all DS&A topics including advanced trees and graphs", type: "long-term", category: "academic", progress: 40, target_date: "2026-06-30", status: "active", created_at: "2026-01-15T00:00:00Z" },
  { id: "g2", title: "Build 3 Full-Stack Projects", description: "Complete 3 portfolio-worthy full-stack applications", type: "long-term", category: "career", progress: 33, target_date: "2026-09-01", status: "active", created_at: "2026-01-20T00:00:00Z" },
];

const defaultMilestones: Milestone[] = [
  { id: "m1", goal_id: "g1", title: "Learn all tree types", completed: true, sort_order: 0 },
  { id: "m2", goal_id: "g1", title: "Graph algorithms mastery", completed: false, sort_order: 1 },
  { id: "m3", goal_id: "g1", title: "Dynamic programming", completed: false, sort_order: 2 },
  { id: "m4", goal_id: "g2", title: "Complete project 1 (ThinkStack)", completed: true, sort_order: 0 },
  { id: "m5", goal_id: "g2", title: "Complete project 2", completed: false, sort_order: 1 },
  { id: "m6", goal_id: "g2", title: "Complete project 3", completed: false, sort_order: 2 },
];

export const useGoalStore = create<GoalStore>()(
  persist(
    (set, get) => ({
      goals: defaultGoals,
      milestones: defaultMilestones,

      addGoal: (data, milestoneTitles) => {
        const goal: Goal = { ...data, id: generateId(), created_at: now() };
        const newMilestones: Milestone[] = (milestoneTitles || []).map((title, i) => ({
          id: generateId(),
          goal_id: goal.id,
          title,
          completed: false,
          sort_order: i,
        }));
        set((s) => ({
          goals: [...s.goals, goal],
          milestones: [...s.milestones, ...newMilestones],
        }));
        return goal;
      },

      updateGoal: (id, data) =>
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, ...data, updated_at: now() } : g)),
        })),

      deleteGoal: (id) =>
        set((s) => ({
          goals: s.goals.filter((g) => g.id !== id),
          milestones: s.milestones.filter((m) => m.goal_id !== id),
        })),

      setGoalStatus: (id, status) =>
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, status, updated_at: now() } : g)),
        })),

      addMilestone: (data) => {
        const milestone: Milestone = { ...data, id: generateId() };
        set((s) => ({ milestones: [...s.milestones, milestone] }));
        return milestone;
      },

      toggleMilestone: (id) => {
        const milestone = get().milestones.find((m) => m.id === id);
        if (!milestone) return;

        set((s) => ({
          milestones: s.milestones.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)),
        }));

        // Recalculate goal progress
        get().recalcProgress(milestone.goal_id);
      },

      deleteMilestone: (id) => {
        const milestone = get().milestones.find((m) => m.id === id);
        set((s) => ({ milestones: s.milestones.filter((m) => m.id !== id) }));
        if (milestone) get().recalcProgress(milestone.goal_id);
      },

      getMilestonesByGoal: (goalId) =>
        get().milestones
          .filter((m) => m.goal_id === goalId)
          .sort((a, b) => a.sort_order - b.sort_order),

      recalcProgress: (goalId) => {
        const ms = get().milestones.filter((m) => m.goal_id === goalId);
        const progress = ms.length > 0
          ? Math.round((ms.filter((m) => m.completed).length / ms.length) * 100)
          : 0;
        set((s) => ({
          goals: s.goals.map((g) => (g.id === goalId ? { ...g, progress } : g)),
        }));
      },
    }),
    { name: "ts-goals-v2" }
  )
);
