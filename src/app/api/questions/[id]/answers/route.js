import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const question = await prisma.question.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true },
    });
    if (!question) {
      return NextResponse.json({ error: "Вопрос не найден" }, { status: 404 });
    }

    const answers = await prisma.answer.findMany({
      where: { questionId: question.id },
      orderBy: [{ isAccepted: "desc" }, { voteCount: "desc" }, { createdAt: "asc" }],
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
    });
    return NextResponse.json(answers);
  } catch (error) {
    console.error("GET answers error:", error);
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
    }

    const question = await prisma.question.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true },
    });
    if (!question) {
      return NextResponse.json({ error: "Вопрос не найден" }, { status: 404 });
    }

    const { body } = await request.json();

    if (!body || !body.trim()) {
      return NextResponse.json({ error: "Текст ответа обязателен" }, { status: 400 });
    }

    const answer = await prisma.answer.create({
      data: {
        body: body.trim(),
        questionId: question.id,
        authorId: session.user.id,
      },
    });

    await prisma.question.update({
      where: { id: question.id },
      data: { answerCount: { increment: 1 } },
    });

    return NextResponse.json({ answer }, { status: 201 });
  } catch (error) {
    console.error("POST answer error:", error);
    return NextResponse.json({ error: "Ошибка при создании" }, { status: 500 });
  }
}
