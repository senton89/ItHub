import { prisma } from "@/lib/prisma";
import { slugify } from "../../../lib/utils";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "new";
    const tag = searchParams.get("tag");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const search = searchParams.get("q");

    const where = { status: "OPEN" };
    
    if (tag) {
      where.tags = { some: { tag: { slug: tag } } };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search,  } },
        { body: { contains: search,  } }
      ];
    }

    const orderBy = {
      new: { createdAt: "desc" },
      top: { voteCount: "desc" },
      active: { lastActivityAt: "desc" },
      unanswered: { answerCount: "asc" }
    }[sort] || { createdAt: "desc" };

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        orderBy,
        include: {
          author: { select: { id: true, name: true, avatar: true, reputation: true, badge: true } },
          tags: { include: { tag: true } },
          _count: { select: { answers: true, favorites: true } }
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.question.count({ where })
    ]);

    return Response.json({ questions, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return Response.json({ error: "Ошибка загрузки вопросов" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { title, body: questionBody, tags, categoryId, difficulty } = data;

    if (!title || !questionBody) {
      return Response.json({ error: "Заголовок и содержание обязательны" }, { status: 400 });
    }

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.question.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: `user-${Date.now()}@temp.local`, name: "Аноним" }
      });
    }

    const question = await prisma.question.create({
      data: {
        title,
        slug,
        body: questionBody,
        categoryId: categoryId || null,
        difficulty: difficulty || null,
        authorId: user.id,
        tags: {
          create: await Promise.all(
            (tags || []).map(async (tagName) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: { name: tagName, slug: slugify(tagName) }
                }
              }
            }))
          )
        }
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        tags: { include: { tag: true } }
      }
    });

    return Response.json(question, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return Response.json({ error: "Ошибка создания вопроса" }, { status: 500 });
  }
}
