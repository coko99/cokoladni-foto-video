"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  CoupleFormData,
  PlannerStep,
  PoseSelectionState,
  WeddingPose,
  WeddingPoseCategory,
  WeddingPoseSubmission,
} from "@/lib/wedding-poses/types";
import { formatPoseNumber } from "@/lib/wedding-poses/types";
import { getPoseThumbnailUrl } from "@/lib/wedding-poses/storage";
import { formatSerbianDate } from "@/lib/wedding-poses/validation";

type Props = {
  token: string;
  initialSubmission: WeddingPoseSubmission;
  initialPoses: WeddingPose[];
  initialCategories: WeddingPoseCategory[];
  initialSelections: Record<string, PoseSelectionState>;
  startStep?: PlannerStep;
};

const STEPS: PlannerStep[] = ["couple", "gallery", "review", "success"];

function stepIndex(step: PlannerStep) {
  if (step === "landing") return 0;
  return STEPS.indexOf(step) + 1;
}

export function WeddingPosePlannerApp({
  token,
  initialSubmission,
  initialPoses,
  initialCategories,
  initialSelections,
  startStep = "gallery",
}: Props) {
  const [step, setStep] = useState<PlannerStep>(startStep);
  const [submission, setSubmission] = useState(initialSubmission);
  const [poses] = useState(initialPoses);
  const [categories] = useState(initialCategories);
  const [selections, setSelections] = useState<Record<string, PoseSelectionState>>(
    initialSelections
  );
  const [categoryId, setCategoryId] = useState<string | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [emailNote, setEmailNote] = useState("");
  const pendingRef = useRef<Map<string, PoseSelectionState>>(new Map());
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [form, setForm] = useState<CoupleFormData>({
    brideName: submission.bride_name,
    groomName: submission.groom_name,
    weddingDate: submission.wedding_date,
    city: submission.city,
    shootLocation: submission.shoot_location,
    celebrationVenue: submission.celebration_venue ?? "",
    note: submission.note ?? "",
  });

  const filteredPoses = useMemo(() => {
    if (categoryId === "all") return poses;
    return poses.filter((p) => p.category_id === categoryId);
  }, [poses, categoryId]);

  const likedPoses = useMemo(
    () => poses.filter((p) => selections[p.id] === "liked"),
    [poses, selections]
  );

  const flushSelections = useCallback(async () => {
    const items = Array.from(pendingRef.current.entries()).map(([poseId, state]) => ({
      poseId,
      state,
    }));
    if (!items.length) return;
    pendingRef.current.clear();
    setSaving(true);
    try {
      await fetch(`/api/poze/izbor/${token}/selections`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
    } finally {
      setSaving(false);
    }
  }, [token]);

  const queueSave = useCallback(
    (poseId: string, state: PoseSelectionState) => {
      pendingRef.current.set(poseId, state);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        void flushSelections();
      }, 700);
    },
    [flushSelections]
  );

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      void flushSelections();
    };
  }, [flushSelections]);

  function toggleLike(poseId: string) {
    setSelections((prev) => {
      const current = prev[poseId] ?? "neutral";
      const resolved: PoseSelectionState = current === "liked" ? "neutral" : "liked";
      queueSave(poseId, resolved);
      return { ...prev, [poseId]: resolved };
    });
  }

  function toggleDislike(poseId: string) {
    setSelections((prev) => {
      const current = prev[poseId] ?? "neutral";
      const resolved: PoseSelectionState = current === "disliked" ? "neutral" : "disliked";
      queueSave(poseId, resolved);
      return { ...prev, [poseId]: resolved };
    });
  }

  async function saveCoupleData() {
    setError("");
    const res = await fetch(`/api/poze/izbor/${token}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brideName: form.brideName,
        groomName: form.groomName,
        weddingDate: form.weddingDate,
        city: form.city,
        shootLocation: form.shootLocation,
        celebrationVenue: form.celebrationVenue,
        note: form.note,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Čuvanje nije uspelo.");
      return false;
    }
    setSubmission((s) => ({
      ...s,
      bride_name: form.brideName,
      groom_name: form.groomName,
      wedding_date: form.weddingDate,
      city: form.city,
      shoot_location: form.shootLocation,
      celebration_venue: form.celebrationVenue || null,
      note: form.note || null,
    }));
    return true;
  }

  async function handleSubmitFinal() {
    if (!likedPoses.length) {
      setError("Izaberite bar jednu fotografiju pre slanja.");
      return;
    }
    setSubmitting(true);
    setError("");
    await flushSelections();
    const ok = await saveCoupleData();
    if (!ok) {
      setSubmitting(false);
      return;
    }
    const res = await fetch(`/api/poze/izbor/${token}/submit`, { method: "POST" });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Slanje nije uspelo.");
      return;
    }
    setEmailNote(
      data.emailSent
        ? ""
        : data.emailError
          ? `Izbor je sačuvan, ali email fotografu nije stigao: ${data.emailError}`
          : "Izbor je sačuvan, ali email fotografu nije stigao."
    );
    setStep("success");
  }

  const progressStep = step === "success" ? 4 : stepIndex(step);

  return (
    <div className="poze-app min-h-screen text-white">
      <header className="sticky top-0 z-30 border-b border-[rgba(201,169,98,0.25)] bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/poze" className="text-xs uppercase tracking-[0.35em] text-[#c9a962]">
            Čokoladni
          </Link>
          <p className="text-center text-[11px] uppercase tracking-[0.25em] text-white/60">
            Korak {Math.min(progressStep, 4)} / 4
          </p>
          {saving ? (
            <span className="text-[11px] text-white/40">Čuvanje…</span>
          ) : (
            <span className="text-[11px] text-white/30">Auto-save</span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 pb-32">
        <AnimatePresence mode="wait">
          {step === "couple" && (
            <motion.section
              key="couple"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mx-auto max-w-xl"
            >
              <h1 className="font-serif text-3xl text-white sm:text-4xl">Podaci o mladencima</h1>
              <p className="mt-2 text-sm text-white/60">
                Ovi podaci pomažu fotografu da pripremi vaš dan.
              </p>
              <form
                className="mt-8 space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const ok = await saveCoupleData();
                  if (ok) setStep("gallery");
                }}
              >
                {[
                  ["Ime mlade *", "brideName"],
                  ["Ime mladoženje *", "groomName"],
                  ["Grad ili mesto *", "city"],
                  ["Lokacija fotografisanja *", "shootLocation"],
                  ["Restoran / proslava", "celebrationVenue"],
                ].map(([label, key]) => (
                  <label key={key} className="block">
                    <span className="text-xs uppercase tracking-wider text-[#c9a962]/90">
                      {label}
                    </span>
                    <input
                      required={!label.includes("Restoran")}
                      className="poze-input mt-1 w-full"
                      value={form[key as keyof CoupleFormData] ?? ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [key]: e.target.value }))
                      }
                    />
                  </label>
                ))}
                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-[#c9a962]/90">
                    Datum venčanja *
                  </span>
                  <input
                    type="date"
                    required
                    className="poze-input mt-1 w-full"
                    value={form.weddingDate}
                    onChange={(e) => setForm((f) => ({ ...f, weddingDate: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-[#c9a962]/90">
                    Napomena za fotografa
                  </span>
                  <textarea
                    rows={3}
                    className="poze-input mt-1 w-full resize-none"
                    value={form.note ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  />
                </label>
                {error && <p className="text-sm text-red-300/90">{error}</p>}
                <button type="submit" className="poze-btn-primary w-full">
                  Nastavi na izbor poza
                </button>
              </form>
            </motion.section>
          )}

          {step === "gallery" && (
            <motion.section key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="font-serif text-3xl sm:text-4xl">Izaberite svoje kadrove</h1>
                  <p className="mt-2 text-sm text-white/60">
                    Odabrali ste{" "}
                    <span className="text-[#c9a962]">{likedPoses.length}</span> fotografija
                  </p>
                </div>
                <button type="button" className="poze-btn-ghost" onClick={() => setStep("couple")}>
                  Izmeni podatke
                </button>
              </div>

              <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
                <button
                  type="button"
                  onClick={() => setCategoryId("all")}
                  className={`poze-chip ${categoryId === "all" ? "poze-chip-active" : ""}`}
                >
                  Sve
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryId(c.id)}
                    className={`poze-chip shrink-0 ${categoryId === c.id ? "poze-chip-active" : ""}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {!filteredPoses.length ? (
                <p className="mt-12 text-center text-white/50">
                  Fotografije još nisu dodate. Fotograf će uskoro ažurirati galeriju.
                </p>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {filteredPoses.map((pose, index) => {
                    const state = selections[pose.id] ?? "neutral";
                    return (
                      <article
                        key={pose.id}
                        className={`poze-tile ${state === "liked" ? "poze-tile-liked" : ""} ${
                          state === "disliked" ? "poze-tile-disliked" : ""
                        }`}
                      >
                        <button
                          type="button"
                          className="absolute inset-0 z-10"
                          aria-label={`Pogledaj ${formatPoseNumber(pose.display_number)}`}
                          onClick={() => setLightboxIndex(index)}
                        />
                        <Image
                          src={getPoseThumbnailUrl(pose.storage_path)}
                          alt={formatPoseNumber(pose.display_number)}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover"
                          loading="lazy"
                        />
                        <span className="poze-id-badge">{formatPoseNumber(pose.display_number)}</span>
                        <div className="absolute bottom-2 right-2 z-20 flex gap-2">
                          <button
                            type="button"
                            aria-label="Sviđa mi se"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(pose.id);
                            }}
                            className={`poze-action poze-action-like ${
                              state === "liked" ? "is-active" : ""
                            }`}
                          >
                            ♥
                          </button>
                          <button
                            type="button"
                            aria-label="Ne sviđa mi se"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDislike(pose.id);
                            }}
                            className={`poze-action poze-action-dislike ${
                              state === "disliked" ? "is-active" : ""
                            }`}
                          >
                            ✕
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              <div className="poze-sticky-bar">
                <button
                  type="button"
                  className="poze-btn-primary w-full max-w-md"
                  onClick={() => setStep("review")}
                >
                  Pregledaj odabrane ({likedPoses.length})
                </button>
              </div>
            </motion.section>
          )}

          {step === "review" && (
            <motion.section key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="font-serif text-3xl sm:text-4xl">Vaši omiljeni kadrovi</h1>
              <p className="mt-2 max-w-xl text-sm text-white/60">
                Ovo su fotografije koje ste izabrali kao inspiraciju za vaš poseban dan.
              </p>

              <div className="mt-6 rounded-2xl border border-[rgba(201,169,98,0.2)] bg-white/5 p-4 text-sm text-white/75">
                <p>
                  <strong className="text-[#c9a962]">{submission.bride_name}</strong> &{" "}
                  <strong className="text-[#c9a962]">{submission.groom_name}</strong>
                </p>
                <p className="mt-1">{formatSerbianDate(submission.wedding_date)} · {submission.city}</p>
                <p className="mt-1">{submission.shoot_location}</p>
                <button type="button" className="mt-3 text-xs text-[#c9a962] underline" onClick={() => setStep("couple")}>
                  Izmeni podatke
                </button>
              </div>

              {!likedPoses.length ? (
                <p className="mt-10 text-center text-white/50">
                  Još niste odabrali nijednu fotografiju.
                </p>
              ) : (
                <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {likedPoses.map((pose) => (
                    <article key={pose.id} className="poze-tile poze-tile-liked">
                      <Image
                        src={getPoseThumbnailUrl(pose.storage_path, 720)}
                        alt={formatPoseNumber(pose.display_number)}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                      />
                      <span className="poze-id-badge">{formatPoseNumber(pose.display_number)}</span>
                      <button
                        type="button"
                        className="absolute right-2 top-2 z-20 rounded-full bg-black/60 px-2 py-1 text-xs"
                        onClick={() => toggleLike(pose.id)}
                      >
                        Ukloni
                      </button>
                    </article>
                  ))}
                </div>
              )}

              {error && <p className="mt-4 text-sm text-red-300/90">{error}</p>}

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <button type="button" className="poze-btn-ghost flex-1" onClick={() => setStep("gallery")}>
                  Nazad u galeriju
                </button>
                <button
                  type="button"
                  className="poze-btn-primary flex-1 disabled:opacity-40"
                  disabled={!likedPoses.length || submitting}
                  onClick={() => void handleSubmitFinal()}
                >
                  {submitting ? "Slanje…" : "Potvrdi i pošalji izbor"}
                </button>
              </div>
              <p className="mt-6 text-xs text-white/40">
                Vaši podaci se koriste isključivo za pripremu fotografisanja. Više u politici privatnosti.
              </p>
            </motion.section>
          )}

          {step === "success" && (
            <motion.section
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-lg text-center"
            >
              <h1 className="font-serif text-4xl text-[#c9a962]">Hvala vam!</h1>
              <p className="mt-4 text-white/75">
                Vaši omiljeni kadrovi su uspešno sačuvani. Radujemo se što ćemo zajedno zabeležiti
                vašu ljubavnu priču.
              </p>
              {emailNote && <p className="mt-3 text-sm text-amber-200/80">{emailNote}</p>}
              <p className="mt-8 text-xs uppercase tracking-[0.35em] text-white/50">
                Čokoladni Foto &amp; Video
              </p>
              <Link href="/" className="poze-btn-primary mt-8 inline-flex">
                Nazad na početnu
              </Link>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {lightboxIndex !== null && filteredPoses[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute right-4 top-4 text-2xl text-white/80"
            onClick={() => setLightboxIndex(null)}
            aria-label="Zatvori"
          >
            ✕
          </button>
          <div className="relative h-[70vh] w-full max-w-3xl">
            <Image
              src={getPoseThumbnailUrl(filteredPoses[lightboxIndex].storage_path, 1200)}
              alt=""
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
