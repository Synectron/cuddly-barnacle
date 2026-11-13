import Link from "next/link";
import { HeroStage } from "@/components/HeroStage";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 500px at 8% 0%, rgba(15,108,189,0.14), transparent 50%), linear-gradient(180deg, #f8fafc 0%, var(--bg) 42%, #e8eef5 100%)",
          }}
        />
        <div aria-hidden className="noise pointer-events-none absolute inset-0" />

        <SiteHeader />

        <div className="relative z-10 grid min-h-[calc(100svh-4.5rem)] lg:grid-cols-[minmax(22rem,0.92fr)_1.08fr]">
          <div className="flex flex-col justify-center px-6 pb-12 pt-8 md:px-10 lg:pl-[max(2rem,calc((100vw-72rem)/2+2rem))] lg:pr-12 lg:pt-4">
            <p className="anim-1 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              Opuskiln utility
            </p>
            <h1 className="anim-1 mt-4 font-display text-[clamp(3.8rem,11vw,7.2rem)] font-extrabold leading-[0.86] tracking-[-0.05em] text-ink">
              {siteConfig.name}
            </h1>
            <p className="anim-2 mt-6 max-w-[28rem] text-[1.15rem] leading-relaxed text-muted md:text-[1.25rem]">
              Scan stuck devices, start dead drivers, and pull the latest updates from Windows and
              the big OEM/GPU vendors.
            </p>
            <div className="anim-3 mt-9 flex flex-wrap gap-3">
              <a href={siteConfig.downloadPath} download className="btn btn-primary">
                Download for Windows
              </a>
              <Link href="/guide" className="btn btn-ghost">
                How to run
              </Link>
            </div>
            <p className="mt-5 font-mono text-xs tracking-wide text-muted">
              v{siteConfig.version} · DriverScanInit.exe · Run as Administrator
            </p>
          </div>

          <div className="relative min-h-[440px] lg:min-h-full">
            <HeroStage />
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-bg">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">Workflow</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] text-ink md:text-5xl">
              Three moves. One elevated EXE.
            </h2>
          </div>

          <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Scan",
                body: "Map present PnP devices, status codes, and driver versions before you change anything.",
              },
              {
                n: "02",
                title: "Initiate",
                body: "Enable and start problem or disabled devices Windows left half-asleep.",
              },
              {
                n: "03",
                title: "Update",
                body: "Install Windows Update drivers, then kick Lenovo, Dell, HP, Intel, NVIDIA, or AMD tools.",
              },
            ].map((item) => (
              <article key={item.n} className="relative pt-2">
                <p className="font-mono text-sm text-accent">{item.n}</p>
                <h3 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-sm text-[0.98rem] leading-relaxed text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-[var(--line)] bg-ink text-[#edf2f7]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(700px 320px at 90% 20%, rgba(15,108,189,0.35), transparent 60%)",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 py-16 md:flex-row md:items-center md:px-8 md:py-20">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-bold tracking-[-0.03em] md:text-4xl">
              Grab the EXE and run elevated.
            </h2>
            <p className="mt-3 text-[#b7c3cf]">
              Free download. No account. Use <span className="font-mono text-[#9ec5ef]">--update</span>{" "}
              when you want Windows Update plus vendor updaters in one pass.
            </p>
          </div>
          <a href={siteConfig.downloadPath} download className="btn btn-primary bg-white !text-ink hover:!bg-accent hover:!text-white">
            Get DriverScanInit.exe
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
