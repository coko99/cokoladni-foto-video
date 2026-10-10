"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatPoseNumber } from "@/lib/wedding-poses/types";
import { getPoseThumbnailUrl } from "@/lib/wedding-poses/storage";
import { formatSerbianDate } from "@/lib/wedding-poses/validation";

type Category = { id: string; name: string; sort_order: number };
type Pose = {
  id: string;
  display_number: number;
  category_id: string | null;
  storage_path: string;
};
type Submission = {
  id: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  city: string;
  shoot_location: string;
  status: string;
  email_status: string;
  created_at: string;
  liked_count?: number;
};

type Tab = "poses" | "categories" | "submissions";

export function AdminPozePanel() {
  const [tab, setTab] = useState<Tab>("submissions");
  const [categories, setCategories] = useState<Category[]>([]);
  const [poses, setPoses] = useState<Pose[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [search, setSearch] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<{
    submission: Submission;
    likedPoses: Pose[];
    checklist: { pose_id: string; shot: boolean }[];
  } | null>(null);
  const [shootMode, setShootMode] = useState(false);
  const [message, setMessage] = useState("");

  const loadAll = useCallback(async () => {
    const [catRes, poseRes, subRes] = await Promise.all([
      fetch("/api/admin/poze/categories"),
      fetch(`/api/admin/poze/poses${search ? `?q=${encodeURIComponent(search)}` : ""}`),
      fetch("/api/admin/poze/submissions"),
    ]);
    const catData = await catRes.json();
    const poseData = await poseRes.json();
    const subData = await subRes.json();
    setCategories(catData.categories ?? []);
    setPoses(poseData.poses ?? []);
    setSubmissions(subData.submissions ?? []);
  }, [search]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  async function loadDetail(id: string) {
    setSelectedId(id);
    const res = await fetch(`/api/admin/poze/submissions/${id}`);
    const data = await res.json();
    if (res.ok) {
      setDetail({
        submission: data.submission,
        likedPoses: data.likedPoses ?? [],
        checklist: data.checklist ?? [],
      });
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const form = new FormData();
    Array.from(files).forEach((f) => form.append("files", f));
    const up = await fetch("/api/admin/poze/poses/upload", { method: "POST", body: form });
    const upData = await up.json();
    if (!up.ok) {
      setMessage(upData.error ?? "Upload nije uspeo.");
      setUploading(false);
      return;
    }
    for (const file of upData.uploaded ?? []) {
      await fetch("/api/admin/poze/poses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storage_path: file.storage_path }),
      });
    }
    setUploading(false);
    setMessage("Fotografije su dodate.");
    void loadAll();
  }

  const shotStats = useMemo(() => {
    if (!detail) return { done: 0, total: 0 };
    const total = detail.likedPoses.length;
    const done = detail.checklist.filter((c) => c.shot).length;
    return { done, total };
  }, [detail]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-accent">Poze — admin</h1>
          <p className="text-sm text-text-muted/70">Upravljanje pozama, kategorijama i izborima mladenaca</p>
        </div>
        <div className="flex gap-2">
          {(["submissions", "poses", "categories"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                tab === t ? "bg-accent/20 text-accent" : "text-text-muted/60 hover:text-accent"
              }`}
            >
              {t === "submissions" ? "Izbori" : t === "poses" ? "Fotografije" : "Kategorije"}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <p className="rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 text-sm text-accent">
          {message}
        </p>
      )}

      {tab === "categories" && (
        <section className="glass-strong rounded-2xl p-4">
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={async (e) => {
              e.preventDefault();
              await fetch("/api/admin/poze/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCategory }),
              });
              setNewCategory("");
              void loadAll();
            }}
          >
            <input
              className="flex-1 rounded-lg border border-accent/20 bg-black/30 px-3 py-2 text-sm"
              placeholder="Nova kategorija"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button type="submit" className="btn-premium rounded-lg px-4 py-2 text-sm">
              Dodaj
            </button>
          </form>
          <ul className="mt-4 space-y-2">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2 text-sm">
                <span>{c.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "poses" && (
        <section className="glass-strong space-y-4 rounded-2xl p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="btn-premium cursor-pointer rounded-lg px-4 py-2 text-center text-sm">
              {uploading ? "Upload…" : "Upload fotografija"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={(e) => void handleUpload(e.target.files)}
              />
            </label>
            <input
              className="flex-1 rounded-lg border border-accent/20 bg-black/30 px-3 py-2 text-sm"
              placeholder="Pretraga po broju (#12)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
            {poses.map((pose) => (
              <div key={pose.id} className="relative aspect-[3/4] overflow-hidden rounded-xl border border-accent/15">
                <Image
                  src={getPoseThumbnailUrl(pose.storage_path)}
                  alt={formatPoseNumber(pose.display_number)}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs text-accent">
                  {formatPoseNumber(pose.display_number)}
                </span>
                <select
                  className="absolute bottom-2 left-2 right-2 rounded bg-black/80 px-2 py-1 text-xs"
                  value={pose.category_id ?? ""}
                  onChange={async (e) => {
                    await fetch(`/api/admin/poze/poses/${pose.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        category_id: e.target.value || null,
                      }),
                    });
                    void loadAll();
                  }}
                >
                  <option value="">Bez kategorije</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "submissions" && !detail && (
        <section className="glass-strong overflow-hidden rounded-2xl">
          <h2 className="border-b border-accent/15 px-4 py-3 text-sm font-medium text-accent">
            Izbori mladenaca
          </h2>
          {!submissions.length ? (
            <p className="p-6 text-sm text-text-muted/60">Još nema pristiglih izbora.</p>
          ) : (
            <ul>
              {submissions.map((s) => (
                <li key={s.id} className="border-b border-accent/10 last:border-0">
                  <button
                    type="button"
                    className="flex w-full flex-col gap-1 px-4 py-3 text-left hover:bg-accent/5 sm:flex-row sm:items-center sm:justify-between"
                    onClick={() => void loadDetail(s.id)}
                  >
                    <span className="font-medium text-white">
                      {s.bride_name} & {s.groom_name}
                    </span>
                    <span className="text-xs text-text-muted/70">
                      {formatSerbianDate(s.wedding_date)} · {s.city} · {s.liked_count ?? 0} poze ·{" "}
                      {s.status} · email: {s.email_status}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === "submissions" && detail && (
        <section className="glass-strong space-y-4 rounded-2xl p-4 print:bg-white print:text-black">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="text-sm text-accent" onClick={() => setDetail(null)}>
              ← Nazad na listu
            </button>
            <button
              type="button"
              className="rounded-lg bg-accent/15 px-3 py-1 text-sm text-accent"
              onClick={() => setShootMode((v) => !v)}
            >
              {shootMode ? "Detaljan pregled" : "Režim fotografisanja"}
            </button>
            <button type="button" className="rounded-lg px-3 py-1 text-sm text-text-muted/70" onClick={() => window.print()}>
              Štampaj / PDF
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-1 text-sm text-text-muted/70"
              onClick={async () => {
                const nums = detail.likedPoses.map((p) => formatPoseNumber(p.display_number)).join(", ");
                await navigator.clipboard.writeText(nums);
                setMessage("Brojevi su kopirani.");
              }}
            >
              Kopiraj brojeve
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-1 text-sm text-text-muted/70"
              onClick={async () => {
                const res = await fetch(`/api/admin/poze/submissions/${detail.submission.id}/resend-email`, {
                  method: "POST",
                });
                const data = await res.json();
                setMessage(res.ok ? "Email je poslat." : data.error ?? "Slanje nije uspelo.");
              }}
            >
              Pošalji email ponovo
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-1 text-sm text-text-muted/70"
              onClick={async () => {
                const res = await fetch(
                  `/api/admin/poze/submissions/${detail.submission.id}/rotate-token`,
                  { method: "POST" }
                );
                const data = await res.json();
                if (res.ok && data.continueUrl) {
                  await navigator.clipboard.writeText(data.continueUrl);
                  setMessage("Novi privatni link je kopiran.");
                } else {
                  setMessage(data.error ?? "Link nije kreiran.");
                }
              }}
            >
              Novi privatni link
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              {detail.submission.bride_name} & {detail.submission.groom_name}
            </h2>
            <p className="text-sm text-text-muted/70">
              {formatSerbianDate(detail.submission.wedding_date)} · {detail.submission.city} ·{" "}
              {detail.submission.shoot_location}
            </p>
          </div>

          {shootMode && (
            <p className="text-sm text-accent">
              Završeno {shotStats.done} od {shotStats.total} poza
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {detail.likedPoses.map((pose) => {
              const checked = detail.checklist.some((c) => c.pose_id === pose.id && c.shot);
              return (
                <div key={pose.id} className="relative aspect-[3/4] overflow-hidden rounded-xl border border-accent/20">
                  <Image
                    src={getPoseThumbnailUrl(pose.storage_path, 720)}
                    alt={formatPoseNumber(pose.display_number)}
                    fill
                    className="object-cover"
                    sizes="240px"
                  />
                  <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs text-accent">
                    {formatPoseNumber(pose.display_number)}
                  </span>
                  {shootMode && (
                    <label className="absolute bottom-2 left-2 right-2 flex items-center gap-2 rounded bg-black/75 px-2 py-2 text-xs">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={async (e) => {
                          await fetch(`/api/admin/poze/submissions/${detail.submission.id}/checklist`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ poseId: pose.id, shot: e.target.checked }),
                          });
                          void loadDetail(detail.submission.id);
                        }}
                      />
                      Fotografisano
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <p className="text-xs text-text-muted/50">
        <Link href="/admin" className="hover:text-accent">
          ← Nazad na galerije
        </Link>
      </p>
    </div>
  );
}
