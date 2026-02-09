import { env } from './env';

// Feature Flags
export const features = {
    // Authentication Features

    /** Enable Google OAuth login */
    googleAuth: env.enableGoogleAuth,

    /** Enable phone OTP login */
    phoneOtpLogin: true,

    /** Enable email/password login */
    emailPasswordLogin: true,

    /** Enable biometric login (mobile) */
    biometricLogin: false,

    // ===========================================================================
    // Consultation Features
    // ===========================================================================

    /** Enable video consultations */
    videoConsultation: env.enableVideoConsultation,

    /** Enable phone consultations */
    phoneConsultation: true,

    /** Enable home visit bookings */
    homeVisit: false,

    /** Enable consultation recording */
    consultationRecording: false,

    /** Enable chat during consultation */
    consultationChat: true,

    // ===========================================================================
    // Notification Features
    // ===========================================================================

    /** Enable WhatsApp notifications */
    whatsappNotifications: env.enableWhatsappNotifications,

    /** Enable push notifications */
    pushNotifications: true,

    /** Enable email notifications */
    emailNotifications: true,

    /** Enable SMS notifications */
    smsNotifications: true,

    // ===========================================================================
    // E-Commerce & Pharmacy
    // ===========================================================================

    /** Enable pharmacy/medicine ordering */
    pharmacy: env.enablePharmacy,

    /** Enable medicine delivery */
    medicineDelivery: false,

    /** Enable medicine refill reminders */
    refillReminders: true,

    // ===========================================================================
    // Patient Features
    // ===========================================================================

    /** Enable family member management */
    familyMembers: true,

    /** Enable health record uploads */
    healthRecordUpload: true,

    /** Enable vitals tracking */
    vitalsTracking: true,

    /** Enable medication reminders */
    medicationReminders: true,

    /** Enable appointment waitlist */
    appointmentWaitlist: true,

    /** Enable patient credits/wallet */
    patientCredits: false,

    // ===========================================================================
    // Payment Features
    // ===========================================================================

    /** Enable online payments (Razorpay) */
    onlinePayments: true,

    /** Enable wallet payments */
    walletPayments: false,

    /** Enable EMI options */
    emiPayments: false,

    /** Enable coupon codes */
    couponCodes: true,

    /** Enable auto-refund */
    autoRefund: true,

    // ===========================================================================
    // Hospital/Doctor Features
    // ===========================================================================

    /** Enable hospital analytics dashboard */
    hospitalAnalytics: true,

    /** Enable doctor analytics dashboard */
    doctorAnalytics: true,

    /** Enable automated scheduling */
    automatedScheduling: true,

    /** Enable multi-branch hospitals */
    multiBranch: false,

    /** Enable hospital staff management */
    staffManagement: true,

    // ===========================================================================
    // Platform Features
    // ===========================================================================

    /** Enable dark mode */
    darkMode: true,

    /** Enable multi-language support */
    multiLanguage: false,

    /** Enable PWA features */
    pwa: true,

    /** Enable offline mode */
    offlineMode: false,

    /** Enable debug mode */
    debugMode: env.debug,

    /** Enable maintenance mode */
    maintenanceMode: false,

    // ===========================================================================
    // Experimental Features (Beta)
    // ===========================================================================

    /** Enable AI symptom checker (experimental) */
    aiSymptomChecker: false,

    /** Enable prescription OCR (experimental) */
    prescriptionOcr: false,

    /** Enable voice commands (experimental) */
    voiceCommands: false,
} as const;

// =============================================================================
// Feature Flag Helpers
// =============================================================================

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(featureName: keyof typeof features): boolean {
    return features[featureName] ?? false;
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): string[] {
    return Object.entries(features)
        .filter(([, enabled]) => enabled)
        .map(([name]) => name);
}

/**
 * Get all disabled features
 */
export function getDisabledFeatures(): string[] {
    return Object.entries(features)
        .filter(([, enabled]) => !enabled)
        .map(([name]) => name);
}

/**
 * Feature flag hook data (for React)
 */
export function useFeatureFlags() {
    return {
        features,
        isEnabled: isFeatureEnabled,
        enabledFeatures: getEnabledFeatures(),
    };
}

// =============================================================================
// Feature Categories (for admin panel)
// =============================================================================

export const featureCategories = {
    authentication: ['googleAuth', 'phoneOtpLogin', 'emailPasswordLogin', 'biometricLogin'],
    consultation: ['videoConsultation', 'phoneConsultation', 'homeVisit', 'consultationRecording', 'consultationChat'],
    notifications: ['whatsappNotifications', 'pushNotifications', 'emailNotifications', 'smsNotifications'],
    pharmacy: ['pharmacy', 'medicineDelivery', 'refillReminders'],
    patient: ['familyMembers', 'healthRecordUpload', 'vitalsTracking', 'medicationReminders', 'appointmentWaitlist', 'patientCredits'],
    payments: ['onlinePayments', 'walletPayments', 'emiPayments', 'couponCodes', 'autoRefund'],
    provider: ['hospitalAnalytics', 'doctorAnalytics', 'automatedScheduling', 'multiBranch', 'staffManagement'],
    platform: ['darkMode', 'multiLanguage', 'pwa', 'offlineMode', 'debugMode', 'maintenanceMode'],
    experimental: ['aiSymptomChecker', 'prescriptionOcr', 'voiceCommands'],
} as const;

// =============================================================================
// Type Exports
// =============================================================================

export type FeatureFlag = keyof typeof features;
export type FeatureCategory = keyof typeof featureCategories;

export default features;
