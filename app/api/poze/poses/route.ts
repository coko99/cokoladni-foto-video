import { NextResponse } from "next/server";
import { loadActiveCatalog } from "@/lib/wedding-poses/db";
import { requirePozeAccessFromRequest } from "@/lib/wedding-poses/access-pin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!requirePozeAccessFromRequest(request)) {
    return NextResponse.json({ error: "Unesite PIN za pristup izboru poza." }, { status: 403 });
  }
  try {
    const catalog = await loadActiveCatalog();
    return NextResponse.json(catalog);
  } catch (error) {
    console.error("Load poses catalog:", error);
    return NextResponse.json({ error: "Učitavanje nije uspelo." }, { status: 500 });
  }
}
