import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { findGalleryByIdentifier } from "@/lib/gallery/db";
import { formatSelectionEmail } from "@/lib/gallery/email";
import { SENDER_RELATIONS } from "@/lib/gallery/relations";
import type { SubmitSelectionPayload } from "@/lib/gallery/types";
import { getContactToEmail } from "@/lib/env";
import { sendResendEmail } from "@/lib/resend";

const PHOTOGRAPHER_EMAIL = getContactToEmail();

function dbErrorMessage(error: { message?: string; code?: string }): string {
  const msg = error.message ?? "";

  if (msg.includes("sender_relation")) {
    return "Baza nije ažurirana. Pokrenite migration-v2.sql u Supabase SQL Editoru.";
  }

  if (msg.includes("duplicate key") || msg.includes("unique constraint")) {
    return "Baza ne dozvoljava duplikate slika. Pokrenite migration-v2.sql u Supabase SQL Editoru.";
  }

  if (process.env.NODE_ENV === "development") {
    return msg || "Nepoznata greška baze.";
  }

  return "Čuvanje izbora nije uspelo.";
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = (await request.json()) as SubmitSelectionPayload;
    const { senderRelation, note, imageIds } = body;

    if (!senderRelation?.trim()) {
      return NextResponse.json(
        { error: "Izaberite ko šalje izbor." },
        { status: 400 }
      );
    }

    if (!SENDER_RELATIONS.includes(senderRelation as (typeof SENDER_RELATIONS)[number])) {
      return NextResponse.json({ error: "Nevažeća opcija." }, { status: 400 });
    }

    if (!imageIds?.length) {
      return NextResponse.json(
        { error: "Izaberite bar jednu fotografiju." },
        { status: 400 }
      );
    }

    const gallery = await findGalleryByIdentifier(slug);
    if (!gallery) {
      return NextResponse.json({ error: "Album nije pronađen." }, { status: 404 });
    }

    const key = gallery.username ?? gallery.slug;
    const verifiedCookie = request.headers
      .get("cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith(`gallery_verified_${key}=`));

    if (!verifiedCookie) {
      return NextResponse.json({ error: "Potreban je pristup albumu." }, { status: 401 });
    }

    const supabase = createAdminClient();
    const uniqueIds = [...new Set(imageIds)];

    const { data: imageRows, error: imagesError } = await supabase
      .from("gallery_images")
      .select("id, filename")
      .eq("gallery_id", gallery.id)
      .in("id", uniqueIds);

    if (imagesError || !imageRows?.length) {
      return NextResponse.json({ error: "Izabrane slike nisu validne." }, { status: 400 });
    }

    const imageMap = new Map(imageRows.map((img) => [img.id, img]));
    const expandedImages = imageIds
      .map((id) => imageMap.get(id))
      .filter((img): img is NonNullable<typeof img> => Boolean(img));

    if (!expandedImages.length) {
      return NextResponse.json({ error: "Izabrane slike nisu validne." }, { status: 400 });
    }

    const baseSelection = {
      gallery_id: gallery.id,
      client_name: senderRelation.trim(),
      client_email: gallery.client_email,
      note: note?.trim() || null,
    };

    let selectionResult = await supabase
      .from("selections")
      .insert({
        ...baseSelection,
        sender_relation: senderRelation.trim(),
      })
      .select("id")
      .single();

    if (
      selectionResult.error?.message?.includes("sender_relation") ||
      selectionResult.error?.code === "PGRST204"
    ) {
      selectionResult = await supabase
        .from("selections")
        .insert(baseSelection)
        .select("id")
        .single();
    }

    const { data: selection, error: selectionError } = selectionResult;

    if (selectionError || !selection) {
      console.error("Selection insert error:", selectionError);
      return NextResponse.json(
        { error: dbErrorMessage(selectionError ?? {}) },
        { status: 500 }
      );
    }

    const { error: linkError } = await supabase.from("selection_images").insert(
      expandedImages.map((img) => ({
        selection_id: selection.id,
        image_id: img.id,
      }))
    );

    if (linkError) {
      console.error("Selection images insert error:", linkError);
      await supabase.from("selections").delete().eq("id", selection.id);
      return NextResponse.json(
        { error: dbErrorMessage(linkError) },
        { status: 500 }
      );
    }

    const { subject, text } = formatSelectionEmail(
      gallery,
      { senderRelation, note },
      expandedImages
    );

    const emailResult = await sendResendEmail(PHOTOGRAPHER_EMAIL, subject, text);

    return NextResponse.json({
      success: true,
      selectionId: selection.id,
      totalCount: expandedImages.length,
      senderRelation,
      emailSent: emailResult.ok,
      emailError: emailResult.error ?? null,
    });
  } catch (error) {
    console.error("Submit selection error:", error);
    return NextResponse.json({ error: "Došlo je do greške." }, { status: 500 });
  }
}
