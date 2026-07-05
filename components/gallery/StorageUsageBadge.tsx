"use client";

import { useEffect, useState } from "react";
import { StorageRing, refreshStorageUsage } from "./StorageRing";

export { refreshStorageUsage };

type StorageInfo = {
  usedBytes: number;
  quotaBytes: number;
  quotaGb: number;
  freeBytes: number;
  fileCount: number;
  usedPercent: number;
  ringPercent: number;
  displayPercent: number;
  overQuota: boolean;
  usedLabel: string;
  quotaLabel: string;
  freeLabel: string;
};

function useStorageInfo() {
  const [info, setInfo] = useState<StorageInfo | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const res = await fetch("/api/admin/storage");
      if (cancelled) return;
      setLoading(false);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Prostor nije dostupan");
        setInfo(null);
        return;
      }

      setError("");
      setInfo((await res.json()) as StorageInfo);
    }

    load();

    const onRefresh = () => {
      setLoading(true);
      load();
    };
    window.addEventListener("gallery-storage-refresh", onRefresh);

    return () => {
      cancelled = true;
      window.removeEventListener("gallery-storage-refresh", onRefresh);
    };
  }, []);

  return { info, error, loading };
}

export function StorageUsageBadge() {
  const { info, error, loading } = useStorageInfo();

  if (loading) {
    return <span className="text-xs text-text-muted/40 animate-pulse">—</span>;
  }

  if (error || !info) {
    return null;
  }

  const critical = info.displayPercent >= 80 || info.overQuota;
  const label = info.overQuota
    ? `${info.usedLabel} zauzeto (prekoračena kvota ${info.quotaLabel})`
    : `${info.usedLabel} zauzeto · ${info.freeLabel} slobodno`;

  return (
    <span
      className={`text-xs font-semibold tabular-nums ${
        critical ? "text-red-400 storage-percent-critical" : "text-accent/80"
      }`}
      title={label}
    >
      {info.overQuota ? "100+" : `${info.displayPercent}%`}
    </span>
  );
}

export function StorageUsageCard() {
  const { info, error, loading } = useStorageInfo();

  if (loading) {
    return (
      <div className="glass rounded-2xl p-4 animate-pulse sm:p-5">
        <div className="flex items-center gap-5">
          <div className="h-28 w-28 rounded-full bg-white/10" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-32 rounded bg-white/10" />
            <div className="h-3 w-48 rounded bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-4 sm:p-5">
        <p className="text-sm text-text-muted/50">Prostor na disku: nije dostupan</p>
      </div>
    );
  }

  if (!info) return null;

  const critical = info.displayPercent >= 80 || info.overQuota;

  return (
    <div className={`glass rounded-2xl p-4 sm:p-5 ${critical ? "storage-card-critical" : ""}`}>
      <div className="flex flex-wrap items-center gap-5 sm:gap-6">
        <StorageRing
          percent={info.ringPercent}
          displayPercent={info.displayPercent}
          size={128}
          strokeWidth={9}
          label={`Zauzeto ${info.usedLabel} od ${info.quotaLabel}`}
        />

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent/70">
            Prostor na disku
          </p>
          <p
            className={`mt-2 font-display text-2xl font-semibold ${
              critical ? "text-red-400 storage-percent-critical" : "text-gradient-accent"
            }`}
          >
            {info.usedLabel}
            <span className="ml-2 text-sm font-normal text-text-muted/60">zauzeto</span>
          </p>
          <p className="mt-2 text-sm text-text-muted/60">
            Slobodno: <span className="text-text-primary">{info.freeLabel}</span>
            <span className="mx-2 text-text-muted/30">·</span>
            Kvota: <span className="text-text-primary">{info.quotaLabel}</span>
            <span className="text-text-muted/40"> ({info.quotaGb} GB)</span>
          </p>
          {info.overQuota && (
            <p className="mt-2 text-xs font-medium text-red-400/90 storage-percent-critical">
              Prekoračena kvota — zauzeto {info.usedLabel}, limit {info.quotaLabel}. Obrišite
              slike ili povećajte STORAGE_QUOTA_GB na Vercelu.
            </p>
          )}
          {critical && !info.overQuota && (
            <p className="mt-2 text-xs font-medium text-red-400/90 storage-percent-critical">
              Prostor je skoro pun — obrišite nepotrebne slike da oslobodite memoriju.
            </p>
          )}
          <p className="mt-2 text-xs text-text-muted/45">
            {info.fileCount} slika · prikaz kao na Supabase dashboardu
          </p>
        </div>
      </div>
    </div>
  );
}
