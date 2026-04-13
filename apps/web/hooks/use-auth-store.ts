"use client";

import { create } from "zustand";

type AuthState = {
  token: string | null;
  role: "admin" | "teacher" | "student" | null;
  setSession: (payload: { token: string; role: "admin" | "teacher" | "student" }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  setSession: ({ token, role }) => set({ token, role }),
  clearSession: () => set({ token: null, role: null })
}));
