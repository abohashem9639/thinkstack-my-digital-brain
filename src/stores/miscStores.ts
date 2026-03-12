import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Idea, Snippet, KnowledgeEntry, TechEntry } from "@/types/database";
import { generateId, now } from "@/lib/id";

// ─── Ideas Store ───────────────────────────────────────────────────

interface IdeaStore {
  ideas: Idea[];
  addIdea: (data: Omit<Idea, "id" | "created_at">) => Idea;
  updateIdea: (id: string, data: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
}

const defaultIdeas: Idea[] = [
  { id: "i1", title: "AI Study Planner", description: "Use machine learning to predict optimal study schedules", category: "app", tags: ["AI", "productivity"], created_at: "2026-02-10T00:00:00Z" },
  { id: "i2", title: "Code snippet sharing", description: "Add ability to share snippets via link", category: "feature", tags: ["sharing", "social"], created_at: "2026-02-15T00:00:00Z" },
];

export const useIdeaStore = create<IdeaStore>()(
  persist(
    (set) => ({
      ideas: defaultIdeas,
      addIdea: (data) => {
        const idea: Idea = { ...data, id: generateId(), created_at: now() };
        set((s) => ({ ideas: [...s.ideas, idea] }));
        return idea;
      },
      updateIdea: (id, data) =>
        set((s) => ({ ideas: s.ideas.map((i) => (i.id === id ? { ...i, ...data, updated_at: now() } : i)) })),
      deleteIdea: (id) =>
        set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) })),
    }),
    { name: "ts-ideas-v2" }
  )
);

// ─── Snippets Store ────────────────────────────────────────────────

interface SnippetStore {
  snippets: Snippet[];
  addSnippet: (data: Omit<Snippet, "id" | "created_at">) => Snippet;
  updateSnippet: (id: string, data: Partial<Snippet>) => void;
  deleteSnippet: (id: string) => void;
}

const defaultSnippets: Snippet[] = [
  { id: "sn1", title: "React Custom Hook", code: 'function useToggle(initial = false) {\n  const [v, setV] = useState(initial);\n  return [v, () => setV(!v)] as const;\n}', language: "TypeScript", tags: ["React", "hooks"], description: "Simple toggle hook", created_at: "2026-02-20T00:00:00Z" },
];

export const useSnippetStore = create<SnippetStore>()(
  persist(
    (set) => ({
      snippets: defaultSnippets,
      addSnippet: (data) => {
        const snippet: Snippet = { ...data, id: generateId(), created_at: now() };
        set((s) => ({ snippets: [...s.snippets, snippet] }));
        return snippet;
      },
      updateSnippet: (id, data) =>
        set((s) => ({ snippets: s.snippets.map((sn) => (sn.id === id ? { ...sn, ...data, updated_at: now() } : sn)) })),
      deleteSnippet: (id) =>
        set((s) => ({ snippets: s.snippets.filter((sn) => sn.id !== id) })),
    }),
    { name: "ts-snippets-v2" }
  )
);

// ─── Knowledge Store ───────────────────────────────────────────────

interface KnowledgeStore {
  entries: KnowledgeEntry[];
  addEntry: (data: Omit<KnowledgeEntry, "id" | "created_at" | "updated_at">) => KnowledgeEntry;
  updateEntry: (id: string, data: Partial<KnowledgeEntry>) => void;
  deleteEntry: (id: string) => void;
  linkEntries: (sourceId: string, targetId: string) => void;
}

const defaultKnowledge: KnowledgeEntry[] = [
  { id: "k1", title: "REST API Design Best Practices", content: "## Key Principles\n1. **Use nouns for resources**: '/users', '/posts'\n2. **HTTP methods for actions**: GET, POST, PUT, DELETE\n3. **Use proper status codes**\n- 200 OK\n- 201 Created\n- 404 Not Found\n- 500 Server Error", category: "Backend", tags: ["API", "REST"], linked_topics: ["k2"], created_at: "2026-03-05T00:00:00Z", updated_at: "2026-03-05T00:00:00Z" },
  { id: "k2", title: "React Performance Optimization", content: "## Techniques\n1. **React.memo** - Memoize component renders\n2. **useMemo** - Memoize expensive calculations\n3. **useCallback** - Memoize functions\n4. **Code splitting** - lazy() and Suspense", category: "Frontend", tags: ["React", "performance"], linked_topics: ["k1"], created_at: "2026-03-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z" },
];

export const useKnowledgeStore = create<KnowledgeStore>()(
  persist(
    (set) => ({
      entries: defaultKnowledge,
      addEntry: (data) => {
        const entry: KnowledgeEntry = { ...data, id: generateId(), created_at: now(), updated_at: now() };
        set((s) => ({ entries: [...s.entries, entry] }));
        return entry;
      },
      updateEntry: (id, data) =>
        set((s) => ({ entries: s.entries.map((e) => (e.id === id ? { ...e, ...data, updated_at: now() } : e)) })),
      deleteEntry: (id) =>
        set((s) => ({
          entries: s.entries
            .filter((e) => e.id !== id)
            .map((e) => ({ ...e, linked_topics: e.linked_topics.filter((lt) => lt !== id) })),
        })),
      linkEntries: (sourceId, targetId) =>
        set((s) => ({
          entries: s.entries.map((e) => {
            if (e.id === sourceId && !e.linked_topics.includes(targetId)) {
              return { ...e, linked_topics: [...e.linked_topics, targetId] };
            }
            if (e.id === targetId && !e.linked_topics.includes(sourceId)) {
              return { ...e, linked_topics: [...e.linked_topics, sourceId] };
            }
            return e;
          }),
        })),
    }),
    { name: "ts-knowledge-v2" }
  )
);

// ─── Tech Library Store ────────────────────────────────────────────

interface TechStore {
  entries: TechEntry[];
  addEntry: (data: Omit<TechEntry, "id" | "created_at">) => TechEntry;
  updateEntry: (id: string, data: Partial<TechEntry>) => void;
  deleteEntry: (id: string) => void;
}

const defaultTech: TechEntry[] = [
  { id: "te1", name: "React", category: "framework", proficiency: "advanced", notes: "Primary frontend framework. Hooks-based architecture, Context API for state.", resources: ["https://react.dev", "https://reactrouter.com"], tags: ["frontend", "JavaScript", "UI"], created_at: "2026-01-01T00:00:00Z" },
  { id: "te2", name: "TypeScript", category: "language", proficiency: "intermediate", notes: "Type-safe JavaScript. Using with React projects for better DX.", resources: ["https://typescriptlang.org"], tags: ["language", "JavaScript", "types"], created_at: "2026-01-01T00:00:00Z" },
  { id: "te3", name: "PostgreSQL", category: "database", proficiency: "intermediate", notes: "Relational database. Used in DB course and projects.", resources: ["https://postgresql.org"], tags: ["database", "SQL", "backend"], created_at: "2026-01-01T00:00:00Z" },
];

export const useTechStore = create<TechStore>()(
  persist(
    (set) => ({
      entries: defaultTech,
      addEntry: (data) => {
        const entry: TechEntry = { ...data, id: generateId(), created_at: now() };
        set((s) => ({ entries: [...s.entries, entry] }));
        return entry;
      },
      updateEntry: (id, data) =>
        set((s) => ({ entries: s.entries.map((e) => (e.id === id ? { ...e, ...data, updated_at: now() } : e)) })),
      deleteEntry: (id) =>
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
    }),
    { name: "ts-tech-v2" }
  )
);
