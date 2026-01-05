import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Font Configuration
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Metadata Configuration
export const metadata: Metadata = {
  title: {
    default: "Rozx",
    template: "%s | Rozx",
  },
  description: "A modern web application built with Next.js 16 and Tailwind CSS v4",
  keywords: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
  authors: [
    {
      name: "Rozx Team",
      url: "https://rozx.in",
    },
  ],
  creator: "Rozx Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rozx.in",
    title: "Rozx",
    description: "A modern web application built with Next.js 16 and Tailwind CSS v4",
    siteName: "Rozx",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rozx Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rozx",
    description: "A modern web application built with Next.js 16 and Tailwind CSS v4",
    creator: "@rozxteam",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png" },
    ],
  },
  manifest: "/manifest.json",
};

// Viewport Configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased min-h-screen bg-background text-foreground">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        >
          Skip to main content
        </a>
        <main id="main-content" className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}