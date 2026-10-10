import type { CoupleFormData, PoseSelectionState } from "@/lib/wedding-poses/types";

export function validateCoupleForm(body: unknown):
  | { ok: true; data: CoupleFormData }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Neispravan zahtev." };
  }
  const raw = body as Record<string, unknown>;
  const brideName = String(raw.brideName ?? "").trim();
  const groomName = String(raw.groomName ?? "").trim();
  const weddingDate = String(raw.weddingDate ?? "").trim();
  const city = String(raw.city ?? "").trim();
  const shootLocation = String(raw.shootLocation ?? "").trim();
  const celebrationVenue = String(raw.celebrationVenue ?? "").trim();
  const note = String(raw.note ?? "").trim();

  if (brideName.length < 2) return { ok: false, error: "Unesite ime mlade." };
  if (groomName.length < 2) return { ok: false, error: "Unesite ime mladoženje." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(weddingDate)) {
    return { ok: false, error: "Izaberite datum venčanja." };
  }
  if (city.length < 2) return { ok: false, error: "Unesite grad ili mesto." };
  if (shootLocation.length < 2) {
    return { ok: false, error: "Unesite lokaciju fotografisanja." };
  }

  return {
    ok: true,
    data: {
      brideName,
      groomName,
      weddingDate,
      city,
      shootLocation,
      celebrationVenue: celebrationVenue || undefined,
      note: note || undefined,
    },
  };
}

export function parseSelectionState(value: unknown): PoseSelectionState | null {
  if (value === "liked" || value === "disliked" || value === "neutral") return value;
  return null;
}

export function formatSerbianDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  return new Date(y, m - 1, d).toLocaleDateString("sr-RS", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
