import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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

// POST create new category
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, color, icon } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check if slug already exists
    const existing = await db.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 });
    }

    // Get max order
    const maxOrder = await db.category.aggregate({
      _max: { order: true },
    });

    const category = await db.category.create({
      data: {
        name,
        slug,
        description: description || null,
        color: color || "#64748b",
        icon: icon || null,
        order: (maxOrder._max.order || 0) + 1,
      },
      include: {
        _count: {
          select: { resources: true },
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
