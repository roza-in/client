/**
 * ROZX Healthcare Platform - API Exports
 * Central export file for all API modules
 */

// Re-export API client and utilities from config
export {
  api,
  ApiError,
  type ApiResponse,
  type PaginationMeta,
  type PaginatedResponse,
  type RequestOptions,
  setTokenStorage,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
  buildQueryParams,
} from '@/config/api';

// Auth API
export {
  sendOTP,
  verifyOTP,
  googleOAuth,
  registerPatient,
  registerHospital,
  refreshToken,
  getMe,
  logout,
  isAuthenticated,
  authApi,
} from './auth';

// Hospital API
export {
  listHospitals,
  getHospital,
  updateHospital,
  getHospitalStats,
  addDoctorToHospital,
  verifyHospital,
  getHospitalOptions,
  getNearbyHospitals,
  hospitalApi,
} from './hospital';

// Doctor API
export {
  listDoctors,
  getDoctor,
  getDoctorStats,
  getDoctorAvailability,
  getDoctorSchedules,
  getSpecializations,
  searchDoctors,
  getDoctorsByHospital,
  getTopRatedDoctors,
  getDoctorsAvailableToday,
  doctorApi,
} from './doctor';

// Appointment API
export {
  listAppointments,
  getAppointment,
  createAppointment,
  cancelAppointment,
  rescheduleAppointment,
  rateAppointment,
  getAppointmentRating,
  updateAppointmentRating,
  getUpcomingAppointments,
  getPastAppointments,
  getDoctorAppointments,
  getPatientAppointments,
  checkSlotAvailability,
  appointmentApi,
} from './appointment';

// Schedule API
export {
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getScheduleOverrides,
  createScheduleOverride,
  updateScheduleOverride,
  deleteScheduleOverride,
  createWeeklySchedule,
  copyDoctorSchedule,
  toggleScheduleStatus,
  blockTimeRange,
  getAvailableDates,
  scheduleApi,
  type ScheduleSlot,
  type CreateScheduleInput,
  type UpdateScheduleInput,
  type CreateOverrideInput,
} from './schedule';

// Payment API
export {
  createPaymentOrder,
  verifyPayment,
  getPayment,
  listPayments,
  requestRefund,
  getRefundStatus,
  getPaymentStats,
  getPaymentByAppointment,
  getPatientPayments,
  getHospitalPayments,
  getRecentPayments,
  getPendingPayments,
  calculateServiceFee,
  calculateTotalWithFee,
  formatCurrency,
  paymentApi,
  type PaymentOrderResponse,
  type PaymentVerificationData,
} from './payment';

// Health Records API
export {
  // Family Members
  listFamilyMembers,
  getFamilyMember,
  getFamilyMemberWithHealth,
  createFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  familyApi,
  type CreateFamilyMemberInput,
  type UpdateFamilyMemberInput,
  // Health Documents
  listHealthDocuments,
  getHealthDocument,
  uploadHealthDocument,
  updateHealthDocument,
  deleteHealthDocument,
  getDocumentDownloadUrl,
  documentsApi,
  type HealthDocumentFilters,
  type UploadDocumentInput,
  // Vital Records
  listVitalRecords,
  getVitalRecord,
  createVitalRecord,
  updateVitalRecord,
  deleteVitalRecord,
  getLatestVital,
  getVitalTrends,
  vitalsApi,
  type CreateVitalRecordInput,
  type VitalRecordFilters,
  // Medications
  listMedications,
  getMedication,
  createMedication,
  updateMedication,
  deleteMedication,
  getActiveMedications,
  stopMedication,
  medicationsApi,
  type CreateMedicationInput,
  type MedicationFilters,
  // Allergies
  listAllergies,
  getAllergy,
  createAllergy,
  updateAllergy,
  deleteAllergy,
  getActiveAllergies,
  getSevereAllergies,
  allergiesApi,
  type CreateAllergyInput,
  type AllergyFilters,
  // Health Summary
  getHealthSummary,
  getCompleteHealthRecord,
  healthApi,
  type HealthSummary,
} from './health';

// Consultation API
export {
  startConsultation,
  endConsultation,
  getConsultation,
  listConsultations,
  getVideoToken,
  joinVideoConsultation,
  leaveVideoConsultation,
  updateConsultationNotes,
  createPrescription,
  getPrescription,
  updatePrescription,
  getConsultationPrescriptions,
  getPatientPrescriptions,
  downloadPrescription,
  sendPrescriptionToEmail,
  verifyPrescription,
  getActiveConsultation,
  isConsultationJoinable,
  getConsultationDuration,
  consultationApi,
  prescriptionApi,
  type ConsultationFilters,
  type StartConsultationInput,
  type EndConsultationInput,
  type CreatePrescriptionInput,
} from './consultation';

// Notification API
export {
  listNotifications,
  getNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount,
  getRecentNotifications,
  getPreferences,
  updatePreferences,
  resetPreferences,
  registerDevice,
  unregisterDevice,
  listDevices,
  testPushNotification,
  sendNotification,
  sendBulkNotifications,
  sendBroadcast,
  subscribeToNotifications,
  requestBrowserPermission,
  showBrowserNotification,
  notificationApi,
  preferencesApi,
  devicesApi,
  type NotificationFilters,
  type SendNotificationInput,
  type BulkNotificationInput,
  type RegisterDeviceInput,
} from './notification';

// Admin API
export {
  getDashboardStats,
  getRevenueStats,
  getUserGrowthStats,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
  banUser,
  unbanUser,
  listPendingVerifications,
  requestDocuments,
  listTickets,
  getTicket,
  createTicket,
  updateTicket,
  addTicketReply,
  closeTicket,
  listAuditLogs,
  getAuditLog,
  getSettings,
  getSetting,
  updateSetting,
  resetSetting,
  generateReport,
  getScheduledReports,
  adminApi,
  usersApi,
  verificationApi,
  ticketsApi,
  auditLogsApi,
  settingsApi,
  reportsApi,
  type DashboardStats,
  type UserFilters,
  type VerificationFilters,
  type TicketFilters,
  type CreateTicketInput,
  type AuditLogFilters,
} from './admin';

/**
 * Combined API object for convenient access
 */
import { authApi as _authApi } from './auth';
import { hospitalApi as _hospitalApi } from './hospital';
import { doctorApi as _doctorApi } from './doctor';
import { appointmentApi as _appointmentApi } from './appointment';
import { scheduleApi as _scheduleApi } from './schedule';
import { paymentApi as _paymentApi } from './payment';
import { healthApi as _healthApi } from './health';
import { consultationApi as _consultationApi } from './consultation';
import { notificationApi as _notificationApi } from './notification';
import { adminApi as _adminApi } from './admin';

export const rozxApi = {
  auth: _authApi,
  hospitals: _hospitalApi,
  doctors: _doctorApi,
  appointments: _appointmentApi,
  schedules: _scheduleApi,
  payments: _paymentApi,
  health: _healthApi,
  consultations: _consultationApi,
  notifications: _notificationApi,
  admin: _adminApi,
};

export default rozxApi;
