/**
 * ROZX Healthcare Platform — Waitlist Feature Module
 */

// API
export {
    joinWaitlist,
    getMyWaitlistEntries,
    getWaitingPatients,
    cancelWaitlistEntry,
} from './api/waitlist-api';

// Hooks
export {
    waitlistKeys,
    useMyWaitlistEntries,
    useWaitingPatients,
    useJoinWaitlist,
    useCancelWaitlistEntry,
} from './hooks/use-waitlist';
