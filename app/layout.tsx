import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { siteConfig } from '@/config/site';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
        'healthcare',
        'telemedicine',
        'doctor appointment',
        'online consultation',
        'video consultation',
        'India healthcare',
        'ROZX',
    ],
    authors: [{ name: 'ROZX Healthcare' }],
    creator: 'ROZX Healthcare',
    metadataBase: new URL(siteConfig.url || 'https://rozx.in'),
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
        images: [
            {
                url: '/opengraph-image.svg',
                width: 1200,
                height: 630,
                alt: siteConfig.name,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: siteConfig.name,
        description: siteConfig.description,
        images: ['/opengraph-image.svg'],
    },
    icons: {
        icon: '/icons/icon.svg',
        shortcut: '/icons/icon.svg',
        apple: '/icons/icon.svg',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    ],
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};


import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { env } from '@/config/env';

export default function RootLayout({ children }: { children: React.ReactNode; }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {env.googleTagManagerId && <GoogleTagManager gtmId={env.googleTagManagerId} />}
                <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
            </head>
            <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
                <Providers>
                    {children}
                </Providers>
                {env.googleAnalyticsId && <GoogleAnalytics gaId={env.googleAnalyticsId} />}
            </body>
        </html>
    );
}
