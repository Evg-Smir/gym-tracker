# Gym Tracker

A mobile Progressive Web App for logging strength workouts. Track sessions by day, pick exercises from a muscle-group catalog, record sets (weight × reps), and review progress in statistics.

The build is a Next.js static export: the `out/` folder can be served from any static host. Data syncs through Firebase (Auth + Firestore) and is mirrored locally in IndexedDB for offline use.

---

## Features

- **Authentication** — sign up and sign in with email/password (Firebase Auth)
- **Workout calendar** — pick a day and view exercises for that date
- **Exercise catalog** — muscle groups (arms, back, shoulders, chest, legs, abs) with a starter set of movements
- **Exercise flags** — “double weight” (dumbbells) and “bodyweight” (no external load)
- **Sets** — add, edit, and delete sets (weight × reps)
- **Multi-select** — add several exercises at once
- **Statistics** — max weight / volume charts; bodyweight exercises use total reps (Recharts)
- **Profile** — name, email, password change (with re-authentication)
- **PWA** — web app manifest + service worker (`public/sw.js`) for an offline shell

---

## Stack

| Layer | Technologies |
|------|------------|
| UI | Next.js 14 (App Router), React 18, TypeScript |
| Styles | SCSS Modules, Tailwind CSS |
| State | Zustand |
| Calendar | MUI X Date Pickers (`DateCalendar`) + dayjs |
| Charts | Recharts |
| Backend | Firebase Auth, Cloud Firestore |
| Local storage | IndexedDB (`PWAStorage`) |
| Build | `output: 'export'` → static files in `out/` |
| Tests | Vitest (unit), Playwright (e2e) + Firebase Emulator Suite |

---

## Quick start

### Requirements

- Node.js 18+
- npm
- a Firebase project with **Email/Password** Auth and **Firestore** (or Emulator Suite for local/e2e)

### Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` with your Firebase keys (see below), then:

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000) (listens on `0.0.0.0:3000`).

Unauthenticated users are redirected to `/auth`.

To develop against emulators instead of a real project:

```bash
# terminal 1
npm run emulators

# terminal 2 — set in .env.local:
# NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=gym-tracker-demo
# (other NEXT_PUBLIC_FIREBASE_* can be any non-empty demo values)
npm run dev
```

---

## Scripts

| Command | Description |
|---------|----------|
| `npm run dev` | Dev server on `0.0.0.0:3000` |
| `npm run build` | Production build + static export to `out/` |
| `npm start` | `next start` (for non-export scenarios) |
| `npm run lint` | ESLint |
| `npm test` / `npm run test:unit` | Unit tests (Vitest) |
| `npm run emulators` | Firebase Auth + Firestore emulators |
| `npm run test:e2e` | E2E tests (Playwright + emulators + Next) |
| `npm run test:e2e:ui` | Playwright UI mode |

---

## Firebase

### Environment variables

Copy `.env.example` → `.env.local` and set:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# "true" to use Auth (:9199) + Firestore (:8185) emulators
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=
```

These keys are public (`NEXT_PUBLIC_*`). Data security comes from **Firestore Security Rules**, not from hiding the API key.

### Data model

```
users/{uid}
  ├── firstName, lastName, email, createdAt, updatedAt
  ├── categoriesIsUpload, exercisesIsUpload
  ├── categories/{slug}     # user exercise catalog
  └── workouts/{dd.mm.yyyy} # workouts by day
```

The same data is also written locally to IndexedDB (`PWAStorage`) under `exercises` and `categories`.

### Security Rules

[`firestore.rules`](firestore.rules) in the repo is **permissive** for local Emulator e2e. Tighten before production (owner-scoped `request.auth.uid == userId` checks) and deploy:

```bash
firebase deploy --only firestore:rules
```

or via the Firebase Console. Without proper rules, client-side uid checks do **not** protect your data.

### Emulators

```bash
npm run emulators
```

Starts Auth on `9199` and Firestore on `8185` (project `gym-tracker-demo`). Emulator UI is disabled by default for quieter local/CI runs.

---

## Architecture

Layered client architecture (no DI container):

```
src/
├── app/                  # Next.js App Router (/, /auth, /register, manifest)
├── components/           # Presentation-only UI
├── context/              # Thin AuthProvider (Firebase session + loading)
├── hooks/                # Feature hooks (forms, bootstrap, popups, …)
├── stores/               # Zustand: synchronous state + reducers
├── application/          # Use-cases: bootstrap, migrate, persist, profile/auth
├── repositories/         # Firestore, IndexedDB, Auth adapters
├── domain/               # Pure helpers, seed catalog, AppError
├── lib/                  # Firebase app init, basePath
└── @types/               # Shared TypeScript types
e2e/                      # Playwright specs + helpers
```

### Layering conventions

- Side effects (Firestore / IndexedDB) run **after** Zustand `set()`, never inside the updater.
- UI imports hooks / stores / application — not `@/repositories` or Firebase SDK.
- Zustand selectors are atomic fields or use `useShallow`.
- Domain code is pure (no I/O). Errors use typed `AppError` with a `code`.

### Data flow

1. After sign-in, `AuthProvider` exposes the Firebase `User`; `useSessionBootstrap` hydrates stores.
2. Application use-cases load categories/workouts from Firestore and mirror IndexedDB.
3. Day changes update Zustand → application persist → IndexedDB + Firestore.
4. Statistics are computed on the client from workout history (`domain/statistics`).

### Main screens

| Route | Purpose |
|---------|------------|
| `/` | Home: calendar + day exercise list + bottom bar |
| `/auth` | Sign in |
| `/register` | Sign up |

Popups (catalog menu, statistics, profile, set editing) open over the home screen without changing the route.

---

## Deploy (GitHub Pages)

Production builds deploy to GitHub Pages from `main` via `.github/workflows/deploy.yml`. Deploy runs only after unit and e2e jobs pass.

URL: `https://<user>.github.io/gym-tracker/`

1. In the repository: **Settings → Pages → Source → GitHub Actions**.
2. Add repository secrets (**Settings → Secrets and variables → Actions**) for the same `NEXT_PUBLIC_FIREBASE_*` values as in `.env.local`.
3. In Firebase Console → Authentication → Settings → Authorized domains, add `evg-smir.github.io` (or your GitHub Pages domain).
4. Push to `main` (or run the workflow manually: **Actions → Deploy to GitHub Pages → Run workflow**).

Locally: `npm run build`, then serve the `out/` folder as static files. The service worker requires **HTTPS** (or `localhost`).

In production the app uses `basePath=/gym-tracker`; with `npm run dev` the base path is empty.

---

## Tests

**Unit (Vitest)** — domain helpers and Zustand stores (mocked persistence):

```bash
npm test
```

**E2E (Playwright)** — starts Firebase emulators + Next.js automatically, then runs critical flows (auth, add exercise/set, day switch). Requires Java 21+ on `PATH` (Firestore emulator):

```bash
# macOS example
export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"
export JAVA_HOME="/opt/homebrew/opt/openjdk@21"

npx playwright install chromium   # once
npm run test:e2e
```

CI: `.github/workflows/test.yml` on push/PR; deploy workflow also gates on the same checks.

---

## License

Private project (`"private": true` in `package.json`).
