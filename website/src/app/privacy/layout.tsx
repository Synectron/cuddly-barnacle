import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for the DriverScan website and Windows utility.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
