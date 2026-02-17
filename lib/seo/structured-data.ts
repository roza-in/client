/**
 * ROZX Healthcare Platform — Structured Data (JSON-LD)
 *
 * Schema.org structured data for search engine rich results.
 * Google-recommended types: MedicalOrganization, Physician, FAQPage,
 * BreadcrumbList, WebSite (with SearchAction), AggregateRating.
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

import { siteConfig } from '@/config/site';

// =============================================================================
// Schema Generators
// =============================================================================

/**
 * Organization + WebSite (homepage)
 * Enables Google Knowledge Panel + Sitelinks Search Box
 */
export function generateOrganizationSchema() {
    return [
        {
            '@type': 'Organization',
            '@id': `${siteConfig.url}/#organization`,
            name: siteConfig.name,
            url: siteConfig.url,
            logo: {
                '@type': 'ImageObject',
                url: `${siteConfig.url}${siteConfig.logo}`,
                width: 512,
                height: 512,
            },
            sameAs: Object.values(siteConfig.social || {}),
            contactPoint: {
                '@type': 'ContactPoint',
                telephone: siteConfig.contact.phone,
                contactType: 'customer service',
                areaServed: 'IN',
                availableLanguage: ['English', 'Hindi'],
            },
        },
        {
            '@type': 'WebSite',
            '@id': `${siteConfig.url}/#website`,
            name: siteConfig.name,
            url: siteConfig.url,
            publisher: { '@id': `${siteConfig.url}/#organization` },
            potentialAction: {
                '@type': 'SearchAction',
                target: {
                    '@type': 'EntryPoint',
                    urlTemplate: `${siteConfig.url}/doctors?search={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
            },
        },
    ];
}

/**
 * MedicalOrganization (hospital/clinic detail page)
 * Enables rich result with address, rating, specialties, geo
 */
export function generateHospitalSchema(hospital: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    logo?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
    email?: string;
    website?: string;
    latitude?: number;
    longitude?: number;
    rating?: number;
    totalRatings?: number;
    specialties?: string[];
    facilities?: string[];
    departments?: string[];
    accreditations?: string[];
    foundingYear?: number;
    emergencyServices?: boolean;
    type?: string;
}) {
    const result: Record<string, unknown> = {
        '@type': 'MedicalOrganization',
        '@id': `${siteConfig.url}/hospitals/${hospital.slug}#hospital`,
        name: hospital.name,
        url: `${siteConfig.url}/hospitals/${hospital.slug}`,
        description: hospital.description,
        image: hospital.image,
        logo: hospital.logo,
        telephone: hospital.phone,
        email: hospital.email,
        medicalSpecialty: hospital.specialties,
        isPartOf: { '@id': `${siteConfig.url}/#organization` },
    };

    if (hospital.address || hospital.city) {
        result.address = {
            '@type': 'PostalAddress',
            streetAddress: hospital.address,
            addressLocality: hospital.city,
            addressRegion: hospital.state,
            postalCode: hospital.pincode,
            addressCountry: 'IN',
        };
    }

    if (hospital.latitude && hospital.longitude) {
        result.geo = {
            '@type': 'GeoCoordinates',
            latitude: hospital.latitude,
            longitude: hospital.longitude,
        };
    }

    if (hospital.rating && hospital.totalRatings) {
        result.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: hospital.rating,
            bestRating: 5,
            ratingCount: hospital.totalRatings,
        };
    }

    if (hospital.emergencyServices) {
        result.hasOfferCatalog = {
            '@type': 'OfferCatalog',
            name: 'Emergency Services',
            itemListElement: [{ '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: '24/7 Emergency Care' } }],
        };
    }

    if (hospital.foundingYear) {
        result.foundingDate = String(hospital.foundingYear);
    }

    if (hospital.departments?.length) {
        result.department = hospital.departments.map((d) => ({
            '@type': 'MedicalOrganization',
            name: d,
        }));
    }

    if (hospital.accreditations?.length) {
        result.hasCredential = hospital.accreditations.map((a) => ({
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Accreditation',
            name: a,
        }));
    }

    return result;
}

/**
 * Physician (doctor profile page)
 * Enables rich result with rating, qualifications, fees
 */
export function generateDoctorSchema(doctor: {
    name: string;
    slug: string;
    specialization: string;
    image?: string;
    description?: string;
    hospital?: string;
    hospitalSlug?: string;
    city?: string;
    state?: string;
    qualifications?: string[];
    experience?: number;
    rating?: number;
    totalRatings?: number;
    fee?: number;
    languages?: string[];
    conditionsTreated?: string[];
    proceduresPerformed?: string[];
    awards?: string[];
    memberships?: string[];
}) {
    const result: Record<string, unknown> = {
        '@type': 'Physician',
        '@id': `${siteConfig.url}/doctors/${doctor.slug}#physician`,
        name: `Dr. ${doctor.name}`,
        url: `${siteConfig.url}/doctors/${doctor.slug}`,
        image: doctor.image,
        description: doctor.description,
        medicalSpecialty: doctor.specialization,
        knowsLanguage: doctor.languages || ['English', 'Hindi'],
    };

    if (doctor.hospital) {
        result.worksFor = {
            '@type': 'MedicalOrganization',
            name: doctor.hospital,
            ...(doctor.hospitalSlug ? { url: `${siteConfig.url}/hospitals/${doctor.hospitalSlug}` } : {}),
        };
    }

    if (doctor.city) {
        result.address = {
            '@type': 'PostalAddress',
            addressLocality: doctor.city,
            addressRegion: doctor.state || '',
            addressCountry: 'IN',
        };
    }

    if (doctor.qualifications?.length) {
        result.hasCredential = doctor.qualifications.map((q) => ({
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'degree',
            name: q,
        }));
    }

    if (doctor.rating && doctor.totalRatings) {
        result.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: doctor.rating,
            bestRating: 5,
            ratingCount: doctor.totalRatings,
        };
    }

    if (doctor.fee) {
        result.priceRange = `₹${doctor.fee}`;
    }

    if (doctor.conditionsTreated?.length) {
        result.availableService = doctor.conditionsTreated.map((c) => ({
            '@type': 'MedicalProcedure',
            name: c,
        }));
    }

    if (doctor.awards?.length) {
        result.award = doctor.awards;
    }

    if (doctor.memberships?.length) {
        result.memberOf = doctor.memberships.map((m) => ({
            '@type': 'Organization',
            name: m,
        }));
    }

    return result;
}

/**
 * MedicalSpecialty listing schema (ItemList)
 * For specialty listing pages
 */
export function generateSpecialtyListSchema(specialties: { name: string; slug: string; description?: string }[]) {
    return {
        '@type': 'ItemList',
        itemListElement: specialties.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'MedicalSpecialty',
                name: s.name,
                url: `${siteConfig.url}/doctors?specialty=${s.slug}`,
                description: s.description,
            },
        })),
    };
}

