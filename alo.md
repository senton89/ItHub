# 📚 IThub — Полное объяснение кода

Этот документ объясняет **каждую строку** кода в проекте IThub.

---

## 📁 Структура проекта

```
src/
├── app/
│   ├── layout.jsx      # Корневой layout (обёртка для всех страниц)
│   ├── page.jsx        # Главная страница (каталог ресурсов)
│   ├── globals.css     # Глобальные стили
│   ├── dictionary/
│   │   └── page.jsx    # Страница справочника терминов
│   ├── about/
│   │   └── page.jsx    # Страница "О проекте"
│   └── api/            # API маршруты
│       ├── resources/route.js  # API ресурсов
│       ├── categories/route.js # API категорий
│       ├── terms/route.js      # API терминов
│       ├── seed/route.js       # Заполнение базы
│       └── search/route.js     # API поиска
└── lib/
    └── db.ts           # Подключение к базе данных

prisma/
└── schema.prisma       # Схема базы данных
```

---

## 📄 Файл: `src/app/layout.jsx`

```jsx
// === СТРОКА 1-7: ИМПОРТЫ ===
import { Geist, Geist_Mono } from "next/font/google";
```
**Объяснение:** 
- `import` — ключевое слово JavaScript для импорта модулей
- `{ Geist, Geist_Mono }` — деструктуризация, извлекаем два экспорта
- `from "next/font/google"` — импортируем из пакета Next.js для работы со шрифтами Google

```jsx
import "./globals.css";
```
**Объяснение:**
- Импортируем глобальные CSS стили
- Next.js автоматически обработает этот файл и добавит стили на все страницы

```jsx
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
```
**Объяснение:**
- `const` — объявление константы (переменная, которую нельзя переназначить)
- `Geist(...)` — вызов функции для настройки шрифта
- `variable: "--font-geist-sans"` — создаёт CSS-переменную для использования в стилях
- `subsets: ["latin"]` — загружаем только латинские символы для оптимизации

```jsx
export const metadata = {
  title: "IThub — Справочник IT-ресурсов",
  description: "...",
  keywords: [...],
};
```
**Объяснение:**
- `export const` — экспортируем константу для использования в других модулях
- `metadata` — специальный объект Next.js для SEO-метаданных
- Эти данные используются для:
  - `<title>` в браузере
  - Meta-тегов для поисковых систем
  - Превью в социальных сетях

```jsx
export default function RootLayout({ children }) {
```
**Объяснение:**
- `export default` — главный экспорт файла (обязателен для страниц Next.js)
- `function RootLayout` — объявление функции-компонента
- `{ children }` — деструктуризация props, извлекаем свойство children
- `children` — специальный prop, содержащий дочерние элементы (страницы)

```jsx
<html lang="ru" suppressHydrationWarning>
```
**Объяснение:**
- `<html>` — корневой HTML-элемент
- `lang="ru"` — указывает язык контента (важно для SEO и screen readers)
- `suppressHydrationWarning` — отключает предупреждения React о несоответствии серверного и клиентского рендеринга

```jsx
<body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
```
**Объяснение:**
- `<body>` — тело HTML-документа
- `className` — React-аналог HTML-атрибута `class`
- Шаблонная строка `` `${...}` `` — вставка значений переменных в строку
- `geistSans.variable` — CSS-переменная шрифта (--font-geist-sans)
- `antialiased` — сглаживание шрифтов (Tailwind CSS)
- `bg-background` — цвет фона из CSS-переменной
- `text-foreground` — цвет текста из CSS-переменной

```jsx
{children}
```
**Объяснение:**
- `{children}` — вывод содержимого переменной children
- Здесь Next.js вставит содержимое текущей страницы
- Фигурные скобки `{}` — способ вставки JavaScript в JSX

---

## 📄 Файл: `src/app/page.jsx`

### === ДИРЕКТИВА 'USE CLIENT' ===

```jsx
'use client';
```
**Объяснение:**
- `'use client'` — специальная директива Next.js 13+
- Помечает компонент как клиентский (выполняется в браузере)
- Без неё компонент выполняется на сервере
- Нужна когда используешь:
  - `useState`, `useEffect`, `useCallback` (хуки)
  - Обработчики событий (`onClick`, `onChange`)
  - Browser API (`window`, `localStorage`)

