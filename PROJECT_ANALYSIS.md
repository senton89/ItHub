# 📊 Отчёт об анализе проекта

**Дата:** $(date '+%Y-%m-%d %H:%M:%S')
**Проект:** $(basename "$PWD")

---

## 1. 📁 Полная структура файлов

./src/app/about/page.jsx
./src/app/api/categories/route.js
./src/app/api/qa-seed/route.js
./src/app/api/questions/[id]/answers/route.js
./src/app/api/questions/[id]/route.js
./src/app/api/questions/route.js
./src/app/api/resources/route.js
./src/app/api/search/route.js
./src/app/api/seed/route.js
./src/app/api/tags/route.js
./src/app/api/terms/route.js
./src/app/api/upload/route.js
./src/app/dictionary/page.jsx
./src/app/globals.css
./src/app/layout.jsx
./src/app/page.jsx
./src/app/questions/ask/page.jsx
./src/app/questions/page.jsx
./src/app/questions/[slug]/page.jsx
./src/components/qa/ImageUploader.jsx
./src/components/qa/QuestionCard.jsx
./src/components/qa/TagBadge.jsx
./src/lib/prisma.js
./src/lib/utils.js

## 2. 📦 package.json - Метаданные

### Информация о проекте
```json
```

### Скрипты (scripts)
```bash
  "scripts": {
    "dev": "next dev -p 3000 2>&1 | tee dev.log",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:generate": "prisma generate"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.1.1",
    "@prisma/client": "^6.11.1",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
```

### Dependencies
```json
```

### DevDependencies
```json
```

## 3. ⚙️ Конфигурационные файлы

### next.config.ts
```
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
```

### tailwind.config.ts
```
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
};
export default config;
```

### tailwind.config.js
```
import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [tailwindcssAnimate],
};

export default config;
```

### tsconfig.json
```
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "incremental": true,
    "module": "esnext",
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": ["node_modules"]
}
```

### jsconfig.json
```
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "jsx": "react-jsx",
    "target": "ES2017",
    "module": "esnext",
    "moduleResolution": "node",
    "allowJs": true,
    "checkJs": false,
    "esModuleInterop": true
  },
  "include": ["src/**/*", "next.config.js", "tailwind.config.js"],
  "exclude": ["node_modules"]
}
```

### components.json
```
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}```

