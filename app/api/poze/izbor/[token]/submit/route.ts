import { NextResponse } from "next/server";
import { findSubmissionByToken } from "@/lib/wedding-poses/db";
import { finalizeSubmission } from "@/lib/wedding-poses/submit";
import { checkRateLimit, clientIp } from "@/lib/wedding-poses/rate-limit";
import { requirePozeAccessFromRequest } from "@/lib/wedding-poses/access-pin";

export const runtime = "nodejs";

type Params = { params: Promise<{ token: string }> };

export async function POST(request: Request, { params }: Params) {
  if (!requirePozeAccessFromRequest(request)) {
    return NextResponse.json({ error: "Unesite PIN za pristup izboru poza." }, { status: 403 });
  }
  const ip = clientIp(request);
  const limited = checkRateLimit(`poze-submit:${ip}`, 6, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Previše pokušaja slanja." }, { status: 429 });
  }

  try {
    const { token } = await params;
    const submission = await findSubmissionByToken(token);
    if (!submission) {
      return NextResponse.json({ error: "Link nije validan." }, { status: 404 });
    }

    const isUpdate = submission.status === "submitted" || submission.status === "updated";
    const result = await finalizeSubmission(submission, isUpdate);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      emailSent: result.emailSent,
      emailError: result.emailError,
    });
  } catch (error) {
    console.error("POST submit poze:", error);
    return NextResponse.json({ error: "Slanje nije uspelo." }, { status: 500 });
  }
}
