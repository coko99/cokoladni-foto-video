import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  findSubmissionByToken,
  loadActiveCatalog,
  loadSubmissionSelections,
} from "@/lib/wedding-poses/db";
import { validateCoupleForm } from "@/lib/wedding-poses/validation";
import { checkRateLimit, clientIp } from "@/lib/wedding-poses/rate-limit";
import { requirePozeAccessFromRequest } from "@/lib/wedding-poses/access-pin";

export const runtime = "nodejs";

type Params = { params: Promise<{ token: string }> };

export async function GET(request: Request, { params }: Params) {
  if (!requirePozeAccessFromRequest(request)) {
    return NextResponse.json({ error: "Unesite PIN za pristup izboru poza." }, { status: 403 });
  }
  try {
    const { token } = await params;
    const submission = await findSubmissionByToken(token);
    if (!submission) {
      return NextResponse.json({ error: "Link nije validan ili je istekao." }, { status: 404 });
    }

    const [catalog, selections] = await Promise.all([
      loadActiveCatalog(),
      loadSubmissionSelections(submission.id),
    ]);

    const selectionMap = Object.fromEntries(
      selections.map((s) => [s.pose_id, s.state])
    );

    return NextResponse.json({
      submission,
      categories: catalog.categories,
      poses: catalog.poses,
      selections: selectionMap,
    });
  } catch (error) {
    console.error("GET poze izbor:", error);
    return NextResponse.json({ error: "Učitavanje nije uspelo." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  if (!requirePozeAccessFromRequest(request)) {
    return NextResponse.json({ error: "Unesite PIN za pristup izboru poza." }, { status: 403 });
  }
  const ip = clientIp(request);
  const limited = checkRateLimit(`poze-patch:${ip}`, 40, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Previše zahteva." }, { status: 429 });
  }

  try {
    const { token } = await params;
    const submission = await findSubmissionByToken(token);
    if (!submission) {
      return NextResponse.json({ error: "Link nije validan." }, { status: 404 });
    }

    const body = await request.json();
    const parsed = validateCoupleForm(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from("wedding_pose_submissions")
      .update({
        bride_name: parsed.data.brideName,
        groom_name: parsed.data.groomName,
        wedding_date: parsed.data.weddingDate,
        city: parsed.data.city,
        shoot_location: parsed.data.shootLocation,
        celebration_venue: parsed.data.celebrationVenue ?? null,
        note: parsed.data.note ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", submission.id);

    if (error) {
      return NextResponse.json({ error: "Čuvanje podataka nije uspelo." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH poze izbor:", error);
    return NextResponse.json({ error: "Došlo je do greške." }, { status: 500 });
  }
}
