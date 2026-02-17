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

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const DAY_NAMES: Record<DayOfWeek, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
};

export type ScheduleOverrideType = 'holiday' | 'leave' | 'emergency' | 'special_hours';

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

export type ConsultationType = 'online' | 'in_person' | 'walk_in';

export type ConsultationStatus =
    | 'scheduled'
    | 'waiting'
    | 'in_progress'
    | 'paused'
    | 'completed'
    | 'cancelled'
    | 'failed';

export type BookingSource = 'app' | 'web' | 'reception' | 'admin';

// =============================================================================
// Payment Enums
// =============================================================================

export type PaymentStatus =
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'refunded'
    | 'partially_refunded'
    | 'expired'
    | 'disputed';

export type PaymentMethod = 'upi' | 'card' | 'net_banking' | 'wallet' | 'cash';

export type PaymentType = 'consultation' | 'medicine_order' | 'platform_fee';

export type RefundReason =
    | 'patient_cancelled'
    | 'doctor_cancelled'
    | 'hospital_cancelled'
    | 'technical_failure'
    | 'policy_violation'
    | 'admin_override'
    | 'chargeback'
    | 'duplicate_payment'
    | 'service_not_rendered';

export type RefundStatus = 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';

/** Alias for RefundReason — matches server's `RefundType = RefundReason` */
export type RefundType = RefundReason;

export type SettlementStatus =
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'on_hold'
    | 'partially_paid';

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
    | 'appointment_reminder_24h'
    | 'appointment_reminder_1h'
    | 'appointment_cancelled'
    | 'appointment_rescheduled'
    | 'consultation_started'
    | 'consultation_ended'
    | 'waiting_room_ready'
    | 'payment_success'
    | 'payment_failed'
    | 'refund_initiated'
    | 'refund_completed'
    | 'prescription_ready'
    | 'medicine_order_confirmed'
    | 'medicine_dispatched'
    | 'medicine_delivered'
    | 'verification_approved'
    | 'verification_rejected'
    | 'settlement_processed'
    | 'payout_completed'
    | 'dispute_raised'
    | 'welcome'
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
    | 'refund'
    | 'medicine_order'
    | 'technical'
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
    | 'packed'
    | 'ready_for_pickup'
    | 'dispatched'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled'
    | 'returned';

export type FulfillmentType =
    | 'platform_delivery'
    | 'pharmacy_pickup'
    | 'self_arrange'
    | 'hospital_pharmacy';

export type DeliveryPartnerCode =
    | 'rozx_delivery'
    | 'dunzo'
    | 'shadowfax'
    | 'porter'
    | 'shiprocket';

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
    expired: 'Expired',
    disputed: 'Disputed',
};

export const CONSULTATION_TYPE_LABELS: Record<ConsultationType, string> = {
    online: 'Video Consultation',
    in_person: 'In-Person',
    walk_in: 'Walk-In',
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

// =============================================================================
// Financial & Settlement Enums
// =============================================================================

export type PayoutStatus =
    | 'pending'
    | 'queued'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'reversed'
    | 'cancelled';

export type PayoutMode = 'neft' | 'rtgs' | 'imps' | 'upi' | 'bank_transfer';

export type DisputeStatus = 'open' | 'under_review' | 'won' | 'lost' | 'accepted' | 'expired';

export type KycStatus = 'not_started' | 'pending' | 'submitted' | 'verified' | 'rejected' | 'expired';

export type LedgerEntryType = 'credit' | 'debit';

export type LedgerAccountType =
    | 'patient_payment'
    | 'platform_revenue'
    | 'hospital_payable'
    | 'pharmacy_payable'
    | 'gateway_fee'
    | 'gst_collected'
    | 'tds_deducted'
    | 'refund_outflow'
    | 'hold_funds';

export type ReconciliationStatus = 'pending' | 'matched' | 'mismatched' | 'resolved' | 'write_off';

export type WebhookProcessingStatus = 'received' | 'processing' | 'processed' | 'failed' | 'skipped';

export type SettlementFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';

// =============================================================================
// Audit Enums
// =============================================================================

export type AuditAction =
    | 'create'
    | 'read'
    | 'update'
    | 'delete'
    | 'login'
    | 'logout'
    | 'payment'
    | 'refund'
    | 'status_change'
    | 'verification'
    | 'payout'
    | 'settlement'
    | 'dispute';

// =============================================================================
// Waitlist Enums
// =============================================================================

export type WaitlistStatus = 'waiting' | 'notified' | 'booked' | 'expired' | 'cancelled';
