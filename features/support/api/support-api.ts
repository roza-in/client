/**
 * Support Tickets API Functions
 */
import { api } from '@/lib/api';
import type {
    SupportTicket,
    SupportTicketListItem,
    SupportTicketWithDetails,
    SupportTicketStats,
    CreateTicketInput,
    ReplyToTicketInput,
    UpdateTicketInput,
    TicketFilters,
    TicketMessage,
} from '@/types';

const SUPPORT_BASE = '/support';

export async function getSupportStats() {
    return api.get<SupportTicketStats>(`${SUPPORT_BASE}/stats`);
}

export async function getMyTickets(filters: TicketFilters = {}) {
    const { data, meta } = await api.getWithMeta<SupportTicketListItem[]>(
        `${SUPPORT_BASE}/my`,
        { params: filters }
    );
    return { tickets: data, pagination: meta };
}

export async function getAllTickets(filters: TicketFilters = {}) {
    const { data, meta } = await api.getWithMeta<SupportTicketListItem[]>(
        SUPPORT_BASE,
        { params: filters }
    );
    return { tickets: data, pagination: meta };
}

export async function createTicket(input: CreateTicketInput) {
    return api.post<SupportTicket>(SUPPORT_BASE, input);
}

export async function getTicket(ticketId: string) {
    return api.get<SupportTicketWithDetails>(`${SUPPORT_BASE}/${ticketId}`);
}

export async function replyToTicket(ticketId: string, input: ReplyToTicketInput) {
    return api.post<TicketMessage>(`${SUPPORT_BASE}/${ticketId}/reply`, input);
}

export async function rateTicket(ticketId: string, input: { rating: number; feedback?: string }) {
    return api.post<SupportTicket>(`${SUPPORT_BASE}/${ticketId}/rate`, input);
}

export async function updateTicket(ticketId: string, input: UpdateTicketInput) {
    return api.patch<SupportTicket>(`${SUPPORT_BASE}/${ticketId}`, input);
}

export async function resolveTicket(ticketId: string, input: { resolutionNotes: string }) {
    return api.post<SupportTicket>(`${SUPPORT_BASE}/${ticketId}/resolve`, input);
}

export async function closeTicket(ticketId: string) {
    return api.post<SupportTicket>(`${SUPPORT_BASE}/${ticketId}/close`);
}
