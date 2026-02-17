/**
 * Hospital Announcements API Functions
 */
import { api } from '@/lib/api';
import type {
    Announcement,
    AnnouncementListItem,
    CreateAnnouncementInput,
    UpdateAnnouncementInput,
} from '@/types';

export async function getPublicAnnouncements(hospitalId: string) {
    return api.get<AnnouncementListItem[]>(
        `/hospitals/${hospitalId}/announcements/public`
    );
}

export async function getActiveAnnouncements(hospitalId: string) {
    return api.get<AnnouncementListItem[]>(
        `/hospitals/${hospitalId}/announcements/active`
    );
}

export async function getAnnouncements(hospitalId: string) {
    return api.get<Announcement[]>(
        `/hospitals/${hospitalId}/announcements`
    );
}

export async function createAnnouncement(hospitalId: string, input: CreateAnnouncementInput) {
    return api.post<Announcement>(
        `/hospitals/${hospitalId}/announcements`,
        input
    );
}

export async function updateAnnouncement(
    hospitalId: string,
    announcementId: string,
    input: UpdateAnnouncementInput
) {
    return api.patch<Announcement>(
        `/hospitals/${hospitalId}/announcements/${announcementId}`,
        input
    );
}

export async function deleteAnnouncement(hospitalId: string, announcementId: string) {
    return api.delete(
        `/hospitals/${hospitalId}/announcements/${announcementId}`
    );
}
