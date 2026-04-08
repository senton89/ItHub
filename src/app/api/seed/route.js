import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Seed initial data
export async function GET() {
  try {
    // Check if data already exists
    const existingCategories = await db.category.count();
    
    if (existingCategories > 0) {
      return NextResponse.json({ message: "Database already seeded" });
    }

    // Create categories
    await db.category.createMany({
      data: [
        { id: "cat_1", name: "Разработка", slug: "development", color: "#3b82f6", icon: "code", order: 1 },
        { id: "cat_2", name: "DevOps", slug: "devops", color: "#10b981", icon: "server", order: 2 },
        { id: "cat_3", name: "Дизайн", slug: "design", color: "#f59e0b", icon: "palette", order: 3 },
        { id: "cat_4", name: "Обучение", slug: "learning", color: "#ef4444", icon: "book", order: 4 },
        { id: "cat_5", name: "Инструменты", slug: "tools", color: "#8b5cf6", icon: "wrench", order: 5 },
        { id: "cat_6", name: "Документация", slug: "docs", color: "#06b6d4", icon: "file-text", order: 6 },
      ]
    });

    // Create resources
    await db.resource.createMany({
      data: [
        {
          id: "res_1",
          name: "GitHub",
          slug: "github",
          description: "Платформа для хостинга Git-репозиториев и совместной разработки. Включает инструменты для code review, управления проектами и CI/CD.",
          url: "https://github.com",
          categoryId: "cat_1",
          tags: JSON.stringify(["git", "collaboration", "open-source"]),
          isFeatured: true,
        },
        {
          id: "res_2",
          name: "Visual Studio Code",
          slug: "vscode",
          description: "Бесплатный редактор кода с богатой экосистемой расширений. Поддерживает отладку, Git и IntelliSense для множества языков.",
          url: "https://code.visualstudio.com",
          categoryId: "cat_5",
          tags: JSON.stringify(["editor", "ide", "microsoft"]),
          isFeatured: true,
        },
        {
          id: "res_3",
          name: "Docker",
          slug: "docker",
          description: "Платформа контейнеризации для разработки, доставки и запуска приложений. Упрощает управление зависимостями и деплой.",
          url: "https://docker.com",
          categoryId: "cat_2",
          tags: JSON.stringify(["containers", "devops", "deployment"]),
          isFeatured: true,
        },
        {
          id: "res_4",
          name: "Figma",
          slug: "figma",
          description: "Коллаборативный инструмент для UI/UX дизайна и прототипирования. Работает в браузере с возможностью одновременного редактирования.",
          url: "https://figma.com",
          categoryId: "cat_3",
          tags: JSON.stringify(["design", "ui/ux", "prototyping"]),
          isFeatured: true,
        },
        {
          id: "res_5",
          name: "MDN Web Docs",
          slug: "mdn",
          description: "Исчерпывающая документация по веб-технологиям: HTML, CSS, JavaScript, Web API и инструменты разработчика.",
          url: "https://developer.mozilla.org",
          categoryId: "cat_6",
          tags: JSON.stringify(["documentation", "web", "javascript"]),
          isFeatured: true,
        },
        {
          id: "res_6",
          name: "Stack Overflow",
          slug: "stackoverflow",
          description: "Крупнейшее сообщество разработчиков для вопросов и ответов по программированию.",
          url: "https://stackoverflow.com",
          categoryId: "cat_4",
          tags: JSON.stringify(["qa", "community", "help"]),
          isFeatured: false,
        },
      ]
    });

    // Create terms
    await db.term.createMany({
      data: [
        {
          id: "term_1",
          term: "API",
          slug: "api",
          definition: "Application Programming Interface — интерфейс программирования приложений. Набор правил и протоколов для взаимодействия между программными компонентами.",
          examples: JSON.stringify(["REST API", "GraphQL API", "Web API"]),
        },
        {
          id: "term_2",
          term: "CI/CD",
          slug: "ci-cd",
          definition: "Continuous Integration / Continuous Delivery — непрерывная интеграция и доставка. Практики автоматизации сборки, тестирования и развёртывания.",
          examples: JSON.stringify(["GitHub Actions", "GitLab CI", "Jenkins"]),
        },
        {
          id: "term_3",
          term: "REST",
          slug: "rest",
          definition: "Representational State Transfer — архитектурный стиль для распределённых систем. Использует HTTP-методы для операций над ресурсами.",
          examples: JSON.stringify(["GET /users", "POST /users", "PUT /users/1"]),
        },
        {
          id: "term_4",
          term: "SDK",
          slug: "sdk",
          definition: "Software Development Kit — комплект инструментов для разработки. Включает библиотеки, документацию и примеры кода.",
          examples: JSON.stringify(["Android SDK", "iOS SDK", "AWS SDK"]),
        },
      ]
    });

    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully"
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
