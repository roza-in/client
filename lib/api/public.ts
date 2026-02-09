/**
 * ROZX Healthcare Platform - Public API Service
 * Server-side fetch functions for public data (no authentication required)
 * Used in Server Components for SSR/ISR
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Base fetch wrapper for server-side requests
 */
async function publicFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        // Next.js 16 caching - revalidate every 5 minutes for public data
        next: { revalidate: 300 },
    });

    if (!response.ok) {
        console.error(`Public API Error: ${response.status} ${response.statusText} at ${endpoint}`);
        throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

// =============================================================================
// Types
// =============================================================================

export interface PublicDoctor {
    walk_in_enabled: any;
    id: string;
    slug?: string;
    name: string;
    email?: string;
    phone?: string;
    avatar_url?: string;
    specialization: string | {
        id: string;
        name: string;
        slug: string;
    } | null;
    qualifications: string[];
    experience_years: number;
    bio?: string;
    languages_spoken?: string[];
    // New fields from schema
    registration_number?: string;
    registration_council?: string;
    registration_year?: number;
    awards?: string[];
    publications?: string[];
    certifications?: string[];
    memberships?: string[];
    services?: string[];  // maps to available_service
    social_profiles?: {
        linkedin?: string;
        twitter?: string;
        facebook?: string;
        instagram?: string;
        website?: string;
    };
    rating: number;
    total_ratings: number;
    total_consultations: number;
    consultation_fee_online: number;
    consultation_fee_in_person: number;
    consultation_types: string[];
    online_consultation_enabled: boolean;
    hospital: {
        id: string;
        name: string;
        city?: string;
        logo_url?: string;
    };
    is_available: boolean;
    verification_status: string;
}

export interface PublicHospital {
    id: string;
    slug?: string;
    name: string;
    type: string;
    tagline?: string;
    description?: string;
    phone?: string;
    email?: string;
    website_url?: string;
    address?: string;
    landmark?: string;
    city?: string;
    state?: string;
    pincode?: string;
    logo_url?: string;
    banner_url?: string;
    cover_image_url?: string;
    rating: number;
    total_ratings: number;
    total_doctors: number;
    total_appointments: number;
    total_beds?: number;
    facilities?: string[];
    specializations?: string[];
    operating_hours?: {
        monday?: { is_open: boolean; open_time?: string; close_time?: string };
        tuesday?: { is_open: boolean; open_time?: string; close_time?: string };
        wednesday?: { is_open: boolean; open_time?: string; close_time?: string };
        thursday?: { is_open: boolean; open_time?: string; close_time?: string };
        friday?: { is_open: boolean; open_time?: string; close_time?: string };
        saturday?: { is_open: boolean; open_time?: string; close_time?: string };
        sunday?: { is_open: boolean; open_time?: string; close_time?: string };
    };
    emergency_24x7?: boolean;
    pharmacy_24x7?: boolean;
    ambulance_service?: boolean;
    is_active: boolean;
    verification_status: string;
}

export interface Specialization {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon_url?: string;
    is_active: boolean;
    display_order: number;
}

export interface DoctorFilters {
    page?: number;
    limit?: number;
    specialization?: string;
    city?: string;
    hospital_id?: string;
    search?: string;
    sort_by?: 'rating' | 'experience' | 'fee_low' | 'fee_high';
    consultation_type?: 'online' | 'in_person';
    min_experience?: number;
    max_fee?: number;
}

export interface HospitalFilters {
    page?: number;
    limit?: number;
    type?: string;
    city?: string;
    search?: string;
    sort_by?: 'rating' | 'name' | 'doctors';
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// =============================================================================
// Public API Functions
// =============================================================================

/**
 * Fetch list of doctors (public, for SSR)
 */
export async function fetchDoctors(
    filters: DoctorFilters = {}
): Promise<PaginatedResponse<PublicDoctor>> {
    const params = new URLSearchParams();

    // Always filter for active, verified doctors on public pages
    params.append('is_active', 'true');
    params.append('verification_status', 'verified');

    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.specialization) params.append('specialization', filters.specialization);
    if (filters.city) params.append('city', filters.city);
    if (filters.hospital_id) params.append('hospital_id', filters.hospital_id);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.consultation_type) params.append('consultation_type', filters.consultation_type);
    if (filters.min_experience) params.append('min_experience', String(filters.min_experience));
    if (filters.max_fee) params.append('max_fee', String(filters.max_fee));

    const queryString = params.toString();
    const endpoint = `/doctors${queryString ? `?${queryString}` : ''}`;

    try {
        return await publicFetch<PaginatedResponse<PublicDoctor>>(endpoint);
    } catch (error) {
        console.error('Failed to fetch doctors:', error);
        return { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
    }
}

/**
 * Fetch featured doctors for homepage (top rated, verified)
 */
export async function fetchFeaturedDoctors(limit: number = 8): Promise<PublicDoctor[]> {
    try {
        const response = await fetchDoctors({
            limit,
            sort_by: 'rating',
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch featured doctors:', error);
        return [];
    }
}

/**
 * Fetch single doctor by ID
 */
export async function fetchDoctor(id: string): Promise<PublicDoctor | null> {
    try {
        const response = await publicFetch<{ data: PublicDoctor }>(`/doctors/${id}/profile`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch doctor:', error);
        return null;
    }
}

/**
 * Fetch list of hospitals (public, for SSR)
 * Only fetches active and verified hospitals
 */
export async function fetchHospitals(
    filters: HospitalFilters = {}
): Promise<PaginatedResponse<PublicHospital>> {
    const params = new URLSearchParams();

    // Always filter for active, verified hospitals on public pages
    params.append('is_active', 'true');
    params.append('verification_status', 'verified');

    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.type) params.append('type', filters.type);
    if (filters.city) params.append('city', filters.city);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);

    const queryString = params.toString();
    const endpoint = `/hospitals${queryString ? `?${queryString}` : ''}`;

    try {
        return await publicFetch<PaginatedResponse<PublicHospital>>(endpoint);
    } catch (error) {
        console.error('Failed to fetch hospitals:', error);
        return { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
    }
}

/**
 * Fetch featured hospitals for homepage
 */
export async function fetchFeaturedHospitals(limit: number = 6): Promise<PublicHospital[]> {
    try {
        const response = await fetchHospitals({
            limit,
            sort_by: 'rating',
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch featured hospitals:', error);
        return [];
    }
}

/**
 * Fetch single hospital by ID
 */
export async function fetchHospital(id: string): Promise<PublicHospital | null> {
    try {
        const response = await publicFetch<{ data: PublicHospital }>(`/hospitals/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch hospital:', error);
        return null;
    }
}

/**
 * Fetch all specializations
 */
export async function fetchSpecializations(): Promise<Specialization[]> {
    try {
        const response = await publicFetch<{ data: Specialization[] }>('/doctors/specializations');
        return response.data || [];
    } catch (error) {
        console.error('Failed to fetch specializations:', error);
        return [];
    }
}
