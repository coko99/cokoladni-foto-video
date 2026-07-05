"use client";

import { useEffect, useState } from "react";

type StorageInfo = {
  usedBytes: number;
  quotaBytes: number;
  freeBytes: number;
  usedPercent: number;
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
        return;
      }

      setInfo((await res.json()) as StorageInfo);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { info, error, loading };
}

function usageTone(percent: number) {
  if (percent >= 90) return "text-red-400";
  if (percent >= 75) return "text-amber-300";
  return "text-accent/80";
}

function barTone(percent: number) {
  if (percent >= 90) return "bg-red-400";
  if (percent >= 75) return "bg-amber-300";
  return "bg-accent";
}

export function StorageUsageBadge() {
  const { info, error, loading } = useStorageInfo();

  if (loading) {
    return <span className="text-[10px] text-text-muted/40 animate-pulse">...</span>;
  }

  if (error || !info) {
    return null;
  }

  return (
    <div
      className="min-w-0 max-w-[7rem] sm:max-w-none"
      title={`Iskorišćeno ${info.usedLabel} od ${info.quotaLabel}`}
    >
      <p className={`truncate text-[10px] font-medium leading-tight ${usageTone(info.usedPercent)}`}>
        <span className="sm:hidden">{info.freeLabel}</span>
        <span className="hidden sm:inline">{info.freeLabel} slobodno</span>
      </p>
      <div className="mt-1 hidden h-1 w-24 overflow-hidden rounded-full bg-white/10 sm:block">
        <div
          className={`h-full rounded-full transition-all ${barTone(info.usedPercent)}`}
          style={{ width: `${info.usedPercent}%` }}
        />
      </div>
      <p className="mt-0.5 hidden text-[10px] text-text-muted/45 sm:block">
        {info.usedLabel} / {info.quotaLabel}
      </p>
    </div>
  );
}

export function StorageUsageCard() {
  const { info, error, loading } = useStorageInfo();

  if (loading) {
    return (
      <div className="glass rounded-2xl p-4 animate-pulse">
        <div className="h-4 w-32 rounded bg-white/10" />
        <div className="mt-3 h-2 w-full rounded bg-white/10" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-4">
        <p className="text-sm text-text-muted/50">Prostor na disku: nije dostupan</p>
      </div>
    );
  }

  if (!info) return null;

  return (
    <div className="glass rounded-2xl p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent/70">
            Prostor na disku
          </p>
          <p className={`mt-1 font-display text-2xl font-semibold ${usageTone(info.usedPercent)}`}>
            {info.freeLabel}
            <span className="ml-2 text-sm font-normal text-text-muted/60">slobodno</span>
          </p>
        </div>
        <p className="text-sm text-text-muted/60">
          {info.usedLabel} od {info.quotaLabel}
        </p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all ${barTone(info.usedPercent)}`}
          style={{ width: `${info.usedPercent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-text-muted/45">
        {info.usedPercent.toFixed(0)}% iskorišćeno · Supabase Storage (gallery-images)
      </p>
    </div>
  );
}
