import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "newest";
    const tag = searchParams.get("tag");
    const q = searchParams.get("q");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 20;

    const where = { status: "OPEN" };

    if (tag) {
      where.tags = { some: { tag: { slug: tag } } };
    }
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { body: { contains: q } },
      ];
    }

    const orderBy = {
      newest: { createdAt: "desc" },
      popular: { voteCount: "desc" },
      unanswered: { answerCount: "asc" },
    }[sort] || { createdAt: "desc" };

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          tags: { include: { tag: true } },
        },
      }),
      prisma.question.count({ where }),
    ]);

    return NextResponse.json({
      questions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/questions error:", error);
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
    }

    const body = await request.json();
    const { title, body: questionBody, tags, difficulty } = body;

    if (!title || !questionBody) {
      return NextResponse.json({ error: "Заголовок и текст обязательны" }, { status: 400 });
    }

    const slug = title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-zа-яё0-9-]/g, "");

    const tagConnections = Array.isArray(tags)
      ? tags.map((tagName) => {
          const tagSlug = tagName.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-zа-яё0-9-]/g, "");
          return {
            tag: {
              connectOrCreate: {
                where: { slug: tagSlug },
                create: {
                  name: tagName.trim(),
                  slug: tagSlug,
                },
              },
            },
          };
        })
      : [];

    const question = await prisma.question.create({
      data: {
        title: title.trim(),
        slug,
        body: questionBody.trim(),
        difficulty: difficulty || "BEGINNER",
        status: "OPEN",
        authorId: session.user.id,
        tags: { create: tagConnections },
      },
      include: { tags: { include: { tag: true } } },
    });

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error("POST /api/questions error:", error);
    return NextResponse.json({ error: "Ошибка при создании" }, { status: 500 });
  }
}
