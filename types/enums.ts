/**
 * Rozx Healthcare Platform - Global Enums
 * All enum types used across the application
 * Based on server database schema
 */

// =============================================================================
// User & Auth Enums
// =============================================================================

export type UserRole = 'patient' | 'reception' | 'doctor' | 'hospital' | 'pharmacy' | 'admin';

export type UserStatus = 'active' | 'inactive' | 'blocked' | 'deleted';

export type Gender = 'male' | 'female' | 'other';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown';

export type RelationshipType = 'self' | 'spouse' | 'parent' | 'child' | 'sibling' | 'other';

// =============================================================================
// OTP & Authentication Enums
// =============================================================================

export type OTPPurpose =
    | 'registration'
    | 'login'
    | 'password_reset'
    | 'phone_verification'
    | 'email_verification'
    | 'transaction';

export type OTPChannel = 'sms' | 'whatsapp' | 'email';

// =============================================================================
// Hospital & Doctor Enums
// =============================================================================

export type HospitalType =
    | 'multi_specialty'
    | 'single_specialty'
    | 'nursing_home'
    | 'clinic'
    | 'diagnostic_center'
    | 'medical_college'
    | 'primary_health';

export type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected' | 'suspended';

export type SubscriptionTier = 'free' | 'standard' | 'premium' | 'enterprise';

export type HospitalStaffRole = 'receptionist' | 'nurse' | 'admin' | 'billing';

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DAY_NAMES: Record<DayOfWeek, string> = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
};

// =============================================================================
// Appointment Enums
// =============================================================================

export type AppointmentStatus =
    | 'pending_payment'
    | 'confirmed'
    | 'checked_in'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'no_show'
    | 'rescheduled';

export type ConsultationType = 'in_person' | 'online' | 'phone' | 'home_visit';

export type ConsultationStatus =
    | 'scheduled'
    | 'waiting'
    | 'in_progress'
    | 'paused'
    | 'completed'
    | 'cancelled'
    | 'failed';

export type BookingSource = 'app' | 'web' | 'walk_in' | 'phone' | 'referral';

// =============================================================================
// Payment Enums
// =============================================================================

export type PaymentStatus =
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'refunded'
    | 'partially_refunded';

export type PaymentMethod = 'upi' | 'card' | 'net_banking' | 'wallet' | 'emi' | 'cash';

export type RefundType =
    | 'full'
    | 'partial_75'
    | 'partial_50'
    | 'none'
    | 'doctor_cancelled'
    | 'technical_failure';

export type RefundStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type SettlementStatus = 'pending' | 'processing' | 'completed' | 'failed';

// =============================================================================
// Health Records Enums
// =============================================================================

export type DocumentType =
    | 'prescription'
    | 'lab_report'
    | 'imaging'
    | 'medical_certificate'
    | 'discharge_summary'
    | 'insurance_document'
    | 'vaccination_record'
    | 'other';

export type VitalType =
    | 'blood_pressure'
    | 'heart_rate'
    | 'temperature'
    | 'weight'
    | 'height'
    | 'spo2'
    | 'blood_sugar'
    | 'bmi';

export type AllergyType = 'drug' | 'food' | 'environmental' | 'insect' | 'latex' | 'other';

export type AllergySeverity = 'mild' | 'moderate' | 'severe' | 'life_threatening';

// =============================================================================
// Notification Enums
// =============================================================================

export type NotificationType =
    | 'appointment_booked'
    | 'appointment_confirmed'
    | 'appointment_cancelled'
    | 'appointment_rescheduled'
    | 'appointment_reminder_24h'
    | 'appointment_reminder_1h'
    | 'appointment_check_in'
    | 'consultation_started'
    | 'consultation_ended'
    | 'waiting_room_ready'
    | 'payment_success'
    | 'payment_failed'
    | 'payment_refund_initiated'
    | 'payment_refund_completed'
    | 'prescription_ready'
    | 'medicine_reminder'
    | 'refill_reminder'
    | 'follow_up_reminder'
    | 'lab_report_ready'
    | 'welcome'
    | 'profile_verified'
    | 'profile_rejected'
    | 'password_changed'
    | 'new_doctor_available'
    | 'hospital_announcement'
    | 'promotional'
    | 'health_tip'
    | 'general';

export type NotificationChannel = 'sms' | 'whatsapp' | 'email' | 'push' | 'in_app';

export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

// =============================================================================
// Support Ticket Enums
// =============================================================================

export type TicketStatus = 'open' | 'in_progress' | 'waiting_on_customer' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketCategory =
    | 'appointment'
    | 'payment'
    | 'technical'
    | 'doctor'
    | 'hospital'
    | 'feedback'
    | 'other';

// =============================================================================
// Pharmacy / E-Commerce Enums
// =============================================================================

export type MedicineCategory =
    | 'tablet'
    | 'capsule'
    | 'syrup'
    | 'injection'
    | 'cream'
    | 'ointment'
    | 'drops'
    | 'inhaler'
    | 'powder'
    | 'gel'
    | 'spray'
    | 'patch'
    | 'suppository'
    | 'solution'
    | 'suspension'
    | 'other';

export type MedicineSchedule =
    | 'otc'
    | 'schedule_h'
    | 'schedule_h1'
    | 'schedule_x'
    | 'ayurvedic'
    | 'homeopathic';

export type PharmacyType =
    | 'hospital_pharmacy'
    | 'retail_pharmacy'
    | 'chain_pharmacy'
    | 'online_pharmacy';

export type MedicineOrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'ready_for_pickup'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled'
    | 'returned'
    | 'failed';

export type FulfillmentType =
    | 'platform_delivery'
    | 'pharmacy_pickup'
    | 'self_arrange'
    | 'hospital_pharmacy';

export type DeliveryPartnerStatus =
    | 'active'
    | 'inactive'
    | 'suspended'
    | 'pending_verification';

// =============================================================================
// Utility Constants
// =============================================================================

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
    pending_payment: 'Pending Payment',
    confirmed: 'Confirmed',
    checked_in: 'Checked In',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No Show',
    rescheduled: 'Rescheduled',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    refunded: 'Refunded',
    partially_refunded: 'Partially Refunded',
};

export const CONSULTATION_TYPE_LABELS: Record<ConsultationType, string> = {
    in_person: 'In-Person',
    online: 'Video Consultation',
    phone: 'Phone Consultation',
    home_visit: 'Home Visit',
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
    patient: 'Patient',
    reception: 'Receptionist',
    doctor: 'Doctor',
    hospital: 'Hospital Admin',
    pharmacy: 'Pharmacist',
    admin: 'Platform Admin',
};

export const GENDER_LABELS: Record<Gender, string> = {
    male: 'Male',
    female: 'Female',
    other: 'Other',
};

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
    pending: 'Pending',
    under_review: 'Under Review',
    verified: 'Verified',
    rejected: 'Rejected',
    suspended: 'Suspended',
};