### === ИМПОРТЫ ===

```jsx
import { useState, useEffect, useCallback } from "react";
```
**Объяснение:**
- `useState` — хук для создания состояния (переменных, которые вызывают перерисовку при изменении)
- `useEffect` — хук для побочных эффектов (загрузка данных, подписки)
- `useCallback` — хук для мемоизации функций (оптимизация)

```jsx
import Link from "next/link";
```
**Объяснение:**
- `Link` — компонент Next.js для навигации между страницами
- Работает как `<a>`, но без перезагрузки страницы (SPA-навигация)

```jsx
import { Search, ExternalLink, Plus } from "lucide-react";
```
**Объяснение:**
- Импортируем иконки из библиотеки lucide-react
- Каждая иконка — это React-компонент

### === КОМПОНЕНТ HEADER ===

```jsx
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
```
**Объяснение:**
- `function Header()` — объявление функционального компонента
- `const [isMenuOpen, setIsMenuOpen]` — деструктуризация массива
- `useState(false)` — создаём состояние с начальным значением `false`
- `isMenuOpen` — текущее значение состояния
- `setIsMenuOpen` — функция для изменения состояния

```jsx
const navLinks = [
  { href: "#catalog", label: "Каталог" },
  { href: "/dictionary", label: "Справочник" },
];
```
**Объяснение:**
- `const navLinks` — массив объектов
- Каждый объект представляет ссылку навигации
- `href` — адрес ссылки
- `label` — текст ссылки

```jsx
return (
  <header className="sticky top-0 z-50 border-b border-black/5 bg-[#faf9f7]/80 backdrop-blur-md">
```
**Объяснение:**
- `return` — возвращаем JSX-разметку
- `<header>` — HTML-элемент для шапки
- Tailwind CSS классы:
  - `sticky` — позиционирование: прилипающий элемент
  - `top-0` — прилипает к верху
  - `z-50` — z-index: 50 (слой поверх других элементов)
  - `border-b` — нижняя граница
  - `border-black/5` — цвет границы: чёрный с 5% прозрачности
  - `bg-[#faf9f7]/80` — цвет фона: #faf9f7 с 80% непрозрачности
  - `backdrop-blur-md` — размытие фона под элементом

```jsx
<Link href="/" className="text-xl font-medium tracking-tight">
  IT<span className="text-rose-600">hub</span>
</Link>
```
**Объяснение:**
- `<Link>` — компонент навигации Next.js
- `href="/"` — ссылка на главную страницу
- `<span>` — встроенный контейнер для стилизации части текста
- `text-rose-600` — розовый цвет текста

```jsx
{navLinks.map((link) => (
  link.href.startsWith('#') ? (
    <a href={link.href}>...</a>
  ) : (
    <Link href={link.href}>...</Link>
  )
))}
```
**Объяснение:**
- `navLinks.map(...)` — перебор массива и создание элементов
- `link.href.startsWith('#')` — проверка: начинается ли href с #
- Тернарный оператор `? :` — условный рендеринг
- `#` используется для якорей (прокрутка на странице) — нужен `<a>`
- `/` используется для страниц — нужен `<Link>`

```jsx
<button onClick={() => setIsMenuOpen(!isMenuOpen)}>
  {isMenuOpen ? <X /> : <Menu />}
</button>
```
**Объяснение:**
- `onClick` — обработчик клика
- `() => setIsMenuOpen(!isMenuOpen)` — стрелочная функция
- `!isMenuOpen` — инверсия значения (true → false, false → true)
- Условный рендеринг иконки

```jsx
<AnimatePresence>
  {isMenuOpen && (
    <motion.nav
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
    >
```
**Объяснение:**
- `<AnimatePresence>` — компонент Framer Motion для анимации появления/исчезновения
- `isMenuOpen && (...)` — логическое И: рендерим только если true
- `<motion.nav>` — анимированный элемент nav
- `initial` — начальное состояние анимации
- `animate` — конечное состояние
- `exit` — состояние при исчезновении

---

### === КОМПОНЕНТ МОДАЛЬНОГО ОКНА ===

```jsx
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
```
**Объяснение:**
- `{ isOpen, onClose, title, children }` — деструктуризация props
- `if (!isOpen) return null` — ранний возврат: если окно закрыто, не рендерим ничего
- Это оптимизация: React не обрабатывает скрытый контент

