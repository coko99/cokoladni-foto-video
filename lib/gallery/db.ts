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
