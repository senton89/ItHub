import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";
    const showAll = searchParams.get("all") === "true";

    const where = isAdmin && showAll ? {} : { status: "APPROVED" };

    const terms = await prisma.term.findMany({
      where,
      orderBy: { term: "asc" },
      include: { category: { select: { name: true } } },
    });
    return NextResponse.json(terms);
  } catch (error) {
    console.error("GET /api/terms error:", error);
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
    const { term, definition, examples, categoryId } = body;

    if (!term || !definition) {
      return NextResponse.json({ error: "Термин и определение обязательны" }, { status: 400 });
    }

    const slug = term.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-zа-яё0-9-]/g, "");

    const existing = await prisma.term.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Такой термин уже существует" }, { status: 409 });
    }

    const isAdmin = session.user.role === "ADMIN";

    const newTerm = await prisma.term.create({
      data: {
        term: term.trim(),
        slug,
        definition: definition.trim(),
        examples: examples?.trim() || null,
        categoryId: categoryId || null,
        status: isAdmin ? "APPROVED" : "PENDING",
      },
    });

    return NextResponse.json(
      { message: isAdmin ? "Термин добавлен" : "Термин отправлен на модерацию", term: newTerm },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/terms error:", error);
    return NextResponse.json({ error: "Ошибка при создании" }, { status: 500 });
  }
}
