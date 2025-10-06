import { create } from "zustand";

type State = {
  trust: Record<string, number>;
  flags: Record<string, any>;
  time: { clock: number };
  collected: { evidence: string[] };
  lang: "uk" | "ru";
  set: (p: Partial<State>) => void;
};

export const useGame = create<State>((set) => ({
  trust: { Mira: 0, Orion: 0, Sam: 0, Eva: 0 },
  flags: { hasKey: false, seenDeleted: false, lang: "uk" },
  time: { clock: 0 },
  collected: { evidence: [] },
  lang: "uk",
  set: (p) => set(p)
}));