```jsx
<motion.div
  onClick={onClose}
  className="fixed inset-0 bg-black/30 z-50"
/>
```
**Объяснение:**
- `fixed inset-0` — позиционирование на весь экран
- `bg-black/30` — чёрный цвет с 30% прозрачности (затемнение)
- `onClick={onClose}` — закрытие при клике на затемнение

```jsx
<motion.div
  onClick={(e) => e.stopPropagation()}
  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
>
```
**Объяснение:**
- `top-1/2 left-1/2` — позиция в центре (50% от края)
- `-translate-x-1/2 -translate-y-1/2` — смещение на 50% своего размера (точное центрирование)
- `e.stopPropagation()` — остановка всплытия события (клик не доходит до родителя)

---

### === ГЛАВНЫЙ КОМПОНЕНТ ===

```jsx
export default function Home() {
  const [resources, setResources] = useState([]);
```
**Объяснение:**
- `export default` — главный экспорт файла (обязательно для страницы Next.js)
- `useState([])` — создаём состояние с пустым массивом как начальным значением
- `resources` — переменная состояния (массив ресурсов)
- `setResources` — функция для обновления ресурсов

```jsx
const fetchData = useCallback(async () => {
  setIsLoading(true);
  try {
    const [resourcesRes, categoriesRes, termsRes] = await Promise.all([
      fetch("/api/resources"),
      fetch("/api/categories"),
      fetch("/api/terms"),
    ]);
```
**Объяснение:**
- `useCallback` — мемоизация функции (не пересоздаётся при рендере)
- `async ()` — асинхронная стрелочная функция
- `await` — ожидание завершения промиса
- `Promise.all([...])` — выполнение нескольких промисов параллельно
- `fetch("/api/resources")` — GET-запрос к API
- Деструктуризация массива: `[res1, res2, res3]`

```jsx
const [resourcesData, categoriesData, termsData] = await Promise.all([
  resourcesRes.json(),
  categoriesRes.json(),
  termsRes.json(),
]);
```
**Объяснение:**
- `.json()` — метод Response, парсит JSON в JavaScript-объект
- Возвращает промис, поэтому нужен `await`

```jsx
}, []); // Пустой массив зависимостей
```
**Объяснение:**
- `[]` — массив зависимостей useCallback
- Пустой массив = функция создаётся один раз при монтировании

```jsx
useEffect(() => {
  const init = async () => {
    await fetch("/api/seed");
    await fetchData();
  };
  init();
}, [fetchData]);
```
**Объяснение:**
- `useEffect` — хук для побочных эффектов
- Выполняется после рендера компонента
- `[fetchData]` — зависимости: выполнять при изменении fetchData
- `fetch("/api/seed")` — заполняем базу тестовыми данными
- `fetchData()` — загружаем данные

---

### === JSX-РАЗМЕТКА ===

```jsx
<div className="min-h-screen flex flex-col">
```
**Объяснение:**
- `min-h-screen` — минимальная высота: 100vh (весь экран)
- `flex` — display: flex (гибкий контейнер)
- `flex-col` — направление: колонка (вертикально)

```jsx
<div
  className="fixed inset-0 z-0"
  style={{
    background: `linear-gradient(...)`,
  }}
/>
```
**Объяснение:**
- `fixed inset-0 z-0` — фиксированный фон на весь экран, позади всего
- `style={{...}}` — inline-стили (объект в объекте)
- Шаблонная строка для CSS-градиента

```jsx
<motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
```
**Объяснение:**
- `motion.h1` — анимированный заголовок
- `opacity: 0` → `opacity: 1` — появление
- `y: 20` → `y: 0` — подъём снизу

```jsx
{categories.map((category, index) => (
  <motion.button
    transition={{ delay: index * 0.05 }}
  >
```
**Объяснение:**
- `categories.map(...)` — перебор массива
- `index` — индекс элемента (0, 1, 2, ...)
- `delay: index * 0.05` — каскадная анимация (каждый элемент позже)

```jsx
{isLoading ? (
  <div>Загрузка...</div>
) : (
  <div>{resources.map(...)}</div>
)}
```
**Объяснение:**
- Тернарный оператор: `условие ? если_true : если_false`
- Условный рендеринг: показываем загрузку или данные

