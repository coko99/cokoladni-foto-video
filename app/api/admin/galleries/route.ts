import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify, generateAccessCode } from "@/lib/gallery/utils";
import { hashPin } from "@/lib/gallery/pin";
import { isEventType } from "@/lib/gallery/event-types";
import type { CreateGalleryPayload } from "@/lib/gallery/types";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: galleries, error } = await admin
    .from("galleries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const withStats = await Promise.all(
    (galleries ?? []).map(async (g) => {
      const [{ count: imageCount }, { count: selectionCount }] = await Promise.all([
        admin
          .from("gallery_images")
          .select("*", { count: "exact", head: true })
          .eq("gallery_id", g.id),
        admin
          .from("selections")
          .select("*", { count: "exact", head: true })
          .eq("gallery_id", g.id),
      ]);
      return {
        ...g,
        image_count: imageCount ?? 0,
        selection_count: selectionCount ?? 0,
      };
    })
  );

  return NextResponse.json({ galleries: withStats });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  const body = (await request.json()) as CreateGalleryPayload;
  const { title, username, clientName, clientEmail, eventType, hostsInfo, eventDate, pin } = body;

  if (!title?.trim() || !username?.trim() || !clientName?.trim() || !clientEmail?.trim()) {
    return NextResponse.json({ error: "Sva polja su obavezna." }, { status: 400 });
  }

  if (!eventType?.trim() || !isEventType(eventType.trim())) {
    return NextResponse.json({ error: "Izaberite tip događaja." }, { status: 400 });
  }

  const cleanUsername = slugify(username);
  if (!cleanUsername || cleanUsername.length < 3) {
    return NextResponse.json(
      { error: "Username mora imati bar 3 karaktera (slova/brojevi)." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("galleries")
    .select("id")
    .eq("username", cleanUsername)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Username je već zauzet." }, { status: 400 });
  }

  const accessCode = generateAccessCode();
  const pinHash = pin?.trim() ? await hashPin(pin.trim()) : null;
  const pinPlain = pin?.trim() || null;

  const { data, error } = await admin
    .from("galleries")
    .insert({
      slug: cleanUsername,
      username: cleanUsername,
      access_code: accessCode,
      title: title.trim(),
      client_name: clientName.trim(),
      client_email: clientEmail.trim(),
      event_type: eventType.trim(),
      hosts_info: hostsInfo?.trim() || null,
      event_date: eventDate || null,
      pin_hash: pinHash,
      pin_plain: pinPlain,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ gallery: data });
}
