/// <reference types="vitest" />

/**
 * Vitest global setup
 * Provides mocks for browser globals/Next.js features not available in test env.
 */

// Mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
        prefetch: vi.fn(),
        refresh: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    redirect: vi.fn(),
}));

// Stub env module so tests don't need real env vars
vi.mock('@/config/env', () => ({
    env: {
        appName: 'Rozx Test',
        appUrl: 'http://localhost:3000',
        appEnv: 'local' as const,
        baseDomain: 'rozx.local:3000',
        apiUrl: '/api/v1',
        apiTimeout: 30000,
        sentryDsn: '',
        googleAnalyticsId: '',
        googleTagManagerId: '',
        enableGoogleAuth: false,
        enableWhatsappNotifications: false,
        enableVideoConsultation: false,
        enablePharmacy: false,
        debug: false,
        logLevel: 'error',
    },
    isDevelopment: false,
    isProduction: false,
    isTest: true,
    isServer: false,
    isClient: true,
}));
