import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET all terms
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const where = {};
    
    if (search) {
      where.OR = [
        { term: { contains: search, mode: "insensitive" } },
        { definition: { contains: search, mode: "insensitive" } },
      ];
    }

    const terms = await db.term.findMany({
      where,
      orderBy: { term: "asc" },
    });

    return NextResponse.json(terms);
  } catch (error) {
    console.error("Error fetching terms:", error);
    return NextResponse.json({ error: "Failed to fetch terms" }, { status: 500 });
  }
}

// POST create new term
export async function POST(request) {
  try {
    const body = await request.json();
    const { term, definition, examples } = body;

    if (!term || !definition) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slug = term
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newTerm = await db.term.create({
      data: {
        term,
        slug,
        definition,
        examples: examples ? JSON.stringify(examples) : null,
      },
    });

    return NextResponse.json(newTerm);
  } catch (error) {
    console.error("Error creating term:", error);
    return NextResponse.json({ error: "Failed to create term" }, { status: 500 });
  }
}
