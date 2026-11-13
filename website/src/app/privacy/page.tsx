import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for the DriverScan website and Windows utility.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="flex flex-1 flex-col bg-bg">
      <SiteHeader />
      <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-14 md:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.04em] text-ink md:text-6xl">
          Privacy
        </h1>
        <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted">
          <p>
            The DriverScan website is a static download page. It does not require an account and does
            not intentionally collect personal information.
          </p>
          <p>
            The Windows EXE runs locally. Update flows may contact Microsoft Windows Update and
            official OEM/GPU vendor services (Lenovo, Dell, HP, Intel, NVIDIA, AMD). Those services
            follow their own privacy policies.
          </p>
          <p>
            If Vercel analytics are enabled later, they would see standard request metadata only. No
            driver inventory is uploaded to Opuskiln by the current build.
          </p>
          <p>
            Questions:{" "}
            <a href={siteConfig.orgUrl} className="font-semibold text-accent hover:text-accent-2">
              {siteConfig.orgUrl}
            </a>
          </p>
        </div>
        <p className="mt-10">
          <Link href="/" className="text-sm font-semibold text-accent hover:text-accent-2">
            ← Back home
          </Link>
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
