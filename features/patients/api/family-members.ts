/**
 * Patients Feature - Family Members API
 */

import { api, endpoints } from '@/lib/api';
import type { FamilyMember } from '@/types';

// =============================================================================
// Types
// =============================================================================

export interface CreateFamilyMemberInput {
    name: string;
    relationship: 'spouse' | 'child' | 'parent' | 'sibling' | 'other';
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    phone?: string;
    email?: string;
    bloodGroup?: string;
}

export interface UpdateFamilyMemberInput {
    name?: string;
    dateOfBirth?: string;
    phone?: string;
    email?: string;
    bloodGroup?: string;
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Get all family members for current user
 */
export async function getFamilyMembers(): Promise<FamilyMember[]> {
    return api.get<FamilyMember[]>(endpoints.family.list);
}

/**
 * Get a family member by ID
 */
export async function getFamilyMember(id: string): Promise<FamilyMember> {
    return api.get<FamilyMember>(endpoints.family.get(id));
}

/**
 * Create a new family member
 */
export async function createFamilyMember(input: CreateFamilyMemberInput): Promise<FamilyMember> {
    return api.post<FamilyMember>(endpoints.family.create, input);
}

/**
 * Update a family member
 */
export async function updateFamilyMember(
    id: string,
    input: UpdateFamilyMemberInput
): Promise<FamilyMember> {
    return api.patch<FamilyMember>(endpoints.family.update(id), input);
}

/**
 * Delete a family member
 */
export async function deleteFamilyMember(id: string): Promise<void> {
    await api.delete(endpoints.family.delete(id));
}
