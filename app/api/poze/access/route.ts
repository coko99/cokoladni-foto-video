import { NextResponse } from "next/server";
import { hasPozeAccess } from "@/lib/wedding-poses/access-pin";

export const runtime = "nodejs";

export async function GET() {
  const ok = await hasPozeAccess();
  return NextResponse.json({ ok });
}
