/**
 * Rozx Healthcare Platform - Structured Data (JSON-LD)
 * 
 * Schema.org structured data for SEO.
 */

import { siteConfig } from '@/config/site';

// =============================================================================
// Types
// =============================================================================

interface Organization {
    '@type': 'Organization';
    name: string;
    url: string;
    logo: string;
    sameAs?: string[];
    contactPoint?: {
        '@type': 'ContactPoint';
        telephone: string;
        contactType: string;
        areaServed: string;
    };
}

interface MedicalOrganization {
    '@type': 'MedicalOrganization';
    name: string;
    url: string;
    description?: string;
    image?: string;
    address?: {
        '@type': 'PostalAddress';
        streetAddress: string;
        addressLocality: string;
        addressRegion: string;
        postalCode: string;
        addressCountry: string;
    };
    telephone?: string;
    priceRange?: string;
    medicalSpecialty?: string[];
}

interface Physician {
    '@type': 'Physician';
    name: string;
    url: string;
    image?: string;
    description?: string;
    medicalSpecialty?: string;
    worksFor?: {
        '@type': 'MedicalOrganization';
        name: string;
    };
    address?: {
        '@type': 'PostalAddress';
        addressLocality: string;
        addressRegion: string;
    };
}

interface BreadcrumbList {
    '@type': 'BreadcrumbList';
    itemListElement: {
        '@type': 'ListItem';
        position: number;
        name: string;
        item?: string;
    }[];
}

interface FAQPage {
    '@type': 'FAQPage';
    mainEntity: {
        '@type': 'Question';
        name: string;
        acceptedAnswer: {
            '@type': 'Answer';
            text: string;
        };
    }[];
}

// =============================================================================
// Schema Generators
// =============================================================================

/**
 * Generate organization schema
 */
export function generateOrganizationSchema(): Organization {
    return {
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}${siteConfig.logo}`,
        sameAs: Object.values(siteConfig.social || {}),
        contactPoint: siteConfig.contact ? {
            '@type': 'ContactPoint',
            telephone: siteConfig.contact.phone,
            contactType: 'customer service',
            areaServed: 'IN',
        } : undefined,
    };
}

/**
 * Generate hospital/clinic schema
 */
export function generateHospitalSchema(hospital: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    address?: {
        line1: string;
        city: string;
        state: string;
        pincode: string;
    };
    phone?: string;
    specialties?: string[];
}): MedicalOrganization {
    return {
        '@type': 'MedicalOrganization',
        name: hospital.name,
        url: `${siteConfig.url}/hospitals/${hospital.slug}`,
        description: hospital.description,
        image: hospital.image,
        address: hospital.address ? {
            '@type': 'PostalAddress',
            streetAddress: hospital.address.line1,
            addressLocality: hospital.address.city,
            addressRegion: hospital.address.state,
            postalCode: hospital.address.pincode,
            addressCountry: 'IN',
        } : undefined,
        telephone: hospital.phone,
        medicalSpecialty: hospital.specialties,
    };
}

/**
 * Generate doctor schema
 */
export function generateDoctorSchema(doctor: {
    name: string;
    slug: string;
    specialization: string;
    image?: string;
    description?: string;
    hospital?: string;
    city?: string;
    state?: string;
}): Physician {
    return {
        '@type': 'Physician',
        name: `Dr. ${doctor.name}`,
        url: `${siteConfig.url}/doctors/${doctor.slug}`,
        image: doctor.image,
        description: doctor.description,
        medicalSpecialty: doctor.specialization,
        worksFor: doctor.hospital ? {
            '@type': 'MedicalOrganization',
            name: doctor.hospital,
        } : undefined,
        address: doctor.city ? {
            '@type': 'PostalAddress',
            addressLocality: doctor.city,
            addressRegion: doctor.state || '',
        } : undefined,
    };
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(
    items: { name: string; url?: string }[]
): BreadcrumbList {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url ? `${siteConfig.url}${item.url}` : undefined,
        })),
    };
}

/**
 * Generate FAQ schema
 */
export function generateFAQSchema(
    faqs: { question: string; answer: string }[]
): FAQPage {
    return {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}

// =============================================================================
// JSON-LD Script Generator
// =============================================================================

/**
 * Generate JSON-LD script tag content
 */
export function generateJsonLd(schema: object | object[]): string {
    const wrapper = {
        '@context': 'https://schema.org',
        ...(Array.isArray(schema) ? { '@graph': schema } : schema),
    };
    return JSON.stringify(wrapper);
}

/**
 * Create JSON-LD script element (for use in components)
 */
export function JsonLdScript({ data }: { data: object | object[] }) {
    return {
        __html: generateJsonLd(data),
    };
}

export default {
    generateOrganizationSchema,
    generateHospitalSchema,
    generateDoctorSchema,
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateJsonLd,
    JsonLdScript,
};