/**
 * BreadcrumbList schema
 */
export function generateBreadcrumbSchema(
    items: { name: string; url?: string }[]
) {
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
 * FAQPage schema
 */
export function generateFAQSchema(
    faqs: { question: string; answer: string }[]
) {
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

/**
 * MedicalWebPage schema (for doctor listing / hospital listing pages)
 */
export function generateMedicalWebPageSchema(options: {
    name: string;
    description: string;
    url: string;
}) {
    return {
        '@type': 'MedicalWebPage',
        name: options.name,
        description: options.description,
        url: `${siteConfig.url}${options.url}`,
        isPartOf: { '@id': `${siteConfig.url}/#website` },
    };
}

// =============================================================================
// JSON-LD Helpers
// =============================================================================

/**
 * Wrap schema(s) with @context for JSON-LD injection
 */
export function generateJsonLd(schema: object | object[]): string {
    const wrapper = {
        '@context': 'https://schema.org',
        ...(Array.isArray(schema) ? { '@graph': schema } : schema),
    };
    return JSON.stringify(wrapper);
}

/**
 * Returns dangerouslySetInnerHTML-compatible object for <script> tag
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
    generateSpecialtyListSchema,
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateMedicalWebPageSchema,
    generateJsonLd,
    JsonLdScript,
};
