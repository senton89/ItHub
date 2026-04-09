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
