/**
 * Rozx Healthcare Platform — Hospital Announcement Model Types
 */

// =============================================================================
// Announcement Entity
// =============================================================================

export interface Announcement {
    id: string;
    hospitalId: string;
    title: string;
    content: string;
    type: AnnouncementType;
    priority: AnnouncementPriority;
    targetRoles: string[] | null;
    isActive: boolean;
    startsAt: string | null;
    expiresAt: string | null;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export type AnnouncementType = 'general' | 'maintenance' | 'emergency' | 'holiday' | 'policy' | 'event';
export type AnnouncementPriority = 'low' | 'normal' | 'high' | 'urgent';

// =============================================================================
// Announcement List Item
// =============================================================================

export interface AnnouncementListItem {
    id: string;
    title: string;
    type: AnnouncementType;
    priority: AnnouncementPriority;
    isActive: boolean;
    startsAt: string | null;
    expiresAt: string | null;
    createdAt: string;
}

// =============================================================================
// Input Types
// =============================================================================

export interface CreateAnnouncementInput {
    title: string;
    content: string;
    type: AnnouncementType;
    priority?: AnnouncementPriority;
    targetRoles?: string[];
    isActive?: boolean;
    startsAt?: string;
    expiresAt?: string;
}

export interface UpdateAnnouncementInput {
    title?: string;
    content?: string;
    type?: AnnouncementType;
    priority?: AnnouncementPriority;
    targetRoles?: string[];
    isActive?: boolean;
    startsAt?: string;
    expiresAt?: string;
}
