import Link from "next/link";
import { HeroStage } from "@/components/HeroStage";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="relative isolate min-h-[100svh] overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(1000px 520px at 12% -10%, rgba(11,127,134,0.12), transparent 55%), linear-gradient(180deg, #f7f9fb 0%, var(--paper) 40%, #e8eef4 100%)",
          }}
        />

        <SiteHeader />

        <section className="relative z-10 grid min-h-[calc(100svh-4.75rem)] w-full items-stretch md:grid-cols-[minmax(0,36rem)_1fr] lg:grid-cols-[minmax(0,40rem)_1fr]">
          <div className="mx-auto flex w-full max-w-6xl flex-col justify-center px-6 py-10 md:mx-0 md:ml-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] md:max-w-none md:px-0 md:py-16 md:pr-12">
            <h1 className="anim-rise font-display text-[clamp(3.6rem,10vw,6.8rem)] font-extrabold leading-[0.88] tracking-[-0.045em] text-ink">
              {siteConfig.name}
            </h1>
            <p className="anim-rise-2 mt-6 max-w-md text-lg leading-relaxed text-muted md:text-xl">
              Scan, start, and update Windows drivers — including OEM and GPU
              vendors.
            </p>
            <div className="anim-rise-3 mt-9 flex flex-wrap items-center gap-3">
              <a href={siteConfig.downloadPath} download className="btn-primary">
                Download for Windows
              </a>
              <Link href="/guide" className="btn-secondary">
                How to run
              </Link>
            </div>
            <p className="mt-5 font-mono text-xs tracking-wide text-muted">
              v{siteConfig.version} · DriverScanInit.exe · Run as Administrator
            </p>
          </div>

          <div className="relative min-h-[360px] w-full md:min-h-full">
            <HeroStage />
          </div>
        </section>
      </div>

      <section className="border-t border-[var(--line)] bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
            What it does
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            One utility for stuck devices and outdated drivers.
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
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
                body: "Pull Windows Update drivers and run Lenovo, Dell, HP, Intel, NVIDIA, and AMD updaters.",
              },
            ].map((item) => (
              <div key={item.title} className="border-t border-[var(--line)] pt-5">
                <h3 className="font-display text-2xl font-bold text-ink">{item.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-paper-deep/60">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-14 md:flex-row md:items-center md:px-8">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
              Free Windows download
            </h2>
            <p className="mt-2 max-w-xl text-muted">
              No installer account. Run elevated, then use --update for Windows Update plus vendor tools.
            </p>
          </div>
          <a href={siteConfig.downloadPath} download className="btn-primary shrink-0">
            Get DriverScanInit.exe
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
