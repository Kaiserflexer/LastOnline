import React from "react";
import Bubble from "@/components/Bubble";
import Choices, { ChoiceNode } from "@/components/Choices";
import Typing from "@/components/Typing";
import Sidebar from "@/components/Sidebar";
import SystemMsg from "@/components/SystemMsg";
import { applyEffects, handleAV, t } from "@/utils/parser";
import { useGame } from "@/store/state";
import { playSfx } from "@/utils/sfx";

type SceneMessage = {
  from?: string;
  textId?: string;
  choices?: ChoiceNode[];
  sys?: "typing" | "deleted" | "status" | "timer" | "addContact";
  who?: string;
  ms?: number;
  timerMs?: number;
  onExpire?: { goto: string; effects?: Record<string, unknown> };
  effects?: Record<string, unknown>;
  media?: { kind: string; src: string; captionId?: string };
  anim?: { name?: string; durationMs?: number };
  sfx?: { on?: string; vol?: number };
  haptics?: "light" | "medium" | "heavy";
};

type Scene = {
  id: string;
  participants: string[];
  messages: SceneMessage[];
};

const srcModules = import.meta.glob<Scene[] | Scene>("./scenes/**/*.json", {
  eager: true,
  import: "default"
});
const arcModules = import.meta.glob<Scene[] | Scene>("../archive/scenes/**/*.json", {
  eager: true,
  import: "default"
});

function collectScenes(modules: Record<string, Scene[] | Scene>): Scene[] {
  return Object.values(modules)
    .flatMap((entry) => (Array.isArray(entry) ? entry : [entry]))
    .filter((scene): scene is Scene => Boolean(scene && typeof scene.id === "string" && Array.isArray(scene.messages)));
}

const scenes: Scene[] = [...collectScenes(srcModules), ...collectScenes(arcModules)];

function getScene(id: string) {
  return scenes.find((s) => s.id === id);
}

type DisplayedMessage = {
  key: string;
  type: "bubble" | "status" | "deleted" | "timer";
  from?: string;
  me?: boolean;
  textId?: string;
  content?: string;
  anim?: string;
  total?: number;
};

type TypingState = { who?: string; key: string } | null;

type TimerState = {
  key: string;
  total: number;
  remaining: number;
  onExpire?: { goto: string; effects?: Record<string, unknown> };
};

