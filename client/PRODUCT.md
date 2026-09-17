# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A closed group of 6 friends (Daan, Jochem, Lieke, Noortje, Ray, Rick) doing the "75 Medium" challenge together. Each logs in with a personal hardcoded access code (not a real account/password system) and uses the app daily, mostly on their phone, to check off that day's tasks and see how the rest of the group is doing. This is permanently private to this one group — not a multi-tenant product and not intended to ever onboard other groups or the public.

## Product Purpose

Lets the group track a shared 75 Medium challenge: check off the day's required tasks, log water intake against a personal goal, see the current week and a full calendar, follow teammates' progress, and correct a past day after the fact. Success is the group actually completing the 75 (or more, if days were missed) days together, with everyone able to see honestly where the group stands at a glance.

## Positioning

Not a public/competing product — a private accountability tool built for this specific group's run of the challenge. Its defining mechanism: challenge length and "day X of Y" are never stored as a counter, they're recomputed server-side from the full log history every time (`api/src/shared/challengeMath.ts`), so retroactively fixing a past day immediately and correctly ripples through the day count, streak, and end date with no separate sync step.

## Operating Context

Daily, mobile-first use throughout a 75-day challenge period. Core loop: open app → see today → check off tasks and log water → glance at teammates' progress. Secondary flows: opening the week strip/calendar to review or retroactively correct a past day, and a settings screen where each user can edit their own task text and (implicitly) personal settings like weight (used for the water goal).

## Capabilities and Constraints

- Fixed set of 6 daily tasks, not user-extensible: water, workout (45 min), reading (10 pages or 10 min podcast/self-help), diet, meditation (5 min), no alcohol. Task IDs and defaults live in `api/src/shared/constants.ts`.
- A day counts as "achieved" only if every task is done that day (diet allows a "cheat" flag as an alternate pass) — see `isDayAchieved` in `api/src/shared/challengeMath.ts`.
- Water goal defaults to weight (kg) × 33 ml, overridable per user; logged in cups of a configurable size.
- Adding new task types is explicitly not supported yet (deliberate scope cut per README); users can only edit the label text of the existing 6.
- Auth is 6 hardcoded per-person codes (`api/src/shared/users.ts`), no signup/registration flow, no password reset.
- Data: Azure Table Storage, two tables (`DailyLogs`, `UserSettings`). Local dev runs Azurite + Azure Functions + Vite concurrently.
- Deploys as a single Azure Static Web App (client + managed Functions API), free tier.

## Brand Commitments

Name: "75 Medium" (the challenge's own name; app has no separate branding beyond it). No logo or visual identity established yet.

## Evidence on Hand

No real usage data, testimonials, or screenshots on hand yet — the app has not been used for a live challenge run. Do not fabricate progress data, streaks, or team quotes; use plausible placeholder data (e.g. the 6 real first names with invented but clearly-placeholder progress) when a design needs populated content.

## Product Principles

- Honesty over flattery: progress shown must reflect the real, recomputed state of the logs — never a stored/stale counter that could drift from reality.
- Retroactive correction is a first-class flow, not an edge case: people will forget to log same-day and fix it later.
- Small, fixed scope on purpose: 6 tasks, 6 people, one challenge. Resist generalizing into a configurable multi-group product.
- Mobile-first, quick daily use: the core loop (check off today, log water, glance at teammates) should be fast enough for a habitual daily open.
- Shared accountability, not competition: the team-progress view is about visibility into each other's status, not a leaderboard/ranking mechanic (confirm before adding competitive framing).
