import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";
    const showAll = searchParams.get("all") === "true";

    const categories = await prisma.category.findMany({
      where: isAdmin && showAll ? {} : { status: "APPROVED" },
      orderBy: { order: "asc" },
      include: { _count: { select: { resources: true } } },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/categories error:", error);
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
    const { name, description, color } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Название обязательно (мин. 2 символа)" }, { status: 400 });
    }

    const slug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-zа-яё0-9-]/g, "");

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Категория с таким названием уже существует" }, { status: 409 });
    }

    const isAdmin = session.user.id === "admin" || false;

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        color: color || "#6366f1",
        status: isAdmin ? "APPROVED" : "PENDING",
      },
    });

    return NextResponse.json(
      { message: isAdmin ? "Категория создана" : "Категория отправлена на модерацию", category },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json({ error: "Ошибка при создании" }, { status: 500 });
  }
}
