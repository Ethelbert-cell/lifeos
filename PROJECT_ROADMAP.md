LifeOS
Personal Productivity Dashboard
Complete Build Roadmap · Next.js 14 · MongoDB Atlas · Docker · CI/CD

7 Phases · 6–9 Months · Resume-Ready Full Stack Project

 
Project Overview
LifeOS is a full-stack gamified productivity dashboard — your personal second brain. Users manage tasks on a Kanban board, track daily habits with streaks, write rich-text notes, and plan goals with milestone tracking. The gamification layer (XP, levels, streaks, badges) ties everything together and keeps engagement high. This roadmap takes you from zero to a live, deployed, resume-worthy application.

What You Will Build
Feature Description
Task Manager (Kanban) Drag-and-drop board with To Do / In Progress / Done columns, priorities, due dates, and tags
Habit Tracker Daily/weekly habits with streak tracking, visual calendar heatmap, and longest-streak records
Notes (Rich Text) Tiptap-powered editor with formatting, tags, pinning, and full-text search
Goal Planner Goals with milestones, progress bars, category labels, and target dates
Gamification Engine XP points, levels, streaks, badges, daily login bonuses, and a progress dashboard
Analytics Dashboard Charts for weekly productivity, habit completion rates, XP history, and goal progress
Auth System Google OAuth via NextAuth — secure session management, protected routes

Gamification Design
The gamification system is inspired by Habitica, Duolingo, and Todoist Karma. Research shows apps combining streaks and milestone mechanics see 40–60% higher daily active users. The key is making rewards feel earned, not manufactured.

Mechanic Trigger XP Reward
Task completed Move any task to Done +25 XP
Habit checked Check off a daily habit +15 XP
Habit streak (7 days) 7-day consecutive streak +50 XP bonus
Note created Save a new note +10 XP
Goal milestone Check off a milestone +20 XP
Goal completed Mark a goal as done +100 XP
Daily login First login of the day +5 XP
Level up Reach XP threshold Badge + celebration UI

 
Complete Tech Stack
Every technology choice below is deliberate. This section explains what to use, why, and which version to install.

Layer Technology Why This Choice
Frontend Next.js 14 (App Router) Server components, API routes in one codebase, built-in TypeScript, image optimisation, and Vercel-native deployment
Frontend TypeScript 5 Type safety catches bugs at compile time, not runtime. Essential for a multi-model project like this
Styling Tailwind CSS 3 Utility-first, zero runtime CSS, responsive by default, works perfectly with component libraries
UI Library shadcn/ui + Radix UI Accessible, unstyled primitives you own — not a dependency. Radix handles dialogs, menus, tooltips
Animation Framer Motion 11 Production-grade React animations. Used for XP bars, card transitions, and celebration effects
Drag & Drop @hello-pangea/dnd The maintained fork of react-beautiful-dnd. Accessible Kanban drag-and-drop
Rich Text Tiptap 2 Headless ProseMirror-based editor. Supports bold/italic/lists/headings in notes without bloat
Charts Recharts 2 React-native chart library. Used for habit heatmaps, XP history, and weekly summaries
State Zustand 4 Minimal global state for UI (modals, notifications). No Redux boilerplate
Backend Next.js API Routes Node.js serverless functions co-located with the frontend. No separate Express server needed
Auth NextAuth.js 4 Drop-in OAuth for Next.js. Handles Google login, JWT sessions, callbacks, and DB user creation
Database MongoDB Atlas Cloud NoSQL, free tier available, flexible document model ideal for this project's varied data shapes
ODM Mongoose 8 Schema validation and type safety on top of MongoDB. Handles connection pooling for serverless
Notifications react-hot-toast Lightweight toast notifications for XP gains, saves, and errors
Containerization Docker + Compose Reproducible local dev environment. Dockerfile for production image
CI/CD GitHub Actions Free for public repos. Runs lint, type-check, build, and triggers Vercel deploy on merge
Hosting Vercel Zero-config Next.js hosting, preview deployments on every PR, edge network
DB Hosting MongoDB Atlas (free) M0 free tier is enough for this project. Simple connection string, built-in backups
Version Control GitHub Main/dev branch strategy, PR reviews, branch protection rules, semantic commit messages
Linting ESLint + Prettier Enforced code style. Configured to run in CI and as pre-commit hooks via lint-staged
Testing Vitest + Testing Library Fast unit tests for utility functions (XP calc, streak logic). RTL for component tests

 
Project Folder Structure
Use Next.js App Router with a well-organised src/ directory. This structure scales cleanly as the project grows.

