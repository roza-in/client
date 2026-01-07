/**
 * ROZX Healthcare Platform - Doctor Types
 */

import type {
  VerificationStatus,
  DoctorStatus,
  ConsultationType,
  PayoutModel,
  PaymentFrequency,
  DayOfWeek,
  Gender,
} from './enums';

// ============================================================================
// Doctor Types
// ============================================================================

export interface Doctor {
  id: string;
  userId: string;
  hospitalId: string;
  fullName: string;
  email: string | null;
  phone: string;
  gender: Gender | null;
  dateOfBirth: string | null;
  profilePictureUrl: string | null;
  medicalCouncilRegistration: string;
  medicalCouncilState: string;
  registrationYear: number | null;
  qualification: string;
  specialization: string;
  subSpecialization: string | null;
  experienceYears: number;
  bio: string | null;
  languagesSpoken: string[] | null;
  awards: string[] | null;
  publications: string[] | null;
  memberships: string[] | null;
  consultationDuration: number;
  consultationTypes: ConsultationType;
  feeInPerson: number | null;
  feeOnline: number | null;
  feeFollowup: number | null;
  followupValidDays: number;
  status: DoctorStatus;
  isAcceptingNewPatients: boolean;
  payoutModel: PayoutModel;
  payoutValue: number | null;
  paymentFrequency: PaymentFrequency;
  verificationStatus: VerificationStatus;
  averageRating: number;
  totalReviews: number;
  totalConsultations: number;
  totalPatientsServed: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Doctor List & Card Types
// ============================================================================

export interface DoctorListItem {
  id: string;
  fullName: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  profilePictureUrl: string | null;
  feeInPerson: number | null;
  feeOnline: number | null;
  averageRating: number;
  totalReviews: number;
  consultationTypes: ConsultationType;
  status: DoctorStatus;
  isAcceptingNewPatients: boolean;
  isAvailableToday: boolean;
  nextAvailableSlot?: string;
}

export interface DoctorCard {
  id: string;
  fullName: string;
  specialization: string;
  qualification: string;
  profilePictureUrl: string | null;
  experienceYears: number;
  feeInPerson: number | null;
  feeOnline: number | null;
  averageRating: number;
  totalReviews: number;
}

export interface DoctorWithHospital extends Doctor {
  hospital: {
    id: string;
    name: string;
    slug: string;
    city: string;
    addressLine1: string;
  };
}

// ============================================================================
// Doctor Schedule Types
// ============================================================================

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  isRecurring: boolean;
  dayOfWeek: DayOfWeek | null;
  specificDate: string | null;
  startTime: string;
  endTime: string;
  slotDuration: number;
  bufferTime: number;
  maxPatients: number | null;
  consultationType: ConsultationType;
  location: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ScheduleOverride {
  id: string;
  doctorId: string;
  overrideDate: string;
  overrideType: 'unavailable' | 'modified_hours' | 'extra_slots';
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
  createdAt: string;
}

export interface AvailableSlot {
  date: string;
  startTime: string;
  endTime: string;
  consultationType: ConsultationType;
  doctorId: string;
  isAvailable: boolean;
  slotId?: string;
}

export interface DoctorAvailability {
  date: string;
  slots: AvailableSlot[];
  isHoliday: boolean;
  holidayReason?: string;
}

// ============================================================================
// Doctor Filters & Input Types
// ============================================================================

export interface DoctorFilters {
  hospitalId?: string;
  specialization?: string;
  status?: DoctorStatus;
  consultationType?: ConsultationType;
  verified?: boolean;
  acceptingNew?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'rating' | 'experience' | 'consultations' | 'fee';
  sortOrder?: 'asc' | 'desc';
}

export interface AddDoctorInput {
  phone: string;
  fullName: string;
  email?: string;
  gender?: Gender;
  dateOfBirth?: string;
  medicalCouncilRegistration: string;
  medicalCouncilState: string;
  registrationYear?: number;
  qualification: string;
  specialization: string;
  subSpecialization?: string;
  experienceYears: number;
  bio?: string;
  languagesSpoken?: string[];
  consultationDuration?: number;
  consultationTypes?: ConsultationType;
  feeInPerson?: number;
  feeOnline?: number;
  feeFollowup?: number;
  followupValidDays?: number;
  payoutModel?: PayoutModel;
  payoutValue?: number;
  paymentFrequency?: PaymentFrequency;
}

export interface UpdateDoctorInput extends Partial<AddDoctorInput> {
  profilePictureUrl?: string | null;
  status?: DoctorStatus;
  isAcceptingNewPatients?: boolean;
  awards?: string[] | null;
  publications?: string[] | null;
  memberships?: string[] | null;
}

export interface CreateScheduleInput {
  isRecurring: boolean;
  dayOfWeek?: DayOfWeek;
  specificDate?: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  bufferTime?: number;
  maxPatients?: number;
  consultationType: ConsultationType;
  location?: string;
}

export interface CreateScheduleOverrideInput {
  overrideDate: string;
  overrideType: 'unavailable' | 'modified_hours' | 'extra_slots';
  startTime?: string;
  endTime?: string;
  reason?: string;
}

// ============================================================================
// Doctor Stats Types
// ============================================================================

export interface DoctorStats {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  totalPatients: number;
  newPatientsThisMonth: number;
  averageConsultationTime: number;
  totalEarnings: number;
  pendingPayout: number;
  averageRating: number;
  totalReviews: number;
}

export interface DoctorDashboardStats {
  todayAppointments: number;
  completedToday: number;
  upcomingToday: number;
  pendingConfirmation: number;
  weeklyAppointments: number;
  monthlyEarnings: number;
  nextPatient?: {
    appointmentId: string;
    patientName: string;
    startTime: string;
    consultationType: ConsultationType;
  };
}

// ============================================================================
// Specialization Types
// ============================================================================

export interface Specialization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}
