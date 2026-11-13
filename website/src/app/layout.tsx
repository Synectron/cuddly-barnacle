import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Windows Driver Scanner & Updater`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Windows driver updater",
    "PnP device scanner",
    "Lenovo System Update",
    "Intel DSA",
    "NVIDIA driver update",
    "DriverScan",
    "Opuskiln",
  ],
  authors: [{ name: siteConfig.org, url: siteConfig.orgUrl }],
  creator: siteConfig.org,
  publisher: siteConfig.org,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Scan, initiate, update Windows drivers`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} for Windows`,
    description: siteConfig.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Windows 10, Windows 11",
    softwareVersion: siteConfig.version,
    downloadUrl: `${siteConfig.url}${siteConfig.downloadPath}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: siteConfig.description,
    publisher: { "@type": "Organization", name: siteConfig.org, url: siteConfig.orgUrl },
  };

  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