Path Purpose
lifeos/ Project root
.github/workflows/ CI/CD GitHub Actions YAML files
src/app/ Next.js App Router — pages and API routes
src/app/(auth)/ Route group: login and onboarding pages
src/app/(dashboard)/ Route group: all protected app pages
src/app/api/ API route handlers (tasks, habits, notes, goals, user)
src/components/ All React components
src/components/ui/ shadcn/ui base components (Button, Dialog, etc.)
src/components/dashboard/ Dashboard widgets, XP bar, level display
src/components/tasks/ KanbanBoard, TaskCard, TaskModal
src/components/habits/ HabitCard, HabitCalendar, HabitModal
src/components/notes/ NotesList, NoteEditor, NoteCard
src/components/goals/ GoalCard, GoalModal, MilestoneList
src/components/gamification/ XPBar, LevelBadge, StreakCounter, Achievements
src/lib/ Shared utilities (db.ts, auth.ts, utils.ts, validations.ts)
src/models/ Mongoose models (User, Task, Habit, Note, Goal)
src/hooks/ Custom React hooks (useTasks, useHabits, useXP, etc.)
src/types/ TypeScript type definitions and interfaces
src/store/ Zustand stores (uiStore, notificationStore)
public/ Static assets (favicon, og-image)
Dockerfile Multi-stage Docker build for production
docker-compose.yml Local dev with app + MongoDB containers
.env.example Template for all environment variables
.env.local Local secrets — never committed to git

 
Phase 1 Project Setup & Foundation · Week 1–2

Goals for this phase
By the end of Phase 1 you will have a running Next.js app connected to MongoDB Atlas with Google OAuth working, deployed to Vercel, and version-controlled on GitHub with branch protection rules active.

Step-by-step tasks

# Task Details

1 Create GitHub repo Create a new public repo named 'lifeos'. Add README.md, .gitignore (Node), MIT license. Create main and dev branches. Enable branch protection on main (require PR + passing CI before merge).
2 Scaffold Next.js app Run: npx create-next-app@latest lifeos --typescript --tailwind --eslint --app --src-dir --import-alias '@/\*'. This sets up App Router, TypeScript, and Tailwind in one command.
3 Install dependencies npm install mongoose next-auth @hello-pangea/dnd lucide-react zustand framer-motion react-hot-toast recharts @tiptap/react @tiptap/starter-kit clsx tailwind-merge date-fns bcryptjs
4 Install devDependencies npm install -D @types/bcryptjs vitest @testing-library/react @testing-library/jest-dom
5 Set up MongoDB Atlas Create free M0 cluster at mongodb.com/atlas. Create database 'lifeos'. Create a DB user with password. Whitelist 0.0.0.0/0 for development. Copy the connection string.
6 Configure .env.local Add MONGODB_URI, NEXTAUTH_SECRET (generate with: openssl rand -base64 32), NEXTAUTH_URL=http://localhost:3000, and Google OAuth credentials from Google Cloud Console.
7 Create Mongoose models Create src/models/: User.ts (email, name, image, xp, level, streak, lastActiveDate), Task.ts (userId, title, description, status, priority, dueDate, tags, order), Habit.ts (userId, name, icon, color, frequency, streak, longestStreak, completionLogs), Note.ts (userId, title, content, plainText, tags, isPinned, wordCount), Goal.ts (userId, title, description, status, progress, milestones, targetDate)
8 Wire up NextAuth Create src/app/api/auth/[...nextauth]/route.ts. Configure GoogleProvider, JWT strategy, signIn callback (create user in DB on first login), jwt callback (attach id, xp, level, streak to token), session callback (expose on session object).
9 Deploy to Vercel Push to GitHub. Go to vercel.com, import the repo, add all env vars in the Vercel dashboard. Vercel auto-detects Next.js. Hit deploy. You should have a live URL.
10 Set up GitHub Actions CI Create .github/workflows/ci.yml. On push/PR to main and dev: checkout, setup-node@v4, npm ci, npm run lint, npx tsc --noEmit, npm run build. This runs automatically on every PR.

