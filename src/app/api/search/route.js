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
