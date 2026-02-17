/**
 * Waitlist API Functions
 */
import { api } from '@/lib/api';
import type {
    WaitlistEntry,
    WaitlistListItem,
    JoinWaitlistInput,
} from '@/types';

const WAITLIST_BASE = '/appointments/waitlist';

export async function joinWaitlist(input: JoinWaitlistInput) {
    return api.post<WaitlistEntry>(WAITLIST_BASE, input);
}

export async function getMyWaitlistEntries() {
    return api.get<WaitlistEntry[]>(WAITLIST_BASE);
}

export async function getWaitingPatients(doctorId: string) {
    return api.get<WaitlistListItem[]>(`${WAITLIST_BASE}/doctor/${doctorId}`);
}

export async function cancelWaitlistEntry(entryId: string) {
    return api.delete<WaitlistEntry>(`${WAITLIST_BASE}/${entryId}`);
}
