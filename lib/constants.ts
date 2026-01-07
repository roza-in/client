/**
 * Application Constants
 */

export const APP_NAME = 'ROZX';
export const APP_DESCRIPTION = 'Digital Operating System for Indian Hospitals & Clinics';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Supabase Configuration
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// User Roles
export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  HOSPITAL: 'hospital',
  ADMIN: 'admin',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Consultation Types
export const CONSULTATION_TYPES = {
  ONLINE: 'online',
  IN_PERSON: 'in_person',
  BOTH: 'both',
} as const;

export type ConsultationType = (typeof CONSULTATION_TYPES)[keyof typeof CONSULTATION_TYPES];

// Appointment Status
export const APPOINTMENT_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  CONFIRMED: 'confirmed',
  IN_WAITING_ROOM: 'in_waiting_room',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED_BY_PATIENT: 'cancelled_by_patient',
  CANCELLED_BY_DOCTOR: 'cancelled_by_doctor',
  CANCELLED_BY_HOSPITAL: 'cancelled_by_hospital',
  NO_SHOW: 'no_show',
  RESCHEDULED: 'rescheduled',
} as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

// Verification Status
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  UNDER_REVIEW: 'under_review',
} as const;

export type VerificationStatus = (typeof VERIFICATION_STATUS)[keyof typeof VERIFICATION_STATUS];

// Days of Week
export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

// Indian States
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
] as const;

// Medical Specializations
export const MEDICAL_SPECIALIZATIONS = [
  'General Medicine',
  'Cardiology',
  'Orthopedics',
  'Pediatrics',
  'Gynecology',
  'Dermatology',
  'ENT',
  'Ophthalmology',
  'Neurology',
  'Gastroenterology',
  'Pulmonology',
  'Nephrology',
  'Oncology',
  'Psychiatry',
  'Urology',
  'Dentistry',
  'Radiology',
  'Anesthesiology',
  'Emergency Medicine',
  'Family Medicine',
] as const;

// Hospital Facilities
export const HOSPITAL_FACILITIES = [
  'ICU',
  'NICU',
  'Emergency',
  '24x7 Pharmacy',
  'Ambulance',
  'Blood Bank',
  'Radiology',
  'Laboratory',
  'Parking',
  'Cafeteria',
  'WiFi',
  'Wheelchair Access',
  'Insurance Accepted',
] as const;

// Platform Fee Structure
export const PLATFORM_FEES = {
  ONLINE_CONSULTATION: 0.07, // 7%
  IN_PERSON_PREBOOKED: 0.04, // 4%
  WALK_IN: 0.02, // 2%
  FOLLOWUP: 0.03, // 3%
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Cache Keys
export const CACHE_KEYS = {
  USER: 'user',
  HOSPITALS: 'hospitals',
  DOCTORS: 'doctors',
  APPOINTMENTS: 'appointments',
  NOTIFICATIONS: 'notifications',
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  // Hospital Routes
  HOSPITAL_PROFILE: '/hospital/profile',
  HOSPITAL_DOCTORS: '/hospital/doctors',
  HOSPITAL_SCHEDULES: '/hospital/schedules',
  HOSPITAL_APPOINTMENTS: '/hospital/appointments',
  HOSPITAL_PAYMENTS: '/hospital/payments',
  HOSPITAL_SETTINGS: '/hospital/settings',
  // Doctor Routes
  DOCTOR_TODAY: '/doctor/today',
  DOCTOR_PATIENTS: '/doctor/patients',
  DOCTOR_CONSULTATIONS: '/doctor/consultations',
  // Reception Routes
  RECEPTION_WALKINS: '/reception/walk-ins',
  RECEPTION_QUEUE: '/reception/queue',
  // Admin Routes
  ADMIN_HOSPITALS: '/admin/hospitals',
  ADMIN_AUDITS: '/admin/audits',
  ADMIN_ANALYTICS: '/admin/analytics',
} as const;
