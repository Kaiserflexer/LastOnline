import React from "react";
import { useGame } from "@/store/state";
import { t } from "@/utils/parser";

export default function Sidebar({ sceneId }: { sceneId: string }) {
  const state = useGame();
  return (
    <aside className="w-72 border-l border-white/10 p-4 space-y-4 bg-slate-950/50">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
          {t("ui.title")}
        </div>
        <div className="text-sm text-slate-300 mt-1 font-mono">{sceneId}</div>
      </div>
      <section className="space-y-3 text-slate-200 text-sm">
        <div className="bg-white/5 rounded-xl p-3">
          <div className="opacity-70 text-xs uppercase tracking-wide mb-1">Trust</div>
          {Object.entries(state.trust).map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs">
              <span>{k}</span>
              <span className="font-mono">{v}</span>
            </div>
          ))}
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <div className="opacity-70 text-xs uppercase tracking-wide mb-1">Flags</div>
          {Object.entries(state.flags).map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs">
              <span>{k}</span>
              <span className="font-mono">{String(v)}</span>
            </div>
          ))}
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <div className="opacity-70 text-xs uppercase tracking-wide mb-1">Time</div>
          <div className="flex justify-between text-xs">
            <span>clock</span>
            <span className="font-mono">{state.time.clock}</span>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <div className="opacity-70 text-xs uppercase tracking-wide mb-1">Evidence</div>
          <div className="text-xs break-words text-slate-300">
            {state.collected.evidence.length ? state.collected.evidence.join(", ") : "—"}
          </div>
        </div>
      </section>
    </aside>
  );
}
