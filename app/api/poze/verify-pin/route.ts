import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  isValidPozePin,
  POZE_ACCESS_COOKIE,
  pozeAccessCookieOptions,
} from "@/lib/wedding-poses/access-pin";
import { checkRateLimit, clientIp } from "@/lib/wedding-poses/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limited = checkRateLimit(`poze-pin:${ip}`, 12, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Previše pokušaja. Sačekajte minut." },
      { status: 429 }
    );
  }

  let body: { pin?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Unesite PIN." }, { status: 400 });
  }

  const pin = String(body.pin ?? "").trim();
  if (!pin) {
    return NextResponse.json({ error: "Unesite PIN." }, { status: 400 });
  }

  if (!isValidPozePin(pin)) {
    return NextResponse.json({ error: "Pogrešan PIN." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(POZE_ACCESS_COOKIE, "1", pozeAccessCookieOptions());

  return NextResponse.json({ ok: true });
}
