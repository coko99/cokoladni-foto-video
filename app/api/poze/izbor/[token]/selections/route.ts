import { NextResponse } from "next/server";
import { findSubmissionByToken, upsertSelections } from "@/lib/wedding-poses/db";
import { parseSelectionState } from "@/lib/wedding-poses/validation";
import { checkRateLimit, clientIp } from "@/lib/wedding-poses/rate-limit";
import { requirePozeAccessFromRequest } from "@/lib/wedding-poses/access-pin";

export const runtime = "nodejs";

type Params = { params: Promise<{ token: string }> };

export async function PUT(request: Request, { params }: Params) {
  if (!requirePozeAccessFromRequest(request)) {
    return NextResponse.json({ error: "Unesite PIN za pristup izboru poza." }, { status: 403 });
  }
  const ip = clientIp(request);
  const limited = checkRateLimit(`poze-sel:${ip}`, 120, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Previše zahteva." }, { status: 429 });
  }

  try {
    const { token } = await params;
    const submission = await findSubmissionByToken(token);
    if (!submission) {
      return NextResponse.json({ error: "Link nije validan." }, { status: 404 });
    }

    const body = (await request.json()) as {
      items?: { poseId?: string; state?: string }[];
    };

    const items =
      body.items
        ?.map((item) => {
          const poseId = String(item.poseId ?? "");
          const state = parseSelectionState(item.state);
          if (!poseId || !state) return null;
          return { poseId, state };
        })
        .filter((item): item is { poseId: string; state: "liked" | "disliked" | "neutral" } =>
          Boolean(item)
        ) ?? [];

    if (!items.length) {
      return NextResponse.json({ error: "Nema izmena za čuvanje." }, { status: 400 });
    }

    await upsertSelections(submission.id, items);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT selections:", error);
    return NextResponse.json({ error: "Automatsko čuvanje nije uspelo." }, { status: 500 });
  }
}
