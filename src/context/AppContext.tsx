import { useState, createContext, useContext, ReactNode, useCallback } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useAuth } from "@/context/AuthContext";

// ─── Types ─────────────────────────────────────────────────────────

export interface Course {
  id: string;
  name: string;
  code: string;
  professor: string;
  color: string;
  description: string;
  semester: string;
  lectures: Lecture[];
  assignments: Assignment[];
  exams: Exam[];
}

export interface Lecture {
  id: string;
  title: string;
  date: string;
  notes: string;
  courseId: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  progress: number;
  courseId: string;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Exam {
  id: string;
  title: string;
  date: string;
  readiness: number;
  courseId: string;
  studyPlan?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  category: "academic" | "project" | "personal";
  dueDate?: string;
  courseId?: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: "app" | "feature" | "improvement" | "research";
  tags: string[];
  createdAt: string;
}

export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  description: string;
  createdAt: string;
}

export interface StudySession {
  id: string;
  courseId: string;
  duration: number;
  date: string;
  type: "pomodoro" | "free";
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: "short-term" | "long-term";
  category: "academic" | "career" | "personal" | "project";
  progress: number;
  targetDate?: string;
  milestones: Milestone[];
  createdAt: string;
  status: "active" | "completed" | "paused";
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  linkedTopics: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TechEntry {
  id: string;
  name: string;
  category: "language" | "framework" | "tool" | "concept" | "database";
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
  notes: string;
  resources: string[];
  tags: string[];
  createdAt: string;
}

export interface Habit {
  id: string;
  title: string;
  icon: string;
  frequency: "daily" | "weekly";
  completedDates: string[];
  createdAt: string;
  color: string;
}

export interface UserPreferences {
  language: string;
  theme: "light" | "dark" | "system";
  sidebarCollapsed: boolean;
}

// ─── Context ───────────────────────────────────────────────────────

interface AppState {
  courses: Course[];
  setCourses: (courses: Course[] | ((prev: Course[]) => Course[])) => void;
  tasks: Task[];
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  ideas: Idea[];
  setIdeas: (ideas: Idea[] | ((prev: Idea[]) => Idea[])) => void;
  snippets: Snippet[];
  setSnippets: (snippets: Snippet[] | ((prev: Snippet[]) => Snippet[])) => void;
  studySessions: StudySession[];
  setStudySessions: (sessions: StudySession[] | ((prev: StudySession[]) => StudySession[])) => void;
  goals: Goal[];
  setGoals: (goals: Goal[] | ((prev: Goal[]) => Goal[])) => void;
  knowledge: KnowledgeEntry[];
  setKnowledge: (entries: KnowledgeEntry[] | ((prev: KnowledgeEntry[]) => KnowledgeEntry[])) => void;
  techLibrary: TechEntry[];
  setTechLibrary: (entries: TechEntry[] | ((prev: TechEntry[]) => TechEntry[])) => void;
  habits: Habit[];
  setHabits: (habits: Habit[] | ((prev: Habit[]) => Habit[])) => void;
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences | ((prev: UserPreferences) => UserPreferences)) => void;
  focusMode: boolean;
  setFocusMode: (v: boolean) => void;
  focusTaskId: string | null;
  setFocusTaskId: (id: string | null) => void;
}

// ─── Defaults ──────────────────────────────────────────────────────

const defaultCourses: Course[] = [];
const defaultTasks: Task[] = [];
const defaultIdeas: Idea[] = [];
const defaultSnippets: Snippet[] = [];
const defaultStudySessions: StudySession[] = [];
const defaultGoals: Goal[] = [];
const defaultKnowledge: KnowledgeEntry[] = [];
const defaultTechLibrary: TechEntry[] = [];
const defaultHabits: Habit[] = [];
const defaultPreferences: UserPreferences = {
  language: "en",
  theme: "dark",
  sidebarCollapsed: false,
};

// ─── Provider ──────────────────────────────────────────────────────

const AppContext = createContext<AppState | undefined>(undefined);

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id || "guest";
  const { i18n } = useTranslation();

  const [courses, setCourses] = useLocalStorage<Course[]>(`ts-courses-${userId}`, defaultCourses);
  const [tasks, setTasks] = useLocalStorage<Task[]>(`ts-tasks-${userId}`, defaultTasks);
  const [ideas, setIdeas] = useLocalStorage<Idea[]>(`ts-ideas-${userId}`, defaultIdeas);
  const [snippets, setSnippets] = useLocalStorage<Snippet[]>(`ts-snippets-${userId}`, defaultSnippets);
  const [studySessions, setStudySessions] = useLocalStorage<StudySession[]>(`ts-sessions-${userId}`, defaultStudySessions);
  const [goals, setGoals] = useLocalStorage<Goal[]>(`ts-goals-${userId}`, defaultGoals);
  const [knowledge, setKnowledge] = useLocalStorage<KnowledgeEntry[]>(`ts-knowledge-${userId}`, defaultKnowledge);
  const [techLibrary, setTechLibrary] = useLocalStorage<TechEntry[]>(`ts-tech-${userId}`, defaultTechLibrary);
  const [habits, setHabits] = useLocalStorage<Habit[]>(`ts-habits-${userId}`, defaultHabits);
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(`ts-preferences-${userId}`, defaultPreferences);
  const [focusMode, setFocusMode] = useState(false);
  const [focusTaskId, setFocusTaskId] = useState<string | null>(null);

  // Sync i18n with preferences
  useEffect(() => {
    if (preferences.language && i18n.language !== preferences.language) {
      i18n.changeLanguage(preferences.language);
    }
  }, [preferences.language, i18n]);

  return (
    <AppContext.Provider
      value={{
        courses, setCourses,
        tasks, setTasks,
        ideas, setIdeas,
        snippets, setSnippets,
        studySessions, setStudySessions,
        goals, setGoals,
        knowledge, setKnowledge,
        techLibrary, setTechLibrary,
        habits, setHabits,
        preferences, setPreferences,
        focusMode, setFocusMode,
        focusTaskId, setFocusTaskId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppState must be used within AppProvider");
  return context;
}
