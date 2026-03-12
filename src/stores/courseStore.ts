import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Course, Lecture, Assignment, Subtask, Exam } from "@/types/database";
import { generateId, now } from "@/lib/id";

// ─── Store Interface ───────────────────────────────────────────────

interface CourseStore {
  // State
  courses: Course[];
  lectures: Lecture[];
  assignments: Assignment[];
  subtasks: Subtask[];
  exams: Exam[];

  // Course CRUD
  addCourse: (data: Omit<Course, "id" | "created_at">) => Course;
  updateCourse: (id: string, data: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  getCourseById: (id: string) => Course | undefined;

  // Lecture CRUD
  addLecture: (data: Omit<Lecture, "id" | "created_at">) => Lecture;
  updateLecture: (id: string, data: Partial<Lecture>) => void;
  deleteLecture: (id: string) => void;
  getLecturesByCourse: (courseId: string) => Lecture[];

  // Assignment CRUD
  addAssignment: (data: Omit<Assignment, "id" | "created_at">) => Assignment;
  updateAssignment: (id: string, data: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  getAssignmentsByCourse: (courseId: string) => Assignment[];

  // Subtask CRUD
  addSubtask: (data: Omit<Subtask, "id">) => Subtask;
  toggleSubtask: (id: string) => void;
  deleteSubtask: (id: string) => void;
  getSubtasksByAssignment: (assignmentId: string) => Subtask[];

  // Exam CRUD
  addExam: (data: Omit<Exam, "id" | "created_at">) => Exam;
  updateExam: (id: string, data: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  getExamsByCourse: (courseId: string) => Exam[];
}

// ─── Default Data ──────────────────────────────────────────────────

const defaultCourses: Course[] = [
  {
    id: "c1", name: "Data Structures & Algorithms", code: "CS201",
    professor: "Dr. Ahmad", color: "hsl(217, 91%, 60%)",
    description: "Advanced data structures and algorithm analysis",
    semester: "Spring 2026", created_at: "2026-01-15T00:00:00Z",
  },
  {
    id: "c2", name: "Operating Systems", code: "CS301",
    professor: "Dr. Sara", color: "hsl(142, 71%, 45%)",
    description: "Process management, memory, file systems",
    semester: "Spring 2026", created_at: "2026-01-15T00:00:00Z",
  },
  {
    id: "c3", name: "Database Systems", code: "CS305",
    professor: "Dr. Khaled", color: "hsl(38, 92%, 55%)",
    description: "Relational databases, SQL, normalization",
    semester: "Spring 2026", created_at: "2026-01-15T00:00:00Z",
  },
];

const defaultLectures: Lecture[] = [
  { id: "l1", course_id: "c1", title: "Binary Trees", date: "2026-02-15", notes: "Covered traversal methods: inorder, preorder, postorder", created_at: "2026-02-15T00:00:00Z" },
  { id: "l2", course_id: "c1", title: "Graph Algorithms", date: "2026-02-22", notes: "BFS and DFS implementations", created_at: "2026-02-22T00:00:00Z" },
];

const defaultAssignments: Assignment[] = [
  { id: "a1", course_id: "c1", title: "Implement AVL Tree", description: "Full AVL tree with rotations", due_date: "2026-03-20", status: "in-progress", progress: 60, created_at: "2026-02-20T00:00:00Z" },
  { id: "a2", course_id: "c2", title: "Process Scheduler Simulation", description: "Simulate FCFS, SJF, Round Robin", due_date: "2026-03-25", status: "pending", progress: 0, created_at: "2026-02-25T00:00:00Z" },
];

const defaultSubtasks: Subtask[] = [
  { id: "st1", assignment_id: "a1", title: "Implement left rotation", completed: true },
  { id: "st2", assignment_id: "a1", title: "Implement right rotation", completed: true },
  { id: "st3", assignment_id: "a1", title: "Implement insert with balancing", completed: false },
  { id: "st4", assignment_id: "a1", title: "Write unit tests", completed: false },
];

const defaultExams: Exam[] = [
  { id: "e1", course_id: "c1", title: "Midterm Exam", date: "2026-04-01", readiness: 45, study_plan: "Review chapters 5-8, practice tree problems", created_at: "2026-02-01T00:00:00Z" },
];

// ─── Store ─────────────────────────────────────────────────────────

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      // Initial state
      courses: defaultCourses,
      lectures: defaultLectures,
      assignments: defaultAssignments,
      subtasks: defaultSubtasks,
      exams: defaultExams,

      // ─── Course CRUD ───────────────────────────────────────
      addCourse: (data) => {
        const course: Course = { ...data, id: generateId(), created_at: now() };
        set((s) => ({ courses: [...s.courses, course] }));
        return course;
      },

      updateCourse: (id, data) =>
        set((s) => ({
          courses: s.courses.map((c) => (c.id === id ? { ...c, ...data, updated_at: now() } : c)),
        })),

      deleteCourse: (id) =>
        set((s) => ({
          courses: s.courses.filter((c) => c.id !== id),
          lectures: s.lectures.filter((l) => l.course_id !== id),
          assignments: s.assignments.filter((a) => a.course_id !== id),
          exams: s.exams.filter((e) => e.course_id !== id),
          // Also clean up subtasks for deleted assignments
          subtasks: s.subtasks.filter(
            (st) => !s.assignments.filter((a) => a.course_id === id).some((a) => a.id === st.assignment_id)
          ),
        })),

      getCourseById: (id) => get().courses.find((c) => c.id === id),

      // ─── Lecture CRUD ──────────────────────────────────────
      addLecture: (data) => {
        const lecture: Lecture = { ...data, id: generateId(), created_at: now() };
        set((s) => ({ lectures: [...s.lectures, lecture] }));
        return lecture;
      },

      updateLecture: (id, data) =>
        set((s) => ({
          lectures: s.lectures.map((l) => (l.id === id ? { ...l, ...data, updated_at: now() } : l)),
        })),

      deleteLecture: (id) =>
        set((s) => ({ lectures: s.lectures.filter((l) => l.id !== id) })),

      getLecturesByCourse: (courseId) =>
        get().lectures.filter((l) => l.course_id === courseId),

      // ─── Assignment CRUD ───────────────────────────────────
      addAssignment: (data) => {
        const assignment: Assignment = { ...data, id: generateId(), created_at: now() };
        set((s) => ({ assignments: [...s.assignments, assignment] }));
        return assignment;
      },

      updateAssignment: (id, data) =>
        set((s) => ({
          assignments: s.assignments.map((a) => (a.id === id ? { ...a, ...data, updated_at: now() } : a)),
        })),

      deleteAssignment: (id) =>
        set((s) => ({
          assignments: s.assignments.filter((a) => a.id !== id),
          subtasks: s.subtasks.filter((st) => st.assignment_id !== id),
        })),

      getAssignmentsByCourse: (courseId) =>
        get().assignments.filter((a) => a.course_id === courseId),

      // ─── Subtask CRUD ──────────────────────────────────────
      addSubtask: (data) => {
        const subtask: Subtask = { ...data, id: generateId() };
        set((s) => ({ subtasks: [...s.subtasks, subtask] }));
        return subtask;
      },

      toggleSubtask: (id) =>
        set((s) => ({
          subtasks: s.subtasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st)),
        })),

      deleteSubtask: (id) =>
        set((s) => ({ subtasks: s.subtasks.filter((st) => st.id !== id) })),

      getSubtasksByAssignment: (assignmentId) =>
        get().subtasks.filter((st) => st.assignment_id === assignmentId),

      // ─── Exam CRUD ─────────────────────────────────────────
      addExam: (data) => {
        const exam: Exam = { ...data, id: generateId(), created_at: now() };
        set((s) => ({ exams: [...s.exams, exam] }));
        return exam;
      },

      updateExam: (id, data) =>
        set((s) => ({
          exams: s.exams.map((e) => (e.id === id ? { ...e, ...data, updated_at: now() } : e)),
        })),

      deleteExam: (id) =>
        set((s) => ({ exams: s.exams.filter((e) => e.id !== id) })),

      getExamsByCourse: (courseId) =>
        get().exams.filter((e) => e.course_id === courseId),
    }),
    {
      name: "ts-courses-v2",
    }
  )
);
