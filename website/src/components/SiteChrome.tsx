import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 md:px-8">
      <Link href="/" className="font-display text-[1.35rem] font-bold tracking-tight text-ink">
        {siteConfig.name}
      </Link>
      <nav className="flex items-center gap-6 text-sm font-medium text-muted">
        <Link href="/guide" className="transition-colors hover:text-ink">
          Guide
        </Link>
        <a
          href={siteConfig.github}
          className="transition-colors hover:text-ink"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <a href={siteConfig.downloadPath} download className="btn-primary !px-4 !py-2 text-sm">
          Download
        </a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-paper">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-8">
        <p>
          © {new Date().getFullYear()} {siteConfig.org}. {siteConfig.name} for Windows.
        </p>
        <div className="flex flex-wrap gap-5">
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="/guide" className="hover:text-ink">
            Guide
          </Link>
          <a href={siteConfig.release} className="hover:text-ink" target="_blank" rel="noreferrer">
            Releases
          </a>
          <a href="/sitemap.xml" className="hover:text-ink">
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  );
}
