import React from "react";

export type ChoiceNode = {
  id: string;
  labelId?: string;
  goto: string;
  effects?: Record<string, unknown>;
  sfx?: { on: string; vol?: number };
};

export default function Choices({
  items,
  onPick,
  label
}: {
  items: ChoiceNode[];
  onPick: (c: ChoiceNode) => void;
  label: (id?: string, fallback?: string) => string;
}) {
  if (!items?.length) return null;
  return (
    <div className="mt-3 space-y-2">
      {items.map((c) => (
        <button
          key={c.id}
          onClick={() => onPick(c)}
          className="w-full text-left px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/70 hover:bg-slate-700 transition text-slate-100"
        >
          {label(c.labelId, c.id)}
        </button>
      ))}
    </div>
  );
}
