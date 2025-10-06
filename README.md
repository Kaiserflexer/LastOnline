# Last Online / Останній раз онлайн

"Last Online" ("Останній раз онлайн") is a bilingual neo-noir chat novel told through an interactive messenger UI. This repository tracks the narrative structure, branching logic, audiovisual guidelines, and implementation notes for the project.

## Repository contents

- `docs/` – extended design documentation that captures the overall game concept, mechanics, and integration requirements.
- `data/scenes/` – structured JSON scene data that the runtime parser can consume. Currently includes the full playable flow for Chapter 1.
- `LICENSE` – GPL-3.0 license governing the project.

## Quick start

1. Review `docs/design_overview.md` for the complete scenario outline, UI principles, and mechanic specifications.
2. Load `data/scenes/ch1_intro.json` into the narrative engine or prototype renderer to experience Chapter 1.
3. Implement parsers, UI components, and mini-games following the integration checklist in the documentation.

## Localization

All dialogue text is referenced by localization keys (`textId`, `labelId`). Provide actual localized strings in external dictionaries (e.g., `i18n/uk.json`, `i18n/ru.json`) according to the key map described in the documentation.

## Contributing

Please open a pull request for any narrative, UI, or engine changes. Ensure new branches adhere to the documented trust/flag/time variable conventions and that any added audiovisual cues use existing naming patterns when possible.