### .config.json
```
{
 "Meta": {
  "Strict": true,
  "Retries": 10,
  "MaxDeletes": 10,
  "SkipDirNlink": 20,
  "CaseInsensi": false,
  "ReadOnly": false,
  "NoBGJob": true,
  "OpenCache": 0,
  "OpenCacheLimit": 10000,
  "Heartbeat": 12000000000,
  "MountPoint": "/tmp/storage/containers/rundjuicefs-1000b153-458c-4908-8282-fb685bcfd116-my-project",
  "Subdir": "/9298101c-6423-4114-9c62-fefcee9fd768/chat-f69fc4fe-f7eb-4d79-8c86-3885aa3e377a/my-project",
  "AtimeMode": "noatime",
  "DirStatFlushPeriod": 1000000000,
  "SkipDirMtime": 100000000,
  "Sid": 6488050,
  "SortDir": false,
  "FastStatfs": false,
  "TTLCleanupInterval": 1800000000000
 },
 "Format": {
  "Name": "pcs-ue6ju0nuiu0hz7tjc-0e3odv6t4dackr8s3",
  "UUID": "ad4b5b55-9406-4e74-b5e1-5422c94dd1fa",
  "Storage": "oss",
  "Bucket": "https://pcs-ue6ju0nuiu0hz7tjc-0e3odv6t4dackr8s3.oss-cn-hongkong-internal.aliyuncs.com",
  "AccessKey": "STS.REDACTED",
  "SecretKey": "removed",
  "SessionToken": "removed",
  "BlockSize": 4096,
  "Compression": "none",
  "HashPrefix": true,
  "EncryptAlgo": "aes256gcm-rsa",
  "TrashDays": 0,
  "MetaVersion": 1,
  "MinClientVersion": "1.1.0-A",
  "DirStats": true,
  "EnableACL": false,
  "Consul": "21.0.14.104:8500",
  "CustomLabels": "cluster:pfs-j6cm9t56111f4x38;uid:1936221977589032",
  "PushGateway": "http://cn-hongkong-intranet.arms.aliyuncs.com/prometheus/322760eec05a83d258d354fca51498ab/1047553595254976/tiwz7q7d94/cn-hongkong/api/v2"
 },
 "Chunk": {
  "CacheDir": "/var/jfsCache/ad4b5b55-9406-4e74-b5e1-5422c94dd1fa",
  "CacheMode": 384,
  "CacheSize": 107374182400,
  "CacheItems": 0,
  "CacheChecksum": "extend",
  "CacheEviction": "2-random",
  "CacheScanInterval": 3600000000000,
  "CacheExpire": 0,
  "OSCache": true,
  "FreeSpace": 0.1,
  "AutoCreate": true,
  "Compress": "none",
  "MaxUpload": 20,
  "MaxStageWrite": 1000,
  "MaxRetries": 10,
  "UploadLimit": 0,
  "DownloadLimit": 0,
  "Writeback": false,
  "UploadDelay": 0,
  "UploadHours": "",
  "HashPrefix": true,
  "BlockSize": 4194304,
  "GetTimeout": 60000000000,
  "PutTimeout": 60000000000,
  "CacheFullBlock": true,
  "CacheLargeWrite": false,
  "BufferSize": 314572800,
  "Readahead": 33554432,
  "Prefetch": 1
 },
 "Security": {
  "EnableCap": false,
  "EnableSELinux": false
 },
 "Port": {},
 "Version": "1.3.0+2025-11-13.7d12dfcb",
 "AttrTimeout": 1000000000,
 "DirEntryTimeout": 1000000000,
 "NegEntryTimeout": 0,
 "EntryTimeout": 1000000000,
 "ReaddirCache": false,
 "BackupMeta": 3600000000000,
 "BackupSkipTrash": false,
 "PrefixInternal": false,
 "HideInternal": false,
 "AllSquash": {
  "Uid": 1001,
  "Gid": 1001
 },
 "NonDefaultPermission": true,
 "UMask": 0,
 "Pid": 222,
 "PPid": 213,
 "CommPath": "/tmp/fuse_fd_comm.213",
 "StatePath": "/tmp/state213.json",
 "FuseOpts": {
  "AllowOther": true,
  "Options": [
   "nonempty",
   "default_permissions"
  ],
  "MaxBackground": 200,
  "MaxWrite": 0,
  "MaxReadAhead": 1048576,
  "IgnoreSecurityLabels": false,
  "RememberInodes": false,
  "FsName": "JuiceFS:pcs-ue6ju0nuiu0hz7tjc-0e3odv6t4dackr8s3",
  "Name": "juicefs",
  "SingleThreaded": false,
  "DisableXAttrs": true,
  "Debug": false,
  "EnableLocks": true,
  "EnableSymlinkCaching": true,
  "ExplicitDataCacheControl": false,
  "DirectMount": true,
  "DirectMountFlags": 0,
  "EnableAcl": false,
  "EnableWriteback": false,
  "DontUmask": true,
  "OtherCaps": 0,
  "NoAllocForRead": false,
  "Timeout": 900000000000
 }
}```

## 4. 📄 Страницы App Router (src/app/)

| Файл | Маршрут |
|------|---------|
| ./src/app/about/page.jsx | /about |
| ./src/app/questions/[slug]/page.jsx | /questions/[slug] |
| ./src/app/questions/ask/page.jsx | /questions/ask |
| ./src/app/questions/page.jsx | /questions |
| ./src/app/dictionary/page.jsx | /dictionary |
| ./src/app/page.jsx | / |

### Layout файлы
./src/app/layout.jsx

## 5. 🔌 API Routes (src/app/api/)

