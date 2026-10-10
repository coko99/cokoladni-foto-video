import { formatPoseNumber } from "@/lib/wedding-poses/types";
import { formatSerbianDate } from "@/lib/wedding-poses/validation";
import { getContactFromEmail, getWeddingPosesNotifyEmail } from "@/lib/env";
import { sendResendEmailHtml } from "@/lib/resend";

type SubmissionEmailInput = {
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  city: string;
  shoot_location: string;
  celebration_venue: string | null;
  note: string | null;
  displayNumbers: number[];
  isUpdate: boolean;
};

export function buildSubmissionEmailSubject(input: SubmissionEmailInput): string {
  const date = formatSerbianDate(input.wedding_date);
  return `NOVI IZBOR POZA — ${input.bride_name} i ${input.groom_name} — ${date}`;
}

export function buildSubmissionEmailText(input: SubmissionEmailInput): string {
  const numbers = input.displayNumbers.map(formatPoseNumber).join(", ");
  const lines = [
    "ČOKOLADNI FOTO & VIDEO",
    "",
    input.isUpdate ? "IZMENJEN IZBOR FOTOGRAFIJA" : "NOVI IZBOR FOTOGRAFIJA",
    "",
    `Mlada: ${input.bride_name}`,
    `Mladoženja: ${input.groom_name}`,
    `Datum venčanja: ${formatSerbianDate(input.wedding_date)}`,
    `Grad: ${input.city}`,
    `Lokacija fotografisanja: ${input.shoot_location}`,
  ];
  if (input.celebration_venue) lines.push(`Mesto proslave: ${input.celebration_venue}`);
  if (input.note) lines.push(`Napomena: ${input.note}`);
  lines.push(
    "",
    `UKUPNO ODABRANIH POZA: ${input.displayNumbers.length}`,
    "",
    "ODABRANE POZE:",
    numbers || "(nema)"
  );
  return lines.join("\n");
}

export function buildSubmissionEmailHtml(input: SubmissionEmailInput): string {
  const numbers = input.displayNumbers.map(formatPoseNumber).join(", ");
  const heading = input.isUpdate ? "IZMENJEN IZBOR FOTOGRAFIJA" : "NOVI IZBOR FOTOGRAFIJA";
  return `<!DOCTYPE html>
<html lang="sr">
<body style="margin:0;background:#05070d;color:#f5f5f5;font-family:Georgia,serif;padding:32px 16px;">
  <div style="max-width:560px;margin:0 auto;border:1px solid rgba(201,169,98,0.35);border-radius:16px;padding:28px;background:#0a0d14;">
    <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.35em;color:#c9a962;text-transform:uppercase;">Čokoladni Foto &amp; Video</p>
    <h1 style="margin:0 0 24px;font-size:22px;font-weight:400;color:#fff;">${heading}</h1>
    <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.6;color:#dde7f3;">
      <tr><td style="padding:4px 0;color:#c9a962;">Mlada</td><td>${escapeHtml(input.bride_name)}</td></tr>
      <tr><td style="padding:4px 0;color:#c9a962;">Mladoženja</td><td>${escapeHtml(input.groom_name)}</td></tr>
      <tr><td style="padding:4px 0;color:#c9a962;">Datum venčanja</td><td>${escapeHtml(formatSerbianDate(input.wedding_date))}</td></tr>
      <tr><td style="padding:4px 0;color:#c9a962;">Grad</td><td>${escapeHtml(input.city)}</td></tr>
      <tr><td style="padding:4px 0;color:#c9a962;">Lokacija fotografisanja</td><td>${escapeHtml(input.shoot_location)}</td></tr>
      ${input.celebration_venue ? `<tr><td style="padding:4px 0;color:#c9a962;">Mesto proslave</td><td>${escapeHtml(input.celebration_venue)}</td></tr>` : ""}
      ${input.note ? `<tr><td style="padding:4px 0;color:#c9a962;">Napomena</td><td>${escapeHtml(input.note)}</td></tr>` : ""}
    </table>
    <p style="margin:24px 0 8px;font-size:13px;color:#c9a962;">UKUPNO ODABRANIH POZA: ${input.displayNumbers.length}</p>
    <p style="margin:0;font-size:15px;line-height:1.7;color:#fff;">${escapeHtml(numbers || "—")}</p>
  </div>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function notifyPhotographerOfSubmission(
  input: SubmissionEmailInput
): Promise<{ ok: boolean; error?: string }> {
  const to = getWeddingPosesNotifyEmail();
  const subject = buildSubmissionEmailSubject(input);
  const text = buildSubmissionEmailText(input);
  const html = buildSubmissionEmailHtml(input);
  return sendResendEmailHtml(to, subject, text, html);
}

export function emailFromHeader(): string {
  return getContactFromEmail();
}
