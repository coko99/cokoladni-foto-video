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
  process.env.CONTACT_FROM_EMAIL ?? "Cokoladni Foto & Video <onboarding@resend.dev>";

function parseResendError(raw: string): string {
  try {
    const json = JSON.parse(raw) as { message?: string; statusCode?: number };
    const msg = json.message ?? raw;

    if (
      msg.includes("only send testing emails") ||
      msg.includes("verify a domain")
    ) {
      return "Resend još nije podešen za slanje na info@cokoladni.rs. Verifikujte domen cokoladni.rs na resend.com/domains, pa postavite CONTACT_FROM_EMAIL na npr. kontakt@cokoladni.rs.";
    }
    if (msg.includes("Invalid `from`") || msg.includes("from address")) {
      return "Adresa pošiljaoca nije validna. Verifikujte domen i podesite CONTACT_FROM_EMAIL u Vercel env varijablama.";
    }
    if (json.statusCode === 401 || msg.includes("API key")) {
      return "Resend API ključ nije ispravan. Proverite RESEND_API_KEY u .env.local / Vercel-u.";
    }

    return msg;
  } catch {
    return raw || "Nepoznata greška Resend servisa.";
  }
}

async function sendViaResend(data: ContactFormData) {
  if (!RESEND_API_KEY) {
    return { ok: false as const, error: "Email servis nije podešen (RESEND_API_KEY)." };
  }

  const text = formatContactEmail(data);
  const subject = `Novi upit — ${data.dogadjaj} · ${data.ime}`;

  const payload: Record<string, unknown> = {
    from: CONTACT_FROM,
    to: [CONTACT_TO],
    subject,
    text,
  };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", res.status, err);
    const detail = parseResendError(err);
    const userMessage =
      process.env.NODE_ENV === "development"
        ? detail
        : detail.includes("Verifikujte domen") || detail.includes("API ključ")
          ? detail
          : "Slanje poruke nije uspelo. Pokušajte ponovo ili nas kontaktirajte telefonom.";
    return { ok: false as const, error: userMessage };
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
    from: CONTACT_FROM.replace(/<.*>/, "(hidden)"),
  });
}
