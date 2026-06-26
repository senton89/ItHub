import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const question = await prisma.question.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        answers: {
          orderBy: [{ isAccepted: "desc" }, { voteCount: "desc" }],
          include: { author: { select: { id: true, name: true, avatar: true } } },
        },
        tags: { include: { tag: true } },
        _count: { select: { answers: true } },
      },
    });

    if (!question) {
      return NextResponse.json({ error: "Не найден" }, { status: 404 });
    }

    await prisma.question.update({
      where: { id: question.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ ...question, views: question.views + 1 });
  } catch (error) {
    console.error("GET question error:", error);
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
    }

    const question = await prisma.question.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true, authorId: true },
    });

    if (!question) {
      return NextResponse.json({ error: "Вопрос не найден" }, { status: 404 });
    }

    const isAdmin = session.user.role === "ADMIN";
    if (!isAdmin && question.authorId !== session.user.id) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    await prisma.answerComment.deleteMany({ where: { answer: { questionId: question.id } } });
    await prisma.vote.deleteMany({ where: { questionId: question.id } });
    await prisma.vote.deleteMany({ where: { answer: { questionId: question.id } } });
    await prisma.answerImage.deleteMany({ where: { answer: { questionId: question.id } } });
    await prisma.questionImage.deleteMany({ where: { questionId: question.id } });
    await prisma.questionTag.deleteMany({ where: { questionId: question.id } });
    await prisma.answer.deleteMany({ where: { questionId: question.id } });
    await prisma.question.delete({ where: { id: question.id } });

    return NextResponse.json({ message: "Вопрос удалён" });
  } catch (error) {
    console.error("DELETE question error:", error);
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}
