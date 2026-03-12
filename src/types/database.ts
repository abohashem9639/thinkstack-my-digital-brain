// ─── Base Types ────────────────────────────────────────────────────

export type ID = string;

export interface Timestamps {
  created_at: string;
  updated_at?: string;
}

// ─── Academic ──────────────────────────────────────────────────────

export interface Course extends Timestamps {
  id: ID;
  user_id?: ID;
  name: string;
  code: string;
  professor: string;
  color: string;
  description: string;
  semester: string;
}

export interface Lecture extends Timestamps {
  id: ID;
  course_id: ID;
  title: string;
  date: string;
  notes: string;
}

export type AssignmentStatus = "pending" | "in-progress" | "completed";

export interface Assignment extends Timestamps {
  id: ID;
  course_id: ID;
  title: string;
  description: string;
  due_date: string;
  status: AssignmentStatus;
  progress: number;
}

export interface Subtask {
  id: ID;
  assignment_id: ID;
  title: string;
  completed: boolean;
}

export interface Exam extends Timestamps {
  id: ID;
  course_id: ID;
  title: string;
  date: string;
  readiness: number;
  study_plan?: string;
}

export type StudySessionType = "pomodoro" | "free";

export interface StudySession extends Timestamps {
  id: ID;
  user_id?: ID;
  course_id: ID;
  duration: number; // minutes
  date: string;
  type: StudySessionType;
}

// ─── Tasks ─────────────────────────────────────────────────────────

export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type TaskCategory = "academic" | "project" | "personal";

export interface Task extends Timestamps {
  id: ID;
  user_id?: ID;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  due_date?: string;
  course_id?: ID;
}

// ─── Ideas ─────────────────────────────────────────────────────────

export type IdeaCategory = "app" | "feature" | "improvement" | "research";

export interface Idea extends Timestamps {
  id: ID;
  user_id?: ID;
  title: string;
  description: string;
  category: IdeaCategory;
  tags: string[];
}

// ─── Snippets ──────────────────────────────────────────────────────

export interface Snippet extends Timestamps {
  id: ID;
  user_id?: ID;
  title: string;
  code: string;
  language: string;
  tags: string[];
  description: string;
}

// ─── Goals ─────────────────────────────────────────────────────────

export type GoalType = "short-term" | "long-term";
export type GoalCategory = "academic" | "career" | "personal" | "project";
export type GoalStatus = "active" | "completed" | "paused";

export interface Goal extends Timestamps {
  id: ID;
  user_id?: ID;
  title: string;
  description: string;
  type: GoalType;
  category: GoalCategory;
  progress: number;
  target_date?: string;
  status: GoalStatus;
}

export interface Milestone {
  id: ID;
  goal_id: ID;
  title: string;
  completed: boolean;
  sort_order: number;
}

// ─── Knowledge Base ────────────────────────────────────────────────

export interface KnowledgeEntry extends Timestamps {
  id: ID;
  user_id?: ID;
  title: string;
  content: string;
  category: string;
  tags: string[];
  linked_topics: ID[];
}

// ─── Tech Library ──────────────────────────────────────────────────

export type TechCategory = "language" | "framework" | "tool" | "concept" | "database";
export type TechProficiency = "beginner" | "intermediate" | "advanced" | "expert";

export interface TechEntry extends Timestamps {
  id: ID;
  user_id?: ID;
  name: string;
  category: TechCategory;
  proficiency: TechProficiency;
  notes: string;
  resources: string[];
  tags: string[];
}

// ─── Habits ────────────────────────────────────────────────────────

export type HabitFrequency = "daily" | "weekly";

export interface Habit extends Timestamps {
  id: ID;
  user_id?: ID;
  title: string;
  icon: string;
  frequency: HabitFrequency;
  color: string;
}

export interface HabitCompletion {
  id: ID;
  habit_id: ID;
  completed_date: string;
}

// ─── GitHub (Manual) ───────────────────────────────────────────────

export interface GitHubRepo extends Timestamps {
  id: ID;
  user_id?: ID;
  name: string;
  url: string;
  description: string;
  language?: string;
  stars?: number;
  is_private: boolean;
  project_id?: ID; // Link to a task/project
}

// ─── Files ─────────────────────────────────────────────────────────

export interface FileEntry extends Timestamps {
  id: ID;
  user_id?: ID;
  name: string;
  url: string;
  size: number;
  type: string; // mime type
  course_id?: ID;
  folder?: string;
}
