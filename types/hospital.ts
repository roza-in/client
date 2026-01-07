/**
 * Hospital Types
 */

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'under_review';
export type HospitalTier = 'standard' | 'premium' | 'enterprise';

export interface Hospital {
  id: string;
  userId: string;
  name: string;
  slug: string;
  legalName: string | null;
  registrationNumber: string | null;
  gstin: string | null;
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
  subscriptionTier: HospitalTier;
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

export interface HospitalListItem {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  logoUrl: string | null;
  specialties: string[] | null;
  averageRating: number;
  totalReviews: number;
  totalDoctorsActive: number;
  verificationStatus: VerificationStatus;
}

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

export interface HospitalFilters {
  city?: string;
  state?: string;
  specialty?: string;
  verified?: boolean;
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
}

export interface UpdateHospitalInput extends Partial<CreateHospitalInput> {
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  brandColorPrimary?: string | null;
  brandColorSecondary?: string | null;
  websiteUrl?: string | null;
  operatingHours?: Record<string, OperatingHour> | null;
  accreditations?: Accreditation[] | null;
  socialMedia?: SocialMedia | null;
}
