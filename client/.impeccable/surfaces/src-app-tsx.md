---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/styles/global.css","src/routes/HomePage.tsx","src/routes/LoginPage.tsx","src/routes/SettingsPage.tsx","src/routes/TeamPage.tsx"]
---

## Scope

Whole-app redesign (Operate mode): Login, Home/Today, Week strip, Calendar modal, Team, Settings, bottom nav, and every shared component. Visual world only — behavior, routes, and data flows are unchanged; the user explicitly left structure open to change if the direction wants it.

Audience: the 6 named friends doing the 75 Medium challenge (see PRODUCT.md). Job: check off today's 6 tasks, log water, see the day count, glance at teammates, correct a past day. Constraint volunteered by the user: a "polished" result must not read as corporate/SaaS-y — this is a friend group's own tool, not a B2B product.

## Direction contract

THESIS: Status is a mechanical flip you watch happen, never a stored, silent state change — refusing the glassy dark dashboard-card arrangement (gradient blobs, glass cards, neon per-task colors) that the incumbent build and every AI-generated habit tracker ships.

OWN-WORLD: Deep charcoal board ground (#1c1c1c) carrying ivory split-flap cards (#eee7d8 face, near-black glyph ink); one warm amber flip-accent (#e8a33d) marks a completed flap, a muted brick red (#b5533f) marks a missed one. No gradients, no glass/blur, no neon per-task colors. Every stateful element renders as a physical die-cut flap card with a hard drop-shadow lip: task rows, the day-count digit bank, each teammate's weekly dot-row, and calendar cells. Engraved-steel chassis frames the structural chrome (header bar, bottom nav, modal sheet edge) — brushed gray-steel (#3a3d3f) with rivet-dot details, never a translucent bar. Type: a condensed, slightly mechanical grotesk for numerals and labels, all-caps tracked micro-labels for section headers, tabular numerals everywhere a digit bank appears so digits never jitter on flip.

STORY: Opening the app is like walking up to the gym's status board. Today's six tasks sit as blank flaps waiting to be flipped; the day-count bank reads the true, server-recomputed day number; tapping a task physically flips its flap to a checkmark glyph with a hard mechanical snap (old flap lifts, new flap seats — never a cross-fade). Scrolling down, the week reads as a row of small flap-strips, one per teammate — an honest status board, not a ranked leaderboard (no ranking, no medals). Opening a past day, from the week strip or the calendar, opens that day's flaps already live for editing: browsing and correcting a day are the same tap, never two modes.

FIRST VIEWPORT: Sticky header as an engraved steel plate: app name in tracked caps left, small user chip right. Immediately below, a full-width digit-bank hero reading "DAY dd / nn" in large tabular flap-numerals — the single dominant element of the top of the screen, owning the space the way the OWN-WORLD's negative-space discipline demands, no competing headline beside it — with a slim status flap chip (ACHIEVED / PENDING) directly under it. Below the hero, a vertical stack of six flap rows, one per task: a flat-ink drawn glyph (not stock emoji) inline before the label, the flap itself as the tap target at the row's right edge. The water task renders instead as a small stacked-flap meter with +/- pill controls beneath its row. Bottom nav is four riveted steel tab-plates, fixed, safe-area aware.

FORM: Split-Flap Status Board (airport/train departure boards, gym & stadium scoreboards) — assigned index 4 of the author's ordered 7 grounded candidates for this surface (1 gym whiteboard WOD board, 2 paper wall habit-tracker calendar, 3 hand-written training logbook, 4 split-flap status board, 5 gym locker nameplate/punch card, 6 running bib numeral, 7 protein-tub label), fused against six catalog challengers dealt by the direction round (one held competitive: Gym Kit Tag System / industrial streetwear grammar; five declined, each donating one discipline — vast negative space around the hero numeral, individually-named teammate cards, a four-way hard-snap state vocabulary, the flip staged as a visible mechanical event, and same-tap browse/correct — folded into OWN-WORLD and STORY above). User-confirmed over the competitive alternate and the plain "fitness dashboard standard" canon. Seed key 21f4a27e.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved decisions

- Exact condensed grotesk family for the numeral/label face (system fallback stack to start; confirm at finish or leave as a documented open choice in DESIGN.md).
- Whether Login and Settings inherit the board/flap language at full strength or a quieter chassis-only treatment (default: full strength, re-check at finish for form-field ergonomics).
