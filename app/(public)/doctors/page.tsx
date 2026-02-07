import { Metadata } from 'next';
import { DoctorsView } from '@/components/doctors/doctors-view';
import { fetchDoctors, fetchSpecializations } from '@/lib/api/public';

// =============================================================================
// Dynamic Metadata for SEO
// =============================================================================

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = await searchParams;
    const specialty = params.specialty as string | undefined;
    const city = params.city as string | undefined;

    let title = 'Find Doctors | Book Appointments Online | ROZX Healthcare';
    let description = 'Find and book appointments with top doctors near you. Video consultations and in-person visits available. 10,000+ verified doctors.';

    if (specialty) {
        const formattedSpecialty = specialty.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        title = `Best ${formattedSpecialty} Doctors | Book Online | ROZX Healthcare`;
        description = `Find top-rated ${formattedSpecialty} doctors near you. Book instant appointments for video or in-person consultations. Verified specialists with transparent reviews.`;
    }

    if (city) {
        const formattedCity = city.replace(/\b\w/g, l => l.toUpperCase());
        title = specialty
            ? `Best ${specialty.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Doctors in ${formattedCity} | ROZX`
            : `Doctors in ${formattedCity} | Book Appointments Online | ROZX`;
        description = `Find the best doctors in ${formattedCity}. Book appointments online with verified specialists. Video & in-person consultations available.`;
    }

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            siteName: 'ROZX Healthcare',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function DoctorsPage({ searchParams }: PageProps) {
    const params = await searchParams;

    // Build filters from search params
    const filters = {
        page: params.page ? Number(params.page) : 1,
        limit: 12,
        specialization: params.specialty as string | undefined,
        city: params.city as string | undefined,
        search: params.search as string | undefined,
        consultation_type: params.type as 'online' | 'in_person' | undefined,
        min_experience: params.experience ? Number(params.experience) : undefined,
        max_fee: params.maxFee ? Number(params.maxFee) : undefined,
        sort_by: params.sortBy as string | undefined,
        available_today: params.availableToday === 'true',
        gender: params.gender as string | undefined,
    };

    // Fetch data from API (server-side)
    const [doctorsResponse, specializations] = await Promise.all([
        fetchDoctors(filters as any),
        fetchSpecializations(),
    ]);

    return (
        <div className="container py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Find Doctors</h1>
                <p className="mt-2 text-muted-foreground">
                    Book appointments with verified doctors for video or in-person consultations
                </p>
            </div>

            <DoctorsView
                specializations={specializations as any}
                initialDoctors={doctorsResponse.data as any}
                initialFilters={{
                    specialty: params.specialty as string,
                    gender: params.gender as string,
                    type: params.type as string,
                    experience: params.experience ? Number(params.experience) : undefined,
                    maxFee: params.maxFee ? Number(params.maxFee) : undefined,
                    sortBy: params.sortBy as string,
                    availableToday: params.availableToday === 'true',
                    search: params.search as string,
                }}
                totalPages={doctorsResponse.meta.totalPages}
                currentPage={doctorsResponse.meta.page}
                totalDoctors={doctorsResponse.meta.total}
            />
        </div>
    );
}
