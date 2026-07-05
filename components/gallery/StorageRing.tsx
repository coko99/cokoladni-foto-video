"use client";

type Props = {
  percent: number;
  displayPercent?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
};

export function StorageRing({
  percent,
  displayPercent,
  size = 120,
  strokeWidth = 8,
  className = "",
  label,
}: Props) {
  const ringPercent = Math.min(Math.max(percent, 0), 100);
  const shownPercent = displayPercent ?? Math.round(ringPercent);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (ringPercent / 100) * circumference;
  const critical = ringPercent >= 80 || shownPercent > 100;
  const center = size / 2;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${critical ? "storage-ring-wrap-critical" : ""} ${className}`.trim()}
      title={label}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={critical ? "#f87171" : "#65e3ff"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-all duration-500 ${critical ? "storage-ring-stroke-critical" : ""}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
        <span
          className={`font-display text-xl font-bold leading-none sm:text-2xl ${
            critical ? "text-red-400 storage-percent-critical" : "text-accent"
          }`}
        >
          {shownPercent > 100 ? "100+" : `${shownPercent}%`}
        </span>
        <span className="mt-1 text-[9px] uppercase tracking-[0.2em] text-text-muted/50">
          zauzeto
        </span>
      </div>
    </div>
  );
}

export function refreshStorageUsage() {
  window.dispatchEvent(new Event("gallery-storage-refresh"));
}
