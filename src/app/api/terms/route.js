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
