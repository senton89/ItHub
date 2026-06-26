import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  const { type, id } = await params;
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }
    const { action } = await request.json();

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Неверное действие" }, { status: 400 });
    }

    if (!["category", "resource"].includes(type)) {
      return NextResponse.json({ error: "Неверный тип" }, { status: 400 });
    }

    if (action === "reject") {
      await prisma[type].delete({ where: { id } });
      return NextResponse.json({ message: "Удалено" });
    }

    await prisma[type].update({
      where: { id },
      data: { status: "APPROVED" },
    });

    return NextResponse.json({ message: "Одобрено" });
  } catch (error) {
    console.error("PATCH /api/admin/action error:", error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}
