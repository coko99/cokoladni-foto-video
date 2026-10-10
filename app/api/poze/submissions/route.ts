import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateCoupleForm } from "@/lib/wedding-poses/validation";
import { generateAccessToken, hashAccessToken, defaultTokenExpiry } from "@/lib/wedding-poses/token";
import { checkRateLimit, clientIp } from "@/lib/wedding-poses/rate-limit";
import { getSiteUrl } from "@/lib/env";
import { requirePozeAccessFromRequest } from "@/lib/wedding-poses/access-pin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!requirePozeAccessFromRequest(request)) {
    return NextResponse.json({ error: "Unesite PIN za pristup izboru poza." }, { status: 403 });
  }

  const ip = clientIp(request);
  const limited = checkRateLimit(`poze-create:${ip}`, 8, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Previše zahteva. Pokušajte ponovo za nekoliko sekundi." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = validateCoupleForm(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const token = generateAccessToken();
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("wedding_pose_submissions")
      .insert({
        access_token_hash: hashAccessToken(token),
        bride_name: parsed.data.brideName,
        groom_name: parsed.data.groomName,
        wedding_date: parsed.data.weddingDate,
        city: parsed.data.city,
        shoot_location: parsed.data.shootLocation,
        celebration_venue: parsed.data.celebrationVenue ?? null,
        note: parsed.data.note ?? null,
        token_expires_at: defaultTokenExpiry(),
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Create submission:", error);
      const missingTable =
        error?.code === "PGRST205" ||
        error?.message?.includes("Could not find the table");
      return NextResponse.json(
        {
          error: missingTable
            ? "Baza nije spremna. Pokreni supabase/migration-wedding-poses.sql u Supabase SQL Editoru (ili npm run db:migrate)."
            : "Kreiranje prijave nije uspelo.",
        },
        { status: 500 }
      );
    }

    const continueUrl = `${getSiteUrl()}/poze/izbor/${token}`;
    return NextResponse.json({
      submissionId: data.id,
      token,
      continueUrl,
    });
  } catch (error) {
    console.error("POST poze submissions:", error);
    return NextResponse.json({ error: "Došlo je do greške." }, { status: 500 });
  }
}