Key files to create in Phase 1
• src/lib/db.ts — MongoDB connection with global cache for Next.js serverless
• src/lib/auth.ts — NextAuth config exported as authOptions
• src/lib/utils.ts — cn() helper, XP/level math functions, XP_REWARDS constants
• src/types/next-auth.d.ts — Augment Session/JWT types to include id, xp, level, streak
• src/app/layout.tsx — Root layout with SessionProvider, Toaster, and global styles
• src/app/(auth)/login/page.tsx — Login page with Google sign-in button
• src/middleware.ts — Protect all routes under /dashboard from unauthenticated access

 
Phase 2 API Layer · Week 3–4

Goals for this phase
Build all five API route files with full CRUD operations, authentication guards, input validation, and XP reward logic. After this phase the backend is complete and testable via a REST client like Insomnia or Postman.

API routes to build
Route Methods What it does
/api/tasks GET POST PATCH DELETE List all tasks, create task, update status/fields (awards +25 XP on done), delete task. PATCH also handles Kanban reorder (bulk order update)
/api/habits GET POST PATCH DELETE List habits, create habit, check-in for today (calculates streak, awards +15 XP + +50 XP streak bonus on multiples of 7), delete habit
/api/notes GET POST PATCH DELETE List notes (supports ?q= search), create note (+10 XP), update content/pin/tags, delete note. Full-text search uses MongoDB $text index
/api/goals GET POST PATCH DELETE List goals, create goal, update progress/milestone completion (+20 XP per milestone, +100 XP on goal complete), delete goal
/api/user GET PATCH GET returns current user with fresh xp/level/streak from DB. PATCH updates name/image. Streak logic: compare lastActiveDate to today, increment or reset
/api/dashboard GET Aggregated stats for dashboard: task completion rate (7 days), habit completion matrix, XP earned this week, goals near deadline. Uses MongoDB aggregation pipelines

Important patterns for every API route
• Authentication guard first: const session = await getServerSession(authOptions); if (!session?.user?.id) return 401
• Always call await connectDB() before any Mongoose query — Next.js serverless needs this
• Scope all queries to userId: Task.find({ userId: session.user.id }) — never return other users' data
• Wrap everything in try/catch and return 500 with a logged error — never let unhandled errors crash
• XP rewards: call User.findByIdAndUpdate(id, { $inc: { xp: amount } }) atomically
• Streak calculation: load completionLogs sorted desc, check consecutive day diffs, update streak field
• Input validation: check required fields, trim strings, parse dates safely before writing to DB

 
Phase 3 Frontend — Core Features · Week 5–7

Goals for this phase
Build all four feature UIs: the Kanban task board, habit tracker, note editor, and goal planner. Each feature should be fully functional with create, read, update, and delete operations connected to the real API. Use React hooks to fetch and mutate data.

Feature build order
Build in this order because each feature increases in complexity. Completing the simpler ones first lets you establish patterns before tackling rich text and drag-and-drop.

1. Task Manager (Kanban Board)
   • Components to build: KanbanBoard.tsx (three-column layout), KanbanColumn.tsx (droppable zone), TaskCard.tsx (draggable item with priority badge and due date), TaskModal.tsx (create/edit form with title, description, priority select, date picker, tags input)
   • Drag-and-drop: use @hello-pangea/dnd. Wrap the board in <DragDropContext onDragEnd={handleDragEnd}>. Each column is a <Droppable droppableId={status}>. Each card is a <Draggable draggableId={task._id}>
   • handleDragEnd: get source and destination from result. If status changed, call PATCH /api/tasks with new status. If order changed within same column, call PATCH with new order array
   • Optimistic updates: update local state immediately, then sync with API. If API fails, revert the local state and show a toast error
   • Priority colours: low = teal, medium = amber, high = rose. Show as a coloured dot or small badge on the card

