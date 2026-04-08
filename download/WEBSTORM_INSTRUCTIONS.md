# Инструкция по запуску проекта IThub в WebStorm

## О проекте
**IThub** — IT-агрегатор с элементами справочника.  
**Стек:** Next.js 16 + React 19 + JavaScript + Tailwind CSS 4 + Prisma + SQLite

---

## 1. Требования

Перед началом убедитесь, что установлены:

| Инструмент | Версия | Проверка |
|------------|--------|----------|
| Node.js | 18+ | `node -v` |
| Bun (рекомендуется) или npm |最新 | `bun -v` или `npm -v` |
| WebStorm | 2023.2+ | — |

---

## 2. Открытие проекта в WebStorm

### Способ A: Через меню File
1. Запустите **WebStorm**
2. **File → Open**
3. Выберите папку проекта `my-project`
4. Нажмите **OK**
5. В появившемся диалоге выберите **"Trust and Open Project"**

### Способ B: Из командной строки
```bash
# Linux/macOS
webstorm /путь/к/папке/проекта

# Windows
webstorm64.exe C:\путь\к\папке\проекта
```

---

## 3. Установка зависимостей

### В терминале WebStorm (Alt+F12)

**Используя Bun (рекомендуется):**
```bash
bun install
```

**Используя npm:**
```bash
npm install
```

---

## 4. Настройка базы данных

Проект использует SQLite с Prisma ORM. Выполните команду:

```bash
bun run db:push
```

или

```bash
npx prisma db push
```

Это создаст базу данных и начальные таблицы.

---

## 5. Запуск проекта

### Способ A: Через терминал WebStorm

```bash
bun run dev
```

или

```bash
npm run dev
```

### Способ B: Через конфигурацию запуска WebStorm

1. **Run → Edit Configurations...**
2. Нажмите **+** → выберите **npm**
3. Настройте:
   - **Name:** `dev`
   - **Package.json:** выберите `package.json` в корне проекта
   - **Command:** `run`
   - **Scripts:** `dev`
4. Нажмите **OK**
5. Запустите через **Run → Run 'dev'** или **Shift+F10**

### Способ C: Через Node.js конфигурацию

1. **Run → Edit Configurations...**
2. Нажмите **+** → выберите **Node.js**
3. Настройте:
   - **Name:** `Next.js Dev`
   - **Node interpreter:** выберите путь к node
   - **Working directory:** корень проекта
   - **JavaScript file:** `node_modules/next/dist/bin/next`
   - **Application parameters:** `dev`
4. Нажмите **OK**

---

## 6. Открытие в браузере

После запуска сервера, откройте в браузере:

```
http://localhost:3000
```

В WebStorm можно использовать встроенный браузер:
- **View → Tool Windows → Web Browser** или нажмите на иконку браузера справа

---

## 7. Структура проекта

```
my-project/
├── src/
│   ├── app/
│   │   ├── page.jsx           # Главная страница
│   │   ├── layout.jsx         # Корневой layout
│   │   ├── globals.css        # Глобальные стили
│   │   └── api/               # API routes
│   │       ├── resources/     # CRUD ресурсов
│   │       ├── categories/    # Категории
│   │       ├── terms/         # Справочник терминов
│   │       └── seed/          # Начальные данные
│   ├── components/
│   │   └── ui/                # UI компоненты
│   ├── hooks/                 # React hooks
│   └── lib/                   # Утилиты (db.js, utils.js)
├── prisma/
│   └── schema.prisma          # Схема базы данных
├── public/
│   └── bg.jpg                 # Фоновое изображение
├── package.json
├── jsconfig.json              # Конфигурация JS
├── tailwind.config.js         # Конфигурация Tailwind
└── next.config.js             # Конфигурация Next.js
```

---

## 8. Полезные команды

| Команда | Описание |
|---------|----------|
| `bun run dev` | Запуск dev сервера |
| `bun run build` | Сборка для продакшена |
| `bun run start` | Запуск продакшен сервера |
| `bun run lint` | Проверка кода ESLint |
| `bun run db:push` | Обновить схему БД |
| `bun run db:generate` | Генерация Prisma Client |

---

## 9. Функционал

### Добавление ресурсов
1. Нажмите кнопку **+** (Speed Dial) в правом нижнем углу
2. Выберите "Добавить ресурс"
3. Заполните форму: название, описание, URL, категория, теги
4. Нажмите "Добавить"

### Добавление терминов
1. Нажмите кнопку **+** (Speed Dial)
2. Выберите "Добавить термин"
3. Заполните форму: термин, определение, примеры
4. Нажмите "Добавить"

---

## 10. Решение проблем

### Ошибка "Module not found"
```bash
# Очистите кэш и переустановите зависимости
rm -rf node_modules .next
bun install
bun run dev
```

### Ошибка базы данных
```bash
# Пересоздайте базу данных
rm -f db/custom.db
bun run db:push
```

### Порт 3000 занят
```bash
# Найдите процесс на порту 3000
lsof -i :3000
# Или используйте другой порт
PORT=3001 bun run dev
```

---

## 11. Рекомендации по работе в WebStorm

### Горячие клавиши
| Действие | Windows/Linux | macOS |
|----------|---------------|-------|
| Запуск | Shift+F10 | Ctrl+R |
| Открыть терминал | Alt+F12 | Opt+F12 |
| Поиск файлов | Ctrl+Shift+N | Cmd+Shift+O |
| Глобальный поиск | Ctrl+Shift+F | Cmd+Shift+F |
| Форматирование | Ctrl+Alt+L | Cmd+Opt+L |

### Полезные плагины
- **.env files support** — подсветка .env файлов
- **Tailwind CSS** — автодополнение классов
- **Prisma** — поддержка Prisma схемы

### Настройка автоформатирования
1. **Settings → Languages & Frameworks → JavaScript → Prettier**
2. Включите **"On save"** и **"On code reformat"**

---

## 12. Сборка для продакшена

```bash
# Сборка
bun run build

# Запуск продакшен сервера
bun run start
```

Сайт будет доступен на `http://localhost:3000`

---

**Удачной разработки!**
