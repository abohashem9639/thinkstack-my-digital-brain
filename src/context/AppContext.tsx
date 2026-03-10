import { useState, createContext, useContext, ReactNode } from "react";

interface AppState {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  ideas: Idea[];
  setIdeas: (ideas: Idea[]) => void;
  snippets: Snippet[];
  setSnippets: (snippets: Snippet[]) => void;
  studySessions: StudySession[];
  setStudySessions: (sessions: StudySession[]) => void;
}

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
}

export interface Exam {
  id: string;
  title: string;
  date: string;
  readiness: number;
  courseId: string;
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
  duration: number; // minutes
  date: string;
  type: "pomodoro" | "free";
}

const defaultCourses: Course[] = [
  {
    id: "1",
    name: "Data Structures & Algorithms",
    code: "CS201",
    professor: "Dr. Ahmad",
    color: "hsl(217, 91%, 60%)",
    description: "Advanced data structures and algorithm analysis",
    semester: "Fall 2025",
    lectures: [
      { id: "l1", title: "Binary Trees", date: "2025-09-15", notes: "Covered traversal methods: inorder, preorder, postorder", courseId: "1" },
      { id: "l2", title: "Graph Algorithms", date: "2025-09-22", notes: "BFS and DFS implementations", courseId: "1" },
    ],
    assignments: [
      { id: "a1", title: "Implement AVL Tree", description: "Full AVL tree with rotations", dueDate: "2025-10-01", status: "in-progress", progress: 60, courseId: "1" },
    ],
    exams: [
      { id: "e1", title: "Midterm Exam", date: "2025-10-15", readiness: 45, courseId: "1" },
    ],
  },
  {
    id: "2",
    name: "Operating Systems",
    code: "CS301",
    professor: "Dr. Sara",
    color: "hsl(142, 71%, 45%)",
    description: "Process management, memory, file systems",
    semester: "Fall 2025",
    lectures: [],
    assignments: [
      { id: "a2", title: "Process Scheduler Simulation", description: "Simulate FCFS, SJF, Round Robin", dueDate: "2025-10-05", status: "pending", progress: 0, courseId: "2" },
    ],
    exams: [],
  },
  {
    id: "3",
    name: "Database Systems",
    code: "CS305",
    professor: "Dr. Khaled",
    color: "hsl(38, 92%, 55%)",
    description: "Relational databases, SQL, normalization",
    semester: "Fall 2025",
    lectures: [],
    assignments: [],
    exams: [],
  },
];

const defaultTasks: Task[] = [
  { id: "t1", title: "Implement AVL rotations", description: "Complete left and right rotations for AVL tree assignment", status: "in-progress", priority: "high", category: "academic", dueDate: "2025-10-01", courseId: "1" },
  { id: "t2", title: "Review OS chapter 5", description: "Process synchronization concepts", status: "todo", priority: "medium", category: "academic", courseId: "2" },
  { id: "t3", title: "Fix auth bug in ThinkStack", description: "Login redirect not working properly", status: "todo", priority: "high", category: "project" },
  { id: "t4", title: "Write blog post on React hooks", description: "Share learnings about custom hooks", status: "done", priority: "low", category: "personal" },
  { id: "t5", title: "Setup CI/CD pipeline", description: "Configure GitHub Actions for auto deployment", status: "todo", priority: "medium", category: "project" },
];

const defaultIdeas: Idea[] = [
  { id: "i1", title: "AI Study Planner", description: "Use AI to generate optimal study schedules based on exam dates and difficulty", category: "app", tags: ["AI", "productivity"], createdAt: "2025-09-10" },
  { id: "i2", title: "Code Review Bot", description: "GitHub bot that provides automated code review suggestions", category: "feature", tags: ["GitHub", "automation"], createdAt: "2025-09-12" },
];

const defaultSnippets: Snippet[] = [
  { id: "s1", title: "React useDebounce Hook", code: `import { useState, useEffect } from 'react';\n\nfunction useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n  useEffect(() => {\n    const handler = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(handler);\n  }, [value, delay]);\n  return debouncedValue;\n}`, language: "typescript", tags: ["react", "hooks"], description: "Custom debounce hook for React", createdAt: "2025-09-01" },
  { id: "s2", title: "Python Quick Sort", code: `def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)`, language: "python", tags: ["algorithm", "sorting"], description: "Simple quicksort implementation", createdAt: "2025-09-05" },
];

const defaultStudySessions: StudySession[] = [
  { id: "ss1", courseId: "1", duration: 50, date: "2025-09-20", type: "pomodoro" },
  { id: "ss2", courseId: "1", duration: 25, date: "2025-09-20", type: "pomodoro" },
  { id: "ss3", courseId: "2", duration: 45, date: "2025-09-21", type: "free" },
  { id: "ss4", courseId: "3", duration: 30, date: "2025-09-21", type: "pomodoro" },
  { id: "ss5", courseId: "1", duration: 50, date: "2025-09-22", type: "pomodoro" },
];

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(defaultCourses);
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [ideas, setIdeas] = useState<Idea[]>(defaultIdeas);
  const [snippets, setSnippets] = useState<Snippet[]>(defaultSnippets);
  const [studySessions, setStudySessions] = useState<StudySession[]>(defaultStudySessions);

  return (
    <AppContext.Provider value={{ courses, setCourses, tasks, setTasks, ideas, setIdeas, snippets, setSnippets, studySessions, setStudySessions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppState must be used within AppProvider");
  return context;
}
