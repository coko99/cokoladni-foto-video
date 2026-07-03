import { site } from "@/lib/content";

type LogoProps = {
  size?: "sm" | "md" | "hero";
  className?: string;
  priority?: boolean;
};

const sizes = {
  sm: { src: "/images/logo-sm.png", width: 128, height: 128, className: "h-9 w-9 sm:h-10 sm:w-10" },
  md: { src: "/images/logo-sm.png", width: 128, height: 128, className: "h-10 w-10 sm:h-11 sm:w-11" },
  hero: { src: "/images/logo-hero.png", width: 512, height: 512, className: "h-40 w-40 sm:h-52 sm:w-52" },
};

export function Logo({ size = "md", className = "", priority = false }: LogoProps) {
  const config = sizes[size];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={config.src}
      alt={site.name}
      width={config.width}
      height={config.height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`logo-neon object-contain ${config.className} ${className}`.trim()}
    />
  );
}