#### ./src/app/api/search/route.js
```javascript
// ============================================================
// API ROUTE: ПОИСК
// ============================================================
// Обрабатывает запросы к /api/search?q=запрос
// Ищет по ресурсам, терминам и категориям
// ============================================================

import { PrismaClient } from "@prisma/client";

const prisma = globalThis.__prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;

// GET /api/search?q=запрос
// request — объект запроса Next.js
export async function GET(request) {
  try {
    // Получаем URL из запроса
    const url = new URL(request.url);

    // Получаем параметр q из строки запроса (?q=запрос)
    const query = url.searchParams.get("q") || "";

    // Если запрос меньше 2 символов, возвращаем пустой результат
    if (query.length < 2) {
      return new Response(JSON.stringify({
        resources: [],
        terms: [],
        categories: [],
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ищем ресурсы
    // OR — условие "ИЛИ" в Prisma
    // contains — содержит подстроку (поиск)
    // mode: "insensitive" — без учёта регистра
    const resources = await prisma.resource.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        category: true, // Включаем категорию для отображения
      },
      take: 10, // Ограничиваем количество результатов
    });

    // Ищем термины
    const terms = await prisma.term.findMany({
      where: {
        OR: [
          { term: { contains: query, mode: "insensitive" } },
          { definition: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
    });

    // Ищем категории
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        _count: {
          select: { resources: true },
        },
      },
      take: 10,
    });

    // Возвращаем объединённый результат
    return new Response(JSON.stringify({
      resources,
      terms,
      categories,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error searching:", error);
    return new Response(JSON.stringify({ error: "Ошибка при поиске" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

#### ./src/app/api/tags/route.js
```javascript
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: { _count: { select: { questions: true } } },
      orderBy: { questionCount: "desc" }
    });

    return Response.json(tags);
  } catch (error) {
    return Response.json({ error: "Ошибка загрузки тегов" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, color, description } = await request.json();
    const { slugify } = await import("../../../lib/utils");

    const tag = await prisma.tag.create({
      data: {
        name,
        slug: slugify(name),
        color: color || "#3b82f6",
        description: description || null
      }
    });

    return Response.json(tag, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Ошибка создания тега" }, { status: 500 });
  }
}
```

#### ./src/app/api/terms/route.js
```javascript
// ============================================================
// API ROUTE: ТЕРМИНЫ
// ============================================================
// Обрабатывает запросы к /api/terms
// Поддерживает: GET (получить все) и POST (создать новый)
// ============================================================

import { PrismaClient } from "@prisma/client";

const prisma = globalThis.__prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;

// ------------------ GET /api/terms ------------------
export async function GET() {
  try {
    const terms = await prisma.term.findMany({
      orderBy: {
        term: "asc", // Сортировка по алфавиту
      },
    });

    return new Response(JSON.stringify(terms), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching terms:", error);
    return new Response(JSON.stringify({ error: "Ошибка при получении терминов" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ------------------ POST /api/terms ------------------
export async function POST(request) {
  try {
    const body = await request.json();
    const { term, definition, examples } = body;

    if (!term || !definition) {
      return new Response(JSON.stringify({ error: "Термин и определение обязательны" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newTerm = await prisma.term.create({
      data: {
        term,
        definition,
        // examples хранится как JSON-строка
        examples: examples ? JSON.stringify(examples) : null,
      },
    });

    return new Response(JSON.stringify(newTerm), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating term:", error);
    return new Response(JSON.stringify({ error: "Ошибка при создании термина" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

#### ./src/app/api/categories/route.js
```javascript
// ============================================================
// API ROUTE: КАТЕГОРИИ
// ============================================================
// Обрабатывает запросы к /api/categories
// Поддерживает: GET (получить все) и POST (создать новую)
// ============================================================

import { PrismaClient } from "@prisma/client";

const prisma = globalThis.__prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;

// ------------------ GET /api/categories ------------------
export async function GET() {
  try {
    // Получаем все категории с подсчётом ресурсов в каждой
    const categories = await prisma.category.findMany({
      include: {
        // _count — специальное поле Prisma для подсчёта связанных записей
        _count: {
          select: { resources: true }, // Считаем ресурсы в категории
        },
      },
      orderBy: {
        name: "asc", // Сортировка по имени (алфавит)
      },
    });

    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new Response(JSON.stringify({ error: "Ошибка при получении категорий" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ------------------ POST /api/categories ------------------
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, color } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: "Название обязательно" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description: description || null,
        color: color || "#64748b", // Цвет по умолчанию
      },
    });

    return new Response(JSON.stringify(category), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return new Response(JSON.stringify({ error: "Ошибка при создании категории" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

#### ./src/app/api/qa-seed/route.js
```javascript
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const existingQuestions = await prisma.question.count();
    if (existingQuestions > 0) {
      return Response.json({ message: "Q&A данные уже загружены" });
    }

    const user = await prisma.user.upsert({
      where: { email: "demo@ithub.local" },
      update: {},
      create: {
        email: "demo@ithub.local",
        name: "Демо Пользователь",
        reputation: 150,
        badge: "SILVER"
      }
    });

    const tagsData = [
      { name: "React", slug: "react", color: "#61dafb" },
      { name: "Next.js", slug: "nextjs", color: "#000000" },
      { name: "Prisma", slug: "prisma", color: "#2d3748" },
      { name: "TypeScript", slug: "typescript", color: "#3178c6" },
      { name: "Tailwind CSS", slug: "tailwindcss", color: "#06b6d4" },
      { name: "JavaScript", slug: "javascript", color: "#f7df1e" }
    ];

    for (const tag of tagsData) {
      await prisma.tag.upsert({ where: { name: tag.name }, update: {}, create: tag });
    }

    const q1 = await prisma.question.create({
      data: {
        title: "Как подключить Prisma к Next.js проекту?",
        slug: "kak-podkluchit-prisma-k-nextjs-proektu",
        body: "## Описание проблемы\n\nПытаюсь интегрировать Prisma ORM в существующий Next.js проект.",
        authorId: user.id,
        difficulty: "BEGINNER",
        voteCount: 15, views: 234, answerCount: 3, isAnswered: true,
        tags: {
          create: [
            { tag: { connect: { name: "Prisma" } } },
            { tag: { connect: { name: "Next.js" } } }
          ]
        }
      }
    });

    const q2 = await prisma.question.create({
      data: {
        title: "Ошибка AnimatePresence: two children with the same key",
        slug: "oshibka-animatepresence-two-children-with-the-same-key",
        body: "## Error Message\n\nEncountered two children with the same key",
        authorId: user.id, difficulty: "INTERMEDIATE",
        voteCount: 8, views: 156, answerCount: 2, isAnswered: true,
        tags: { create: [{ tag: { connect: { name: "React" } } }, { tag: { connect: { name: "Next.js" } } }] }
      }
    });

    const q3 = await prisma.question.create({
      data: {
        title: "Tailwind v4 vs v3 — какой выбрать?",
        slug: "tailwind-v4-vs-v3-kakoy-vybrat",
        body: "Начинаю новый проект на Next.js и вижу, что Tailwind выпустил версию 4.",
        authorId: user.id, difficulty: "BEGINNER",
        voteCount: 25, views: 445, answerCount: 5, isAnswered: false,
        tags: { create: [{ tag: { connect: { name: "Tailwind CSS" } } }] }
      }
    });

    const accepted = await prisma.answer.create({
      data: {
        body: "## Решение\n\n### Singleton паттерн\n\n```javascript\nimport { PrismaClient } from '@prisma/client'\nexport const prisma = globalThis.prisma || new PrismaClient()\n```",
        questionId: q1.id, authorId: user.id, isAccepted: true, voteCount: 12
      }
    });

    await prisma.question.update({ where: { id: q1.id }, data: { acceptedAnswerId: accepted.id } });

    return Response.json({ message: "Q&A данные созданы", questions: 3, answers: 1 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

#### ./src/app/api/questions/route.js
```javascript
import { prisma } from "@/lib/prisma";
import { slugify } from "../../../lib/utils";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "new";
    const tag = searchParams.get("tag");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const search = searchParams.get("q");

    const where = { status: "OPEN" };
    
    if (tag) {
      where.tags = { some: { tag: { slug: tag } } };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search,  } },
        { body: { contains: search,  } }
      ];
    }

    const orderBy = {
      new: { createdAt: "desc" },
      top: { voteCount: "desc" },
      active: { lastActivityAt: "desc" },
      unanswered: { answerCount: "asc" }
    }[sort] || { createdAt: "desc" };

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        orderBy,
        include: {
          author: { select: { id: true, name: true, avatar: true, reputation: true, badge: true } },
          tags: { include: { tag: true } },
          _count: { select: { answers: true, favorites: true } }
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.question.count({ where })
    ]);

    return Response.json({ questions, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return Response.json({ error: "Ошибка загрузки вопросов" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { title, body: questionBody, tags, categoryId, difficulty } = data;

    if (!title || !questionBody) {
      return Response.json({ error: "Заголовок и содержание обязательны" }, { status: 400 });
    }

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.question.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: `user-${Date.now()}@temp.local`, name: "Аноним" }
      });
    }

    const question = await prisma.question.create({
      data: {
        title,
        slug,
        body: questionBody,
        categoryId: categoryId || null,
        difficulty: difficulty || null,
        authorId: user.id,
        tags: {
          create: await Promise.all(
            (tags || []).map(async (tagName) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: { name: tagName, slug: slugify(tagName) }
                }
              }
            }))
          )
        }
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        tags: { include: { tag: true } }
      }
    });

    return Response.json(question, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return Response.json({ error: "Ошибка создания вопроса" }, { status: 500 });
  }
}
```

#### ./src/app/api/questions/[id]/route.js
```javascript
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const question = await prisma.question.findFirst({
      where: {
        OR: [
          { slug: id },
          { id: id }
        ]
      },
      include: {
        author: { select: { id: true, name: true, avatar: true, reputation: true, badge: true } },
        category: true,
        tags: { include: { tag: true } },
        images: { orderBy: { order: "asc" } },
        answers: {
          include: {
            author: { select: { id: true, name: true, avatar: true, reputation: true, badge: true } },
            images: { orderBy: { order: "asc" } },
            _count: { select: { votes: true } }
          },
          orderBy: [{ isAccepted: "desc" }, { voteCount: "desc" }, { createdAt: "asc" }]
        },
        _count: { select: { answers: true, favorites: true, votes: true } }
      }
    });

    if (!question) {
      return Response.json({ error: "Вопрос не найден" }, { status: 404 });
    }

    await prisma.question.update({
      where: { id: question.id },
      data: { views: { increment: 1 } }
    });

    return Response.json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    return Response.json({ error: "Ошибка загрузки вопроса" }, { status: 500 });
  }
}
```

#### ./src/app/api/questions/[id]/answers/route.js
```javascript
import { prisma } from "@/lib/prisma";

// POST /api/questions/[id]/answers - Добавить ответ
export async function POST(request, { params }) {
  try {
    const { id: questionId } = params;
    const { body } = await request.json();

    if (!body) {
      return Response.json({ error: "Содержание ответа обязательно" }, { status: 400 });
    }

    // Проверяем существование вопроса
    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      return Response.json({ error: "Вопрос не найден" }, { status: 404 });
    }

    // Временный пользователь
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: `user-${Date.now()}@temp.local`, name: "Аноним" }
      });
    }

    const answer = await prisma.answer.create({
      data: {
        body,
        questionId,
        authorId: user.id
      },
      include: {
        author: { select: { id: true, name: true, avatar: true, reputation: true } }
      }
    });

    // Обновляем счётчики
    await prisma.question.update({
      where: { id: questionId },
      data: {
        answerCount: { increment: 1 },
        lastActivityAt: new Date()
      }
    });

    return Response.json(answer, { status: 201 });
  } catch (error) {
    console.error("Error creating answer:", error);
    return Response.json({ error: "Ошибка создания ответа" }, { status: 500 });
  }
}
```

#### ./src/app/api/seed/route.js
```javascript
// ============================================================
// API ROUTE: SEED (ЗАПОЛНЕНИЕ БАЗЫ ТЕСТОВЫМИ ДАННЫМИ)
// ============================================================
// Этот маршрут заполняет базу данных начальными данными
// Вызывается при первом запуске приложения
// ============================================================

import { PrismaClient } from "@prisma/client";

const prisma = globalThis.__prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;

// GET /api/seed
export async function GET() {
  try {
    // Проверяем, есть ли уже категории
    const existingCategories = await prisma.category.count();

    // Если категории есть, не заполняем повторно
    if (existingCategories > 0) {
      return new Response(JSON.stringify({ message: "База уже заполнена" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Создаём категории
    const categories = await prisma.category.createMany({
      data: [
        { name: "Документация", color: "#3b82f6" },
        { name: "Инструменты", color: "#10b981" },
        { name: "Обучение", color: "#f59e0b" },
        { name: "Библиотеки", color: "#8b5cf6" },
        { name: "API", color: "#ec4899" },
        { name: "DevOps", color: "#ef4444" },
      ],
    });

    // Создаём ресурсы
    await prisma.resource.createMany({
      data: [
        {
          name: "React Documentation",
          description: "Официальная документация React — библиотеки для создания пользовательских интерфейсов",
          url: "https://react.dev",
          categoryId: 1,
        },
        {
          name: "Next.js",
          description: "Фреймворк React для создания полноценных веб-приложений",
          url: "https://nextjs.org",
          categoryId: 1,
        },
        {
          name: "VS Code",
          description: "Бесплатный редактор кода от Microsoft с множеством расширений",
          url: "https://code.visualstudio.com",
          categoryId: 2,
        },
        {
          name: "MDN Web Docs",
          description: "Документация по веб-технологиям от Mozilla",
          url: "https://developer.mozilla.org",
          categoryId: 3,
        },
        {
          name: "Tailwind CSS",
          description: "Utility-first CSS фреймворк для быстрой стилизации",
          url: "https://tailwindcss.com",
          categoryId: 4,
        },
        {
          name: "GitHub REST API",
          description: "REST API для работы с репозиториями GitHub",
          url: "https://docs.github.com/rest",
          categoryId: 5,
        },
        {
          name: "Docker",
          description: "Платформа для контейнеризации приложений",
          url: "https://docker.com",
          categoryId: 6,
        },
      ],
    });

    // Создаём термины
    await prisma.term.createMany({
      data: [
        {
          term: "API",
          definition: "Application Programming Interface — интерфейс для взаимодействия между программами. Позволяет приложениям обмениваться данными и функциями.",
          examples: JSON.stringify(["REST API для получения данных", "GraphQL API для гибких запросов"]),
        },
        {
          term: "REST",
          definition: "Representational State Transfer — архитектурный стиль для создания веб-сервисов. Использует HTTP методы (GET, POST, PUT, DELETE).",
          examples: JSON.stringify(["GET /users — получить список пользователей", "POST /users — создать пользователя"]),
        },
        {
          term: "CI/CD",
          definition: "Continuous Integration / Continuous Deployment — практика автоматической сборки, тестирования и развёртывания кода.",
          examples: JSON.stringify(["GitHub Actions для автоматического тестирования", "Автоматическое развёртывание при merge в main"]),
        },
        {
          term: "DOM",
          definition: "Document Object Model — объектная модель документа. Представляет HTML-страницу как дерево объектов, которым можно управлять через JavaScript.",
          examples: JSON.stringify(["document.getElementById() — найти элемент по ID", "element.appendChild() — добавить дочерний элемент"]),
        },
        {
          term: "JSON",
          definition: "JavaScript Object Notation — текстовый формат обмена данными. Легко читается людьми и парсится программами.",
          examples: JSON.stringify(['{"name": "IThub", "version": 1.0}', '[1, 2, 3, 4, 5]']),
        },
      ],
    });

    return new Response(JSON.stringify({
      message: "База данных успешно заполнена",
      categories: 6,
      resources: 7,
      terms: 5,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return new Response(JSON.stringify({ error: "Ошибка при заполнении базы" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

#### ./src/app/api/upload/route.js
```javascript
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "Файл не предоставлен" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json({ error: "Тип файла не поддерживается" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return Response.json({ error: "Файл слишком большой (макс. 5MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`;
    const dir = "./public/uploads/images";

    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);

    return Response.json({
      url: `/uploads/images/${filename}`,
      filename,
      size: file.size,
      mimeType: file.type
    });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Ошибка загрузки" }, { status: 500 });
  }
}
```

#### ./src/app/api/resources/route.js
```javascript
// ============================================================
// API ROUTE: РЕСУРСЫ
// ============================================================
// Этот файл обрабатывает HTTP запросы к /api/resources
// Поддерживает: GET (получить все) и POST (создать новый)
// ============================================================

// Импортируем Prisma Client для работы с базой данных
import { PrismaClient } from "@prisma/client";

// Создаём экземпляр Prisma Client
// globalThis.__prisma — паттерн для предотвращения создания
// множества соединений при горячей перезагрузке в development
const prisma = globalThis.__prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;

// ------------------ GET /api/resources ------------------
// Получение списка всех ресурсов
// export async function GET — обработчик GET-запросов
export async function GET() {
  try {
    // prisma.resource.findMany — получение всех записей из таблицы resources
    // include — включить связанные данные (категорию)
    // orderBy — сортировка по дате создания (новые первыми)
    const resources = await prisma.resource.findMany({
      include: {
        category: true, // Включить связанную категорию
      },
      orderBy: {
        createdAt: "desc", // Сортировка по убыванию даты
      },
    });

    // Возвращаем JSON-ответ со статусом 200 (OK)
    return new Response(JSON.stringify(resources), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Логируем ошибку для отладки
    console.error("Error fetching resources:", error);

    // Возвращаем ошибку со статусом 500 (Internal Server Error)
    return new Response(JSON.stringify({ error: "Ошибка при получении ресурсов" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ------------------ POST /api/resources ------------------
// Создание нового ресурса
// export async function POST — обработчик POST-запросов
// request — объект запроса с телом и метаданными
export async function POST(request) {
  try {
    // Получаем тело запроса и парсим JSON
    const body = await request.json();

    // Деструктурируем поля из тела запроса
    const { name, description, url, categoryId, tags } = body;

    // Валидация обязательных полей
    if (!name || !description || !categoryId) {
      return new Response(JSON.stringify({ error: "Заполните обязательные поля" }), {
        status: 400, // Bad Request
        headers: { "Content-Type": "application/json" },
      });
    }

    // prisma.resource.create — создание новой записи
    // data — данные для создания
    const resource = await prisma.resource.create({
      data: {
        name,          // Название ресурса
        description,   // Описание
        url: url || null, // URL (null если не указан)
        categoryId,    // ID категории
        // JSON.stringify преобразует массив в строку JSON для хранения
        tags: tags ? JSON.stringify(tags) : null,
      },
    });

    // Возвращаем созданный ресурс со статусом 201 (Created)
    return new Response(JSON.stringify(resource), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating resource:", error);

    return new Response(JSON.stringify({ error: "Ошибка при создании ресурса" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

## 6. 🎨 Стили

### globals.css
```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.625rem;
  --background: #faf9f7;
  --foreground: #1c1917;
  --card: #ffffff;
  --card-foreground: #1c1917;
  --popover: #ffffff;
  --popover-foreground: #1c1917;
  --primary: #be123c;
  --primary-foreground: #ffffff;
  --secondary: #f5f4f2;
  --secondary-foreground: #1c1917;
  --muted: #f5f4f2;
  --muted-foreground: #78716c;
  --accent: rgba(190, 18, 60, 0.08);
  --accent-foreground: #be123c;
  --destructive: #dc2626;
  --border: rgba(0, 0, 0, 0.06);
  --input: rgba(0, 0, 0, 0.06);
  --ring: #be123c;
  --chart-1: #be123c;
  --chart-2: #f59e0b;
  --chart-3: #10b981;
  --chart-4: #3b82f6;
  --chart-5: #8b5cf6;
}

.dark {
  --background: #0a0a0f;
  --foreground: #f8fafc;
  --card: #18181b;
  --card-foreground: #f8fafc;
  --popover: #18181b;
  --popover-foreground: #f8fafc;
  --primary: #f43f5e;
  --primary-foreground: #ffffff;
```

## 7. 💻 Примеры и утилиты

### WebSocket примеры
### Design Prototypes
## 8. 📊 Статистика

```
```

---
*Генерация: Вт 19 мая 2026 20:31:12 MSK*
