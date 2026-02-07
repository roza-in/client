// ROZX Healthcare Platform - Environment Configuration

type Environment = 'local' | 'development' | 'production';
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Helpers
const parseBoolean = (value?: string): boolean => value === 'true';

const parseNumber = (value?: string, fallback = 0): number => {
  if (!value) return fallback;
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
};

// Validation
function validateEnv() {
  const required: Record<string, string | undefined> = {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  const appEnv = process.env.NEXT_PUBLIC_APP_ENV as Environment | undefined;

  const shouldCrash = process.env.NODE_ENV === 'development' || appEnv === 'local' || appEnv === 'development';

  if (missing.length > 0) {
    const message = `Missing required environment variables:\n` + missing.join('\n');

    if (shouldCrash) {
      throw new Error(message);
    } else {
      console.error(message);
    }
  }
}
validateEnv();

// Export final typed env object
export const env = {
  // App Info
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'ROZX',
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
  appEnv: (process.env.NEXT_PUBLIC_APP_ENV ?? 'local') as Environment,
  baseDomain: process.env.NEXT_PUBLIC_BASE_DOMAIN,

  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  apiTimeout: parseNumber(process.env.NEXT_PUBLIC_API_TIMEOUT, 30000),

  // Analytics & Monitoring
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID,

  // Feature Flags
  enableGoogleAuth: parseBoolean(process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH),
  enableWhatsappNotifications: parseBoolean(process.env.NEXT_PUBLIC_ENABLE_WHATSAPP),
  enableVideoConsultation: parseBoolean(process.env.NEXT_PUBLIC_ENABLE_VIDEO),
  enablePharmacy: parseBoolean(process.env.NEXT_PUBLIC_ENABLE_PHARMACY),

  // Debugging
  debug: parseBoolean(process.env.NEXT_PUBLIC_DEBUG),
  logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) ?? 'info',
} as const;

export default env;