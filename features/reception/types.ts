/**
 * Reception Feature Types
 */

export interface QueueAppointment {
    id: string;
    appointmentNumber: string;
    patient: {
        id: string;
        name: string;
        phone: string | null;
        avatarUrl: string | null;
    };
    doctor: {
        id: string;
        name: string;
        specialization: string;
    };
    scheduledStart: string;
    scheduledEnd: string;
    status: string;
    consultationType: string;
    checkedInAt: string | null;
    walkInToken?: string | null;
    consultationFee?: number;
    paymentCollectedAt?: string | null;
}

export interface CheckInWithPaymentInput {
    appointmentId: string;
    amount: number;
    method: 'cash' | 'card';
}

export interface CheckInWithPaymentResponse {
    appointment: QueueAppointment;
    payment: any;
}

export interface QueueStats {
    total: number;
    confirmed: number;
    checkedIn: number;
    inProgress: number;
    completed: number;
    noShow: number;
    cancelled: number;
}

export interface QueueResponse {
    appointments: QueueAppointment[];
    stats: QueueStats;
}

export interface WalkInBookingInput {
    doctorId: string;
    slotId?: string;
    scheduledDate: string;
    scheduledStart: string;
    patient: {
        id?: string;
        name: string;
        phone: string;
        email?: string;
        dateOfBirth?: string;
        gender?: 'male' | 'female' | 'other';
    };
    consultationFee: number;
    paymentMethod: 'cash';
    notes?: string;
}

export interface WalkInBookingResponse {
    appointment: QueueAppointment;
    payment: any;
}

export interface PatientSearchResult {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    avatarUrl: string | null;
    lastVisit: string | null;
    totalVisits: number;
}
