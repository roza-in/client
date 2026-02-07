/**
 * ROZX Healthcare Platform - API Endpoints
 */

// =============================================================================
// Base Endpoints
// =============================================================================

export const endpoints = {
    // Auth
    auth: {
        login: '/auth/login/password',
        loginOTP: '/auth/login/otp',
        sendOTP: '/auth/otp/send',
        validateRegistrationOTP: '/auth/otp/validate',
        registerPatient: '/auth/register/patient',
        registerHospital: '/auth/register/hospital',
        registerInitiate: '/auth/register/initiate',
        registerCompleteUser: '/auth/register/complete-user',
        registerHospitalProfile: '/auth/register/hospital-profile',
        registerHospitalCompliance: '/auth/register/hospital-compliance',
        registerHospitalAddress: '/auth/register/hospital-address',
        refresh: '/auth/refresh',
        logout: '/auth/logout',
        me: '/auth/me',
        profile: '/auth/profile',
        forgotPassword: '/auth/forgot-password',
        resetPassword: '/auth/reset-password',
        verifyEmail: '/auth/verify-email',
        googleUrl: '/auth/google/url',
        googleCallback: '/auth/google/callback',
    },

    // Users
    users: {
        me: '/users/me',
        profile: '/users/me/profile',
        updateProfile: '/users/me/profile',
        changePassword: '/users/me/password',
        preferences: '/users/me/preferences',
        notifications: '/users/me/notifications',
        sessions: '/users/me/sessions',
    },

    // Family Members
    family: {
        list: '/family-members',
        create: '/family-members',
        get: (id: string) => `/family-members/${id}`,
        update: (id: string) => `/family-members/${id}`,
        delete: (id: string) => `/family-members/${id}`,
    },

    // Doctors
    doctors: {
        list: '/doctors',
        search: '/doctors/search',
        get: (id: string) => `/doctors/${id}`,
        getBySlug: (slug: string) => `/doctors/slug/${slug}`,
        availability: (id: string) => `/doctors/${id}/availability`,
        schedule: (id: string) => `/doctors/${id}/schedule`,
        reviews: (id: string) => `/doctors/${id}/reviews`,
        stats: (id: string) => `/doctors/${id}/stats`,
        specializations: '/doctors/specializations',
    },

    // Hospitals
    hospitals: {
        list: '/hospitals',
        search: '/hospitals/search',
        get: (id: string) => `/hospitals/${id}`,
        getBySlug: (slug: string) => `/hospitals/slug/${slug}`,
        doctors: (id: string) => `/hospitals/${id}/doctors`,
        appointments: (id: string) => `/hospitals/${id}/appointments`,
        specialties: (id: string) => `/hospitals/${id}/specialties`,
        stats: (id: string) => `/hospitals/${id}/stats`,
        staff: (id: string) => `/hospitals/${id}/staff`,
        addStaff: (id: string) => `/hospitals/${id}/staff`,
        removeStaff: (id: string, staffId: string) => `/hospitals/${id}/staff/${staffId}`,
    },

    // Appointments
    appointments: {
        list: '/appointments',
        create: '/appointments',
        get: (id: string) => `/appointments/${id}`,
        cancel: (id: string) => `/appointments/${id}/cancel`,
        reschedule: (id: string) => `/appointments/${id}/reschedule`,
        checkIn: (id: string) => `/appointments/${id}/check-in`,
        complete: (id: string) => `/appointments/${id}/complete`,
        vitals: (id: string) => `/appointments/${id}/vitals`,
        checkAvailability: '/appointments/check-availability',
        lockSlot: '/appointments/lock-slot',
        unlockSlot: '/appointments/unlock-slot',
        feeBreakdown: '/appointments/fee-breakdown',
        upcoming: '/appointments/upcoming',
        history: '/appointments/history',
    },

    // Prescriptions
    prescriptions: {
        list: '/prescriptions',
        my: '/prescriptions/my',
        create: '/prescriptions',
        get: (id: string) => `/prescriptions/${id}`,
        update: (id: string) => `/prescriptions/${id}`,
        pdf: (id: string) => `/prescriptions/${id}/pdf`,
        send: (id: string) => `/prescriptions/${id}/send`,
        forAppointment: (appointmentId: string) => `/prescriptions/appointment/${appointmentId}`,
    },

    // Payments
    payments: {
        list: '/payments',
        get: (id: string) => `/payments/${id}`,
        createOrder: '/payments/create-order',
        verify: '/payments/verify',
        refund: (id: string) => `/payments/${id}/refund`,
        invoice: (id: string) => `/payments/${id}/invoice`,
        history: '/payments/history',
    },

    // Health Records
    healthRecords: {
        list: '/health-records/documents',
        upload: '/health-records/documents',
        get: (id: string) => `/health-records/documents/${id}`,
        delete: (id: string) => `/health-records/documents/${id}`,
        download: (id: string) => `/health-records/documents/${id}/download`,
    },

    // Patient Vitals
    vitals: {
        list: '/patient-vitals',
        create: '/patient-vitals',
        get: (id: string) => `/patient-vitals/${id}`,
        latest: '/patient-vitals/latest',
        history: '/patient-vitals/history',
    },

    // Notifications
    notifications: {
        list: '/notifications',
        markRead: (id: string) => `/notifications/${id}/read`,
        markAllRead: '/notifications/read-all',
        preferences: '/notifications/preferences',
        count: '/notifications/unread-count',
    },

    // Specializations
    specializations: {
        list: '/specializations',
        get: (id: string) => `/specializations/${id}`,
    },

    // Search
    search: {
        global: '/search',
        doctors: '/search/doctors',
        hospitals: '/search/hospitals',
        suggestions: '/search/suggestions',
    },

    // Upload
    upload: {
        image: '/upload/image',
        document: '/upload/document',
        avatar: '/upload/avatar',
    },

    // Admin
    admin: {
        // Dashboard
        dashboard: '/admin/dashboard',
        stats: '/admin/stats',
        analytics: '/admin/analytics/overview',
        appointmentTrends: '/admin/analytics/trends/appointments',
        revenueTrends: '/admin/analytics/trends/revenue',
        userTrends: '/admin/analytics/trends/users',

        // Hospitals
        hospitals: '/admin/hospitals',
        hospital: (id: string) => `/admin/hospitals/${id}`,
        verifyHospital: (id: string) => `/admin/hospitals/${id}/verify`,
        deleteHospital: (id: string) => `/admin/hospitals/${id}`,
        updateHospitalStatus: (id: string) => `/admin/hospitals/${id}/status`,
        rejectHospital: (id: string) => `/admin/hospitals/${id}/reject`,

        // Doctors
        doctors: '/admin/doctors',
        doctor: (id: string) => `/admin/doctors/${id}`,
        verifyDoctor: (id: string) => `/admin/doctors/${id}/verify`,
        updateDoctorStatus: (id: string) => `/admin/doctors/${id}/status`,
        rejectDoctor: (id: string) => `/admin/doctors/${id}/reject`,

        // Users
        users: '/admin/users',
        patients: '/admin/patients',
        user: (id: string) => `/admin/users/${id}`,

        // Payments & Refunds
        payments: '/admin/payments',
        refunds: '/admin/refunds',
        settlements: '/admin/settlements',

        // Platform
        platformFees: '/admin/platform-fees',
        auditLogs: '/admin/audit-logs',
    },

    // Hospital Admin
    hospitalAdmin: {
        dashboard: '/hospital/dashboard',
        doctors: '/hospital/doctors',
        doctor: (id: string) => `/hospital/doctors/${id}`,
        addDoctor: '/hospital/doctors',
        schedule: (doctorId: string) => `/hospital/doctors/${doctorId}/schedule`,
        staff: '/hospital/staff',
        appointments: '/hospital/appointments',
        revenue: '/hospital/revenue',
        settings: '/hospital/settings',
    },
    // Consultations
    consultations: {
        list: '/consultations',
        start: '/consultations/start',
        get: (id: string) => `/consultations/${id}`,
        end: (id: string) => `/consultations/${id}/end`,
        videoToken: (id: string) => `/consultations/${id}/video-token`,
        notes: (id: string) => `/consultations/${id}/notes`,
        vitals: (id: string) => `/consultations/${id}/vitals`,
        status: (id: string) => `/consultations/${id}/status`,
        join: (id: string) => `/consultations/${id}/join`,
    },
} as const;

export default endpoints;
