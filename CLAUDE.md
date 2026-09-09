# CLAUDE.md

Shared project context for anyone (human or Claude Code) working in this repo.

## What this is

A themeable e-commerce frontend prototype. Same catalog/cart/checkout codebase, different identity/data per theme, resolved at build time via Vite `--mode`. Each theme is built and deployed as a separate static site, not a shared multi-tenant SaaS. See `CONTRIBUTING.md` for architecture detail.

Current themes: `motos` (RPM Parts) and `carteras` (RW). No backend — state lives in the browser (mock data + `localStorage`), with a simulated Chilean payment gateway (Webpay Plus/Transbank style).

## Stack

Vite + React 18 + TypeScript + Tailwind CSS.

## Commands

- `npm run dev:motos` / `npm run dev:carteras` — local dev server for a given theme
- `npm run build:motos` / `npm run build:carteras` — production build for a given theme
- `npm run lint` — ESLint

## Conventions

- Gitflow: no direct pushes to `main`; all changes via PR.
- Commits/PRs authored as Felipe Funes (felipefunes@gmail.com).
- Public repo: MIT-licensed; docs/comments should be in English going forward (note: `README.md`/`CONTRIBUTING.md` currently predate this and are in Spanish — pending translation).
- `.env.motos` / `.env.carteras` are tracked deliberately: every variable in them is `VITE_`-prefixed, which Vite always inlines into the client bundle, so nothing in those files is a secret. Any non-`VITE_` variable must never be added to a tracked env file.
