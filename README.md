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
| Tests | Vitest |

---

## Quick start

### Requirements

- Node.js 18+
- npm
- a Firebase project with **Email/Password** Auth and **Firestore**

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

---

## Scripts

| Command | Description |
|---------|----------|
| `npm run dev` | Dev server on `0.0.0.0:3000` |
| `npm run build` | Production build + static export to `out/` |
| `npm start` | `next start` (for non-export scenarios) |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |

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

The same data is also written locally to IndexedDB (`PWAStorage`) under `{uid}:exercises` and `{uid}:categories`.

### Security Rules

[`firestore.rules`](firestore.rules) allows read/write only for the document owner (`request.auth.uid == userId`).

Deploy the rules:

```bash
firebase deploy --only firestore:rules
```

or via the Firebase Console. Without rules, client-side uid checks do **not** protect your data.

---

## Architecture

```
src/
├── app/                  # Next.js App Router (/, /auth, /register, manifest)
├── components/           # UI: Calendar, Exercises, Sets, Popups, Profile, Auth
├── context/              # AuthContext (Firebase onAuthStateChanged)
├── stores/               # Zustand: exercisesStore, categoriesStore, userStore
├── db/                   # Firestore CRUD (users, workouts, categories)
├── lib/                  # Firebase initialization, basePath helpers
├── services/             # IndexedDB, statistics, filters, defaultCategories
├── hooks/                # useFilteredCategories, useClickOutside, …
└── @types/               # TypeScript types
```

### Data flow

1. After sign-in, `AuthContext` provides the `uid`.
2. Stores load categories and workouts from Firestore and also read/write IndexedDB.
3. Day changes (add exercise, set, delete) update Zustand → IndexedDB → Firestore.
4. Statistics are computed on the client from workout history (`services/statistics.ts`).

### Main screens

| Route | Purpose |
|---------|------------|
| `/` | Home: calendar + day exercise list + bottom bar |
| `/auth` | Sign in |
| `/register` | Sign up |

Popups (catalog menu, statistics, profile, set editing) open over the home screen without changing the route.

---

## Deploy (GitHub Pages)

Production builds deploy to GitHub Pages from `main` via `.github/workflows/deploy.yml`.

URL: `https://<user>.github.io/gym-tracker/`

1. In the repository: **Settings → Pages → Source → GitHub Actions**.
2. Add repository secrets (**Settings → Secrets and variables → Actions**) for the same `NEXT_PUBLIC_FIREBASE_*` values as in `.env.local`.
3. In Firebase Console → Authentication → Settings → Authorized domains, add `evg-smir.github.io` (or your GitHub Pages domain).
4. Push to `main` (or run the workflow manually: **Actions → Deploy to GitHub Pages → Run workflow**).

Locally: `npm run build`, then serve the `out/` folder as static files. The service worker requires **HTTPS** (or `localhost`).

In production the app uses `basePath=/gym-tracker`; with `npm run dev` the base path is empty.

---

## Tests

Unit tests cover statistics, category filters, date formatting, and the exercises store:

```bash
npm test
```

---

## License

Private project (`"private": true` in `package.json`).
