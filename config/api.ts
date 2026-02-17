import { env } from './env';

// API Base URLs
export const apiConfig = {
  baseUrl: env.apiUrl,
  timeout: env.apiTimeout,

  // Retry configuration
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
    retryOn: [408, 429, 500, 502, 503, 504],
  },

  // Rate limiting
  rateLimit: {
    maxRequestsPerSecond: 10,
  },
} as const;

// API Endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login/password',
    loginOTP: '/auth/login/otp',
    sendOTP: '/auth/otp/send',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
    requestPasswordReset: '/auth/password/request-reset',
    resetPassword: '/auth/password/reset',
    googleUrl: '/auth/google/url',
    googleCallback: '/auth/google/callback',
    csrfToken: '/auth/csrf-token',
  },

  // Users
  users: {
    me: '/users/me',
    profile: '/users/me/profile',
    updateProfile: '/users/me/profile',
    changePassword: '/users/me/password',
    deleteAccount: '/users/me',
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
    get: (id: string) => `/doctors/${id}`,
    availability: (id: string) => `/doctors/${id}/availability`,
    schedule: (id: string) => `/doctors/${id}/schedule`,
    reviews: (id: string) => `/doctors/${id}/reviews`,
  },

  // Hospitals
  hospitals: {
    list: '/hospitals',
    get: (id: string) => `/hospitals/${id}`,
    doctors: (id: string) => `/hospitals/${id}/doctors`,
    specialties: (id: string) => `/hospitals/${id}/specialties`,
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
    feeBreakdown: '/appointments/fee-breakdown',
  },

  // Prescriptions
  prescriptions: {
    list: '/prescriptions',
    my: '/prescriptions/my',
    create: '/prescriptions',
    get: (id: string) => `/prescriptions/${id}`,
  },

  // Payments
  payments: {
    list: '/payments',
    get: (id: string) => `/payments/${id}`,
    createOrder: '/payments/create-order',
    verify: '/payments/verify',
    refund: (id: string) => `/payments/${id}/refund`,
  },

  // Health Records
  healthRecords: {
    documents: '/health-records/documents',
    uploadDocument: '/health-records/documents',
    document: (id: string) => `/health-records/documents/${id}`,
    summary: '/health-records/summary',
    familySummary: (memberId: string) => `/health-records/family-summary/${memberId}`,
    familyMembers: '/health-records/family-members',
    familyMember: (id: string) => `/health-records/family-members/${id}`,
    allergies: '/health-records/allergies',
    allergy: (id: string) => `/health-records/allergies/${id}`,
    medications: '/health-records/medications',
    medication: (id: string) => `/health-records/medications/${id}`,
    medicationActions: (id: string) => `/health-records/medications/${id}/actions`,
    medicationReminders: '/health-records/medications/reminders',
  },

  // Vitals
  vitals: {
    list: '/health-records/vitals',
    create: '/health-records/vitals',
    get: (id: string) => `/health-records/vitals/${id}`,
    trends: '/health-records/vitals/trends',
  },

  // Notifications
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
    preferences: '/notifications/preferences',
  },

  // Support
  support: {
    tickets: '/support',
    createTicket: '/support',
    myTickets: '/support/my',
    stats: '/support/stats',
    ticket: (id: string) => `/support/${id}`,
    reply: (id: string) => `/support/${id}/reply`,
    rate: (id: string) => `/support/${id}/rate`,
    resolve: (id: string) => `/support/${id}/resolve`,
    close: (id: string) => `/support/${id}/close`,
  },

  // Pharmacy
  pharmacy: {
    medicines: '/pharmacy/medicines',
    medicine: (id: string) => `/pharmacy/medicines/${id}`,
    orders: '/pharmacy/orders',
    order: (id: string) => `/pharmacy/orders/${id}`,
    orderByNumber: (num: string) => `/pharmacy/orders/number/${num}`,
    cancelOrder: (id: string) => `/pharmacy/orders/${id}/cancel`,
    confirmOrder: (id: string) => `/pharmacy/orders/${id}/confirm`,
    updateOrderStatus: (id: string) => `/pharmacy/orders/${id}/status`,
    orderStats: '/pharmacy/orders/stats',
    hospitalOrders: (hospitalId: string) => `/pharmacy/orders/hospital/${hospitalId}`,
    hospitalOrderStats: (hospitalId: string) => `/pharmacy/orders/hospital/${hospitalId}/stats`,
    returns: '/pharmacy/returns',
    allReturns: '/pharmacy/returns/all',
    returnStats: '/pharmacy/returns/stats',
    returnItem: (id: string) => `/pharmacy/returns/${id}`,
    returnByNumber: (num: string) => `/pharmacy/returns/number/${num}`,
    createReturn: (orderId: string) => `/pharmacy/returns/${orderId}`,
    reviewReturn: (id: string) => `/pharmacy/returns/${id}/review`,
    pickupComplete: (id: string) => `/pharmacy/returns/${id}/pickup-complete`,
    settlements: '/pharmacy/settlements',
    mySettlements: '/pharmacy/settlements/my',
    settlementStats: '/pharmacy/settlements/stats',
    settlement: (id: string) => `/pharmacy/settlements/${id}`,
    processSettlement: (id: string) => `/pharmacy/settlements/${id}/process`,
    completeSettlement: (id: string) => `/pharmacy/settlements/${id}/complete`,
  },

  // Settlements (platform-level)
  settlements: {
    list: '/settlements',
    create: '/settlements',
    my: '/settlements/my',
    stats: '/settlements/stats',
    get: (id: string) => `/settlements/${id}`,
    approve: (id: string) => `/settlements/${id}/approve`,
    initiate: (id: string) => `/settlements/${id}/initiate`,
    complete: (id: string) => `/settlements/${id}/complete`,
  },

  // Ratings
  ratings: {
    list: '/ratings',
    create: '/ratings',
    get: (id: string) => `/ratings/${id}`,
    moderate: (id: string) => `/ratings/${id}/moderate`,
    doctorRatings: (doctorId: string) => `/ratings/doctors/${doctorId}`,
    doctorStats: (doctorId: string) => `/ratings/doctors/${doctorId}/stats`,
  },

  // Audit Logs (admin)
  auditLogs: {
    list: '/admin/audit-logs',
    get: (id: string) => `/admin/audit-logs/${id}`,
    stats: '/admin/audit-logs/stats',
  },

  // Announcements
  announcements: {
    public: (hospitalId: string) => `/hospitals/${hospitalId}/announcements/public`,
    active: (hospitalId: string) => `/hospitals/${hospitalId}/announcements/active`,
    list: (hospitalId: string) => `/hospitals/${hospitalId}/announcements`,
    create: (hospitalId: string) => `/hospitals/${hospitalId}/announcements`,
    update: (hospitalId: string, id: string) => `/hospitals/${hospitalId}/announcements/${id}`,
    delete: (hospitalId: string, id: string) => `/hospitals/${hospitalId}/announcements/${id}`,
  },

  // Waitlist
  waitlist: {
    join: '/appointments/waitlist',
    my: '/appointments/waitlist',
    doctor: (doctorId: string) => `/appointments/waitlist/doctor/${doctorId}`,
    cancel: (entryId: string) => `/appointments/waitlist/${entryId}`,
  },

  // Uploads
  uploads: {
    image: '/uploads/image',
    document: '/uploads/document',
  },
} as const;

// Helper Functions
export function buildApiUrl(endpoint: string): string {
  return `${apiConfig.baseUrl}${endpoint}`;
}

// Build URL with query parameters
export function buildUrlWithParams(endpoint: string, params?: Record<string, string | number | boolean | string[] | undefined | null>): string {
  const url = new URL(buildApiUrl(endpoint));

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => url.searchParams.append(key, String(v)));
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });
  }

  return url.toString();
}

// Build query params from filters object
export function buildQueryParams<T extends Record<string, unknown>>(
  filters: T
): Record<string, string | number | boolean | string[] | undefined> {
  const params: Record<string, string | number | boolean | string[] | undefined> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        params[key] = value as string[];
      } else if (typeof value === 'object') {
        // Skip nested objects
      } else {
        params[key] = value as string | number | boolean;
      }
    }
  });

  return params;
}

// Type Exports
export type ApiConfig = typeof apiConfig;
export type Endpoints = typeof endpoints;

export default apiConfig;
