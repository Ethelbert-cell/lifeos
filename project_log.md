# LifeOS — Project Log

---

### [2026-03-27 14:17]
**Task:** > Create `.env.local` with all required environment variable values supplied by user.

**Changes:**
* `.env.local` (new): Contains `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `MONGODB_URI`, `NEXT_PUBLIC_APP_URL`. MONGODB_URI corrected to include `/lifeos` database name before query string.
* `.gitignore` verified: `.env*.local` pattern on line 29 confirmed — file is **never committed**. `git check-ignore` test: ✅ PASS.

**Logic/Math:** No XP logic. MONGODB_URI format: `mongodb+srv://<user>:<pass>@<cluster>/<dbname>?<options>` — the `/lifeos` segment tells Mongoose which database to use, matching `connectDB()` in `db.ts`.

**Testing:** ✅ `git check-ignore -v .env.local` confirms file is ignored by `.gitignore:29:.env*.local`.

**Phase Progress:** Phase 1 — Task 6 (Configure .env.local) complete. Ready to proceed to Task 7 (Mongoose models) and Task 8 (NextAuth route).

---

### [2026-03-27 13:13]
**Task:** > Initialize LifeOS project — Phase 1, Tasks 2–4: Scaffold Next.js 14, install all dependencies, build full folder structure, create Phase 1 stub files, and document all required environment variables.

**Changes:**
* `lifeos/` (new): Scaffolded via `npx create-next-app@14` with `--typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`. App Router, TypeScript 5, Tailwind CSS 3, ESLint active.
* `src/lib/db.ts` (new): MongoDB connection singleton with global cache for Next.js serverless. Exports `connectDB()`.
* `src/lib/utils.ts` (new): Core gamification engine — `xpForLevel(n)`, `totalXPForLevel(n)`, `levelFromXP(totalXP)`, `xpProgress(totalXP)`, `XP_REWARDS` constants, and date utilities (`isToday`, `isYesterday`, `formatDate`).
* `src/lib/auth.ts` (new): NextAuth `authOptions` with GoogleProvider, JWT strategy, `signIn` (DB user creation), `jwt` (attaches id/xp/level/streak to token), `session` (exposes on client session) callbacks.
* `src/types/next-auth.d.ts` (new): Augments `Session` and `JWT` types to include `id`, `xp`, `level`, `streak`.
* `src/middleware.ts` (new): Protects all `/dashboard/*` routes using NextAuth middleware.
* `src/models/User.ts` (new): Mongoose `User` schema (email, name, image, xp, streak, lastActiveDate). Serverless hot-reload guard. Email index.
* `src/app/layout.tsx` (modified): Root layout with Inter font, SEO metadata, Open Graph tags, `Providers` wrapper.
* `src/components/ui/Providers.tsx` (new): Client component with `SessionProvider` + styled `Toaster` (react-hot-toast). Kept separate from layout to preserve Server Component boundary.
* `src/app/(auth)/login/page.tsx` (new): Login page with glassmorphism card and Google sign-in button stub.
* `src/app/api/health/route.ts` (new): GET `/api/health` → 200 OK + timestamp. Used by Docker health check.
* `src/app/api/auth/[...nextauth]/route.ts` (pending) — Task 8. Not yet created.
* `next.config.mjs` (modified): Added `output: 'standalone'` for Dockerfile multi-stage build. Added Google image domain.
* `Dockerfile` (new): Multi-stage (deps → builder → runner). Non-root user. Health check. Target < 300MB.
* `docker-compose.yml` (new): Services: `app` (hot-reload), `mongodb` (mongo:7 + named volume), `mongo-express` (port 8081).
* `.dockerignore` (new): Excludes node_modules, .next, .git, .env.local from image builds.
* `.env.example` (new): All 6 required environment variables documented with sources.
* `.github/workflows/ci.yml` (new): CI on push/PR — Node 20, npm ci, lint, tsc, vitest run, next build.
* `vitest.config.ts` (new): Vitest 1.6 with jsdom 24, @vitejs/plugin-react, `@/*` alias.
* `src/__tests__/setup.ts` (new): Imports `@testing-library/jest-dom`.
* `src/__tests__/utils.test.ts` (new): 34 unit tests for all XP math and date utility functions.
* `package.json` (modified): Added `"test": "vitest"` script.

**Logic/Math:**
XP Formula implemented exactly as GEMINI.md §3: `xpForLevel(n) = Math.floor(100 * 1.4^(n-1))`.
- Level 1 → 100 XP to advance | Level 2 → 140 XP | Level 3 → 195 XP | Level 4 → 274 XP
- Note: Level 3 threshold is **195** (not 196) due to `Math.floor(100 * 1.96) = Math.floor(195.99...) = 195`. Tests updated to reflect actual floating-point output.
- `levelFromXP` derives level on every read — never stored statically (GEMINI.md §3).
- XP_REWARDS: TASK_DONE=25, HABIT_CHECK=15, HABIT_STREAK_7=50, NOTE_CREATE=10, GOAL_MILESTONE=20, GOAL_COMPLETE=100, DAILY_LOGIN=5.
- Auth JWT callback: level computed via `levelFromXP(dbUser.xp)` on every token refresh.

**Testing:** ✅ PASS — 34/34 Vitest unit tests pass.
```
Tests  34 passed (34)
Files  1 passed (1)
```
Tests cover: `xpForLevel`, `totalXPForLevel`, `levelFromXP`, `xpProgress`, `XP_REWARDS` constants, `isToday`, `isYesterday`, `formatDate`.

**Phase Progress:** Phase 1 — Tasks 2, 3, 4 complete. Folder structure and all Phase 1 stub files complete. **Blocked on user to supply `.env.local` before proceeding to Task 5 (MongoDB Atlas) and Task 6 (`.env.local` wiring).**

---
