import type { Metadata } from "next";
import Link from "next/link";
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
    body: `Get DriverScanInit.exe from the homepage download button (v${siteConfig.version}).`,
  },
  {
    title: "Run as Administrator",
    body: "Right-click the EXE → Run as administrator. Elevation is required to initiate and update drivers.",
  },
  {
    title: "Update everything",
    body: "Choose menu option 8, or run DriverScanInit.exe --update to hit Windows Update plus OEM/GPU vendors.",
  },
  {
    title: "Reboot if prompted",
    body: "Some chipset, BIOS, or GPU packages need a restart before the new drivers load.",
  },
];

export default function GuidePage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 md:px-8">
      <Link href="/" className="text-sm text-signal hover:underline">
        ← {siteConfig.name}
      </Link>
      <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-mist">
        How to run DriverScan
      </h1>
      <p className="mt-4 text-muted leading-relaxed">
        DriverScan works on Windows 10/11. Keep an internet connection active so
        Windows Update and vendor tools can download packages.
      </p>

      <ol className="mt-10 space-y-8">
        {steps.map((step, i) => (
          <li key={step.title} className="grid gap-2 border-l border-[var(--line)] pl-5">
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-signal">
              Step {i + 1}
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-mist">
              {step.title}
            </h2>
            <p className="text-muted leading-relaxed">{step.body}</p>
          </li>
        ))}
      </ol>

      <section className="mt-12 rounded-xl border border-[var(--line)] bg-panel/60 p-6">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-mist">
          Useful commands
        </h2>
        <pre className="mt-4 overflow-x-auto font-[family-name:var(--font-mono)] text-sm leading-relaxed text-mist/90">
{`DriverScanInit.exe --detect
DriverScanInit.exe --list-updates
DriverScanInit.exe --update-wu
DriverScanInit.exe --update-vendors
DriverScanInit.exe --update`}
        </pre>
      </section>

      <p className="mt-10">
        <a
          href={siteConfig.downloadPath}
          download
          className="inline-flex rounded-md bg-signal px-5 py-3 font-bold text-ink hover:bg-signal-deep"
        >
          Download DriverScanInit.exe
        </a>
      </p>
    </main>
  );
}
