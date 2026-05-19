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
