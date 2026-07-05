export function HeartStack({ count }: { count: number }) {
  if (count <= 0) return null;
  const visible = Math.min(count, 3);
  return (
    <div className="relative flex h-6 w-8 items-center">
      {Array.from({ length: visible }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="absolute h-5 w-5 text-accent drop-shadow-[0_0_8px_rgba(101,227,255,0.8)]"
          style={{ left: i * 6, zIndex: i }}
          fill="currentColor"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ))}
      {count > 1 && (
        <span className="absolute -right-1 -top-1 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-bg-deep">
          {count}
        </span>
      )}
    </div>
  );
}
