/**
 * ROZX Healthcare Platform - SEO Module Index
 */

export {
    defaultMetadata,
    defaultViewport,
    generatePageMetadata,
    generateDoctorMetadata,
    generateHospitalMetadata,
    generateArticleMetadata,
} from './metadata';

export {
    generateOrganizationSchema,
    generateHospitalSchema,
    generateDoctorSchema,
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateJsonLd,
    JsonLdScript,
} from './structured-data';

// OG Image helpers removed from barrel export to prevent 'fs' module error in client bundle
// import directly from './og-image' in server components
