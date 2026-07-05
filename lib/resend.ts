import { getContactFromEmail, getResendApiKey } from "@/lib/env";

export function parseResendError(raw: string): string {
  try {
    const json = JSON.parse(raw) as { message?: string; statusCode?: number };
    const msg = json.message ?? raw;

    if (
      msg.includes("only send testing emails") ||
      msg.includes("verify a domain")
    ) {
      return "Resend još nije podešen za slanje na info@cokoladni.rs. Verifikujte domen cokoladni.rs na resend.com/domains.";
    }
    if (msg.includes("Invalid `from`") || msg.includes("from address")) {
      return "Adresa pošiljaoca nije validna. Verifikujte domen i podesite CONTACT_FROM_EMAIL.";
    }
    if (json.statusCode === 401 || msg.includes("API key")) {
      return "Resend API ključ nije ispravan.";
    }

    return msg;
  } catch {
    return raw || "Nepoznata greška Resend servisa.";
  }
}

export async function sendResendEmail(
  to: string,
  subject: string,
  text: string
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = getResendApiKey();
  if (!apiKey) {
    return { ok: false, error: "Email servis nije podešen (RESEND_API_KEY)." };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getContactFromEmail(),
      to: [to],
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", res.status, err);
    return { ok: false, error: parseResendError(err) };
  }

  return { ok: true };
}