2. Habit Tracker
   • Components: HabitGrid.tsx (list of all habits for today), HabitCard.tsx (shows name, icon, current streak, today's check-in button), HabitCalendar.tsx (last 30 days as a heatmap grid), CreateHabitModal.tsx (name, description, icon picker, color, frequency)
   • Today's check-in: button goes from empty circle to filled checkmark. Show the XP gained via a toast. If a streak milestone is hit (7, 14, 21 days), show a special celebration animation using Framer Motion
   • Heatmap: build a 7xN grid of squares. Each square represents one day. Color intensity based on whether the habit was completed. Use date-fns to generate the last 30 days array
   • Streak display: show current streak with a flame icon (orange for active, grey if broken today). Show longest streak below

3. Notes Editor
   • Components: NotesList.tsx (searchable grid of note cards), NoteCard.tsx (title, excerpt, tags, word count, pin indicator), NoteEditor.tsx (full-page editor with Tiptap), CreateNoteButton.tsx
   • Tiptap setup: useEditor() hook with StarterKit extension (gives bold, italic, headings, bullet lists, blockquote), Placeholder extension (shows placeholder text when empty)
   • Save strategy: debounce saves — wait 1 second after the user stops typing before calling PATCH /api/notes. Show a subtle 'Saved' indicator in the toolbar
   • Search: controlled input calls GET /api/notes?q=searchterm. Use useDebounce hook to avoid hitting the API on every keystroke
   • Pin a note: PATCH isPinned. Pinned notes always render at the top of the list with a pin icon

4. Goal Planner
   • Components: GoalList.tsx (cards in a masonry-style grid), GoalCard.tsx (title, progress bar, category badge, days remaining), GoalModal.tsx (create/edit with milestones), MilestoneList.tsx (checklist within a goal)
   • Progress bar: calculated as completedMilestones / totalMilestones \* 100. Animate with Framer Motion (width transitions from 0 to the actual value on mount)
   • Milestone completion: clicking a milestone checkbox calls PATCH /api/goals. Award +20 XP per milestone. If all milestones are done, prompt user to mark the goal complete (+100 XP)
   • Category filter: show category tags at the top of the list (Personal, Health, Career, Learning, Finance). Clicking one filters the visible goals

 
Phase 4 Gamification & Dashboard · Week 8–9

Goals for this phase
Build the gamification engine that ties all features together, and the analytics dashboard that shows the user their progress over time. This is what makes LifeOS feel different from a plain to-do app.

Gamification components to build
• XPBar.tsx — Shows current XP, level, and progress to next level. Horizontal bar that animates when XP is gained. Display 'Level N' badge next to it in the top navbar
• LevelUpModal.tsx — Full-screen overlay that appears when the user levels up. Show their new level, a short congratulatory message, and what changed. Confetti animation using canvas-confetti
• StreakCounter.tsx — Shows daily login streak with a flame icon. Turns grey/broken if the user missed yesterday. Shows 'X day streak' text
• XPToast.tsx — Custom toast that appears on XP gains. Show '+25 XP' with a small animation. Built on top of react-hot-toast with a custom render function
• AchievementBadges.tsx — Grid of locked/unlocked badges. Examples: 'First Task Done', '7-Day Habit Streak', 'Level 10', '10 Notes Written', 'First Goal Completed'

XP / Level math
• XP to reach the next level follows an exponential curve: xpForLevel(n) = Math.floor(100 \* 1.4^(n-1))
• Level 1 = 0 XP, Level 2 = 100 XP, Level 3 = 240 XP, Level 4 = 436 XP … this keeps early progression fast and late levels meaningful
• Store total accumulated XP in the DB. Derive level from total XP on every read — never store level separately or they can get out of sync
• The XP progress bar shows progress within the current level: (totalXP - xpAtCurrentLevel) / xpNeededForNextLevel

Dashboard page
• Today at a glance: show today's date, a greeting, current streak, level, and XP. Show how many tasks are due today and how many habits need checking in
• Weekly productivity chart: bar chart (Recharts BarChart) showing tasks completed per day over the last 7 days
• Habit completion matrix: a table showing each habit as a row and the last 7 days as columns. Green = completed, empty = missed
• XP earned this week: a small line chart (Recharts LineChart) showing daily XP gains over 7 days
• Goals near deadline: a list of active goals with targetDate within the next 14 days, sorted by urgency
• Recent activity feed: a chronological list of the last 10 XP events (task completed, habit checked, etc.)

 
Phase 5 Docker & Local Dev Environment · Week 10

Goals for this phase
Containerize the application so it runs identically in development, CI, and production. Anyone who clones the repo should be able to run 'docker compose up' and have a working app.

Dockerfile (multi-stage build)
Create a multi-stage Dockerfile in the project root. Three stages: deps (installs node_modules), builder (runs next build with output: standalone), runner (minimal alpine image with only the standalone output).
• Stage 1 — deps: FROM node:20-alpine. Copy package.json and package-lock.json. Run npm ci. This layer is cached as long as package.json doesn't change
• Stage 2 — builder: Copy node_modules from deps stage. Copy all source files. Set NEXT_TELEMETRY_DISABLED=1. Run npm run build. This produces .next/standalone/
• Stage 3 — runner: FROM node:20-alpine. Copy only .next/standalone, .next/static, and public. Set NODE_ENV=production. EXPOSE 3000. CMD ["node", "server.js"]
• Add output: 'standalone' to next.config.mjs — required for the standalone mode to work
• Final image should be around 200–300MB (not 1GB+) because you exclude node_modules from the runner stage

docker-compose.yml (for local dev)
• Service 1 — app: build from Dockerfile with target: deps. Mount src/ as a volume for hot reload. Set all env vars. Expose port 3000. Command: npm run dev
• Service 2 — mongodb: image: mongo:7. Set MONGO_INITDB_DATABASE=lifeos. Mount a named volume for data persistence. Expose port 27017 (so you can connect via MongoDB Compass)
• Add a .dockerignore: node_modules, .next, .git, .env.local — these should never be copied into the image
• Optional: add a mongo-express service for a web-based MongoDB UI at localhost:8081 during development

Important Docker notes
• For local dev you still use .env.local — docker-compose reads it via env_file: .env.local
• For production (Vercel), you never run Docker — Vercel handles the build. Docker is for local consistency and CI
• Add a health check to the app service: test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]. Create a simple /api/health route that returns 200 OK
• Run 'docker compose up --build' after any package.json change to rebuild the deps layer

 
Phase 6 CI/CD Pipeline · Week 11

