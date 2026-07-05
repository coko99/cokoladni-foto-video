import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPin } from "@/lib/gallery/pin";
import { findGalleryByIdentifier } from "@/lib/gallery/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { accessCode, pin } = (await request.json()) as {
      accessCode?: string;
      pin?: string;
    };

    const gallery = await findGalleryByIdentifier(slug);

    if (!gallery) {
      return NextResponse.json({ error: "Album nije pronađen." }, { status: 404 });
    }

    const code = accessCode?.trim().toUpperCase();
    if (!code || code !== gallery.access_code?.toUpperCase()) {
      return NextResponse.json({ error: "Pogrešan kod albuma." }, { status: 401 });
    }

    const validPin = await verifyPin(pin ?? "", gallery.pin_hash);
    if (!validPin) {
      return NextResponse.json({ error: "Pogrešna šifra." }, { status: 401 });
    }

    const key = gallery.username ?? gallery.slug;
    const response = NextResponse.json({ ok: true });
    response.cookies.set(`gallery_verified_${key}`, "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Greška pri proveri pristupa." }, { status: 500 });
  }
}
