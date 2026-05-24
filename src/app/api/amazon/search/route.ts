import { NextResponse } from "next/server";
import { searchAmazonProducts } from "@/lib/amazon";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() || "best laptop";

  try {
    const results = await searchAmazonProducts(query);
    return NextResponse.json({
      query,
      source: process.env.AMAZON_ACCESS_KEY ? "amazon-paapi" : "mock",
      results
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Amazon search failed"
      },
      { status: 502 }
    );
  }
}