---

## 📄 Файл: `src/app/api/resources/route.js`

### === GET-ЗАПРОС ===

```jsx
import { PrismaClient } from "@prisma/client";
```
**Объяснение:**
- PrismaClient — класс для работы с базой данных через ORM Prisma

```jsx
const prisma = globalThis.__prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;
```
**Объяснение:**
- `globalThis.__prisma` — глобальная переменная для хранения соединения
- Паттерн Singleton: одно соединение на всё приложение
- В development при горячей перезагрузке создаётся новый экземпляр
- Эта проверка предотвращает множественные соединения

```jsx
export async function GET() {
```
**Объяснение:**
- `export async function GET` — экспорт обработчика GET-запросов
- Next.js автоматически направляет GET-запросы к этой функции

```jsx
const resources = await prisma.resource.findMany({
  include: {
    category: true,
  },
  orderBy: {
    createdAt: "desc",
  },
});
```
**Объяснение:**
- `prisma.resource.findMany()` — получить все записи из таблицы resources
- `include: { category: true }` — включить связанную категорию (JOIN)
- `orderBy: { createdAt: "desc" }` — сортировка по дате создания (новые первые)

```jsx
return new Response(JSON.stringify(resources), {
  status: 200,
  headers: { "Content-Type": "application/json" },
});
```
**Объяснение:**
- `new Response(...)` — создание HTTP-ответа (Web API)
- `JSON.stringify(resources)` — преобразование объекта в JSON-строку
- `status: 200` — код успешного ответа
- `Content-Type: application/json` — указываем тип содержимого

### === POST-ЗАПРОС ===

```jsx
export async function POST(request) {
  const body = await request.json();
```
**Объяснение:**
- `POST(request)` — обработчик POST-запросов
- `request.json()` — получение тела запроса и парсинг JSON

```jsx
const { name, description, url, categoryId } = body;

if (!name || !description || !categoryId) {
  return new Response(JSON.stringify({ error: "..." }), { status: 400 });
}
```
**Объяснение:**
- Деструктуризация полей из тела запроса
- Валидация: проверка обязательных полей
- `status: 400` — Bad Request (ошибка клиента)

```jsx
const resource = await prisma.resource.create({
  data: {
    name,
    description,
    url: url || null,
    categoryId,
  },
});
```
**Объяснение:**
- `prisma.resource.create()` — создание новой записи
- `data` — данные для создания
- `url: url || null` — если url пустой, сохраняем null

---

## 📄 Файл: `src/app/api/seed/route.js`

### === ЗАПОЛНЕНИЕ БАЗЫ ===

```jsx
const existingCategories = await prisma.category.count();

if (existingCategories > 0) {
  return new Response(JSON.stringify({ message: "База уже заполнена" }));
}
```
**Объяснение:**
- `prisma.category.count()` — подсчёт записей в таблице
- Проверка: если данные уже есть, не заполняем повторно

```jsx
await prisma.category.createMany({
  data: [
    { name: "Документация", color: "#3b82f6" },
    { name: "Инструменты", color: "#10b981" },
  ],
});
```
**Объяснение:**
- `createMany` — создание нескольких записей за один запрос
- `data` — массив объектов для вставки

---

## 🎨 Tailwind CSS — Основные классы

### Отступы
| Класс | Значение |
|-------|----------|
| `p-4` | padding: 1rem (16px) |
| `px-4` | padding-left/right: 1rem |
| `py-4` | padding-top/bottom: 1rem |
| `m-4` | margin: 1rem |
| `mx-auto` | margin-left/right: auto (центрирование) |

### Размеры
| Класс | Значение |
|-------|----------|
| `w-full` | width: 100% |
| `h-screen` | height: 100vh |
| `max-w-7xl` | max-width: 80rem |
| `min-h-screen` | min-height: 100vh |

### Flexbox
| Класс | Значение |
|-------|----------|
| `flex` | display: flex |
| `flex-col` | flex-direction: column |
| `items-center` | align-items: center |
| `justify-between` | justify-content: space-between |
| `gap-4` | gap: 1rem |

### Текст
| Класс | Значение |
|-------|----------|
| `text-sm` | font-size: 0.875rem |
| `text-lg` | font-size: 1.125rem |
| `font-medium` | font-weight: 500 |
| `text-stone-500` | color: #78716c |
| `text-rose-600` | color: #e11d48 |

