# Gym Tracker

Мобильное PWA для учёта силовых тренировок: календарь, упражнения по группам мышц, подходы (вес × повторы), статистика прогресса и профиль.

## Стек

- Next.js 14 (App Router) + React 18 + TypeScript
- Static export (`output: 'export'`)
- Zustand, Firebase Auth + Firestore, IndexedDB
- SCSS Modules, Tailwind, MUI DateCalendar, Recharts
- Service worker (`public/sw.js`) для offline shell

## Setup

1. Установите зависимости:

```bash
npm install
```

2. Скопируйте env-файл и заполните Firebase-ключи:

```bash
cp .env.example .env.local
```

3. Запустите dev-сервер:

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Описание |
|--------|----------|
| `npm run dev` | Dev-сервер на `0.0.0.0:3000` |
| `npm run build` | Static export в `out/` |
| `npm start` | Next start (для non-export сценариев) |
| `npm run lint` | ESLint |
| `npm test` | Vitest (unit) |

## Firebase

Нужен проект Firebase с Email/Password Auth и Firestore.

Переменные (см. `.env.example`):

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Структура данных:

```
users/{uid}
  ├── categories/{slug}
  └── workouts/{dd.mm.yyyy}
```

Локально данные также пишутся в IndexedDB (`PWAStorage`).

## Основные возможности

- Регистрация / вход
- Дневник тренировок по дням
- Каталог упражнений с флагами «удвоить вес» и «собственный вес»
- Multi-select при добавлении упражнений
- Статистика: max weight / volume (или reps для bodyweight)
- Профиль: имя, email, пароль (с reauth)
- PWA manifest + service worker

## Deploy (GitHub Pages)

Продакшен-сборка идёт на GitHub Pages из ветки `main` (workflow `.github/workflows/deploy.yml`).
URL: `https://<user>.github.io/gym-tracker/`.

1. В репозитории: **Settings → Pages → Source → GitHub Actions**.
2. Добавьте Repository secrets (**Settings → Secrets and variables → Actions**) с теми же `NEXT_PUBLIC_FIREBASE_*`, что в `.env.local`.
3. В Firebase Console → Authentication → Settings → Authorized domains добавьте `evg-smir.github.io` (или ваш GitHub Pages домен).
4. Запушьте в `main` (или запустите workflow вручную: **Actions → Deploy to GitHub Pages → Run workflow**).

Локально: `npm run build` → раздайте `out/` как статику. Для service worker нужен HTTPS (или localhost).
В production используется `basePath=/gym-tracker`; в `npm run dev` basePath пустой.
