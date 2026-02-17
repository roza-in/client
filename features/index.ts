/**
 * ROZX Healthcare Platform - Features Index
 * 
 * Centralized exports for all feature modules.
 */

// Auth
export * from './auth';

// Appointments
export * from './appointments';

// Doctors
export * from './doctors';

// Hospitals
export * from './hospitals';

// Prescriptions
export * from './prescriptions';

// Patients
export * from './patients';

// Payments
export * from './payments';

// Consultations (includes video room functionality)
export * from './consultations';

// Notifications
export * from './notifications';

// Analytics
export * from './analytics';

// Admin (namespace export to avoid collisions with analytics)
export * as admin from './admin';

// Reception (namespace export to avoid collisions with auth)
export * as reception from './reception';

// Schedules (namespace export to avoid collisions with doctors)
export * as schedules from './schedules';

// Pharmacy
export * as pharmacy from './pharmacy';

// Support Tickets
export * as support from './support';

// Settlements
export * as settlements from './settlements';

// Ratings
export * as ratings from './ratings';

// Audit Logs
export * as audit from './audit';

// Health Records
export * as healthRecords from './health-records';

// Announcements
export * as announcements from './announcements';

// Waitlist
export * as waitlist from './waitlist';
