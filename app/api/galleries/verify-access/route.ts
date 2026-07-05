import { NextResponse } from "next/server";
import { verifyPin } from "@/lib/gallery/pin";
import { findGalleryByAccessCode } from "@/lib/gallery/db";

export async function POST(request: Request) {
  try {
    const { accessCode, pin } = (await request.json()) as {
      accessCode?: string;
      pin?: string;
    };

    const code = accessCode?.trim().toUpperCase();
    if (!code) {
      return NextResponse.json({ error: "Unesite kod albuma." }, { status: 400 });
    }

    const gallery = await findGalleryByAccessCode(code);

    if (!gallery) {
      return NextResponse.json({ error: "Pogrešan kod albuma." }, { status: 401 });
    }

    const validPin = await verifyPin(pin ?? "", gallery.pin_hash);
    if (!validPin) {
      return NextResponse.json({ error: "Pogrešna šifra." }, { status: 401 });
    }

    const slug = gallery.username ?? gallery.slug;
    const response = NextResponse.json({ ok: true, slug });
    response.cookies.set(`gallery_verified_${slug}`, "1", {
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
