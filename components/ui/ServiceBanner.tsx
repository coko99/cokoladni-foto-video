import { FadeIn } from "@/components/ui/FadeIn";

type ServiceBannerProps = {
  title: string;
  description: string;
  image: string;
  index: number;
};

export function ServiceBanner({
  title,
  description,
  image,
  index,
}: ServiceBannerProps) {
  return (
    <FadeIn delay={index * 0.04}>
      <article className="group relative aspect-square overflow-hidden rounded-[20px] border border-white/5 transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(101,227,255,0.12)]">
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-[45%] min-h-[130px] bg-gradient-to-t from-[#05070D] via-[#05070D]/80 to-transparent" />

        <div className="relative flex h-full flex-col justify-end p-5 md:p-6">
          <span className="mb-2 font-display text-xs font-medium text-accent md:text-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-lg font-medium leading-tight text-white md:text-xl">
            {title}
          </h3>
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-text-muted md:text-sm">
            {description}
          </p>
          <div className="mt-3 h-px w-10 bg-accent/50 shadow-[0_0_10px_rgba(101,227,255,0.35)]" />
        </div>
      </article>
    </FadeIn>
  );
}