Goals for this phase
Set up two GitHub Actions workflows: one for CI (runs on every push and PR) and one for CD (triggers Vercel deployment on merge to main). The pipeline ensures no broken code ever reaches production.

Workflow 1 — CI (.github/workflows/ci.yml)
Triggers on: push to dev branch and pull_request targeting main.
• Job: quality-check — runs on ubuntu-latest
• Step 1: actions/checkout@v4
• Step 2: actions/setup-node@v4 with node-version: '20' and cache: 'npm'
• Step 3: npm ci — install exact versions from package-lock.json
• Step 4: npm run lint — ESLint must pass with zero errors
• Step 5: npx tsc --noEmit — TypeScript must compile with no type errors
• Step 6: npm run test — Vitest unit tests must all pass
• Step 7: npm run build — Next.js production build must succeed
• Add a GitHub branch protection rule: require this workflow to pass before any PR can be merged to main

Workflow 2 — CD (.github/workflows/deploy.yml)
Triggers on: push to main (i.e., after a PR is merged).
• Job: deploy — runs on ubuntu-latest
• Step 1: actions/checkout@v4
• Step 2: Install Vercel CLI: npm install -g vercel
• Step 3: Pull Vercel project settings: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
•	Step 4: Build: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
• Step 5: Deploy: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
• Add GitHub secrets: VERCEL_TOKEN (from vercel.com/account/tokens), VERCEL_ORG_ID, VERCEL_PROJECT_ID (both found in .vercel/project.json after running 'vercel link' locally)

Workflow 3 — Docker build check (.github/workflows/docker.yml)
Optional but resume-impressive. Triggers on pull_request to main.
• Build the Docker image to verify the Dockerfile is valid and the production image builds successfully
• docker build -t lifeos:test . — if this fails, the PR is blocked
• Optionally: push the image to GitHub Container Registry (ghcr.io) on merge to main

