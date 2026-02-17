/**
 * Rozx Healthcare Platform - Config Index
 * Centralized exports for all configuration
 */

// Environment
export { env, isDevelopment, isProduction, isStaging, isTest, isServer, isClient, validateEnv } from './env';
export type { Env, EnvKey } from './env';

// Site Configuration
export { siteConfig, seoConfig, mainNavLinks, footerNavLinks } from './site';
export type { SiteConfig, NavLink } from './site';

// Routes
export {
    routes,
    publicRoutes,
    patientRoutes,
    doctorRoutes,
    hospitalRoutes,
    adminRoutes,
    apiRoutes,
    isPublicRoute,
    getDashboardRoute,
    getRoutePrefix,
} from './routes';

// Feature Flags
export {
    features,
    isFeatureEnabled,
    getEnabledFeatures,
    getDisabledFeatures,
    useFeatureFlags,
    featureCategories,
} from './features';
export type { FeatureFlag, FeatureCategory } from './features';
