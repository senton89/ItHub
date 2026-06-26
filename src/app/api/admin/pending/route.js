import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const [categories, resources] = await Promise.all([
      prisma.category.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
      }),
      prisma.resource.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
    ]);

    return NextResponse.json({ categories, resources });
  } catch (error) {
    console.error("GET /api/admin/pending error:", error);
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 });
  }
}
