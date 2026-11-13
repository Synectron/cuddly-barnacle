import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for the DriverScan website and Windows utility.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 md:px-8">
      <Link href="/" className="text-sm text-signal hover:underline">
        ← {siteConfig.name}
      </Link>
      <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-mist">
        Privacy
      </h1>
      <div className="mt-6 space-y-4 text-muted leading-relaxed">
        <p>
          The DriverScan website is a static download page. It does not require
          an account and does not intentionally collect personal information.
        </p>
        <p>
          The Windows EXE runs locally on your machine. Update flows may contact
          Microsoft Windows Update and official OEM/GPU vendor services
          (for example Lenovo, Dell, HP, Intel, NVIDIA, AMD) to discover and
          install drivers. Those services are governed by their own privacy
          policies.
        </p>
        <p>
          Hosting analytics, if enabled later on Vercel, would process standard
          request metadata such as pages visited and approximate region. No
          driver inventory is uploaded to SoftCoe by the current build.
        </p>
        <p>
          Questions: visit{" "}
          <a href={siteConfig.orgUrl} className="text-signal hover:underline">
            {siteConfig.orgUrl}
          </a>
          .
        </p>
      </div>
    </main>
  );
}
