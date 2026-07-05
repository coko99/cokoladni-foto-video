import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPin } from "@/lib/gallery/pin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { pin } = (await request.json()) as { pin?: string };
    const supabase = createAdminClient();

    const { data: gallery, error } = await supabase
      .from("galleries")
      .select("id, pin_hash")
      .eq("slug", slug)
      .single();

    if (error || !gallery) {
      return NextResponse.json({ error: "Galerija nije pronađena." }, { status: 404 });
    }

    const valid = await verifyPin(pin ?? "", gallery.pin_hash);
    if (!valid) {
      return NextResponse.json({ error: "Pogrešna šifra." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(`gallery_pin_${slug}`, "verified", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: `/g/${slug}`,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Greška pri proveri šifre." }, { status: 500 });
  }
}
