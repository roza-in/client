import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "sonner";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "ROZX - Digital Operating System for Indian Healthcare",
    template: "%s | ROZX",
  },
  description: "ROZX is the Digital Operating System for Indian Hospitals & Clinics. Modern, affordable SaaS platform for patient bookings, doctor management, and hospital operations.",
  keywords: ["Healthcare", "Hospital Management", "Doctor Booking", "Patient Management", "India Healthcare", "Medical SaaS", "ROZX"],
  authors: [
    {
      name: "ROZX Team",
      url: "https://rozx.in",
    },
  ],
  creator: "ROZX Team",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://rozx.in",
    title: "ROZX - Digital Operating System for Indian Healthcare",
    description: "Modern, affordable SaaS platform for patient bookings, doctor management, and hospital operations.",
    siteName: "ROZX",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ROZX - Healthcare Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ROZX - Digital Operating System for Indian Healthcare",
    description: "Modern, affordable SaaS platform for patient bookings, doctor management, and hospital operations.",
    creator: "@rozxhealth",
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
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
            >
              Skip to main content
            </a>
            <main id="main-content" className="relative">
              {children}
            </main>
          </AuthProvider>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              className: 'bg-card text-card-foreground border border-border',
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}