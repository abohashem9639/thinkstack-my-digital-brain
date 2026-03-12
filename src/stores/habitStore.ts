import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Habit, HabitCompletion } from "@/types/database";
import { generateId, now, today } from "@/lib/id";

interface HabitStore {
  habits: Habit[];
  completions: HabitCompletion[];

  addHabit: (data: Omit<Habit, "id" | "created_at">) => Habit;
  updateHabit: (id: string, data: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;

  toggleCompletion: (habitId: string, date: string) => void;
  isCompleted: (habitId: string, date: string) => boolean;
  getStreak: (habitId: string) => number;
  getCompletedDates: (habitId: string) => string[];
  getTodayCompletedCount: () => number;
}

const COLORS = [
  "hsl(217, 91%, 60%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 55%)",
  "hsl(0, 72%, 55%)", "hsl(199, 89%, 48%)", "hsl(280, 65%, 60%)",
];

const defaultHabits: Habit[] = [
  { id: "h1", title: "Morning Study", icon: "📖", frequency: "daily", color: COLORS[0], created_at: "2026-01-01T00:00:00Z" },
  { id: "h2", title: "Code Practice", icon: "💻", frequency: "daily", color: COLORS[1], created_at: "2026-01-01T00:00:00Z" },
  { id: "h3", title: "Exercise", icon: "🏋️", frequency: "daily", color: COLORS[3], created_at: "2026-01-01T00:00:00Z" },
];

// Pre-populate some completions
const t = today();
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split("T")[0];

const defaultCompletions: HabitCompletion[] = [
  { id: "hc1", habit_id: "h1", completed_date: t },
  { id: "hc2", habit_id: "h2", completed_date: t },
  { id: "hc3", habit_id: "h1", completed_date: yesterday },
  { id: "hc4", habit_id: "h2", completed_date: yesterday },
  { id: "hc5", habit_id: "h1", completed_date: twoDaysAgo },
  { id: "hc6", habit_id: "h3", completed_date: yesterday },
];

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: defaultHabits,
      completions: defaultCompletions,

      addHabit: (data) => {
        const habit: Habit = { ...data, id: generateId(), created_at: now() };
        set((s) => ({ habits: [...s.habits, habit] }));
        return habit;
      },

      updateHabit: (id, data) =>
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, ...data, updated_at: now() } : h)),
        })),

      deleteHabit: (id) =>
        set((s) => ({
          habits: s.habits.filter((h) => h.id !== id),
          completions: s.completions.filter((c) => c.habit_id !== id),
        })),

      toggleCompletion: (habitId, date) => {
        const existing = get().completions.find(
          (c) => c.habit_id === habitId && c.completed_date === date
        );
        if (existing) {
          set((s) => ({
            completions: s.completions.filter((c) => c.id !== existing.id),
          }));
        } else {
          set((s) => ({
            completions: [...s.completions, { id: generateId(), habit_id: habitId, completed_date: date }],
          }));
        }
      },

      isCompleted: (habitId, date) =>
        get().completions.some((c) => c.habit_id === habitId && c.completed_date === date),

      getStreak: (habitId) => {
        const dates = get().completions
          .filter((c) => c.habit_id === habitId)
          .map((c) => c.completed_date)
          .sort((a, b) => b.localeCompare(a));

        if (dates.length === 0) return 0;

        let streak = 0;
        const d = new Date();
        d.setHours(0, 0, 0, 0);

        for (let i = 0; i < 365; i++) {
          const check = new Date(d);
          check.setDate(check.getDate() - i);
          const str = check.toISOString().split("T")[0];
          if (dates.includes(str)) {
            streak++;
          } else if (i > 0) {
            break;
          }
        }
        return streak;
      },

      getCompletedDates: (habitId) =>
        get().completions
          .filter((c) => c.habit_id === habitId)
          .map((c) => c.completed_date),

      getTodayCompletedCount: () => {
        const t = today();
        return get().completions.filter((c) => c.completed_date === t).length;
      },
    }),
    { name: "ts-habits-v2" }
  )
);
