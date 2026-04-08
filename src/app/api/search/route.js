import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Global search across resources, terms, and categories
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ resources: [], terms: [], categories: [] });
    }

    const searchTerm = query.trim();

    // Search resources (case-insensitive search in SQLite)
    const resources = await db.resource.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm } },
          { description: { contains: searchTerm } },
        ],
      },
      include: {
        category: true,
      },
      take: 5,
    });

    // Search terms
    const terms = await db.term.findMany({
      where: {
        OR: [
          { term: { contains: searchTerm } },
          { definition: { contains: searchTerm } },
        ],
      },
      take: 5,
    });

    // Search categories
    const categories = await db.category.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm } },
          { description: { contains: searchTerm } },
        ],
      },
      include: {
        _count: {
          select: { resources: true },
        },
      },
      take: 3,
    });

    return NextResponse.json({ resources, terms, categories });
  } catch (error) {
    console.error("Error in search:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
