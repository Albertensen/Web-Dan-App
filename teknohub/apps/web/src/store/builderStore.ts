"use client";

import { create } from "zustand";

export interface ChatPart {
  id: string;
  name: string;
  type: string;
  price: number;
}

export interface BuildSummary {
  parts: ChatPart[];
  total: number;
  useCase: string;
  budget: number;
}

interface BuilderState {
  summary: BuildSummary | null;
  chatOpen: boolean;
  messages: { role: "user" | "assistant"; content: string }[];
  setSummary: (s: BuildSummary | null) => void;
  addPart: (p: ChatPart) => void;
  removePart: (id: string) => void;
  clearSummary: () => void;
  setChatOpen: (open: boolean) => void;
  addMessage: (m: { role: "user" | "assistant"; content: string }) => void;
  clearMessages: () => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  summary: null,
  chatOpen: false,
  messages: [],
  setSummary: (summary) => set({ summary }),
  addPart: (part) =>
    set((state) => {
      if (!state.summary) return state;
      const exists = state.summary.parts.some((p) => p.type === part.type);
      const parts = exists
        ? state.summary.parts.map((p) => (p.type === part.type ? part : p))
        : [...state.summary.parts, part];
      const total = parts.reduce((sum, p) => sum + p.price, 0);
      return { summary: { ...state.summary, parts, total } };
    }),
  removePart: (id) =>
    set((state) => {
      if (!state.summary) return state;
      const parts = state.summary.parts.filter((p) => p.id !== id);
      const total = parts.reduce((sum, p) => sum + p.price, 0);
      return { summary: { ...state.summary, parts, total } };
    }),
  clearSummary: () => set({ summary: null }),
  setChatOpen: (chatOpen) => set({ chatOpen }),
  addMessage: (m) => set((state) => ({ messages: [...state.messages, m] })),
  clearMessages: () => set({ messages: [] }),
}));
