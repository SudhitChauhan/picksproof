import { NextResponse, type NextRequest } from "next/server";
import { getRequestLocation } from "@/lib/geo/get-request-location";

export async function GET(request: NextRequest) {
  const location = await getRequestLocation(request);
  return NextResponse.json({ location });
}
