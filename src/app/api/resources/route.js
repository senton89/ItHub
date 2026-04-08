import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET all resources
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    const where = {};
    
    if (category) {
      where.categoryId = category;
    }
    
    if (featured === "true") {
      where.isFeatured = true;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const resources = await db.resource.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: [
        { isFeatured: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

// POST create new resource
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, url, categoryId, tags } = body;

    if (!name || !description || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const resource = await db.resource.create({
      data: {
        name,
        slug,
        description,
        url: url || null,
        categoryId,
        tags: tags ? JSON.stringify(tags) : null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}
