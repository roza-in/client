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
    me: '/users/me',
    googleCallback: '/auth/google/callback',
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
    lockSlot: '/appointments/lock-slot',
    feeBreakdown: '/appointments/fee-breakdown',
  },

  // Prescriptions
  prescriptions: {
    list: '/prescriptions',
    my: '/prescriptions/my',
    create: '/prescriptions',
    get: (id: string) => `/prescriptions/${id}`,
    pdf: (id: string) => `/prescriptions/${id}/pdf`,
    send: (id: string) => `/prescriptions/${id}/send`,
  },

  // Payments
  payments: {
    list: '/payments',
    get: (id: string) => `/payments/${id}`,
    createOrder: '/payments/create-order',
    verify: '/payments/verify',
    refund: '/payments/refund',
  },

  // Health Records
  healthRecords: {
    list: '/health-records/documents',
    upload: '/health-records/documents',
    get: (id: string) => `/health-records/documents/${id}`,
    delete: (id: string) => `/health-records/documents/${id}`,
  },

  // Vitals
  vitals: {
    list: '/patient-vitals',
    create: '/patient-vitals',
    get: (id: string) => `/patient-vitals/${id}`,
    latest: '/patient-vitals/latest',
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
    tickets: '/support/tickets',
    createTicket: '/support/tickets',
    ticket: (id: string) => `/support/tickets/${id}`,
    messages: (id: string) => `/support/tickets/${id}/messages`,
  },

  // Specializations
  specializations: {
    list: '/specializations',
    get: (id: string) => `/specializations/${id}`,
  },

  // Search
  search: {
    doctors: '/search/doctors',
    hospitals: '/search/hospitals',
    global: '/search',
  },

  // Upload
  upload: {
    image: '/upload/image',
    document: '/upload/document',
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
