/**
 * ROZX Healthcare Platform — Hospital Announcements Feature Module
 */

// API
export {
    getPublicAnnouncements,
    getActiveAnnouncements,
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
} from './api/announcements-api';

// Hooks
export {
    announcementKeys,
    usePublicAnnouncements,
    useActiveAnnouncements,
    useAnnouncements,
    useCreateAnnouncement,
    useUpdateAnnouncement,
    useDeleteAnnouncement,
} from './hooks/use-announcements';
