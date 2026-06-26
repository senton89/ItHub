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
    const { name, description, url, categoryId, tags, isFeatured, status } = body;

    const data = {};
    if (description) data.description = description.trim();
    if (url !== undefined) data.url = url?.trim() || null;
    if (categoryId !== undefined) data.categoryId = categoryId || null;
    if (tags !== undefined) data.tags = tags || null;
    if (isFeatured !== undefined) data.isFeatured = isFeatured;
    if (status) data.status = status;

    if (name) {
      data.name = name.trim();
      data.slug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-zа-яё0-9-]/g, "");
    }

    const resource = await prisma.resource.update({
      where: { id: id },
      data,
    });

    return NextResponse.json({ resource });
  } catch (error) {
    console.error("PUT resource error:", error);
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

    await prisma.resource.delete({ where: { id: id } });

    return NextResponse.json({ message: "Ресурс удалён" });
  } catch (error) {
    console.error("DELETE resource error:", error);
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}
