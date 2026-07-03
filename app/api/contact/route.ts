import { NextResponse } from "next/server";
import {
  formatContactEmail,
  validateContactForm,
  type ContactFormData,
} from "@/lib/contact-form";

export const runtime = "nodejs";

const CONTACT_TO = process.env.CONTACT_TO_EMAIL ?? "info@cokoladni.rs";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_FROM =
  process.env.CONTACT_FROM_EMAIL ??
  "Čokoladni Foto & Video <onboarding@resend.dev>";

async function sendViaResend(data: ContactFormData) {
  if (!RESEND_API_KEY) {
    return { ok: false as const, error: "Email servis nije podešen." };
  }

  const text = formatContactEmail(data);
  const subject = `Novi upit — ${data.dogadjaj} · ${data.ime}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      reply_to: data.telefon.includes("@") ? data.telefon : undefined,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", err);
    return { ok: false as const, error: "Slanje poruke nije uspelo. Pokušajte ponovo." };
  }

  return { ok: true as const };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = validateContactForm(body);

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = await sendViaResend(parsed.data);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 503 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Došlo je do greške. Pokušajte ponovo." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    configured: Boolean(RESEND_API_KEY),
    to: CONTACT_TO,
  });
}
