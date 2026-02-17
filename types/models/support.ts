/**
 * Rozx Healthcare Platform — Support Ticket Model Types
 */

import type {
    TicketStatus,
    TicketPriority,
    TicketCategory,
    UserRole,
} from '../enums';

// =============================================================================
// Support Ticket Entity
// =============================================================================

export interface SupportTicket {
    id: string;
    ticketNumber: string | null;
    userId: string;
    category: TicketCategory;
    priority: TicketPriority;
    subject: string;
    description: string;
    appointmentId: string | null;
    medicineOrderId: string | null;
    paymentId: string | null;
    attachments: string[] | null;
    status: TicketStatus;
    assignedTo: string | null;
    assignedAt: string | null;
    resolvedAt: string | null;
    resolvedBy: string | null;
    resolutionNotes: string | null;
    satisfactionRating: number | null;
    satisfactionFeedback: string | null;
    firstResponseAt: string | null;
    slaDueAt: string | null;
    slaBreached: boolean;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Ticket Message
// =============================================================================

export interface TicketMessage {
    id: string;
    ticketId: string;
    senderId: string;
    senderRole: UserRole;
    message: string;
    attachments: string[] | null;
    isInternal: boolean;
    createdAt: string;
}

// =============================================================================
// Support Ticket List Item
// =============================================================================

export interface SupportTicketListItem {
    id: string;
    ticketNumber: string | null;
    subject: string;
    category: TicketCategory;
    priority: TicketPriority;
    status: TicketStatus;
    userName: string;
    slaBreached: boolean;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Support Ticket with Details
// =============================================================================

export interface SupportTicketWithDetails extends SupportTicket {
    user: {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        role: UserRole;
    };
    messages: TicketMessage[];
    assignee?: {
        id: string;
        name: string;
    } | null;
}

// =============================================================================
// Support Ticket Stats
// =============================================================================

export interface SupportTicketStats {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    closedTickets: number;
    averageResolutionTimeHours: number;
    slaBreachRate: number;
}

// =============================================================================
// Input Types
// =============================================================================

export interface CreateTicketInput {
    category: TicketCategory;
    priority?: TicketPriority;
    subject: string;
    description: string;
    appointmentId?: string;
    medicineOrderId?: string;
    paymentId?: string;
    attachments?: string[];
}

export interface ReplyToTicketInput {
    message: string;
    attachments?: string[];
    isInternal?: boolean;
}

export interface UpdateTicketInput {
    status?: TicketStatus;
    priority?: TicketPriority;
    assignedTo?: string;
    resolutionNotes?: string;
}

// =============================================================================
// Filter Types
// =============================================================================

export interface TicketFilters {
    [key: string]: string | number | boolean | string[] | null | undefined;
    status?: TicketStatus | TicketStatus[];
    priority?: TicketPriority | TicketPriority[];
    category?: TicketCategory;
    assignedTo?: string;
    userId?: string;
    slaBreached?: boolean;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'updatedAt' | 'priority';
    sortOrder?: 'asc' | 'desc';
}
