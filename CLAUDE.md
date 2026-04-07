# Vlastním tempem — MVP

## Project
Cognitive training platform for people with cognitive impairments and caregivers.
Czech non-profit "Vlastním tempem, z.s."

## Status (2026-04-05)
MVP deployed and functional on Vercel. All core features working end-to-end.
- **Production URL:** https://vt-f1-ab7v21f0e-veraklabanovas-projects.vercel.app
- **GitHub:** https://github.com/veraklabanova/VT_f1 (branch: master)
- **Supabase:** Connected (auth, DB, storage all working)
- **Stripe:** Test mode configured (2 products, webhook set up)
- **AI:** Claude API + DALL-E 3 connected and generating exercises
- **Catalog:** 2 themes populated (Rodina, Zahrada) × 3 difficulties × 12 exercises each = 72 exercises
- **PDF generation:** Working end-to-end with @react-pdf/renderer (Inter font, Varianta B design)

## Tech Stack
- Next.js 16 App Router (TypeScript, Tailwind CSS v4, shadcn/ui)
- Supabase (Auth, Postgres, Storage)
- Stripe (test mode)
- @react-pdf/renderer (PDF generation, Roboto font for Czech)
- Claude API + DALL-E 3 (exercise content, lazy-initialized)
- Nunito font (Google Fonts, rounded/friendly)
- Deployed on Vercel

## Key Files
- `supabase/migrations/` — Database schema (4 files)
- `src/lib/assessment/evaluate.ts` — Severity computation (boundaries: 1.6/2.3), severity→difficulty mapping, assessment questions
- `src/lib/workbook/select-exercises.ts` — Exercise selection algorithm (round-robin, I4/I8/I9)
- `src/lib/ai/` — Claude + DALL-E integration (lazy init)
- `src/lib/pdf/` — PDF generation (workbook-document.tsx: Inter font, warm palette, accent bars, answer lines + generate-workbook.ts)
- `src/lib/stripe/` — Stripe client (lazy init)
- `src/middleware.ts` — Auth guard and role routing (admin paths pass through for demo mode)
- `src/app/onboarding/page.tsx` — Main user-facing onboarding wizard (PDF preview, amber questionnaire)
- `src/components/shared/site-header.tsx` — Shared header (amber logo, consistent across all pages)
- `src/components/shared/site-footer.tsx` — Shared dark footer (consistent across all pages)

## Architecture
- Route groups: (auth), (dashboard), (admin)
- 4 user roles: osoba_s_postizenim, pecujici, organizace, admin
- CSS classes: `simplified-mode` (dashboard for osoba_s_postizenim), `a11y-theme` (onboarding for osoba_s_postizenim)
- Onboarding wizard: role → assessment → theme → PDF download (no auth required)
- Two registration flows: direct (/register) and post-onboarding
- Admin: 7 sections (dashboard, generate, review, catalog, archive, topics, errors)
- Admin demo mode: works without Supabase using mock data
- Supabase trigger: `handle_new_user()` with `SECURITY DEFINER SET search_path = public`

## Key Invariants
- I4: Workbook min 4 different cognitive tags
- I5: Relaxed — first workbook downloadable without account (onboarding flow)
- I8: Theme available if 10+ approved exercises + 4+ tags per difficulty
- I9: Workbook always exactly 10 exercises

## Severity → Difficulty Mapping (INVERSE)
- Severity `lehka` (mild impairment) → exercises difficulty `tezsi` (challenging)
- Severity `stredni` (moderate) → exercises difficulty `stredni` (moderate)
- Severity `tezsi` (severe impairment) → exercises difficulty `lehka` (easy/adapted)
- Function: `mapSeverityToDifficulty()` in `src/lib/assessment/evaluate.ts`

## Backlog (docs/BACKLOG.md)
BL-001 through BL-024 tracked. Key items:
- BL-001: Onboarding without registration
- BL-006: Dual registration flows + localStorage data transfer
- BL-009: A11y redesign (a11y-theme, card radio buttons, enlarged UI)
- BL-010: Emotional design (warm palette, sage green, soft shadows, Nunito)
- BL-011: Empathetic copywriting (all texts rewritten from clinical to friendly)
- BL-012: **Fixed** severity→difficulty inverse mapping (critical bug)
- BL-013: AI prompt improvements (exercise difficulty + image consistency)
- BL-014: Admin image lightbox
- BL-015: Sticky header in onboarding + landing
- BL-016: **Fixed** organization download flow
- BL-018: Landing page redesign (Varianta B, WCAG AAA)
- BL-019: PDF layout redesign (warm palette, accent bars, answer lines)
- BL-020: Design unification across all pages (shared header/footer, cream bg)
- BL-021: Fully clickable cards on homepage ("Začněte zdarma" section)
- BL-022: Text updates (feature strip + footer copyright)
- BL-023: Amber-themed clickable answer blocks in onboarding questionnaire
- BL-024: PDF preview before download (iframe with amber header)

## What's NOT done yet (future work)
- 3 more themes need content (Dům, Jaro, Domácí práce)
- PDF download for authenticated users stores PDF in Supabase Storage
- Stripe payment flow (end-to-end test with test card)
- Password reset functionality
- Admin: hide dotazník nav item for admin role
- Landing page redesign needs responsive testing on mobile
- Figma design system: `redesign_CSS.txt` + Figma file `D4lWM0UmbRtX3U6BQNMQbV`

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build

## Documentation
- `docs/PAB_Vlastnim_tempem_v3.md` — Latest Product Architecture Blueprint
- `docs/UAT_Vlastnim_tempem_v3.md` — Latest User Acceptance Tests
- `docs/BACKLOG.md` — All changes vs original documentation (BL-001 to BL-019)
- `redesign_CSS.txt` — Design system CSS (Varianta B, WCAG AAA)
- `docs/IMPLEMENTATION_PLAN.md` — Original implementation plan
