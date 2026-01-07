/**
 * ROZX Healthcare Platform - Enum Types
 * Based on database migrations and server types
 */

// ============================================================================
// User & Auth Enums
// ============================================================================

export type UserRole = 'patient' | 'doctor' | 'hospital' | 'admin';

export type Gender = 'male' | 'female' | 'other';

export type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected' | 'suspended';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

// ============================================================================
// Hospital Enums
// ============================================================================

export type HospitalType =
  | 'multi_specialty'
  | 'single_specialty'
  | 'nursing_home'
  | 'clinic'
  | 'diagnostic_center'
  | 'medical_college'
  | 'primary_health';

export type SubscriptionTier = 'free' | 'standard' | 'premium' | 'enterprise';

// ============================================================================
// Doctor Enums
// ============================================================================

export type DoctorStatus = 'active' | 'on_leave' | 'inactive';

export type ConsultationType = 'in_person' | 'online' | 'phone' | 'home_visit';

export type PayoutModel = 'fixed_per_consultation' | 'percentage' | 'monthly_retainer' | 'custom';

export type PaymentFrequency = 'daily' | 'weekly' | 'monthly';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// ============================================================================
// Appointment & Consultation Enums
// ============================================================================

export type AppointmentStatus =
  | 'pending_payment'
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'waiting'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled';

export type ConsultationStatus =
  | 'scheduled'
  | 'waiting'
  | 'in_progress'
  | 'paused'
  | 'completed'
  | 'cancelled'
  | 'failed';

export type BookingSource = 'web' | 'mobile' | 'walk_in' | 'phone';

// ============================================================================
// Payment Enums
// ============================================================================

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export type PaymentMethod = 'upi' | 'card' | 'net_banking' | 'wallet' | 'emi' | 'cash';

export type PaymentGateway = 'razorpay' | 'cashfree';

export type TransactionType = 'consultation' | 'subscription' | 'refund' | 'settlement';

export type RefundType =
  | 'full'
  | 'partial_75'
  | 'partial_50'
  | 'none'
  | 'doctor_cancelled'
  | 'technical_failure';

export type RefundStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type SettlementStatus = 'pending' | 'processing' | 'completed' | 'failed';

// ============================================================================
// Notification Enums
// ============================================================================

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

export type NotificationStatus = 'pending' | 'queued' | 'sent' | 'delivered' | 'read' | 'failed';

// ============================================================================
// Health Records Enums
// ============================================================================

export type DocumentType =
  | 'prescription'
  | 'lab_report'
  | 'imaging'
  | 'medical_certificate'
  | 'discharge_summary'
  | 'insurance_document'
  | 'vaccination_record'
  | 'other';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown';

export type RelationshipType = 'self' | 'spouse' | 'parent' | 'child' | 'sibling' | 'other';

export type MedicationFrequency =
  | 'once_daily'
  | 'twice_daily'
  | 'thrice_daily'
  | 'four_times_daily'
  | 'every_4_hours'
  | 'every_6_hours'
  | 'every_8_hours'
  | 'every_12_hours'
  | 'weekly'
  | 'as_needed';

export type MedicationTiming =
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night'
  | 'before_meal'
  | 'after_meal'
  | 'with_meal'
  | 'empty_stomach'
  | 'bedtime';

export type MedicationReminderStatus = 'pending' | 'taken' | 'skipped' | 'missed';

export type AllergyType = 'food' | 'drug' | 'environmental' | 'other';

export type AllergySeverity = 'mild' | 'moderate' | 'severe';

export type VitalSource = 'manual' | 'device' | 'clinic';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export type WeightUnit = 'kg' | 'lb';

export type HeightUnit = 'cm' | 'ft';

export type BloodSugarType = 'fasting' | 'random' | 'post_meal';

export type ConditionType = 'chronic' | 'acute' | 'recurring';

// ============================================================================
// OTP & Auth Enums
// ============================================================================

export type OTPPurpose =
  | 'registration'
  | 'login'
  | 'password_reset'
  | 'phone_verification'
  | 'email_verification'
  | 'transaction';

export type OTPChannel = 'sms' | 'whatsapp' | 'email';

// ============================================================================
// Support Enums
// ============================================================================

export type TicketStatus = 'open' | 'in_progress' | 'waiting_on_customer' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketCategory = 'appointment' | 'payment' | 'technical' | 'doctor' | 'hospital' | 'feedback' | 'other';

// ============================================================================
// Audit Enums
// ============================================================================

export type AuditAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'password_change'
  | 'verification'
  | 'payment'
  | 'refund'
  | 'export';
