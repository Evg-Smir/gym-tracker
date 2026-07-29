# Gym Tracker

Мобильное Progressive Web App для учёта силовых тренировок. Приложение позволяет вести дневник по дням, добавлять упражнения из каталога по группам мышц, фиксировать подходы (вес × повторы) и смотреть прогресс в статистике.

Сборка — статический export Next.js: готовый `out/` можно раздавать с любого static-хостинга. Данные синхронизируются через Firebase (Auth + Firestore) и дублируются локально в IndexedDB для офлайн-сценариев.

---

## Возможности

- **Авторизация** — регистрация и вход по email/password (Firebase Auth)
- **Календарь тренировок** — выбор дня и просмотр упражнений за эту дату
- **Каталог упражнений** — группы мышц (руки, спина, плечи, грудь, ноги, пресс) с готовым набором движений
- **Флаги упражнений** — «удвоить вес» (гантели) и «собственный вес» (без нагрузки)
- **Подходы** — добавление, редактирование и удаление сетов (вес × повторы)
- **Multi-select** — быстрое добавление нескольких упражнений за раз
- **Статистика** — графики max weight / volume; для bodyweight — суммарные повторы (Recharts)
- **Профиль** — имя, email, смена пароля (с re-authentication)
- **PWA** — web app manifest + service worker (`public/sw.js`) для offline shell

---

## Стек

| Слой | Технологии |
|------|------------|
| UI | Next.js 14 (App Router), React 18, TypeScript |
| Стили | SCSS Modules, Tailwind CSS |
| Состояние | Zustand |
| Календарь | MUI X Date Pickers (`DateCalendar`) + dayjs |
| Графики | Recharts |
| Backend | Firebase Auth, Cloud Firestore |
| Локальное хранение | IndexedDB (`PWAStorage`) |
| Сборка | `output: 'export'` → статика в `out/` |
| Тесты | Vitest |

---

## Быстрый старт

### Требования

- Node.js 18+
- npm
- проект Firebase с **Email/Password** Auth и **Firestore**

### Установка

```bash
npm install
cp .env.example .env.local
```

Заполните `.env.local` ключами Firebase (см. ниже), затем:

```bash
npm run dev
```

Приложение откроется на [http://localhost:3000](http://localhost:3000) (слушает `0.0.0.0:3000`).

Без авторизации пользователь перенаправляется на `/auth`.

---

## Scripts

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер на `0.0.0.0:3000` |
| `npm run build` | Production-сборка + static export в `out/` |
| `npm start` | `next start` (для non-export сценариев) |
| `npm run lint` | ESLint |
| `npm test` | Unit-тесты (Vitest) |

---

## Firebase

### Переменные окружения

Скопируйте `.env.example` → `.env.local` и укажите:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Все ключи публичные (`NEXT_PUBLIC_*`) — безопасность данных обеспечивается **Firestore Security Rules**, а не секретностью API key.

### Структура данных

```
users/{uid}
  ├── firstName, lastName, email, createdAt, updatedAt
  ├── categoriesIsUpload, exercisesIsUpload
  ├── categories/{slug}     # каталог упражнений пользователя
  └── workouts/{dd.mm.yyyy} # тренировки по дням
```

Локально те же данные пишутся в IndexedDB (`PWAStorage`) с ключами `{uid}:exercises` и `{uid}:categories`.

### Security Rules

Файл [`firestore.rules`](firestore.rules) ограничивает чтение/запись только владельцем документа (`request.auth.uid == userId`).

Задеплойте правила:

```bash
firebase deploy --only firestore:rules
```

или через Firebase Console. Без правил клиентские проверки uid **не** защищают данные.

---

## Архитектура

```
src/
├── app/                  # Next.js App Router (/, /auth, /register, manifest)
├── components/           # UI: Calendar, Exercises, Sets, Popups, Profile, Auth
├── context/              # AuthContext (Firebase onAuthStateChanged)
├── stores/               # Zustand: exercisesStore, categoriesStore, userStore
├── db/                   # Firestore CRUD (users, workouts, categories)
├── lib/                  # инициализация Firebase
├── services/             # IndexedDB, статистика, фильтры, defaultCategories
├── hooks/                # useFilteredCategories, useClickOutside, …
└── @types/               # TypeScript-типы
```

### Поток данных

1. После входа `AuthContext` отдаёт `uid`.
2. Stores загружают категории и тренировки из Firestore; параллельно пишут/читают IndexedDB.
3. Изменения дня (добавить упражнение, сет, удалить) обновляют Zustand → IndexedDB → Firestore.
4. Статистика считается на клиенте из истории тренировок (`services/statistics.ts`).

### Основные экраны

| Маршрут | Назначение |
|---------|------------|
| `/` | Главный экран: календарь + список упражнений дня + нижний бар |
| `/auth` | Вход |
| `/register` | Регистрация |

Попапы (меню каталога, статистика, профиль, редактирование сетов) открываются поверх главного экрана без смены маршрута.

---

## Deploy

```bash
npm run build
```

Раздайте содержимое `out/` как статику (Firebase Hosting, S3, Nginx, GitHub Pages и т.п.).

Для service worker нужен **HTTPS** (или `localhost`). После деплоя правил Firestore убедитесь, что Auth Email/Password включён в консоли Firebase.

---

## Тесты

Unit-тесты покрывают статистику, фильтры категорий, формат дат и store упражнений:

```bash
npm test
```

---

## Лицензия

Private project (`"private": true` в `package.json`).
