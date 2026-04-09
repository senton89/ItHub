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
