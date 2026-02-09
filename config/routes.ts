/**
 * ROZX Healthcare Platform - Route Definitions
 * 
 * Centralized route configuration for type-safe navigation.
 */

// =============================================================================
// Public Routes (No authentication required)
// =============================================================================

export const publicRoutes = {
    home: '/',
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',

    // Doctor & Hospital Discovery
    doctors: '/doctors',
    doctor: (id: string) => `/doctors/${id}`,
    doctorBySlug: (slug: string) => `/doctors/${slug}`,

    hospitals: '/hospitals',
    hospital: (id: string) => `/hospitals/${id}`,
    hospitalBySlug: (slug: string) => `/hospitals/${slug}`,

    specialties: '/specialties',
    specialty: (slug: string) => `/specialties/${slug}`,

    // Static Pages
    about: '/about',
    contact: '/contact',
    faqs: '/faqs',
    help: '/help',

    // Legal
    privacy: '/legal/privacy',
    terms: '/legal/terms',
    refund: '/legal/refund',
} as const;

// =============================================================================
// Patient Routes
// =============================================================================

export const patientRoutes = {
    dashboard: '/patient',
    profile: '/patient/profile',

    // Appointments
    bookAppointment: '/patient/book',
    bookDoctor: (doctorId: string) => `/patient/book/${doctorId}`,
    paymentReview: (appointmentId: string) => `/patient/book/payment/${appointmentId}`,
    appointments: '/patient/appointments',
    appointment: (id: string) => `/patient/appointments/${id}`,

    // Prescriptions
    prescriptions: '/patient/prescriptions',
    prescription: (id: string) => `/patient/prescriptions/${id}`,

    // Health Records
    records: '/patient/records',
    uploadRecord: '/patient/records/upload',
    record: (id: string) => `/patient/records/${id}`,

    // Family
    family: '/patient/family',
    addFamilyMember: '/patient/family/add',
    familyMember: (id: string) => `/patient/family/${id}`,

    // Payments
    payments: '/patient/payments',
    payment: (id: string) => `/patient/payments/${id}`,

    // Vitals
    vitals: '/patient/vitals',

    // Settings
    settings: '/patient/settings',
    notifications: '/patient/notifications',
} as const;

// =============================================================================
// Doctor Routes
// =============================================================================

export const doctorRoutes = {
    dashboard: '/doctor',
    appointments: '/doctor/appointments',
    appointment: (id: string) => `/doctor/appointments/${id}`,

    // Patients
    patients: '/doctor/patients',
    patient: (id: string) => `/doctor/patients/${id}`,

    // Prescriptions
    prescriptions: '/doctor/prescriptions',
    createPrescription: (appointmentId: string) => `/doctor/prescriptions/new?appointment=${appointmentId}`,

    // Schedule
    schedule: '/doctor/schedule',
    leaves: '/doctor/leaves',

    // Consultations
    consultations: '/doctor/consultations',
    consultation: (id: string) => `/doctor/consultations/${id}`,
    videoRoom: (roomId: string) => `/doctor/video/${roomId}`,

    // Analytics
    analytics: '/doctor/analytics',

    // Profile
    profile: '/doctor/profile',
    settings: '/doctor/settings',
} as const;

// =============================================================================
// Hospital Routes
// =============================================================================

export const hospitalRoutes = {
    dashboard: '/hospital',
    profile: '/hospital/profile',

    // Doctors
    doctors: '/hospital/doctors',
    doctor: (id: string) => `/hospital/doctors/${id}`,
    addDoctor: '/hospital/doctors/add',

    // Appointments
    appointments: '/hospital/appointments',
    appointment: (id: string) => `/hospital/appointments/${id}`,

    // Reception (deprecated - use /reception for reception users)
    reception: '/hospital/reception',
    checkIn: (appointmentId: string) => `/hospital/reception/check-in/${appointmentId}`,

    // Patients
    patients: '/hospital/patients',
    patient: (id: string) => `/hospital/patients/${id}`,

    // Availability & Schedule
    availability: '/hospital/availability',

    // Payments & Billing
    payments: '/hospital/payments',
    invoices: '/hospital/invoices',
    settlements: '/hospital/settlements',

    // Staff
    staff: '/hospital/staff',
    addStaff: '/hospital/staff/add',

    // Analytics
    analytics: '/hospital/analytics',

    // Settings
    settings: '/hospital/settings',
} as const;

// =============================================================================
// Reception Routes
// =============================================================================

export const receptionRoutes = {
    dashboard: '/reception',
    queue: '/reception/queue',
    walkinBooking: '/reception/book',
    checkIn: (appointmentId: string) => `/reception/check-in/${appointmentId}`,
    patients: '/reception/patients',
    schedule: '/reception/schedule',
} as const;

// =============================================================================
// Pharmacy Routes
// =============================================================================

