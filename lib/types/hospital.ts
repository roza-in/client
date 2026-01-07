/**
 * ROZX Healthcare Platform - Hospital Types
 */

import type { VerificationStatus, HospitalType, SubscriptionTier } from './enums';

// ============================================================================
// Hospital Types
// ============================================================================

export interface Hospital {
  id: string;
  userId: string;
  name: string;
  slug: string;
  legalName: string | null;
  registrationNumber: string | null;
  gstin: string | null;
  hospitalType: HospitalType;
  verificationStatus: VerificationStatus;
  email: string | null;
  phone: string;
  websiteUrl: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  brandColorPrimary: string | null;
  brandColorSecondary: string | null;
  about: string | null;
  specialties: string[] | null;
  facilities: string[] | null;
  totalBeds: number | null;
  icuBeds: number | null;
  operatingHours: Record<string, OperatingHour> | null;
  accreditations: Accreditation[] | null;
  socialMedia: SocialMedia | null;
  subscriptionTier: SubscriptionTier;
  platformFeePercentage: number;
  isFeatured: boolean;
  averageRating: number;
  totalReviews: number;
  totalConsultations: number;
  totalDoctorsActive: number;
  createdAt: string;
  updatedAt: string;
}

export interface OperatingHour {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface Accreditation {
  name: string;
  certificate: string | null;
  validTill: string | null;
}

export interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

// ============================================================================
// Hospital List & Card Types
// ============================================================================

export interface HospitalListItem {
  id: string;
  name: string;
  slug: string;
  hospitalType: HospitalType;
  city: string;
  state: string;
  logoUrl: string | null;
  specialties: string[] | null;
  averageRating: number;
  totalReviews: number;
  totalDoctorsActive: number;
  verificationStatus: VerificationStatus;
  isFeatured: boolean;
}

export interface HospitalCard {
  id: string;
  name: string;
  slug: string;
  city: string;
  logoUrl: string | null;
  specialties: string[] | null;
  averageRating: number;
  totalDoctorsActive: number;
}

// ============================================================================
// Hospital Stats Types
// ============================================================================

export interface HospitalStats {
  totalDoctors: number;
  activeDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  platformFees: number;
  netRevenue: number;
  averageRating: number;
  totalReviews: number;
}

export interface HospitalDashboardStats {
  todayAppointments: number;
  pendingAppointments: number;
  completedToday: number;
  cancelledToday: number;
  todayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  pendingSettlement: number;
  activePatients: number;
  newPatientsThisMonth: number;
}

// ============================================================================
// Hospital Filters & Input Types
// ============================================================================

export interface HospitalFilters {
  city?: string;
  state?: string;
  hospitalType?: HospitalType;
  specialty?: string;
  verified?: boolean;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'rating' | 'totalDoctors' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface CreateHospitalInput {
  name: string;
  phone: string;
  email?: string;
  hospitalType?: HospitalType;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  about?: string;
  specialties?: string[];
  facilities?: string[];
  registrationNumber?: string;
  legalName?: string;
}

export interface UpdateHospitalInput extends Partial<CreateHospitalInput> {
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  brandColorPrimary?: string | null;
  brandColorSecondary?: string | null;
  websiteUrl?: string | null;
  gstin?: string | null;
  totalBeds?: number | null;
  icuBeds?: number | null;
  operatingHours?: Record<string, OperatingHour> | null;
  accreditations?: Accreditation[] | null;
  socialMedia?: SocialMedia | null;
}

// ============================================================================
// Hospital Announcement Types
// ============================================================================

export interface HospitalAnnouncement {
  id: string;
  hospitalId: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'alert' | 'promotion';
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  type?: 'info' | 'warning' | 'alert' | 'promotion';
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// Hospital Settlement Types
// ============================================================================

export interface HospitalSettlement {
  id: string;
  hospitalId: string;
  settlementNumber: string;
  periodStart: string;
  periodEnd: string;
  grossAmount: number;
  platformFee: number;
  gatewayFee: number;
  gstAmount: number;
  netAmount: number;
  appointmentCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  bankAccountNumber: string | null;
  ifscCode: string | null;
  utrNumber: string | null;
  settledAt: string | null;
  createdAt: string;
}
