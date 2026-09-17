---
name: 75 Medium
description: A split-flap status board for a friend group's 75 Medium challenge — status as a mechanical flip, never a silent database update.
colors:
  board: "#1c1c1c"
  board-2: "#242424"
  board-3: "#2b2b2b"
  steel: "#3a3d3f"
  border-steel: "#46494b"
  rivet: "#5c5f61"
  flap: "#eee7d8"
  flap-ink: "#1a1a18"
  flap-muted: "#d8d0bd"
  amber: "#e8a33d"
  amber-ink: "#241a08"
  brick: "#b5533f"
  text: "#eee7d8"
  text-muted: "#9c968a"
typography:
  display:
    fontFamily: "Oswald, Arial Narrow, sans-serif"
    fontSize: "clamp(11px, 2vw, 32px)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.04em"
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "normal"
rounded:
  sm: "5px"
  md: "7px"
  lg: "12px"
  xl: "16px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "18px"
components:
  flap-done:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.amber-ink}"
    rounded: "{rounded.sm}"
  flap-blank:
    backgroundColor: "{colors.flap}"
    textColor: "{colors.flap-ink}"
    rounded: "{rounded.sm}"
  flap-missed:
    backgroundColor: "{colors.brick}"
    textColor: "#2a120c"
    rounded: "{rounded.sm}"
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.amber-ink}"
    rounded: "{rounded.md}"
    padding: "13px 16px"
  button-primary-hover:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.amber-ink}"
    rounded: "{rounded.md}"
    padding: "13px 16px"
---

# Design System: 75 Medium

## Overview

**Creative North Star: "The Split-Flap Status Board"**

75 Medium reads like the departure board at a gym or a train station: every day's status is a physical flap that flips into place, never a value that silently changes underneath you. That mechanism is not decoration — it is the honest expression of how the product actually works: challenge day, streak, and status are recomputed fresh from the log history on every load, so nothing here is a stored counter pretending to be a fact. The board flips because the truth flipped.

The system replaces the incumbent look — a near-black gradient dashboard with glass cards, neon per-task colors, and gradient-clipped text — with a flat, mechanical, industrial world: charcoal board, ivory die-cut flap cards, brushed-steel chassis, one warm amber accent for "done," and brick red for "missed." Nothing glows, blurs, or gradates. Icons are drawn, not borrowed from emoji.

