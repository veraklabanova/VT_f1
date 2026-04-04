# Vlastním tempem — MVP Implementation Plan

## Context
Building a complete functional MVP for "Vlastním tempem" — a cognitive training platform for people with cognitive impairments and their caregivers. The project has thorough documentation (PAB + UAT specs) but zero source code. Deploying on Vercel with Supabase (free tier), Stripe test mode, Claude API + DALL-E 3.

## Tech Stack
- **Next.js 14+ App Router** (TypeScript, Tailwind CSS, shadcn/ui)
- **Supabase** (Auth, Postgres DB, Storage)
- **Stripe** (test mode, 2 subscription tiers)
- **@react-pdf/renderer** (PDF workbook generation)
- **Claude API + DALL-E 3** (exercise content generation)
- **GitHub**: veraklabanova/VT_f1

---

## Phase 1: Project Init + DB Schema

### 1.1 Init
- `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir`
- Move docs to `docs/` folder
- Install deps: `@supabase/supabase-js`, `@supabase/ssr`, `stripe`, `@stripe/stripe-js`, `@react-pdf/renderer`, `@anthropic-ai/sdk`, `openai`, `zod`, `react-hook-form`, `@hookform/resolvers`, `jszip`, `lucide-react`
- Init shadcn/ui, git, connect to GitHub

### 1.2 Database (Supabase migrations)
**Core tables:**
- `profiles` (extends auth.users — role, severity_level, org_name, free_workbook_used)
- `assessment_responses` (q1-q7, average_score, computed_severity)
- `themes` (name, description, cover_image_url)
- `cognitive_tags` (name, label_cs)
- `exercises` (theme_id, difficulty, status, text_content, image_url, batch_id)
- `exercise_tags` (junction)
- `workbooks` + `workbook_exercises` (junction with position)
- `subscriptions` (stripe_subscription_id, tier, status, period dates)
- `generation_batches` + `error_logs`

**RLS policies**, triggers (auto-create profile on signup, updated_at), seed data (6 cognitive tags, 5 themes).

**Storage buckets:** exercises (public), workbooks (authenticated), theme-covers (public)

### 1.3 Environment
`.env.local` with Supabase keys, Stripe keys + prices, Anthropic + OpenAI keys, app URL.

---

## Phase 2: Auth + Landing Page

### 2.1 Landing Page (`src/app/page.tsx`)
- Yellow prototype banner: "Toto je funkční prototyp aplikace Vlastním tempem. Slouží pro testování a demonstraci. Data a obsah mohou být neúplné."
- Hero section explaining the platform
- 3 registration path cards: "Mám potíže s pamětí" / "Starám se o blízkého" / "Jsme organizace"

### 2.2 Auth Pages
- `/register?type=<role>` — adaptive form (individuals: email+password; orgs: +org name, contact)
- `/login` — email+password login
- `/verify-email` — check your email page
- `/auth/callback` — Supabase code exchange

### 2.3 Middleware (`src/middleware.ts`)
- Auth guard on protected routes
- Redirect authenticated away from auth pages
- Block non-admin from `/admin/*`

### 2.4 Dashboard Layout
- Nav with role-based menu items
- Auto-apply `simplified-mode` CSS class for `osoba_s_postizenim` role
- Simplified mode: 1.25rem base font, 48px min touch targets, reduced palette

---

## Phase 3: Assessment + Theme Selection

### 3.1 Assessment Form
- 7 questions across 5 dimensions (memory x2, orientation, attention x2, language, independence)
- 2 variants: 1st person (person with impairment), 3rd person (caregiver)
- Scale 1-3 per question with clear Czech labels
- API: compute average -> severity (<=1.6 lehka, <=2.3 stredni, else tezsi)

### 3.2 Theme Selection Page
- Grid of available themes (filtered by I8 invariant)
- API checks: >=10 approved exercises + >=4 unique cognitive tags per difficulty level
- Orgs: theme must pass I8 for all 3 difficulty levels

