# Project Scenario: "Last Online" / «Останній раз онлайн»

## 1. Concept & Structure

- **Genre:** Neo-noir chat novel.
- **Chapters:** 10 (5–12 minutes each).
- **Endings:** 4 (Good, Bittersweet, Bad, Secret).
- **Mechanics:** Branching choices, trust variables, timers, and mini-games in Chapters 4, 8, and 9.
- **Audio/Animation:** System sounds (incoming, deleted, timer tick), haptic feedback, typing animations, fade-in/out message bubbles.

## 2. UI Concept

- Messenger interface with dialogue bubbles, avatars, typing indicator, online/status messages, and deleted-message flair.
- Smooth message appearance, gentle scroll inertia, "deleted" shimmer effect.
- Sound palette: ping for messages, muted swoosh for deletions, resonant chime for checkpoints.
- Countdown timer visualised as a ring overlay.
- Mini-games surface in overlay windows above the chat.
- Status panel tracks trust, flags, time, and evidence.
- Default dark theme with character accent colours:
  - Mira – red
  - Orion – cool blue
  - Sam – grey
  - Eva – yellow

## 3. Game Systems & Variables

- **Trust (`trust.X`):** unlocks branches and endings.
- **Flags (`flags`):** narrative triggers (e.g., `seenDeleted`, `hasKey`, `press`).
- **Time (`time.clock`):** hidden progression timer, affected by delays.
- **Evidence (`collected.evidence`):** enables the secret ending.
- **Timed choices:** quick vs. delayed responses alter outcomes.
- **Mini-games:**
  - Chapter 4 – Timestamp Decoder (sequence ordering).
  - Chapter 8 – Social Engineering (respond within timer windows).
  - Chapter 9 – File Valise (assemble password fragments).
- **System events:** new contacts, message deletion, status changes.
- **Checkpoints:** after Chapters 1, 4, 7, and 9.

## 4. Chapter Beats

1. **Chapter 1 – "Point of Entry"**: Sam warns "He's gone" then deletes the message. Player may call or question. Unlocks Mira.
2. **Chapter 2 – "Dead Line"**: Orion last seen online. Decide to wait or confront; affects trust.
3. **Chapter 3 – "Coffee and Lies"**: Mira conversation; empathy vs. pressure yields clues or suspicion.
4. **Chapter 4 – "Server Echo"** *(Mini-game)*: Recover deleted logs via timestamp decoder; success yields evidence and trust.
5. **Chapter 5 – "Mirror of News"**: Eva suggests going public; decision shifts faction reactions and ending eligibility.
6. **Chapter 6 – "Route Shift"**: Access Orion's locked chat; password puzzles reveal secrets or escalate conflict.
7. **Chapter 7 – "Rain Night"**: Trust and flags converge; Mira may confess or withdraw; Sam's support varies; Orion becomes hostile.
8. **Chapter 8 – "Small Betrayals"** *(Mini-game)*: Timed social engineering; success sustains alliances; failure fractures them.
9. **Chapter 9 – "Threshold"** *(Mini-game)*: Assemble password fragments to unlock key file; failure keeps player on default path.
10. **Chapter 10 – "Signals in Rain"**: Ending resolution driven by trust levels, evidence count, and prior decisions.

## 5. Audiovisual Palette

- New message: ping + fade-in bubble.
- Typing indicator: pulsing dots + gentle vibration.
- Deleted message: swoosh + shimmer flash.
- Incoming call (Chapter 1 call branch): sustained ring + heavy vibration.

## 6. Scene JSON Specification

Scenes are encoded as JSON arrays of message objects supporting:

- `textId` and `labelId` localization keys.
- Branching `choices` with optional `effects`.
- System events (`sys`) for typing, status, timers, deleted messages, contact additions.
- `miniGame` hooks for embedded challenges.
- `effects` to mutate trust, flags, time, and evidence.

## 7. Chapter 1 Scene Flow

The file `data/scenes/ch1_intro.json` contains the complete, audio/visual annotated flow for the Chapter 1 intro, including splash screen, language selection, tutorial, Sam's initial messages, deleted-message mechanic, Mira contact unlock, and transitions to Chapter 2 (`ch2.entry` or `ch2.altEntry`).

## 8. Localization Strategy

- Maintain separate dictionaries per language with keys mirrored from `textId`/`labelId` usage.
- Structure keys by chapter (`ch1.*`, `ch2.*`, etc.) and interface (`ui.*`).
- Ensure new scenes append to the dictionary without duplicating keys.

## 9. Integration Checklist

1. Connect global state management (Redux/Zustand) to track trust, flags, timers, evidence, and checkpoints.
2. Wire audio assets to the event hooks referenced in scene data.
3. Implement the three mini-games as React components triggered via `miniGame` definitions.
4. Persist progress using localStorage and export/import for manual saves.
5. Validate that all ending conditions trigger correctly based on the documented variables.

## 10. Next Steps

- Populate remaining chapters with scene JSON.
- Author localization dictionaries for Ukrainian and Russian.
- Build the React demo renderer with Tailwind styling and audio feedback.
- Conduct playtests to tune timer durations, trust thresholds, and branch clarity.
