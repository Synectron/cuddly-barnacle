import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guide",
  description:
    "How to download, run, and update Windows drivers with DriverScan — including OEM and GPU vendor updaters.",
  alternates: { canonical: "/guide" },
};

const steps = [
  {
    title: "Download the EXE",
    body: `Get DriverScanInit.exe from the homepage (v${siteConfig.version}).`,
  },
  {
    title: "Run as Administrator",
    body: "Right-click → Run as administrator. Elevation is required to initiate and update drivers.",
  },
  {
    title: "Update everything",
    body: "Menu option 8, or DriverScanInit.exe --update for Windows Update plus OEM/GPU vendors.",
  },
  {
    title: "Reboot if prompted",
    body: "Chipset, BIOS, and GPU packages often need a restart before they finish loading.",
  },
];

export default function GuidePage() {
  return (
    <main className="flex flex-1 flex-col bg-bg">
      <SiteHeader />
      <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-14 md:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">Guide</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.04em] text-ink md:text-6xl">
          How to run DriverScan
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Windows 10/11. Keep internet on so Windows Update and vendor tools can download packages.
        </p>

        <ol className="mt-14 space-y-10">
          {steps.map((step, i) => (
            <li key={step.title} className="border-t border-[var(--line)] pt-7">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                Step {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.03em] text-ink">
                {step.title}
              </h2>
              <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        <section className="mt-14 border border-[var(--line)] bg-white/60 p-6 md:p-8">
          <h2 className="font-display text-xl font-bold text-ink">Useful commands</h2>
          <pre className="mt-4 overflow-x-auto font-mono text-sm leading-relaxed text-ink-2">
{`DriverScanInit.exe --detect
DriverScanInit.exe --list-updates
DriverScanInit.exe --update-wu
DriverScanInit.exe --update-vendors
DriverScanInit.exe --update`}
          </pre>
        </section>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href={siteConfig.downloadPath} download className="btn btn-primary">
            Download DriverScanInit.exe
          </a>
          <Link href="/" className="text-sm font-semibold text-accent hover:text-accent-2">
            ← Back home
          </Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
