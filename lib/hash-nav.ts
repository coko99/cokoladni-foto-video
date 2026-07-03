const HEADER_OFFSET = 88;

export function scrollToSection(id: string, attempts = 0) {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
    return;
  }
  if (attempts < 12) {
    window.setTimeout(() => scrollToSection(id, attempts + 1), 100);
  }
}

export function parseNavHref(href: string) {
  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const beforeHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const path = beforeHash.split("?")[0] || "/";
  const query = beforeHash.includes("?") ? beforeHash.slice(beforeHash.indexOf("?")) : "";
  return { path, query, hash, sectionId: hash ? hash.slice(1) : "" };
}

export function handleHashNavClick(
  href: string,
  pathname: string,
  options: {
    onAfterNavigate?: () => void;
    navigate: (url: string) => void;
  }
) {
  const { path, hash, sectionId } = parseNavHref(href);
  const isSamePage = path === pathname;

  options.onAfterNavigate?.();

  if (hash && isSamePage) {
    window.history.pushState(null, "", href);
    window.setTimeout(() => scrollToSection(sectionId), options.onAfterNavigate ? 280 : 0);
    return true;
  }

  if (hash || href.includes("?")) {
    options.navigate(href);
    return true;
  }

  return false;
}