Branch strategy
• main — production. Protected. Only accepts PRs. Never push directly
• dev — integration branch. Feature branches merge here first
• feature/task-name — one branch per feature (e.g. feature/kanban-board, feature/habit-tracker)
• fix/bug-name — for bug fixes
• Commit message format: feat: add drag-and-drop to kanban | fix: streak not resetting | chore: update dependencies

 
Phase 7 Polish, Testing & Launch · Week 12–13+

Goals for this phase
Make the app production-ready: fix edge cases, write tests, improve performance, add PWA support, and prepare for sharing publicly. This is what separates a 'project' from a 'product'.

Testing to write
• Unit tests (Vitest): xpForLevel(), levelFromXP(), xpProgress() in utils.ts — test all the XP/level math edge cases
• Unit tests: streak calculation function — test first check-in, consecutive days, gap detection, and reset logic
• Unit tests: isToday(), formatDate() utility functions
• Component tests (React Testing Library): render KanbanBoard with mock tasks, verify columns appear; render HabitCard, click check-in button, verify state change; render XPBar at various XP values, verify correct level and progress display
• API integration tests: use Next.js test utilities to hit API routes with mocked sessions — verify 401 on unauthenticated, 200 + correct body on authenticated

Performance optimisations
• Images: use next/image for all images. Set priority prop on above-the-fold images (avatar, logo)
• Data fetching: use React Server Components for initial data loads where possible. Use useSWR or React Query for client-side data that needs live updates
• MongoDB indexes: add { userId: 1, createdAt: -1 } indexes on Task, Habit, Note, Goal — critical for fast per-user queries
• Loading states: add loading.tsx files to all App Router route segments. Show skeleton cards while data loads
• Error boundaries: add error.tsx files to all route segments. Show a friendly error UI with a 'Try again' button

UX polish
• Empty states: when a feature has no data yet, show an illustration and a 'Create your first task' call-to-action. Empty states are often forgotten and make the app feel unfinished
• Responsive design: test on mobile (375px), tablet (768px), and desktop (1280px+). The Kanban board should stack vertically on mobile
• Keyboard navigation: all interactive elements should be reachable and operable with keyboard alone. Radix UI components handle most of this automatically
• Accessibility: add aria-label to icon-only buttons. Ensure colour contrast ratios pass WCAG AA (4.5:1 for text)
• Dark mode: Tailwind's darkMode: 'class' + a toggle button that sets the class on <html>. Persist preference in localStorage

PWA (optional but impressive)
• Install next-pwa: npm install next-pwa
• Create public/manifest.json with name, short_name, icons, theme_color, and display: 'standalone'
• Configure next-pwa in next.config.mjs — it auto-generates a service worker
• Add <link rel='manifest'> and meta theme-color to the root layout
• PWA enables 'Add to Home Screen' on mobile — a great demo moment

Pre-launch checklist
• Environment variables: all secrets are in Vercel dashboard, not in the repo. .env.local is in .gitignore
• MongoDB Atlas: enable Atlas Search for full-text note search. Set up IP whitelist to allow all (0.0.0.0/0) for Vercel's dynamic IPs
• Vercel custom domain (optional): connect a domain from namecheap or similar for under $10/year. Looks much better on a resume
• OG image: add a public/og-image.png (1200x630) and set Open Graph meta tags in layout.tsx for nice link previews when sharing
• README.md: write a thorough README with a screenshot, live demo link, feature list, tech stack, and local setup instructions
• Record a demo video: a 2–3 minute walkthrough of all features. Upload to YouTube and link in the README

 
Environment Variables Reference
Keep all secrets out of version control. Copy .env.example to .env.local and fill in each value. Add all production values to the Vercel dashboard under Project Settings > Environment Variables.

Variable Where to get it Example value
NEXTAUTH_URL Your app URL http://localhost:3000
NEXTAUTH_SECRET openssl rand -base64 32 long random string
MONGODB_URI MongoDB Atlas > Connect mongodb+srv://user:pass@cluster.mongodb.net/lifeos
GOOGLE_CLIENT_ID Google Cloud Console 123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET Google Cloud Console GOCSPX-xxxxxxxxxxxx
NEXT_PUBLIC_APP_URL Your app URL https://lifeos.vercel.app

 
Recommended Libraries & Tools

