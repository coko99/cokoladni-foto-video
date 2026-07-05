import { createAdminClient } from "@/lib/supabase/admin";
import type { Gallery } from "./types";

export async function findGalleryByIdentifier(
  identifier: string
): Promise<Gallery | null> {
  const admin = createAdminClient();

  const { data: bySlug } = await admin
    .from("galleries")
    .select("*")
    .eq("slug", identifier)
    .maybeSingle();

  if (bySlug) return bySlug;

  const { data: byUsername } = await admin
    .from("galleries")
    .select("*")
    .eq("username", identifier)
    .maybeSingle();

  return byUsername;
}

export async function findGalleryByAccessCode(
  accessCode: string
): Promise<Gallery | null> {
  const admin = createAdminClient();
  const code = accessCode.trim().toUpperCase();

  if (!code) return null;

  const { data } = await admin
    .from("galleries")
    .select("*")
    .eq("access_code", code)
    .maybeSingle();

  return data;
}
