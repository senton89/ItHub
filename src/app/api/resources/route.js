import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";
    const showAll = searchParams.get("all") === "true";
    const where = isAdmin && showAll ? {} : { status: "APPROVED" };
    if (categoryId) where.categoryId = categoryId;

    const resources = await prisma.resource.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { viewCount: "desc" }],
      include: { category: true },
    });
    return NextResponse.json(resources);
  } catch (error) {
    console.error("GET /api/resources error:", error);
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
    const { name, description, url, categoryId, tags } = body;

    if (!name || !description) {
      return NextResponse.json({ error: "Название и описание обязательны" }, { status: 400 });
    }

    const slug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-zа-яё0-9-]/g, "");

    const existing = await prisma.resource.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Ресурс с таким названием уже существует" }, { status: 409 });
    }

    const isAdmin = session.user.id === "admin" || false;

    const resource = await prisma.resource.create({
      data: {
        name: name.trim(),
        slug,
        description: description.trim(),
        url: url?.trim() || null,
        categoryId: categoryId || null,
        tags: tags || null,
        status: isAdmin ? "APPROVED" : "PENDING",
      },
    });

    return NextResponse.json(
      { message: isAdmin ? "Ресурс добавлен" : "Ресурс отправлен на модерацию", resource },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/resources error:", error);
    return NextResponse.json({ error: "Ошибка при создании" }, { status: 500 });
  }
}
