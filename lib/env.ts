function trimTrailingSlash(url: string) {
  return url.replace(/\/$/, "");
}

export function getSupabaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    ""
  );
}

export function getSupabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    ""
  );
}

export function getSupabaseServiceRoleKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY ??
    ""
  );
}

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured && !configured.includes("tvoj-domen")) {
    return trimTrailingSlash(configured);
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return trimTrailingSlash(window.location.origin);
  }

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) {
    return trimTrailingSlash(
      production.startsWith("http") ? production : `https://${production}`
    );
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel}`;
  }

  return "http://localhost:3000";
}

export function getResendApiKey() {
  return process.env.RESEND_API_KEY ?? "";
}

export function getContactToEmail() {
  return process.env.CONTACT_TO_EMAIL ?? "info@cokoladni.rs";
}

export function getContactFromEmail() {
  return (
    process.env.CONTACT_FROM_EMAIL ??
    "Cokoladni Foto & Video <onboarding@resend.dev>"
  );
}

/** Supabase Storage kvota projekta u GB (podrazumevano 1). Postavi na Vercelu prema planu. */
export function getStorageQuotaGb() {
  const raw = process.env.STORAGE_QUOTA_GB?.trim() ?? "1";
  const gb = Number(raw);
  return Number.isFinite(gb) && gb > 0 ? gb : 1;
}

export function getStorageQuotaBytes() {
  return Math.round(getStorageQuotaGb() * 1024 * 1024 * 1024);
}
