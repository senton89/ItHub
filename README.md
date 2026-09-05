# FixLib

Открытая библиотека решений: структурированные по темам ресурсы, термины и ответы на вопросы — от технологий до быта.

Демо: https://fixlib-nine.vercel.app

## Контекст

Курсовая работа, апрель — сентябрь 2026, соло. Завершён.

## Стек

Next.js 16 (App Router), React 19, TypeScript, Prisma + SQLite, next-auth v5 (beta), Tailwind CSS 4, react-hook-form + zod, Radix UI, framer-motion. Деплой: Vercel; в репозитории также Dockerfile, docker-compose и Caddyfile для самостоятельного хостинга.

## Что реализовано

- Каталог ресурсов и терминов с разбивкой по темам.
- Раздел «Вопрос — ответ».
- Регистрация и вход (next-auth, пароли хешируются bcryptjs).
- Зарегистрированные пользователи предлагают новые термины и ресурсы.
- Админ-панель: принять или отклонить предложение, отредактировать, изменить размещение, удалить.

## Скриншоты

- `docs/main.png` — главная страница

## Запуск

```sh
git clone https://github.com/senton89/FixLib.git
cd FixLib
npm install
cp .env.example .env      # заполнить переменные
npm run db:push
npm run dev               # http://localhost:3000
```

## Ограничения и статус

- БД — SQLite.
- next-auth используется в beta-версии.
- Автотестов нет.
- Завершён как курсовая работа, не развивается.
