import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  return (
    <main className="relative flex-1 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 78% 18%, rgba(47,214,162,0.18), transparent 55%), radial-gradient(900px 600px at 12% 88%, rgba(47,140,214,0.14), transparent 50%), linear-gradient(160deg, #061018 0%, #0a1a24 45%, #07131c 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at 70% 35%, black 0%, transparent 70%)",
        }}
      />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-8">
        <Link href="/" className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-mist">
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted">
          <Link href="/guide" className="transition hover:text-mist">
            Guide
          </Link>
          <a
            href={siteConfig.github}
            className="transition hover:text-mist"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-5.5rem)] w-full max-w-6xl items-center gap-12 px-6 pb-16 pt-6 md:grid-cols-[1.05fr_0.95fr] md:px-8 md:pb-20">
        <div>
          <p className="anim-rise mb-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] text-signal">
            Opuskiln · Windows utility
          </p>
          <h1 className="anim-rise-delay font-[family-name:var(--font-display)] text-[clamp(3.4rem,9vw,6.4rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-mist">
            {siteConfig.name}
          </h1>
          <p className="anim-rise-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
            Scan devices, start stalled drivers, and pull the latest updates from
            Windows Update plus Lenovo, Dell, HP, Intel, NVIDIA, and AMD.
          </p>
          <div className="anim-rise-delay-2 mt-9 flex flex-wrap items-center gap-4">
            <a
              href={siteConfig.downloadPath}
              download
              className="inline-flex items-center justify-center rounded-md bg-signal px-6 py-3.5 text-base font-bold text-ink transition hover:bg-signal-deep"
            >
              Download for Windows
            </a>
            <Link
              href="/guide"
              className="inline-flex items-center justify-center rounded-md border border-[var(--line)] px-6 py-3.5 text-base font-medium text-mist transition hover:border-signal/40 hover:text-signal"
            >
              How to run
            </Link>
          </div>
          <p className="mt-4 font-[family-name:var(--font-mono)] text-xs text-muted">
            v{siteConfig.version} · DriverScanInit.exe · Run as Administrator
          </p>
        </div>

        <div className="anim-rise-delay relative isolate min-h-[320px] md:min-h-[460px]">
          <div
            aria-hidden
            className="pulse-ring absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal/30"
          />
          <div className="absolute inset-0 overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-panel/80 shadow-[0_0_80px_var(--glow)]">
            <div
              aria-hidden
              className="scan-sweep absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-signal/25 to-transparent"
            />
            <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
              <div className="flex items-center justify-between font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-muted">
                <span>Live device plane</span>
                <span className="text-signal">scan active</span>
              </div>
              <div className="space-y-3 font-[family-name:var(--font-mono)] text-sm leading-relaxed text-mist/90">
                <p>
                  <span className="text-signal">OK</span> Intel Iris Xe Graphics
                </p>
                <p>
                  <span className="text-signal">OK</span> NVMe Storage Controller
                </p>
                <p>
                  <span className="text-warn">FIX</span> Hidden network adapter
                </p>
                <p>
                  <span className="text-signal">UPD</span> Lenovo System Update ·
                  queued
                </p>
                <p>
                  <span className="text-signal">UPD</span> Intel DSA · launching
                </p>
              </div>
              <div className="border-t border-[var(--line)] pt-4 font-[family-name:var(--font-mono)] text-xs text-muted">
                --update · Windows Update + OEM/GPU vendors
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-[var(--line)] bg-[#050e14]/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3 md:px-8">
          {[
            {
              title: "Scan",
              body: "Inventory present PnP devices, status codes, and driver versions in one pass.",
            },
            {
              title: "Initiate",
              body: "Enable and start problem or disabled devices when Windows leaves them stuck.",
            },
            {
              title: "Update",
              body: "Pull Windows Update drivers and run OEM/GPU updaters for Lenovo, Dell, HP, Intel, NVIDIA, AMD.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-mist">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-[var(--line)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            © {new Date().getFullYear()} {siteConfig.org}. {siteConfig.name} for
            Windows.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-mist">
              Privacy
            </Link>
            <Link href="/guide" className="hover:text-mist">
              Guide
            </Link>
            <a href={siteConfig.release} className="hover:text-mist" target="_blank" rel="noreferrer">
              Releases
            </a>
            <a href="/sitemap.xml" className="hover:text-mist">
              Sitemap
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
