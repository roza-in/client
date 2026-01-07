/**
 * ROZX Healthcare Platform - Health Records Types
 * Family members, documents, vitals, medications, allergies
 */

import type {
  Gender,
  BloodGroup,
  RelationshipType,
  DocumentType,
  MedicationFrequency,
  MedicationTiming,
  MedicationReminderStatus,
  AllergyType,
  AllergySeverity,
  VitalSource,
  TemperatureUnit,
  WeightUnit,
  HeightUnit,
  BloodSugarType,
  ConditionType,
} from './enums';

// ============================================================================
// Family Member Types
// ============================================================================

export interface FamilyMember {
  id: string;
  userId: string;
  fullName: string;
  relationship: RelationshipType;
  gender: Gender | null;
  dateOfBirth: string | null;
  bloodGroup: BloodGroup | null;
  phone: string | null;
  email: string | null;
  avatarUrl: string | null;
  allergies: string[] | null;
  chronicConditions: string[] | null;
  emergencyContact: boolean;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMemberWithHealth extends FamilyMember {
  latestVitals?: VitalRecord | null;
  activeMedications?: Medication[];
  upcomingReminders?: MedicationReminder[];
  recentDocuments?: HealthDocument[];
  allergyRecords?: Allergy[];
}

export interface CreateFamilyMemberInput {
  fullName: string;
  relationship: RelationshipType;
  gender?: Gender;
  dateOfBirth?: string;
  bloodGroup?: BloodGroup;
  phone?: string;
  email?: string;
  allergies?: string[];
  chronicConditions?: string[];
  emergencyContact?: boolean;
}

export interface UpdateFamilyMemberInput {
  fullName?: string;
  relationship?: RelationshipType;
  gender?: Gender;
  dateOfBirth?: string;
  bloodGroup?: BloodGroup;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  allergies?: string[];
  chronicConditions?: string[];
  emergencyContact?: boolean;
}

// ============================================================================
// Health Document Types
// ============================================================================

export interface HealthDocument {
  id: string;
  userId: string;
  familyMemberId: string | null;
  appointmentId: string | null;
  documentType: DocumentType;
  title: string;
  description: string | null;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  tags: string[] | null;
  metadata: Record<string, unknown> | null;
  isSharedWithDoctors: boolean;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentWithDetails extends HealthDocument {
  familyMember?: {
    id: string;
    fullName: string;
  } | null;
  appointment?: {
    id: string;
    bookingId: string;
    appointmentDate: string;
    doctorName: string | null;
  } | null;
}

export interface UploadDocumentInput {
  familyMemberId?: string;
  appointmentId?: string;
  documentType: DocumentType;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  tags?: string[];
  isSharedWithDoctors?: boolean;
}

export interface UpdateDocumentInput {
  documentType?: DocumentType;
  title?: string;
  description?: string;
  tags?: string[];
  isSharedWithDoctors?: boolean;
}

export interface DocumentFilters {
  familyMemberId?: string;
  appointmentId?: string;
  documentType?: DocumentType | DocumentType[];
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ============================================================================
// Vital Records Types
// ============================================================================

export interface VitalRecord {
  id: string;
  userId: string;
  familyMemberId: string | null;
  recordedAt: string;
  // Basic vitals
  bloodPressureSystolic: number | null;
  bloodPressureDiastolic: number | null;
  heartRate: number | null;
  temperature: number | null;
  temperatureUnit: TemperatureUnit;
  respiratoryRate: number | null;
  oxygenSaturation: number | null;
  // Body measurements
  weight: number | null;
  weightUnit: WeightUnit;
  height: number | null;
  heightUnit: HeightUnit;
  bmi: number | null;
  // Blood sugar
  bloodSugar: number | null;
  bloodSugarType: BloodSugarType | null;
  // Additional
  notes: string | null;
  source: VitalSource;
  deviceId: string | null;
  createdAt: string;
}

export interface CreateVitalRecordInput {
  familyMemberId?: string;
  recordedAt?: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  temperatureUnit?: TemperatureUnit;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  weightUnit?: WeightUnit;
  height?: number;
  heightUnit?: HeightUnit;
  bloodSugar?: number;
  bloodSugarType?: BloodSugarType;
  notes?: string;
  source?: VitalSource;
}

export interface VitalFilters {
  familyMemberId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface VitalTrends {
  period: string;
  avgSystolic: number | null;
  avgDiastolic: number | null;
  avgHeartRate: number | null;
  avgWeight: number | null;
  avgBloodSugar: number | null;
  recordsCount: number;
}

// ============================================================================
// Medication Types
// ============================================================================

export interface Medication {
  id: string;
  userId: string;
  familyMemberId: string | null;
  prescriptionId: string | null;
  name: string;
  genericName: string | null;
  dosage: string;
  dosageUnit: string;
  frequency: MedicationFrequency;
  timing: MedicationTiming[];
  durationDays: number | null;
  startDate: string;
  endDate: string | null;
  instructions: string | null;
  isActive: boolean;
  prescribedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationWithReminders extends Medication {
  reminders: MedicationReminder[];
  adherenceRate?: number;
  missedDoses?: number;
}

export interface CreateMedicationInput {
  familyMemberId?: string;
  prescriptionId?: string;
  name: string;
  genericName?: string;
  dosage: string;
  dosageUnit: string;
  frequency: MedicationFrequency;
  timing: MedicationTiming[];
  durationDays?: number;
  startDate: string;
  endDate?: string;
  instructions?: string;
  prescribedBy?: string;
  createReminders?: boolean;
}

export interface UpdateMedicationInput {
  name?: string;
  genericName?: string;
  dosage?: string;
  dosageUnit?: string;
  frequency?: MedicationFrequency;
  timing?: MedicationTiming[];
  durationDays?: number;
  endDate?: string;
  instructions?: string;
  isActive?: boolean;
}

export interface MedicationFilters {
  familyMemberId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// ============================================================================
// Medication Reminder Types
// ============================================================================

export interface MedicationReminder {
  id: string;
  medicationId: string;
  userId: string;
  familyMemberId: string | null;
  scheduledTime: string;
  status: MedicationReminderStatus;
  takenAt: string | null;
  skippedReason: string | null;
  notes: string | null;
  createdAt: string;
  medication?: {
    name: string;
    dosage: string;
  };
}

export interface ReminderAction {
  reminderId: string;
  action: 'take' | 'skip';
  notes?: string;
  skippedReason?: string;
}

export interface ReminderFilters {
  familyMemberId?: string;
  medicationId?: string;
  status?: MedicationReminderStatus;
  date: string;
}

// ============================================================================
// Allergy Types
// ============================================================================

export interface Allergy {
  id: string;
  userId: string;
  familyMemberId: string | null;
  allergen: string;
  allergyType: AllergyType;
  severity: AllergySeverity;
  reaction: string | null;
  diagnosedDate: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateAllergyInput {
  familyMemberId?: string;
  allergen: string;
  allergyType: AllergyType;
  severity: AllergySeverity;
  reaction?: string;
  diagnosedDate?: string;
  notes?: string;
}

export interface UpdateAllergyInput {
  allergen?: string;
  allergyType?: AllergyType;
  severity?: AllergySeverity;
  reaction?: string;
  diagnosedDate?: string;
  notes?: string;
  isActive?: boolean;
}

// ============================================================================
// Medical History Types
// ============================================================================

export interface MedicalCondition {
  id: string;
  userId: string;
  familyMemberId: string | null;
  conditionName: string;
  conditionType: ConditionType;
  diagnosedDate: string | null;
  resolvedDate: string | null;
  treatingDoctor: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Surgery {
  id: string;
  userId: string;
  familyMemberId: string | null;
  procedureName: string;
  surgeryDate: string;
  hospitalName: string | null;
  surgeonName: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateMedicalConditionInput {
  familyMemberId?: string;
  conditionName: string;
  conditionType: ConditionType;
  diagnosedDate?: string;
  treatingDoctor?: string;
  notes?: string;
}

export interface CreateSurgeryInput {
  familyMemberId?: string;
  procedureName: string;
  surgeryDate: string;
  hospitalName?: string;
  surgeonName?: string;
  notes?: string;
}

// ============================================================================
// Health Summary Types
// ============================================================================

export interface HealthSummary {
  user: {
    id: string;
    fullName: string | null;
    dateOfBirth: string | null;
    bloodGroup: BloodGroup | null;
  };
  familyMembers: FamilyMember[];
  latestVitals: VitalRecord | null;
  activeMedications: Medication[];
  allergies: Allergy[];
  chronicConditions: MedicalCondition[];
  recentDocuments: HealthDocument[];
  upcomingReminders: MedicationReminder[];
}

export interface FamilyHealthSummary {
  member: FamilyMember;
  latestVitals: VitalRecord | null;
  activeMedications: Medication[];
  allergies: Allergy[];
  conditions: MedicalCondition[];
  upcomingReminders: MedicationReminder[];
}
