import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
    }

    // Проверяем что пользователь существует (защита от устаревших сессий)
    const userExists = await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true } });
    if (!userExists) {
      return NextResponse.json({ error: "Сессия устарела, перелогиньтесь" }, { status: 401 });
    }

    const { targetType, targetId, voteType } = await request.json();

    if (!["question", "answer"].includes(targetType) || !targetId || !["UP", "DOWN"].includes(voteType)) {
      return NextResponse.json({ error: "Неверные параметры" }, { status: 400 });
    }

    // Для вопросов: поддерживаем и slug, и real ID
    let realTargetId = targetId;
    if (targetType === "question") {
      const q = await prisma.question.findFirst({
        where: { OR: [{ id: targetId }, { slug: targetId }] },
        select: { id: true },
      });
      if (!q) return NextResponse.json({ error: "Не найден" }, { status: 404 });
      realTargetId = q.id;
    }

    const whereFilter = { userId: session.user.id, [`${targetType}Id`]: realTargetId };
    const existing = await prisma.vote.findFirst({ where: whereFilter });

    if (existing) {
      if (existing.type === voteType) {
        await prisma.vote.delete({ where: { id: existing.id } });
      } else {
        await prisma.vote.update({ where: { id: existing.id }, data: { type: voteType } });
      }
    } else {
      await prisma.vote.create({
        data: {
          type: voteType,
          userId: session.user.id,
          [`${targetType}Id`]: realTargetId,
        },
      });
    }

    const upvotes = await prisma.vote.count({ where: { [`${targetType}Id`]: realTargetId, type: "UP" } });
    const downvotes = await prisma.vote.count({ where: { [`${targetType}Id`]: realTargetId, type: "DOWN" } });
    const voteCount = upvotes - downvotes;

    await prisma[targetType].update({
      where: { id: realTargetId },
      data: { voteCount },
    });

    const userVote = await prisma.vote.findFirst({ where: whereFilter });

    return NextResponse.json({ voteCount, userVoteType: userVote?.type || null });
  } catch (error) {
    console.error("POST /api/votes error:", error);
    return NextResponse.json({ error: "Ошибка голосования" }, { status: 500 });
  }
}
