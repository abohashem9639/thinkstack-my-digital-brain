import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StudySession } from "@/types/database";
import { generateId, now, today } from "@/lib/id";

interface StudyStore {
  sessions: StudySession[];
  addSession: (data: Omit<StudySession, "id" | "created_at">) => StudySession;
  deleteSession: (id: string) => void;
  getSessionsByCourse: (courseId: string) => StudySession[];
  getSessionsByDate: (date: string) => StudySession[];
  getTodayMinutes: () => number;
  getWeeklyData: () => { day: string; minutes: number }[];
}

const defaultSessions: StudySession[] = [
  { id: "ss1", course_id: "c1", duration: 50, date: "2026-03-09", type: "pomodoro", created_at: "2026-03-09T00:00:00Z" },
  { id: "ss2", course_id: "c2", duration: 25, date: "2026-03-09", type: "pomodoro", created_at: "2026-03-09T00:00:00Z" },
  { id: "ss3", course_id: "c1", duration: 75, date: "2026-03-10", type: "free", created_at: "2026-03-10T00:00:00Z" },
  { id: "ss4", course_id: "c3", duration: 30, date: "2026-03-11", type: "pomodoro", created_at: "2026-03-11T00:00:00Z" },
  { id: "ss5", course_id: "c1", duration: 45, date: "2026-03-11", type: "pomodoro", created_at: "2026-03-11T00:00:00Z" },
];

export const useStudyStore = create<StudyStore>()(
  persist(
    (set, get) => ({
      sessions: defaultSessions,

      addSession: (data) => {
        const session: StudySession = { ...data, id: generateId(), created_at: now() };
        set((s) => ({ sessions: [...s.sessions, session] }));
        return session;
      },

      deleteSession: (id) =>
        set((s) => ({ sessions: s.sessions.filter((ss) => ss.id !== id) })),

      getSessionsByCourse: (courseId) =>
        get().sessions.filter((s) => s.course_id === courseId),

      getSessionsByDate: (date) =>
        get().sessions.filter((s) => s.date === date),

      getTodayMinutes: () =>
        get().sessions
          .filter((s) => s.date === today())
          .reduce((sum, s) => sum + s.duration, 0),

      getWeeklyData: () => {
        const days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return {
            dateStr: d.toISOString().split("T")[0],
            dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
          };
        });

        return days.map(({ dateStr, dayName }) => ({
          day: dayName,
          minutes: get().sessions
            .filter((s) => s.date === dateStr)
            .reduce((sum, s) => sum + s.duration, 0),
        }));
      },
    }),
    { name: "ts-study-v2" }
  )
);
