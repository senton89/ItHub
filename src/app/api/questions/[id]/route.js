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
