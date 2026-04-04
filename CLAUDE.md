# Vlastním tempem — MVP

## Project
Cognitive training platform for people with cognitive impairments and caregivers.
Czech non-profit "Vlastním tempem, z.s."

## Tech Stack
- Next.js 16 App Router (TypeScript, Tailwind CSS v4, shadcn/ui)
- Supabase (Auth, Postgres, Storage)
- Stripe (test mode)
- @react-pdf/renderer (PDF generation)
- Claude API + DALL-E 3 (exercise content)

## Key Files
- `supabase/migrations/` — Database schema
- `src/lib/assessment/evaluate.ts` — Severity computation (boundaries: 1.6/2.3)
- `src/lib/workbook/select-exercises.ts` — Exercise selection algorithm
- `src/lib/ai/` — Claude + DALL-E integration
- `src/middleware.ts` — Auth guard and role routing

## Architecture
- Route groups: (auth), (dashboard), (admin)
- 4 user roles: osoba_s_postizenim, pecujici, organizace, admin
- Simplified CSS mode for osoba_s_postizenim (class `simplified-mode`)
- Database: profiles, exercises, workbooks, subscriptions, etc.

## Key Invariants
- I4: Workbook min 4 different cognitive tags
- I8: Theme available if 10+ approved exercises + 4+ tags per difficulty
- I9: Workbook always exactly 10 exercises

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build

## Documentation
See `docs/` folder for full specs (PAB, UAT, Implementation Plan).
