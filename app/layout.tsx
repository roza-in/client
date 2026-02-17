import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { defaultMetadata, defaultViewport } from '@/lib/seo/metadata';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = defaultViewport;


import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { env } from '@/config/env';

export default function RootLayout({ children }: { children: React.ReactNode; }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {env.googleTagManagerId && <GoogleTagManager gtmId={env.googleTagManagerId} />}
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
