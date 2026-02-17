/**
 * ROZX Healthcare Platform — Support Tickets Feature Module
 */

// API
export {
    getSupportStats,
    getMyTickets,
    getAllTickets,
    createTicket,
    getTicket,
    replyToTicket,
    rateTicket,
    updateTicket,
    resolveTicket,
    closeTicket,
} from './api/support-api';

// Hooks
export {
    supportKeys,
    useSupportStats,
    useMyTickets,
    useAllTickets,
    useTicket,
    useCreateTicket,
    useReplyToTicket,
    useRateTicket,
    useUpdateTicket,
    useResolveTicket,
    useCloseTicket,
} from './hooks/use-support';