const formatTimer = (ms: number) => {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${seconds}s`;
};

export default function App() {
  const lang = useGame((s) => s.lang);
  const [sceneId, setSceneId] = React.useState<string>("ch1.splash");
  const [cursor, setCursor] = React.useState<number>(0);
  const [log, setLog] = React.useState<DisplayedMessage[]>([]);
  const [activeChoices, setActiveChoices] = React.useState<ChoiceNode[] | null>(null);
  const [typing, setTyping] = React.useState<TypingState>(null);
  const [timer, setTimer] = React.useState<TimerState | null>(null);

  const processedRef = React.useRef<Set<string>>(new Set());
  const advanceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const expireRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = React.useCallback(() => {
    if (advanceRef.current) {
      clearTimeout(advanceRef.current);
      advanceRef.current = null;
    }
    if (expireRef.current) {
      clearTimeout(expireRef.current);
      expireRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const queueNext = React.useCallback(
    (delay = 400, cb?: () => void) => {
      if (advanceRef.current) {
        clearTimeout(advanceRef.current);
      }
      advanceRef.current = setTimeout(() => {
        if (cb) {
          cb();
        } else {
          setCursor((prev) => prev + 1);
        }
      }, delay);
    },
    []
  );

  const gotoScene = React.useCallback(
    (nextId: string) => {
      clearTimers();
      processedRef.current = new Set();
      setActiveChoices(null);
      setTyping(null);
      setTimer(null);
      setSceneId(nextId);
      setCursor(0);
    },
    [clearTimers]
  );

  const appendMessage = React.useCallback((item: DisplayedMessage) => {
    setLog((prev) => [...prev, item]);
  }, []);

  React.useEffect(() => {
    const scene = getScene(sceneId);
    if (!scene) return;
    if (cursor >= scene.messages.length) return;

    const key = `${sceneId}-${cursor}`;
    if (processedRef.current.has(key)) return;
    processedRef.current.add(key);

    const message = scene.messages[cursor];
    handleAV(message);
    if (message.effects) {
      applyEffects(message.effects);
    }

    if (message.sys === "typing") {
      setTyping({ who: message.who, key });
      const typingDelay = message.ms ?? message.anim?.durationMs ?? 1000;
      queueNext(typingDelay, () => {
        setTyping(null);
        setCursor((prev) => prev + 1);
      });
      return;
    }

    if (message.sys === "timer") {
      const total = message.timerMs ?? 10000;
      const timerKey = key;
      setTimer({ key: timerKey, total, remaining: total, onExpire: message.onExpire });
      appendMessage({
        key: timerKey,
        type: "timer",
        textId: message.textId,
        anim: message.anim?.name,
        total
      });
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      const started = Date.now();
      countdownRef.current = setInterval(() => {
        setTimer((prev) => {
          if (!prev || prev.key !== timerKey) return prev;
          const elapsed = Date.now() - started;
          const remaining = Math.max(0, prev.total - elapsed);
          return { ...prev, remaining };
        });
      }, 200);
      if (expireRef.current) {
        clearTimeout(expireRef.current);
      }
      if (message.onExpire?.goto) {
        expireRef.current = setTimeout(() => {
          if (message.onExpire?.effects) {
            applyEffects(message.onExpire.effects);
          }
          gotoScene(message.onExpire.goto);
        }, total);
      }
      queueNext(200);
      return;
    }

    if (message.sys === "status") {
      if (message.textId !== "ui.title") {
        appendMessage({
          key,
          type: "status",
          textId: message.textId,
          anim: message.anim?.name
        });
      }
      queueNext(250);
      return;
    }

    if (message.sys === "addContact") {
      appendMessage({
        key,
        type: "status",
        textId: message.textId,
        content: `+ ${message.who ?? ""}`,
        anim: message.anim?.name
      });
      queueNext(250);
      return;
    }

    if (message.sys === "deleted") {
      appendMessage({
        key,
        type: "deleted",
        from: message.who ?? message.from,
        textId: message.textId,
        anim: message.anim?.name ?? "deleteFlash"
      });
      queueNext(350);
      return;
    }

    if (message.from && message.textId) {
      appendMessage({
        key,
        type: "bubble",
        from: message.from,
        me: message.from === "Alex",
        textId: message.textId,
        anim: message.anim?.name
      });
    } else if (message.textId && message.textId !== "ui.title") {
      appendMessage({
        key,
        type: "status",
        textId: message.textId,
        anim: message.anim?.name
      });
    }

    if (message.choices?.length) {
      setActiveChoices(message.choices as ChoiceNode[]);
      return;
    }

    queueNext(400);
  }, [appendMessage, cursor, gotoScene, queueNext, sceneId]);

  React.useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const onPick = React.useCallback(
    (choice: ChoiceNode) => {
      handleAV(choice);
      playSfx("message_out", 0.6);
      setActiveChoices(null);
      appendMessage({
        key: `${sceneId}-choice-${choice.id}-${Date.now()}`,
        type: "bubble",
        from: "Alex",
        me: true,
        textId: choice.labelId,
        content: choice.labelId ? undefined : choice.id,
        anim: "fadeIn"
      });
      if (choice.effects) {
        applyEffects(choice.effects);
      }
      gotoScene(choice.goto);
    },
    [appendMessage, gotoScene, sceneId]
  );

  const setLanguage = React.useCallback((next: "uk" | "ru") => {
    applyEffects({ lang: next });
    playSfx("choice_show", 0.4);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <div className="flex-1 flex flex-col">
        <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/80 backdrop-blur">
          <div>
            <h1 className="text-lg font-semibold">{t("ui.title")}</h1>
            <p className="text-xs text-slate-400">{t("ui.online_recently")}</p>
          </div>
          <div className="space-x-2">
            <button
              className={`px-3 py-1 rounded-full border transition ${
                lang === "uk"
                  ? "bg-sky-500/90 border-sky-400 text-white"
                  : "border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
              onClick={() => setLanguage("uk")}
            >
              {t("ui.lang.uk")}
            </button>
            <button
              className={`px-3 py-1 rounded-full border transition ${
                lang === "ru"
                  ? "bg-rose-500/90 border-rose-400 text-white"
                  : "border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
              onClick={() => setLanguage("ru")}
            >
              {t("ui.lang.ru")}
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-4 space-y-2 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          {log.map((item) => {
            const text = item.content ?? (item.textId ? t(item.textId) : "");
            if (item.type === "bubble") {
              return (
                <Bubble key={item.key} from={item.from} me={item.me} anim={item.anim}>
                  {text}
                </Bubble>
              );
            }
            if (item.type === "deleted") {
              return (
                <div
                  key={item.key}
                  className={`w-full flex justify-start`}
                >
                  <div className={`max-w-[80%] px-4 py-2 my-1 rounded-2xl border border-rose-500/60 bg-rose-500/20 text-rose-100 text-sm ${item.anim ?? "deleteFlash"}`}>
                    <div className="text-xs uppercase tracking-wide opacity-80 mb-1">
                      {item.from ?? ""}
                    </div>
                    {text}
                  </div>
                </div>
              );
            }
            if (item.type === "timer") {
              const active = timer && timer.key === item.key ? timer.remaining : item.total ?? 0;
              return (
                <div
                  key={item.key}
                  className={`w-full flex justify-center text-xs text-amber-300 ${item.anim ?? "pulse"}`}
                >
                  <div className="px-3 py-1 rounded-full border border-amber-400/60 bg-amber-400/10">
                    {text || t("ui.next")}: {formatTimer(active ?? 0)}
                  </div>
                </div>
              );
            }
            return <SystemMsg key={item.key} text={text} />;
          })}
          {typing && <Typing text={`${typing.who ? typing.who + " " : ""}${t("ui.typing")}`} />}
        </main>
        <footer className="p-4 border-t border-white/10 bg-slate-900/70">
          {activeChoices ? (
            <Choices
              items={activeChoices}
              onPick={onPick}
              label={(id, fallback) => (id ? t(id) : fallback ?? "")}
            />
          ) : (
            <div className="text-center text-xs opacity-70">Глава 1–10 демо</div>
          )}
        </footer>
      </div>
      <Sidebar sceneId={sceneId} />
    </div>
  );
}
