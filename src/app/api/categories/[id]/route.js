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
    const { name, description, color, status } = body;

    const data = {};
    if (description !== undefined) data.description = description.trim() || null;
    if (color) data.color = color;
    if (status) data.status = status;

    if (name) {
      data.name = name.trim();
      data.slug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-zа-яё0-9-]/g, "");
    }

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("PUT category error:", error);
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

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ message: "Категория удалена" });
  } catch (error) {
    console.error("DELETE category error:", error);
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}