### Цвета
| Класс | Значение |
|-------|----------|
| `bg-white` | background-color: white |
| `bg-rose-600` | background-color: #e11d48 |
| `bg-black/30` | background-color: rgba(0,0,0,0.3) |

### Границы
| Класс | Значение |
|-------|----------|
| `border` | border-width: 1px |
| `border-b` | border-bottom-width: 1px |
| `rounded-lg` | border-radius: 0.5rem |
| `rounded-full` | border-radius: 9999px |

### Позиционирование
| Класс | Значение |
|-------|----------|
| `relative` | position: relative |
| `fixed` | position: fixed |
| `sticky` | position: sticky |
| `top-0` | top: 0 |
| `inset-0` | top/right/bottom/left: 0 |
| `z-50` | z-index: 50 |

---

## 🔄 React Hooks — Краткий справочник

### useState
```jsx
const [value, setValue] = useState(initialValue);
```
- Создаёт переменную состояния
- При изменении `setValue` компонент перерисовывается

### useEffect
```jsx
useEffect(() => {
  // Код выполняется после рендера
  return () => {
    // Функция очистки (выполняется при размонтировании)
  };
}, [dependencies]);
```
- Побочные эффекты: загрузка данных, подписки
- `[]` — выполнить один раз
- `[dep]` — выполнить при изменении dep

### useCallback
```jsx
const memoizedFn = useCallback(() => {
  // Код функции
}, [dependencies]);
```
- Мемоизация функции
- Функция не пересоздаётся при рендере
- Используется для оптимизации

---

## 📡 HTTP-запросы с fetch

### GET-запрос
```jsx
const response = await fetch("/api/resources");
const data = await response.json();
```

### POST-запрос
```jsx
const response = await fetch("/api/resources", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Test" }),
});
```

### Обработка ошибок
```jsx
try {
  const response = await fetch("/api/resources");
  if (!response.ok) {
    throw new Error("Ошибка запроса");
  }
  const data = await response.json();
} catch (error) {
  console.error(error);
}
```

---

## 🎬 Framer Motion — Основы

### Базовая анимация
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}    // Начальное состояние
  animate={{ opacity: 1, y: 0 }}      // Конечное состояние
  transition={{ duration: 0.5 }}      // Настройки
/>
```

### Анимация появления/исчезновения
```jsx
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}           // Состояние при исчезновении
    />
  )}
</AnimatePresence>
```

### Каскадная анимация
```jsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: index * 0.1 }} // Задержка для каждого элемента
  />
))}
```

---

## 🗄️ Prisma — Основные операции

### Получение записей
```jsx
// Все записи
const users = await prisma.user.findMany();

// С условием
const user = await prisma.user.findUnique({
  where: { id: 1 }
});

// С включением связей
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true }
});
```

### Создание записи
```jsx
const user = await prisma.user.create({
  data: {
    name: "Иван",
    email: "ivan@example.com"
  }
});
```

### Обновление записи
```jsx
const user = await prisma.user.update({
  where: { id: 1 },
  data: { name: "Новое имя" }
});
```

### Удаление записи
```jsx
await prisma.user.delete({
  where: { id: 1 }
});
```

---

## ❓ Частые вопросы

### Почему `'use client'`?
- Next.js 13+ использует Server Components по умолчанию
- `'use client'` нужен для клиентских компонентов
- Используй когда нужны: useState, useEffect, onClick

### Почему `export default`?
- Next.js ищет default export для страниц
- Только один default export на файл

### Зачем `key` в map?
- React использует key для идентификации элементов
- Помогает React понять какие элементы изменились
- Обычно используют `item.id`

### Почему `{}` в JSX?
- `{}` — способ вставки JavaScript в JSX
- Можно вставлять: переменные, выражения, вызовы функций

### Что такое `children`?
- Специальный prop, содержащий дочерние элементы
- Используется для создания компонентов-обёрток

---

## 📚 Полезные ресурсы

- [Next.js документация](https://nextjs.org/docs)
- [React документация](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Prisma](https://www.prisma.io/docs)
- [Framer Motion](https://www.framer.com/motion)

---

*Этот документ создан для обучения и объясняет каждую строку кода в проекте IThub.*
