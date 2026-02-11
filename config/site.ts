/**
 * Rozx Healthcare Platform - Site Metadata
 * 
 * Centralized site configuration for SEO, branding, and metadata.
 */

import env from "./env";

// =============================================================================
// Site Configuration
// =============================================================================

export const siteConfig = {
    // Basic Info
    name: 'Rozx Healthcare',
    shortName: 'ROZX',
    tagline: 'Healthcare Made Simple',
    description: 'Book doctor appointments online. Connect with verified doctors, hospitals, and healthcare providers. Video consultations, prescriptions, and health records - all in one place.',

    // URLs
    url: env.appUrl,
    apiUrl: env.apiUrl,

    // Branding
    logo: '/logo/rozx-light-logo.svg',
    logoDark: '/logo/rozx-dark-logo.svg',
    favicon: 'icons/icon.ico',
    appleTouchIcon: 'icons/apple-touch-icon.svg',

    // Social Links
    social: {
        twitter: 'https://twitter.com/rozxhealth',
        facebook: 'https://facebook.com/rozxhealth',
        instagram: 'https://instagram.com/rozxhealth',
        linkedin: 'https://linkedin.com/company/rozx',
    },

    // Contact
    contact: {
        email: 'support@rozx.in',
        phone: '+91 7905861940',
        address: 'India',
    },

    // Legal
    legal: {
        privacyPolicy: '/legal/privacy',
        termsOfService: '/legal/terms',
        refundPolicy: '/legal/refund',
        disclaimer: '/legal/disclaimer',
    },

    // App Store Links
    appLinks: {
        playStore: 'https://play.google.com/store/apps/details?id=com.rozx',
        appStore: 'https://apps.apple.com/app/rozx',
    },
} as const;

// =============================================================================
// SEO Defaults
// =============================================================================

export const seoConfig = {
    titleTemplate: '%s | Rozx Healthcare',
    defaultTitle: 'Rozx Healthcare - Book Doctor Appointments Online',
    keywords: [
        'Healthcare',
        'Doctor Appointment',
        'Hospital',
        'Medical Records',
        'Telemedicine',
        'Online Consultation',
        'India',
    ],

    openGraph: {
        type: 'website',
        locale: 'en_IN',
        siteName: 'Rozx Healthcare',
        images: [
            {
                url: '/images/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Rozx Healthcare',
            },
        ],
    },

    twitter: {
        handle: '@rozxhealth',
        site: '@rozxhealth',
        cardType: 'summary_large_image',
    },

    additionalMetaTags: [
        { name: 'application-name', content: 'ROZX' },
        { name: 'apple-mobile-web-app-title', content: 'ROZX' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'theme-color', content: '#0F766E' },
    ],

    additionalLinkTags: [
        { rel: 'icon', href: '/icons/icon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/apple-touch-icon.svg' },
        { rel: 'manifest', href: '/manifest.json' },
    ],
};

// =============================================================================
// Navigation
// =============================================================================

export const mainNavLinks = [
    { label: 'Home', href: '/' },
    { label: 'Find Doctors', href: '/doctors' },
    { label: 'Hospitals', href: '/hospitals' },
    { label: 'Specialties', href: '/specialties' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
] as const;

export const footerNavLinks = {
    company: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Blog', href: '/blog' },
        { label: 'Press', href: '/press' },
    ],
    patients: [
        { label: 'Find Doctors', href: '/doctors' },
        { label: 'Book Appointment', href: '/patient/book' },
        { label: 'Health Records', href: '/patient/records' },
        { label: 'Medicine Orders', href: '/patient/orders' },
    ],
    providers: [
        { label: 'For Hospitals', href: '/for-hospitals' },
        { label: 'For Doctors', href: '/for-doctors' },
        { label: 'Partner with Us', href: '/partner' },
        { label: 'API Documentation', href: '/developers' },
    ],
    support: [
        { label: 'Help Center', href: '/help' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'FAQs', href: '/faqs' },
        { label: 'Report an Issue', href: '/report' },
    ],
    legal: [
        { label: 'Privacy Policy', href: '/legal/privacy' },
        { label: 'Terms of Service', href: '/legal/terms' },
        { label: 'Refund Policy', href: '/legal/refund' },
    ],
} as const;

// =============================================================================
// Type Exports
// =============================================================================

export type SiteConfig = typeof siteConfig;
export type NavLink = { label: string; href: string };

export default siteConfig;
