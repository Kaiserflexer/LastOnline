import { useGame } from "@/store/state";
import uk from "@/i18n/uk.json";
import ru from "@/i18n/ru.json";
import { playSfx, vibrate } from "./sfx";

export type EffectMap = Record<string, unknown>;

export function applyEffects(effects?: EffectMap) {
  if (!effects) return;
  useGame.setState((state) => {
    const next = {
      ...state,
      trust: { ...state.trust },
      flags: { ...state.flags },
      time: { ...state.time },
      collected: { evidence: [...state.collected.evidence] }
    };
    for (const [key, value] of Object.entries(effects)) {
      if (key.startsWith("trust.")) {
        const who = key.split(".")[1];
        next.trust[who] = (next.trust[who] ?? 0) + Number(value ?? 0);
      } else if (key.startsWith("flags.")) {
        const flag = key.split(".")[1];
        next.flags[flag] = value;
      } else if (key.startsWith("time.")) {
        const timeKey = key.split(".")[1];
        if (typeof value === "string" && value.startsWith("+")) {
          next.time[timeKey] = (Number(next.time[timeKey]) || 0) + Number(value.slice(1));
        } else if (typeof value === "number") {
          next.time[timeKey] = value;
        }
      } else if (key === "collected.evidence+" && typeof value === "string") {
        if (!next.collected.evidence.includes(value)) {
          next.collected.evidence.push(value);
        }
      } else if (key === "lang" && (value === "uk" || value === "ru")) {
        next.lang = value;
        next.flags.lang = value;
      }
    }
    return next;
  });
}

export function t(id?: string) {
  if (!id) return "";
  const lang = useGame.getState().lang;
  const dict = lang === "uk" ? (uk as Record<string, string>) : (ru as Record<string, string>);
  return dict[id] ?? id;
}

export function handleAV(node: { sfx?: { on?: string; vol?: number }; haptics?: string } | undefined) {
  if (!node) return;
  if (node.sfx?.on) {
    playSfx(node.sfx.on, node.sfx.vol);
  }
  if (node.haptics) {
    vibrate(node.haptics as "light" | "medium" | "heavy");
  }
}
