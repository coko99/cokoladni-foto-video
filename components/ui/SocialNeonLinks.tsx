import { site } from "@/lib/content";

type SocialIconProps = {
  className?: string;
};

function InstagramIcon({ className }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M13.5 22v-8.5h2.8l.4-3.2H13.5V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10.3H7.5v3.2h2.6V22h3.4z" />
    </svg>
  );
}

function TikTokIcon({ className }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.5 3c.4 2.8 1.9 4.5 4.5 4.7v3.4c-1.6 0-3.1-.5-4.5-1.4v6.8c0 4.6-3 7.5-7.2 7.5-3.3 0-5.8-2.4-5.8-5.8 0-3.5 2.8-5.7 6.3-5.7.6 0 1.2.1 1.7.2v3.6c-.5-.2-1-.3-1.6-.3-1.8 0-3 1.2-3 3 0 1.7 1.1 3 2.8 3 1.8 0 2.8-1.1 2.8-3.1V3h3z" />
    </svg>
  );
}

const socialLinks = [
  { href: site.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.tiktok, label: "TikTok", Icon: TikTokIcon },
] as const;

type SocialNeonLinksProps = {
  className?: string;
};

export function SocialNeonLinks({ className = "" }: SocialNeonLinksProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      {socialLinks.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="social-neon-icon group flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/5 transition duration-300 hover:border-accent/60 hover:bg-accent/10"
        >
          <Icon className="h-5 w-5 text-accent transition duration-300 group-hover:scale-110" />
        </a>
      ))}
    </div>
  );
}
