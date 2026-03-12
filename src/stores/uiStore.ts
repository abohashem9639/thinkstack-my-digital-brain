import { create } from "zustand";

interface UIStore {
  focusMode: boolean;
  focusTaskId: string | null;
  setFocusMode: (active: boolean) => void;
  setFocusTaskId: (id: string | null) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  focusMode: false,
  focusTaskId: null,
  setFocusMode: (active) => set({ focusMode: active }),
  setFocusTaskId: (id) => set({ focusTaskId: id }),
}));
