let ctx: AudioContext | null = null;
function ac() {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx!;
}

type BeepOpts = { freq?: number; ms?: number; type?: OscillatorType; vol?: number };
function beep({ freq = 880, ms = 120, type = "sine", vol = 0.2 }: BeepOpts = {}) {
  const a = ac();
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = vol;
  osc.connect(gain).connect(a.destination);
  osc.start();
  osc.stop(a.currentTime + ms / 1000);
}

export function playSfx(ev: string, vol?: number) {
  switch (ev) {
    case "message_in":
      return beep({ freq: 920, ms: 110, type: "triangle", vol: vol ?? 0.15 });
    case "message_out":
      return beep({ freq: 760, ms: 100, type: "triangle", vol: vol ?? 0.15 });
    case "typing_start":
      return beep({ freq: 520, ms: 60, type: "sine", vol: vol ?? 0.08 });
    case "deleted":
      return beep({ freq: 240, ms: 160, type: "square", vol: vol ?? 0.18 });
    case "timer_start":
      return beep({ freq: 660, ms: 90, type: "sine", vol: vol ?? 0.12 });
    case "timer_tick":
      return beep({ freq: 480, ms: 40, type: "sine", vol: vol ?? 0.07 });
    case "timer_expire":
      return beep({ freq: 160, ms: 280, type: "sawtooth", vol: vol ?? 0.22 });
    case "checkpoint":
      return beep({ freq: 440, ms: 220, type: "sine", vol: vol ?? 0.18 });
    case "choice_show":
      return beep({ freq: 1020, ms: 70, type: "triangle", vol: vol ?? 0.12 });
    default:
      return;
  }
}

export function vibrate(kind?: "light" | "medium" | "heavy") {
  if (!("vibrate" in navigator) || !kind) return;
  if (kind === "light") navigator.vibrate([20]);
  else if (kind === "medium") navigator.vibrate([30, 50]);
  else navigator.vibrate([70]);
}
