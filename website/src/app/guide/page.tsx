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
    body: "Right-click the EXE → Run as administrator. Elevation is required to initiate and update drivers.",
  },
  {
    title: "Update everything",
    body: "Choose menu option 8, or run DriverScanInit.exe --update for Windows Update plus OEM/GPU vendors.",
  },
  {
    title: "Reboot if prompted",
    body: "Some chipset, BIOS, or GPU packages need a restart before the new drivers load.",
  },
];

export default function GuidePage() {
  return (
    <main className="flex flex-1 flex-col bg-paper">
      <SiteHeader />
      <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 md:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">Guide</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
          How to run DriverScan
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Works on Windows 10/11. Keep internet on so Windows Update and vendor tools can download packages.
        </p>

        <ol className="mt-12 space-y-10">
          {steps.map((step, i) => (
            <li key={step.title} className="grid gap-2 border-t border-[var(--line)] pt-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                Step {i + 1}
              </p>
              <h2 className="font-display text-2xl font-bold text-ink">{step.title}</h2>
              <p className="leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        <section className="mt-14 border border-[var(--line)] bg-white/70 p-6">
          <h2 className="font-display text-xl font-bold text-ink">Useful commands</h2>
          <pre className="mt-4 overflow-x-auto font-mono text-sm leading-relaxed text-ink-soft">
{`DriverScanInit.exe --detect
DriverScanInit.exe --list-updates
DriverScanInit.exe --update-wu
DriverScanInit.exe --update-vendors
DriverScanInit.exe --update`}
          </pre>
        </section>

        <p className="mt-10">
          <a href={siteConfig.downloadPath} download className="btn-primary">
            Download DriverScanInit.exe
          </a>
        </p>
        <p className="mt-6">
          <Link href="/" className="text-sm font-medium text-accent hover:text-accent-deep">
            ← Back home
          </Link>
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
