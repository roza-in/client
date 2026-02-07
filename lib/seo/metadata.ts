/**
 * ROZX Healthcare Platform - SEO Metadata Helpers
 * 
 * Next.js metadata generation utilities.
 */

import type { Metadata, Viewport } from 'next';
import { siteConfig, seoConfig } from '@/config/site';

// =============================================================================
// Default Metadata
// =============================================================================

export const defaultViewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    ],
};

export const defaultMetadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: siteConfig.name,
        template: seoConfig.titleTemplate,
    },
    description: siteConfig.description,
    keywords: seoConfig.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: siteConfig.url,
        siteName: siteConfig.name,
        title: siteConfig.name,
        description: siteConfig.description,
        images: [
            {
                url: seoConfig.openGraph?.images?.[0]?.url || '/og-image.jpg',
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
        images: [seoConfig.openGraph?.images?.[0]?.url || '/og-image.jpg'],
        creator: seoConfig.twitter?.handle,
    },
    icons: {
        icon: '/icons/icon.svg',
        shortcut: '/icons/icon.svg',
        apple: '/icons/icon.svg',
    },
    manifest: '/manifest.json',
};

// =============================================================================
// Metadata Generators
// =============================================================================

interface PageMetadataOptions {
    title: string;
    description?: string;
    image?: string;
    noIndex?: boolean;
    canonical?: string;
}

/**
 * Generate metadata for a page
 */
export function generatePageMetadata(options: PageMetadataOptions): Metadata {
    const { title, description, image, noIndex = false, canonical } = options;

    return {
        title,
        description: description || siteConfig.description,
        openGraph: {
            title,
            description: description || siteConfig.description,
            images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
        },
        twitter: {
            title,
            description: description || siteConfig.description,
            images: image ? [image] : undefined,
        },
        robots: noIndex ? { index: false, follow: false } : undefined,
        alternates: canonical ? { canonical } : undefined,
    };
}

/**
 * Generate metadata for a doctor profile
 */
export function generateDoctorMetadata(doctor: {
    name: string;
    specialization: string;
    hospital?: string;
    slug: string;
    image?: string;
}): Metadata {
    const title = `Dr. ${doctor.name} - ${doctor.specialization}`;
    const description = doctor.hospital
        ? `Book an appointment with Dr. ${doctor.name}, ${doctor.specialization} at ${doctor.hospital}. View availability and book online.`
        : `Book an appointment with Dr. ${doctor.name}, ${doctor.specialization}. View availability and book online.`;

    return generatePageMetadata({
        title,
        description,
        image: doctor.image,
        canonical: `${siteConfig.url}/doctors/${doctor.slug}`,
    });
}

/**
 * Generate metadata for a hospital profile
 */
export function generateHospitalMetadata(hospital: {
    name: string;
    city: string;
    type?: string;
    slug: string;
    image?: string;
}): Metadata {
    const title = `${hospital.name} - ${hospital.city}`;
    const description = `View doctors, specialties, and book appointments at ${hospital.name}, ${hospital.city}. Online consultation and in-person visits available.`;

    return generatePageMetadata({
        title,
        description,
        image: hospital.image,
        canonical: `${siteConfig.url}/hospitals/${hospital.slug}`,
    });
}

/**
 * Generate metadata for blog/article
 */
export function generateArticleMetadata(article: {
    title: string;
    description: string;
    slug: string;
    image?: string;
    author?: string;
    publishedAt?: string;
    modifiedAt?: string;
}): Metadata {
    return {
        ...generatePageMetadata({
            title: article.title,
            description: article.description,
            image: article.image,
            canonical: `${siteConfig.url}/blog/${article.slug}`,
        }),
        openGraph: {
            type: 'article',
            title: article.title,
            description: article.description,
            images: article.image ? [{ url: article.image }] : undefined,
            publishedTime: article.publishedAt,
            modifiedTime: article.modifiedAt,
            authors: article.author ? [article.author] : undefined,
        },
    };
}

export default {
    defaultMetadata,
    defaultViewport,
    generatePageMetadata,
    generateDoctorMetadata,
    generateHospitalMetadata,
    generateArticleMetadata,
};
