import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET all categories with resource counts
export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: { resources: true },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
