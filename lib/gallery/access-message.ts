type AccessMessageInput = {
  title: string;
  clientName?: string;
  publicUrl: string;
  accessCode: string;
  pin?: string | null;
  username?: string | null;
};

export function formatClientAccessMessage({
  title,
  clientName,
  publicUrl,
  accessCode,
  pin,
  username,
}: AccessMessageInput): string {
  const greeting = clientName ? `Poštovani/a ${clientName},` : "Poštovani,";

  const lines = [
    greeting,
    "",
    "Hvala vam što koristite Čokoladni Foto & Video!",
    "",
    `Vaš privatni album „${title}" je spreman.`,
    "Otvorite link, unesite kod (i šifru ako je postavljena), izaberite omiljene fotografije klikom na srce i pošaljite nam izbor.",
    "",
    "── Pristup albumu ──",
    "",
    `🔗 Link albuma:`,
    publicUrl,
    "",
    `🔑 Kod albuma:`,
    accessCode,
  ];

  if (username) {
    lines.push("", `👤 Username:`, username);
  }

  if (pin?.trim()) {
    lines.push("", `🔒 Šifra:`, pin.trim());
  } else {
    lines.push("", "🔒 Šifra: nije potrebna");
  }

  lines.push(
    "",
    "Kod i šifru unesite prilikom ulaska u album.",
    "",
    "Srdačan pozdrav,",
    "Čokoladni Foto & Video",
    "info@cokoladni.rs"
  );

  return lines.join("\n");
}
