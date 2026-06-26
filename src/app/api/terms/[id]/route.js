import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const body = await request.json();
    const { term, definition, examples, categoryId, status } = body;

    const data = {};
    if (definition) data.definition = definition.trim();
    if (examples !== undefined) data.examples = examples?.trim() || null;
    if (categoryId !== undefined) data.categoryId = categoryId || null;
    if (status) data.status = status;

    if (term) {
      data.term = term.trim();
      data.slug = term.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-zа-яё0-9-]/g, "");
    }

    const updated = await prisma.term.update({
      where: { id: id },
      data,
    });

    return NextResponse.json({ term: updated });
  } catch (error) {
    console.error("PUT term error:", error);
    return NextResponse.json({ error: "Ошибка обновления" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    await prisma.term.delete({ where: { id: id } });

    return NextResponse.json({ message: "Термин удалён" });
  } catch (error) {
    console.error("DELETE term error:", error);
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}