---

## Phase 4: Workbook Generation (PDF)

### 4.1 Exercise Selection Algorithm (`src/lib/workbook/select-exercises.ts`)
- Filter exercises: theme + difficulty + approved status
- Group by cognitive tags, round-robin selection
- Enforce: exactly 10 exercises, min 4 different cognitive tags
- Seed-based randomization for unique workbooks

### 4.2 PDF Generation (`src/app/api/workbooks/route.ts`)
- @react-pdf/renderer in API route (server-side only)
- 12-page A4 document: cover -> 10 exercises -> instructions page
- Czech font: Roboto/Noto Sans with Latin Extended
- Upload to Supabase Storage, save workbook record

### 4.3 User Flows
- Individual: assessment required -> select theme -> generate 1 workbook
- Organization: skip assessment -> select theme -> generate 3 workbooks (all difficulties) -> download individually or as ZIP

### 4.4 Freemium Logic
- First workbook/set free (`free_workbook_used` flag)
- Subsequent: check active subscription with valid period

---

## Phase 5: Stripe Subscriptions

### 5.1 Setup
- 2 Stripe products (test mode): individual monthly, institutional monthly
- Checkout session creation API
- Webhook handler for: `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted/updated`
- Idempotent handlers + reconciliation on login

### 5.2 UI
- Pricing page with 2 tiers
- Settings: subscription status, cancel button
- Workbook history: re-download past workbooks (accessible post-expiry)

---

## Phase 6: Admin Interface

### 6.1 Admin Layout (under `/admin/*`, admin-only guard)

### 6.2 Six functional areas:
1. **Dashboard** — theme x difficulty matrix, exercise counts, I8 compliance indicators
2. **Generate** — form (theme, difficulty, tags, count, editable prompt) -> batch Claude + DALL-E calls
3. **Review Queue** — list awaiting_review exercises, preview text+image, approve/reject
4. **Catalog** — browse approved exercises, filter, archive
5. **Topics Overview** — completeness per theme/difficulty
6. **Error Log** — failed generations, retry capability

### 6.3 AI Integration
- Claude API: exercise text generation with Czech language prompts
- DALL-E 3: 1024x1024 PNG illustrations with Czech cultural context
- Batch returns ID immediately, client polls status
- Partial failure: save successes, log failures

---

## Phase 7: Polish + Deploy

- Error handling with Czech toast messages
- Loading states (skeletons, spinners)
- Responsive design + simplified mode on mobile
- Edge cases (unverified email, insufficient exercises, API failures)
- Manual admin user creation in Supabase
- Vercel deployment config
- Connect GitHub repo

---

## Key Files

| File | Purpose |
|------|---------|
| `src/middleware.ts` | Auth guard, role routing, admin protection |
| `src/lib/supabase/server.ts` | Supabase server client |
| `src/lib/workbook/select-exercises.ts` | Core selection algorithm (I4, I8, I9) |
| `src/lib/pdf/generate-workbook.ts` | PDF generation with @react-pdf |
| `src/lib/assessment/evaluate.ts` | Severity level computation |
| `src/app/api/webhooks/stripe/route.ts` | Stripe webhook handler |
| `src/app/api/workbooks/route.ts` | Workbook generation endpoint |
| `src/app/api/admin/batch/route.ts` | AI batch generation |

## Verification
- Registration -> email verification -> login (all 3 roles)
- Assessment form -> severity computation (test boundary values 1.6/1.7, 2.3/2.4)
- Admin: generate exercises -> review -> approve
- Theme availability check (I8 invariant)
- Workbook generation -> PDF download -> verify 12 pages, 10 exercises, min 4 tags
- Stripe checkout -> webhook -> subscription active -> generate 2nd workbook
- Organization: 3 workbooks + ZIP download
- Simplified mode for `osoba_s_postizenim`
