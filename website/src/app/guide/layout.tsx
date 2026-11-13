import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guide",
  description:
    "How to download, run, and update Windows drivers with DriverScan — including OEM and GPU vendor updaters.",
  alternates: { canonical: "/guide" },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
