import { cookies } from "next/headers";

export const POZE_ACCESS_COOKIE = "poze_access";

export function getPozeAccessPin(): string {
  return process.env.POZE_ACCESS_PIN?.trim() || "112233";
}

export function isValidPozePin(pin: string): boolean {
  const normalized = pin.replace(/\D/g, "");
  return normalized === getPozeAccessPin().replace(/\D/g, "");
}

export async function hasPozeAccess(): Promise<boolean> {
  const store = await cookies();
  return store.get(POZE_ACCESS_COOKIE)?.value === "1";
}

export function hasPozeAccessFromCookieHeader(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${POZE_ACCESS_COOKIE}=`)) {
      return trimmed.slice(POZE_ACCESS_COOKIE.length + 1) === "1";
    }
  }
  return false;
}

export function requirePozeAccessFromRequest(request: Request): boolean {
  return hasPozeAccessFromCookieHeader(request.headers.get("cookie"));
}

export function pozeAccessCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  };
}