**Key Characteristics:**
- Every stateful value (a task, a day, a teammate's recent history) renders as a physical flap card, not a colored badge or icon.
- One accent color (amber) means "done." A second (brick) means "missed." Nothing else competes for that role.
- Flat steel and board surfaces at rest; only flap cards carry a raised, mechanical drop-shadow.
- Tabular numerals everywhere a count appears, so digits never jitter.
- No gradients, no glass/blur, no neon, no emoji-as-icon, no leaderboard ranking of teammates.

## Colors

A restrained, near-monochrome board (charcoal + ivory) carrying exactly two semantic accents.

### Primary
- **Signal Amber** (`#e8a33d`): the single "done" / positive-state color — a flipped task flap, the day's achieved status pill, primary buttons, the active bottom-nav tab. Used sparingly and always means completion.

### Secondary
- **Warning Brick** (`#b5533f`): the single "missed" state — a missed day's flap in the week strip, calendar, and team history. Never used for anything else.

### Neutral
- **Board Charcoal** (`#1c1c1c`): the app's base background — the "board" everything sits on.
- **Panel Charcoal** (`#242424`) / **Recessed Charcoal** (`#2b2b2b`): card surfaces and input backgrounds, one step and two steps lighter than the board.
- **Chassis Steel** (`#3a3d3f`) with **Steel Hairline** border (`#46494b`): the header, bottom nav, and modal edge — brushed structural metal, never a translucent bar.
- **Flap Ivory** (`#eee7d8`): the face of every flap card and the app's primary text color on dark surfaces.
- **Flap Ink** (`#1a1a18`): text/icon color printed on an ivory or amber flap face.
- **Muted Ivory** (`#9c968a`): secondary/caption text on the board.

### Named Rules
**The One Flip Rule.** A value only ever has three visual states — blank (ivory), done (amber), or missed (brick). No fourth color is ever introduced for state; new task types reuse these three, never a new hue.

## Typography

**Display Font:** Oswald (self-hosted variable font, weights 200–700), with Arial Narrow / sans-serif fallback
**Body Font:** Inter (self-hosted variable font, weights 100–900), with system-ui fallback

**Character:** Oswald is condensed, mechanical, and slightly industrial — it carries every numeral, label, and button the way stenciled signage or a scoreboard would. Inter stays purely legible for task copy and form content, where a long Dutch sentence needs to read easily rather than perform.

### Hierarchy
- **Display** (700, up to 32px in the digit bank, tabular numerals): the day-count and login numerals — the single most prominent thing on a screen.
- **Title** (600–700, 14–20px, uppercase tracked 0.04–0.14em): section titles, the header wordmark, plate/nav labels.
- **Body** (500–600, 14px, sentence case): task labels and other content copy that needs to stay easy to read at length.
- **Label** (600, 10.5–12.5px, uppercase, tracked 0.03–0.08em): captions, field labels, chip/button text.

### Named Rules
**The Tabular Rule.** Anywhere a number can change (day counts, ml readouts, stat lines), `font-variant-numeric: tabular-nums` is mandatory so digits never shift the surrounding layout.

## Layout

Mobile-first single column, capped at 480px and centered on wider viewports (`.app-shell`) — the app never tries to become a desktop dashboard. A sticky steel header sits above the content; a fixed steel bottom-nav sits below it, both edge-to-edge past the 480px cap. Page content uses 16px side padding and an 18px gap between sections, tighter (10px) within a section's own list. The one non-scrolling exception is the calendar, which opens as a bottom sheet (`.modal-sheet`) rather than a full route.

## Elevation & Depth

Hybrid, and deliberately uneven: panels, chassis, and inputs are flat at rest (no shadow), because a steel plate or a paper form doesn't float. Only flap cards — the things that are physically "die-cut" in the metaphor — carry a real drop shadow with an offset and soft blur, so they read as a raised card sitting on the board. Steel surfaces get a one-pixel inset highlight/lowlight instead of a shadow, simulating a brushed-metal bevel rather than glow.

### Shadow Vocabulary
- **Flap lip** (`0 1px 0 rgba(255,255,255,.25) inset, 0 2px 0 rgba(0,0,0,.4), 0 5px 8px rgba(0,0,0,.3)`): every flap card, in every state.
- **Steel bevel** (`inset 0 1px 0 rgba(255,255,255,.08), inset 0 -1px 0 rgba(0,0,0,.3), 0 2px 6px rgba(0,0,0,.35)`): header, bottom nav.

### Named Rules
**The Flat-Chassis Rule.** Steel and board surfaces never cast a shadow of their own; only flap cards do. If an element needs to look "important," it becomes a flap, not a bigger shadow.

## Shapes

Small, consistent corner radii throughout (5–16px) reading as die-cut card corners rather than soft app rounding — nothing pill-shaped except the one status badge (`999px`) borrowed deliberately from a real departure-board status light. Flap tiles are near-square; rows and panels are gently rounded rectangles. No clip-path illustration shapes, no circular avatar crops.

## Components

### Flap (signature component)
The one recurring primitive everything else is built from (`src/components/Flap.tsx`). A small rectangular tile with a printed hairline seam across its vertical center (the split-flap hinge), rendered in one of five states: `blank` (muted ivory), `done` (amber), `missed` (brick), `today` (a 2px amber ring added on top of any state), `future` (dim, low-opacity). Comes in five sizes from `xs` (26px, day dots) to `lg` (52×60px), plus a `grid` size that fills a calendar cell. `FlapDigitBank` composes single-character flaps into a numeral readout (the day counter, the login wordmark's "75").

### Buttons
- **Shape:** 7–9px radius, uppercase tracked Oswald label.
- **Primary:** solid amber fill, dark ink text, no gradient, no border distinct from fill.
- **Secondary/Ghost:** `board-3` or transparent fill with a steel hairline border; ghost drops the border entirely for the least prominent action (e.g. "−250ml").
- **Hover/Focus:** border shifts to amber on hover (desktop only, `@media (hover: hover)`); focus-visible gets a 2px amber outline everywhere.

### Flap Row (task item)
A steel-plate row (`board-2` background) holding an icon chip, label + optional sub-label, and a trailing `Flap` as the actual tap target and state indicator. When done, the icon chip tints toward amber; the row's background never changes, keeping label text contrast constant regardless of state.

### Cards / Containers
- **Corner style:** 12px (`.card`, `.team-card`), 16px for the day hero and login plate.
- **Background:** `board-2`, steel hairline border, no shadow.
- **Padding:** 14–18px.

### Inputs / Fields
- **Style:** `board-3` fill, steel hairline border, 7px radius, Inter body text; the login code field alone uses Oswald with letter-spacing to read like a keyed-in code.
- **Focus:** the global amber `:focus-visible` ring; caret color is amber.
- **Labels:** small uppercase tracked Oswald above the field, never a floating/inline label.

### Navigation
Bottom nav is three steel tab-plates with an authored SVG icon (never emoji) over an uppercase Oswald label; the active tab gets an amber underline and a faint amber tint, no pill background. The header is a single steel plate with the wordmark left, the logged-in user's name beneath it, and a logout icon-button right; two small rivet dots bookend the plate.

## Do's and Don'ts

### Do:
- **Do** render every stateful value (task, day, teammate history) as a `Flap`, never as a colored badge, dot, or emoji.
- **Do** keep amber exclusively for "done" and brick exclusively for "missed" — never repurpose either for anything else, including brand decoration.
- **Do** apply tabular numerals to every numeric readout.
- **Do** let a past day's row open already editable from wherever it's tapped (week strip, calendar) — browsing and correcting a day are the same interaction, never two modes.
- **Do** keep teammates unranked and individually named on the Team screen — a status board, never a leaderboard.

### Don't:
- **Don't** use a gradient anywhere — not on text, not on a button fill, not on a background.
- **Don't** use glass, blur, or a soft neon glow. Depth comes from the flap's hard drop-shadow only.
- **Don't** use a Unicode emoji as a functional icon; every icon is an authored SVG from `src/components/icons.tsx`.
- **Don't** introduce a fourth semantic state color beyond ivory / amber / brick.
- **Don't** widen the app shell past 480px on large screens — it stays a centered mobile column, it does not become a desktop dashboard layout.
