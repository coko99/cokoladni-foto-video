"use client";

import { useState, useRef, useEffect } from "react";
import type { GalleryImage, SelectionWithImages } from "@/lib/gallery/types";
import { CopyAlbumAccess } from "./CopyAlbumAccess";
import { AdminImageSorter } from "./AdminImageSorter";
import { GalleryActionsMenu } from "./GalleryActionsMenu";
import { groupImagesByFilename } from "@/lib/gallery/email";
import { getGalleryCoverImage } from "@/lib/gallery/cover";
import { getImagePublicUrl } from "@/lib/gallery/utils";
import { uploadGalleryImages } from "@/lib/gallery/upload-images";
import { UploadOverlay } from "./UploadOverlay";
import Image from "next/image";

type Props = {
  galleryId: string;
  galleryTitle: string;
  clientName: string;
  slug: string;
  username: string | null;
  accessCode: string;
  pinPlain: string | null;
  heroImageId: string | null;
  publicUrl: string;
  initialImages: GalleryImage[];
  initialSelections: SelectionWithImages[];
};

export function GalleryAdminDetail({
  galleryId,
  galleryTitle,
  clientName,
  slug,
  username,
  accessCode,
  pinPlain,
  heroImageId: initialHeroImageId,
  publicUrl,
  initialImages,
  initialSelections,
}: Props) {
  const [images, setImages] = useState(initialImages);
  const [heroImageId, setHeroImageId] = useState<string | null>(initialHeroImageId);
  const [selections] = useState(initialSelections);
  const [currentAccessCode, setCurrentAccessCode] = useState(accessCode);
  const [accessCodeInput, setAccessCodeInput] = useState(accessCode);
  const [pinInput, setPinInput] = useState(pinPlain ?? "");
  const [savingAccess, setSavingAccess] = useState(false);
  const [accessSaveMsg, setAccessSaveMsg] = useState("");
  const [accessSaveError, setAccessSaveError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadCurrent, setUploadCurrent] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [uploadFilename, setUploadFilename] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [displayPin, setDisplayPin] = useState(pinPlain);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingGallery, setDeletingGallery] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!displayPin) {
      const stored = sessionStorage.getItem(`gallery-pin-${galleryId}`);
      if (stored) {
        setDisplayPin(stored);
        setPinInput(stored);
      }
    }
  }, [galleryId, displayPin]);

  async function saveAccess(options?: { generateAccessCode?: boolean }) {
    setSavingAccess(true);
    setAccessSaveMsg("");
    setAccessSaveError("");

    const res = await fetch(`/api/admin/galleries/${galleryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessCode: options?.generateAccessCode ? undefined : accessCodeInput,
        generateAccessCode: options?.generateAccessCode,
        pin: pinInput,
      }),
    });

    const data = await res.json();
    setSavingAccess(false);

    if (!res.ok) {
      setAccessSaveError(data.error ?? "Čuvanje nije uspelo.");
      return;
    }

    setCurrentAccessCode(data.accessCode);
    setAccessCodeInput(data.accessCode);
    setDisplayPin(data.pinPlain);
    setPinInput(data.pinPlain ?? "");
    if (data.pinPlain) {
      sessionStorage.setItem(`gallery-pin-${galleryId}`, data.pinPlain);
    } else {
      sessionStorage.removeItem(`gallery-pin-${galleryId}`);
    }
    setAccessSaveMsg("Pristup je ažuriran.");
    setTimeout(() => setAccessSaveMsg(""), 3000);
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    const total = files.length;
    setUploading(true);
    setUploadError("");
    setUploadCurrent(0);
    setUploadTotal(total);
    setUploadFilename("");
    setUploadProgress(`Upload 0/${total}...`);

    const { uploaded, errors } = await uploadGalleryImages(
      galleryId,
      Array.from(files),
      (current, totalFiles, filename) => {
        setUploadCurrent(current);
        setUploadTotal(totalFiles);
        setUploadFilename(filename);
        setUploadProgress(`Upload ${current}/${totalFiles}: ${filename}`);
      }
    );

    setUploading(false);
    setUploadFilename("");

    if (uploaded.length) {
      const newImages = uploaded.map((u, i) => ({
        id: u.id,
        gallery_id: galleryId,
        storage_path: u.storage_path,
        filename: u.filename,
        sort_order: images.length + i,
        created_at: new Date().toISOString(),
      }));
      setImages((prev) => [...prev, ...newImages]);
      if (!heroImageId && newImages[0]) {
        setHeroImageId(newImages[0].id);
      }
      setUploadProgress(`Uspešno uploadovano: ${uploaded.length} slika`);
      setTimeout(() => setUploadProgress(""), 3000);
    }

    if (errors.length) {
      setUploadError(errors.join(" · "));
    } else if (!uploaded.length) {
      setUploadError("Nijedna slika nije uploadovana.");
    }

    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleDeleteImage(imageId: string) {
    if (!confirm("Obrisati ovu sliku?")) return;
    setDeletingId(imageId);

    const res = await fetch(`/api/admin/galleries/${galleryId}/images/${imageId}`, {
      method: "DELETE",
    });

    setDeletingId(null);

    if (res.ok) {
      setImages((prev) => {
        const next = prev.filter((img) => img.id !== imageId);
        if (heroImageId === imageId) {
          setHeroImageId(next[0]?.id ?? null);
        }
        return next;
      });
    } else {
      const data = await res.json();
      alert(data.error ?? "Brisanje nije uspelo.");
    }
  }

  async function handleDeleteGallery() {
    setDeletingGallery(true);

    const res = await fetch(`/api/admin/galleries/${galleryId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      sessionStorage.removeItem(`gallery-pin-${galleryId}`);
      window.location.href = "/admin";
      return;
    }

    const data = await res.json();
    setDeletingGallery(false);
    alert(data.error ?? "Brisanje galerije nije uspelo.");
  }

  const heroImage = getGalleryCoverImage({ hero_image_id: heroImageId }, images);

  return (
    <div className="space-y-8">
      <UploadOverlay
        open={uploading}
        current={uploadCurrent}
        total={uploadTotal}
        filename={uploadFilename}
      />
      <div className="relative">
        <GalleryActionsMenu
          className="absolute right-0 top-0"
          onDelete={() => setShowDeleteConfirm(true)}
        />
        <div className="pr-12">
          <h1 className="font-display text-xl font-semibold break-words sm:text-2xl">{galleryTitle}</h1>
          <p className="mt-1 text-sm text-text-muted/60 break-all">@{username ?? slug}</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <CopyAlbumAccess
            title={galleryTitle}
            clientName={clientName}
            publicUrl={publicUrl}
            accessCode={currentAccessCode}
            username={username}
            pin={displayPin}
          />
        </div>
      </div>

      <section className="glass rounded-2xl p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent/80">
          Pristup za klijenta
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-accent/15 bg-bg-deep/40 p-4 sm:col-span-3">
            <p className="text-xs text-text-muted/50">Link albuma</p>
            <p className="mt-1 break-all text-sm text-accent">{publicUrl}</p>
          </div>
          <div className="rounded-xl border border-accent/15 bg-bg-deep/40 p-4">
            <label className="text-xs text-text-muted/50">Kod albuma</label>
            <input
              value={accessCodeInput}
              onChange={(e) =>
                setAccessCodeInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))
              }
              maxLength={8}
              className="mt-2 w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-3 py-2 font-mono text-lg font-bold tracking-[0.15em] text-accent outline-none focus:border-accent/60 sm:text-xl sm:tracking-[0.2em]"
            />
            <button
              type="button"
              onClick={() => saveAccess({ generateAccessCode: true })}
              disabled={savingAccess}
              className="mt-2 text-xs text-accent/70 underline-offset-2 hover:text-accent hover:underline disabled:opacity-50"
            >
              Generiši novi kod
            </button>
          </div>
          <div className="rounded-xl border border-accent/15 bg-bg-deep/40 p-4 sm:col-span-2">
            <label className="text-xs text-text-muted/50">Šifra albuma</label>
            <input
              type="text"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Bez šifre — ostavi prazno"
              className="mt-2 w-full rounded-xl border border-accent/25 bg-bg-deep/60 px-3 py-2 font-mono text-lg text-accent outline-none focus:border-accent/60"
            />
            <p className="mt-2 text-xs text-text-muted/40">
              Prazno polje = klijent ulazi samo sa kodom albuma
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={() => saveAccess()}
            disabled={savingAccess}
            className="btn-premium w-full rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-50 sm:w-auto"
          >
            {savingAccess ? "Čuvanje..." : "Sačuvaj kod i šifru"}
          </button>
          <CopyAlbumAccess
            title={galleryTitle}
            clientName={clientName}
            publicUrl={publicUrl}
            accessCode={currentAccessCode}
            username={username}
            pin={displayPin}
          />
        </div>
        {accessSaveMsg && (
          <p className="mt-3 text-sm text-accent">{accessSaveMsg}</p>
        )}
        {accessSaveError && (
          <p className="mt-3 text-sm text-red-400">{accessSaveError}</p>
        )}
      </section>

      <section className="glass rounded-2xl p-4 sm:p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent/80">
          Upload slika
        </h2>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => handleUpload(e.target.files)}
          className="block w-full text-sm text-text-muted/70 file:mr-4 file:rounded-lg file:border-0 file:bg-accent/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-accent hover:file:bg-accent/25 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {uploadProgress && !uploading && (
          <p className="mt-2 text-sm text-accent">{uploadProgress}</p>
        )}
        {uploadError && (
          <p className="mt-2 text-sm text-red-400">{uploadError}</p>
        )}
        <p className="mt-2 text-xs text-text-muted/40">
          {images.length} slika u galeriji
        </p>
      </section>

      {images.length > 0 && (
        <section className="glass rounded-2xl p-4 sm:p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent/80">
            Hero naslovna
          </h2>
          {heroImage ? (
            <div className="relative aspect-[21/9] overflow-hidden rounded-2xl border border-accent/25">
              <Image
                src={getImagePublicUrl(heroImage.storage_path)}
                alt={heroImage.filename}
                fill
                sizes="(max-width: 768px) 100vw, 1152px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/80 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 text-sm text-white/90">
                {heroImage.filename}
              </p>
            </div>
          ) : (
            <p className="text-sm text-text-muted/50">Izaberite hero sliku ispod.</p>
          )}
          <p className="mt-3 text-xs text-text-muted/50">
            Ova slika se prikazuje na vrhu albuma kada klijent otvori link.
          </p>
        </section>
      )}

      {images.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent/80">
            Slike — izaberi hero i prevuci za redosled
          </h2>
          <AdminImageSorter
            galleryId={galleryId}
            images={images}
            heroImageId={heroImageId}
            onReorder={setImages}
            onSetHero={setHeroImageId}
            onDelete={handleDeleteImage}
            deletingId={deletingId}
          />
        </section>
      )}

      <section className="glass rounded-2xl p-4 sm:p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent/80">
          Izbori klijenata ({selections.length})
        </h2>
        {selections.length === 0 ? (
          <p className="text-sm text-text-muted/50">Još nema poslatih izbora.</p>
        ) : (
          <div className="space-y-3">
            {selections.map((sel, index) => (
              <div
                key={sel.id}
                className="rounded-xl border border-accent/15 bg-bg-deep/40 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-text-muted/50">#{index + 1}</p>
                    <p className="font-display text-lg font-semibold text-accent">
                      {sel.sender_relation ?? sel.client_name}
                    </p>
                    <p className="text-xs text-text-muted/60">
                      {new Date(sel.created_at).toLocaleString("sr-RS")}
                    </p>
                  </div>
                  <p className="rounded-full bg-accent/15 px-3 py-1 text-sm font-semibold text-accent">
                    {sel.total_count ?? sel.images.length} slika
                  </p>
                </div>
                {sel.note && (
                  <p className="mt-2 text-sm text-text-muted/70">"{sel.note}"</p>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {groupImagesByFilename(sel.images).map((item) => (
                    <span
                      key={item.filename}
                      className="rounded-md bg-accent/10 px-2 py-0.5 text-xs text-accent/80"
                    >
                      {item.filename}
                      {item.quantity > 1 && ` ×${item.quantity}`}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="glass-strong w-full max-w-md rounded-2xl p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold text-red-300">
              Obrisati galeriju?
            </h3>
            <p className="text-sm text-text-muted/70">
              Da li ste sigurni da želite da obrišete{" "}
              <span className="font-semibold text-text-primary">„{galleryTitle}”</span>?
            </p>
            <p className="text-xs text-text-muted/50">
              Biće uklonjeno {images.length} slika i {selections.length} izbora klijenata.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deletingGallery}
                className="btn-ghost flex-1 rounded-xl py-2.5 text-sm disabled:opacity-50"
              >
                Otkaži
              </button>
              <button
                type="button"
                onClick={handleDeleteGallery}
                disabled={deletingGallery}
                className="flex-1 rounded-xl border border-red-500/50 bg-red-500/20 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/30 disabled:opacity-50"
              >
                {deletingGallery ? "Brisanje..." : "Da, obriši"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