Package Version Purpose
next 14.2.x React framework with App Router, API routes, image optimisation
typescript ^5.4 Static typing — catches bugs before runtime
tailwindcss ^3.4 Utility CSS — no CSS files needed for most UI
next-auth ^4.24 Google OAuth, JWT sessions, DB callbacks
mongoose ^8.3 MongoDB ODM with schema validation
@hello-pangea/dnd ^16.5 Drag-and-drop for Kanban (maintained react-beautiful-dnd fork)
@tiptap/react ^2.4 Headless rich text editor for Notes feature
recharts ^2.12 React charts for dashboard analytics
framer-motion ^11.1 Animations: XP bar fill, card transitions, celebrations
zustand ^4.5 Minimal global state (modals, notifications, theme)
lucide-react ^0.378 Icon library — 1000+ consistent SVG icons
react-hot-toast ^2.4 XP gain toasts and save confirmations
date-fns ^3.6 Date math for streaks, due dates, habit calendars
clsx + tailwind-merge latest Conditional className merging without conflicts
canvas-confetti ^1.9 Confetti animation for level-ups and goal completions
next-pwa ^5.6 PWA service worker and manifest (optional Phase 7)
vitest ^1.6 Fast unit test runner (Vite-compatible)
@testing-library/react ^16 Component testing with user-event simulation

 
Resume & Interview Preparation
How you present this project on your resume and in interviews matters as much as building it. Here is how to maximise its impact.

Resume bullet points
Use action verbs and quantify wherever possible. These are copy-paste ready:

• Built a full-stack gamified productivity platform with Next.js 14 App Router, MongoDB Atlas, and Google OAuth, supporting task management, habit tracking, rich-text notes, and goal planning
• Designed and implemented a gamification engine with XP points, levels, streaks, and achievement badges — drawing on engagement mechanics from Duolingo and Habitica research
• Engineered drag-and-drop Kanban board using @hello-pangea/dnd with optimistic UI updates and real-time order persistence
• Containerized the application with Docker multi-stage builds, reducing production image size to under 300MB
• Implemented a full CI/CD pipeline with GitHub Actions (lint, type-check, tests, build) and automated Vercel deployment on merge to main
• Wrote unit and integration tests with Vitest and React Testing Library covering XP math, streak logic, and key UI components

Interview talking points
System design questions
• How did you handle authentication? — JWT sessions via NextAuth, Google OAuth provider, user created in MongoDB on first sign-in, token includes userId/xp/level for fast access without extra DB calls
• How does your gamification XP system work? — Exponential level curve using 100 \* 1.4^(n-1), total XP stored in DB, level derived on read, atomic increments with $inc to prevent race conditions
• How do you prevent one user seeing another user's data? — Every API query filters by userId from the session. Server-side guards on every route handler
• How would you scale this? — MongoDB Atlas auto-scales. For higher traffic: Redis cache for session storage, aggregate dashboard queries on a cron job instead of on every page load, CDN for static assets (already handled by Vercel Edge Network)
Technical deep-dives
• Explain your drag-and-drop implementation — DragDropContext wraps the board, each column is a Droppable, each card is a Draggable. onDragEnd fires with source and destination. If destination is different column, PATCH the task status. If same column, bulk PATCH the order array
• How does streak tracking work? — CompletionLogs array in Habit document. On check-in, push today's date. Sort logs descending, iterate counting consecutive days (diff <= 1.5 days to handle timezone edge cases). Compare streak to longestStreak and update
• What's your approach to optimistic updates? — Update local state immediately for instant feedback. Send API request in the background. If it fails, revert state and show error toast. This makes the UI feel instant even on slow connections
• How does your CI/CD pipeline work? — On every PR: GitHub Actions runs ESLint, TypeScript compiler, Vitest, and next build. All must pass. On merge to main: second workflow triggers Vercel CLI to deploy to production. Zero manual steps

You have everything you need.
Build in phases. Commit daily. Ship it, then iterate. The best portfolio project is the one that's live.
