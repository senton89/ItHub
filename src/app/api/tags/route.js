import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: { _count: { select: { questions: true } } },
      orderBy: { questionCount: "desc" }
    });

    return Response.json(tags);
  } catch (error) {
    return Response.json({ error: "Ошибка загрузки тегов" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, color, description } = await request.json();
    const { slugify } = await import("../../../lib/utils");

    const tag = await prisma.tag.create({
      data: {
        name,
        slug: slugify(name),
        color: color || "#3b82f6",
        description: description || null
      }
    });

    return Response.json(tag, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Ошибка создания тега" }, { status: 500 });
  }
}
