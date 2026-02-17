/**
 * Ratings API Functions
 */
import { api } from '@/lib/api';
import type {
    Rating,
    RatingListItem,
    RatingWithDetails,
    DoctorRatingStats,
    CreateRatingInput,
    ModerateRatingInput,
    RatingFilters,
} from '@/types';

const RATINGS_BASE = '/ratings';

export async function getDoctorRatings(doctorId: string, filters: RatingFilters = {}) {
    const { data, meta } = await api.getWithMeta<RatingListItem[]>(
        `${RATINGS_BASE}/doctors/${doctorId}`,
        { params: filters }
    );
    return { ratings: data, pagination: meta };
}

export async function getDoctorRatingStats(doctorId: string) {
    return api.get<DoctorRatingStats>(`${RATINGS_BASE}/doctors/${doctorId}/stats`);
}

export async function createRating(input: CreateRatingInput) {
    return api.post<Rating>(RATINGS_BASE, input);
}

export async function getAllRatings(filters: RatingFilters = {}) {
    const { data, meta } = await api.getWithMeta<RatingListItem[]>(
        RATINGS_BASE,
        { params: filters }
    );
    return { ratings: data, pagination: meta };
}

export async function getRating(id: string) {
    return api.get<RatingWithDetails>(`${RATINGS_BASE}/${id}`);
}

export async function moderateRating(id: string, input: ModerateRatingInput) {
    return api.post<Rating>(`${RATINGS_BASE}/${id}/moderate`, input);
}
