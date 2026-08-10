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

export interface RecommendedBuild {
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  psu?: string;
  motherboard?: string;
  casing?: string;
  cooler?: string;
  totalEstimasi?: number;
  alasan?: string;
}

export interface SelectedComponents {
  cpu: string | null;
  gpu: string | null;
  ram: string | null;
  storage: string | null;
  psu: string | null;
  motherboard: string | null;
  casing: string | null;
  cooler: string | null;
}

interface BuilderState {
  summary: BuildSummary | null;
  chatOpen: boolean;
  messages: { role: "user" | "assistant"; content: string }[];
  // Single source of truth — komponen terpilih
  selectedComponents: SelectedComponents;
  totalEstimasi: number;
  budgetTarget: number;
  // Rekomendasi pending dari AI (belum dikonfirmasi user)
  pendingRecommendation: RecommendedBuild | null;
  setSummary: (s: BuildSummary | null) => void;
  addPart: (p: ChatPart) => void;
  removePart: (id: string) => void;
  clearSummary: () => void;
  setChatOpen: (open: boolean) => void;
  addMessage: (m: { role: "user" | "assistant"; content: string }) => void;
  clearMessages: () => void;
  applyRecommendation: (rec: RecommendedBuild) => void;
  setPendingRecommendation: (rec: RecommendedBuild | null) => void;
  clearPendingRecommendation: () => void;
  updateBudget: (budget: number) => void;
}

const EMPTY_COMPONENTS: SelectedComponents = {
  cpu: null, gpu: null, ram: null, storage: null,
  psu: null, motherboard: null, casing: null, cooler: null,
};

export const useBuilderStore = create<BuilderState>((set) => ({
  summary: null,
  chatOpen: false,
  messages: [],
  selectedComponents: { ...EMPTY_COMPONENTS },
  totalEstimasi: 0,
  budgetTarget: 15000000,
  pendingRecommendation: null,
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
  applyRecommendation: (rec) =>
    set((state) => {
      const sel = { ...EMPTY_COMPONENTS };
      if (rec.cpu) sel.cpu = rec.cpu;
      if (rec.gpu) sel.gpu = rec.gpu;
      if (rec.ram) sel.ram = rec.ram;
      if (rec.storage) sel.storage = rec.storage;
      if (rec.psu) sel.psu = rec.psu;
      if (rec.motherboard) sel.motherboard = rec.motherboard;
      if (rec.casing) sel.casing = rec.casing;
      if (rec.cooler) sel.cooler = rec.cooler;
      return {
        selectedComponents: sel,
        totalEstimasi: rec.totalEstimasi ?? state.totalEstimasi,
        pendingRecommendation: null,
      };
    }),
  setPendingRecommendation: (rec) => set({ pendingRecommendation: rec }),
  clearPendingRecommendation: () => set({ pendingRecommendation: null }),
  updateBudget: (budget) => set({ budgetTarget: budget }),
}));