export const pharmacyRoutes = {
    dashboard: '/pharmacy',
    orders: '/pharmacy/orders',
    order: (id: string) => `/pharmacy/orders/${id}`,
    inventory: '/pharmacy/inventory',
    search: '/pharmacy/search',
    settings: '/pharmacy/settings',
} as const;

// =============================================================================
// Admin Routes
// =============================================================================

export const adminRoutes = {
    dashboard: '/admin',

    // Management
    hospitals: '/admin/hospitals',
    hospital: (id: string) => `/admin/hospitals/${id}`,
    hospitalDocuments: (id: string) => `/admin/hospitals/${id}/documents`,

    doctors: '/admin/doctors',
    doctor: (id: string) => `/admin/doctors/${id}`,

    patients: '/admin/patients',
    patient: (id: string) => `/admin/patients/${id}`,

    users: '/admin/users',
    user: (id: string) => `/admin/users/${id}`,

    // Operations
    appointments: '/admin/appointments',
    appointment: (id: string) => `/admin/appointments/${id}`,

    support: '/admin/support',
    ticket: (id: string) => `/admin/support/${id}`,

    // Finance
    payments: '/admin/payments',
    payment: (id: string) => `/admin/payments/${id}`,
    refunds: '/admin/refunds',
    settlements: '/admin/settlements',

    // Platform
    analytics: '/admin/analytics',
    audits: '/admin/audits',
    settings: '/admin/settings',

    // Specializations
    specializations: '/admin/specializations',
} as const;

// =============================================================================
// API Routes (for internal use)
// =============================================================================

export const apiRoutes = {
    // Auth
    login: '/auth/login/password',
    loginOTP: '/auth/login/otp',
    sendOTP: '/auth/otp/send',
    register: '/auth/register',
    refreshToken: '/auth/refresh',
    logout: '/auth/logout',
    me: '/users/me',

    // Appointments
    appointments: '/appointments',
    appointment: (id: string) => `/appointments/${id}`,

    // Doctors
    doctors: '/doctors',
    doctor: (id: string) => `/doctors/${id}`,
    doctorAvailability: (id: string) => `/doctors/${id}/availability`,

    // Hospitals
    hospitals: '/hospitals',
    hospital: (id: string) => `/hospitals/${id}`,

    // Payments
    payments: '/payments',
    createPaymentOrder: '/payments/create-order',
    verifyPayment: '/payments/verify',

    // Prescriptions
    prescriptions: '/prescriptions',

    // Health Records
    healthRecords: '/health-records',
} as const;

// =============================================================================
// Route Helpers
// =============================================================================

/**
 * Check if a route is public (doesn't require auth)
 */
export function isPublicRoute(pathname: string): boolean {
    const publicPaths = [
        '/',
        '/login',
        '/register',
        '/callback',
        '/forgot-password',
        '/reset-password',
        '/doctors',
        '/hospitals',
        '/specialties',
        '/about',
        '/contact',
        '/faqs',
        '/help',
        '/legal',
    ];

    return publicPaths.some(path =>
        pathname === path || pathname.startsWith(`${path}/`)
    );
}

/**
 * Get dashboard route based on user role
 * @param role - User role
 * @param fullUrl - If true, returns full URL with subdomain (for cross-domain redirects)
 */
export function getDashboardRoute(role: string, fullUrl: boolean = false): string {
    // Import dynamically to avoid circular deps (only when needed)
    if (fullUrl) {
        const { getDashboardUrl, isSubdomainEnabled } = require('./subdomains');
        if (isSubdomainEnabled()) {
            return getDashboardUrl(role);
        }
    }

    // Return path-based route
    switch (role) {
        case 'patient':
            return patientRoutes.dashboard;
        case 'doctor':
            return doctorRoutes.dashboard;
        case 'hospital':
            return hospitalRoutes.dashboard;
        case 'reception':
            return receptionRoutes.dashboard;
        case 'pharmacy':
            return pharmacyRoutes.dashboard;
        case 'admin':
            return adminRoutes.dashboard;
        default:
            return '/';
    }
}

/**
 * Get route prefix based on role
 */
export function getRoutePrefix(role: string): string {
    switch (role) {
        case 'patient':
            return '/patient';
        case 'doctor':
            return '/doctor';
        case 'hospital':
            return '/hospital';
        case 'reception':
            return '/reception';
        case 'pharmacy':
            return '/pharmacy';
        case 'admin':
            return '/admin';
        default:
            return '';
    }
}

// =============================================================================
// Combined Routes Export
// =============================================================================

export const routes = {
    public: publicRoutes,
    patient: patientRoutes,
    doctor: doctorRoutes,
    hospital: hospitalRoutes,
    reception: receptionRoutes,
    pharmacy: pharmacyRoutes,
    admin: adminRoutes,
    api: apiRoutes,
    isPublic: isPublicRoute,
    getDashboard: getDashboardRoute,
    getPrefix: getRoutePrefix,
} as const;

export default routes;

