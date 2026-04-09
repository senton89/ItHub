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
