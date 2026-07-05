import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPin } from "@/lib/gallery/pin";
import { formatSelectionEmail } from "@/lib/gallery/email";
import type { SubmitSelectionPayload } from "@/lib/gallery/types";
import {
  getContactFromEmail,
  getContactToEmail,
  getResendApiKey,
} from "@/lib/env";

const RESEND_API_KEY = getResendApiKey();
const CONTACT_FROM = getContactFromEmail();
const PHOTOGRAPHER_EMAIL = getContactToEmail();

async function sendSelectionEmail(
  subject: string,
  text: string,
  to: string
): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    return { ok: false, error: "Email servis nije podešen." };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: CONTACT_FROM, to: [to], subject, text }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend selection error:", res.status, err);
    return { ok: false, error: "Slanje emaila nije uspelo." };
  }

  return { ok: true };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = (await request.json()) as SubmitSelectionPayload;
    const { clientName, clientEmail, clientPhone, note, imageIds } = body;

    if (!clientName?.trim() || !clientEmail?.trim()) {
      return NextResponse.json(
        { error: "Ime i email su obavezni." },
        { status: 400 }
      );
    }

    if (!imageIds?.length) {
      return NextResponse.json(
        { error: "Izaberite bar jednu fotografiju." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: gallery, error: galleryError } = await supabase
      .from("galleries")
      .select("*")
      .eq("slug", slug)
      .single();

    if (galleryError || !gallery) {
      return NextResponse.json({ error: "Galerija nije pronađena." }, { status: 404 });
    }

    if (gallery.pin_hash) {
      const pinCookie = request.headers
        .get("cookie")
        ?.split(";")
        .find((c) => c.trim().startsWith(`gallery_pin_${slug}=`));

      if (!pinCookie) {
        return NextResponse.json({ error: "Potrebna je šifra galerije." }, { status: 401 });
      }
    }

    if (gallery.max_selections && imageIds.length > gallery.max_selections) {
      return NextResponse.json(
        { error: `Možete izabrati najviše ${gallery.max_selections} slika.` },
        { status: 400 }
      );
    }

    const { data: images, error: imagesError } = await supabase
      .from("gallery_images")
      .select("id, filename")
      .eq("gallery_id", gallery.id)
      .in("id", imageIds);

    if (imagesError || !images?.length) {
      return NextResponse.json({ error: "Izabrane slike nisu validne." }, { status: 400 });
    }

    const { data: selection, error: selectionError } = await supabase
      .from("selections")
      .insert({
        gallery_id: gallery.id,
        client_name: clientName.trim(),
        client_email: clientEmail.trim(),
        client_phone: clientPhone?.trim() || null,
        note: note?.trim() || null,
      })
      .select("id")
      .single();

    if (selectionError || !selection) {
      return NextResponse.json({ error: "Čuvanje izbora nije uspelo." }, { status: 500 });
    }

    const { error: linkError } = await supabase.from("selection_images").insert(
      images.map((img) => ({
        selection_id: selection.id,
        image_id: img.id,
      }))
    );

    if (linkError) {
      return NextResponse.json({ error: "Čuvanje izbora nije uspelo." }, { status: 500 });
    }

    const { subject, text } = formatSelectionEmail(
      gallery,
      { name: clientName, email: clientEmail, phone: clientPhone, note },
      images
    );

    await sendSelectionEmail(subject, text, PHOTOGRAPHER_EMAIL);

    return NextResponse.json({ success: true, selectionId: selection.id });
  } catch {
    return NextResponse.json({ error: "Došlo je do greške." }, { status: 500 });
  }
}
