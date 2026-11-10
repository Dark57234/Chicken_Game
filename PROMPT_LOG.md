# Prompt Log – Phase 2 (UI/UX and Generated Skeleton)

> Fill in the group member names and the exact LLM/version used before submitting.
> Prompts below are the ones used for this phase; edit to match what your group actually ran.

## Prompt 1 – Project structure
**Prompt:** "Using the attached whiteboard wireframes (quest battle scene, pull gamble screen, home/inventory room, world map), design a multi-file plain HTML/CSS/JS project with separate view modules per screen, a shared state file, a stubs file for core logic, and a router."
**Result:** Folder layout (`index.html`, `css/`, `js/state.js`, `js/stubs.js`, `js/main.js`, `js/views/*`).
**Manual edits:** None.

## Prompt 2 – Battle screen
**Prompt:** "Generate battle.js: sky with sun and clouds, grass ground, a 'quest 1' box top-left, a house button, a chicken with a sword, a snake and a fox each with a health bar. Use stub functions for attack results."
**Result:** `js/views/battle.js` + related CSS.
**Manual edits:** None yet.

## Prompt 3 – Pull gamble screen
**Prompt:** "Generate gacha.js: title 'Pull gamble', text 'Each pull is 10 eggs', a Special prize area, and Pull x1 / Pull x10 buttons that call a stub and show results."
**Result:** `js/views/gacha.js`.
**Manual edits:** None yet.

## Prompt 4 – Home / inventory screen
**Prompt:** "Generate home.js: a green room with fridge, chest, table, bed. Clicking the chest toggles an inventory panel from a stub; an 'Add furniture' button adds an item."
**Result:** `js/views/home.js`.
**Manual edits:** None yet.

## Prompt 5 – Map screen
**Prompt:** "Generate map.js: a winding path connecting forest, town, clouds, palace. Clicking a node calls a travel stub; show a message if locked."
**Result:** `js/views/map.js`.
**Manual edits:** None yet.

## Prompt 6 – Router and stubs
**Prompt:** "Write main.js with navigate(), toast(), and egg counter, and stubs.js with placeholder functions returning hard-coded values."
**Result:** `js/main.js`, `js/stubs.js`.
**Manual edits:** None yet.

## Reflection notes (Phase 2)
- What the LLM did well:
- What needed manual fixing:
